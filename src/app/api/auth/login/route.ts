import { NextRequest } from "next/server";
import { json, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { verifyPassword, setSessionCookie, safeUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = zodParseSafe(loginSchema, body || {});
  if (!parsed.ok) return error(parsed.message);

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
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
