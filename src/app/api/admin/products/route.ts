import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { logActivity } from "@/lib/activity";

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const search = request.nextUrl.searchParams.get("search") || "";
    const lowStockOnly = request.nextUrl.searchParams.get("lowStock") === "1";
    const products = await prisma.product.findMany({
      where: search
        ? { OR: [{ name: { contains: search } }, { sku: { contains: search } }] }
        : undefined,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    if (lowStockOnly) {
      return json({
        products: products.filter((p) => p.status === "ACTIVE" && p.stock <= p.lowStockThreshold),
      });
    }
    return json({ products });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiAdmin();
    const body = await request.json().catch(() => null);
    const parsed = zodParseSafe(productSchema, body || {});
    if (!parsed.ok) return error(parsed.message);

    const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return error("A product with this slug already exists.", 409);

    const sku = body?.sku ? String(body.sku) : `PJH-${parsed.data.slug.replace(/-/g, "").toUpperCase().slice(0, 10)}`;
    const image = body?.image || `/images/products/${parsed.data.slug}.svg`;

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        sku,
        images: image,
        categoryId: parsed.data.categoryId,
        compareAtPrice: parsed.data.compareAtPrice || null,
        isBestSeller: Boolean(body?.isBestSeller),
        isFeatured: Boolean(body?.isFeatured),
      },
      include: { category: true },
    });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "PRODUCT_CREATE",
      entity: "Product",
      entityId: product.id,
      details: `${product.name} (${product.sku})`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ product }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
