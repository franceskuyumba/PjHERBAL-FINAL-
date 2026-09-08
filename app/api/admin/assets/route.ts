import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { key, imageUrl } = await req.json();
    const asset = await prisma.siteAsset.upsert({
      where: { key },
      update: { imageUrl },
      create: { key, imageUrl },
    });
    return NextResponse.json({ success: true, asset });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save asset" }, { status: 500 });
  }
}
