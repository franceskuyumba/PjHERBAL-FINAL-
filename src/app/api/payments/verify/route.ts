import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayment } from "@/lib/payments";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limited = checkRateLimit(`payment-verify:${requestIp(request)}`, 20, 10 * 60 * 1000);
  if (!limited.allowed) return NextResponse.json({ error: "Too many verification requests." }, { status: 429 });

  const orderNumber = request.nextUrl.searchParams.get("orderNumber")?.trim();
  if (!orderNumber) return NextResponse.json({ error: "Order number is required." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { orderNumber }, include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } } });
  const payment = order?.payments[0];
  if (!order || !payment) return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
  if (order.paymentStatus === "PAID") return NextResponse.json({ status: "SUCCESS", orderNumber });

  const result = await verifyPayment(payment.reference);
  if (result.status === "SUCCESS") {
    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: "SUCCESS", transactionId: result.transactionId || null } }),
      prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "PAID", status: order.status === "PENDING" ? "PAID" : order.status } }),
      prisma.paymentLog.create({ data: { paymentId: payment.id, orderId: order.id, provider: result.provider, status: "SUCCESS", amount: payment.amount, reference: payment.reference, message: "Payment verified by provider." } }),
    ]);
    await logActivity({ action: "PAYMENT_UPDATE", entity: "Order", entityId: order.id, details: `${order.orderNumber}: payment verified` });
  }

  return NextResponse.json({ status: result.status, orderNumber });
}
