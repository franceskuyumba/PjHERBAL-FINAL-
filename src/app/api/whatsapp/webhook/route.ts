import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getBotReply } from "@/lib/chatbot";
import { logger } from "@/lib/logger";
import { sendWhatsAppText } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (mode === "subscribe" && token && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Webhook verification failed", { status: 403 });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!isValidSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid webhook signature", { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as { entry?: Array<{ changes?: Array<{ value?: { messages?: Array<{ from?: string; text?: { body?: string } }> } }> }> };
    const messages = payload.entry?.flatMap((entry) => entry.changes?.flatMap((change) => change.value?.messages || []) || []) || [];
    for (const message of messages) {
      const recipient = message.from;
      const text = message.text?.body?.trim();
      if (recipient && text) await sendWhatsAppText(recipient, getBotReply(text, "en").text);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("[whatsapp] webhook processing failed", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ received: false }, { status: 400 });
  }
}

function isValidSignature(body: string, header: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const providedBuffer = Buffer.from(header);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

