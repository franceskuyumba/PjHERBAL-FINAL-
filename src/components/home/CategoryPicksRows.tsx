import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import type { CategoryCardData } from "@/components/home/CategoryCard";
import { getLocale, t } from "@/lib/i18n";

export function CategoryPicksRows({ categories, products, isLoggedIn }: { categories: CategoryCardData[]; products: ProductCardProduct[]; isLoggedIn: boolean }) {
  const lang = getLocale();
  return (
    <section className="bg-surface-muted py-10 sm:py-14">
      <div className="container-site space-y-12">
        {categories.slice(0, 4).map((category) => {
          const picks = products.filter((product) => product.categoryName === category.name).slice(0, 4);
          if (picks.length === 0) return null;
          return (
            <div key={category.slug}>
              <div className="mb-5 flex items-center justify-between border-b border-ink/[0.06] pb-4">
                <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-ink">
                  <span className="h-2 w-2 rounded-full bg-gold-500" />
                  {category.name}
                </h2>
                <Link href={`/category/${category.slug}`} className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline">
                  {t(lang, "home.viewAllProducts")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                {picks.map((product, index) => (
                  <div key={product.id} className="min-w-[200px] snap-start sm:min-w-0">
                    <ProductCard product={product} index={index} isLoggedIn={isLoggedIn} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
