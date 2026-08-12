import { randomUUID } from "crypto";
import type { Order, OrderStatus } from "@/lib/types";

// In-memory store for demo mode. In production the Express backend + PostgreSQL handles persistence.
const store: { orders: Order[] } = { orders: [] };

export function generateOrderNumber(): string {
  return `AP-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
}

export function createOrder(input: {
  customer: { name: string; phone: string; email?: string };
  delivery: { address: string; region: string; district: string };
  items: Order["items"];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  paymentRef?: string;
  status?: OrderStatus;
}): Order {
  const now = new Date().toISOString();
  const status = input.status || "pending";
  const order: Order = {
    id: randomUUID(),
    orderNumber: generateOrderNumber(),
    customer: {
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email || "",
    },
    delivery: input.delivery,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    discount: input.discount || 0,
    total: input.total,
    paymentMethod: input.paymentMethod,
    paymentRef: input.paymentRef,
    status,
    createdAt: now,
    history: [{ status, at: now }],
  };
  store.orders.unshift(order);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const order = store.orders.find((o) => o.id === id);
  if (!order) return undefined;
  order.status = status;
  order.history.push({ status, at: new Date().toISOString() });
  return order;
}

export function getOrders(): Order[] {
  return store.orders;
}
