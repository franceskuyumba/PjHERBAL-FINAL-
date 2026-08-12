"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCheck, Info, Package, Tag, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

const typeStyles: Record<string, { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  ORDER: { icon: Package, cls: "bg-brand-50 text-brand-600" },
  PROMO: { icon: Tag, cls: "bg-gold-50 text-gold-600" },
  ACCOUNT: { icon: User, cls: "bg-blue-50 text-blue-600" },
  INFO: { icon: Info, cls: "bg-slate-100 text-slate-600" },
};

export function NotificationsList({ notifications }: { notifications: NotificationItem[] }) {
  const router = useRouter();

  const markRead = async (ids: string[]) => {
    await fetch("/api/account/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    router.refresh();
  };

  const markAllRead = async () => {
    await fetch("/api/account/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readAll: true }),
    });
    router.refresh();
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Notifications</h1>
          <p className="mt-1 text-sm text-ink/55">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "You are all caught up."}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-outline btn-sm">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Package className="h-7 w-7" />}
            title="No notifications yet"
            description="Order updates, promotions and account messages will appear here."
            action={<Link href="/shop" className="btn-primary btn-sm">Start shopping</Link>}
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {notifications.map((n, i) => {
            const style = typeStyles[n.type] || typeStyles.INFO;
            const content = (
              <div
                className={cn(
                  "flex items-start gap-4 rounded-3xl border bg-white p-4 shadow-card transition-all hover:shadow-lift sm:p-5",
                  !n.read && "border-brand-200 ring-1 ring-brand-100",
                  n.href && "cursor-pointer"
                )}
              >
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", style.cls)}>
                  <style.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={cn("text-sm font-semibold", n.read ? "text-ink/70" : "text-brand-950")}>{n.title}</p>
                    <span className="text-xs text-ink/40">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className={cn("mt-1 text-sm leading-6", n.read ? "text-ink/50" : "text-ink/65")}>{n.message}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-600" aria-label="Unread" />}
              </div>
            );

            return (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
              >
                {n.href ? (
                  <Link href={n.href} onClick={() => !n.read && markRead([n.id])}>
                    {content}
                  </Link>
                ) : (
                  <button
                    onClick={() => !n.read && markRead([n.id])}
                    className="block w-full text-left"
                    aria-label={n.read ? n.title : `Mark "${n.title}" as read`}
                  >
                    {content}
                  </button>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
