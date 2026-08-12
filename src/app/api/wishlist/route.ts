import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireApiUser();
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: session.sub },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return json({
      items: wishlist.map((w) => ({
        id: w.id,
        productId: w.productId,
        createdAt: w.createdAt,
        product: {
          id: w.product.id,
          slug: w.product.slug,
          name: w.product.name,
          price: w.product.price,
          compareAtPrice: w.product.compareAtPrice,
          image: w.product.images.split(",")[0],
          stock: w.product.stock,
          rating: w.product.rating,
          ratingCount: w.product.ratingCount,
        },
      })),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
