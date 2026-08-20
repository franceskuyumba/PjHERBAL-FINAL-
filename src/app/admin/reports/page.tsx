import { prisma } from "@/lib/prisma";
import { formatDateTime, formatTZS } from "@/lib/utils";
import { getLocale, t } from "@/lib/i18n";
import { PrintButton } from "@/components/order/PrintButton";

export const metadata = { title: "Financial report | Admin" };

export default async function AdminReportPage({ searchParams }: { searchParams: { from?: string; to?: string } }) {
  const lang = getLocale();
  const from = searchParams.from ? new Date(`${searchParams.from}T00:00:00.000Z`) : undefined;
  const to = searchParams.to ? new Date(`${searchParams.to}T23:59:59.999Z`) : undefined;
  const createdAt = from || to ? { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } : undefined;
  const [orders, cashSales] = await Promise.all([
    prisma.order.findMany({ where: { createdAt, status: { not: "CANCELLED" } }, orderBy: { createdAt: "asc" }, select: { orderNumber: true, customerName: true, total: true, paymentStatus: true, status: true, createdAt: true } }),
    prisma.cashSale.findMany({ where: { createdAt, status: "APPROVED" }, orderBy: { createdAt: "asc" }, select: { saleNumber: true, customerName: true, total: true, status: true, createdAt: true } }),
  ]);
  const rows = [
    ...orders.map((order) => ({ type: "ONLINE_ORDER", reference: order.orderNumber, customer: order.customerName, amount: order.total, status: `${order.paymentStatus}/${order.status}`, created: order.createdAt })),
    ...cashSales.map((sale) => ({ type: "CASH_SALE", reference: sale.saleNumber, customer: sale.customerName, amount: sale.total, status: sale.status, created: sale.createdAt })),
  ].sort((a, b) => a.created.getTime() - b.created.getTime());
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="container-site py-8">
      <div className="no-print mb-6 flex justify-end"><PrintButton /></div>
      <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card sm:p-10">
        <h1 className="font-display text-2xl font-bold text-brand-950">{t(lang, "admin.report.title")}</h1>
        <p className="mt-1 text-sm text-ink/55">{t(lang, "admin.report.range").replace("{from}", searchParams.from || "All time").replace("{to}", searchParams.to || "Today")}</p>
        <p className="mt-4 text-lg font-bold text-brand-800">{formatTZS(total)}</p>
        <table className="mt-6 w-full text-left text-sm">
          <thead><tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50"><th className="py-3">{t(lang, "admin.report.type")}</th><th>{t(lang, "admin.report.reference")}</th><th>{t(lang, "admin.report.customer")}</th><th>{t(lang, "admin.report.amount")}</th><th>{t(lang, "admin.report.status")}</th><th>{t(lang, "admin.report.created")}</th></tr></thead>
          <tbody className="divide-y divide-ink/5">{rows.map((row) => <tr key={row.reference}><td className="py-3">{row.type}</td><td>{row.reference}</td><td>{row.customer}</td><td className="font-semibold">{formatTZS(row.amount)}</td><td>{row.status}</td><td>{formatDateTime(row.created)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
