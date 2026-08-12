/**
 * WhatsApp Cloud API (Meta) integration for transactional + campaign messages.
 */

export const WHATSAPP_TEMPLATES = {
  order_confirmation: {
    name: "order_confirmation",
    language: "en_US",
    body: "Hello {{1}}, your order #{{2}} of TZS {{3}} has been received. We'll notify you when it's dispatched. Thank you for choosing AfyaPlus!",
  },
  order_dispatched: {
    name: "order_dispatched",
    language: "en_US",
    body: "Hello {{1}}, your order #{{2}} is on its way! Expected delivery: {{3}}. - AfyaPlus",
  },
  order_delivered: {
    name: "order_delivered",
    language: "en_US",
    body: "Hello {{1}}, your order #{{2}} has been delivered. Please share your review here: {{3}} - AfyaPlus",
  },
  abandoned_cart: {
    name: "abandoned_cart",
    language: "en_US",
    body: "Hello {{1}}, you left items worth TZS {{2}} in your cart. Complete your order and use code {{3}} at checkout: {{4}} - AfyaPlus",
  },
};

function normalizePhone(phone) {
  let p = String(phone).replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "255" + p.slice(1);
  if (!p.startsWith("255")) p = "255" + p;
  return p;
}

async function callApi(phoneNumberId, accessToken, payload) {
  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`WhatsApp API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function sendTemplate(to, templateName, components = []) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return { ok: false, reason: "not_configured" };

  return callApi(phoneNumberId, token, {
    messaging_product: "whatsapp",
    to: normalizePhone(to),
    type: "template",
    template: {
      name: templateName,
      language: { code: "en_US" },
      components,
    },
  });
}

export async function sendText(to, text) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return { ok: false, reason: "not_configured" };

  return callApi(phoneNumberId, token, {
    messaging_product: "whatsapp",
    to: normalizePhone(to),
    type: "text",
    text: { body: text },
  });
}

export function verifyWebhook(mode, token, challenge) {
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return challenge;
  }
  return null;
}

export function parseInbound(payload) {
  const msg = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return null;
  return {
    from: msg.from,
    type: msg.type,
    text: msg.type === "text" ? msg.text?.body : null,
  };
}
