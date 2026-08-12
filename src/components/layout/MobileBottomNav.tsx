"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  user: { id: string; name: string; email: string; role: string } | null;
}

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { count } = useCart();
  const { openSearch } = useSearch();

  const accountHref = user ? (user.role === "ADMIN" ? "/admin" : "/customer-dashboard") : "/login";

  const items = [
    { label: "Home", href: "/", icon: <Home className="h-5 w-5" />, active: pathname === "/" },
    { label: "Search", href: null as string | null, icon: <Search className="h-5 w-5" />, active: false, action: openSearch },
    { label: "Cart", href: "/cart", icon: <ShoppingBag className="h-5 w-5" />, active: pathname === "/cart", badge: count },
    { label: "Wishlist", href: "/customer-dashboard/wishlist", icon: <Heart className="h-5 w-5" />, active: pathname === "/customer-dashboard/wishlist" },
    { label: "Account", href: accountHref, icon: <User className="h-5 w-5" />, active: pathname.startsWith("/customer-dashboard") },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/5 bg-white/95 backdrop-blur-lg lg:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const className = cn(
            "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
            item.active ? "text-brand-700" : "text-ink/50"
          );
          if (item.action) {
            return (
              <button key={item.label} onClick={item.action} className={className} aria-label={item.label}>
                {item.icon}
                {item.label}
              </button>
            );
          }
          return (
            <Link key={item.label} href={item.href!} className={className} aria-label={item.label}>
              {item.icon}
              {typeof item.badge === "number" && item.badge > 0 && (
                <span className="absolute right-1/2 top-0.5 flex h-4 min-w-4 -translate-x-[-1.25rem] items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-bold text-brand-950">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
              {item.label}
              {item.active && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
