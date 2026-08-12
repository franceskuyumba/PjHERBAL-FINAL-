import { NextRequest, NextResponse } from "next/server";

/**
 * Simple demo authentication.
 *
 * In production, wire up Firebase Auth or Auth0 (see requirements) and replace
 * this stub. Passwords are never stored here.
 */

const users = new Map<string, { name: string; phone: string; email: string; password: string }>();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const action = req.nextUrl.searchParams.get("action") || "register";

  if (action === "register") {
    const { name, phone, email, password } = body;
    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Name, phone and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (users.has(phone)) {
      return NextResponse.json({ error: "An account with this phone already exists" }, { status: 409 });
    }
    users.set(phone, { name, phone, email: email || "", password });
    return NextResponse.json({
      success: true,
      user: { name, phone, email: email || "" },
      token: `demo-token-${Date.now()}`,
    });
  }

  if (action === "login") {
    const { identifier, password } = body;
    const user = [...users.values()].find(
      (u) => u.phone === identifier || u.email === identifier
    );
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      user: { name: user.name, phone: user.phone, email: user.email },
      token: `demo-token-${Date.now()}`,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
