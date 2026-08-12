import { NextRequest } from "next/server";
import { json, error, ApiError, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { calculateTotals } from "@/lib/cart";
import { generateOrderNumber } from "@/lib/utils";
import { initiatePayment, type PaymentOrder } from "@/lib/payments";
import { getSession } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import { zodParseSafe } from "@/lib/zod-helpers";
import { createNotification, notifyAdmins } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";
import { sendOrderConfirmation } from "@/lib/notify";

export async function POST(request: NextRequest) {
  try {
    return await handleCheckout(request);
  } catch (e) {
    return handleApiError(e);
  }
}

async function handleCheckout(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return error("Invalid request.");

  const parsed = zodParseSafe(checkoutSchema, body);
  if (!parsed.ok) return error(parsed.message);

  const items: { productId?: string; quantity?: number }[] = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) return error("Your cart is empty.");

  const itemIds: string[] = items
    .map((i: { productId?: string }) => i.productId || "")
    .filter((id: string) => id.length > 0);
  const products = await prisma.product.findMany({
    where: { id: { in: itemIds }, status: "ACTIVE" },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItems = items.map(
    (item: { productId?: string; quantity?: number }): {
      productId: string;
      productName: string;
      productSlug: string;
      productImage: string | undefined;
      price: number;
      quantity: number;
      subtotal: number;
    } => {
      const product = productMap.get(item.productId || "");
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      if (!product) throw new ApiError("One of your cart items is no longer available.", 400);
      if (qty > product.stock) {
        throw new ApiError(`Only ${product.stock} of "${product.name}" are available.`, 400);
      }
      subtotal += product.price * qty;
      return {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images.split(",")[0],
        price: product.price,
        quantity: qty,
        subtotal: product.price * qty,
      };
    }
  );

  // Validate coupon server-side (includes scheduled-promotion window).
  let couponCode: string | null = null;
  let couponForCalc = null;
  if (body.coupon?.code) {
    const code = String(body.coupon.code).trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    const now = new Date();
    const valid =
      coupon && coupon.isActive &&
      (!coupon.startsAt || coupon.startsAt <= now) &&
      (!coupon.expiresAt || coupon.expiresAt >= now) &&
      (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
      subtotal >= coupon.minOrder;
    if (valid && coupon) {
      couponCode = code;
      couponForCalc = {
        type: coupon.type,
        value: coupon.value,
        maxDiscount: coupon.maxDiscount,
      };
    }
  }

  const totals = calculateTotals(
    orderItems.map((oi) => ({
      productId: oi.productId || "",
      slug: oi.productSlug,
      name: oi.productName,
      price: oi.price,
      image: oi.productImage || "",
      quantity: oi.quantity,
      stock: 999,
    })),
    couponForCalc,
    { region: parsed.data.region }
  );

  const session = await getSession();

  const orderNumber = await createOrderNumber();
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session?.sub ?? null,
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.email,
      customerPhone: parsed.data.phone,
      region: parsed.data.region,
      district: parsed.data.district,
      address: parsed.data.address,
      notes: parsed.data.notes || null,
      couponCode,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      currency: "TZS",
      paymentMethod: parsed.data.paymentMethod,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  // Decrement stock and raise low-stock alerts.
  const lowStock: string[] = [];
  for (const oi of orderItems) {
    if (oi.productId) {
      const updated = await prisma.product.update({
        where: { id: oi.productId },
        data: { stock: { decrement: oi.quantity } },
      });
      if (updated.stock <= updated.lowStockThreshold) {
        lowStock.push(`${updated.name} (${updated.stock} left)`);
      }
    }
  }
  if (lowStock.length > 0) {
    await notifyAdmins({
      type: "ACCOUNT",
      title: "Low stock alert",
      message: `These products need restocking: ${lowStock.join(", ")}.`,
      href: "/admin/products",
    });
  }

  // Increment coupon usage
  if (couponCode) {
    await prisma.coupon.update({ where: { code: couponCode }, data: { usedCount: { increment: 1 } } });
  }

  // Initiate payment
  const paymentOrder: PaymentOrder = {
    id: order.id,
    orderNumber,
    total: totals.total,
    currency: "TZS",
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
  };

  const paymentResult = await initiatePayment(paymentOrder, order.paymentMethod);

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: paymentResult.provider,
      amount: totals.total,
      status: "PENDING",
      reference: paymentResult.reference,
    },
  });

  // Payment status log
  await prisma.paymentLog.create({
    data: {
      paymentId: payment.id,
      orderId: order.id,
      provider: paymentResult.provider,
      status: "CREATED",
      amount: totals.total,
      reference: paymentResult.reference,
      message: `Payment initiated via ${paymentResult.provider} (${order.paymentMethod}).`,
    },
  });

  trackEvent({
    event: "purchase",
    sessionId: session?.sub ?? null,
    data: { orderNumber, total: totals.total, items: orderItems.length },
  });

  if (session?.sub) {
    await Promise.all([
      createNotification(session.sub, {
        type: "ORDER",
        title: "Order placed",
        message: `Your order ${orderNumber} was placed successfully (${totals.total.toLocaleString()} TZS). We will confirm once payment is received.`,
        href: `/customer-dashboard/orders/${orderNumber}`,
      }),
      createNotification(session.sub, {
        type: "PROMO",
        title: "Thank you for your order",
        message: "Follow your order's progress from your dashboard, or chat with us on WhatsApp for help.",
        href: "/customer-dashboard",
      }),
    ]);
  }

  // Best-effort email/SMS confirmation (console provider by default).
  await sendOrderConfirmation({
    orderNumber,
    total: totals.total,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerName: order.customerName,
  });

  await logActivity({
    actorId: session?.sub ?? null,
    actorName: order.customerName,
    role: session?.role ?? "GUEST",
    action: "ORDER_CREATE",
    entity: "Order",
    entityId: order.id,
    details: `${orderNumber} — TZS ${totals.total.toLocaleString()}`,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
  });

  return json({
    orderNumber,
    reference: paymentResult.reference,
    redirectUrl: paymentResult.redirectUrl,
    instructions: paymentResult.instructions,
    provider: paymentResult.provider,
    total: totals.total,
    paymentMethod: order.paymentMethod,
    customerName: order.customerName,
  });
}

async function createOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateOrderNumber();
    const existing = await prisma.order.findUnique({ where: { orderNumber: candidate } });
    if (!existing) return candidate;
  }
  throw new Error("Could not generate a unique order number. Please try again.");
}
