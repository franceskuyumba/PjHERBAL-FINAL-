import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FeaturedCategories() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Shop by Category"
          title="Find Exactly What Your Body Needs"
          description="Browse our carefully curated categories and discover the right supplements for your health goals."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/shop/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-400">
                    {cat.tagline}
                  </p>
                  <h3 className="mt-1 flex items-center justify-between font-display text-lg font-bold text-white">
                    {cat.name}
                    <ArrowRight className="h-5 w-5 text-gold-400 transition-transform duration-300 group-hover:translate-x-1" />
                  </h3>
                  <p className="mt-1 text-xs text-brand-200">
                    {count} products • {cat.shortName}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
