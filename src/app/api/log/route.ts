import { NextRequest } from "next/server";
import { json, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/**
 * Client-side error reporting. Called by the ErrorBoundary when a page-level
 * error occurs in the browser. Stores a sanitized record for the admin.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const message = typeof body?.message === "string" ? body.message.slice(0, 2000) : "";
    const source = typeof body?.source === "string" ? body.source.slice(0, 200) : "unknown";
    const url = typeof body?.url === "string" ? body.url.slice(0, 500) : "";
    if (!message) return json({ ok: true });

    await prisma.activityLog.create({
      data: {
        action: "SYSTEM",
        entity: "ClientError",
        details: `[${source}] ${message} @ ${url}`,
      },
    });

    return json({ ok: true });
  } catch {
    return json({ ok: true });
  }
}
