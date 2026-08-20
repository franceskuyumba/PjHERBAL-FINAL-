"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { formatTZS, formatDate } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export function AdminCustomersTable() {
  const { t } = useI18n();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (q = "") => {
    setLoading(true);
    const res = await fetch(`/api/admin/customers${q ? `?search=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    setCustomers(data.customers || []);
    setLoading(false);
  };

  const toggleBlock = async (customer: Customer) => {
    const nextActive = !customer.isActive;
    if (!confirm(t("admin.security.confirmBlock").replace("{action}", nextActive ? t("admin.security.unblock") : t("admin.security.block")).replace("{name}", customer.name))) return;
    const res = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: nextActive }),
    });
    if (res.ok) load(search);
  };

  const sendSms = async (customer: Customer) => {
    if (!customer.phone) return alert("Customer has no phone number.");
    const message = prompt(`Send SMS to ${customer.name} (${customer.phone}):`);
    if (!message || !message.trim()) return;
    const res = await fetch("/api/admin/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: customer.phone, message: message.trim() }),
    });
    const data = await res.json().catch(() => null);
    alert(res.ok ? "SMS sent." : data?.error || "Could not send SMS.");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.customers.title")}</h1>
      <p className="mt-1 text-sm text-ink/55">{t("admin.customers.count").replace("{count}", String(customers.length))}</p>

      <form
        className="mt-5 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.customers.searchPlaceholder")}
            className="input w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <button type="submit" className="btn-outline btn-sm">
          {t("admin.customers.search")}
        </button>
      </form>

      <div className="mt-5 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin.customers.loading")}</p>
        ) : customers.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin.customers.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3 font-semibold">{t("admin.customers.colCustomer")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.customers.colContact")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.customers.colJoined")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.customers.colOrders")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.customers.colTotalSpent")}</th>
                  <th className="px-5 py-3 text-right font-semibold">{t("admin.security.heading")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-brand-950">{c.name}</p>
                      <p className="text-xs text-ink/40">{c.email}</p>
                    </td>
                    <td className="px-5 py-3 text-ink/70">{c.phone || "—"}</td>
                    <td className="px-5 py-3 text-ink/50">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-3 text-ink/70">{c.orderCount}</td>
                    <td className="px-5 py-3 font-semibold text-brand-950">{formatTZS(c.totalSpent)}</td>
                    <td className="px-5 py-3 text-right">
                      {c.phone && (
                        <>
                          <button onClick={() => sendSms(c)} className="mr-2 text-xs font-semibold text-brand-700 hover:underline">SMS</button>
                          <a className="mr-2 text-xs font-semibold text-brand-700 hover:underline" href={`https://wa.me/${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${c.name}, this is PJHERBAL Clinic regarding your order.`)}`} target="_blank" rel="noopener noreferrer">{t("admin.security.message")}</a>
                        </>
                      )}
                      <button onClick={() => toggleBlock(c)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${c.isActive ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{c.isActive ? t("admin.security.block") : t("admin.security.unblock")}</button>
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
