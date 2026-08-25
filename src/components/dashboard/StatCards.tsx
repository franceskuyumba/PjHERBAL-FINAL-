"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export interface Stat {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
}

export function StatCards({ stats }: { stats: Stat[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
          whileHover={reduceMotion ? undefined : { y: -4 }}
          className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.accent}`}>{s.icon}</span>
          <p className="mt-4 text-2xl font-bold tracking-tight text-brand-950">{s.value}</p>
          <p className="mt-0.5 text-xs font-medium text-ink/50">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
