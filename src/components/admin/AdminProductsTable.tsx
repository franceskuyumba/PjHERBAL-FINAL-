"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { formatTZS } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  status: string;
  category: { name: string } | null;
}

export function AdminProductsTable() {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products${q ? `?search=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("admin.products.loadFailed"));
      setProducts(data.products);
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search);
  };

  const onDelete = async (id: string, name: string) => {
    if (!confirm(t("admin.products.deleteConfirm").replace("{name}", name))) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load(search);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.products.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin.products.count").replace("{count}", String(products.length))}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> {t("admin.products.newProduct")}
        </Link>
      </div>

      <form onSubmit={onSearch} className="mt-5 flex max-w-md gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.products.searchPlaceholder")}
            className="input w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <button type="submit" className="btn-outline btn-sm">
          {t("admin.products.search")}
        </button>
      </form>

      {errorMsg && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <div className="mt-5 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin.products.loading")}</p>
        ) : products.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin.products.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3 font-semibold">{t("admin.products.colProduct")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.products.colSku")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.products.colCategory")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.products.colPrice")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.products.colStock")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin.products.colStatus")}</th>
                  <th className="px-5 py-3 text-right font-semibold">{t("admin.products.colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/products/${p.id}/edit`} className="font-semibold text-brand-950 hover:text-brand-700">
                        {p.name}
                      </Link>
                      <p className="text-xs text-ink/40">/{p.slug}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink/60">{p.sku}</td>
                    <td className="px-5 py-3 text-ink/70">{p.category?.name || "—"}</td>
                    <td className="px-5 py-3 font-semibold text-brand-950">{formatTZS(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={p.stock === 0 ? "font-bold text-red-600" : p.stock <= p.lowStockThreshold ? "font-semibold text-amber-600" : "text-ink/70"}>
                        {p.stock}
                      </span>
                      {p.stock > 0 && p.stock <= p.lowStockThreshold && (
                        <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          {t("admin.products.lowStock")}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="flex h-8 items-center justify-center gap-1 rounded-lg px-2 text-ink/50 hover:bg-brand-50 hover:text-brand-700"
                          aria-label={t("admin.products.edit")}
                          title={t("admin.products.edit")}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="hidden text-xs font-semibold sm:inline">{t("admin.products.edit")}</span>
                        </Link>
                        <button
                          onClick={() => onDelete(p.id, p.name)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
                          aria-label={t("admin.products.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-slate-100 text-slate-700",
    DRAFT: "bg-amber-100 text-amber-800",
    OUT_OF_STOCK: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] || map.DRAFT}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
