import { createHash, randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import { json, handleApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/notify";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
import { SITE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const limited = checkRateLimit(`forgot-password:${requestIp(request)}`, 5, 60 * 60 * 1000);
    if (!limited.allowed) return json({ message: "If the account exists, a reset link has been sent." });
    const body = await request.json().catch(() => null);
    const email = String(body?.email || "").trim().toLowerCase();
    const generic = { message: "If the account exists, a reset link has been sent." };
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(generic);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return json(generic);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const rawToken = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: createHash("sha256").update(rawToken).digest("hex"),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resetUrl = `${SITE.url}/reset-password?token=${rawToken}`;
    await sendEmail({ to: user.email, subject: `Reset your ${SITE.name} password`, text: `Use this link within one hour to reset your password: ${resetUrl}` });
    return json(process.env.NODE_ENV === "production" ? generic : { ...generic, resetUrl });
  } catch (e) {
    return handleApiError(e);
  }
}
