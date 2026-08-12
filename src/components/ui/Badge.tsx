"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

type BadgeColor = "green" | "gold" | "amber" | "blue" | "red" | "gray" | "violet" | "indigo";

const colors: Record<BadgeColor, string> = {
  green: "bg-brand-50 text-brand-700 border-brand-200",
  gold: "bg-gold-50 text-gold-700 border-gold-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  red: "bg-red-50 text-red-700 border-red-200",
  gray: "bg-ink/5 text-ink/60 border-ink/10",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
}

export function Badge({ children, color = "gray", className }: BadgeProps) {
  return (
    <span className={cn("badge border", colors[color], className)}>{children}</span>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  const { t } = useI18n();
  if (stock <= 0) return <Badge color="red">{t("ui.stock.out")}</Badge>;
  if (stock <= 5) return <Badge color="amber">{t("ui.stock.low").replace("{n}", String(stock))}</Badge>;
  return <Badge color="green">{t("ui.stock.in")}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeColor> = {
    PENDING: "amber",
    PAID: "blue",
    PROCESSING: "indigo",
    DISPATCHED: "violet",
    DELIVERED: "green",
    CANCELLED: "red",
    ACTIVE: "green",
    INACTIVE: "gray",
    OUT_OF_STOCK: "red",
    DRAFT: "gray",
    PAID_STATUS: "green",
  };
  const labelMap: Record<string, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    PROCESSING: "Processing",
    DISPATCHED: "Dispatched",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    OUT_OF_STOCK: "Out of stock",
    DRAFT: "Draft",
  };
  const display = status.startsWith("PAID") ? "Paid" : labelMap[status] || status;
  return <Badge color={map[status] || "gray"}>{display}</Badge>;
}
