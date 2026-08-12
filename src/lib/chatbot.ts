import { SITE, deliveryZoneFor } from "@/lib/constants";

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
  reply: () => string;
}

const PRICES_HINT =
  `Browse our full range at ${SITE.url}/shop. For example: ` +
  `Male Vitality Plus TZS 45,000, Moringa Power TZS 25,000, SlimHerbal Tea TZS 18,000. ` +
  `Flash deals with up to 18% off are on the homepage.`;

const intents: Intent[] = [
  {
    id: "order_status",
    keywords: ["order", "order status", "agizo", "oda", "where is my", "wapi", "status ya", "imekuja"],
    reply: () =>
      `To check your order, open the "My Orders" page in your account dashboard — every stage from payment to delivery is shown there. ` +
      `If you'd like a live update, tap "Chat on WhatsApp" and our team will confirm it for you right away.`,
  },
  {
    id: "payment",
    keywords: ["pay", "payment", "m-pesa", "tigo pesa", "airtel", "lipa", "malipo", "how do i pay", "namba"],
    reply: () =>
      `We accept M-Pesa, Tigo Pesa, Airtel Money, HaloPesa and bank transfer to CRDB/NMB. ` +
      `After checkout you'll get payment instructions and can confirm your payment on WhatsApp — simply send the transaction reference.`,
  },
  {
    id: "delivery",
    keywords: ["delivery", "shipping", "deliver", "usafirishaji", "kifungo", "delivery fee", "nauli", "how long"],
    reply: () =>
      `We deliver nationwide. Same-day delivery across Dar es Salaam, and 1–5 days to the rest of Tanzania depending on your region. ` +
      `Delivery fees start at TZS 7,000 and are free on orders over TZS 200,000. Delivery to ${deliveryZoneFor("Dar es Salaam").eta}.`,
  },
  {
    id: "products",
    keywords: ["product", "products", "buy", "supplement", "herbal", "stock", "price", "bei", "bidhaa", "dawa", "capsule"],
    reply: () => PRICES_HINT,
  },
  {
    id: "hours",
    keywords: ["hours", "open", "close", "time", "masaa", "fungua", "saa", "working"],
    reply: () => `We're open Monday–Saturday 8:00 AM – 8:00 PM and Sunday 10:00 AM – 6:00 PM at ${SITE.address}.`,
  },
  {
    id: "location",
    keywords: ["where", "location", "address", "visit", "mahali", "anwani", "segerea", "shop location", "maps"],
    reply: () => `Find us at ${SITE.address}, Dar es Salaam. See the Google Map on our Contact page for directions.`,
  },
  {
    id: "returns",
    keywords: ["return", "refund", "exchange", "rudi", "rudishi", "change", "damaged"],
    reply: () =>
      `If a product arrives damaged or incorrect, contact us within 7 days and we'll make it right — replacement or refund. ` +
      `Reach us on WhatsApp and we'll guide you.`,
  },
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "habari", "mambo", "jambo", "salam", "good morning", "good afternoon", "good evening", "asante"],
    reply: () =>
      `Hello! 👋 Welcome to ${SITE.name}. Ask me about products, prices, delivery or payments — or tap "Chat on WhatsApp" to talk to a real specialist.`,
  },
];

const quickReplyMap: Record<string, string[]> = {
  order_status: ["Track my order", "Delivery time"],
  payment: ["Payment methods", "M-Pesa"],
  delivery: ["Delivery fees", "Where do you deliver?"],
  products: ["Best sellers", "Prices"],
  hours: ["Opening hours", "Address"],
  greeting: ["Products & prices", "Delivery", "Payment"],
};

export function getBotReply(message: string): BotReply {
  const text = message.toLowerCase().trim();
  if (!text) {
    return { text: "Hello! How can I help you today?", quickReplies: quickReplyMap.greeting };
  }

  // Explicit human handoff.
  if (/(human|specialist|person|agent|mwanadamu|msaada wa kibinadamu|talk to)/.test(text)) {
    return { text: "Of course! One of our specialists will be happy to help.", handoff: true };
  }

  // Match the longest intent by keyword hit.
  let best: Intent | null = null;
  for (const intent of intents) {
    if (intent.keywords.some((k) => text.includes(k))) {
      if (!best || intent.keywords.length > best.keywords.length) best = intent;
    }
  }

  if (best) {
    return { text: best.reply(), quickReplies: quickReplyMap[best.id] };
  }

  return {
    text:
      `I couldn't quite understand that. You can ask me about products, prices, delivery, payment or our location — ` +
      `or tap "Chat on WhatsApp" and a specialist will take over.`,
    quickReplies: ["Products & prices", "Delivery", "Payment", "Chat with specialist"],
  };
}

/** Sample starter chips shown when the bot opens. */
export const botStarter = {
  title: "PJHERBAL Assistant",
  subtitle: "Instant answers, 24/7",
  chips: ["Products & prices", "Delivery & fees", "Payment options", "Track my order"],
};
