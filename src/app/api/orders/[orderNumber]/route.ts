import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const session = await requireApiUser();
    const order = await prisma.order.findFirst({
      where: { orderNumber: params.orderNumber, userId: session.sub },
      include: { items: true, payments: true },
    });
    if (!order) return error("Order not found.", 404);
    return json({ order });
  } catch (e) {
    return handleApiError(e);
  }
}
