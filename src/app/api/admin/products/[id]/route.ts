import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { logActivity } from "@/lib/activity";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) return error("Product not found.", 404);

    const body = await request.json().catch(() => null);
    if (body === null) return error("Invalid request.");

    if (body.mode === "photo") {
      if (!body.images) return error("Provide at least one image URL.");
      const product = await prisma.product.update({ where: { id: params.id }, data: { images: String(body.images) } });
      await logActivity({ actorId: session.sub, actorName: session.name, role: session.role, action: "PRODUCT_UPDATE", entity: "Product", entityId: product.id, details: `${product.name}: updated photo`, ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null });
      return json({ product });
    }

    if (body.mode === "quick-edit") {
      const data: Record<string, unknown> = {};
      if (body.price !== undefined) data.price = Number(body.price);
      if (body.shortDescription !== undefined) data.shortDescription = String(body.shortDescription);
      if (body.description !== undefined) data.description = String(body.description);
      const product = await prisma.product.update({ where: { id: params.id }, data });
      await logActivity({ actorId: session.sub, actorName: session.name, role: session.role, action: "PRODUCT_UPDATE", entity: "Product", entityId: product.id, details: `${product.name}: quick edit`, ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null });
      return json({ product });
    }

    // Allow partial updates (stock/status quick edits or full form)
    if (body.mode === "quick") {
      const product = await prisma.product.update({
        where: { id: params.id },
        data: {
          stock: typeof body.stock === "number" ? body.stock : existing.stock,
          status: typeof body.status === "string" ? body.status : existing.status,
          isBestSeller: typeof body.isBestSeller === "boolean" ? body.isBestSeller : existing.isBestSeller,
        },
      });
      await logActivity({
        actorId: session.sub,
        actorName: session.name,
        role: session.role,
        action: "PRODUCT_UPDATE",
        entity: "Product",
        entityId: product.id,
        details: `${product.name}: stock=${product.stock} status=${product.status}`,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      });
      return json({ product });
    }

    const parsed = zodParseSafe(productSchema, body);
    if (!parsed.ok) return error(parsed.message);

    const slugExists = await prisma.product.findFirst({
      where: { slug: parsed.data.slug, id: { not: params.id } },
    });
    if (slugExists) return error("A product with this slug already exists.", 409);

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        categoryId: parsed.data.categoryId,
        compareAtPrice: parsed.data.compareAtPrice || null,
        isBestSeller: Boolean(body.isBestSeller),
        isFeatured: Boolean(body.isFeatured),
         ...(body.images || body.image
           ? {
               images: String(body.images || body.image)
                 .split(/[\n,]+/)
                 .map((value) => value.trim())
                 .filter(Boolean)
                 .join(","),
             }
           : {}),
      },
      include: { category: true },
    });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "PRODUCT_UPDATE",
      entity: "Product",
      entityId: product.id,
      details: `${product.name} updated`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ product });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) return error("Product not found.", 404);

    await prisma.product.delete({ where: { id: params.id } });
    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "PRODUCT_DELETE",
      entity: "Product",
      entityId: params.id,
      details: `${existing.name} (${existing.sku}) deleted`,
      ip: _request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
