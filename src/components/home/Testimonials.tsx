"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Rating } from "@/components/ui/Rating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

const testimonials = [
  {
    name: "Amina S.",
    role: "Dar es Salaam",
    text: "Moringa Power changed my mornings. I have more energy, my hair feels stronger, and the delivery was fast. PJHERBAL is now my go-to store.",
    rating: 5,
  },
  {
    name: "Juma M.",
    role: "Mwanza",
    text: "I ordered Male Vitality Plus and the team on WhatsApp guided me on the right dosage. Professional service and genuine products. Highly recommended!",
    rating: 5,
  },
  {
    name: "Grace T.",
    role: "Arusha",
    text: "SlimHerbal Tea tastes amazing and my bloating has reduced in just a few weeks. The packaging is premium and the quality is excellent.",
    rating: 5,
  },
  {
    name: "Peter L.",
    role: "Morogoro",
    text: "I was skeptical about buying supplements online, but PJHERBAL's payment via M-Pesa and quick delivery to my village proved me wrong. Trustworthy!",
    rating: 5,
  },
  {
    name: "Salim O.",
    role: "Dar es Salaam",
    text: "Black seed oil capsules are top quality. I've been buying monthly for a year now and never had an issue. Great customer care too.",
    rating: 4,
  },
];

export function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const { t: tr } = useI18n();

  useEffect(() => {
    const timer = setInterval(() => setIndex((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[index];

  return (
    <section className="bg-gradient-to-b from-brand-950 to-brand-900 py-16 text-white sm:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow={tr("home.testimonials.eyebrow")}
          title={tr("home.testimonials.title")}
          subtitle={tr("home.testimonials.subtitle")}
          className="text-white [&_h2]:text-white [&_.eyebrow]:text-gold-300 [&_p]:text-white/55"
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute -left-2 -top-4 text-gold-400/25">
            <Quote className="h-20 w-20" />
          </div>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -24 }}
              transition={{ duration: 0.45 }}
              className="relative rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 text-center backdrop-blur-sm sm:p-12"
            >
              <div className="flex justify-center">
                <Rating value={t.rating} showValue={false} size="lg" />
              </div>
              <p className="mt-6 font-display text-xl leading-relaxed text-white/85 sm:text-2xl">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer className="mt-6">
                <p className="font-display text-lg font-bold text-gold-300">{t.name}</p>
                <p className="text-sm text-white/45">{t.role}</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={tr("home.testimonials.showTestimonial").replace("{n}", String(i + 1))}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-8 bg-gold-400" : "w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
