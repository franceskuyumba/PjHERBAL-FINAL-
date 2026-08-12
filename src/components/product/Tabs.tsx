"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: string;
}

export function Tabs({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  const activeTab = tabs.find((t) => t.id === active) || tabs[0];

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-full bg-ink/[0.04] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "relative rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
              active === tab.id ? "text-brand-800" : "text-ink/55 hover:text-ink"
            )}
          >
            {active === tab.id && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-white shadow-card"
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="prose-herbal mt-6 rounded-3xl bg-white p-6 shadow-card sm:p-8"
      >
        {activeTab.content.split("\n").map((line, i) =>
          line.trim() ? (
            <p key={i}>{line}</p>
          ) : (
            <div key={i} className="h-4" />
          )
        )}
      </motion.div>
    </div>
  );
}
