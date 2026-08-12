import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    const target = await prisma.user.findUnique({ where: { id: params.id } });
    if (!target) return error("User not found.", 404);
    if (target.role !== "ADMIN" && target.role !== "STAFF") {
      return error("Only admin/staff accounts can be managed here.");
    }

    const body = await request.json().catch(() => null);
    const data: { isActive?: boolean; role?: string; passwordHash?: string } = {};

    if (typeof body?.isActive === "boolean") {
      if (params.id === session.sub && !body.isActive) {
        return error("You cannot deactivate your own account.");
      }
      data.isActive = body.isActive;
    }

    if (body?.role === "ADMIN" || body?.role === "STAFF") {
      if (target.role === "ADMIN" && body.role === "STAFF" && params.id === session.sub) {
        return error("You cannot demote your own account.");
      }
      data.role = body.role;
    }

    if (typeof body?.password === "string" && body.password.length >= 8) {
      data.passwordHash = await hashPassword(body.password);
    }

    if (Object.keys(data).length === 0) return error("Nothing to update.");

    const updated = await prisma.user.update({ where: { id: params.id }, data });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "STAFF_UPDATE",
      entity: "User",
      entityId: updated.id,
      details: `${updated.name} — ${Object.keys(data).join(", ")}`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role, isActive: updated.isActive } });
  } catch (e) {
    return handleApiError(e);
  }
}
