import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toProductCard } from "@/lib/serializers";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop Supplements",
  description:
    "Browse premium natural supplements from PJHERBAL Clinic Segerea. Men's health, weight management, energy, immunity, brain focus and detox products.",
  alternates: { canonical: "/shop" },
};

const PAGE_SIZE = 12;

interface ShopPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const lang = getLocale();
  const search = getParam(searchParams.search).trim();
  const categorySlug = getParam(searchParams.category);
  const sort = getParam(searchParams.sort) || "featured";
  const min = Number(getParam(searchParams.min)) || 0;
  const max = Number(getParam(searchParams.max)) || 0;
  const page = Math.max(1, Number(getParam(searchParams.page)) || 1);

  const orderBy = (() => {
    switch (sort) {
      case "newest":
        return { createdAt: "desc" as const };
      case "price-asc":
        return { price: "asc" as const };
      case "price-desc":
        return { price: "desc" as const };
      case "rating":
        return { rating: "desc" as const };
      case "best-selling":
        return { ratingCount: "desc" as const };
      default:
        return [{ isBestSeller: "desc" as const }, { ratingCount: "desc" as const }];
    }
  })();

  const where = {
    status: "ACTIVE" as const,
    ...(categorySlug
      ? { category: { slug: categorySlug } }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { shortDescription: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}),
    ...(min > 0 || max > 0
      ? { price: { gte: min, ...(max > 0 ? { lte: max } : {}) } }
      : {}),
  };

  const [categories, products, total, maxPriceRow, user] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.aggregate({ _max: { price: true }, where: { status: "ACTIVE" } }),
    getCurrentUser(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isLoggedIn = Boolean(user);
  const filterCategories = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div className="container-site py-8 sm:py-12">
      <div className="mb-8">
        <p className="eyebrow">PJHERBAL Clinic</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-brand-950 sm:text-4xl">
          {categorySlug
            ? categories.find((c) => c.slug === categorySlug)?.name || t(lang, "shop.title")
            : search
              ? t(lang, "shop.resultsFor").replace("{q}", search)
              : t(lang, "shop.titleSupplements")}
        </h1>
        <p className="mt-2 text-sm text-ink/55">
          {total} {total === 1 ? t(lang, "shop.product") : t(lang, "shop.products")} {t(lang, "shop.available")}
          {categorySlug ? " " + t(lang, "shop.inThisCategory") : ""}
        </p>
      </div>

      <div className="flex gap-8">
        <ShopFilters categories={filterCategories} maxPossiblePrice={maxPriceRow._max.price || 100000} />

        <div className="min-w-0 flex-1">
          {total === 0 ? (
            <EmptyState
              icon={<PackageSearch className="h-8 w-8" />}
              title={t(lang, "shop.noProducts")}
              description={t(lang, "shop.noProductsDesc")}
              action={
                <Link href="/shop" className="btn-primary btn-md">
                  {t(lang, "shop.browseAll")}
                </Link>
              }
            />
          ) : (
            <Suspense fallback={<GridSkeleton count={8} />}>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={toProductCard(product)} index={i} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </Suspense>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <PaginationLink
                  href={buildPageHref(searchParams, page - 1)}
                  aria-label={t(lang, "shop.prevPage")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationLink>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-ink/30">…</span>}
                    <PaginationLink
                      href={buildPageHref(searchParams, p)}
                      active={p === page}
                    >
                      {p}
                    </PaginationLink>
                  </span>
                ))}
              {page < totalPages && (
                <PaginationLink
                  href={buildPageHref(searchParams, page + 1)}
                  aria-label={t(lang, "shop.nextPage")}
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildPageHref(
  searchParams: Record<string, string | string[] | undefined>,
  page: number
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, v);
    } else if (value) {
      params.set(key, value);
    }
  }
  params.set("page", String(page));
  return `/shop?${params.toString()}`;
}

function PaginationLink({
  href,
  children,
  active,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  "aria-label"?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
        active
          ? "bg-brand-600 text-white"
          : "border border-ink/10 bg-white text-ink/60 hover:border-brand-600 hover:text-brand-700"
      }`}
    >
      {children}
    </Link>
  );
}
