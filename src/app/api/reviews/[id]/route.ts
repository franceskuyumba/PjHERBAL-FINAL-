import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiUser();
    const review = await prisma.review.findUnique({ where: { id: params.id } });
    if (!review) return error("Review not found.", 404);
    if (review.userId !== session.sub) return error("You can only delete your own reviews.", 403);
    await prisma.review.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
