import { prisma } from "@/lib/prisma";

/**
 * Logs a store analytics event. Called from server-side code (API routes).
 * Client-side events are sent to /api/analytics/event (see clientAnalytics below).
 */
export async function trackEvent(input: {
  event: string;
  sessionId?: string | null;
  url?: string | null;
  data?: Record<string, unknown> | null;
}) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        event: input.event,
        sessionId: input.sessionId ?? null,
        url: input.url ?? null,
        data: input.data ? JSON.stringify(input.data) : null,
      },
    });
  } catch {
    // Analytics must never break the store.
  }
}

export function sessionIdForRequest(): string {
  return Math.random().toString(36).slice(2, 10);
}
