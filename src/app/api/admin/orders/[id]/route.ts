import { NextRequest } from "next/server";
import { json, error, requireApiStaff, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { notifyOrderStatus, notifyOrderDelivered } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";
import { getSession } from "@/lib/auth";

const ALLOWED_STATUSES = ["PENDING", "PAID", "PROCESSING", "DISPATCHED", "DELIVERED", "CANCELLED"];
const ALLOWED_PAYMENT = ["UNPAID", "PAID", "FAILED", "REFUNDED"];

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiStaff();
    const body = await request.json().catch(() => null);
    const order = await prisma.order.findUnique({ where: { id: params.id }, include: { payments: true } });
    if (!order) return error("Order not found.", 404);

    const data: { status?: string; paymentStatus?: string } = {};

    if (body?.status) {
      if (!ALLOWED_STATUSES.includes(body.status)) return error("Invalid order status.");
      data.status = body.status;
    }
    if (body?.paymentStatus) {
      if (!ALLOWED_PAYMENT.includes(body.paymentStatus)) return error("Invalid payment status.");
      data.paymentStatus = body.paymentStatus;
    }

    if (Object.keys(data).length === 0) return error("Nothing to update.");

    const updated = await prisma.order.update({ where: { id: params.id }, data });

    // Payment status log + payment record sync.
    if (body?.paymentStatus && body.paymentStatus !== order.paymentStatus) {
      const payment = order.payments[0];
      await prisma.paymentLog.create({
        data: {
          paymentId: payment?.id ?? null,
          orderId: order.id,
          provider: payment?.provider ?? "MANUAL",
          status: body.paymentStatus === "PAID" ? "SUCCESS" : body.paymentStatus,
          amount: payment?.amount ?? order.total,
          reference: payment?.reference ?? null,
          message: `Payment status changed from ${order.paymentStatus} to ${body.paymentStatus} by ${session.name}.`,
        },
      });
    }

    if (body?.paymentStatus === "PAID") {
      await prisma.payment.updateMany({
        where: { orderId: params.id },
        data: { status: "SUCCESS" },
      });
    }

    // Customer follow-up engine: thank-you + reorder CTA once delivered.
    if (data.status === "DELIVERED" && order.status !== "DELIVERED") {
      await notifyOrderDelivered(order.userId, order.orderNumber);
    }

    await notifyOrderStatus(order.userId, order.orderNumber, data.status || order.status);

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "ORDER_UPDATE",
      entity: "Order",
      entityId: order.id,
      details: `${order.orderNumber}: ${data.status ? `status→${data.status}` : ""}${data.paymentStatus ? ` payment→${data.paymentStatus}` : ""}`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ order: updated });
  } catch (e) {
    return handleApiError(e);
  }
}
