"use client";

import { useEffect, useState } from "react";
import { PackagePlus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: string;
  category: { name: string } | null;
}

export function AdminInventory() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (lowStockOnly) params.set("lowStock", "1");
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load inventory");
      setProducts(data.products);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lowStockOnly]);

  const restock = async (p: Product, amount: number) => {
    setSavingId(p.id);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "quick", stock: p.stock + amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restock failed");
      toast(`Restocked ${p.name} (+${amount})`, "success");
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter((p) =>
    search.trim() ? p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) : true
  );

  const lowCount = products.filter((p) => p.status === "ACTIVE" && p.stock <= p.lowStockThreshold).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Inventory</h1>
          <p className="mt-1 text-sm text-ink/55">
            {products.length} product{products.length === 1 ? "" : "s"} ·{" "}
            <span className={lowCount > 0 ? "font-semibold text-amber-600" : "text-ink/55"}>
              {lowCount} low stock
            </span>
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink/70">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          Low stock only
        </label>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="mt-5 flex max-w-md gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name or SKU..."
            className="input w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </form>

      <div className="mt-5 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-ink/50">Loading inventory...</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">SKU</th>
                  <th className="px-5 py-3 font-semibold">In stock</th>
                  <th className="px-5 py-3 font-semibold">Low-stock threshold</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Quick restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((p) => {
                  const isLow = p.status === "ACTIVE" && p.stock <= p.lowStockThreshold;
                  const isOut = p.stock === 0 || p.status === "OUT_OF_STOCK";
                  return (
                    <tr key={p.id} className={cn("hover:bg-slate-50", isLow && "bg-amber-50/60")}>
                      <td className="px-5 py-3 font-semibold text-brand-950">{p.name}</td>
                      <td className="px-5 py-3 font-mono text-xs text-ink/60">{p.sku}</td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "font-mono text-base font-bold",
                            isOut ? "text-red-600" : isLow ? "text-amber-600" : "text-ink/80"
                          )}
                        >
                          {p.stock}
                        </span>
                        {isLow && (
                          <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            {isOut ? "Out of stock" : "Low stock"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-ink/60">{p.lowStockThreshold}</td>
                      <td className="px-5 py-3 text-ink/70">{p.status.replace(/_/g, " ")}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {[10, 25, 50].map((n) => (
                            <button
                              key={n}
                              onClick={() => restock(p, n)}
                              disabled={savingId === p.id}
                              className="btn-outline px-3 py-1.5 text-xs disabled:opacity-50"
                            >
                              <PackagePlus className="h-3.5 w-3.5" /> +{n}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
