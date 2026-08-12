/**
 * Server-side WhatsApp integration.
 *
 * Two modes:
 *  1. WhatsApp Cloud API (Meta) — when WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are set.
 *  2. Demo/log mode — otherwise, messages are logged to the console so the flow works locally.
 */

interface WhatsAppMessageInput {
  to: string;
  template: string;
  args: string[];
}

const templates: Record<string, (args: string[]) => string> = {
  order_confirmation: (args) =>
    `✅ *Order Confirmed* - AfyaPlus\n\nHi ${args[0]},\n\nYour order *#${args[1]}* has been received.\nTotal: *${args[2]} TZS*\n\nWe'll notify you when it's dispatched.\n\nThank you for shopping with AfyaPlus!`,
  order_dispatched: (args) =>
    `🚚 *Order Dispatched* - AfyaPlus\n\nHi ${args[0]},\n\nYour order *#${args[1]}* is on its way!\nExpected delivery: ${args[2]}\n\nStay tuned for updates.`,
  order_delivered: (args) =>
    `🎉 *Order Delivered* - AfyaPlus\n\nHi ${args[0]},\n\nYour order *#${args[1]}* has been delivered.\n\nWe hope you love it! Please share your review: ${args[2]}\n\nThank you for choosing AfyaPlus!`,
  abandoned_cart: (args) =>
    `🛒 *You left something behind!*\n\nHi ${args[0]},\n\nYou still have items in your cart worth *${args[1]} TZS*.\n\nComplete your order now and use code *${args[2]}* for a special discount:\n\n${args[3]}\n\nNeed help? Reply to this message!`,
  promo: (args) =>
    `🎁 *Exclusive Offer* - AfyaPlus\n\nHi ${args[0]},\n\n${args[1]}\n\nShop now: ${args[2]}\n\nUse code *${args[3]}* at checkout.`,
  reply: (args) => args.join(" "),
};

function normalizePhone(phone: string): string {
  let p = phone.replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "255" + p.slice(1);
  if (!p.startsWith("255")) p = "255" + p;
  return p;
}

async function sendViaCloudAPI(input: WhatsAppMessageInput): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return false;

  const body = {
    messaging_product: "whatsapp",
    to: normalizePhone(input.to),
    type: "text",
    text: {
      body: templates[input.template]?.(input.args) ?? input.args.join(" "),
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    console.error("[WhatsApp] send failed", res.status, await res.text());
    return false;
  }
  return true;
}

export async function sendWhatsApp(
  to: string,
  input: Omit<WhatsAppMessageInput, "to">
): Promise<boolean> {
  const sent = await sendViaCloudAPI({ to, ...input });
  if (!sent) {
    // Demo mode: log the message so the flow remains testable without credentials.
    const text = templates[input.template]?.(input.args) ?? input.args.join(" ");
    console.log(`[WhatsApp DEMO → ${to}] ${input.template}: ${text.replace(/\n/g, " ")}`);
  }
  return sent;
}

export function buildReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("mambo") || lower.includes("habari")) {
    return "Hello! 👋 Welcome to AfyaPlus. How can we help you today? You can ask about products, prices, delivery or place an order. Type 'Menu' to see options.";
  }
  if (lower.includes("price") || lower.includes("bei")) {
    return "Our supplements range from 25,000 to 90,000 TZS. Visit our shop at https://afyaplus.co.tz/shop or tell me which product you're interested in!";
  }
  if (lower.includes("delivery") || lower.includes("deliver")) {
    return "🚚 We deliver nationwide! Same-day delivery in Dar es Salaam, 1-4 days upcountry. Free delivery on orders above 80,000 TZS.";
  }
  if (lower.includes("payment") || lower.includes("mpesa") || lower.includes("tigo")) {
    return "💳 We accept M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, CRDB and NMB Bank. Payment is instant and secure at checkout.";
  }
  if (lower.includes("order") || lower.includes("buy") || lower.includes("order status")) {
    return "To place an order, visit https://afyaplus.co.tz/shop, add products to cart and checkout — it takes under a minute! Share your order number if you need help tracking.";
  }
  if (lower.includes("menu")) {
    return "📋 *Menu*\n1. Products\n2. Prices\n3. Delivery\n4. Payment\n5. Track order\n6. Talk to a specialist\n\nReply with a number or your question.";
  }
  return "Thank you for contacting AfyaPlus! 💚 A specialist will reply to you shortly. Meanwhile, you can browse products at https://afyaplus.co.tz/shop";
}
