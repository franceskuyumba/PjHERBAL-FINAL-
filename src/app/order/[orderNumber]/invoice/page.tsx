import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSession, isStaffRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatTZS, formatDate } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { PrintButton } from "@/components/order/PrintButton";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

export default async function InvoicePage({ params }: { params: { orderNumber: string } }) {
  const session = await getSession();
  if (!session) notFound();

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  const isOwner = session.sub === order.userId;
  const isBackOffice = isStaffRole(session.role);
  if (!isOwner && !isBackOffice) notFound();

  const isPaid = order.paymentStatus === "PAID";

  return (
    <div className="container-site py-8">
      <style>{`
        @media print {
          header, footer, .mobile-bottom-nav, .no-print { display: none !important; }
          body { padding: 0 !important; }
          main { padding: 0 !important; }
          .invoice-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; }
        }
        @page { margin: 18mm; }
      `}</style>

      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={isBackOffice ? "/admin/orders" : `/customer-dashboard/orders/${order.orderNumber}`} className="btn-outline btn-sm">
          ← Back to order
        </Link>
        <PrintButton />
      </div>

      <div className="invoice-sheet mx-auto max-w-3xl rounded-3xl border border-ink/5 bg-white p-8 shadow-card sm:p-12">
        {/* Letterhead */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Image src="/images/logo.svg" alt={SITE.name} width={160} height={40} className="h-10 w-auto" />
            <h1 className="mt-4 font-display text-2xl font-bold text-brand-950">{SITE.fullName}</h1>
            <p className="mt-1 text-sm text-ink/60">{SITE.address}</p>
            <p className="text-sm text-ink/60">{SITE.phone} · {SITE.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/40">
              {isPaid ? "Official receipt" : "Invoice"}
            </p>
            <p className="mt-2 font-mono text-lg font-bold text-brand-950">{order.orderNumber}</p>
            <p className="mt-1 text-sm text-ink/55">Issued: {formatDate(order.createdAt)}</p>
            <p className="mt-1 text-sm">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {isPaid ? "PAID" : order.paymentStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Bill to</p>
            <p className="mt-2 font-semibold text-brand-950">{order.customerName}</p>
            <p className="text-sm text-ink/60">{order.address}</p>
            <p className="text-sm text-ink/60">{order.district}, {order.region}</p>
            <p className="text-sm text-ink/60">{order.customerPhone}</p>
            <p className="text-sm text-ink/60">{order.customerEmail}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Payment method</p>
            <p className="mt-2 text-sm font-semibold text-brand-950">{order.paymentMethod}</p>
            {order.paymentReference && (
              <>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-ink/40">Reference</p>
                <p className="mt-1 font-mono text-sm text-ink/70">{order.paymentReference}</p>
              </>
            )}
          </div>
        </div>

        {/* Items */}
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink/10 text-xs uppercase tracking-wide text-ink/40">
              <th className="pb-3 pr-4 font-semibold">Item</th>
              <th className="pb-3 pr-4 text-right font-semibold">Qty</th>
              <th className="pb-3 pr-4 text-right font-semibold">Price</th>
              <th className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 pr-4 font-medium text-brand-950">{item.productName}</td>
                <td className="py-3 pr-4 text-right text-ink/70">{item.quantity}</td>
                <td className="py-3 pr-4 text-right text-ink/70">{formatTZS(item.price)}</td>
                <td className="py-3 text-right font-semibold text-brand-950">{formatTZS(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <dl className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/55">Subtotal</dt>
              <dd className="font-semibold">{formatTZS(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brand-600">
                <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
                <dd className="font-semibold">−{formatTZS(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/55">Delivery ({order.region})</dt>
              <dd className="font-semibold">{order.shipping > 0 ? formatTZS(order.shipping) : "Free"}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3">
              <dt className="font-bold text-brand-950">Total</dt>
              <dd className="font-display text-xl font-bold text-brand-800">{formatTZS(order.total)}</dd>
            </div>
          </dl>
        </div>

        {!isPaid && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            This invoice is unpaid. Complete your payment and confirm it on WhatsApp to receive your official receipt.
          </div>
        )}

        <p className="mt-8 border-t border-ink/10 pt-4 text-center text-xs text-ink/40">
          {SITE.name} · {SITE.address} · {SITE.phone} · Thank you for supporting health in Tanzania!
        </p>
      </div>
    </div>
  );
}
