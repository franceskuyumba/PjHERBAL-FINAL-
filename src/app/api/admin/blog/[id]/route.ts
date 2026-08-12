import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireApiAdmin();
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return error("Post not found.", 404);

    const body = await request.json().catch(() => null);
    const data: Record<string, unknown> = {};

    for (const key of ["title", "excerpt", "content", "coverImage", "category", "author", "authorRole", "seoTitle", "seoDescription"]) {
      if (typeof body?.[key] === "string" && body[key].trim()) data[key] = body[key].trim();
    }
    if (typeof body?.isPublished === "boolean") data.isPublished = body.isPublished;
    if (typeof body?.isFeatured === "boolean") data.isFeatured = body.isFeatured;
    if (typeof body?.readingTime === "number") data.readingTime = body.readingTime;
    if (body?.scheduledFor) data.scheduledFor = new Date(body.scheduledFor);
    if (body?.scheduledFor === null) data.scheduledFor = null;
    if (typeof body?.slug === "string" && body.slug.trim()) {
      const dup = await prisma.blogPost.findFirst({ where: { slug: body.slug.trim(), id: { not: params.id } } });
      if (dup) return error("A post with this slug already exists.", 409);
      data.slug = body.slug.trim();
    }

    const post = await prisma.blogPost.update({ where: { id: params.id }, data });
    return json({ post });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireApiAdmin();
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return error("Post not found.", 404);
    await prisma.blogPost.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
