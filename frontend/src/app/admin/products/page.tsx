"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Pencil, MoreHorizontal, Eye, Copy } from "lucide-react";
import { adminProducts, formatTZS } from "@/lib/data/admin";
import Badge from "@/components/ui/Badge";

export default function AdminProductsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    let list = adminProducts;
    if (status !== "all") list = list.filter((p) => p.status === status);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    return list;
  }, [query, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Products</h1>
          <p className="mt-1 text-sm text-brand-500">{adminProducts.length} products in catalog</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-brand-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-full border border-brand-200 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 bg-brand-50/50 text-xs uppercase tracking-wider text-brand-400">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Sales</th>
                <th className="px-5 py-3 font-semibold">Revenue</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-brand-50 transition hover:bg-brand-50/40 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 font-display text-xs font-bold text-brand-700">
                        {p.title.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-brand-900">{p.title}</p>
                        <p className="text-xs text-brand-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 capitalize text-brand-600">{p.category.replace(/-/g, " ")}</td>
                  <td className="px-5 py-3 font-semibold text-brand-900">{formatTZS(p.price)}</td>
                  <td className="px-5 py-3">
                    <span className={p.lowStock ? "font-semibold text-red-600" : "text-brand-700"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-brand-700">{p.sales}</td>
                  <td className="px-5 py-3 font-semibold text-brand-900">{formatTZS(p.revenue)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={p.status === "active" ? "green" : p.status === "draft" ? "gold" : "outline"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button aria-label="Edit" className="rounded-lg p-2 text-brand-500 hover:bg-brand-50 hover:text-brand-700">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button aria-label="View" className="rounded-lg p-2 text-brand-500 hover:bg-brand-50 hover:text-brand-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button aria-label="More" className="rounded-lg p-2 text-brand-500 hover:bg-brand-50 hover:text-brand-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white p-4 text-sm text-brand-600">
        <Copy className="h-4 w-4 text-brand-500" />
        Tip: Product pages use SEO-friendly URLs like /product/{slug} with schema markup automatically generated.
      </div>
    </div>
  );
}
