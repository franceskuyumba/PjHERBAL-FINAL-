import { NextRequest } from "next/server";
import { json, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    await requireApiAdmin();

    const [salesAgg, orders, customers, products, lowStock, pendingOrders, recentOrders] =
      await Promise.all([
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: { not: "CANCELLED" } },
        }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.product.count(),
        prisma.product.findMany({
          where: { status: "ACTIVE", stock: { lte: prisma.product.fields.lowStockThreshold } },
          take: 8,
          orderBy: { stock: "asc" },
        }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { items: true },
        }),
      ]);

    // Sales over time (last 14 days)
    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);

    const ordersSince = await prisma.order.findMany({
      where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
      select: { total: true, createdAt: true },
    });

    const days: { date: string; label: string; total: number; orders: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      days.push({ date: d.toISOString().slice(0, 10), label, total: 0, orders: 0 });
    }

    for (const o of ordersSince) {
      const key = o.createdAt.toISOString().slice(0, 10);
      const day = days.find((d) => d.date === key);
      if (day) {
        day.total += o.total;
        day.orders += 1;
      }
    }

    // Popular products
    const popular = await prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    // Orders by status
    const statusGroups = await prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const orderStatuses = {
      PENDING: 0,
      PAID: 0,
      PROCESSING: 0,
      DISPATCHED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    for (const g of statusGroups) {
      if (g.status in orderStatuses) {
        orderStatuses[g.status as keyof typeof orderStatuses] = g._count._all;
      }
    }

    return json({
      stats: {
        totalSales: salesAgg._sum.total || 0,
        orders,
        customers,
        products,
        pendingOrders,
        lowStockCount: lowStock.length,
      },
      salesOverTime: days,
      popularProducts: popular.map((p) => ({ name: p.productName, quantity: p._sum.quantity })),
      orderStatuses,
      lowStock,
      recentOrders,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
