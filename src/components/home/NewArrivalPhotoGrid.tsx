"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

const photos = [
  "/uploads/saved/wellness-01.jpeg",
  "/uploads/saved/wellness-02.jpeg",
  "/uploads/saved/wellness-03.jpeg",
  "/uploads/saved/wellness-04.jpeg",
  "/uploads/saved/wellness-05.jpeg",
];

export function NewArrivalPhotoGrid() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  return (
    <section className="container-site py-10 sm:py-14">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{t("home.photoArrivals.eyebrow")}</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-brand-950 sm:text-3xl">{t("home.photoArrivals.title")}</h2>
          <p className="mt-2 max-w-xl text-sm text-ink/55">{t("home.photoArrivals.subtitle")}</p>
        </div>
        <Link href="/shop?sort=newest" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex">{t("home.photoArrivals.viewAll")}<ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="flex snap-x gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-5">
        {photos.map((photo, index) => (
          <motion.div key={photo} initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.06 }} className="relative min-w-[150px] snap-start overflow-hidden rounded-xl border border-ink/5 bg-white shadow-sm sm:min-w-0">
            <Image src={photo} alt={`${t("home.photoArrivals.title")} ${index + 1}`} width={320} height={240} sizes="(max-width: 640px) 150px, 20vw" className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/75 to-transparent px-3 pb-3 pt-8 text-xs font-semibold text-white">{t("home.photoArrivals.eyebrow")}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
