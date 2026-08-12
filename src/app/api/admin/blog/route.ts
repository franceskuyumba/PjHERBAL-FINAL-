import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { estimateReadingTime } from "@/lib/blog";

export async function GET() {
  try {
    await requireApiAdmin();
    const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    return json({ posts });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    const body = await request.json().catch(() => null);
    const parsed = zodParseSafe(blogSchema, body || {});
    if (!parsed.ok) return error(parsed.message);

    const exists = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
    if (exists) return error("A post with this slug already exists.", 409);

    const post = await prisma.blogPost.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage || `/images/blog/${parsed.data.slug}.svg`,
        category: parsed.data.category,
        author: parsed.data.author,
        authorRole: parsed.data.authorRole || null,
        isPublished: parsed.data.isPublished,
        isFeatured: parsed.data.isFeatured,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        readingTime: parsed.data.readingTime || estimateReadingTime(parsed.data.content),
        scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : null,
      },
    });

    return json({ post }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
