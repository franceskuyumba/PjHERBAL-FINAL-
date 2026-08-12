import { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  await trackEvent({
    event: "newsletter_subscribe",
    data: { email },
  });

  return json({ ok: true });
}
