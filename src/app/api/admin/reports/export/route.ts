import { NextRequest } from "next/server";
import { requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

function csv(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");
    const start = from ? new Date(`${from}T00:00:00.000Z`) : undefined;
    const end = to ? new Date(`${to}T23:59:59.999Z`) : undefined;
    const createdAt = start || end ? { ...(start ? { gte: start } : {}), ...(end ? { lte: end } : {}) } : undefined;
    const [orders, cashSales] = await Promise.all([
      prisma.order.findMany({ where: { createdAt, status: { not: "CANCELLED" } }, orderBy: { createdAt: "asc" }, select: { orderNumber: true, customerName: true, total: true, paymentStatus: true, status: true, createdAt: true } }),
      prisma.cashSale.findMany({ where: { createdAt, status: "APPROVED" }, orderBy: { createdAt: "asc" }, select: { saleNumber: true, customerName: true, total: true, status: true, createdAt: true } }),
    ]);
    const rows = [
      ["Type", "Reference", "Customer", "Amount TZS", "Payment/Status", "Created At"],
      ...orders.map((o) => ["ONLINE_ORDER", o.orderNumber, o.customerName, o.total, `${o.paymentStatus}/${o.status}`, o.createdAt.toISOString()]),
      ...cashSales.map((s) => ["CASH_SALE", s.saleNumber, s.customerName, s.total, s.status, s.createdAt.toISOString()]),
    ];
    const body = rows.map((row) => row.map(csv).join(",")).join("\n");
    return new Response(`\ufeff${body}`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="pjherbal-report-${from || "all"}-${to || "all"}.csv"` } });
  } catch (e) {
    return handleApiError(e);
  }
}
