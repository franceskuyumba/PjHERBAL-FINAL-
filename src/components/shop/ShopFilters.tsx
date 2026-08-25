"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";
import { trackClientEvent } from "@/lib/client-analytics";

export interface FilterCategory {
  slug: string;
  name: string;
}

export interface ShopFiltersProps {
  categories: FilterCategory[];
  maxPossiblePrice: number;
}

export function ShopFilters({ categories, maxPossiblePrice }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [, startTransition] = useTransition();

  const sortOptions = [
    { value: "featured", label: t("shop.sortFeatured") },
    { value: "newest", label: t("shop.sortNewest") },
    { value: "price-asc", label: t("shop.sortPriceAsc") },
    { value: "price-desc", label: t("shop.sortPriceDesc") },
    { value: "rating", label: t("shop.sortTopRated") },
    { value: "best-selling", label: t("shop.sortBestSelling") },
  ];

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
        <label className="label">{t("shop.searchLabel")}</label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget).get("q") as string;
            updateParams({ search: v });
            trackClientEvent("search", { query: v });
          }}
          className="flex items-center gap-2 rounded-full border border-ink/[0.06] bg-white px-4 py-2.5 shadow-soft"
        >
          <Search className="h-4 w-4 text-ink/40" />
          <input
            name="q"
            defaultValue={search}
            placeholder={t("shop.searchPlaceholder")}
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </form>
      </div>

      <div>
        <label className="label">{t("shop.category")}</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams({ category: null })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              category === "" ? "bg-brand-600 text-white shadow-soft" : "bg-white text-ink-muted hover:bg-sage-50 hover:text-brand-700 border border-ink/[0.06]"
            )}
          >
            {t("shop.all")}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => updateParams({ category: c.slug })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                category === c.slug ? "bg-brand-600 text-white shadow-soft" : "bg-white text-ink-muted hover:bg-sage-50 hover:text-brand-700 border border-ink/[0.06]"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">{t("shop.sortBy")}</label>
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
        <label className="label">{t("shop.maxPrice")}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input"
            placeholder={t("shop.any")}
          />
          <button onClick={applyPrice} className="btn-outline btn-sm shrink-0">{t("shop.apply")}</button>
        </div>
      </div>

      {activeFilters > 0 && (
        <button onClick={clearAll} className="btn-ghost btn-sm w-full text-red-600 hover:bg-red-50">
          <X className="h-4 w-4" />
          {t("shop.clearAll").replace("{count}", String(activeFilters))}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-ink/[0.04] bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">{t("shop.filters")}</h3>
            <span className={cn("rounded-full bg-sage-50 px-2.5 py-1 text-xs font-bold text-sage-700", pending && "animate-pulse")}>
              {pending ? "..." : `${activeFilters} ${t("shop.filtersActive")}`}
            </span>
          </div>
          {filterControls}
          <div className="mt-8 rounded-2xl border border-dashed border-gold-300/50 bg-gold-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-600">{t("shop.clinicalPromise")}</p>
            <p className="mt-3 text-xs leading-5 text-ink-muted">{t("shop.clinicalPromiseText")}</p>
          </div>
        </div>
      </aside>

      {/* Mobile filter button + drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="btn-outline btn-sm mb-5 w-full"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("shop.filters")} {activeFilters > 0 && `(${activeFilters})`}
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
                className="fixed right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white"
              >
                <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
                  <h3 className="font-display text-lg font-bold text-ink">{t("shop.filters")}</h3>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-ink-muted hover:text-ink"
                    aria-label={t("shop.closeFilters")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  {filterControls}
                </div>
                <div className="border-t border-ink/[0.06] p-4">
                  <button onClick={() => setDrawerOpen(false)} className="btn-primary btn-md w-full">
                    {t("shop.showResults")}
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
