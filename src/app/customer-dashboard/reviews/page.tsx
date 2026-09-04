import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseProductImages } from "@/lib/product-images";
import { MyReviewsList } from "@/components/dashboard/MyReviewsList";
import { getLocale, t } from "@/lib/i18n";

export const metadata = { title: "My Reviews", robots: { index: false, follow: false } };

export default async function ReviewsPage() {
  const lang = getLocale();
  const session = await getSession();
  if (!session) notFound();

  const reviews = await prisma.review.findMany({
    where: { userId: session.sub },
    include: { product: { select: { slug: true, name: true, images: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">{t(lang, "dash.reviews.title")}</h1>
      <p className="mt-1 text-sm text-ink/55">{t(lang, "dash.reviews.subtitle")}</p>
      <MyReviewsList
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          isApproved: r.isApproved,
          createdAt: r.createdAt.toISOString(),
          product: {
            slug: r.product.slug,
            name: r.product.name,
            image: parseProductImages(r.product.images)[0] || "/images/hero.svg",
          },
        }))}
      />
    </div>
  );
}
