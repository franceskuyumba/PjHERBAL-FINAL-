"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Brain, Flower2, Leaf, Scale, Shield, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/context/LanguageContext";

const iconMap: Record<string, ReactNode> = {
  shield: <Shield className="h-6 w-6" />,
  scale: <Scale className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  flower: <Flower2 className="h-6 w-6" />,
  brain: <Brain className="h-6 w-6" />,
  leaf: <Leaf className="h-6 w-6" />,
};

export interface CategoryCardData {
  slug: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  productCount?: number;
}

export function CategoryCard({ category, index = 0 }: { category: CategoryCardData; index?: number }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      className="group relative h-full"
    >
      <Link
        href={`/category/${category.slug}`}
        className="relative block h-full overflow-hidden rounded-2xl border border-ink/[0.04] bg-white shadow-soft transition-all duration-300 hover:shadow-lift"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/25 to-transparent" />
          <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-sage-700 shadow-soft backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-card">
            {iconMap[category.icon] || iconMap.leaf}
          </div>
          <div className="absolute inset-x-4 bottom-4 text-white">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold transition-colors group-hover:text-gold-200">
                {category.name}
              </h3>
              <ArrowUpRight className="h-5 w-5 text-gold-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="mt-1.5 text-xs leading-5 text-white/70">{category.description}</p>
            {typeof category.productCount === "number" && (
              <p className="mt-2 text-[11px] font-semibold text-gold-200">
                {t("home.categoryCard.productCount").replace("{count}", String(category.productCount))}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
