"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, BadgePercent } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/context/LanguageContext";

export function PromoBanner({ promoText = "" }: { promoText?: string }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const { t } = useI18n();

  const banners = [
    {
      title: t("home.promoBanner.b1.title"),
      text: promoText || t("home.promoBanner.b1.text"),
      image: "/images/products/black-seed-oil.svg",
      cta: t("home.promoBanner.b1.cta"),
      href: "/category/energy-immunity",
    },
    {
      title: t("home.promoBanner.b2.title"),
      text: t("home.promoBanner.b2.text"),
      image: "/images/products/moringa-power.svg",
      cta: t("home.promoBanner.b2.cta"),
      href: "/shop",
    },
    {
      title: t("home.promoBanner.b3.title"),
      text: t("home.promoBanner.b3.text"),
      image: "/images/products/male-vitality-plus.svg",
      cta: t("home.promoBanner.b3.cta"),
      href: "/category/mens-health",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActive((v) => (v + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="container-site py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 shadow-elevated">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 90% 20%, rgba(201,169,110,0.3), transparent 45%)",
          }}
        />
        <div className="relative grid items-center gap-8 p-8 sm:grid-cols-[1fr_auto] sm:p-14">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-gold-300">
              <BadgePercent className="h-3.5 w-3.5" />
              {t("home.promoBanner.badge")}
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {banners[active].title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/70 sm:text-base">
                  {banners[active].text}
                </p>
              </motion.div>
            </AnimatePresence>
            <Link href={banners[active].href} className="btn-gold btn-md mt-6 shadow-elevated">
              {banners[active].cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-6 flex gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.title}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${b.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-gold-400" : "w-1.5 bg-white/25 hover:bg-white/40"}`}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="mx-auto block sm:mx-0"
            animate={reduceMotion ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={banners[active].image}
              alt={banners[active].title}
              width={224}
              height={224}
              sizes="(max-width: 640px) 96px, 224px"
              className="h-24 w-24 rounded-2xl border border-white/15 object-cover shadow-elevated sm:h-56 sm:w-56"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
