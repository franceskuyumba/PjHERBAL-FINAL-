import { NextRequest } from "next/server";
import { json, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
import { hashPassword, setSessionCookie, safeUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(`register:${requestIp(request)}`, 5, 60 * 60 * 1000);
  if (!limited.allowed) {
    return Response.json({ error: "Too many registration attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  }
  const body = await request.json().catch(() => null);
  const parsed = zodParseSafe(registerSchema, body || {});
  if (!parsed.ok) return error(parsed.message);

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return error("An account with this email already exists. Please sign in.", 409);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash: await hashPassword(password),
      role: "CUSTOMER",
    },
  });

  await setSessionCookie({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  });

  return json({ user: safeUser(user) }, 201);
}
