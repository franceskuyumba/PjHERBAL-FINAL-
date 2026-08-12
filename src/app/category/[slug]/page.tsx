import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { toProductCard } from "@/lib/serializers";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description} Shop premium ${category.name.toLowerCase()} supplements online at PJHERBAL Clinic Segerea, Dar es Salaam.`,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} | ${SITE.name}`,
      description: category.description,
      images: [{ url: absoluteUrl(category.image) }],
    },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const lang = getLocale();
  const [category, products, otherCategories, user] = await Promise.all([
    prisma.category.findUnique({ where: { slug: params.slug } }),
    prisma.product.findMany({
      where: { status: "ACTIVE", category: { slug: params.slug } },
      include: { category: true },
      orderBy: [{ isBestSeller: "desc" }, { ratingCount: "desc" }],
    }),
    prisma.category.findMany({
      where: { isActive: true, slug: { not: params.slug } },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
    getCurrentUser(),
  ]);

  if (!category) notFound();

  const isLoggedIn = Boolean(user);

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-800 to-brand-600">
        <div className="container-site relative grid items-center gap-6 py-12 sm:grid-cols-[1fr_auto] sm:py-16">
          <div>
            <Breadcrumbs
              crumbs={[
                { label: t(lang, "shop.title"), href: "/shop" },
                { label: category.name },
              ]}
            />
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-300">
                PJHERBAL Clinic · {products.length} {products.length === 1 ? t(lang, "shop.product") : t(lang, "shop.products")}
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold text-white">{category.name}</h1>
              <p className="mt-3 max-w-xl text-white/75">{category.description}</p>
            </div>
          </div>
          <Image
            src={category.image}
            alt={category.name}
            width={280}
            height={196}
            className="hidden rounded-3xl border border-white/20 object-cover shadow-lift sm:block"
          />
        </div>
      </div>

      <div className="container-site py-10 sm:py-14">
        {products.length === 0 ? (
          <EmptyState
            icon={<PackageSearch className="h-8 w-8" />}
            title={t(lang, "shop.productsComingSoon")}
            description={t(lang, "shop.comingSoonDesc")}
            action={
              <Link href="/shop" className="btn-primary btn-md">
                {t(lang, "shop.browseAll")}
              </Link>
            }
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-ink/55">
              {t(lang, "shop.showingIn")
                .replace("{count}", String(products.length))
                .replace("{items}", products.length === 1 ? t(lang, "shop.product") : t(lang, "shop.products"))
                .replace("{category}", category.name)}
            </p>
            <Suspense fallback={<GridSkeleton count={6} />}>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={toProductCard(product)} index={i} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </Suspense>
          </>
        )}

        {otherCategories.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-brand-950">{t(lang, "shop.exploreOthers")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="card group flex items-center gap-4 p-4 transition-shadow hover:shadow-lift"
                >
                  <Image src={c.image} alt={c.name} width={72} height={72} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-bold text-brand-950 group-hover:text-brand-700">
                      {c.name}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                      {t(lang, "shop.shopNow")} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
