import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { logActivity } from "@/lib/activity";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    const existing = await prisma.coupon.findUnique({ where: { id: params.id } });
    if (!existing) return error("Coupon not found.", 404);

    const body = await request.json().catch(() => null);

    if (body?.mode === "toggle") {
      const coupon = await prisma.coupon.update({
        where: { id: params.id },
        data: { isActive: Boolean(body.isActive) },
      });
      await logActivity({
        actorId: session.sub,
        actorName: session.name,
        role: session.role,
        action: "COUPON_UPDATE",
        entity: "Coupon",
        entityId: coupon.id,
        details: `${coupon.code} ${coupon.isActive ? "enabled" : "disabled"}`,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      });
      return json({ coupon });
    }

    const parsed = zodParseSafe(couponSchema, body || {});
    if (!parsed.ok) return error(parsed.message);

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: parsed.data.code,
        type: parsed.data.type,
        value: parsed.data.value,
        minOrder: parsed.data.minOrder,
        maxDiscount: parsed.data.maxDiscount || null,
        maxUses: parsed.data.maxUses || null,
        startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
      },
    });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "COUPON_UPDATE",
      entity: "Coupon",
      entityId: coupon.id,
      details: `${coupon.code} updated`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ coupon });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    const existing = await prisma.coupon.findUnique({ where: { id: params.id } });
    if (!existing) return error("Coupon not found.", 404);
    await prisma.coupon.delete({ where: { id: params.id } });
    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "COUPON_UPDATE",
      entity: "Coupon",
      entityId: params.id,
      details: `${existing.code} deleted`,
      ip: _request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
