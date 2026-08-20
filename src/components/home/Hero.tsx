"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useI18n } from "@/context/LanguageContext";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  const headline = t("home.hero.s1.headline");
  const highlight = t("home.hero.s1.highlight");
  const sub = t("home.hero.s1.sub");
  const tag = t("home.hero.s1.tag");
  const primaryLabel = t("home.hero.s1.primaryLabel");
  const primaryHref = "/shop";
  const secondaryLabel = t("home.hero.exploreProducts");
  const secondaryHref = "/shop";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 15% 20%, rgba(231,177,58,0.18), transparent 45%)",
        }}
      />

      <div className="container-site relative grid min-h-[420px] items-center py-16 sm:py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <span className="text-center sm:text-right">
              <span className="block font-display text-lg font-bold tracking-wide text-white sm:text-xl lg:text-2xl">
                Welcome to <span className="whitespace-nowrap text-gold-300">PJHERBAL Clinic</span>
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-200/80 sm:text-[11px] sm:tracking-[0.3em]">
                Segerea Branch · Natural Wellness
              </span>
            </span>
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold-400/40 bg-white/10 shadow-lift backdrop-blur sm:h-16 sm:w-16">
              <Image src="/images/logo.svg" alt="PJHERBAL Clinic" width={48} height={48} priority className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-300">
            <Sparkles className="h-3.5 w-3.5" />
            {tag}
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {headline}{" "}
            <span className="bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">
              {highlight}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            {sub}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
            <Link href={primaryHref} className="btn-gold btn-md w-full max-w-xs sm:w-auto">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={secondaryHref} className="btn-outline-light btn-md w-full max-w-xs sm:w-auto">
              {secondaryLabel}
            </Link>
            <a
              href={buildWhatsAppUrl({ recipient: "specialist" })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-md w-full max-w-xs sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              {t("home.hero.chat")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
