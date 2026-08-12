"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  User,
  Settings,
  LogOut,
  Truck,
  ChevronRight,
  PackageCheck,
  Clock,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { SITE, PAYMENT_METHODS } from "@/lib/constants";
import { getProductById } from "@/lib/store";
import ProductCard from "@/components/product/ProductCard";
import Badge from "@/components/ui/Badge";
import type { Order, OrderStatus } from "@/lib/types";

const statusColors: Record<OrderStatus, "green" | "gold" | "outline" | "red" | "dark"> = {
  pending: "gold",
  paid: "green",
  processing: "outline",
  dispatched: "green",
  delivered: "dark",
  cancelled: "red",
};

const statusSteps: OrderStatus[] = ["pending", "paid", "processing", "dispatched", "delivered"];

const tabs = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "tracking", label: "Track Order", icon: Truck },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Account", icon: User },
] as const;

type TabId = (typeof tabs)[number]["id"];

const savedAddresses = [
  { label: "Home", line: "Plot 12, Mikocheni A", region: "Dar es Salaam", district: "Kinondoni" },
  { label: "Office", line: "Samora Avenue, PSSF Building", region: "Dar es Salaam", district: "Ilala" },
];

export default function CustomerDashboardPage() {
  const params = useSearchParams();
  const initialTab = (params.get("tab") as TabId) || "orders";
  const [tab, setTab] = useState<TabId>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) {
        const o = JSON.parse(raw) as Order;
        setOrders((prev) => (prev.some((x) => x.id === o.id) ? prev : [o, ...prev]));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("afyaplus_wishlist");
    if (raw) setWishlist(JSON.parse(raw) as string[]);
  }, []);

  const wishlistProducts = useMemo(
    () => wishlist.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [wishlist]
  );

  const latestOrder = orders[0];

  const progressIndex = latestOrder
    ? statusSteps.indexOf(latestOrder.status === "cancelled" ? "pending" : latestOrder.status)
    : -1;

  return (
    <div className="bg-cream py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">
              Customer Dashboard
            </h1>
            <p className="mt-1 text-sm text-brand-500">Welcome back! Manage your orders and account.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-brand-100 bg-white p-3 shadow-card lg:sticky lg:top-32">
            <div className="mb-3 flex items-center gap-3 border-b border-brand-100 p-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display font-bold text-white">
                {("Guest").charAt(0)}
              </span>
              <div>
                <p className="text-sm font-bold text-brand-950">Guest Customer</p>
                <p className="text-xs text-brand-400">Sign in for synced orders</p>
              </div>
            </div>
            <nav className="grid gap-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    tab === t.id
                      ? "bg-brand-600 text-white"
                      : "text-brand-700 hover:bg-brand-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <t.icon className="h-4 w-4" /> {t.label}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </nav>
            <div className="mt-3 border-t border-brand-100 pt-3">
              <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50">
                <Settings className="h-4 w-4" /> Settings
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-6">
            {tab === "orders" && (
              <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-brand-950">Order History</h2>
                {orders.length === 0 ? (
                  <div className="py-10 text-center">
                    <Package className="mx-auto h-12 w-12 text-brand-300" />
                    <p className="mt-3 font-semibold text-brand-800">No orders yet</p>
                    <p className="mt-1 text-sm text-brand-500">
                      When you place an order, it will appear here.
                    </p>
                    <Link
                      href="/shop"
                      className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-xl border border-brand-100 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-brand-950">#{order.orderNumber}</p>
                            <p className="text-xs text-brand-400">
                              {new Date(order.createdAt).toLocaleDateString("en-TZ", {
                                dateStyle: "medium",
                              })}{" "}
                              • {order.items.reduce((s, i) => s + i.quantity, 0)} items
                            </p>
                          </div>
                          <Badge variant={statusColors[order.status]}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-brand-100 pt-3">
                          <p className="text-sm font-semibold text-brand-900">
                            {formatPrice(order.total)}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setTab("tracking");
                              }}
                              className="rounded-full border border-brand-200 px-4 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
                            >
                              Track
                            </button>
                            <button
                              onClick={() =>
                                (window.location.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                                  `Hello AfyaPlus! I want to reorder from order #${order.orderNumber}.`
                                )}`)
                              }
                              className="rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                            >
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === "tracking" && (
              <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-brand-950">Order Tracking</h2>
                {latestOrder ? (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-brand-900">
                        Order #{latestOrder.orderNumber}
                      </p>
                      <Badge variant={statusColors[latestOrder.status]}>
                        {latestOrder.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="mt-8 flex items-center">
                      {statusSteps.map((s, i) => {
                        const isPast = i <= progressIndex && latestOrder.status !== "cancelled";
                        return (
                          <div key={s} className="flex flex-1 items-center last:flex-none">
                            <div className="flex flex-col items-center">
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                                  isPast
                                    ? "border-brand-600 bg-brand-600 text-white"
                                    : "border-brand-200 bg-white text-brand-300"
                                }`}
                              >
                                {i === 0 ? (
                                  <Clock className="h-4 w-4" />
                                ) : (
                                  <PackageCheck className="h-4 w-4" />
                                )}
                              </span>
                              <span
                                className={`mt-2 hidden text-xs font-medium sm:block ${
                                  isPast ? "text-brand-700" : "text-brand-300"
                                }`}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </span>
                            </div>
                            {i < statusSteps.length - 1 && (
                              <div
                                className={`mx-1 h-0.5 flex-1 rounded ${
                                  i < progressIndex ? "bg-brand-600" : "bg-brand-200"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex items-center gap-3 rounded-xl bg-brand-50 p-4">
                      <Truck className="h-6 w-6 text-brand-600" />
                      <div>
                        <p className="text-sm font-semibold text-brand-900">
                          {latestOrder.status === "delivered"
                            ? "Delivered!"
                            : latestOrder.status === "dispatched"
                              ? "Your order is on the way!"
                              : "We are preparing your order"}
                        </p>
                        <p className="text-xs text-brand-500">
                          Delivery to {latestOrder.delivery.region} – {latestOrder.delivery.district} •{" "}
                          {PAYMENT_METHODS.find((p) => p.id === latestOrder.paymentMethod)?.label ||
                            latestOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-brand-500">
                    No order to track yet. Place an order to start tracking.
                  </p>
                )}
              </section>
            )}

            {tab === "wishlist" && (
              <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-brand-950">My Wishlist</h2>
                <p className="mt-1 text-sm text-brand-500">
                  Products you saved from your category browsing. Add products from their pages to build your wishlist.
                </p>
                {wishlistProducts.length > 0 ? (
                  <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {wishlistProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <Heart className="mx-auto h-12 w-12 text-brand-300" />
                    <p className="mt-3 text-sm text-brand-500">
                      Your wishlist is empty. Tap the heart on any product to save it.
                    </p>
                  </div>
                )}
              </section>
            )}

            {tab === "addresses" && (
              <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-brand-950">Saved Addresses</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {savedAddresses.map((a) => (
                    <div key={a.label} className="rounded-xl border border-brand-100 p-4">
                      <div className="flex items-center justify-between">
                        <Badge>{a.label}</Badge>
                        <button className="text-xs font-semibold text-brand-600 underline">
                          Edit
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-brand-800">{a.line}</p>
                      <p className="text-xs text-brand-400">
                        {a.district}, {a.region}
                      </p>
                    </div>
                  ))}
                </div>
                <button className="mt-4 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                  + Add New Address
                </button>
              </section>
            )}

            {tab === "settings" && (
              <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-brand-950">Account Settings</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-900">Full Name</label>
                    <input
                      defaultValue="Guest Customer"
                      className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-900">Phone</label>
                    <input
                      defaultValue="+255 712 345 678"
                      className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-900">Email</label>
                    <input
                      type="email"
                      defaultValue="guest@example.com"
                      className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-700">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-600" />
                    Receive order updates via WhatsApp
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-700">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-600" />
                    Receive promotions & health tips
                  </label>
                </div>
                <button className="mt-6 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                  Save Changes
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
