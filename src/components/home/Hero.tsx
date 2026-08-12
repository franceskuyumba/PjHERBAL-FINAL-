"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface Slide {
  tag: string;
  tagline: string;
  headline: string;
  highlight: string;
  sub: string;
  image: string;
  imageLabel: string;
  badge: string;
  badgeTone: "gold" | "green";
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  chat: boolean;
  bg: string;
  glow: string;
}

const slides: Slide[] = [
  {
    tag: "Daily Wellness Essentials",
    tagline: "Authentic Tanzanian herbal supplements",
    headline: "Nature's Power,",
    highlight: "Engineered for You",
    sub: "Premium, quality-checked supplements for energy, immunity, weight management and more — delivered across Tanzania.",
    image: "/images/products/moringa-power.svg",
    imageLabel: "Moringa Power",
    badge: "Trusted by 1,000+ customers",
    badgeTone: "gold",
    primaryLabel: "SHOP NOW",
    primaryHref: "/shop",
    secondaryLabel: "EXPLORE PRODUCTS",
    secondaryHref: "/shop",
    chat: true,
    bg: "from-brand-50 via-cream to-cream",
    glow: "rgba(47,143,78,0.10)",
  },
  {
    tag: "New Arrivals",
    tagline: "Fresh from our dispensary",
    headline: "New this season,",
    highlight: "straight from the clinic",
    sub: "Discover the latest additions to our wellness collection, carefully selected and quality-checked by our specialists.",
    image: "/images/products/black-seed-oil.svg",
    imageLabel: "Black Seed Oil",
    badge: "Just landed",
    badgeTone: "green",
    primaryLabel: "SHOP NEW ARRIVALS",
    primaryHref: "/shop?sort=newest",
    secondaryLabel: "EXPLORE PRODUCTS",
    secondaryHref: "/shop",
    chat: false,
    bg: "from-gold-50 via-cream to-cream",
    glow: "rgba(212,149,38,0.12)",
  },
  {
    tag: "This Week's Offers",
    tagline: "Limited-time marketplace prices",
    headline: "Shop this week's",
    highlight: "best deals",
    sub: "Flash prices on customer favourites — while stock lasts. Pay with M-Pesa, Tigo Pesa or Airtel Money.",
    image: "/images/products/male-vitality-plus.svg",
    imageLabel: "Male Vitality Plus",
    badge: "Up to 20% OFF",
    badgeTone: "gold",
    primaryLabel: "VIEW FLASH DEALS",
    primaryHref: "/#flash-deals",
    secondaryLabel: "EXPLORE PRODUCTS",
    secondaryHref: "/shop",
    chat: true,
    bg: "from-brand-900 via-brand-800 to-brand-950",
    glow: "rgba(231,177,58,0.18)",
  },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const go = (next: number, dir = 1) => {
    setDirection(dir);
    setActive((next + slides.length) % slides.length);
  };

  const slide = slides[active];
  const dark = slide.badgeTone === "gold" && slide.bg.includes("brand-900");

  return (
    <section
      className={cn("relative overflow-hidden transition-colors duration-700", dark ? "text-white" : "text-brand-950")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundImage: `radial-gradient(circle at 15% 20%, ${slide.glow}, transparent 40%), radial-gradient(circle at 85% 80%, transparent, transparent)`,
          }}
        />
      </AnimatePresence>

      <div
        className={cn(
          "bg-gradient-to-br transition-colors duration-700",
          dark ? "from-brand-950 via-brand-900 to-brand-800" : slide.bg
        )}
      >
        <div className="container-site relative grid min-h-[520px] items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={reduceMotion ? false : { opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.5 }}
              className="relative order-2 text-center lg:order-1 lg:text-left"
            >
              <div
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest",
                  dark ? "border-gold-400/40 bg-gold-500/10 text-gold-300" : "border-gold-300/60 bg-gold-50 text-gold-700"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {slide.tag}
              </div>

              <h1
                className={cn(
                  "mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl",
                  dark ? "text-white" : "text-brand-950"
                )}
              >
                {slide.headline}{" "}
                <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", dark ? "from-gold-300 to-gold-400" : "from-brand-600 to-brand-400")}>
                  {slide.highlight}
                </span>
              </h1>

              <p className={cn("mx-auto mt-5 max-w-xl text-base leading-7 sm:text-lg lg:mx-0", dark ? "text-white/70" : "text-ink/65")}>
                {slide.sub}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link href={slide.primaryHref} className="btn-gold btn-lg">
                  {slide.primaryLabel}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href={slide.secondaryHref} className={cn("btn-lg", dark ? "btn-outline-light" : "btn-outline")}>
                  {slide.secondaryLabel}
                </Link>
                {slide.chat && (
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp btn-lg"
                  >
                    <MessageCircle className="h-5 w-5" />
                    CHAT WITH SPECIALIST
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-lg"
          >
            <div className="relative aspect-square">
              <div
                className={cn(
                  "absolute inset-0 rounded-full blur-2xl",
                  dark ? "bg-gold-400/20" : "bg-gradient-to-tr from-brand-600/20 via-transparent to-gold-400/20"
                )}
              />
              <div className={cn("relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-lift", dark ? "border border-white/15 bg-brand-800" : "border border-white/60 bg-white")}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduceMotion ? false : { opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: -40 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.imageLabel}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 512px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-card backdrop-blur-md"
                  animate={reduceMotion ? {} : { y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gold-600">{slide.tagline}</p>
                  <p className="font-display text-lg font-bold text-brand-950">{slide.imageLabel}</p>
                </motion.div>
              </div>

              <motion.div
                className="absolute -right-3 -top-3 rounded-2xl bg-gold-500 px-4 py-2 text-center shadow-lift sm:-right-6"
                animate={reduceMotion ? {} : { rotate: [0, 3, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-950">{slide.tag}</p>
                <p className="font-display text-lg font-black text-white">{slide.badge}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        className={cn(
          "absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2",
          dark ? "bg-brand-950/60" : "bg-white/60",
          "rounded-full px-2 py-1.5 backdrop-blur"
        )}
      >
        <button
          onClick={() => go(active - 1, -1)}
          aria-label="Previous slide"
          className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-colors", dark ? "text-white/70 hover:bg-white/10" : "text-ink/60 hover:bg-ink/5")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {slides.map((s, i) => (
          <button
            key={s.image}
            onClick={() => go(i, i > active ? 1 : -1)}
            aria-label={`Show slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === active ? "w-8 bg-gold-500" : cn(dark ? "bg-white/30 hover:bg-white/60" : "bg-ink/20 hover:bg-ink/40")
            )}
          />
        ))}
        <button
          onClick={() => go(active + 1, 1)}
          aria-label="Next slide"
          className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-colors", dark ? "text-white/70 hover:bg-white/10" : "text-ink/60 hover:bg-ink/5")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
