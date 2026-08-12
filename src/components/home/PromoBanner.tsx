"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, BadgePercent } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/context/LanguageContext";

export function PromoBanner() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const { t } = useI18n();

  const banners = [
    {
      title: t("home.promoBanner.b1.title"),
      text: t("home.promoBanner.b1.text"),
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
  }, []);

  return (
    <section className="container-site py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 shadow-lift">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 90% 20%, rgba(231,177,58,0.25), transparent 45%)",
          }}
        />
        <div className="relative grid items-center gap-6 p-8 sm:grid-cols-[1fr_auto] sm:p-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-300">
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
                <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                  {banners[active].title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/75 sm:text-base">
                  {banners[active].text}
                </p>
              </motion.div>
            </AnimatePresence>
            <Link href={banners[active].href} className="btn-gold btn-md mt-5">
              {banners[active].cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-5 flex gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.title}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${b.title}`}
                  className={`h-1.5 rounded-full transition-all ${i === active ? "w-7 bg-gold-400" : "w-1.5 bg-white/30"}`}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="hidden sm:block"
            animate={reduceMotion ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={banners[active].image}
              alt={banners[active].title}
              width={240}
              height={240}
              className="h-56 w-56 rounded-3xl border border-white/20 object-cover shadow-lift"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
