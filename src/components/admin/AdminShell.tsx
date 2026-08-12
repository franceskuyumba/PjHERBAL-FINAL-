"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  Activity,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Package,
  ScrollText,
  ShoppingBag,
  Star,
  Tag,
  Users,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const allNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, adminOnly: false },
  { href: "/admin/products", label: "Products", icon: ShoppingBag, adminOnly: false },
  { href: "/admin/orders", label: "Orders", icon: Package, adminOnly: false },
  { href: "/admin/customers", label: "Customers", icon: Users, adminOnly: false },
  { href: "/admin/coupons", label: "Coupons", icon: Tag, adminOnly: false },
  { href: "/admin/blog", label: "Blog", icon: BookOpen, adminOnly: false },
  { href: "/admin/reviews", label: "Reviews", icon: Star, adminOnly: false },
  { href: "/admin/activity", label: "Activity Log", icon: Activity, adminOnly: true },
  { href: "/admin/team", label: "Team & Roles", icon: UserCog, adminOnly: true },
];

export function AdminShell({ children, role }: { children: ReactNode; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = role === "ADMIN";
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  const isActive = (item: (typeof allNavItems)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink/5 bg-brand-950 text-white md:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="font-display text-lg font-bold text-gold-300">PJHERBAL</p>
            <p className="text-xs text-white/50">Admin Panel · {isAdmin ? "Owner" : "Staff"}</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive(item)
                    ? "bg-white/10 text-gold-300"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/10 p-3">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink/5 bg-white px-4 md:hidden">
            <p className="font-display text-base font-bold text-brand-950">PJHERBAL Admin</p>
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 hover:bg-slate-100"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </header>
          <header className="sticky top-0 z-30 hidden h-14 items-center border-b border-ink/5 bg-white px-8 md:flex">
            <p className="text-sm text-ink/50">
              <Link href="/" className="font-semibold text-brand-700 hover:text-brand-800">
                ← View store
              </Link>
            </p>
          </header>
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
