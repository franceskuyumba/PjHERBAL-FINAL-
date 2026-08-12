import Link from "next/link";
import { Tag, MessageCircle, ShoppingCart, Package, Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { WHATSAPP_LINK } from "@/lib/constants";

const steps = [
  {
    icon: MessageCircle,
    step: "Step 1",
    title: "Browse or Chat",
    text: "Explore our shop or message us on WhatsApp for personalized advice from a specialist.",
  },
  {
    icon: ShoppingCart,
    step: "Step 2",
    title: "Place Your Order",
    text: "Add products to cart and checkout in under a minute — no account needed.",
  },
  {
    icon: Tag,
    step: "Step 3",
    title: "Pay Securely",
    text: "Pay instantly with M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, CRDB or NMB.",
  },
  {
    icon: Package,
    step: "Step 4",
    title: "Fast Delivery",
    text: "Receive your order same-day in Dar es Salaam and within 1–4 days nationwide.",
  },
];

export default function HowToOrder() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="How It Works"
          title="Ordering Your Supplements Is Simple"
          description="Four easy steps from choosing your product to doorstep delivery."
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25">
                <s.icon className="h-9 w-9" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-600">
                {s.step}
              </p>
              <h3 className="mt-1 font-display text-base font-bold text-brand-950">
                {s.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[240px] text-sm text-brand-500">
                {s.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700"
          >
            <ShoppingCart className="h-5 w-5" /> Start Shopping
          </Link>
          <a
            href={WHATSAPP_LINK()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[#1fb958]"
          >
            <MessageCircle className="h-5 w-5" /> Chat With Specialist
          </a>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-brand-500">
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-gold-500 text-gold-500" /> Rated 4.8/5 by 1,000+ customers
          </span>
          <span>Free delivery over 80,000 TZS</span>
          <span>Secure mobile money payments</span>
        </div>
      </div>
    </section>
  );
}
