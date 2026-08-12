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
        className="card relative block h-full overflow-hidden p-4 transition-shadow duration-300 hover:shadow-lift"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
          <div className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-brand-700 shadow-card backdrop-blur transition-transform duration-300 group-hover:scale-110">
            {iconMap[category.icon] || iconMap.leaf}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-brand-950 transition-colors group-hover:text-brand-700">
              {category.name}
            </h3>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-ink/55">{category.description}</p>
          {typeof category.productCount === "number" && (
            <p className="mt-3 text-xs font-semibold text-brand-600">
              {t("home.categoryCard.productCount").replace("{count}", String(category.productCount))}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
