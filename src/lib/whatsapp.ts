import { SITE } from "@/lib/constants";

export interface WhatsAppMessage {
  productName?: string;
  productPrice?: string;
  message?: string;
  page?: string;
  recipient?: "specialist" | "customerCare";
}

/**
 * Builds a pre-filled WhatsApp chat URL (wa.me). The number is configured
 * via NEXT_PUBLIC_WHATSAPP_NUMBER in .env (international format, digits only).
 */
export function buildWhatsAppUrl(options: WhatsAppMessage = {}): string {
  const number = (options.recipient === "specialist" ? SITE.specialistWhatsappNumber : SITE.customerCareWhatsappNumber).replace(/\D/g, "");

  const lines: string[] = [];
  if (options.productName) {
    lines.push(`Hello PJHERBAL Clinic!`);
    lines.push(``);
    lines.push(`I'm interested in: ${options.productName}`);
    if (options.productPrice) lines.push(`Price: ${options.productPrice}`);
    if (options.page) lines.push(`Product link: ${options.page}`);
  } else if (options.message) {
    lines.push(options.message);
  } else {
    lines.push(SITE.whatsappDefaultMessage);
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${text}`;
}

export function whatsappOrderMessage(order: {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  customerName: string;
}): string {
  const lines = [
    `Hello PJHERBAL Clinic!`,
    ``,
    `I just placed an order:`,
    `Order #${order.orderNumber}`,
    `Total: TZS ${order.total.toLocaleString()}`,
    `Payment: ${order.paymentMethod}`,
    `Name: ${order.customerName}`,
    ``,
    `Please confirm my order. Thank you!`,
  ];
  return encodeURIComponent(lines.join("\n"));
}

export function whatsappSupportUrl(): string {
  return buildWhatsAppUrl({ message: SITE.whatsappDefaultMessage });
}

function normalizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `255${digits.slice(1)}`;
  return digits.startsWith("255") ? digits : `255${digits}`;
}

export async function sendWhatsAppText(to: string, text: string): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp Cloud API credentials are not configured.");
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizeWhatsAppNumber(to),
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });

  if (!response.ok) {
    throw new Error(`WhatsApp Cloud API returned ${response.status}: ${await response.text()}`);
  }
}
