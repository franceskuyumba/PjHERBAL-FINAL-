"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  BarChart3,
  MessageCircle,
  FileText,
  Megaphone,
  Leaf,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/whatsapp", label: "WhatsApp Campaigns", icon: MessageCircle },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Sidebar = (
    <div className="flex h-full flex-col bg-brand-950">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <Leaf className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-base font-bold text-white">
            Afya<span className="text-gold-400">Plus</span>
          </p>
          <p className="text-[10px] uppercase tracking-widest text-brand-400">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
              pathname === item.href
                ? "bg-brand-600 text-white"
                : "text-brand-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className="h-4.5 w-4.5 h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-brand-800/60 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <ShieldCheck className="h-5 w-5 text-gold-400" />
          <div>
            <p className="text-xs font-semibold text-white">Administrator</p>
            <p className="text-[10px] text-brand-400">Full access</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-brand-50/40">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{Sidebar}</aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-950/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72">
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-10 top-4 rounded-full bg-white p-2 text-brand-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {Sidebar}
          </div>
        </div>
      )}

      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-brand-100 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-brand-800 hover:bg-brand-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 text-sm text-brand-500 lg:flex">
            <Link href="/" className="font-semibold text-brand-600 hover:text-brand-800">
              ← Back to store
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" /> Live
            </span>
            <span className="hidden rounded-full bg-gold-100 px-3 py-1.5 text-xs font-semibold text-gold-700 sm:block">
              TZS 18.9M this month
            </span>
          </div>
        </div>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
