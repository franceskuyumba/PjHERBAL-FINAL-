import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatTZS, formatDate } from "@/lib/utils";
import { StatusBadge, PaymentStatusBadge } from "@/components/dashboard/StatusBadge";
import { OrderProgress } from "@/components/dashboard/OrderProgress";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) notFound();

  const orders = await prisma.order.findMany({
    where: { userId: session.sub },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">My orders</h1>
      <p className="mt-1 text-sm text-ink/55">Track and review everything you have ordered.</p>

      {orders.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<PackageSearch className="h-7 w-7" />}
            title="No orders yet"
            description="When you place an order, it will appear here with live tracking."
            action={<Link href="/shop" className="btn-primary btn-sm">Browse products</Link>}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order, i) => (
            <AnimatedReveal key={order.id} delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={`/customer-dashboard/orders/${order.orderNumber}`}
                className="block rounded-3xl border border-ink/5 bg-white p-5 shadow-card transition-all hover:shadow-lift sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 4).map((item) => (
                        <span key={item.id} className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-white shadow-sm">
                          <Image
                            src={item.productImage || "/images/hero.svg"}
                            alt={item.productName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-brand-950">{order.orderNumber}</p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {formatDate(order.createdAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-base font-bold text-brand-950">{formatTZS(order.total)}</p>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="mt-5 border-t border-ink/5 pt-4">
                  <OrderProgress status={order.status} />
                </div>
              </Link>
            </AnimatedReveal>
          ))}
        </div>
      )}
    </div>
  );
}
