import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyPanel } from "@/components/product/BuyPanel";
import { Tabs } from "@/components/product/Tabs";
import { ReviewForm } from "@/components/product/ReviewForm";
import { Rating } from "@/components/ui/Rating";
import { StockBadge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { TrackProductView } from "@/components/product/TrackProductView";
import { prisma } from "@/lib/prisma";
import { toProductCard } from "@/lib/serializers";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { absoluteUrl, generateJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!product) return {};
  const [image] = product.images.split(",").filter(Boolean);
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE.name}`,
      description: product.shortDescription,
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const lang = getLocale();
  const [product, user] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true, reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" }, take: 20 } },
    }),
    getCurrentUser(),
  ]);

  if (!product) notFound();

  const images = product.images.split(",").filter(Boolean);
  const related = await prisma.product.findMany({
    where: { status: "ACTIVE", categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    take: 4,
  });

  const isLoggedIn = Boolean(user);

  const tabs = [
    { id: "benefits", label: t(lang, "product.tabBenefits"), content: product.benefits || product.shortDescription },
    { id: "ingredients", label: t(lang, "product.tabIngredients"), content: product.ingredients || t(lang, "product.defaultIngredients") },
    { id: "usage", label: t(lang, "product.tabUsage"), content: product.usage || t(lang, "product.defaultUsage") },
    { id: "precautions", label: t(lang, "product.tabPrecautions"), content: product.precautions || t(lang, "product.defaultPrecautions") },
  ];

  const jsonLd = generateJsonLd({
    type: "Product",
    name: product.name,
    description: product.shortDescription,
    image: absoluteUrl(images[0] || "/images/hero.svg"),
    url: absoluteUrl(`/product/${product.slug}`),
    price: product.price,
    currency: "TZS",
    sku: product.sku,
    rating: product.ratingCount > 0 ? { ratingValue: product.rating, ratingCount: product.ratingCount } : undefined,
    stock: product.stock,
  });

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {isLoggedIn && <TrackProductView productId={product.id} />}

      <div className="container-site py-6 sm:py-10">
        <Breadcrumbs
          crumbs={[
            { label: t(lang, "shop.title"), href: "/shop" },
            { label: product.category.name, href: `/category/${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={images} name={product.name} />

          <div>
            <div className="flex items-center gap-2">
              {product.isBestSeller && (
                <span className="badge bg-gold-500 text-brand-950">{t(lang, "product.bestSeller")}</span>
              )}
              <span className="badge bg-brand-50 text-brand-700">{product.category.name}</span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-950 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Rating value={product.rating} count={product.ratingCount} />
              <StockBadge stock={product.stock} />
            </div>

            <p className="mt-5 text-base leading-7 text-ink/65">{product.shortDescription}</p>

            <div className="mt-6">
              <BuyPanel
                productId={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={images[0] || "/images/hero.svg"}
                stock={product.stock}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="card flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-950">{t(lang, "product.fastDelivery")}</p>
                  <p className="text-xs text-ink/50">{t(lang, "product.fastDeliverySub")}</p>
                </div>
              </div>
              <div className="card flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-950">{t(lang, "product.genuine")}</p>
                  <p className="text-xs text-ink/50">{t(lang, "product.genuineSub")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-2xl font-bold text-brand-950">{t(lang, "product.details")}</h2>
          <div className="mt-4">
            <Tabs tabs={tabs} />
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-950">
              {t(lang, "product.reviewsCount").replace("{count}", String(product.reviews.length))}
            </h2>
            <div className="mt-6 space-y-4">
              {product.reviews.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-ink/10 bg-white/60 p-8 text-center text-sm text-ink/55">
                  {t(lang, "product.noReviews")}
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div key={review.id} className="card p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-950">{review.author}</p>
                          <p className="text-xs text-ink/45">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <Rating value={review.rating} showValue={false} />
                    </div>
                    {review.title && (
                      <h4 className="mt-3 font-semibold text-brand-900">{review.title}</h4>
                    )}
                    <p className="mt-1.5 text-sm leading-6 text-ink/65">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            {isLoggedIn ? (
              <ReviewForm productId={product.id} />
            ) : (
              <div className="rounded-2xl bg-brand-50 p-6 text-center">
                <h3 className="font-display text-lg font-bold text-brand-950">{t(lang, "product.bought")}</h3>
                <p className="mt-2 text-sm text-ink/60">
                  {t(lang, "product.signInPrompt")}
                </p>
                <Link href={`/login?next=/product/${product.slug}`} className="btn-primary btn-md mt-4">
                  {t(lang, "product.signInReview")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-brand-950">{t(lang, "product.related")}</h2>
              <Link href={`/category/${product.category.slug}`} className="btn-outline btn-sm">
                {t(lang, "product.viewAll")}
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={toProductCard(p)} index={i} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
