import { SITE } from "@/lib/constants";

export interface WhatsAppMessage {
  productName?: string;
  productPrice?: string;
  message?: string;
  page?: string;
}

/**
 * Builds a pre-filled WhatsApp chat URL (wa.me). The number is configured
 * via NEXT_PUBLIC_WHATSAPP_NUMBER in .env (international format, digits only).
 */
export function buildWhatsAppUrl(options: WhatsAppMessage = {}): string {
  const number = SITE.whatsappNumber.replace(/\D/g, "");

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
