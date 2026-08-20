import { json, requireApiAdmin, handleApiError, ApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    if (!body || typeof body.status !== "string") throw new ApiError("Invalid status");

    const status = body.status;
    if (!["APPROVED", "CANCELLED"].includes(status)) throw new ApiError("Invalid status");

    const existing = await prisma.cashSale.findUnique({ where: { id: params.id } });
    if (!existing) throw new ApiError("Cash sale not found", 404);
    if (existing.status === "CANCELLED") throw new ApiError("Cancelled sales cannot be changed");

    const sale = await prisma.cashSale.update({
      where: { id: params.id },
      data: { status },
    });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "CASH_SALE_UPDATE",
      entity: "CashSale",
      entityId: sale.id,
      details: `Set ${sale.saleNumber} to ${status}`,
    });

    return json({ sale });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    requireSameOrigin(_request);
    const existing = await prisma.cashSale.findUnique({ where: { id: params.id } });
    if (!existing) throw new ApiError("Cash sale not found", 404);
    if (existing.status === "APPROVED") {
      throw new ApiError("Approved cash sales cannot be deleted — cancel them instead", 400);
    }

    await prisma.cashSale.delete({ where: { id: params.id } });
    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "CASH_SALE_DELETE",
      entity: "CashSale",
      entityId: existing.id,
      details: `Deleted ${existing.saleNumber}`,
    });

    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
