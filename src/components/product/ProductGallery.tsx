"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const { t } = useI18n();
  const list = images.length > 0 ? images : ["/images/hero.svg"];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative aspect-square overflow-hidden rounded-[2rem] bg-brand-50"
      >
        <Image
          src={list[active]}
          alt={`${name} — ${t("product.imageAlt").replace("{n}", String(active + 1))}`}
          fill
          priority
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 50vw"
          className="object-cover"
        />
      </motion.div>

      {list.length > 1 && (
        <div className="flex gap-3">
          {list.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all",
                i === active ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={t("product.viewImage").replace("{n}", String(i + 1))}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
