"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MapPin,
  Package,
  Settings,
  Sparkles,
  Star,
  Store,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn, getInitials } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number;
}

const accountNav: NavItem[] = [
  { href: "/customer-dashboard", labelKey: "dash.shell.overview", icon: LayoutDashboard, exact: true },
  { href: "/customer-dashboard/orders", labelKey: "dash.shell.myOrders", icon: Package },
  { href: "/customer-dashboard/wishlist", labelKey: "dash.shell.wishlist", icon: Heart },
  { href: "/customer-dashboard/addresses", labelKey: "dash.shell.savedAddresses", icon: MapPin },
  { href: "/customer-dashboard/reviews", labelKey: "dash.shell.myReviews", icon: Star },
  { href: "/customer-dashboard/recommendations", labelKey: "dash.shell.recommendedForYou", icon: Sparkles },
];

const supportNav: NavItem[] = [
  { href: "/customer-dashboard/notifications", labelKey: "dash.shell.notifications", icon: Bell, badge: 0 },
  { href: "/customer-dashboard/help", labelKey: "dash.shell.helpSupport", icon: LifeBuoy },
  { href: "/customer-dashboard/settings", labelKey: "dash.shell.accountSettings", icon: Settings },
];

const mobileNav: NavItem[] = [
  { href: "/customer-dashboard", labelKey: "dash.shell.home", icon: LayoutDashboard, exact: true },
  { href: "/customer-dashboard/orders", labelKey: "dash.shell.orders", icon: Package },
  { href: "/shop", labelKey: "dash.shell.shop", icon: Store },
  { href: "/customer-dashboard/wishlist", labelKey: "dash.shell.wishlist", icon: Heart },
  { href: "/customer-dashboard/settings", labelKey: "dash.shell.account", icon: Settings },
];

export function DashboardShell({
  name,
  email,
  unread,
  children,
}: {
  name: string;
  email: string;
  unread: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const renderLink = (item: NavItem) => {
    const active = isActive(item);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
          active ? "bg-brand-50 text-brand-800" : "text-ink/65 hover:bg-brand-50/60 hover:text-brand-800"
        )}
      >
        {active && !reduceMotion && (
          <motion.span
            layoutId="dashboard-active"
            className="absolute inset-0 rounded-xl border border-brand-100 bg-brand-50"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}
        <item.icon className="relative h-4 w-4 shrink-0" />
        <span className="relative flex-1 truncate">{t(item.labelKey)}</span>
        {(item.badge ?? 0) > 0 && (
          <span className="relative inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="bg-cream">
      <div className="container-site grid gap-6 py-6 lg:grid-cols-[260px_1fr] lg:py-10 lg:pb-16">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-ink/5 pb-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 font-display text-lg font-bold text-gold-200">
                {getInitials(name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-950">{name}</p>
                <p className="truncate text-xs text-ink/50">{email}</p>
              </div>
            </div>

            <nav className="pt-3" aria-label={t("dash.shell.accountNavAria")}>
              <p className="px-3.5 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-widest text-ink/40">{t("dash.shell.accountSection")}</p>
              <div className="space-y-0.5">{accountNav.map(renderLink)}</div>
              <p className="px-3.5 pb-1.5 pt-4 text-[11px] font-bold uppercase tracking-widest text-ink/40">{t("dash.shell.supportSection")}</p>
              <div className="space-y-0.5">
                {supportNav.map((item) => renderLink({ ...item, badge: item.href.endsWith("notifications") ? unread : 0 }))}
              </div>
            </nav>

            <button
              onClick={logout}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              {t("dash.shell.logOut")}
            </button>
          </div>
        </aside>

        <section className="min-w-0 pb-24 lg:pb-0">{children}</section>
      </div>

      {/* Mobile top compact header */}
      <div className="sticky top-16 z-30 border-b border-ink/5 bg-white/95 px-4 py-3 backdrop-blur sm:top-20 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 font-display text-base font-bold text-gold-200">
            {getInitials(name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-950">
              {t("dash.shell.mobileHello").replace("{name}", name.split(" ")[0])}
            </p>
            <p className="truncate text-xs text-ink/50">{email}</p>
          </div>
          <Link
            href="/customer-dashboard/notifications"
            aria-label={
              unread > 0
                ? t("dash.shell.notificationsUnreadAria").replace("{count}", String(unread))
                : t("dash.shell.notificationsAria")
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-brand-700"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label={t("dash.shell.mobileNavAria")}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-between px-2 py-1.5">
          {mobileNav.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-brand-700" : "text-ink/50"
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "scale-110")} />
                <span className="max-w-full truncate">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
