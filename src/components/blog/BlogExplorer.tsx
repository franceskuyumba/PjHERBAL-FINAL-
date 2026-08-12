"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, SearchX } from "lucide-react";
import { BlogCard, type BlogCardData } from "./BlogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface CategoryCount {
  name: string;
  count: number;
}

export function BlogExplorer({ posts, categories }: { posts: BlogCardData[]; categories: CategoryCount[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [searching, setSearching] = useState(false);
  const reduceMotion = useReducedMotion();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSearching(true);
    const t = setTimeout(() => setSearching(false), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && category === "All") return posts;
    return posts.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    });
  }, [posts, query, category]);

  const clear = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <section className="container-site pb-16 lg:pb-20">
      <div className="mx-auto max-w-2xl">
        <label className="relative block">
          <span className="sr-only">Search articles</span>
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wellness articles…"
            autoComplete="off"
            className="input w-full rounded-2xl py-4 pl-13 text-base shadow-card"
            style={{ paddingLeft: "3.25rem" }}
          />
          {searching && (
            <span
              aria-hidden="true"
              className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-brand-600 border-t-transparent"
            />
          )}
        </label>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter articles by category">
        {categories.map((c) => (
          <button
            key={c.name}
            role="tab"
            aria-selected={category === c.name}
            onClick={() => setCategory(c.name)}
            className={cn("chip", category === c.name && "chip-active")}
          >
            {c.name}
            <span className={cn("text-xs", category === c.name ? "text-white/80" : "text-ink/40")}>{c.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-10">
        {searching ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <Skeleton className="aspect-[16/9] rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-7 w-7" />}
            title="No articles found"
            description="Try a different search term or category — our journal covers many wellness topics."
            action={
              <button onClick={clear} className="btn-outline btn-sm">
                Clear search
              </button>
            }
          />
        ) : (
          <motion.div layout={!reduceMotion} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <BlogCard post={post} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
