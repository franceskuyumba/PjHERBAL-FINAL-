import { NextRequest } from "next/server";
import { json, error } from "@/lib/api";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { verifyPassword, setSessionCookie, safeUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const ip = requestIp(request);
  const limited = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limited.allowed) {
    return Response.json({ error: "Too many login attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  }
  const body = await request.json().catch(() => null);
  const parsed = zodParseSafe(loginSchema, body || {});
  if (!parsed.ok) return error(parsed.message);

  const { email: identifier, password } = parsed.data;
  const normalizedIdentifier = identifier.toLowerCase();
  const phoneIdentifier = identifier.replace(/\D/g, "");

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedIdentifier },
        ...(phoneIdentifier.length >= 9 ? [{ phone: phoneIdentifier }, { phone: `+${phoneIdentifier}` }] : []),
      ],
    },
  });
  if (!user || !user.isActive) {
    return error("Invalid email or password.", 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return error("Invalid email or password.", 401);
  }

  await setSessionCookie({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  });

  return json({ user: safeUser(user) });
}
