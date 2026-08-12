"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name A–Z" },
];

export default function ShopClient() {
  const params = useSearchParams();
  const query = (params.get("q") || "").toLowerCase();
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(100000);

  const filtered = useMemo(() => {
    let list: Product[] = products;
    if (query) {
      list = list.filter((p) =>
        [p.title, p.shortBenefits, p.description, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    list = list.filter((p) => p.price <= priceMax);

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [query, category, sort, inStockOnly, priceMax]);

  const activeFilters = (category !== "all" ? 1 : 0) + (inStockOnly ? 1 : 0);

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-display text-sm font-bold text-brand-950">Categories</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-lg px-3 py-2 text-left text-sm transition ${
              category === "all"
                ? "bg-brand-600 font-semibold text-white"
                : "text-brand-700 hover:bg-brand-50"
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                  category === c.slug
                    ? "bg-brand-600 font-semibold text-white"
                    : "text-brand-700 hover:bg-brand-50"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm font-bold text-brand-950">Availability</h3>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded accent-brand-600"
          />
          In stock only
        </label>
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm font-bold text-brand-950">
          Max Price: {priceMax.toLocaleString()} TZS
        </h3>
        <input
          type="range"
          min={20000}
          max={100000}
          step={5000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-cream">
      {/* Page hero */}
      <div className="bg-brand-950 py-10 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Shop Premium Supplements
          </h1>
          <p className="mt-3 text-sm text-brand-200 sm:text-base">
            {query
              ? `Search results for "${query}"`
              : "Authentic, doctor-approved products delivered anywhere in Tanzania."}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-brand-600">
            Showing <span className="font-bold text-brand-900">{filtered.length}</span> product{filtered.length !== 1 && "s"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  {activeFilters}
                </span>
              )}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 focus:border-brand-500 focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-brand-950">Filters</h2>
                {(activeFilters > 0 || priceMax < 100000) && (
                  <button
                    onClick={() => {
                      setCategory("all");
                      setInStockOnly(false);
                      setPriceMax(100000);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-red-500"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
              {FiltersPanel}
            </div>
          </aside>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 flex items-end lg:hidden">
              <div
                className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
                onClick={() => setFiltersOpen(false)}
              />
              <div className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-brand-950">Filters</h2>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Close filters"
                    className="rounded-full bg-brand-50 p-2 text-brand-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {FiltersPanel}
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="mt-6 w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white"
                >
                  Show {filtered.length} Products
                </button>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-white py-20 text-center">
                <p className="font-display text-lg font-bold text-brand-900">No products found</p>
                <p className="mt-2 max-w-sm text-sm text-brand-500">
                  Try adjusting your search or filters, or chat with a specialist on WhatsApp for personalized recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
