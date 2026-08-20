import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { json, error, handleApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    const token = String(body?.token || "");
    const password = String(body?.password || "");
    if (!token || password.length < 8 || password.length > 64) return error("Use a password between 8 and 64 characters.");

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!reset || reset.usedAt || reset.expiresAt <= new Date()) return error("This reset link is invalid or expired.", 400);

    await prisma.$transaction([
      prisma.user.update({ where: { id: reset.userId }, data: { passwordHash: await hashPassword(password) } }),
      prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: reset.userId, id: { not: reset.id } } }),
    ]);
    return json({ message: "Password reset successfully." });
  } catch (e) {
    return handleApiError(e);
  }
}
