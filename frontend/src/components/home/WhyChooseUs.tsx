import {
  ShieldCheck,
  Truck,
  Headset,
  Lock,
  BadgeCheck,
  Leaf,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: BadgeCheck,
    title: "Trusted Products",
    text: "Only authentic, quality-checked supplements from reputable manufacturers.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    text: "Same-day delivery in Dar es Salaam and 1–4 days nationwide.",
  },
  {
    icon: Headset,
    title: "Professional Support",
    text: "Real specialists on WhatsApp to guide you on the right products.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    text: "Pay safely with M-Pesa, Tigo Pesa, Airtel Money, CRDB & NMB.",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Supplements",
    text: "Guaranteed genuine products — your health is too important to risk.",
  },
  {
    icon: Leaf,
    title: "Doctor Approved",
    text: "Formulas reviewed by health professionals and nutritionists.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_20%_20%,#4fb27b_0,transparent_40%),radial-gradient(circle_at_80%_80%,#d9a83d_0,transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="The Smartest Way to Buy Supplements in Tanzania"
          description="We combine authentic products, expert advice and fast delivery to make healthy living effortless."
          className="[&_h2]:text-white [&_p]:text-brand-300 [&_span]:border-brand-800 [&_span]:bg-brand-800/60 [&_span]:text-brand-200"
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-gold-500/40 hover:bg-white/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 transition group-hover:scale-110">
                <r.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-white">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-300">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
