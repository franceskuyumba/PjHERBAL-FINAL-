import Link from "next/link";
import { ArrowRight, Flame, TimerReset } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import { CountdownTimer } from "@/components/home/CountdownTimer";

export function FlashDeals({
  products,
  isLoggedIn = false,
}: {
  products: ProductCardProduct[];
  isLoggedIn?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <section id="flash-deals" className="scroll-mt-24 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 py-14 sm:py-20">
      <div className="container-site">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
              <Flame className="h-4 w-4" />
              Flash Deals
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Today's hottest prices
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/60">
              Time-limited discounts on customer favourites. When the timer hits zero, the deals reset.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-end">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <TimerReset className="h-5 w-5 text-gold-300" />
              <CountdownTimer />
            </div>
            <Link href="/shop" className="btn-gold btn-sm">
              Shop all deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </div>
    </section>
  );
}
