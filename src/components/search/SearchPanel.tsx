"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Loader2, PackageSearch, Search, Trash2, TrendingUp, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductCardProduct } from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { cn, formatTZS } from "@/lib/utils";

const RECENT_KEY = "pjherbal:recent-searches";

const POPULAR = ["moringa", "male vitality", "black seed oil", "energy", "weight loss", "immune", "collagen", "slim"];

interface SearchCategory {
  slug: string;
  name: string;
}

interface SearchArticle {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
}

interface SearchResults {
  products: ProductCardProduct[];
  categories: SearchCategory[];
  articles: SearchArticle[];
}

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]).filter(Boolean).slice(0, 6) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6)));
  } catch {
    /* ignore */
  }
}

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { addItem } = useCart();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setRecent(readRecent());
      setQuery("");
      setResults(null);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setResults(null);
    setLoading(false);
  }, [pathname]);

  const runSearch = useCallback((q: string) => {
    abortRef.current?.abort();
    if (!q.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: SearchResults) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => runSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const remember = (q: string) => {
    const value = q.trim();
    if (!value) return;
    setRecent((prev) => {
      const next = [value, ...prev.filter((r) => r.toLowerCase() !== value.toLowerCase())].slice(0, 6);
      writeRecent(next);
      return next;
    });
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "search", data: JSON.stringify({ query: value }) }),
    }).catch(() => {});
  };

  const go = (href: string, q?: string) => {
    if (q) remember(q);
    onClose();
    router.push(href);
  };

  const goShopResults = () => go(`/shop?search=${encodeURIComponent(query.trim())}`, query);

  const quickAdd = (product: ProductCardProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock,
    });
  };

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;
  const productCount = results?.products.length ?? 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90]"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mx-auto w-full max-w-3xl px-3 pt-3 sm:pt-8"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-ink/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (trimmed) goShopResults();
                }}
                className="flex items-center gap-3 border-b border-ink/5 px-4 py-3.5"
              >
                <Search className="h-5 w-5 shrink-0 text-brand-600" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories and wellness topics..."
                  aria-label="Search products, categories and wellness topics"
                  className="w-full bg-transparent text-[15px] text-ink focus:outline-none sm:text-base"
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink/40 hover:bg-ink/5 hover:text-ink/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button type="submit" className="btn-primary btn-sm hidden shrink-0 sm:inline-flex">
                  Search
                </button>
              </form>

              <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-sm text-ink/50">
                    <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
                    Searching the wellness collection...
                  </div>
                ) : hasQuery && results && productCount === 0 && results.categories.length === 0 && results.articles.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <PackageSearch className="h-10 w-10 text-ink/20" />
                    <p className="font-display text-base font-bold text-brand-950">No results for &ldquo;{trimmed}&rdquo;</p>
                    <p className="max-w-sm text-sm text-ink/55">
                      Try a different keyword, or browse our full collection.
                    </p>
                    <Link href="/shop" onClick={() => go("/shop")} className="btn-outline btn-sm mt-2">
                      Browse all products
                    </Link>
                  </div>
                ) : hasQuery && results ? (
                  <div className="p-4 sm:p-5">
                    {results.products.length > 0 && (
                      <div>
                        <SectionLabel>Products</SectionLabel>
                        <div className="space-y-1">
                          {results.products.map((p) => (
                            <Link
                              key={p.id}
                              href={`/product/${p.slug}`}
                              onClick={() => go(`/product/${p.slug}`, trimmed)}
                              className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-brand-50"
                            >
                              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                                <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-brand-950 group-hover:text-brand-700">
                                  {p.name}
                                </span>
                                <span className="block truncate text-xs text-ink/50">{p.shortDescription}</span>
                              </span>
                              <span className="text-sm font-bold text-brand-700">{formatTZS(p.price)}</span>
                              <button
                                onClick={(e) => quickAdd(p, e)}
                                aria-label={`Add ${p.name} to cart`}
                                className="btn-primary btn-sm shrink-0"
                              >
                                Add
                              </button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.categories.length > 0 && (
                      <div className="mt-5">
                        <SectionLabel>Categories</SectionLabel>
                        <div className="flex flex-wrap gap-2">
                          {results.categories.map((c) => (
                            <button
                              key={c.slug}
                              onClick={() => go(`/category/${c.slug}`)}
                              className="chip chip-active"
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.articles.length > 0 && (
                      <div className="mt-5">
                        <SectionLabel>Wellness articles</SectionLabel>
                        <div className="space-y-1">
                          {results.articles.map((a) => (
                            <Link
                              key={a.slug}
                              href={`/blog/${a.slug}`}
                              onClick={() => go(`/blog/${a.slug}`, trimmed)}
                              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gold-50"
                            >
                              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                                <FileText className="h-5 w-5" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-brand-950">{a.title}</span>
                                <span className="block truncate text-xs text-ink/50">{a.excerpt}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 sm:p-5">
                    {recent.length > 0 && (
                      <div className="mb-5">
                        <div className="mb-2 flex items-center justify-between">
                          <SectionLabel>Recent searches</SectionLabel>
                          <button
                            onClick={() => {
                              writeRecent([]);
                              setRecent([]);
                            }}
                            className="flex items-center gap-1 text-xs font-semibold text-ink/40 transition-colors hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recent.map((r) => (
                            <button
                              key={r}
                              onClick={() => {
                                setQuery(r);
                                runSearch(r);
                              }}
                              className="chip"
                            >
                              <Search className="h-3.5 w-3.5" />
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-5">
                      <SectionLabel>Popular right now</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR.map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setQuery(p);
                              runSearch(p);
                            }}
                            className="chip"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <SectionLabel>Browse categories</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORY_LINKS.map((c) => (
                          <Link key={c.href} href={c.href} onClick={() => go(c.href)} className="chip">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {results?.products.length ? (
                      <div>
                        <div className="mb-2 flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4 text-brand-600" />
                          <SectionLabel>Trending products</SectionLabel>
                        </div>
                        <div className="space-y-1">
                          {results.products.map((p) => (
                            <Link
                              key={p.id}
                              href={`/product/${p.slug}`}
                              onClick={() => go(`/product/${p.slug}`)}
                              className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-brand-50"
                            >
                              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                                <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-brand-950 group-hover:text-brand-700">
                                  {p.name}
                                </span>
                                <span className="block truncate text-xs text-ink/50">{p.categoryName}</span>
                              </span>
                              <span className="text-sm font-bold text-brand-700">{formatTZS(p.price)}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-xs text-brand-800">
                        <Search className="h-4 w-4 shrink-0" />
                        Start typing to search products, categories and wellness articles instantly.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {hasQuery && (
                <div className="border-t border-ink/5 px-4 py-3">
                  <button
                    onClick={goShopResults}
                    className="w-full text-center text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
                  >
                    See all results for &ldquo;{trimmed}&rdquo; →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={cn("mb-2 text-[11px] font-bold uppercase tracking-widest text-ink/40")}>{children}</p>
  );
}

const CATEGORY_LINKS = [
  { label: "Men's Wellness", href: "/category/mens-health" },
  { label: "Women's Wellness", href: "/category/womens-wellness" },
  { label: "Energy & Immunity", href: "/category/energy-immunity" },
  { label: "Weight Management", href: "/category/weight-management" },
  { label: "Brain & Focus", href: "/category/brain-focus" },
  { label: "Digestion & Detox", href: "/category/detox-digestion" },
  { label: "All Products", href: "/shop" },
];
