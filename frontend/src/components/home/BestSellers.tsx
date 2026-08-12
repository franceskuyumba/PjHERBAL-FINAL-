import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBestSellers } from "@/lib/store";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";

export default function BestSellers() {
  const products = getBestSellers();
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Best Sellers"
            title="Most Loved Products This Month"
            description="Trusted by thousands of customers across Tanzania for quality, results and fast delivery."
            className="mx-0"
          />
          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-50"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
