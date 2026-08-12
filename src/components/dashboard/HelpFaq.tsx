"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How do I pay for my order?",
    a: "We accept M-Pesa, Tigo Pesa, Airtel Money, HaloPesa and bank transfer (CRDB / NMB). During checkout you will receive clear payment instructions, including the paybill number and your order reference. After paying, confirm on WhatsApp to speed up dispatch.",
  },
  {
    q: "How long does delivery take?",
    a: "Within Dar es Salaam we deliver same-day or next-day. Other regions take 2–4 working days depending on your location. Delivery is free on orders over TZS 200,000.",
  },
  {
    q: "How do I check my order progress?",
    a: "Open My Dashboard → My Orders and open your order — every stage from payment through to delivery is shown there. You can also message us on WhatsApp with your order number for a live update.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Yes — as long as it has not been dispatched. Message us on WhatsApp with your order number and we will help right away.",
  },
  {
    q: "Are your products genuine and tested?",
    a: "Yes. Every product is sourced through quality-checked suppliers and stored according to the clinic's standards. We share honest product information and never make exaggerated medical claims.",
  },
  {
    q: "What if a product does not suit me?",
    a: "Message us on WhatsApp. Our specialists will help you decide whether to continue, switch products or stop use. If a product arrives damaged or incorrect, we will replace it.",
  },
];

export function HelpFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-5 w-5 text-brand-700" />
        <h2 className="font-display text-xl font-bold text-brand-950">Frequently asked questions</h2>
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
