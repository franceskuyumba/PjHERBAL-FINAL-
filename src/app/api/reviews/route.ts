import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiUser();
    const body = await request.json().catch(() => null);
    const productId = String(body?.productId || "");
    const rating = Math.max(1, Math.min(5, Math.floor(Number(body?.rating) || 5)));
    const comment = String(body?.comment || "").trim();
    const title = String(body?.title || "").trim().slice(0, 120) || null;

    if (!productId) return error("Product is required.");
    if (comment.length < 5) return error("Please write a short review.");

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return error("Product not found.", 404);

    const user = await prisma.user.findUnique({ where: { id: session.sub } });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.sub,
        author: user?.name || "Customer",
        rating,
        title,
        comment,
        isApproved: false,
      },
    });

    return json({ review }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
