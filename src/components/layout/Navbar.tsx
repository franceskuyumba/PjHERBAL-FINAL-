"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Package,
  PackageSearch,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import { useI18n } from "@/context/LanguageContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SITE } from "@/lib/constants";

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const CATEGORY_LINKS = [
  { labelKey: "nav.mensWellness", href: "/category/mens-health" },
  { labelKey: "nav.womensWellness", href: "/category/womens-wellness" },
  { labelKey: "nav.energyImmunity", href: "/category/energy-immunity" },
  { labelKey: "nav.weightManagement", href: "/category/weight-management" },
  { labelKey: "nav.brainFocus", href: "/category/brain-focus" },
  { labelKey: "nav.digestionDetox", href: "/category/detox-digestion" },
];

const PAGE_LINKS = [
  { labelKey: "nav.blog", href: "/blog" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.contact", href: "/contact" },
];

export function Navbar({ user }: { user: NavUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { openSearch } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useI18n();
  const showDesktopSearch = pathname.startsWith("/shop") || pathname.startsWith("/product") || pathname.startsWith("/category");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── Top utility bar ── */}
      <div className="bg-brand-950 text-white">
        <div className="container-site flex h-10 items-center justify-between gap-4 text-[11px] font-medium tracking-wide sm:text-xs">
          <div className="flex min-w-0 items-center gap-5">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-1.5 text-white/70 transition-colors duration-base hover:text-gold-300 md:flex"
            >
              <Phone className="h-3.5 w-3.5 text-gold-400/60" />
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="hidden items-center gap-1.5 text-white/70 transition-colors duration-base hover:text-gold-300 lg:flex"
            >
              <Mail className="h-3.5 w-3.5 text-gold-400/60" />
              {SITE.email}
            </a>
            <p className="flex items-center gap-1.5 text-white/70">
              <Truck className="h-3.5 w-3.5 text-gold-400" />
              <span className="truncate">{t("nav.freeDelivery")}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            <Link
              href={user ? "/customer-dashboard/orders" : "/login"}
              className="flex items-center gap-1.5 text-white/70 transition-colors duration-base hover:text-gold-300"
            >
              <PackageSearch className="h-3.5 w-3.5" />
              {t("nav.myOrders")}
            </Link>
            <Link
              href="/contact"
              className="hidden text-white/70 transition-colors duration-base hover:text-gold-300 sm:block"
            >
              {t("nav.helpSupport")}
            </Link>
            <Link
              href={user ? (user.role === "ADMIN" ? "/admin" : "/customer-dashboard") : "/login"}
              className="flex items-center gap-1.5 text-white/70 transition-colors duration-base hover:text-gold-300"
            >
              <User className="h-3.5 w-3.5" />
              {user ? t("nav.myAccount") : t("nav.signIn")}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-surface-muted bg-white/95 backdrop-blur-md transition-shadow duration-base",
          scrolled && "shadow-elevated"
        )}
      >
        <div className="container-site flex h-16 items-center gap-4 sm:h-[4.5rem] sm:gap-5">
          {/* Logo */}
          <Link
            href="/"
            className="relative h-9 w-40 shrink-0 sm:h-10 sm:w-48"
            aria-label="PJHERBAL Clinic home"
          >
            <Image src="/images/logo.svg" alt="PJHERBAL Clinic" fill priority className="object-contain object-left" />
          </Link>

          {/* Desktop primary navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            <NavLink href="/" label="Home" active={pathname === "/"} />
            <NavLink href="/shop" label="Herbal Supplements" active={pathname === "/shop"} />
            <NavLink href="/shop" label="Wellness Packages" active={false} />
            <NavLink href="/contact" label="Consultation" active={pathname === "/contact"} />
          </nav>

          {/* Desktop search bar */}
          <button
            onClick={openSearch}
            className={cn(
              "group hidden flex-1 items-center gap-2.5 rounded-xl border border-ink/[0.06] bg-surface-muted/60 px-4 py-2.5 text-sm text-ink/40 shadow-soft transition-all duration-base hover:border-brand-300/40 hover:bg-white hover:shadow-card sm:max-w-2xl",
              showDesktopSearch && "sm:flex"
            )}
            aria-label={t("nav.ariaOpenSearch")}
          >
            <Search className="h-4 w-4 text-brand-500 transition-colors group-hover:text-brand-600" />
            <span className="truncate">{t("nav.searchPlaceholder")}</span>
            <kbd className="ml-auto hidden rounded-md border border-ink/[0.06] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink/30 lg:block">
              /
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            onClick={openSearch}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/60 transition-colors duration-base hover:bg-brand-50 hover:text-brand-600 sm:hidden"
            aria-label={t("nav.ariaOpenSearch")}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Right-side action icons */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {/* Wishlist */}
            <Link
              href="/customer-dashboard/wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/50 transition-colors duration-base hover:bg-red-50 hover:text-red-400"
              aria-label={t("nav.ariaWishlist")}
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* WhatsApp specialist */}
            <a
              href={buildWhatsAppUrl({ recipient: "specialist" })}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-white shadow-soft transition-all duration-base hover:bg-brand-700 hover:shadow-card sm:flex"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-[13px] font-semibold">{t("nav.whatsappSpecialist")}</span>
            </a>

            {/* Account dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink/50 transition-colors duration-base hover:bg-brand-50 hover:text-brand-600"
                aria-label={t("nav.ariaAccount")}
              >
                <User className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-ink/[0.04] bg-white shadow-lift"
                  >
                    {user ? (
                      <div className="p-1">
                        <div className="border-b border-ink/[0.04] px-4 py-3">
                          <p className="truncate text-sm font-semibold text-brand-950">{user.name}</p>
                          <p className="truncate text-xs text-ink-muted">{user.email}</p>
                        </div>
                        <AccountLink href={user.role === "ADMIN" ? "/admin" : "/customer-dashboard"} icon={<LayoutDashboard className="h-4 w-4" />}>
                          {user.role === "ADMIN" ? t("nav.adminDashboard") : t("nav.myDashboard")}
                        </AccountLink>
                        <AccountLink href="/customer-dashboard/orders" icon={<Package className="h-4 w-4" />}>
                          {t("nav.myOrders")}
                        </AccountLink>
                        <AccountLink href="/customer-dashboard/wishlist" icon={<Heart className="h-4 w-4" />}>
                          {t("nav.myWishlist")}
                        </AccountLink>
                        <button
                          onClick={async () => {
                            await fetch("/api/auth/logout", { method: "POST" });
                            router.push("/");
                            router.refresh();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-red-500 transition-colors duration-base hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("nav.logOut")}
                        </button>
                      </div>
                    ) : (
                      <div className="p-3">
                        <p className="px-2 pb-2 text-sm text-ink-muted">{t("nav.welcome")}</p>
                        <Link href="/login" className="btn-primary btn-sm mb-2 w-full">
                          {t("nav.signIn")}
                        </Link>
                        <Link href="/register" className="btn-outline btn-sm w-full">
                          {t("nav.createAccount")}
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/50 transition-colors duration-base hover:bg-brand-50 hover:text-brand-600"
              aria-label={t("nav.ariaCartCount").replace("{count}", String(count))}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-brand-950 shadow-soft"
                >
                  {count > 99 ? "99+" : count}
                </motion.span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors duration-base hover:bg-brand-50 hover:text-brand-600 lg:hidden"
              aria-label={t("nav.ariaOpenMenu")}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* ── Category sub-navigation bar ── */}
        <nav className="hidden border-t border-brand-800/30 bg-brand-950 lg:block" aria-label="Category navigation">
          <div className="container-site flex items-center gap-0.5">
            <CategoryLink href="/shop" label={t("nav.allProducts")} active={pathname === "/shop"} />
            {CATEGORY_LINKS.map((link) => (
              <CategoryLink
                key={link.href}
                href={link.href}
                label={t(link.labelKey)}
                active={pathname.startsWith(link.href)}
              />
            ))}
            <span className="mx-2 h-5 w-px bg-white/10" aria-hidden="true" />
            {PAGE_LINKS.map((link) => (
              <CategoryLink key={link.href} href={link.href} label={t(link.labelKey)} active={pathname === link.href} />
            ))}
            <Link
              href="/shop?sort=newest"
              className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-gold-400 transition-colors duration-base hover:bg-gold-500/10 hover:text-gold-300"
            >
              <PackageSearch className="h-3.5 w-3.5" />
              {t("nav.newArrivals")}
            </Link>
          </div>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} user={user} />
    </>
  );
}

/* ── Primary nav link with active indicator ── */
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-lg px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-colors duration-base",
        active ? "text-brand-600" : "text-ink/65 hover:text-brand-600"
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-500"
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        />
      )}
    </Link>
  );
}

/* ── Category sub-nav link ── */
function CategoryLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-semibold transition-colors duration-base",
        active ? "text-white" : "text-white/60 hover:text-white/90"
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="category-active"
          className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold-500"
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        />
      )}
    </Link>
  );
}

/* ── Account dropdown link ── */
function AccountLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-ink/70 transition-colors duration-base hover:bg-brand-50 hover:text-brand-600"
    >
      {icon}
      {children}
    </Link>
  );
}
