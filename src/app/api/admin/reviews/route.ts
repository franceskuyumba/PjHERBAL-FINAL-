import { NextRequest } from "next/server";
import { json, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const pendingOnly = request.nextUrl.searchParams.get("pending") === "1";
    const reviews = await prisma.review.findMany({
      where: pendingOnly ? { isApproved: false } : undefined,
      include: { product: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return json({ reviews });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireApiAdmin();
    const body = await request.json().catch(() => null);
    const id = String(body?.id || "");
    const isApproved = Boolean(body?.isApproved);
    if (!id) return json({ error: "Review id is required." }, 400);

    const review = await prisma.review.update({ where: { id }, data: { isApproved } });

    // Recompute product rating
    if (review.isApproved) {
      const product = await prisma.product.findUnique({
        where: { id: review.productId },
        include: { reviews: { where: { isApproved: true } } },
      });
      if (product && product.reviews.length > 0) {
        const avg = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
        await prisma.product.update({
          where: { id: product.id },
          data: { rating: Math.round(avg * 10) / 10, ratingCount: product.reviews.length },
        });
      }
    }

    return json({ review });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiAdmin();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return json({ error: "Review id is required." }, 400);
    await prisma.review.delete({ where: { id } });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
