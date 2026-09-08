import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assets = await prisma.siteAsset.findMany();
    return NextResponse.json({ assets: assets || [] });
  } catch (error) {
    return NextResponse.json({ assets: [] }, { status: 200 });
  }
}
