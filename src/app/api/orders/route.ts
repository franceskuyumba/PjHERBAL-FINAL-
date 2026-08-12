import { NextRequest } from "next/server";
import { json, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireApiUser();
    const orders = await prisma.order.findMany({
      where: { userId: session.sub },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return json({ orders });
  } catch (e) {
    return handleApiError(e);
  }
}
