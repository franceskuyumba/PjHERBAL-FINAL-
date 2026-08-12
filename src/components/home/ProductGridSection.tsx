import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLocale, t } from "@/lib/i18n";

export function ProductGridSection({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
  products,
  isLoggedIn = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href: string;
  linkLabel?: string;
  products: ProductCardProduct[];
  isLoggedIn?: boolean;
}) {
  const lang = getLocale();
  const resolvedLinkLabel = linkLabel ?? t(lang, "home.viewAllProducts");
  return (
    <section className="container-site py-16 sm:py-20">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" className="mb-0" />
        <Link href={href} className="btn-outline btn-md hidden shrink-0 sm:inline-flex">
          {resolvedLinkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} isLoggedIn={isLoggedIn} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href={href} className="btn-outline btn-md">
          {resolvedLinkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
