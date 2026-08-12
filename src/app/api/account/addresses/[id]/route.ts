import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiUser();
    const body = await request.json().catch(() => null);

    const address = await prisma.address.findFirst({
      where: { id: params.id, userId: session.sub },
    });
    if (!address) return error("Address not found.", 404);

    if (body?.mode === "default") {
      await prisma.address.updateMany({ where: { userId: session.sub }, data: { isDefault: false } });
      const updated = await prisma.address.update({
        where: { id: params.id },
        data: { isDefault: true },
      });
      return json({ address: updated });
    }

    const parsed = zodParseSafe(addressSchema, body || {});
    if (!parsed.ok) return error(parsed.message);

    if (body?.isDefault) {
      await prisma.address.updateMany({ where: { userId: session.sub }, data: { isDefault: false } });
    }

    const updated = await prisma.address.update({
      where: { id: params.id },
      data: {
        label: parsed.data.label || address.label,
        recipientName: parsed.data.recipientName,
        phone: parsed.data.phone,
        region: parsed.data.region,
        district: parsed.data.district,
        street: parsed.data.street,
        isDefault: Boolean(body?.isDefault ?? address.isDefault),
      },
    });

    return json({ address: updated });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiUser();
    const address = await prisma.address.findFirst({
      where: { id: params.id, userId: session.sub },
    });
    if (!address) return error("Address not found.", 404);

    await prisma.address.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
