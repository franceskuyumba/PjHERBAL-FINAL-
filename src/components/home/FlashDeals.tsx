import Link from "next/link";
import { ArrowRight, Flame, TimerReset } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { getLocale, t } from "@/lib/i18n";

export function FlashDeals({
  products,
  isLoggedIn = false,
}: {
  products: ProductCardProduct[];
  isLoggedIn?: boolean;
}) {
  const lang = getLocale();
  if (products.length === 0) return null;

  return (
    <section id="flash-deals" className="scroll-mt-24 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 py-16 sm:py-24">
      <div className="container-site">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
              <Flame className="h-4 w-4" />
              {t(lang, "home.flashDeals.eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t(lang, "home.flashDeals.title")}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
              {t(lang, "home.flashDeals.subtitle")}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:items-end">
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3.5 backdrop-blur-sm">
              <TimerReset className="h-5 w-5 text-gold-300" />
              <CountdownTimer />
            </div>
            <Link href="/shop" className="btn-gold btn-sm shadow-elevated">
              {t(lang, "home.flashDeals.shopAllDeals")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </div>
    </section>
  );
}
