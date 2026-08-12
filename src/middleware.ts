import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth";

async function verifyToken(token: string): Promise<{ role?: string } | null> {
  try {
    const secret = process.env.AUTH_SECRET || "dev-only-secret-change-me";
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer-dashboard");

  if (isAdminRoute || isCustomerRoute) {
    if (!session) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (isAdminRoute && session.role !== "ADMIN" && session.role !== "STAFF") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer-dashboard/:path*"],
};
