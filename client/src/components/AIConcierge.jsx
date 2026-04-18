import React, { useEffect, useMemo, useRef, useState } from "react";
import { aiService } from "../api/services";

const quickPrompts = [
  "Find me a beachside stay",
  "What deals are running this week?",
  "How do I manage my booking?",
  "Guide me to the owner dashboard",
];

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const initialMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm the QuickStay AI concierge. Ask me anything about rooms, bookings, or onboarding hotel owners.",
};

const AIConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isOpen]);

  const context = useMemo(
    () =>
      `Today is ${new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })}. The user is browsing QuickStay's public site.`,
    []
  );

  const sendPrompt = async (promptText) => {
    const trimmed = (promptText ?? input).trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError("");

    try {
      const payload = {
        messages: [...messagesRef.current, userMessage].map(({ role, content }) => ({
          role,
          content,
        })),
        context,
      };

      const response = await aiService.chat(payload);

      if (!response?.success) {
        throw new Error(response?.message || "AI concierge unavailable");
      }

      const reply = {
        id: createId(),
        role: "assistant",
        content:
          response?.message?.trim() ||
          "I couldn't pull that detail just now, but our support team can help at support@quickstay.com.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("AI concierge error", err);
      }
      setError("The concierge is offline right now. Please try again in a moment.");
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content:
            "I'm having trouble connecting to my brain right now. Could you retry in a few seconds or email support@quickstay.com?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-end px-3 sm:inset-auto sm:bottom-5 sm:right-5 sm:px-0">
      {isOpen && (
        <div className="pointer-events-auto mb-2 flex h-[70vh] w-full max-w-sm flex-col rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-2xl backdrop-blur sm:mb-3 sm:h-[520px] sm:w-[360px] dark:border-zinc-700 dark:bg-zinc-900/95">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">QuickStay AI</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">Concierge assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-slate-100 p-1 text-slate-500 transition hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-xl bg-slate-50/80 p-2.5 text-sm text-slate-800 dark:bg-zinc-800/80 dark:text-slate-100"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[88%] break-words whitespace-pre-wrap rounded-xl px-3 py-2 shadow-sm ${
                    msg.role === "assistant"
                      ? "bg-white text-slate-800 dark:bg-zinc-900 dark:text-slate-100"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500 dark:bg-zinc-900 dark:text-slate-200">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}

          <div className="mt-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt();
                }
              }}
              placeholder="Ask about stays, payments, or support"
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm text-slate-800 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={() => sendPrompt()}
              disabled={!input.trim() || isTyping}
              className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3.5 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendPrompt(prompt)}
                className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700 dark:text-slate-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2.5 text-white shadow-2xl"
      >
        <span className="text-base">💬</span>
        <div className="hidden text-left sm:block">
          <p className="text-xs uppercase tracking-widest text-white/80">Need help?</p>
          <p className="text-sm font-semibold">Ask QuickStay AI</p>
        </div>
      </button>
    </div>
  );
};

export default AIConcierge;
