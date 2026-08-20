import { json, requireApiAdmin, handleApiError, ApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireApiAdmin();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    if (!body) throw new ApiError("Invalid request body");

    const existing = await prisma.walkInCustomer.findUnique({ where: { id: params.id } });
    if (!existing) throw new ApiError("Walk-in customer not found", 404);

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = String(body.name || "").trim();
    if (body.phone !== undefined) data.phone = body.phone ? String(body.phone).trim() : null;
    if (body.email !== undefined) data.email = body.email ? String(body.email).trim() : null;
    if (body.source !== undefined) data.source = String(body.source);
    if (body.interest !== undefined) data.interest = body.interest ? String(body.interest).trim() : null;
    if (body.notes !== undefined) data.notes = body.notes ? String(body.notes).trim() : null;
    if (body.visitedAt !== undefined) data.visitedAt = new Date(body.visitedAt);

    const customer = await prisma.walkInCustomer.update({ where: { id: params.id }, data });
    return json({ customer });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireApiAdmin();
    requireSameOrigin(_request);
    await prisma.walkInCustomer.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
