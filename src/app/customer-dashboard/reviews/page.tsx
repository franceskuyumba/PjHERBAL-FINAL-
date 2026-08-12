import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MyReviewsList } from "@/components/dashboard/MyReviewsList";

export const metadata = { title: "My Reviews", robots: { index: false, follow: false } };

export default async function ReviewsPage() {
  const session = await getSession();
  if (!session) notFound();

  const reviews = await prisma.review.findMany({
    where: { userId: session.sub },
    include: { product: { select: { slug: true, name: true, images: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">My reviews</h1>
      <p className="mt-1 text-sm text-ink/55">Reviews you have written for PJHERBAL products.</p>
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
            image: r.product.images.split(",")[0] || "/images/hero.svg",
          },
        }))}
      />
    </div>
  );
}
