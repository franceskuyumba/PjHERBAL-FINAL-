"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/context/LanguageContext";

export function BestSellers({
  products,
  isLoggedIn = false,
}: {
  products: ProductCardProduct[];
  isLoggedIn?: boolean;
}) {
  const { t } = useI18n();
  return (
    <section className="container-site py-16 sm:py-20">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow={t("home.bestSellers.eyebrow")}
          title={t("home.bestSellers.title")}
          subtitle={t("home.bestSellers.subtitle")}
          align="left"
          className="mb-0"
        />
        <Link href="/shop" className="btn-outline btn-md hidden shrink-0 sm:inline-flex">
          {t("home.viewAllProducts")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} isLoggedIn={isLoggedIn} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/shop" className="btn-outline btn-md">
          {t("home.viewAllProducts")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
