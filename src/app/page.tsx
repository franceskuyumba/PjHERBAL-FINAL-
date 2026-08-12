import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { FlashDeals } from "@/components/home/FlashDeals";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { BestSellers } from "@/components/home/BestSellers";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { BlogPreview } from "@/components/home/BlogPreview";
import { WhyUs } from "@/components/home/WhyUs";
import { StorySection } from "@/components/home/StorySection";
import { CartReminder } from "@/components/cart/CartReminder";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { toProductCard } from "@/lib/serializers";
import { getRecommendations } from "@/lib/recommendations";
import { SITE } from "@/lib/constants";
import { generateJsonLd } from "@/lib/seo";
import { publishedWhere } from "@/lib/blog";
import type { ProductCardProduct } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: `${SITE.name} – ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, bestSellers, recentPosts, user, dealCandidates, newArrivals] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { status: "ACTIVE" } } } } },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE", isBestSeller: true },
      orderBy: { ratingCount: "desc" },
      take: 8,
      include: { category: true },
    }),
    prisma.blogPost.findMany({
      where: publishedWhere(),
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    getCurrentUser(),
    prisma.product.findMany({
      where: { status: "ACTIVE", compareAtPrice: { not: null } },
      include: { category: true },
      take: 12,
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      include: { category: true },
      take: 8,
    }),
  ]);

  const categoryCards = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    icon: c.icon,
    productCount: c._count.products,
  }));

  const flashProducts = dealCandidates
    .filter((p) => p.compareAtPrice != null && p.compareAtPrice > p.price)
    .sort(
      (a, b) =>
        ((b.compareAtPrice! - b.price) / b.compareAtPrice!) -
        ((a.compareAtPrice! - a.price) / a.compareAtPrice!)
    )
    .slice(0, 4)
    .map((p) => toProductCard(p));

  const newArrivalCards = newArrivals.map((p) => toProductCard(p));

  let recommended: ProductCardProduct[] = [];
  if (user && user.role === "CUSTOMER") {
    recommended = await getRecommendations(user.id, 4);
  }

  const isLoggedIn = Boolean(user);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateJsonLd({
              type: "Organization",
              name: SITE.name,
              url: SITE.url,
              description: SITE.description,
            })
          ),
        }}
      />
      <Hero />
      <CartReminder />
      <TrustBar />
      <FlashDeals products={flashProducts} isLoggedIn={isLoggedIn} />
      <FeaturedCategories categories={categoryCards} />
      {recommended.length > 0 && (
        <ProductGridSection
          eyebrow="Personalised for you"
          title="Recommended for you"
          subtitle="Picked from the categories you shop and browse most."
          href="/customer-dashboard/recommendations"
          linkLabel="See all recommendations"
          products={recommended}
          isLoggedIn={isLoggedIn}
        />
      )}
      <BestSellers products={bestSellers.map((p) => toProductCard(p))} isLoggedIn={isLoggedIn} />
      <ProductGridSection
        eyebrow="Just arrived"
        title="New Arrivals"
        subtitle="The latest additions to the PJHERBAL collection, straight from our dispensary."
        href="/shop?sort=newest"
        linkLabel="View all products"
        products={newArrivalCards}
        isLoggedIn={isLoggedIn}
      />
      <PromoBanner />
      <StorySection />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <BlogPreview posts={recentPosts} />
      <Newsletter />
    </>
  );
}
