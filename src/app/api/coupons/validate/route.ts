import { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
  const subtotal = Number(body?.subtotal) || 0;

  if (!code) return json({ error: "Please enter a coupon code." }, 400);

  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive) {
    return json({ error: "This coupon is not valid." }, 400);
  }
  if (coupon.startsAt && coupon.startsAt > new Date()) {
    return json({ error: "This coupon is not active yet — it starts on a later date." }, 400);
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return json({ error: "This coupon has expired." }, 400);
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return json({ error: "This coupon has reached its usage limit." }, 400);
  }
  if (subtotal < coupon.minOrder) {
    return json({ error: `This coupon requires a minimum order of TZS ${coupon.minOrder.toLocaleString()}.` }, 400);
  }

  return json({
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount,
    },
  });
}
