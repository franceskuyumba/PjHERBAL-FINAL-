import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";

export async function GET() {
  try {
    const session = await requireApiUser();
    const addresses = await prisma.address.findMany({
      where: { userId: session.sub },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return json({ addresses });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiUser();
    const body = await request.json().catch(() => null);
    const parsed = zodParseSafe(addressSchema, body || {});
    if (!parsed.ok) return error(parsed.message);

    const { label, recipientName, phone, region, district, street, isDefault } = {
      isDefault: Boolean(body?.isDefault),
      ...parsed.data,
    };

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: session.sub }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.sub,
        label: label || "Home",
        recipientName,
        phone,
        region,
        district,
        street,
        isDefault,
      },
    });

    return json({ address }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
