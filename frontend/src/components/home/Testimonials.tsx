"use client";

import { useState } from "react";
import { Quote, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import Rating from "@/components/ui/Rating";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const max = Math.max(0, testimonials.length - visible);

  const prev = () => setIdx((i) => (i <= 0 ? 0 : i - 1));
  const next = () => setIdx((i) => (i >= max ? max : i + 1));

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Testimonials"
          title="Real Stories From Real Customers"
          description="Thousands of happy customers across Tanzania trust AfyaPlus for their health and wellness journey."
        />
        <div className="relative mt-10">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.slice(idx, idx + visible).map((t) => (
              <figure
                key={t.id}
                className="relative flex flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-card"
              >
                <Quote className="h-8 w-8 text-gold-400" />
                <div className="mt-3">
                  <Rating value={t.rating} />
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-brand-700">
                  "{t.text}"
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-brand-100 pt-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold text-brand-950">
                      {t.name}
                      {t.verified && <BadgeCheck className="h-4 w-4 text-brand-600" />}
                    </p>
                    <p className="text-xs text-brand-500">
                      {t.location} • {t.product}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          {max > 0 && (
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={prev}
                disabled={idx === 0}
                aria-label="Previous testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 transition hover:border-brand-500 hover:bg-brand-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                disabled={idx >= max}
                aria-label="Next testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 transition hover:border-brand-500 hover:bg-brand-50 disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
