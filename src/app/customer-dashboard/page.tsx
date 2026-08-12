import Link from "next/link";
import { notFound } from "next/navigation";
import { Boxes, Heart, MapPin, PackageCheck, PackageOpen, Sparkles, Truck, Wallet } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatTZS, formatDate } from "@/lib/utils";
import { getRecommendations } from "@/lib/recommendations";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OrderProgress } from "@/components/dashboard/OrderProgress";
import { ProductCard } from "@/components/product/ProductCard";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { StatCards } from "@/components/dashboard/StatCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default async function DashboardOverviewPage() {
  const session = await getSession();
  if (!session) notFound();

  const [user, recommended] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.sub },
      include: {
        orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
        addresses: { orderBy: { isDefault: "desc" } },
        wishlist: { include: { product: true } },
      },
    }),
    getRecommendations(session.sub, 4),
  ]);
  if (!user) notFound();

  const orders = user.orders;
  const activeOrders = orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status));
  const totalSpent = orders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + o.total, 0);
  const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];
  const lowStockWishlist = user.wishlist.filter((w) => w.product.stock === 0).length;
  const latestOrder = orders[0];
  const latestActive = activeOrders[0] || null;

  // Win-back engine: customer's last order was delivered more than 30 days ago.
  const lastDelivered = orders.find((o) => o.status === "DELIVERED");
  const daysSinceLastOrder = lastDelivered
    ? Math.floor((Date.now() - new Date(lastDelivered.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const showWinBack = Boolean(lastDelivered) && daysSinceLastOrder >= 30;

  const stats = [
    {
      label: "Total orders",
      value: String(orders.length),
      icon: <PackageCheck className="h-5 w-5" />,
      accent: "bg-brand-50 text-brand-600",
    },
    {
      label: "In progress",
      value: String(activeOrders.length),
      icon: <Boxes className="h-5 w-5" />,
      accent: "bg-gold-50 text-gold-600",
    },
    {
      label: "Wishlist items",
      value: String(user.wishlist.length),
      icon: <Heart className="h-5 w-5" />,
      accent: "bg-red-50 text-red-500",
    },
    {
      label: "Total spent",
      value: formatTZS(totalSpent),
      icon: <Wallet className="h-5 w-5" />,
      accent: "bg-blue-50 text-blue-600",
    },
  ];

  const quickActions = [
    { label: "Shop products", href: "/shop", icon: PackageOpen },
    { label: "My orders", href: "/customer-dashboard/orders", icon: Truck },
    { label: "Recommended for you", href: "/customer-dashboard/recommendations", icon: Sparkles },
    { label: "Add address", href: "/customer-dashboard/addresses", icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <WelcomeHeader firstName={user.name.split(" ")[0]} />

      <StatCards stats={stats} />

      {showWinBack && (
        <AnimatedReveal>
          <div className="rounded-3xl border border-gold-200 bg-gradient-to-r from-gold-50 to-cream p-6">
            <p className="font-display text-lg font-bold text-brand-950">We miss you, {user.name.split(" ")[0]}! 💛</p>
            <p className="mt-1 text-sm text-ink/60">
              It's been {daysSinceLastOrder} days since your last order. New wellness products are waiting — and the
              code <span className="font-mono font-bold text-brand-700">WELCOME10</span> gives you 10% off your next order.
            </p>
            <Link href="/shop" className="btn-primary btn-md mt-4">Browse new arrivals</Link>
          </div>
        </AnimatedReveal>
      )}

      {latestActive ? (
        <AnimatedReveal>
          <Link
            href={`/customer-dashboard/orders/${latestActive.orderNumber}`}
            className="block overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 to-brand-800 p-6 text-white shadow-lift transition-transform hover:scale-[1.005]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold-300">Order in progress</p>
                <p className="mt-2 font-mono text-lg font-bold">{latestActive.orderNumber}</p>
                <p className="mt-1 text-sm text-white/70">
                  {latestActive.items.length} item{latestActive.items.length === 1 ? "" : "s"} · {formatTZS(latestActive.total)}
                </p>
              </div>
              <span className="badge bg-white/15 text-white backdrop-blur">View details →</span>
            </div>
            <div className="mt-6">
              <OrderProgress status={latestActive.status} />
            </div>
          </Link>
        </AnimatedReveal>
      ) : orders.length > 0 ? (
        <AnimatedReveal>
          <div className="rounded-3xl border border-brand-100 bg-brand-50/50 p-6 text-brand-950">
            <p className="font-display text-lg font-bold">All orders delivered 🎉</p>
            <p className="mt-1 text-sm text-ink/60">Thank you for shopping with PJHERBAL Clinic. Ready for your next wellness step?</p>
            <Link href="/shop" className="btn-primary btn-md mt-4">Shop new arrivals</Link>
          </div>
        </AnimatedReveal>
      ) : null}

      {recommended.length > 0 && (
        <section>
          <AnimatedReveal>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold-600" />
                <h2 className="font-display text-xl font-bold text-brand-950">Recommended for you</h2>
              </div>
              <Link href="/customer-dashboard/recommendations" className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
                View all
              </Link>
            </div>
          </AnimatedReveal>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {recommended.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} isLoggedIn />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <AnimatedReveal className="h-full">
          <div className="flex h-full flex-col rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-brand-950">Recent orders</h2>
              <Link href="/customer-dashboard/orders" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                View all
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center">
                <EmptyState
                  title="No orders yet"
                  description="Browse the shop and place your first order today."
                  action={<Link href="/shop" className="btn-primary btn-sm">Start shopping</Link>}
                />
              </div>
            ) : (
              <ul className="divide-y divide-ink/5">
                {orders.slice(0, 4).map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/customer-dashboard/orders/${order.orderNumber}`}
                        className="text-sm font-semibold text-brand-950 hover:text-brand-700"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink/50">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <span className="text-sm font-semibold text-brand-950">{formatTZS(order.total)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AnimatedReveal>

        <AnimatedReveal className="h-full">
          <div className="flex h-full flex-col gap-4">
            <div className="flex-1 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-brand-950">Delivery address</h2>
                <Link href="/customer-dashboard/addresses" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  Manage
                </Link>
              </div>
              {defaultAddress ? (
                <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
                  <p className="text-sm font-semibold text-brand-950">{defaultAddress.label}</p>
                  <p className="mt-1 text-sm text-ink/60">{defaultAddress.recipientName}</p>
                  <p className="text-sm text-ink/60">
                    {defaultAddress.street}, {defaultAddress.district}, {defaultAddress.region}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">{defaultAddress.phone}</p>
                </div>
              ) : (
                <EmptyState
                  title="No saved address"
                  description="Add a delivery address for faster checkout."
                  action={<Link href="/customer-dashboard/addresses" className="btn-primary btn-sm">Add address</Link>}
                />
              )}
              {lowStockWishlist > 0 && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {lowStockWishlist} wishlist item{lowStockWishlist > 1 ? "s are" : " is"} currently out of stock.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-bold text-brand-950">Quick actions</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {quickActions.map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-sm font-semibold text-brand-950 transition-all hover:border-brand-500/40 hover:bg-brand-50"
                  >
                    <a.icon className="h-4 w-4 shrink-0 text-brand-600" />
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </div>

      <AnimatedReveal>
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-900 p-6 text-white sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-lg font-bold">Need help with an order?</p>
            <p className="mt-1 text-sm text-white/70">Chat with our specialists on WhatsApp — we reply quickly.</p>
          </div>
          <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-gold">
            Chat on WhatsApp
          </a>
        </div>
      </AnimatedReveal>
    </div>
  );
}
