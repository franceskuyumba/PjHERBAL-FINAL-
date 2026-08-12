import { prisma } from "@/lib/prisma";
import { toProductCard } from "@/lib/serializers";
import type { ProductCardProduct } from "@/components/product/ProductCard";

/**
 * Honest, signal-based recommendation engine.
 *
 * No fake AI: we rank product categories by the customer's own behaviour
 * (purchases > wishlist > recently viewed), then surface the best-selling
 * ACTIVE products in those categories. Falls back to site-wide best sellers.
 */
export async function getRecommendations(userId: string, limit = 4): Promise<ProductCardProduct[]> {
  const [orders, wishlist, views] = await Promise.all([
    prisma.order.findMany({
      where: { userId, status: { not: "CANCELLED" } },
      select: { items: { select: { productId: true, quantity: true } } },
    }),
    prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
    }),
    prisma.productView.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { productId: true, createdAt: true },
    }),
  ]);

  // Aggregate signals per product id
  const signal = new Map<string, number>();
  const addSignal = (productId: string | null, weight: number) => {
    if (!productId) return;
    signal.set(productId, (signal.get(productId) || 0) + weight);
  };

  for (const order of orders) {
    for (const item of order.items) addSignal(item.productId, item.quantity);
  }
  for (const w of wishlist) addSignal(w.productId, 2);
  const recentCutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  views.forEach((v) => {
    addSignal(v.productId, v.createdAt > recentCutoff ? 1.5 : 1);
  });

  const signalProductIds = Array.from(signal.keys());
  if (signalProductIds.length === 0) {
    const fallback = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { ratingCount: "desc" },
      take: limit,
      include: { category: true },
    });
    return fallback.map((p) => toProductCard(p));
  }

  const signalProducts = await prisma.product.findMany({
    where: { id: { in: signalProductIds } },
    select: {
      id: true,
      categoryId: true,
      category: { select: { name: true } },
      price: true,
      compareAtPrice: true,
    },
  });

  const categoryWeight = new Map<string, number>();
  for (const p of signalProducts) {
    const w = signal.get(p.id) || 0;
    categoryWeight.set(p.categoryId, (categoryWeight.get(p.categoryId) || 0) + w);
  }
  const topCategoryIds = Array.from(categoryWeight.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => id);

  const purchasedIds = new Set<string>();
  for (const order of orders) for (const item of order.items) if (item.productId) purchasedIds.add(item.productId);

  const candidates = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      categoryId: { in: topCategoryIds },
      id: { notIn: Array.from(purchasedIds) },
    },
    include: { category: true },
    orderBy: { ratingCount: "desc" },
    take: limit + 2,
  });

  const scored = candidates
    .map((p) => ({ p, w: (categoryWeight.get(p.categoryId) || 0) * (p.isBestSeller ? 1.5 : 1) + p.ratingCount / 100 }))
    .sort((a, b) => b.w - a.w)
    .slice(0, limit)
    .map(({ p }) => toProductCard(p));

  if (scored.length < limit) {
    const fallback = await prisma.product.findMany({
      where: { status: "ACTIVE", id: { notIn: scored.map((s) => s.id) } },
      orderBy: { ratingCount: "desc" },
      take: limit - scored.length,
      include: { category: true },
    });
    scored.push(...fallback.map((p) => toProductCard(p)));
  }

  return scored;
}

/** Record a product view for a signed-in user (best-effort, deduped per hour). */
export async function recordProductView(userId: string, productId: string) {
  try {
    const existing = await prisma.productView.findFirst({
      where: { userId, productId, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    if (existing) return;
    await prisma.productView.create({ data: { userId, productId } });
  } catch {
    // best-effort — never break product pages
  }
}
