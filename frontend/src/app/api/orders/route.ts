import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders, updateOrderStatus } from "@/lib/orderStore";
import { sendWhatsApp } from "@/lib/whatsappService";
import type { OrderStatus } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ orders: getOrders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const customer = body?.customer;
    const delivery = body?.delivery;
    const items = body?.items;

    if (!customer?.name || !customer?.phone || !delivery?.address || !delivery?.region) {
      return NextResponse.json(
        { error: "Missing required customer or delivery details" },
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    );
    const shipping = Number(body.shipping) || 0;
    const discount = Number(body.discount) || 0;
    const total = subtotal + shipping - discount;

    const order = createOrder({
      customer,
      delivery,
      items,
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod: body.paymentMethod || "mpesa",
      paymentRef: body.paymentRef,
      status: "paid",
    });

    // Fire-and-forget WhatsApp confirmation (safe in demo mode too)
    try {
      await sendWhatsApp(customer.phone, {
        template: "order_confirmation",
        args: [customer.name, order.orderNumber, total.toLocaleString()],
      });
    } catch {
      /* non-blocking */
    }

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const valid: OrderStatus[] = ["pending", "paid", "processing", "dispatched", "delivered", "cancelled"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const order = updateOrderStatus(id, status);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(order);
}
