import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { logActivity } from "@/lib/activity";

export async function GET() {
  try {
    await requireApiAdmin();
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return json({ coupons });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiAdmin();
    const body = await request.json().catch(() => null);
    const parsed = zodParseSafe(couponSchema, body || {});
    if (!parsed.ok) return error(parsed.message);

    const exists = await prisma.coupon.findUnique({ where: { code: parsed.data.code } });
    if (exists) return error("A coupon with this code already exists.", 409);

    const coupon = await prisma.coupon.create({
      data: {
        code: parsed.data.code,
        type: parsed.data.type,
        value: parsed.data.value,
        minOrder: parsed.data.minOrder,
        maxDiscount: parsed.data.maxDiscount || null,
        maxUses: parsed.data.maxUses || null,
        startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "COUPON_CREATE",
      entity: "Coupon",
      entityId: coupon.id,
      details: `${coupon.code} (${coupon.type} ${coupon.value})`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ coupon }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
