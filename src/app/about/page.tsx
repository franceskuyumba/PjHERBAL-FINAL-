import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Award, HeartHandshake, Leaf, ShieldCheck, Sprout, Users } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Learn about PJHERBAL Clinic – Segerea Branch, our mission, values and the people behind your trusted natural supplements.",
};

const values = [
  {
    icon: Leaf,
    title: "Natural first",
    text: "We prioritize plant-based ingredients with traditional wisdom backed by modern understanding.",
  },
  {
    icon: ShieldCheck,
    title: "Quality you can trust",
    text: "Every product is sourced responsibly and quality-checked before it reaches your door.",
  },
  {
    icon: HeartHandshake,
    title: "Honest guidance",
    text: "We recommend products that genuinely suit your needs — never push what you don't need.",
  },
  {
    icon: Users,
    title: "Community care",
    text: "From Segerea to the rest of Tanzania, we are proud to serve our community's health.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <section className="bg-brand-950 py-16 text-white">
        <div className="container-site text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-300">Our story</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Nature, trusted &amp; delivered</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
            PJHERBAL Clinic – Segerea Branch blends traditional Tanzanian herbal knowledge with modern convenience.
          </p>
        </div>
      </section>

      <section className="container-site grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl">
          <Image src="/images/hero.svg" alt="PJHERBAL Clinic natural products" fill className="object-cover" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-brand-950">
            Wellness that respects your roots
          </h2>
          <p className="mt-4 leading-7 text-ink/65">
            PJHERBAL Clinic began with a simple belief: the herbs that have supported Tanzanian families for
            generations deserve a modern, trustworthy home. From our branch in Segerea, Dar es Salaam, we select
            authentic natural supplements for men's health, weight management, immunity, brain focus, detox and
            women's wellness.
          </p>
          <p className="mt-4 leading-7 text-ink/65">
            Every product we list is chosen carefully, described honestly and delivered to your door — with a
            real human on WhatsApp ready to answer your questions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="badge bg-brand-50 text-brand-700">Segerea Branch</span>
            <span className="badge bg-gold-100 text-brand-900">Delivery across Tanzania</span>
            <span className="badge bg-brand-50 text-brand-700">WhatsApp support</span>
          </div>
        </div>
      </section>

      <section className="container-site pb-14">
        <div className="rounded-3xl border border-ink/5 bg-white p-8 shadow-card sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Award className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl font-bold text-brand-950">Our promise</h2>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-ink/5 bg-cream p-5">
                <v.icon className="h-6 w-6 text-brand-700" />
                <p className="mt-3 font-display text-base font-bold text-brand-950">{v.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-ink/60">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-950 py-14 text-white">
        <div className="container-site flex flex-col items-center gap-6 text-center">
          <Sprout className="h-8 w-8 text-gold-300" />
          <h2 className="max-w-2xl font-display text-2xl font-bold sm:text-3xl">
            Ready to feel your best, naturally?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-gold">
              Shop supplements
            </Link>
            <Link href="/contact" className="btn bg-white/10 text-white hover:bg-white/20">
              Talk to us
            </Link>
          </div>
          <p className="text-sm text-white/50">{SITE.address}</p>
        </div>
      </section>
    </div>
  );
}
