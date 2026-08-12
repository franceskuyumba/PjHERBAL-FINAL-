import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WishlistGrid } from "@/components/dashboard/WishlistGrid";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) notFound();

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.sub },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">My wishlist</h1>
      <p className="mt-1 text-sm text-ink/55">Products you have saved for later.</p>
      <WishlistGrid
        products={wishlist.map((w) => ({
          wishlistId: w.id,
          id: w.product.id,
          slug: w.product.slug,
          name: w.product.name,
          shortDescription: w.product.shortDescription,
          price: w.product.price,
          compareAtPrice: w.product.compareAtPrice,
          image: w.product.images.split(",")[0],
          stock: w.product.stock,
          rating: w.product.rating,
          ratingCount: w.product.ratingCount,
          isBestSeller: w.product.isBestSeller,
          categoryName: w.product.category?.name,
        }))}
      />
    </div>
  );
}
