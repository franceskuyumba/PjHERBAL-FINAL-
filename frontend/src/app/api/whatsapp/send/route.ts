import { NextRequest, NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/whatsappService";

export async function POST(req: NextRequest) {
  try {
    const { to, template, args } = await req.json();
    if (!to || !template) {
      return NextResponse.json({ error: "to and template are required" }, { status: 400 });
    }
    const ok = await sendWhatsApp(to, { template, args: args || [] });
    return NextResponse.json({ ok, sent: ok });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
