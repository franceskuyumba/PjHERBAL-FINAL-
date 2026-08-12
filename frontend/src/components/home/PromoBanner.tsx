import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="bg-cream py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 p-6 text-white shadow-card sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-50/80">
                Limited Time Offer
              </p>
              <h3 className="mt-1 font-display text-xl font-bold sm:text-2xl">
                Get 10% Off Your First Order
              </h3>
              <p className="mt-1 text-sm text-gold-50/90">
                Use code <span className="rounded bg-white/20 px-2 py-0.5 font-bold">WELCOME10</span> at checkout
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gold-600 transition hover:bg-gold-50"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-brand-900 p-6 text-white shadow-card sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                Free Delivery
              </p>
              <h3 className="mt-1 font-display text-xl font-bold sm:text-2xl">
                Free Shipping on Orders Over 80,000 TZS
              </h3>
              <p className="mt-1 text-sm text-brand-200">
                Nationwide delivery — Dar es Salaam same day, upcountry in 1–4 days.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
              <Gift className="h-6 w-6 text-gold-400" />
              <span className="text-sm font-semibold">Gift-ready packaging</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
