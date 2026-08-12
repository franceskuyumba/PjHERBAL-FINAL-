import { NextRequest, NextResponse } from "next/server";
import { sendWhatsApp, buildReply } from "@/lib/whatsappService";

export async function GET(req: NextRequest) {
  // WhatsApp Cloud API webhook verification
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Verification failed", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // WhatsApp Cloud API payload
    const entry = payload?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;

    if (message?.type === "text" && from) {
      const incoming = message.text.body as string;
      const reply = buildReply(incoming);
      await sendWhatsApp(from, { template: "reply", args: [reply] });
    }

    // Demo payload { from, text }
    if (payload?.text && payload?.from && !message) {
      const reply = buildReply(payload.text);
      await sendWhatsApp(payload.from, { template: "reply", args: [reply] });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}
