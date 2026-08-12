import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCard, type CategoryCardData } from "@/components/home/CategoryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLocale, t } from "@/lib/i18n";

export function FeaturedCategories({
  categories,
}: {
  categories: (CategoryCardData & { productCount: number })[];
}) {
  const lang = getLocale();
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t(lang, "home.featuredCategories.eyebrow")}
            title={t(lang, "home.featuredCategories.title")}
            subtitle={t(lang, "home.featuredCategories.subtitle")}
            align="left"
            className="mb-0"
          />
          <Link href="/shop" className="btn-outline btn-md hidden shrink-0 sm:inline-flex">
            {t(lang, "home.featuredCategories.browseAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <CategoryCard key={category.slug} category={category} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="btn-outline btn-md">
            {t(lang, "home.featuredCategories.browseAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
