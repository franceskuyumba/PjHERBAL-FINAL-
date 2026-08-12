"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { adminOrders, adminCustomers, monthlyRevenue } from "@/lib/data/admin";
import Badge from "@/components/ui/Badge";

const statusColor: Record<string, "gold" | "green" | "outline" | "red" | "dark"> = {
  pending: "gold",
  paid: "green",
  processing: "outline",
  dispatched: "green",
  delivered: "dark",
  cancelled: "red",
};

export default function AdminDashboardPage() {
  const stats = [
    { label: "Revenue (This Month)", value: "TZS 18.9M", change: "+15.2%", up: true, icon: DollarSign },
    { label: "Total Orders", value: "402", change: "+16.8%", up: true, icon: ShoppingBag },
    { label: "Customers", value: "1,284", change: "+9.4%", up: true, icon: Users },
    { label: "Conversion Rate", value: "4.2%", change: "+0.6%", up: true, icon: TrendingUp },
  ];

  const pendingOrders = adminOrders.filter((o) => o.status === "pending" || o.status === "paid");
  const lowStock = [
    { title: "Power Protein Mass Gainer", stock: 8 },
    { title: "MindZen Nootropic Brain Boost", stock: 12 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-950">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-brand-500">Welcome back! Here's your store performance today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <s.icon className="h-5 w-5" />
              </span>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? "text-brand-600" : "text-red-500"}`}>
                {s.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {s.change}
              </span>
            </div>
            <p className="mt-4 font-display text-xl font-bold text-brand-950">{s.value}</p>
            <p className="mt-0.5 text-xs text-brand-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts + side */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-950">Revenue Trend</h2>
            <span className="text-xs text-brand-400">Last 7 months (TZS millions)</span>
          </div>
          <div className="mt-6 flex h-56 items-end gap-3 sm:gap-5">
            {monthlyRevenue.map((m, i) => (
              <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-brand-500 opacity-0 transition group-hover:opacity-100">
                  {m.revenue}M
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all group-hover:from-brand-700 group-hover:to-brand-500"
                  style={{ height: `${(m.revenue / 20) * 100}%`, minHeight: 12 }}
                />
                <span className="text-xs text-brand-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions / alerts */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-950">
              <AlertTriangle className="h-5 w-5 text-gold-500" /> Low Stock Alerts
            </h2>
            <div className="mt-4 space-y-3">
              {lowStock.map((p) => (
                <div key={p.title} className="flex items-center justify-between rounded-xl border border-gold-100 bg-gold-50/60 p-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-900">{p.title}</p>
                    <p className="text-xs text-gold-700">Only {p.stock} left in stock</p>
                  </div>
                  <Link href="/admin/inventory" className="rounded-full bg-gold-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-600">
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-base font-bold text-brand-950">Pending Actions</h2>
            <div className="mt-4 space-y-3">
              {pendingOrders.map((o) => (
                <Link
                  key={o.id}
                  href="/admin/orders"
                  className="flex items-center justify-between rounded-xl border border-brand-100 p-3 transition hover:border-brand-300"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-900">#{o.orderNumber}</p>
                    <p className="text-xs text-brand-400">{o.customer.name}</p>
                  </div>
                  <Badge variant={statusColor[o.status]}>{o.status}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-brand-950">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-800">
            View all →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-xs uppercase tracking-wider text-brand-400">
                <th className="pb-3 pr-4 font-semibold">Order</th>
                <th className="pb-3 pr-4 font-semibold">Customer</th>
                <th className="pb-3 pr-4 font-semibold">Date</th>
                <th className="pb-3 pr-4 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminOrders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-b border-brand-50 last:border-0">
                  <td className="py-3 pr-4 font-semibold text-brand-900">#{o.orderNumber}</td>
                  <td className="py-3 pr-4 text-brand-600">{o.customer.name}</td>
                  <td className="py-3 pr-4 text-brand-500">
                    {new Date(o.createdAt).toLocaleDateString("en-TZ", { dateStyle: "medium" })}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-brand-900">
                    {o.total.toLocaleString()} TZS
                  </td>
                  <td className="py-3">
                    <Badge variant={statusColor[o.status]}>{o.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top products */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-950">
            <Package className="h-5 w-5 text-brand-600" /> Top Selling Products
          </h2>
          <Link href="/admin/products" className="text-sm font-semibold text-brand-600 hover:text-brand-800">
            Manage products →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "ImmunoGuard Vitamin C & Zinc", sold: 342, revenue: "8.55M" },
            { title: "Vital Man Herbal Capsules", sold: 214, revenue: "9.63M" },
            { title: "Omega 3 Fish Oil 1000mg", sold: 203, revenue: "8.12M" },
          ].map((p) => (
            <div key={p.title} className="flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/40 p-4">
              <div>
                <p className="text-sm font-semibold text-brand-900">{p.title}</p>
                <p className="text-xs text-brand-400">{p.sold} sold</p>
              </div>
              <span className="font-semibold text-brand-700">{p.revenue} TZS</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
