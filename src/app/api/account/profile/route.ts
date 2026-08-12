import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireApiUser();
    const body = await request.json().catch(() => null);

    const name = typeof body?.name === "string" ? body.name.trim() : undefined;
    const phone = typeof body?.phone === "string" ? body.phone.trim() : undefined;

    const data: { name?: string; phone?: string } = {};
    if (name && name.length >= 2) data.name = name;
    if (phone && /^(\+?[0-9]{9,15})$/.test(phone)) data.phone = phone;

    if (Object.keys(data).length === 0) {
      return error("Please provide a valid name or phone number.");
    }

    const user = await prisma.user.update({
      where: { id: session.sub },
      data,
    });

    return json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiUser();
    const body = await request.json().catch(() => null);
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (newPassword.length < 8) {
      return error("New password must be at least 8 characters.");
    }

    const user = await prisma.user.findUnique({ where: { id: session.sub } });
    if (!user) return error("User not found.", 404);

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) return error("Your current password is incorrect.");

    await prisma.user.update({
      where: { id: session.sub },
      data: { passwordHash: await hashPassword(newPassword) },
    });

    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
