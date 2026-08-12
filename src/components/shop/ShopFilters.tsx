"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackClientEvent } from "@/lib/client-analytics";

export interface FilterCategory {
  slug: string;
  name: string;
}

export interface ShopFiltersProps {
  categories: FilterCategory[];
  maxPossiblePrice: number;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "best-selling", label: "Best Selling" },
];

export function ShopFilters({ categories, maxPossiblePrice }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "featured";
  const [minPrice] = useState(searchParams.get("min") || "0");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || String(maxPossiblePrice));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      params.delete("page");
      startTransition(() => {
        setPending(true);
        router.replace(`${pathname}?${params.toString()}`);
        setTimeout(() => setPending(false), 400);
      });
    },
    [router, pathname, searchParams]
  );

  const applyPrice = () => {
    updateParams({ min: minPrice && Number(minPrice) > 0 ? minPrice : null, max: maxPrice && Number(maxPrice) > 0 ? maxPrice : null });
  };

  const clearAll = () => {
    router.replace(pathname);
    setMaxPrice(String(maxPossiblePrice));
  };

  const activeFilters = useMemo(() => {
    const count =
      (search ? 1 : 0) + (category ? 1 : 0) + (minPrice && Number(minPrice) > 0 ? 1 : 0) +
      (maxPrice && Number(maxPrice) > 0 && Number(maxPrice) < maxPossiblePrice ? 1 : 0);
    return count;
  }, [search, category, minPrice, maxPrice, maxPossiblePrice]);

  const filterControls = (
    <div className="space-y-6">
      <div>
        <label className="label">Search</label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget).get("q") as string;
            updateParams({ search: v });
            trackClientEvent("search", { query: v });
          }}
          className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5"
        >
          <Search className="h-4 w-4 text-ink/40" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </form>
      </div>

      <div>
        <label className="label">Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams({ category: null })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              category === "" ? "bg-brand-600 text-white" : "bg-white text-ink/70 hover:bg-brand-50 hover:text-brand-700 border border-ink/10"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => updateParams({ category: c.slug })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                category === c.slug ? "bg-brand-600 text-white" : "bg-white text-ink/70 hover:bg-brand-50 hover:text-brand-700 border border-ink/10"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Sort by</label>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="input"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Max price (TZS)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input"
            placeholder="Any"
          />
          <button onClick={applyPrice} className="btn-outline btn-sm shrink-0">Apply</button>
        </div>
      </div>

      {activeFilters > 0 && (
        <button onClick={clearAll} className="btn-ghost btn-sm w-full text-red-600 hover:bg-red-50">
          <X className="h-4 w-4" />
          Clear all filters ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="card sticky top-24 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-brand-950">Filters</h3>
            <span className={cn("badge bg-brand-50 text-brand-700", pending && "animate-pulse")}>
              {pending ? "..." : `${activeFilters} active`}
            </span>
          </div>
          {filterControls}
        </div>
      </aside>

      {/* Mobile filter button + drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="btn-outline btn-sm mb-5 w-full"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters {activeFilters > 0 && `(${activeFilters})`}
        </button>
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              className="fixed inset-0 z-[85] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-cream"
              >
                <div className="flex items-center justify-between border-b border-ink/5 px-5 py-4">
                  <h3 className="font-display text-lg font-bold text-brand-950">Filters</h3>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink/60"
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  {filterControls}
                </div>
                <div className="border-t border-ink/5 p-4">
                  <button onClick={() => setDrawerOpen(false)} className="btn-primary btn-md w-full">
                    Show results
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
