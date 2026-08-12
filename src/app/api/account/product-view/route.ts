import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { recordProductView } from "@/lib/recommendations";

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiUser();
    const body = await request.json().catch(() => null);
    const productId = typeof body?.productId === "string" ? body.productId : "";
    if (!productId) return error("Missing product id.");
    await recordProductView(session.sub, productId);
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
