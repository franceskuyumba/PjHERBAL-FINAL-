import { NextRequest } from "next/server";
import { json, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const search = request.nextUrl.searchParams.get("search") || "";

    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }] } : {}),
      },
      include: {
        _count: { select: { orders: true } },
        orders: { select: { total: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return json({
      customers: customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        isActive: c.isActive,
        createdAt: c.createdAt,
        orderCount: c._count.orders,
        totalSpent: c.orders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0),
      })),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
