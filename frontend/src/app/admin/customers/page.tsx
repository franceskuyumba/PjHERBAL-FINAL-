"use client";

import { useMemo, useState } from "react";
import { Search, Phone, Mail, MapPin, MessageCircle, UserPlus } from "lucide-react";
import { adminCustomers, formatTZS } from "@/lib/data/admin";
import Badge from "@/components/ui/Badge";
import { SITE } from "@/lib/constants";

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"spent" | "orders" | "newest">("spent");

  const filtered = useMemo(() => {
    let list = adminCustomers;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    if (sort === "spent") list = [...list].sort((a, b) => b.spent - a.spent);
    if (sort === "orders") list = [...list].sort((a, b) => b.orders - a.orders);
    if (sort === "newest") list = [...list].sort((a, b) => b.joined.localeCompare(a.joined));
    return list;
  }, [query, sort]);

  const totalSpent = adminCustomers.reduce((s, c) => s + c.spent, 0);
  const avgOrderValue = Math.round(totalSpent / adminCustomers.reduce((s, c) => s + c.orders, 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Customers</h1>
          <p className="mt-1 text-sm text-brand-500">Manage your customer base and view purchase history.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
          <UserPlus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-bold text-brand-950">{adminCustomers.length}</p>
          <p className="text-xs text-brand-500">Total customers</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-bold text-brand-950">{formatTZS(totalSpent)}</p>
          <p className="text-xs text-brand-500">Lifetime value</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-bold text-brand-950">{formatTZS(avgOrderValue)}</p>
          <p className="text-xs text-brand-500">Avg order value</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-bold text-brand-950">
            {(adminCustomers.reduce((s, c) => s + c.orders, 0) / adminCustomers.length).toFixed(1)}
          </p>
          <p className="text-xs text-brand-500">Avg orders / customer</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full rounded-full border border-brand-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="rounded-full border border-brand-200 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="spent">Sort: Highest spend</option>
          <option value="orders">Sort: Most orders</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 bg-brand-50/50 text-xs uppercase tracking-wider text-brand-400">
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Orders</th>
                <th className="px-5 py-3 font-semibold">Total Spent</th>
                <th className="px-5 py-3 font-semibold">Member Since</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-brand-50 transition hover:bg-brand-50/40 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-sm font-bold text-white">
                        {c.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-semibold text-brand-900">{c.name}</p>
                        <p className="text-xs text-brand-400">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-brand-600">
                      <MapPin className="h-3.5 w-3.5" /> {c.location}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline">{c.orders} orders</Badge>
                  </td>
                  <td className="px-5 py-3 font-semibold text-brand-900">{formatTZS(c.spent)}</td>
                  <td className="px-5 py-3 text-brand-500">{c.joined}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      <a
                        href={`tel:${c.phone}`}
                        aria-label={`Call ${c.name}`}
                        className="rounded-lg border border-brand-200 p-2 text-brand-600 transition hover:bg-brand-50"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                      <a
                        href={`mailto:${c.email}`}
                        aria-label={`Email ${c.name}`}
                        className="rounded-lg border border-brand-200 p-2 text-brand-600 transition hover:bg-brand-50"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hello ${c.name}! Thanks for shopping with AfyaPlus.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${c.name}`}
                        className="rounded-lg bg-[#25D366]/10 p-2 text-[#1fb958] transition hover:bg-[#25D366] hover:text-white"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
