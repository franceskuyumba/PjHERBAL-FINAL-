"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { getBotReply, botStarter } from "@/lib/chatbot";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
  handoff?: boolean;
  quickReplies?: string[];
}

let idCounter = 0;
const nextId = () => `c${++idCounter}`;

export function ChatBot() {
  const { t, lang } = useI18n();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const starterChips = useMemo(() => [
    t("live.chatbot.chipProductsPrices"),
    t("live.chatbot.chipDeliveryFees"),
    t("live.chatbot.chipPaymentOptions"),
    t("live.chatbot.chipTrackOrder"),
  ], [t]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: nextId(),
          from: "bot",
          text: t("live.chatbot.greeting"),
          quickReplies: starterChips,
        },
      ]);
    }
  }, [open, messages.length, starterChips, t]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: nextId(), from: "user", text }]);
    setTyping(true);

    // Small delay to feel like a real assistant.
    setTimeout(() => {
      const reply = getBotReply(text, lang);
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          from: "bot",
          text: reply.text,
          handoff: reply.handoff,
          quickReplies: reply.quickReplies,
        },
      ]);
      setTyping(false);
    }, 450);
  };

  const handoffUrl = buildWhatsAppUrl({
    recipient: "specialist",
    message: messages.length > 0 ? messages.filter((m) => m.from === "user").at(-1)?.text || starterChips[0] : starterChips[0],
  });

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink/[0.04] bg-white shadow-2xl sm:left-6 lg:bottom-6"
            role="dialog"
            aria-label="PJHERBAL assistant chatbot"
          >
            {/* Chat header */}
            <div className="flex items-center justify-between bg-brand-900 px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">{botStarter.title}</p>
                  <p className="text-xs text-white/55">{t("live.chatbot.subtitle")}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chatbot"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors duration-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="h-72 space-y-3 overflow-y-auto bg-surface-muted/40 p-3">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.from === "user"
                        ? "bg-brand-600 text-white shadow-soft"
                        : "bg-white text-ink/75 shadow-soft"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-white px-3.5 py-2.5 shadow-soft">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/25" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/25 [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/25 [animation-delay:240ms]" />
                  </div>
                </div>
              )}

              {messages.at(-1)?.quickReplies && (
                <div className="flex flex-wrap gap-2">
                  {messages.at(-1)!.quickReplies!.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => send(chip)}
                      className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors duration-300 hover:bg-brand-100"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {messages.at(-1)?.handoff && (
                <a
                  href={handoffUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp inline-flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" /> {t("live.chatbot.handoff")}
                </a>
              )}
            </div>

            {/* Input area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-ink/[0.04] bg-white p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("live.chatbot.placeholder")}
                className="input flex-1 rounded-full"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim() || typing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition-colors duration-300 hover:bg-brand-700 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB trigger */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant chatbot" : "Open assistant chatbot"}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.4, type: "spring", damping: 15, stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 left-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-white shadow-lift sm:left-6 lg:bottom-6"
      >
        <Bot className="h-7 w-7" />
        {!open && (
          <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-card sm:block">
            {botStarter.title}
          </span>
        )}
      </motion.button>
    </>
  );
}
