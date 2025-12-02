const systemPrompt = `You are QuickStay's always-on AI concierge. Help guests and hotel partners with:
- finding rooms, amenities, pricing, and policies from the public QuickStay site
- booking steps, payment flow, and account questions
- directing hotel owners and admins to the correct dashboard areas
If you are unsure of an answer, ask follow-up questions or direct the user to human support at support@quickstay.com.`;

const sanitizeMessages = (messages = []) =>
  messages
    .filter((item) => item && item.content)
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: String(item.content).slice(0, 4000),
    }))
    .slice(-12); // keep recent history only

export const chatWithAI = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI concierge is not configured on the server",
      });
    }

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
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: context
                ? `${systemPrompt}\nRelevant context: ${context}`
                : systemPrompt,
            },
            ...userMessages,
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorBody);
      return res.status(502).json({
        success: false,
        message: "AI concierge service is unavailable right now.",
      });
    }

    const response = await groqResponse.json();
    const reply = response?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("No response returned by model");
    }

    return res.json({
      success: true,
      message: reply,
      usage: response.usage || null,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return res.status(500).json({
      success: false,
      message: "We couldn't get a response right now. Please try again.",
    });
  }
};

export default { chatWithAI };
