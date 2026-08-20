import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function GET() {
  try {
    await requireApiAdmin();
    const [users, pendingAdminRequests] = await Promise.all([
      prisma.user.findMany({
      where: { role: { in: ["ADMIN", "STAFF"] } },
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      }),
      prisma.adminApprovalRequest.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, email: true, phone: true, status: true, createdAt: true },
      }),
    ]);
    return json({ users, pendingAdminRequests });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiAdmin();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const password = String(body?.password || "");
    const role = body?.role === "ADMIN" ? "ADMIN" : "STAFF";

    if (name.length < 2) return error("Please enter the staff member's full name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return error("Please enter a valid email address.");
    if (password.length < 8) return error("Password must be at least 8 characters.");

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return error("A user with this email already exists.", 409);

    if (role === "ADMIN") {
      const pending = await prisma.adminApprovalRequest.findFirst({ where: { email, status: "PENDING" } });
      if (pending) return error("An admin approval request for this email is already pending.", 409);

      const requestRecord = await prisma.adminApprovalRequest.create({
        data: {
          name,
          email,
          phone: phone || null,
          passwordHash: await hashPassword(password),
          requestedBy: session.sub,
        },
        select: { id: true, name: true, email: true, phone: true, status: true, createdAt: true },
      });

      await logActivity({
        actorId: session.sub,
        actorName: session.name,
        role: session.role,
        action: "ADMIN_APPROVAL_REQUEST",
        entity: "AdminApprovalRequest",
        entityId: requestRecord.id,
        details: `${name} (${email}) requested admin access`,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      });

      return json({ request: requestRecord, pendingApproval: true }, 202);
    }

    const user = await prisma.user.create({
      data: { name, email, phone: phone || null, passwordHash: await hashPassword(password), role },
    });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "STAFF_CREATE",
      entity: "User",
      entityId: user.id,
      details: `${user.name} (${user.email}) as ${role}`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive } }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
