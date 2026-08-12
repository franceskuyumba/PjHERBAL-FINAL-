import { notFound } from "next/navigation";
import { FileText, MapPin, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatTZS, formatDateTime } from "@/lib/utils";
import { StatusBadge, PaymentStatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingTimeline } from "@/components/dashboard/TrackingTimeline";
import { OrderStatusControls } from "@/components/admin/OrderStatusControls";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payments: true, paymentLogs: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink/55">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a href={`/order/${order.orderNumber}/invoice`} target="_blank" className="btn-outline btn-sm">
          <FileText className="h-4 w-4" /> Invoice / Receipt (PDF)
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <h2 className="mb-5 font-display text-lg font-bold text-brand-950">Order progress</h2>
            <TrackingTimeline status={order.status} />
          </div>

          <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
                    <th className="pb-3 pr-4 font-semibold">Product</th>
                    <th className="pb-3 pr-4 font-semibold">Price</th>
                    <th className="pb-3 pr-4 font-semibold">Qty</th>
                    <th className="pb-3 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={item.productImage || "/images/hero.svg"} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <span className="font-medium text-brand-950">{item.productName}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-ink/70">{formatTZS(item.price)}</td>
                      <td className="py-3 pr-4 text-ink/70">{item.quantity}</td>
                      <td className="py-3 font-semibold text-brand-950">{formatTZS(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Payment history</h2>
            {order.paymentLogs.length === 0 ? (
              <p className="text-sm text-ink/50">No payment events recorded yet.</p>
            ) : (
              <ol className="space-y-4">
                {order.paymentLogs.map((log, i) => (
                  <li key={log.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-700"
                            : log.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {i + 1}
                      </span>
                      {i < order.paymentLogs.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-ink/10" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-semibold text-brand-950">
                        {log.status} · {log.provider}
                      </p>
                      <p className="text-xs text-ink/55">{formatDateTime(log.createdAt)}</p>
                      {log.message && <p className="mt-0.5 text-xs text-ink/55">{log.message}</p>}
                      {log.reference && (
                        <p className="mt-0.5 font-mono text-xs text-ink/45">Ref: {log.reference}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Update status</h2>
            <OrderStatusControls orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />
          </div>

          <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <h2 className="mb-3 font-display text-lg font-bold text-brand-950">Summary</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatTZS(order.subtotal)} />
              {order.discount > 0 && <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`-${formatTZS(order.discount)}`} />}
              <Row label="Shipping" value={order.shipping > 0 ? formatTZS(order.shipping) : "Free"} />
              <Row label="Total" value={formatTZS(order.total)} bold />
              <div className="flex justify-between pt-1">
                <dt className="text-ink/50">Payment</dt>
                <dd className="font-semibold text-brand-950">{order.paymentMethod}</dd>
              </div>
              {order.paymentReference && (
                <div className="flex justify-between">
                  <dt className="text-ink/50">Reference</dt>
                  <dd className="font-mono text-xs text-brand-950">{order.paymentReference}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <h2 className="mb-3 font-display text-lg font-bold text-brand-950">Customer</h2>
            <div className="flex gap-3 text-sm text-ink/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <div>
                <p className="font-semibold text-brand-950">{order.customerName}</p>
                <p className="mt-0.5">{order.customerEmail}</p>
                <p className="mt-0.5">{order.customerPhone}</p>
                <p className="mt-1">
                  {order.address}, {order.district}, {order.region}
                </p>
                {order.notes && <p className="mt-1 text-ink/50">Note: {order.notes}</p>}
              </div>
            </div>
            <a
              href={buildWhatsAppUrl({
                message: `Hello ${order.customerName}! This is PJHERBAL Clinic about your order ${order.orderNumber}.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-4 flex w-full items-center justify-center"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Contact customer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold text-brand-950" : "text-ink/50"}>{label}</dt>
      <dd className={bold ? "font-bold text-brand-950" : "font-semibold text-brand-950"}>{value}</dd>
    </div>
  );
}
