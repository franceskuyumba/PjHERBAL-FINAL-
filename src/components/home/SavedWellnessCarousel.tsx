"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/context/LanguageContext";

const photos = [
  "/uploads/saved/wellness-01.jpeg",
  "/uploads/saved/wellness-02.jpeg",
  "/uploads/saved/wellness-03.jpeg",
  "/uploads/saved/wellness-04.jpeg",
  "/uploads/saved/wellness-05.jpeg",
];

export function SavedWellnessCarousel() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % photos.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container-site py-8 sm:py-12">
      <div className="overflow-hidden rounded-2xl bg-brand-950 p-4 text-white shadow-lift sm:p-6">
        <div className="grid items-center gap-5 sm:grid-cols-[1fr_280px]">
          <div>
            <p className="eyebrow text-gold-300">{t("home.photoShowcase.eyebrow")}</p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{t("home.photoShowcase.title")}</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">{t("home.photoShowcase.subtitle")}</p>
            <div className="mt-4 flex gap-2">
              {photos.map((photo, index) => <button key={photo} onClick={() => setActive(index)} aria-label={`Show wellness photo ${index + 1}`} className={`h-1.5 rounded-full transition-all ${active === index ? "w-8 bg-gold-400" : "w-2 bg-white/30"}`} />)}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={photos[active]} initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/15">
              <Image src={photos[active]} alt="PJHERBAL wellness product" fill sizes="(max-width: 640px) 100vw, 280px" className="object-cover" priority={active === 0} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
