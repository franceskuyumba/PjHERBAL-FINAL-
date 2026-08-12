import { SITE, deliveryZoneFor } from "@/lib/constants";
import { t, type Locale } from "@/lib/i18n-core";

/**
 * Rule-based WhatsApp chatbot engine.
 * Answers common questions instantly with keyword matching (English + Swahili),
 * then hands off to a human specialist on WhatsApp when needed.
 */

export interface BotReply {
  text: string;
  quickReplies?: string[];
  handoff?: boolean;
}

interface Intent {
  id: string;
  keywords: string[];
}

const intents: Intent[] = [
  {
    id: "order_status",
    keywords: ["order", "order status", "agizo", "oda", "where is my", "wapi", "status ya", "imekuja"],
  },
  {
    id: "payment",
    keywords: ["pay", "payment", "m-pesa", "tigo pesa", "airtel", "lipa", "malipo", "how do i pay", "namba"],
  },
  {
    id: "delivery",
    keywords: ["delivery", "shipping", "deliver", "usafirishaji", "kifungo", "delivery fee", "nauli", "how long"],
  },
  {
    id: "products",
    keywords: ["product", "products", "buy", "supplement", "herbal", "stock", "price", "bei", "bidhaa", "dawa", "capsule"],
  },
  {
    id: "hours",
    keywords: ["hours", "open", "close", "time", "masaa", "fungua", "saa", "working"],
  },
  {
    id: "location",
    keywords: ["where", "location", "address", "visit", "mahali", "anwani", "segerea", "shop location", "maps"],
  },
  {
    id: "returns",
    keywords: ["return", "refund", "exchange", "rudi", "rudishi", "change", "damaged"],
  },
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "habari", "mambo", "jambo", "salam", "good morning", "good afternoon", "good evening", "asante"],
  },
];

const quickReplyKeys: Record<string, string[]> = {
  order_status: ["quickTrackOrder", "quickDeliveryTime"],
  payment: ["quickPaymentMethods", "quickMpesa"],
  delivery: ["quickDeliveryFees", "quickWhereDeliver"],
  products: ["quickBestSellers", "quickPrices"],
  hours: ["quickOpeningHours", "quickAddress"],
  greeting: ["chipProductsPrices", "chipDeliveryFees", "chipPaymentOptions"],
};

const quickRepliesFor = (lang: Locale, id: string): string[] =>
  (quickReplyKeys[id] || []).map((key) => t(lang, `live.chatbot.${key}`));

const repliesFor = (lang: Locale): Record<string, string> => ({
  order_status: t(lang, "live.chatbot.replyOrder"),
  payment: t(lang, "live.chatbot.replyPayment"),
  delivery: t(lang, "live.chatbot.replyDelivery").replace("{eta}", deliveryZoneFor("Dar es Salaam").eta),
  products: t(lang, "live.chatbot.replyProducts").replace("{shopUrl}", `${SITE.url}/shop`),
  hours: t(lang, "live.chatbot.replyHours").replace("{address}", SITE.address),
  location: t(lang, "live.chatbot.replyLocation").replace("{address}", SITE.address),
  returns: t(lang, "live.chatbot.replyReturns"),
  greeting: t(lang, "live.chatbot.replyGreeting").replace("{name}", SITE.name),
});

export function getBotReply(message: string, lang: Locale = "en"): BotReply {
  const text = message.toLowerCase().trim();
  const replies = repliesFor(lang);

  if (!text) {
    return { text: t(lang, "live.chatbot.replyEmpty"), quickReplies: quickRepliesFor(lang, "greeting") };
  }

  // Explicit human handoff.
  if (/(human|specialist|person|agent|mwanadamu|msaada wa kibinadamu|talk to)/.test(text)) {
    return { text: t(lang, "live.chatbot.replyHandoff"), handoff: true };
  }

  // Match the longest intent by keyword hit.
  let best: Intent | null = null;
  for (const intent of intents) {
    if (intent.keywords.some((k) => text.includes(k))) {
      if (!best || intent.keywords.length > best.keywords.length) best = intent;
    }
  }

  if (best) {
    return { text: replies[best.id], quickReplies: quickRepliesFor(lang, best.id) };
  }

  return {
    text: t(lang, "live.chatbot.replyFallback"),
    quickReplies: [
      t(lang, "live.chatbot.chipProductsPrices"),
      t(lang, "live.chatbot.chipDeliveryFees"),
      t(lang, "live.chatbot.chipPaymentOptions"),
      t(lang, "live.chatbot.quickChatSpecialist"),
    ],
  };
}

/** Sample starter chips shown when the bot opens. */
export const botStarter = {
  title: "PJHERBAL Assistant",
  subtitle: t("en", "live.chatbot.subtitle"),
  chips: [
    t("en", "live.chatbot.chipProductsPrices"),
    t("en", "live.chatbot.chipDeliveryFees"),
    t("en", "live.chatbot.chipPaymentOptions"),
    t("en", "live.chatbot.chipTrackOrder"),
  ],
};
