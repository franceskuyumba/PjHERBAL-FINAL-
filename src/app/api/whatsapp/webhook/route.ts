import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getBotReply } from "@/lib/chatbot";
import { logger } from "@/lib/logger";
import { sendWhatsAppText } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type WhatsAppMessage = {
  from?: string;
  type?: string;
  text?: { body?: string };
  button?: { text?: string };
  interactive?: { button_reply?: { title?: string }; list_reply?: { title?: string } };
};

type WhatsAppPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        metadata?: { phone_number_id?: string };
        messages?: WhatsAppMessage[];
      };
    }>;
  }>;
};

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
    const payload = JSON.parse(rawBody) as WhatsAppPayload;
    const changes = payload.entry?.flatMap((entry) => entry.changes || []) || [];
    const expectedPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    for (const change of changes) {
      const value = change.value;
      if (expectedPhoneNumberId && value?.metadata?.phone_number_id && value.metadata.phone_number_id !== expectedPhoneNumberId) continue;

      for (const message of value?.messages || []) {
        const recipient = message.from;
        const text = messageText(message);
        if (!recipient || !text) continue;

        const lang = /\b(habari|mambo|jambo|bei|bidhaa|lipa|malipo|usafirishaji|masaa|wapi|agizo|oda|msaada)\b/i.test(text) ? "sw" : "en";
        const reply = getBotReply(text, lang).text;
        try {
          await sendWhatsAppText(recipient, reply);
        } catch (error) {
          logger.error("[whatsapp] reply failed", error instanceof Error ? error.message : String(error));
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("[whatsapp] webhook processing failed", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ received: false }, { status: 400 });
  }
}

function messageText(message: WhatsAppMessage): string {
  return (
    message.text?.body ||
    message.button?.text ||
    message.interactive?.button_reply?.title ||
    message.interactive?.list_reply?.title ||
    ""
  ).trim();
}

function isValidSignature(body: string, header: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const providedBuffer = Buffer.from(header);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

