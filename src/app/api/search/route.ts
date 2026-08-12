import { NextRequest } from "next/server";
import { json, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/blog";
import { toProductCard } from "@/lib/serializers";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim() || "";

    if (!q) {
      const [products, categories] = await Promise.all([
        prisma.product.findMany({
          where: { status: "ACTIVE" },
          include: { category: true },
          orderBy: [{ isBestSeller: "desc" }, { ratingCount: "desc" }],
          take: 5,
        }),
        prisma.category.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          take: 6,
        }),
      ]);

      return json({
        products: products.map(toProductCard),
        categories: categories.map((c) => ({ slug: c.slug, name: c.name })),
        articles: [],
      });
    }

    const [products, categories, articles] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: q } },
            { shortDescription: { contains: q } },
            { description: { contains: q } },
          ],
        },
        include: { category: true },
        orderBy: [{ isBestSeller: "desc" }, { ratingCount: "desc" }],
        take: 6,
      }),
      prisma.category.findMany({
        where: { isActive: true, name: { contains: q } },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
      prisma.blogPost.findMany({
        where: {
          ...publishedWhere(),
          OR: [{ title: { contains: q } }, { excerpt: { contains: q } }],
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { slug: true, title: true, excerpt: true, coverImage: true },
      }),
    ]);

    return json({
      products: products.map(toProductCard),
      categories: categories.map((c) => ({ slug: c.slug, name: c.name })),
      articles,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
