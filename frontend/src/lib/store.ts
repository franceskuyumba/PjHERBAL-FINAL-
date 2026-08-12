import { products } from "./data/products";
import { categories } from "./data/categories";
import { blogPosts } from "./data/blog";
import { coupons, regions } from "./data/store";
import type { Category, Coupon, Product } from "./types";

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller).slice(0, 8);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured).slice(0, 8);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .concat(products.filter((p) => p.category !== product.category && p.id !== product.id))
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.title, p.shortBenefits, p.description, ...p.tags]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((b) => b.slug === slug);
}

export function getRegionByName(name: string) {
  return regions.find((r) => r.name === name);
}

export function resolveCoupon(code: string): Coupon | undefined {
  const c = coupons.find(
    (x) => x.code.toLowerCase() === code.trim().toLowerCase() && x.active
  );
  if (!c) return undefined;
  if (c.expiresAt && new Date(c.expiresAt) < new Date()) return undefined;
  return c;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (subtotal < coupon.minOrder) return 0;
  if (coupon.discountType === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }
  return Math.min(coupon.value, subtotal);
}

export { categories, products, blogPosts, coupons, regions };
