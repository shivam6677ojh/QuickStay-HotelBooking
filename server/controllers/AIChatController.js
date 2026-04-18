import Hotel from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";

const systemPrompt = `You are QuickStay's always-on AI concierge. Help guests and hotel partners with:
- finding rooms, amenities, pricing, and policies from the public QuickStay site
- booking steps, payment flow, and account questions
- directing hotel owners and admins to the correct dashboard areas
If you are unsure of an answer, ask follow-up questions or direct the user to human support at support@quickstay.com.
When website dataset context is provided, prioritize that data over generic assumptions.`;

const DATASET_CACHE_TTL_MS = Number(process.env.AI_DATASET_CACHE_TTL_MS || 120000);
let datasetCache = {
  value: "",
  expiresAt: 0,
};

const compact = (value = "") => String(value).replace(/\s+/g, " ").trim();

const extractTopCities = (datasetContext = "") => {
  const line = String(datasetContext)
    .split("\n")
    .find((item) => item.toLowerCase().startsWith("- top cities:"));

  if (!line) return [];

  return line
    .replace(/^-\s*Top cities:\s*/i, "")
    .split(",")
    .map((city) => city.replace(/\(.*?\)/g, "").trim())
    .filter(Boolean)
    .slice(0, 5);
};

const extractSampleRooms = (datasetContext = "") => {
  const lines = String(datasetContext).split("\n");
  const startIndex = lines.findIndex((line) => line.trim().toLowerCase() === "- sample rooms:");
  if (startIndex === -1) return [];

  return lines
    .slice(startIndex + 1)
    .filter((line) => line.trim().startsWith("- "))
    .slice(0, 4)
    .map((line) => line.trim());
};

const extractLiveDeals = (datasetContext = "") => {
  const lines = String(datasetContext).split("\n");
  const startIndex = lines.findIndex((line) => line.trim().toLowerCase() === "- live deals this week:");
  if (startIndex === -1) return [];

  return lines
    .slice(startIndex + 1)
    .filter((line) => line.trim().startsWith("- "))
    .slice(0, 6)
    .map((line) => line.trim());
};

const buildWebsiteDatasetContext = async () => {
  const now = Date.now();
  if (datasetCache.value && datasetCache.expiresAt > now) {
    return datasetCache.value;
  }

  const [hotels, rooms] = await Promise.all([
    Hotel.find({})
      .select("name city address")
      .sort({ createdAt: -1 })
      .limit(250)
      .lean(),
    Room.find({ isAvailable: true })
      .select("roomType pricePerNignt capacity amenities hotel")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 })
      .limit(500)
      .lean(),
  ]);

  const cityMap = new Map();
  hotels.forEach((hotel) => {
    const cityKey = compact(hotel.city || "Unknown");
    cityMap.set(cityKey, (cityMap.get(cityKey) || 0) + 1);
  });

  const topCities = [...cityMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([city, count]) => `${city} (${count} hotels)`)
    .join(", ");

  const sampleHotels = hotels
    .slice(0, 20)
    .map((hotel) => `- ${compact(hotel.name)} | ${compact(hotel.city)} | ${compact(hotel.address)}`)
    .join("\n");

  const sampleRooms = rooms
    .slice(0, 35)
    .map((room) => {
      const hotelName = compact(room?.hotel?.name || "Unknown hotel");
      const city = compact(room?.hotel?.city || "Unknown city");
      const roomType = compact(room.roomType || "Room");
      const price = Number(room.pricePerNignt || 0);
      const capacity = Number(room.capacity || 0);
      const amenities = Array.isArray(room.amenities) ? room.amenities.slice(0, 4).join(", ") : "";
      return `- ${hotelName} (${city}) | ${roomType} | ${capacity || "N/A"} guests | ${
        Number.isFinite(price) ? `$${price}/night` : "Price unavailable"
      }${amenities ? ` | ${amenities}` : ""}`;
    })
    .join("\n");

  const liveDeals = [...rooms]
    .filter((room) => Number(room.pricePerNignt || 0) > 0)
    .sort((a, b) => Number(a.pricePerNignt || 0) - Number(b.pricePerNignt || 0))
    .slice(0, 6)
    .map((room) => {
      const hotelName = compact(room?.hotel?.name || "Unknown hotel");
      const city = compact(room?.hotel?.city || "Unknown city");
      const roomType = compact(room.roomType || "Room");
      const price = Number(room.pricePerNignt || 0);
      return `- ${hotelName} (${city}) | ${roomType} | $${price}/night`;
    })
    .join("\n");

  const datasetContext = [
    "Website dataset snapshot:",
    `- Total hotels: ${hotels.length}`,
    `- Total currently available rooms: ${rooms.length}`,
    `- Top cities: ${topCities || "No city data"}`,
    "- Sample hotels:",
    sampleHotels || "- No hotel records available",
    "- Sample rooms:",
    sampleRooms || "- No room records available",
    "- Live deals this week:",
    liveDeals || "- No active deals available right now",
  ].join("\n");

  datasetCache = {
    value: datasetContext,
    expiresAt: now + DATASET_CACHE_TTL_MS,
  };

  return datasetContext;
};

const createFallbackReply = ({ question, datasetContext }) => {
  const lowerQuestion = compact(question).toLowerCase();
  const topCities = extractTopCities(datasetContext);
  const sampleRooms = extractSampleRooms(datasetContext);
  const liveDeals = extractLiveDeals(datasetContext);

  if (lowerQuestion.includes("owner") || lowerQuestion.includes("dashboard")) {
    return "For hotel owners, sign in and open the Owner Dashboard to manage hotels, rooms, and bookings. If onboarding is pending, complete the hotel setup form first.";
  }

  if (
    lowerQuestion.includes("logged in") ||
    lowerQuestion.includes("login") ||
    lowerQuestion.includes("signed in") ||
    lowerQuestion.includes("sign in") ||
    lowerQuestion.includes("am i logged")
  ) {
    return "I cannot directly read your login session from chat. Quick check: if you see your user avatar/profile menu and can open My Bookings, you are signed in. If not, use the Sign In button in the navbar.";
  }

  if (lowerQuestion.includes("booking") || lowerQuestion.includes("cancel")) {
    return "You can manage bookings from My Bookings. To cancel, open the booking details and use the cancel option. For payment-related cancellations, check the payment status page first.";
  }

  if (lowerQuestion.includes("payment") || lowerQuestion.includes("stripe")) {
    return "QuickStay supports online payment flow and booking payment status checks. If a payment looks stuck, refresh Payment Status and verify your booking in My Bookings.";
  }

  if (lowerQuestion.includes("deal") || lowerQuestion.includes("offer") || lowerQuestion.includes("discount")) {
    if (liveDeals.length) {
      return `Here are current live deals from available inventory:\n${liveDeals.join(
        "\n"
      )}\n\nShare destination + dates and I will filter the best deal for your trip.`;
    }

    return "I could not find active deal rows right now, but I can still find lowest-price rooms if you share destination and dates.";
  }

  if (
    lowerQuestion.includes("beach") ||
    lowerQuestion.includes("beachside") ||
    lowerQuestion.includes("sea view") ||
    lowerQuestion.includes("coast")
  ) {
    const cityHint = topCities.length
      ? `Popular cities in current inventory: ${topCities.join(", ")}.`
      : "I can still help find coastal options based on your destination and dates.";

    return `${cityHint} Share check-in, check-out, and guests, and I will guide you to beach-friendly stays.`;
  }

  if (lowerQuestion.includes("room") || lowerQuestion.includes("hotel") || lowerQuestion.includes("city")) {
    if (sampleRooms.length) {
      return `Here are a few currently available options from the website dataset:\n${sampleRooms.join("\n")}\n\nTell me your dates and guest count, and I will narrow this to your best matches.`;
    }

    return `I am using QuickStay's website dataset for availability and hotel questions. Share your destination, dates, and guest count, and I will refine the options for you.`;
  }

  return `I can help with stays, bookings, payments, and owner onboarding. You asked: "${compact(
    question
  )}". Share destination, dates, and guest count for a specific recommendation.`;
};

const sanitizeMessages = (messages = []) =>
  messages
    .filter((item) => item && item.content)
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: String(item.content).slice(0, 4000),
    }))
    .slice(-12); // keep recent history only

const getTextFromGeminiResponse = (response) => {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => part?.text || "")
    .join("\n")
    .trim();
};

const callGemini = async ({ userMessages, mergedContext, timeoutMs }) => {
  const apiKey = process.env.GENIE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const transcript = userMessages
    .map((item) => `${item.role === "assistant" ? "Assistant" : "User"}: ${item.content}`)
    .join("\n");

  const prompt = [
    systemPrompt,
    mergedContext ? `Relevant context:\n${mergedContext.slice(0, 12000)}` : "",
    "Conversation:",
    transcript,
  ]
    .filter(Boolean)
    .join("\n\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: Number(process.env.AI_TEMPERATURE || 0.3),
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", response.status, errorBody);
      return null;
    }

    const data = await response.json();
    const reply = getTextFromGeminiResponse(data);
    if (!reply) return null;

    return {
      message: reply,
      source: "gemini",
      usage: data?.usageMetadata || null,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const callGroq = async ({ userMessages, mergedContext, timeoutMs }) => {
  if (!process.env.GROQ_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const groqResponse = await fetch(
      process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama3-70b-8192",
          temperature: Number(process.env.AI_TEMPERATURE || 0.3),
          messages: [
            {
              role: "system",
              content: mergedContext
                ? `${systemPrompt}\nRelevant context: ${mergedContext.slice(0, 8000)}`
                : systemPrompt,
            },
            ...userMessages,
          ],
        }),
        signal: controller.signal,
      }
    );

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorBody);
      return null;
    }

    const response = await groqResponse.json();
    const reply = response?.choices?.[0]?.message?.content?.trim();
    if (!reply) return null;

    return {
      message: reply,
      source: "groq",
      usage: response.usage || null,
    };
  } finally {
    clearTimeout(timeout);
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { messages, question, context } = req.body || {};

    const userMessages = sanitizeMessages(
      Array.isArray(messages) && messages.length
        ? messages
        : question
        ? [{ role: "user", content: question }]
        : []
    );

    if (!userMessages.length) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one message or question.",
      });
    }

    const latestQuestion = userMessages[userMessages.length - 1]?.content || question || "";
    const datasetContext = await buildWebsiteDatasetContext();
    const mergedContext = [context, datasetContext].filter(Boolean).join("\n\n");
    const timeoutMs = Number(process.env.AI_HTTP_TIMEOUT_MS || 20000);

    const geminiResult = await callGemini({ userMessages, mergedContext, timeoutMs });
    if (geminiResult) {
      return res.json({
        success: true,
        message: geminiResult.message,
        source: geminiResult.source,
        usage: geminiResult.usage,
      });
    }

    const groqResult = await callGroq({ userMessages, mergedContext, timeoutMs });
    if (groqResult) {
      return res.json({
        success: true,
        message: groqResult.message,
        source: groqResult.source,
        usage: groqResult.usage,
      });
    }

    return res.json({
      success: true,
      message: createFallbackReply({ question: latestQuestion, datasetContext }),
      source: "local-dataset-fallback",
    });
  } catch (error) {
    console.error("AI chat error:", error);
    const fallbackQuestion = req.body?.question || req.body?.messages?.[req.body?.messages?.length - 1]?.content || "";
    const safeDatasetContext = datasetCache.value || "Dataset currently unavailable.";

    return res.json({
      success: true,
      message: createFallbackReply({ question: fallbackQuestion, datasetContext: safeDatasetContext }),
      source: "local-dataset-fallback",
    });
  }
};

export default { chatWithAI };
