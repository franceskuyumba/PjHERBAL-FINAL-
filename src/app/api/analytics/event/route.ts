import { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";

const allowedEvents = new Set([
  "page_view",
  "view_item",
  "add_to_cart",
  "remove_from_cart",
  "begin_checkout",
  "purchase",
  "search",
  "whatsapp_click",
  "filter_apply",
]);

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(`analytics:${requestIp(request)}`, 120, 60 * 1000);
  if (!limited.allowed) return json({ ok: true });
  const body = await request.json().catch(() => null);
  if (!body || !allowedEvents.has(body.event)) {
    return json({ ok: true });
  }

  await trackEvent({
    event: body.event,
    sessionId: body.sessionId || null,
    url: body.url || null,
    data: typeof body.data === "string" ? body.data.slice(0, 2000) : body.data || null,
  });

  return json({ ok: true });
}
