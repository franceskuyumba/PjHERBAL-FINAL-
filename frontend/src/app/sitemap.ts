import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { blogPosts } from "@/lib/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/shop",
    "/cart",
    "/checkout",
    "/order-success",
    "/customer-dashboard",
    "/about",
    "/contact",
    "/blog",
    "/privacy-policy",
    "/terms",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE.url}/shop/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE.url}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${SITE.url}/blog/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
