import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Leaf, BadgeCheck, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE, WHATSAPP_LINK } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "AfyaPlus is Tanzania's trusted online supplement store — authentic products, expert WhatsApp support and fast nationwide delivery.",
  path: "/about",
});

const values = [
  {
    icon: BadgeCheck,
    title: "Authenticity First",
    text: "Every product we sell is genuine, quality-checked and sourced from reputable manufacturers.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Centric",
    text: "We guide every customer personally — from product choice to delivery and aftercare.",
  },
  {
    icon: Leaf,
    title: "Health & Wellness",
    text: "We only stock supplements that meet strict safety and quality standards.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    text: "Clear pricing, honest advice and no hidden charges. Ever.",
  },
];

const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "20+", label: "Premium Products" },
  { value: "26", label: "Regions Delivered" },
  { value: "4.8/5", label: "Average Rating" },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <PageHero
        title="About AfyaPlus"
        subtitle="Bringing premium, authentic health supplements to every Tanzanian home — one delivery at a time."
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Story */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=70"
              alt="AfyaPlus supplements"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="Your Health Is Our Mission"
              className="mx-0"
            />
            <p className="mt-5 text-sm leading-relaxed text-brand-600 sm:text-base">
              AfyaPlus was founded with a simple belief: every Tanzanian deserves access to
              authentic, high-quality health supplements without worrying about fakes, long
              queues or unreliable delivery.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-600 sm:text-base">
              We started by serving Dar es Salaam through WhatsApp orders and quickly grew into
              a nationwide platform. Today we combine a modern online store with friendly
              WhatsApp support and fast, trackable delivery — so you always know exactly what
              you're taking and where your order is.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-600 sm:text-base">
              From men's health and weight management to immunity, women's wellness, brain
              focus and detox — every product is carefully selected and doctor-reviewed before
              it reaches our shelves.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Shop Our Products
              </Link>
              <a
                href={WHATSAPP_LINK()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb958]"
              >
                Chat With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-950 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-gold-400 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-brand-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Our Values"
            title="What We Stand For"
            description="The principles behind every product we stock and every order we deliver."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-brand-100 bg-white p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                  <v.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-brand-950">{v.title}</h3>
                <p className="mt-2 text-sm text-brand-500">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-brand-700 to-brand-900 p-10 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Ready to start your wellness journey?
              </h2>
              <p className="mt-2 text-sm text-brand-200">
                Our specialists are one message away on WhatsApp.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
              <a
                href={WHATSAPP_LINK()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb958]"
              >
                Talk to a Specialist
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
