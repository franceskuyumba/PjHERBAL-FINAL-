import { NextRequest } from "next/server";
import { json, error, requireApiStaff, handleApiError, requireSameOrigin } from "@/lib/api";
import { sendSms } from "@/lib/notify";
import { logActivity } from "@/lib/activity";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiStaff();
    requireSameOrigin(request);
    const limited = checkRateLimit(`admin-sms:${session.sub}`, 30, 60 * 1000);
    if (!limited.allowed) return error("Too many SMS messages sent. Please wait a moment.", 429);

    const body = await request.json().catch(() => null);
    const phone = String(body?.phone || "").replace(/\D/g, "");
    const message = String(body?.message || "").trim();

    if (!/^\+?[0-9]{9,15}$/.test(phone) && !/^[0-9]{9,15}$/.test(phone)) return error("Enter a valid phone number.");
    if (!phone) return error("Enter a valid phone number.");
    if (message.length < 2) return error("Enter a message to send.");
    if (message.length > 480) return error("Message must be 480 characters or less.");

    const sent = await sendSms({ to: phone, text: message });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "SYSTEM",
      entity: "SmsMessage",
      details: `SMS to ${phone}: ${message.slice(0, 120)}`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    if (!sent) return error("SMS provider is not configured. Message was not delivered.", 502);
    return json({ ok: true, message: "SMS sent." });
  } catch (e) {
    return handleApiError(e);
  }
}
