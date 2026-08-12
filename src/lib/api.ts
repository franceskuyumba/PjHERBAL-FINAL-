import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logger, sanitizeError } from "@/lib/logger";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function getOptionalUser() {
  const session = await getSession();
  return session;
}

export async function requireApiUser() {
  const session = await getSession();
  if (!session) {
    throw new ApiError("Please sign in to continue.", 401);
  }
  return session;
}

export async function requireApiAdmin() {
  const session = await getSession();
  if (!session) throw new ApiError("Please sign in to continue.", 401);
  if (session.role !== "ADMIN") throw new ApiError("You do not have permission to do this.", 403);
  return session;
}

/**
 * Allows ADMIN and STAFF roles into back-office API routes.
 * For sensitive actions (team/settings/payments) call requireApiAdmin instead.
 */
export async function requireApiStaff() {
  const session = await getSession();
  if (!session) throw new ApiError("Please sign in to continue.", 401);
  if (session.role !== "ADMIN" && session.role !== "STAFF") {
    throw new ApiError("You do not have permission to do this.", 403);
  }
  return session;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function handleApiError(e: unknown) {
  if (e instanceof ApiError) {
    return error(e.message, e.status);
  }
  logger.error("[api] unhandled error", sanitizeError(e));
  return error("Something went wrong. Please try again.", 500);
}
