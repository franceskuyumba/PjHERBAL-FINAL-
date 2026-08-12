import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data/products";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase();
  const category = req.nextUrl.searchParams.get("category");
  const limit = Number(req.nextUrl.searchParams.get("limit") || 100);

  let list = products;
  if (q) {
    list = list.filter((p) =>
      [p.title, p.shortBenefits, p.description, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }
  if (category) list = list.filter((p) => p.category === category);

  return NextResponse.json({ products: list.slice(0, limit) });
}
