import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { getLocale, t } from "@/lib/i18n";

export function ProductGridSection({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
  products,
  isLoggedIn = false,
  isAdmin = false,
  bg = "muted",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href: string;
  linkLabel?: string;
  products: ProductCardProduct[];
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  bg?: "muted" | "white";
}) {
  const lang = getLocale();
  const resolvedLinkLabel = linkLabel ?? t(lang, "home.viewAllProducts");
  return (
    <section className={cn("py-16 sm:py-24", bg === "muted" ? "bg-surface-muted" : "bg-white")}>
      <div className="container-site">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" className="mb-0" />
          <Link href={href} className="btn-outline btn-md hidden shrink-0 sm:inline-flex">
            {resolvedLinkLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href={href} className="btn-outline btn-md">
            {resolvedLinkLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
