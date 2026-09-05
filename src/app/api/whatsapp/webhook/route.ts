import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      const senderPhone = message.from;
      const textBody = message.text?.body?.trim()?.toLowerCase() || "";

      let replyText = "Welcome to PJHERBAL Clinic! Type 'menu' to see our herbal products or 'help' to speak with an expert.";

      if (textBody === "menu" || textBody === "products") {
        replyText = "PJHERBAL Products:\n1. Soybean Soft Gel Capsules\n2. Herbal Immunity Booster\n3. Joint Care Formula";
      } else if (textBody === "hours" || textBody === "location") {
        replyText = "PJHERBAL Clinic is open Monday - Saturday, 8 AM - 6 PM.";
      }

      console.log(`Received WhatsApp message from ${senderPhone}: ${textBody}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
