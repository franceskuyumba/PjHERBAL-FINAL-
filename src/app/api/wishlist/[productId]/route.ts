import { NextRequest } from "next/server";
import { json, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const session = await requireApiUser();
    const product = await prisma.product.findUnique({ where: { id: params.productId } });
    if (!product) return json({ error: "Product not found." }, 404);

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: session.sub, productId: params.productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return json({ added: false });
    }

    await prisma.wishlistItem.create({
      data: { userId: session.sub, productId: params.productId },
    });
    return json({ added: true });
  } catch (e) {
    return handleApiError(e);
  }
}
