"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { formatTZS, formatDateTime } from "@/lib/utils";
import { StatusBadge, PaymentStatusBadge } from "@/components/dashboard/StatusBadge";
import { ORDER_STATUSES } from "@/lib/constants";
import { useI18n } from "@/context/LanguageContext";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}

export function AdminOrdersTable() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.orders.title")}</h1>
      <p className="mt-1 text-sm text-ink/55">{t("admin.orders.count").replace("{count}", String(orders.length))}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">{t("admin.orders.allStatuses")}</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <form
          className="flex max-w-md flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("admin.orders.searchPlaceholder")}
              className="input w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <button type="submit" className="btn-outline btn-sm">
            {t("admin.orders.search")}
          </button>
        </form>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin.orders.loading")}</p>
        ) : orders.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin.orders.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3 font-semibold">{t("admin.orders.colOrder")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.orders.colCustomer")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.orders.colDate")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.orders.colItems")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.orders.colTotal")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.orders.colStatus")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-mono font-semibold text-brand-700 hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-brand-950">{o.customerName}</p>
                      <p className="text-xs text-ink/40">{o.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3 text-ink/50">{formatDateTime(o.createdAt)}</td>
                    <td className="px-5 py-3 text-ink/70">
                      {o.items.reduce((n, i) => n + i.quantity, 0)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-brand-950">{formatTZS(o.total)}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={o.status} />
                        <PaymentStatusBadge status={o.paymentStatus} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
