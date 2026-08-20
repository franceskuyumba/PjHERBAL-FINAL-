import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth";

async function verifyToken(token: string): Promise<{ role?: string } | null> {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  const origin = request.headers.get("origin");

  const sameOrigin = Boolean(origin && (
    origin === request.nextUrl.origin ||
    origin === `${request.nextUrl.protocol}//${request.headers.get("host")}`
  ));

  if (isApiRoute && origin && !sameOrigin) {
    const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const developmentOrigin = process.env.NODE_ENV !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(origin);

    // Never use '*' with credentials. Unlisted origins are rejected explicitly.
    if (!allowedOrigins.includes(origin) && !developmentOrigin) {
      return new NextResponse("CORS origin denied", { status: 403 });
    }

    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      setCorsHeaders(response, origin);
      return response;
    }

    const response = NextResponse.next();
    setCorsHeaders(response, origin);
    return response;
  }

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

function setCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  response.headers.set("Access-Control-Max-Age", "600");
  response.headers.append("Vary", "Origin");
}

export const config = {
  matcher: ["/admin/:path*", "/customer-dashboard/:path*", "/api/:path*"],
};
