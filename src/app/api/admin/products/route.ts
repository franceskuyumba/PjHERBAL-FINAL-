import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('search') || '';
    const lowStockOnly = searchParams.get('lowStock') === '1';

    const where: Record<string, unknown> = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (lowStockOnly) where.status = 'ACTIVE';

    let products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });

    if (lowStockOnly) {
      products = products.filter((product) => product.stock <= product.lowStockThreshold);
    }

    return NextResponse.json({ products: JSON.parse(JSON.stringify(products)) });
  } catch (error: any) {
    console.error('GET_PRODUCTS_ERROR:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || body.title || 'New Product';
    const rawSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = body.slug || `${rawSlug}-${Date.now()}`;
    const sku = body.sku || `SKU-${Date.now()}`;
    const images = (Array.isArray(body.images) ? body.images : String(body.images || body.image || "").split(/\r?\n/))
      .map((value: unknown) => String(value).trim())
      .filter(Boolean)
      .map((value: string) => value.startsWith("data:") ? value : value)

    const productData: any = {
      name,
      shortDescription: body.shortDescription || '',
      slug,
      sku,
      description: body.description || '',
      price: parseFloat(body.price) || 0,
      stock: parseInt(body.stock, 10) || 0,
      status: body.status || 'ACTIVE',
      isFeatured: typeof body.isFeatured === 'boolean' ? body.isFeatured : true,
      isBestSeller: Boolean(body.isBestSeller),
      images: JSON.stringify(images),
    };

    if (body.compareAtPrice) productData.compareAtPrice = parseFloat(body.compareAtPrice);
    if (body.categoryId) productData.categoryId = body.categoryId;

    const product = await prisma.product.create({
      data: productData,
    });

    revalidatePath('/');
    revalidatePath('/shop');

    // Instantly invalidate Vercel's static cache for homepage and shop pages
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/shop');

    return NextResponse.json(JSON.parse(JSON.stringify(product)), { status: 201 });
  } catch (error: any) {
    console.error('POST_PRODUCT_ERROR:', error);
    return NextResponse.json({ error: error.message || 'Database insert failed' }, { status: 500 });
  }
}
