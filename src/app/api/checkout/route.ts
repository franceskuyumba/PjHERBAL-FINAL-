import { NextRequest } from "next/server";
import { json, error, ApiError, handleApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { parseProductImages } from "@/lib/product-images";
import { checkoutSchema } from "@/lib/validations";
import { calculateTotals } from "@/lib/cart";
import { generateOrderNumber } from "@/lib/utils";
import { initiatePayment, type PaymentOrder, type InitiateResult } from "@/lib/payments";
import { getSession } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import { zodParseSafe } from "@/lib/zod-helpers";
import { createNotification, notifyAdmins } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";
import { sendOrderConfirmation } from "@/lib/notify";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    return await handleCheckout(request);
  } catch (e) {
    return handleApiError(e);
  }
}

async function handleCheckout(request: NextRequest) {
  requireSameOrigin(request);
  const limited = checkRateLimit(`checkout:${requestIp(request)}`, 20, 10 * 60 * 1000);
  if (!limited.allowed) {
    return Response.json({ error: "Too many checkout attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  }
  const body = await request.json().catch(() => null);
  if (!body) return error("Invalid request.");

  const parsed = zodParseSafe(checkoutSchema, body);
  if (!parsed.ok) return error(parsed.message);

  const items = parsed.data.items;
  if (items.length === 0) return error("Your cart is empty.");

  const itemIds = items.map((i) => i.productId);
  if (new Set(itemIds).size !== itemIds.length) return error("Duplicate products are not allowed in checkout.");
  const products = await prisma.product.findMany({
    where: { id: { in: itemIds }, status: "ACTIVE" },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItems = items.map(
    (item): {
      productId: string;
      productName: string;
      productSlug: string;
      productImage: string | undefined;
      price: number;
      quantity: number;
      subtotal: number;
    } => {
      const product = productMap.get(item.productId);
      const qty = item.quantity;
      if (!product) throw new ApiError("One of your cart items is no longer available.", 400);
      if (qty > product.stock) {
        throw new ApiError(`Only ${product.stock} of "${product.name}" are available.`, 400);
      }
      subtotal += product.price * qty;
      return {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: parseProductImages(product.images)[0],
        price: product.price,
        quantity: qty,
        subtotal: product.price * qty,
      };
    }
  );

  // Validate coupon server-side (includes scheduled-promotion window).
  let couponCode: string | null = null;
  let couponForCalc = null;
  if (parsed.data.coupon?.code) {
    const code = parsed.data.coupon.code.toUpperCase();
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
  const lowStock: string[] = [];
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
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

    for (const oi of orderItems) {
      const reserved = await tx.product.updateMany({
        where: { id: oi.productId, status: "ACTIVE", stock: { gte: oi.quantity } },
        data: { stock: { decrement: oi.quantity } },
      });
      if (reserved.count !== 1) {
        throw new ApiError(`Stock changed while placing your order for "${oi.productName}". Please try again.`, 409);
      }
      const updated = await tx.product.findUnique({ where: { id: oi.productId } });
      if (updated && updated.stock <= updated.lowStockThreshold) {
        lowStock.push(`${updated.name} (${updated.stock} left)`);
      }
    }

    if (couponCode) {
      const currentCoupon = await tx.coupon.findUnique({ where: { code: couponCode } });
      if (!currentCoupon || !currentCoupon.isActive || (currentCoupon.maxUses !== null && currentCoupon.usedCount >= currentCoupon.maxUses)) {
        throw new ApiError("This coupon is no longer available.", 409);
      }
      await tx.coupon.update({ where: { code: couponCode }, data: { usedCount: { increment: 1 } } });
    }
    return created;
  });

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

  let paymentResult: InitiateResult;
  try {
    paymentResult = await initiatePayment(paymentOrder, order.paymentMethod);
  } catch (paymentError) {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      for (const oi of orderItems) {
        await tx.product.update({ where: { id: oi.productId }, data: { stock: { increment: oi.quantity } } });
      }
      if (couponCode) await tx.coupon.update({ where: { code: couponCode }, data: { usedCount: { decrement: 1 } } });
    });
    throw paymentError;
  }

  if (lowStock.length > 0) {
    await notifyAdmins({
      type: "ACCOUNT",
      title: "Low stock alert",
      message: `These products need restocking: ${lowStock.join(", ")}.`,
      href: "/admin/products",
    });
  }

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
