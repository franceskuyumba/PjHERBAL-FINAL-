import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyPanel } from "@/components/product/BuyPanel";
import { ProductShareButtons } from "@/components/product/ProductShareButtons";
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
import { parseProductImages } from "@/lib/product-images";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!product) return {};
  const [image] = parseProductImages(product.images);
  return {
    title: product.name,
    description: product.shortDescription ?? "",
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE.name}`,
      description: product.shortDescription ?? "",
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

  const images = parseProductImages(product.images);
  const related = await prisma.product.findMany({
    where: { status: "ACTIVE", categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    take: 4,
  });

  const isLoggedIn = Boolean(user);

  const tabs = [
    { id: "benefits", label: t(lang, "product.tabBenefits"), content: (product.benefits || product.shortDescription || "") as string },
    { id: "ingredients", label: t(lang, "product.tabIngredients"), content: product.ingredients || t(lang, "product.defaultIngredients") },
    { id: "usage", label: t(lang, "product.tabUsage"), content: product.usage || t(lang, "product.defaultUsage") },
    { id: "precautions", label: t(lang, "product.tabPrecautions"), content: product.precautions || t(lang, "product.defaultPrecautions") },
  ];

  const jsonLd = generateJsonLd({
    type: "Product",
    name: product.name,
    description: product.shortDescription ?? "",
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

      <div className="container-site py-8 sm:py-12">
        <Breadcrumbs
          crumbs={[
            { label: t(lang, "shop.title"), href: "/shop" },
            { label: product.category.name, href: `/category/${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={images} name={product.name} />

          <div>
            <div className="flex items-center gap-2">
              {product.isBestSeller && (
                <span className="badge rounded-lg bg-gold-500 px-2.5 py-1 text-[11px] font-bold text-brand-950">{t(lang, "product.bestSeller")}</span>
              )}
              <span className="badge rounded-lg bg-sage-50 px-2.5 py-1 text-[11px] font-bold text-sage-700">{product.category.name}</span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Rating value={product.rating} count={product.ratingCount} />
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${product.stock > 0 ? "border-sage-500/20 bg-sage-50 text-sage-700" : "border-red-200 bg-red-50 text-red-600"}`}>
                {product.stock > 0 ? "In Stock - Ready for Delivery" : t(lang, "ui.stock.out")}
              </span>
              <StockBadge stock={product.stock} />
            </div>

            <p className="mt-5 text-base leading-7 text-ink-muted">{product.shortDescription ?? ""}</p>

            {(product.benefits || product.shortDescription) && (
              <div className="mt-6 rounded-2xl border border-ink/[0.04] bg-white p-5 shadow-soft">
                <p className="text-sm font-bold text-brand-700">Key Benefits</p>
                <ul className="mt-2.5 space-y-2 text-sm leading-6 text-ink-muted">
                  {(product.benefits || product.shortDescription || "").split(/[\n•·]/).filter(Boolean).slice(0,5).map((b, i) => (
                    <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{b.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

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
            <ProductShareButtons title={product.name} slug={product.slug} />

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-ink/[0.04] bg-white p-4 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-50 text-sage-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{t(lang, "product.fastDelivery")}</p>
                  <p className="text-xs text-ink-muted">{t(lang, "product.fastDeliverySub")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-ink/[0.04] bg-white p-4 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{t(lang, "product.genuine")}</p>
                  <p className="text-xs text-ink-muted">{t(lang, "product.genuineSub")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-ink">{t(lang, "product.details")}</h2>
          <div className="mt-4">
            <Tabs tabs={tabs} />
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              {t(lang, "product.reviewsCount").replace("{count}", String(product.reviews.length))}
            </h2>
            <div className="mt-6 space-y-4">
              {product.reviews.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-ink/[0.08] bg-white p-8 text-center text-sm text-ink-muted">
                  {t(lang, "product.noReviews")}
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-ink/[0.04] bg-white p-5 shadow-soft sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 font-bold text-sage-700">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{review.author}</p>
                          <p className="text-xs text-ink-muted">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <Rating value={review.rating} showValue={false} />
                    </div>
                    {review.title && (
                      <h4 className="mt-3 font-semibold text-brand-800">{review.title}</h4>
                    )}
                    <p className="mt-1.5 text-sm leading-6 text-ink-muted">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            {isLoggedIn ? (
              <ReviewForm productId={product.id} />
            ) : (
              <div className="rounded-2xl border border-ink/[0.04] bg-sage-50 p-6 text-center shadow-soft">
                <h3 className="font-display text-lg font-bold text-ink">{t(lang, "product.bought")}</h3>
                <p className="mt-2 text-sm text-ink-muted">
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
              <h2 className="font-display text-2xl font-bold text-ink">{t(lang, "product.related")}</h2>
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
