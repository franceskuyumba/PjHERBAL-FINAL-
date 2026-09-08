import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { products, assets } = await req.json();

    if (products && Array.isArray(products)) {
      for (const prod of products) {
        if (prod.id && prod.imageUrl) {
          await prisma.product.update({
            where: { id: prod.id },
            data: { imageUrl: prod.imageUrl },
          });
        }
      }
    }

    if (assets && typeof assets === 'object') {
      for (const [key, value] of Object.entries(assets)) {
        await prisma.siteAsset.upsert({
          where: { key },
          update: { url: value as string },
          create: { key, url: value as string },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Media saved successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
