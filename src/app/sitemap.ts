import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";
import { publishedWhere } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    }),
    prisma.blogPost.findMany({
      where: publishedWhere(),
      select: { slug: true, publishedAt: true },
    }),
  ]);

  const staticPages = [
    { url: base, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/blog`, changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  const productPages = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPages = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}

export const dynamic = 'force-dynamic';

