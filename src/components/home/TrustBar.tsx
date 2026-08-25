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
      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-50 text-sage-700 shadow-soft"
      animate={reduceMotion ? {} : { y: [0, -3, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
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
    <section className="border-y border-ink/[0.04] bg-white">
      <div className="container-site grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((item, i) => (
          <AnimatedReveal key={item.title} delay={i * 0.07}>
            <div className="flex items-center gap-4">
              <TrustIcon>{item.icon}</TrustIcon>
              <div>
                <p className="font-display text-[15px] font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-ink-muted">{item.description}</p>
              </div>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}
