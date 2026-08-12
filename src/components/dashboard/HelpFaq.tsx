"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

export function HelpFaq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t("dash.faq.q1"), a: t("dash.faq.a1") },
    { q: t("dash.faq.q2"), a: t("dash.faq.a2") },
    { q: t("dash.faq.q3"), a: t("dash.faq.a3") },
    { q: t("dash.faq.q4"), a: t("dash.faq.a4") },
    { q: t("dash.faq.q5"), a: t("dash.faq.a5") },
    { q: t("dash.faq.q6"), a: t("dash.faq.a6") },
  ];

  return (
    <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-5 w-5 text-brand-700" />
        <h2 className="font-display text-xl font-bold text-brand-950">{t("dash.faq.title")}</h2>
      </div>
      <div className="mt-6 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-ink/10">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className={cn("text-sm font-semibold", isOpen ? "text-brand-800" : "text-brand-950")}>{f.q}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink/40 transition-transform", isOpen && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <p className="px-5 pb-5 text-sm leading-7 text-ink/60">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
