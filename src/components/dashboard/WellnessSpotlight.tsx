"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/context/LanguageContext";

export function WellnessSpotlight() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const slides = [0, 1, 2].map((index) => ({
    title: t(`dash.spotlight.slides.${index}.title`),
    text: t(`dash.spotlight.slides.${index}.text`),
    image: t(`dash.spotlight.slides.${index}.image`),
    href: t(`dash.spotlight.slides.${index}.href`),
  }));

  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % slides.length), 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-6 text-center text-white shadow-lift sm:p-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">{t("dash.spotlight.eyebrow")}</p>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{t("dash.spotlight.title")}</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/70">{t("dash.spotlight.subtitle")}</p>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -10 }} className="mt-5">
            <p className="font-semibold text-gold-200">{slide.title}</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-white/70">{slide.text}</p>
            <Link href={slide.href} className="btn-gold btn-sm mt-4 inline-flex">View product <ArrowRight className="h-4 w-4" /></Link>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex justify-center gap-2">
          {slides.map((item, index) => <button key={item.href} onClick={() => setActive(index)} aria-label={`Show wellness item ${index + 1}`} className={`h-1.5 rounded-full transition-all ${active === index ? "w-8 bg-gold-400" : "w-2 bg-white/30"}`} />)}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={slide.image} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: 12 }} transition={{ duration: 0.4 }} className="mx-auto mt-6 max-w-md">
          <Image src={slide.image} alt={slide.title} width={420} height={260} sizes="(max-width: 640px) 100vw, 420px" className="h-56 w-full rounded-2xl border border-white/15 object-cover shadow-lift sm:h-64" />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
