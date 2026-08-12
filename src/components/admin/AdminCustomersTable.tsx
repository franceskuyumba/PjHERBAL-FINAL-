"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { formatTZS, formatDate } from "@/lib/utils";

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

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">Customers</h1>
      <p className="mt-1 text-sm text-ink/55">{customers.length} registered customers</p>

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
            placeholder="Search name, email or phone..."
            className="input w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <button type="submit" className="btn-outline btn-sm">
          Search
        </button>
      </form>

      <div className="mt-5 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-ink/50">Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Orders</th>
                  <th className="px-5 py-3 font-semibold">Total spent</th>
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
