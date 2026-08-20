import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryCardData } from "@/components/home/CategoryCard";
import { getLocale, t } from "@/lib/i18n";

export function PromoTileGrid({ categories }: { categories: CategoryCardData[] }) {
  const lang = getLocale();
  return (
    <section className="container-site py-8 sm:py-12">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{t(lang, "home.featuredCategories.eyebrow")}</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-brand-950 sm:text-3xl">{t(lang, "home.featuredCategories.title")}</h2>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-brand-700 hover:underline">{t(lang, "home.viewAllProducts")}</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {categories.slice(0, 4).map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`} className="group relative min-h-36 overflow-hidden rounded-xl bg-brand-900 shadow-sm sm:min-h-52">
            <Image src={category.image} alt={category.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent" />
            <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-white sm:inset-x-5 sm:bottom-5">
              <span><span className="block font-display text-sm font-bold sm:text-xl">{category.name}</span><span className="mt-1 block line-clamp-1 text-[10px] text-white/75 sm:text-xs">{category.description}</span></span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-gold-300" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
