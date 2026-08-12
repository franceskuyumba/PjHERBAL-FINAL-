"use client";

import { useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  MousePointerClick,
  DollarSign,
  ExternalLink,
  Timer,
} from "lucide-react";
import { monthlyRevenue, trafficSources, salesByCategory } from "@/lib/data/admin";

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30d");

  const kpis = [
    { icon: DollarSign, label: "Revenue", value: "TZS 18.9M", change: "+15.2%", up: true },
    { icon: ShoppingCart, label: "Orders", value: "402", change: "+16.8%", up: true },
    { icon: Users, label: "New Customers", value: "128", change: "+9.4%", up: true },
    { icon: MousePointerClick, label: "Conversion Rate", value: "4.2%", change: "+0.6%", up: true },
  ];

  const topPages = [
    { path: "/", views: "48,200", conv: "3.1%" },
    { path: "/shop", views: "32,900", conv: "5.4%" },
    { path: "/product/vital-man-herbal-capsules", views: "18,400", conv: "8.2%" },
    { path: "/product/gluco-trim-weight-loss-capsules", views: "15,800", conv: "7.6%" },
    { path: "/blog/how-to-boost-immunity-naturally-in-tanzania", views: "9,300", conv: "2.9%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Sales & Marketing Analytics</h1>
          <p className="mt-1 text-sm text-brand-500">
            Track sales, conversion, traffic sources and customer behavior.
          </p>
        </div>
        <div className="flex rounded-full border border-brand-200 bg-white p-1">
          {["7d", "30d", "90d", "1y"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                period === p ? "bg-brand-600 text-white" : "text-brand-600 hover:bg-brand-50"
              }`}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "1 Year"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <k.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-lg font-bold text-brand-950">{k.value}</p>
            <p className="text-xs text-brand-500">{k.label}</p>
            <p className={`mt-1 text-xs font-semibold ${k.up ? "text-brand-600" : "text-red-500"}`}>
              {k.change} vs previous period
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="font-display text-base font-bold text-brand-950">Revenue (TZS millions)</h2>
          <p className="text-xs text-brand-400">Last 7 months</p>
          <div className="mt-6 flex h-64 items-end gap-3 sm:gap-6">
            {monthlyRevenue.map((m, i) => (
              <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-brand-500 opacity-0 transition group-hover:opacity-100">
                  {m.revenue}M
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition group-hover:from-brand-700 group-hover:to-brand-500"
                  style={{ height: `${(m.revenue / 20) * 100}%`, minHeight: 14 }}
                />
                <span className="text-xs text-brand-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-bold text-brand-950">Traffic Sources</h2>
          <p className="text-xs text-brand-400">Where your customers come from</p>
          <div className="mt-6 space-y-4">
            {trafficSources.map((t) => (
              <div key={t.source}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-brand-800">{t.source}</span>
                  <span className="font-semibold text-brand-600">{t.pct}%</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-brand-50">
                  <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-brand-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-800">
              <Timer className="h-4 w-4 text-brand-600" /> Avg. session: 3m 24s
            </p>
            <p className="mt-1 text-xs text-brand-500">
              Mobile traffic: <span className="font-semibold">86%</span> • Desktop: 14%
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales by category */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-bold text-brand-950">Sales by Category</h2>
          <div className="mt-6 flex h-44 items-center justify-center">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                {(() => {
                  let offset = 0;
                  return salesByCategory.map((c) => {
                    const seg = (
                      <circle
                        key={c.name}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke={c.color}
                        strokeWidth="4"
                        strokeDasharray={`${c.value} ${100 - c.value}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += c.value;
                    return seg;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display text-lg font-bold text-brand-950">402</p>
                <p className="text-xs text-brand-400">Orders</p>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {salesByCategory.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-brand-700">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-semibold text-brand-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top pages */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="font-display text-base font-bold text-brand-950">Top Pages</h2>
          <p className="text-xs text-brand-400">Most visited pages and their conversion rates</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-100 text-xs uppercase tracking-wider text-brand-400">
                  <th className="pb-2 pr-4 font-semibold">Page</th>
                  <th className="pb-2 pr-4 font-semibold">Views</th>
                  <th className="pb-2 font-semibold">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.path} className="border-b border-brand-50 last:border-0">
                    <td className="py-2.5 pr-4">
                      <span className="flex items-center gap-2 font-medium text-brand-800">
                        <ExternalLink className="h-3.5 w-3.5 text-brand-400" />
                        <span className="font-mono text-xs">{p.path}</span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-semibold text-brand-900">{p.views}</td>
                    <td className="py-2.5 font-semibold text-brand-700">{p.conv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-gold-50 p-3 text-xs text-gold-800">
            <TrendingUp className="h-4 w-4 shrink-0" />
            Abandoned cart rate: <span className="font-bold">38%</span> — WhatsApp recovery campaigns recovering ~12% of these.
          </div>
        </div>
      </div>
    </div>
  );
}
