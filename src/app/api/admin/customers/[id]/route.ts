import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireApiAdmin();
    const customer = await prisma.user.findUnique({
      where: { id: params.id, role: "CUSTOMER" },
      select: {
        id: true, name: true, email: true, phone: true, isActive: true, createdAt: true,
        addresses: true,
        orders: { orderBy: { createdAt: "desc" }, include: { items: true }, take: 50 },
        reviews: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
    if (!customer) return error("Customer not found.", 404);
    return json({ customer });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    if (typeof body?.isActive !== "boolean") return error("Provide isActive as a boolean.");
    const existing = await prisma.user.findUnique({ where: { id: params.id, role: "CUSTOMER" } });
    if (!existing) return error("Customer not found.", 404);
    const customer = await prisma.user.update({ where: { id: params.id }, data: { isActive: body.isActive }, select: { id: true, name: true, email: true, phone: true, isActive: true } });
    await logActivity({ actorId: session.sub, actorName: session.name, role: session.role, action: "CUSTOMER_UPDATE", entity: "User", entityId: customer.id, details: `${customer.email}: ${body.isActive ? "unblocked" : "blocked"}` });
    return json({ customer });
  } catch (e) {
    return handleApiError(e);
  }
}
