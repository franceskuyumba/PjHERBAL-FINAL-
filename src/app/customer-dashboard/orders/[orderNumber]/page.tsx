import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, FileText, MapPin, MessageCircle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatTZS, formatDateTime } from "@/lib/utils";
import { StatusBadge, PaymentStatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingTimeline } from "@/components/dashboard/TrackingTimeline";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function estimatedDelivery(status: string): string {
  switch (status) {
    case "DELIVERED":
      return "Delivered";
    case "DISPATCHED":
      return "Arriving within 1–2 days";
    case "PROCESSING":
      return "Expected dispatch within 1 day";
    case "PAID":
      return "We begin preparing after payment confirmation";
    case "PENDING":
      return "Estimated after payment is confirmed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Check back soon";
  }
}

export default async function OrderDetailPage({ params }: { params: { orderNumber: string } }) {
  const session = await getSession();
  if (!session) notFound();

  const order = await prisma.order.findFirst({
    where: { orderNumber: params.orderNumber, userId: session.sub },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink/55">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-brand-950">
        <Clock className="h-4 w-4 shrink-0 text-brand-600" />
        <span>
          <span className="font-semibold">Estimated delivery:</span> {estimatedDelivery(order.status)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a href={`/order/${order.orderNumber}/invoice`} target="_blank" className="btn-outline btn-sm">
          <FileText className="h-4 w-4" /> Invoice / Receipt (PDF)
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <AnimatedReveal>
            <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
              <h2 className="mb-5 font-display text-lg font-bold text-brand-950">Order progress</h2>
              <TrackingTimeline status={order.status} />
            </div>
          </AnimatedReveal>

          <AnimatedReveal>
            <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
              <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Items</h2>
              <ul className="divide-y divide-ink/5">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-3">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                      <Image
                        src={item.productImage || "/images/hero.svg"}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${item.productSlug}`} className="text-sm font-semibold text-brand-950 hover:text-brand-700">
                        {item.productName}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink/50">
                        Qty {item.quantity} × {formatTZS(item.price)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-brand-950">{formatTZS(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedReveal>
        </div>

        <div className="space-y-6">
          <AnimatedReveal>
            <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
              <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Summary</h2>
              <dl className="space-y-2.5 text-sm">
                <Row label="Subtotal" value={formatTZS(order.subtotal)} />
                {order.discount > 0 && (
                  <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`-${formatTZS(order.discount)}`} negative />
                )}
                <Row label="Shipping" value={order.shipping > 0 ? formatTZS(order.shipping) : "Free"} />
                <div className="border-t border-ink/10 pt-2.5">
                  <Row label="Total" value={formatTZS(order.total)} bold />
                </div>
                <div className="flex justify-between pt-1">
                  <dt className="text-ink/50">Payment method</dt>
                  <dd className="font-semibold text-brand-950">{order.paymentMethod}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/50">Payment status</dt>
                  <dd className="font-semibold text-brand-950">{order.paymentStatus}</dd>
                </div>
              </dl>
              {order.paymentStatus === "UNPAID" && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Complete your payment and send the confirmation on WhatsApp to speed up dispatch.
                </div>
              )}
            </div>
          </AnimatedReveal>

          <AnimatedReveal>
            <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
              <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Delivery address</h2>
              <div className="flex gap-3 text-sm text-ink/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                <div>
                  <p className="font-semibold text-brand-950">{order.customerName}</p>
                  <p className="mt-0.5">
                    {order.address}, {order.district}, {order.region}
                  </p>
                  <p className="mt-0.5">{order.customerPhone}</p>
                  {order.notes && <p className="mt-1 text-ink/50">Note: {order.notes}</p>}
                </div>
              </div>
            </div>
          </AnimatedReveal>

          <a
            href={buildWhatsAppUrl({
              message: `Hello PJHERBAL Clinic, I have a question about my order ${order.orderNumber}.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex w-full items-center justify-center"
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Ask about this order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, negative, bold }: { label: string; value: string; negative?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold text-brand-950" : "text-ink/50"}>{label}</dt>
      <dd className={bold ? "font-bold text-brand-950" : negative ? "font-semibold text-red-600" : "font-semibold text-brand-950"}>
        {value}
      </dd>
    </div>
  );
}
