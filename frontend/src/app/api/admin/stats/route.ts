import { NextResponse } from "next/server";
import { adminOrders, adminProducts, adminCustomers } from "@/lib/data/admin";

export async function GET() {
  const totalRevenue = adminOrders.reduce((s, o) => s + o.total, 0);
  const paidOrders = adminOrders.filter((o) => o.status !== "cancelled");
  const lowStock = adminProducts.filter((p) => p.lowStock).length;
  const customers = adminCustomers.length;

  return NextResponse.json({
    stats: {
      revenue: totalRevenue,
      orders: paidOrders.length,
      customers,
      lowStock,
      conversionRate: 4.2,
      avgOrderValue: Math.round(totalRevenue / Math.max(1, paidOrders.length)),
    },
  });
}
