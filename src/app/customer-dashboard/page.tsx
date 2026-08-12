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
import { getLocale, t } from "@/lib/i18n";

export default async function DashboardOverviewPage() {
  const lang = getLocale();
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
      label: t(lang, "dash.overview.totalOrders"),
      value: String(orders.length),
      icon: <PackageCheck className="h-5 w-5" />,
      accent: "bg-brand-50 text-brand-600",
    },
    {
      label: t(lang, "dash.overview.inProgress"),
      value: String(activeOrders.length),
      icon: <Boxes className="h-5 w-5" />,
      accent: "bg-gold-50 text-gold-600",
    },
    {
      label: t(lang, "dash.overview.wishlistItems"),
      value: String(user.wishlist.length),
      icon: <Heart className="h-5 w-5" />,
      accent: "bg-red-50 text-red-500",
    },
    {
      label: t(lang, "dash.overview.totalSpent"),
      value: formatTZS(totalSpent),
      icon: <Wallet className="h-5 w-5" />,
      accent: "bg-blue-50 text-blue-600",
    },
  ];

  const quickActions = [
    { labelKey: "dash.overview.shopProducts", href: "/shop", icon: PackageOpen },
    { labelKey: "dash.overview.myOrders", href: "/customer-dashboard/orders", icon: Truck },
    { labelKey: "dash.overview.recommendedForYou", href: "/customer-dashboard/recommendations", icon: Sparkles },
    { labelKey: "dash.overview.addAddress", href: "/customer-dashboard/addresses", icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <WelcomeHeader firstName={user.name.split(" ")[0]} />

      <StatCards stats={stats} />

      {showWinBack && (
        <AnimatedReveal>
          <div className="rounded-3xl border border-gold-200 bg-gradient-to-r from-gold-50 to-cream p-6">
            <p className="font-display text-lg font-bold text-brand-950">
              {t(lang, "dash.overview.weMissYou").replace("{name}", user.name.split(" ")[0])}
            </p>
            <p className="mt-1 text-sm text-ink/60">
              {t(lang, "dash.overview.winBackBody1").replace("{days}", String(daysSinceLastOrder))}{" "}
              <span className="font-mono font-bold text-brand-700">WELCOME10</span>{" "}
              {t(lang, "dash.overview.winBackBody2")}
            </p>
            <Link href="/shop" className="btn-primary btn-md mt-4">{t(lang, "dash.overview.browseNewArrivals")}</Link>
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-300">{t(lang, "dash.overview.orderInProgress")}</p>
                <p className="mt-2 font-mono text-lg font-bold">{latestActive.orderNumber}</p>
                <p className="mt-1 text-sm text-white/70">
                  {t(lang, latestActive.items.length === 1 ? "dash.overview.itemOne" : "dash.overview.itemMany").replace("{count}", String(latestActive.items.length))} · {formatTZS(latestActive.total)}
                </p>
              </div>
              <span className="badge bg-white/15 text-white backdrop-blur">{t(lang, "dash.overview.viewDetails")}</span>
            </div>
            <div className="mt-6">
              <OrderProgress status={latestActive.status} />
            </div>
          </Link>
        </AnimatedReveal>
      ) : orders.length > 0 ? (
        <AnimatedReveal>
          <div className="rounded-3xl border border-brand-100 bg-brand-50/50 p-6 text-brand-950">
            <p className="font-display text-lg font-bold">{t(lang, "dash.overview.allDelivered")}</p>
            <p className="mt-1 text-sm text-ink/60">{t(lang, "dash.overview.thanksDelivered")}</p>
            <Link href="/shop" className="btn-primary btn-md mt-4">{t(lang, "dash.overview.shopNewArrivals")}</Link>
          </div>
        </AnimatedReveal>
      ) : null}

      {recommended.length > 0 && (
        <section>
          <AnimatedReveal>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold-600" />
                <h2 className="font-display text-xl font-bold text-brand-950">{t(lang, "dash.overview.recommendedForYou")}</h2>
              </div>
              <Link href="/customer-dashboard/recommendations" className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
                {t(lang, "dash.overview.viewAll")}
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
              <h2 className="font-display text-lg font-bold text-brand-950">{t(lang, "dash.overview.recentOrders")}</h2>
              <Link href="/customer-dashboard/orders" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                {t(lang, "dash.overview.viewAll")}
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center">
                <EmptyState
                  title={t(lang, "dash.overview.noOrders")}
                  description={t(lang, "dash.overview.noOrdersDesc")}
                  action={<Link href="/shop" className="btn-primary btn-sm">{t(lang, "dash.overview.startShopping")}</Link>}
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
                <h2 className="font-display text-lg font-bold text-brand-950">{t(lang, "dash.overview.deliveryAddress")}</h2>
                <Link href="/customer-dashboard/addresses" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  {t(lang, "dash.overview.manage")}
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
                  title={t(lang, "dash.overview.noAddress")}
                  description={t(lang, "dash.overview.noAddressDesc")}
                  action={<Link href="/customer-dashboard/addresses" className="btn-primary btn-sm">{t(lang, "dash.overview.addAddress")}</Link>}
                />
              )}
              {lowStockWishlist > 0 && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {t(lang, lowStockWishlist > 1 ? "dash.overview.outOfStockMany" : "dash.overview.outOfStockOne").replace("{count}", String(lowStockWishlist))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-bold text-brand-950">{t(lang, "dash.overview.quickActions")}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {quickActions.map((a) => (
                  <Link
                    key={a.labelKey}
                    href={a.href}
                    className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-sm font-semibold text-brand-950 transition-all hover:border-brand-500/40 hover:bg-brand-50"
                  >
                    <a.icon className="h-4 w-4 shrink-0 text-brand-600" />
                    {t(lang, a.labelKey)}
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
            <p className="font-display text-lg font-bold">{t(lang, "dash.overview.needHelp")}</p>
            <p className="mt-1 text-sm text-white/70">{t(lang, "dash.overview.chatSpecialists")}</p>
          </div>
          <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-gold">
            {t(lang, "dash.overview.chatWhatsApp")}
          </a>
        </div>
      </AnimatedReveal>
    </div>
  );
}
