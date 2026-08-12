import { NextRequest } from "next/server";
import { json, error } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const phone = String(body?.phone || "").trim();
  const message = String(body?.message || "").trim();

  if (!name || name.length < 2) return error("Please enter your name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return error("Please enter a valid email.");
  if (message.length < 10) return error("Please write a message (at least 10 characters).");

  await trackEvent({
    event: "contact_message",
    data: { name, email, phone, message },
  });

  return json({ ok: true });
}
