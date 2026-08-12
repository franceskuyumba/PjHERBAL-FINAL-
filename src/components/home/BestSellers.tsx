"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BestSellers({
  products,
  isLoggedIn = false,
}: {
  products: ProductCardProduct[];
  isLoggedIn?: boolean;
}) {
  return (
    <section className="container-site py-16 sm:py-20">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Customer favourites"
          title="Best Sellers"
          subtitle="The products our customers trust and reorder again and again."
          align="left"
          className="mb-0"
        />
        <Link href="/shop" className="btn-outline btn-md hidden shrink-0 sm:inline-flex">
          View all products
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
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
