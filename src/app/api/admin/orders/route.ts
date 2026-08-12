import { NextRequest } from "next/server";
import { json, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const status = request.nextUrl.searchParams.get("status") || "";
    const search = request.nextUrl.searchParams.get("search") || "";

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { orderNumber: { contains: search } },
                { customerName: { contains: search } },
                { customerPhone: { contains: search } },
              ],
            }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return json({ orders });
  } catch (e) {
    return handleApiError(e);
  }
}
