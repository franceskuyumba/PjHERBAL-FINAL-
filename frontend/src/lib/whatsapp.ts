import { SITE, WHATSAPP_LINK } from "./constants";
import { getProductById } from "./store";
import type { Order } from "./types";

export function productInquiryMessage(productId: string, title?: string): string {
  const p = title || getProductById(productId)?.title || "a product";
  return `Hello AfyaPlus! I'm interested in "${p}". Can you tell me more about it and confirm availability?`;
}

export function orderWhatsAppMessage(order: Order): string {
  return [
    `Hello AfyaPlus! I just placed an order:`,
    `Order #${order.orderNumber}`,
    `Total: ${order.total.toLocaleString()} TZS`,
    `Payment: ${order.paymentMethod}`,
    `Delivery: ${order.delivery.region} - ${order.delivery.district}`,
    `Please confirm my order. Thank you!`,
  ].join("\n");
}

export function whatsappUrl(message: string): string {
  return WHATSAPP_LINK(message);
}

export { SITE };
