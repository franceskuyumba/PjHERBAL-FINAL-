"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  AlertTriangle,
  Package,
  PackageCheck,
  Users,
  Wallet,
} from "lucide-react";
import { formatTZS, formatDate } from "@/lib/utils";
import { StatusBadge, PaymentStatusBadge } from "@/components/dashboard/StatusBadge";
import { useI18n } from "@/context/LanguageContext";

interface Stats {
  totalSales: number;
  orders: number;
  customers: number;
  products: number;
  pendingOrders: number;
  lowStockCount: number;
  cashSales?: { count: number; total: number };
}

interface SalesPoint {
  label: string;
  total: number;
  orders: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export function AdminDashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);
  const [sales, setSales] = useState<SalesPoint[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<{ id: string; name: string; stock: number }[]>([]);
  const [reportFrom, setReportFrom] = useState("");
  const [reportTo, setReportTo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setSales(d.salesOverTime || []);
        setOrders(d.recentOrders || []);
        setLowStock(d.lowStock || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="py-16 text-center text-sm text-ink/50">{t("admin.dashboard.loading")}</p>;

  const maxSale = Math.max(1, ...sales.map((s) => s.total));
  const cardData = [
    { label: t("admin.dashboard.totalSales"), value: formatTZS(stats?.totalSales || 0), icon: Wallet, accent: "text-emerald-600" },
    { label: t("admin.dashboard.orders"), value: String(stats?.orders || 0), icon: PackageCheck, accent: "text-blue-600" },
    { label: t("admin.dashboard.customers"), value: String(stats?.customers || 0), icon: Users, accent: "text-violet-600" },
    { label: t("admin.dashboard.products"), value: String(stats?.products || 0), icon: Package, accent: "text-amber-600" },
    { label: t("admin.report.approvedCash"), value: formatTZS(stats?.cashSales?.total || 0), icon: Wallet, accent: "text-gold-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.dashboard.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin.dashboard.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={reportFrom} onChange={(event) => setReportFrom(event.target.value)} className="input h-9 text-xs" aria-label={t("admin.report.from")} />
          <input type="date" value={reportTo} onChange={(event) => setReportTo(event.target.value)} className="input h-9 text-xs" aria-label={t("admin.report.to")} />
          <a href={`/api/admin/reports/export${reportFrom || reportTo ? `?${new URLSearchParams({ ...(reportFrom ? { from: reportFrom } : {}), ...(reportTo ? { to: reportTo } : {}) }).toString()}` : ""}`} className="btn-outline btn-sm">{t("admin.report.download")}</a>
          <a href={`/admin/reports${reportFrom || reportTo ? `?${new URLSearchParams({ ...(reportFrom ? { from: reportFrom } : {}), ...(reportTo ? { to: reportTo } : {}) }).toString()}` : ""}`} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">{t("admin.report.print")}</a>
          <Link href="/admin/products/new" className="btn-primary btn-sm">+ {t("admin.dashboard.newProduct")}</Link>
        </div>
      </div>

      {stats && stats.pendingOrders > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            {t("admin.dashboard.pendingAlert")
              .replace("{count}", String(stats.pendingOrders))
              .replace("{plural}", stats.pendingOrders > 1 ? "s" : "")}{" "}
            <Link href="/admin/orders" className="font-semibold underline">
              {t("admin.dashboard.reviewNow")}
            </Link>
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cardData.map((c) => (
          <div key={c.label} className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <c.icon className={`h-5 w-5 ${c.accent}`} />
            <p className="mt-3 text-xl font-bold text-brand-950">{c.value}</p>
            <p className="text-xs text-ink/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-brand-950">{t("admin.dashboard.salesTitle")}</h2>
          <div className="mt-6 flex h-48 items-end gap-1.5">
            {sales.map((s) => (
              <div key={s.label} className="group relative flex flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t-md bg-brand-600/80 transition-colors group-hover:bg-brand-600"
                  style={{ height: `${Math.max(3, (s.total / maxSale) * 100)}%` }}
                  title={`${s.label}: ${formatTZS(s.total)}`}
                />
                <span className="mt-1 hidden text-[10px] text-ink/40 md:block">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink/45">
            {t("admin.dashboard.salesTotal")
              .replace("{total}", formatTZS(sales.reduce((sum, s) => sum + s.total, 0)))
              .replace("{orders}", String(sales.reduce((sum, s) => sum + s.orders, 0)))}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-brand-950">{t("admin.dashboard.lowStockTitle")}</h2>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-ink/45">{t("admin.dashboard.allStocked")}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-brand-950">{p.name}</span>
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">
                    {t("admin.dashboard.left").replace("{count}", String(p.stock))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-950">{t("admin.dashboard.recentOrders")}</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
            {t("admin.dashboard.viewAll")} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-ink/45">{t("admin.dashboard.noOrders")}</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="w-full overflow-x-auto"><table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
                  <th className="pb-3 pr-4 font-semibold">{t("admin.dashboard.colOrder")}</th>
                  <th className="pb-3 pr-4 font-semibold">{t("admin.dashboard.colCustomer")}</th>
                  <th className="pb-3 pr-4 font-semibold">{t("admin.dashboard.colDate")}</th>
                  <th className="pb-3 pr-4 font-semibold">{t("admin.dashboard.colTotal")}</th>
                  <th className="pb-3 pr-4 font-semibold">{t("admin.dashboard.colStatus")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <Link href={`/admin/orders/${o.id}`} className="font-mono font-semibold text-brand-700 hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-ink/70">{o.customerName}</td>
                    <td className="py-3 pr-4 text-ink/50">{formatDate(o.createdAt)}</td>
                    <td className="py-3 pr-4 font-semibold text-brand-950">{formatTZS(o.total)}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={o.status} />
                        <PaymentStatusBadge status={o.paymentStatus} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </div>
    </div>
  );
}
