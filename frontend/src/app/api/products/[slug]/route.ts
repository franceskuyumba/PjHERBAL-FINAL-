import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data/products";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}
