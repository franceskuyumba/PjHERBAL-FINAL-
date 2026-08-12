import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Leaf, Microscope, Truck } from "lucide-react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

const pillars = [
  {
    icon: <Leaf className="h-5 w-5" />,
    title: "Clinic-backed",
    text: "Recommended through the PJHERBAL Clinic at Segerea — not a faceless online shop.",
  },
  {
    icon: <Microscope className="h-5 w-5" />,
    title: "Quality-checked batches",
    text: "Every batch is reviewed for purity and consistent strength before it reaches you.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Delivered nationwide",
    text: "Same-day across Dar es Salaam and fast, tracked dispatch to every region.",
  },
  {
    icon: <HeartHandshake className="h-5 w-5" />,
    title: "People, not bots",
    text: "Talk to a real specialist on WhatsApp before and after you order.",
  },
];

export function StorySection() {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-24">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <AnimatedReveal className="relative order-2 lg:order-1">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-40 w-40 rounded-3xl bg-gold-100/70" aria-hidden="true" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
              <Image
                src="/images/products/moringa-power.svg"
                alt="Premium PJHERBAL supplements"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 rounded-2xl bg-brand-950 px-5 py-4 text-white shadow-lift">
              <p className="font-display text-lg font-bold text-gold-300">Segerea Branch</p>
              <p className="text-sm text-white/70">Dar es Salaam · Tanzania</p>
            </div>
          </div>
        </AnimatedReveal>

        <div className="order-1 lg:order-2">
          <AnimatedReveal>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-brand-950 sm:text-4xl">
              A wellness clinic, not just a supplement shop
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/60">
              PJHERBAL Clinic at Segerea blends traditional plant knowledge with modern quality standards.
              When you shop with us, you get the same care and honesty we offer patients who walk through
              our clinic doors — plus the convenience of ordering from your phone.
            </p>
          </AnimatedReveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <AnimatedReveal key={p.title} delay={i * 0.08}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-ink/5 bg-cream p-4 transition-all hover:border-brand-500/30 hover:shadow-card">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    {p.icon}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-brand-950">{p.title}</p>
                    <p className="mt-1 text-xs leading-5 text-ink/55">{p.text}</p>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>

          <AnimatedReveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary btn-md">
                Our story <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/blog" className="btn-outline btn-md">
                Read the wellness journal
              </Link>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
