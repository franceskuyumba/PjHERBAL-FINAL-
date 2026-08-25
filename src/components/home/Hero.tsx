"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Award, Leaf, MessageCircle, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useI18n } from "@/context/LanguageContext";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  const features = [
    { icon: ShieldCheck, label: "100% Asili" },
    { icon: Award, label: "Bora" },
    { icon: Truck, label: "Haraka" },
    { icon: Leaf, label: "Salama" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 text-white">
      {/* Animated background logo */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={reduceMotion ? {} : { scale: [1, 1.05, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-[500px] w-[500px] shrink-0 items-center justify-center rounded-full border border-gold-400/15 bg-white/[0.03] backdrop-blur-sm"
        >
          <Image src="/images/logo.svg" alt="PJHERBAL Clinic" width={400} height={400} className="h-64 w-64 object-contain drop-shadow-2xl" />
        </motion.div>
      </div>

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-brand-900/20" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(201,169,110,0.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(45,106,79,0.35), transparent 50%)",
        }}
      />

      <div className="container-site relative py-14 sm:py-20 lg:py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Category badge */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-5 py-2 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-200">
              Premium Herbal Wellness
            </span>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mx-auto mt-8 max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
              Unlock Your Body&apos;s
            </span>
            <br />
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Natural Potential
            </span>
          </motion.h1>

          {/* Swahili sub-headline */}
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg lg:text-xl"
          >
            Virutubisho bora vya asili kwa ustawi wako — vimechaguliwa na wataalamu wa PJHERBAL Segerea
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mx-auto mt-10 flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/[0.12]"
              >
                <f.icon className="h-4 w-4 text-gold-300" />
                <span className="text-sm font-semibold text-white/90">{f.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Dual CTAs */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/shop"
              className="btn-gold btn-lg w-full max-w-xs shadow-elevated sm:w-auto"
            >
              Order Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={buildWhatsAppUrl({ recipient: "specialist" })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-lg w-full max-w-xs sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" /> Chat With Specialist
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade for seamless transition */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-muted to-transparent" />
    </section>
  );
}
