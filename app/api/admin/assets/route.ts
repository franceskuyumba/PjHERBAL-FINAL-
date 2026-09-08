import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { key, url, imageUrl } = await req.json();
    const finalUrl = url || imageUrl;
    const asset = await prisma.siteAsset.upsert({
      where: { key },
      update: { url: finalUrl },
      create: { key, url: finalUrl },
    });
    return NextResponse.json({ success: true, asset });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
  }
}