"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/blog";

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const list = (
    <ol className="relative space-y-1.5 border-l border-ink/10 pl-0">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              "relative -ml-px block border-l-2 py-1.5 text-sm transition-all",
              item.level === 3 ? "pl-7" : "pl-4",
              active === item.id
                ? "border-brand-600 font-semibold text-brand-700"
                : "border-transparent text-ink/55 hover:border-ink/30 hover:text-brand-700"
            )}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block" aria-label="Table of contents">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">On this page</p>
        <div className="mt-4">{list}</div>
      </aside>

      <div className="lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="toc-mobile"
          className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-brand-950 shadow-card"
        >
          <span className="flex items-center gap-2">
            <ListTree className="h-4 w-4 text-brand-600" /> Table of contents
          </span>
          <ChevronDown className={cn("h-4 w-4 text-ink/40 transition-transform duration-200", open && "rotate-180")} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="toc-mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4">{list}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
