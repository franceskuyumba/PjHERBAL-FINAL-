"use client";

import { useMemo, useState } from "react";
import { Search, Printer, Phone, MessageCircle, ChevronRight } from "lucide-react";
import { adminOrders, orderStatusMeta, formatTZS } from "@/lib/data/admin";
import Badge from "@/components/ui/Badge";
import { SITE } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";

const filters: (OrderStatus | "all")[] = [
  "all",
  "pending",
  "paid",
  "processing",
  "dispatched",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = adminOrders;
    if (filter !== "all") list = list.filter((o) => o.status === filter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q)
      );
    }
    return list;
  }, [filter, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: adminOrders.length };
    adminOrders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return map;
  }, []);

  const selectedOrder = selected ? adminOrders.find((o) => o.id === selected) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Orders Management</h1>
          <p className="mt-1 text-sm text-brand-500">Track, update and fulfil customer orders.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
          <Printer className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === f
                ? "bg-brand-600 text-white"
                : "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
            }`}
          >
            {f} ({counts[f] || 0})
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order #, name, phone..."
          className="w-full rounded-full border border-brand-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Orders list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-10 text-center text-sm text-brand-500">
              No orders found matching your filters.
            </div>
          )}
          {filtered.map((o) => (
            <div
              key={o.id}
              onClick={() => setSelected(o.id)}
              className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-card transition hover:shadow-lift ${
                selected === o.id ? "border-brand-500 ring-2 ring-brand-200" : "border-brand-100"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold text-brand-950">
                    #{o.orderNumber}
                    <ChevronRight className="h-4 w-4 text-brand-300" />
                  </p>
                  <p className="mt-0.5 text-xs text-brand-400">
                    {new Date(o.createdAt).toLocaleString("en-TZ", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <Badge className={orderStatusMeta[o.status].className}>
                  {orderStatusMeta[o.status].label}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-semibold text-brand-900">{o.customer.name}</p>
                  <p className="text-xs text-brand-400">
                    {o.customer.phone} • {o.delivery.region} – {o.delivery.district}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-base font-bold text-brand-900">
                    {formatTZS(o.total)}
                  </p>
                  <p className="text-xs text-brand-400">
                    {o.items.reduce((s, i) => s + i.quantity, 0)} items • {o.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order detail panel */}
        <div className="h-fit rounded-2xl border border-brand-100 bg-white p-6 shadow-card lg:sticky lg:top-24">
          {selectedOrder ? (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-brand-950">
                  #{selectedOrder.orderNumber}
                </h2>
                <Badge className={orderStatusMeta[selectedOrder.status].className}>
                  {orderStatusMeta[selectedOrder.status].label}
                </Badge>
              </div>

              <div className="mt-4 space-y-1.5 rounded-xl bg-brand-50 p-4 text-sm">
                <p><span className="text-brand-400">Customer: </span><span className="font-semibold text-brand-900">{selectedOrder.customer.name}</span></p>
                <p><span className="text-brand-400">Phone: </span>{selectedOrder.customer.phone}</p>
                <p><span className="text-brand-400">Email: </span>{selectedOrder.customer.email || "—"}</p>
                <p><span className="text-brand-400">Address: </span>{selectedOrder.delivery.address}, {selectedOrder.delivery.district}, {selectedOrder.delivery.region}</p>
                <p><span className="text-brand-400">Payment: </span>{selectedOrder.paymentMethod} {selectedOrder.paymentRef && `(${selectedOrder.paymentRef})`}</p>
              </div>

              <div className="mt-4 space-y-2">
                {selectedOrder.items.map((i) => (
                  <div key={i.productId + i.title} className="flex items-center justify-between text-sm">
                    <span className="text-brand-700">
                      {i.quantity} × {i.title}
                    </span>
                    <span className="font-semibold text-brand-900">{formatTZS(i.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-brand-100 pt-2 text-sm text-brand-500">
                  <span>Shipping</span>
                  <span>{selectedOrder.shipping === 0 ? "FREE" : formatTZS(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-brand-100 pt-2 font-display text-base font-bold text-brand-950">
                  <span>Total</span>
                  <span>{formatTZS(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Status update */}
              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-medium text-brand-900">Update Status</label>
                <select
                  defaultValue={selectedOrder.status}
                  className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {filters.filter((f) => f !== "all").map((s) => (
                    <option key={s} value={s}>{orderStatusMeta[s].label}</option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-brand-900">Timeline</h3>
                <div className="mt-3 space-y-3">
                  {selectedOrder.history.map((h, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="h-3 w-3 rounded-full border-2 border-brand-600 bg-white" />
                        {i < selectedOrder.history.length - 1 && (
                          <span className="h-full w-px bg-brand-200" />
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="text-sm font-medium capitalize text-brand-800">{h.status}</p>
                        <p className="text-xs text-brand-400">
                          {new Date(h.at).toLocaleString("en-TZ", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${selectedOrder.customer.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-200 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hello ${selectedOrder.customer.name}! Regarding your order #${selectedOrder.orderNumber}...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-2.5 text-sm font-semibold text-white hover:bg-[#1fb958]"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-brand-400">
              <p className="font-semibold text-brand-700">Select an order</p>
              <p className="mt-1">to view details, update status and contact the customer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
