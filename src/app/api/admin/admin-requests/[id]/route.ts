import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    const decision = body?.decision;
    if (decision !== "APPROVE" && decision !== "REJECT") return error("Invalid approval decision.");

    const approval = await prisma.adminApprovalRequest.findUnique({ where: { id: params.id } });
    if (!approval) return error("Admin approval request not found.", 404);
    if (approval.status !== "PENDING") return error("This request has already been reviewed.", 409);

    if (decision === "REJECT") {
      const updated = await prisma.adminApprovalRequest.update({
        where: { id: approval.id },
        data: { status: "REJECTED", reviewedBy: session.sub, reviewedAt: new Date() },
      });
      await logActivity({ actorId: session.sub, actorName: session.name, role: session.role, action: "ADMIN_APPROVAL_UPDATE", entity: "AdminApprovalRequest", entityId: updated.id, details: `Rejected ${approval.email}` });
      return json({ request: { id: updated.id, status: updated.status } });
    }

    const existing = await prisma.user.findUnique({ where: { email: approval.email } });
    if (existing) return error("A user with this email already exists.", 409);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { name: approval.name, email: approval.email, phone: approval.phone, passwordHash: approval.passwordHash, role: "ADMIN" },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });
      await tx.adminApprovalRequest.update({
        where: { id: approval.id },
        data: { status: "APPROVED", reviewedBy: session.sub, reviewedAt: new Date() },
      });
      return created;
    });

    await logActivity({ actorId: session.sub, actorName: session.name, role: session.role, action: "ADMIN_APPROVAL_UPDATE", entity: "User", entityId: user.id, details: `Approved admin ${user.email}` });
    return json({ user }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
