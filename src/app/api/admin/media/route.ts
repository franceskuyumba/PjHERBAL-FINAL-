import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { sectionKey, imageUrl, altText } = await req.json();

    const updatedMedia = await prisma.siteMedia.upsert({
      where: { sectionKey },
      update: { imageUrl, altText },
      create: { sectionKey, imageUrl, altText },
    });

    return NextResponse.json({ success: true, media: updatedMedia });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

export async function GET() {
  const allMedia = await prisma.siteMedia.findMany();
  return NextResponse.json(allMedia);
}
