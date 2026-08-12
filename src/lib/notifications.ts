import { prisma } from "@/lib/prisma";

export interface NotificationInput {
  type: "ORDER" | "PROMO" | "ACCOUNT" | "INFO";
  title: string;
  message: string;
  href?: string;
}

/** Sends an in-app notification to every active admin/staff account. */
export async function notifyAdmins(input: NotificationInput) {
  const staff = await prisma.user.findMany({
    where: { isActive: true, role: { in: ["ADMIN", "STAFF"] } },
    select: { id: true },
  });
  await Promise.all(
    staff.map((s) =>
      createNotification(s.id, input).catch(() => null)
    )
  );
  return staff.length;
}

export async function createNotification(userId: string | null | undefined, input: NotificationInput) {
  if (!userId) return null;
  try {
    return await prisma.notification.create({ data: { userId, ...input } });
  } catch {
    return null;
  }
}

const STATUS_MESSAGES: Record<string, { title: string; message: string }> = {
  PENDING: { title: "Order received", message: "We have received your order and are verifying it." },
  PAID: { title: "Payment confirmed", message: "Your payment was confirmed. We are preparing your order." },
  PROCESSING: { title: "Order in progress", message: "Your order is being carefully prepared by our team." },
  DISPATCHED: { title: "Order dispatched", message: "Great news — your order is on its way to you." },
  DELIVERED: { title: "Order delivered", message: "Your order has been delivered. Enjoy and stay healthy!" },
  CANCELLED: { title: "Order cancelled", message: "Your order was cancelled. Contact us if this was unexpected." },
};

export async function notifyOrderStatus(userId: string | null, orderNumber: string, status: string) {
  const tpl = STATUS_MESSAGES[status];
  if (!tpl || !userId) return null;
  return createNotification(userId, {
    type: "ORDER",
    title: tpl.title,
    message: `${tpl.message} Order ${orderNumber}.`,
    href: `/customer-dashboard/orders/${orderNumber}`,
  });
}

/** Customer follow-up engine: thank-you + reorder CTA after delivery. */
export async function notifyOrderDelivered(userId: string | null, orderNumber: string) {
  if (!userId) return null;
  return createNotification(userId, {
    type: "PROMO",
    title: "Thank you! How was your order?",
    message: `Your order ${orderNumber} has been delivered. We'd love to hear what you think — leave a review and get a reorder discount on WhatsApp.`,
    href: `/customer-dashboard/reviews`,
  });
}

/** Win-back engine: re-engagement nudge for lapsed customers. */
export async function notifyWinBack(userId: string, lastOrderNumber: string, days: number) {
  return createNotification(userId, {
    type: "PROMO",
    title: "We miss you!",
    message: `It's been ${days} days since your last order (${lastOrderNumber}). Come back with WELCOME10 for 10% off your next order.`,
    href: "/shop",
  });
}
