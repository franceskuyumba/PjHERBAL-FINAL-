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
  { label: "Men's Wellness", href: "/category/mens-health" },
  { label: "Women's Wellness", href: "/category/womens-wellness" },
  { label: "Energy & Immunity", href: "/category/energy-immunity" },
  { label: "Weight Management", href: "/category/weight-management" },
  { label: "Brain & Focus", href: "/category/brain-focus" },
  { label: "Digestion & Detox", href: "/category/detox-digestion" },
];

const PAGE_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ user }: { user: NavUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { openSearch } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      <div className="bg-brand-950 text-white">
        <div className="container-site flex h-9 items-center justify-between gap-4 text-[11px] font-medium sm:text-xs">
          <div className="flex min-w-0 items-center gap-4">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-gold-300 md:flex">
              <Phone className="h-3.5 w-3.5" />
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-gold-300 lg:flex">
              <Mail className="h-3.5 w-3.5" />
              {SITE.email}
            </a>
            <p className="flex items-center gap-1.5 text-white/80">
              <Truck className="h-3.5 w-3.5 text-gold-300" />
              <span className="truncate">Free delivery in Dar es Salaam over TZS 200,000</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            <Link href={user ? "/customer-dashboard/orders" : "/login"} className="flex items-center gap-1.5 text-white/80 transition-colors hover:text-gold-300">
              <PackageSearch className="h-3.5 w-3.5" />
              My Orders
            </Link>
            <Link href="/contact" className="hidden text-white/80 transition-colors hover:text-gold-300 sm:block">
              Help & Support
            </Link>
            <Link
              href={user ? (user.role === "ADMIN" ? "/admin" : "/customer-dashboard") : "/login"}
              className="flex items-center gap-1.5 text-white/80 transition-colors hover:text-gold-300"
            >
              <User className="h-3.5 w-3.5" />
              {user ? "My Account" : "Sign In"}
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-ink/5 bg-cream/95 backdrop-blur-lg transition-shadow",
          scrolled && "shadow-card"
        )}
      >
        <div className="container-site flex h-16 items-center gap-3 sm:h-[4.5rem]">
          <Link href="/" className="relative h-9 w-40 shrink-0 sm:h-10 sm:w-48" aria-label="PJHERBAL Clinic home">
            <Image src="/images/logo.svg" alt="PJHERBAL Clinic" fill priority className="object-contain object-left" />
          </Link>

          <button
            onClick={openSearch}
            className="group hidden flex-1 items-center gap-2.5 rounded-full border border-brand-200 bg-white px-4 py-2.5 text-sm text-ink/45 shadow-sm transition-all hover:border-brand-400 hover:shadow-card sm:flex sm:max-w-2xl"
            aria-label="Open search"
          >
            <Search className="h-4 w-4 text-brand-600" />
            <span className="truncate">Search products, categories and wellness topics...</span>
            <kbd className="ml-auto hidden rounded-md border border-ink/10 bg-cream px-1.5 py-0.5 text-[10px] font-semibold text-ink/40 lg:block">
              /
            </kbd>
          </button>

          <button
            onClick={openSearch}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-brand-50 hover:text-brand-700 sm:hidden"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            <Link
              href="/customer-dashboard/wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-brand-50 hover:text-red-500"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-[#25D366]/10 hover:text-[#1eb958] sm:flex"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>

            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-brand-50 hover:text-brand-700"
                aria-label="Account"
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
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-lift"
                  >
                    {user ? (
                      <div className="p-1">
                        <div className="border-b border-ink/5 px-4 py-3">
                          <p className="truncate text-sm font-semibold text-brand-950">{user.name}</p>
                          <p className="truncate text-xs text-ink/50">{user.email}</p>
                        </div>
                        <AccountLink href={user.role === "ADMIN" ? "/admin" : "/customer-dashboard"} icon={<LayoutDashboard className="h-4 w-4" />}>
                          {user.role === "ADMIN" ? "Admin dashboard" : "My dashboard"}
                        </AccountLink>
                        <AccountLink href="/customer-dashboard/orders" icon={<Package className="h-4 w-4" />}>
                          My orders
                        </AccountLink>
                        <AccountLink href="/customer-dashboard/wishlist" icon={<Heart className="h-4 w-4" />}>
                          My wishlist
                        </AccountLink>
                        <button
                          onClick={async () => {
                            await fetch("/api/auth/logout", { method: "POST" });
                            router.push("/");
                            router.refresh();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    ) : (
                      <div className="p-3">
                        <p className="px-2 pb-2 text-sm text-ink/60">Welcome to PJHERBAL Clinic</p>
                        <Link href="/login" className="btn-primary btn-sm mb-2 w-full">
                          Sign in
                        </Link>
                        <Link href="/register" className="btn-outline btn-sm w-full">
                          Create account
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-brand-50 hover:text-brand-700"
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-brand-950">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-brand-50 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-ink/5 bg-white/60 lg:block" aria-label="Category navigation">
          <div className="container-site flex items-center gap-1">
            <CategoryLink href="/shop" label="All Products" active={pathname === "/shop"} />
            {CATEGORY_LINKS.map((link) => (
              <CategoryLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname.startsWith(link.href)}
              />
            ))}
            <span className="mx-2 h-5 w-px bg-ink/10" aria-hidden="true" />
            {PAGE_LINKS.map((link) => (
              <CategoryLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
            ))}
            <Link
              href="/shop?sort=newest"
              className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-gold-700 transition-colors hover:bg-gold-50"
            >
              <PackageSearch className="h-3.5 w-3.5" />
              New Arrivals
            </Link>
          </div>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} user={user} />
    </>
  );
}

function CategoryLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-semibold transition-colors",
        active ? "text-brand-700" : "text-ink/65 hover:text-brand-700"
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="category-active"
          className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold-500"
        />
      )}
    </Link>
  );
}

function AccountLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-ink/75 transition-colors hover:bg-brand-50 hover:text-brand-700"
    >
      {icon}
      {children}
    </Link>
  );
}
