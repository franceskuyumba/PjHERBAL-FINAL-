"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Phone,
  User,
  ChevronDown,
  Leaf,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { categories } from "@/lib/data/categories";
import { NAV_LINKS, SITE, WHATSAPP_LINK } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppButton";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-600/30">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold text-brand-900">
          Afya<span className="text-gold-500">Plus</span>
        </span>
        <span className="block text-[10px] uppercase tracking-widest text-brand-500">
          Premium Supplements
        </span>
      </span>
    </Link>
  );
}

function SearchBar({ onDone }: { onDone?: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    onDone?.();
  };
  return (
    <form onSubmit={submit} className="relative w-full max-w-md">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products, e.g. collagen, vitamins..."
        className="h-11 w-full rounded-full border border-brand-200 bg-white pl-4 pr-11 text-sm text-brand-950 placeholder:text-brand-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur-md">
      {/* Utility bar */}
      <div className="hidden bg-brand-950 text-brand-50 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <p className="text-brand-200">
            Free delivery on orders above {SITE.freeShippingThreshold.toLocaleString()} TZS • Nationwide delivery in Tanzania
          </p>
          <div className="flex items-center gap-4">
            <a href={SITE.phoneHref} className="flex items-center gap-1 hover:text-white">
              <Phone className="h-3 w-3" /> {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="hover:text-white">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          className="rounded-lg p-2 text-brand-800 hover:bg-brand-50 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Logo />

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <a
            href={SITE.phoneHref}
            className="hidden items-center gap-1.5 rounded-full border border-brand-200 px-3 py-2 text-sm font-medium text-brand-800 transition hover:border-brand-400 hover:bg-brand-50 sm:flex"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={WHATSAPP_LINK()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1fb958] sm:flex"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <Link
            href="/customer-dashboard"
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden border-t border-brand-100 bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex items-center gap-1.5 rounded-t-lg px-4 py-3 text-sm font-semibold text-brand-900 hover:bg-brand-50">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-white">
                <Menu className="h-3.5 w-3.5" />
              </span>
              All Categories
              <ChevronDown
                className={cn("h-4 w-4 transition", catOpen && "rotate-180")}
              />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full z-50 w-64 overflow-hidden rounded-b-2xl rounded-tr-2xl border border-brand-100 bg-white py-2 shadow-lift">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop/category/${c.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-brand-800 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    <span>{c.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-brand-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-t-lg px-4 py-3 text-sm font-medium transition",
                pathname === link.href
                  ? "border-b-2 border-brand-600 text-brand-700"
                  : "text-brand-700 hover:bg-brand-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-brand-100 bg-white px-4 pb-5 pt-3 lg:hidden">
          <div className="mb-3 md:hidden">
            <SearchBar onDone={() => setMobileOpen(false)} />
          </div>
          <div className="mb-2 flex items-center gap-1.5 sm:hidden">
            <a
              href={SITE.phoneHref}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-200 py-2.5 text-sm font-medium text-brand-800"
            >
              <Phone className="h-4 w-4" /> Call Us
            </a>
            <a
              href={WHATSAPP_LINK()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-2.5 text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop/category/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-brand-100 px-3 py-2.5 text-sm font-medium text-brand-800 transition hover:bg-brand-50"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <nav className="mt-3 grid gap-1 border-t border-brand-100 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-800 transition hover:bg-brand-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
