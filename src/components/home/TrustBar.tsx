"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Banknote, Headset, MousePointerClick, PackageCheck, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { useI18n } from "@/context/LanguageContext";

function TrustIcon({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"
      animate={reduceMotion ? {} : { y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function TrustBar() {
  const { t } = useI18n();

  const items = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: t("home.trustBar.i1.title"),
      description: t("home.trustBar.i1.description"),
    },
    {
      icon: <Banknote className="h-6 w-6" />,
      title: t("home.trustBar.i2.title"),
      description: t("home.trustBar.i2.description"),
    },
    {
      icon: <PackageCheck className="h-6 w-6" />,
      title: t("home.trustBar.i3.title"),
      description: t("home.trustBar.i3.description"),
    },
    {
      icon: <Headset className="h-6 w-6" />,
      title: t("home.trustBar.i4.title"),
      description: t("home.trustBar.i4.description"),
    },
    {
      icon: <MousePointerClick className="h-6 w-6" />,
      title: t("home.trustBar.i5.title"),
      description: t("home.trustBar.i5.description"),
    },
  ];

  return (
    <section className="border-y border-ink/5 bg-white">
      <div className="container-site grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((item, i) => (
          <AnimatedReveal key={item.title} delay={i * 0.07}>
            <div className="flex items-center gap-4">
              <TrustIcon>{item.icon}</TrustIcon>
              <div>
                <p className="font-display text-base font-bold text-brand-950">{item.title}</p>
                <p className="mt-0.5 text-xs text-ink/55">{item.description}</p>
              </div>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}
