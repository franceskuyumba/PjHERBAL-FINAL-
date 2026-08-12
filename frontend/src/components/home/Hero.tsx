"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Truck, Flame } from "lucide-react";
import Button from "@/components/ui/Button";
import { WHATSAPP_LINK } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppButton";

const slides = [
  {
    eyebrow: "Premium Supplements",
    title: "Feel Stronger, Healthier & More Energized",
    subtitle:
      "Doctor-approved supplements delivered to your door anywhere in Tanzania. Order in under a minute with mobile money.",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=70",
    cta: { label: "Order Now", href: "/shop" },
  },
  {
    eyebrow: "Up to 20% Off",
    title: "Weight Management Made Simple",
    subtitle:
      "Burn fat, control cravings and reach your healthy weight with GlucoTrim and expert guidance from our specialists.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=70",
    cta: { label: "Explore Products", href: "/shop/category/weight-management" },
  },
  {
    eyebrow: "Trusted by 10,000+ Customers",
    title: "Authentic Supplements, Guaranteed Results",
    subtitle:
      "Every product is 100% authentic and quality checked. Chat with a specialist today and get personalized advice.",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=70",
    cta: { label: "Chat With Specialist", href: WHATSAPP_LINK() },
    whatsapp: true,
  },
];

const badges = [
  { icon: ShieldCheck, label: "100% Authentic" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: Flame, label: "Doctor Approved" },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Text side */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
              {slides[active].eyebrow}
            </span>
            <h1
              key={active}
              className="mt-5 animate-fade-up font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              {slides[active].title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-200 sm:text-base lg:mx-0">
              {slides[active].subtitle}
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              {slides[active].whatsapp ? (
                <a
                  href={slides[active].cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[#1fb958]"
                >
                  <WhatsAppIcon className="h-5 w-5" /> {slides[active].cta.label}
                </a>
              ) : (
                <Link
                  href={slides[active].cta.href}
                  className="inline-flex h-13 items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-gold-500/30 transition hover:from-gold-500 hover:to-gold-700"
                >
                  {slides[active].cta.label} <ArrowRight className="h-5 w-5" />
                </Link>
              )}
              <a
                href={WHATSAPP_LINK()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <WhatsAppIcon className="h-5 w-5" /> Chat With Specialist
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="flex items-center gap-1.5 text-xs font-medium text-brand-200"
                >
                  <b.icon className="h-4 w-4 text-gold-400" /> {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              {slides.map((s, i) => (
                <Image
                  key={s.title}
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={i === 0}
                  className={`object-cover transition-opacity duration-700 ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
            </div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/95 px-4 py-2 shadow-lift backdrop-blur">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-8 bg-brand-600" : "w-2 bg-brand-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Marquee offer strip */}
      <div className="border-t border-white/10 bg-brand-900/60 py-3">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12 text-xs font-medium uppercase tracking-wider text-brand-200">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              [
                "Free delivery on orders above 80,000 TZS",
                "Pay with M-Pesa, Tigo Pesa & Airtel Money",
                "Order directly via WhatsApp",
                "100% authentic supplements guaranteed",
                "Doctor & nutritionist support available",
              ].map((t, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> {t}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
