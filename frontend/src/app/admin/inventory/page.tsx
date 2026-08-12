"use client";

import { useMemo, useState } from "react";
import { Search, AlertTriangle, PackagePlus, Layers } from "lucide-react";
import { adminProducts, formatTZS } from "@/lib/data/admin";
import Badge from "@/components/ui/Badge";

export default function AdminInventoryPage() {
  const [query, setQuery] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);

  const filtered = useMemo(() => {
    let list = adminProducts;
    if (onlyLow) list = list.filter((p) => p.lowStock);
    if (query) list = list.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [query, onlyLow]);

  const lowCount = adminProducts.filter((p) => p.lowStock).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Inventory Management</h1>
          <p className="mt-1 text-sm text-brand-500">Track stock levels, low-stock alerts and batches.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
          <PackagePlus className="h-4 w-4" /> Add Stock
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-bold text-brand-950">{adminProducts.length}</p>
          <p className="text-xs text-brand-500">Products tracked</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-bold text-brand-950">
            {adminProducts.reduce((s, p) => s + p.stock, 0)}
          </p>
          <p className="text-xs text-brand-500">Units in stock</p>
        </div>
        <div className="rounded-2xl border border-gold-200 bg-gold-50 p-5 shadow-card">
          <p className="font-display text-2xl font-bold text-gold-700">{lowCount}</p>
          <p className="flex items-center gap-1 text-xs text-gold-700">
            <AlertTriangle className="h-3.5 w-3.5" /> Low stock alerts
          </p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-bold text-brand-950">
            {formatTZS(adminProducts.reduce((s, p) => s + p.price * p.stock, 0))}
          </p>
          <p className="text-xs text-brand-500">Inventory value</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inventory..."
            className="w-full rounded-full border border-brand-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2.5 text-sm font-medium text-brand-700">
          <input
            type="checkbox"
            checked={onlyLow}
            onChange={(e) => setOnlyLow(e.target.checked)}
            className="h-4 w-4 rounded accent-brand-600"
          />
          Show low stock only
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 bg-brand-50/50 text-xs uppercase tracking-wider text-brand-400">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">SKU</th>
                <th className="px-5 py-3 font-semibold">Current Stock</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock Value</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Batch</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-brand-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 font-display text-xs font-bold text-brand-700">
                        {p.title.slice(0, 2).toUpperCase()}
                      </span>
                      <p className="font-semibold text-brand-900">{p.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-brand-500">{p.id.toUpperCase()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-brand-100">
                        <div
                          className={`h-full rounded-full ${p.lowStock ? "bg-red-400" : "bg-brand-500"}`}
                          style={{ width: `${Math.min(100, p.stock)}%` }}
                        />
                      </div>
                      <span className={`text-sm ${p.lowStock ? "font-bold text-red-600" : "text-brand-700"}`}>
                        {p.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-brand-700">{formatTZS(p.price)}</td>
                  <td className="px-5 py-3 font-semibold text-brand-900">{formatTZS(p.price * p.stock)}</td>
                  <td className="px-5 py-3">
                    {p.lowStock ? (
                      <Badge variant="red">Low Stock</Badge>
                    ) : (
                      <Badge variant="green">Healthy</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 text-xs text-brand-500">
                      <Layers className="h-3.5 w-3.5" /> B-2026-0{p.id.slice(1)}
                    </span>
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
