import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts } from "@/lib/store";
import { buildMetadata } from "@/lib/seo";
import { products } from "@/lib/data/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { SITE } from "@/lib/constants";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return buildMetadata({
    title: product.title,
    description: product.metaDescription || product.shortBenefits,
    path: `/product/${product.slug}`,
    image: product.images[0],
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: SITE.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/product/${product.slug}`,
      priceCurrency: "TZS",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.title },
          ]}
        />
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} title={product.title} />
          <ProductDetails product={product} />
        </div>

        <div className="mt-16">
          <ProductReviews product={product} />
        </div>

        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
