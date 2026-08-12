import { NextRequest } from "next/server";
import { json, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { hashPassword, setSessionCookie, safeUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
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
