"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/LanguageContext";

const SINCE_KEY = "pjherbal_cart_since";
const REMIND_HOURS = 2;

/**
 * Abandoned cart recovery (in-app): if a visitor leaves items in their cart for
 * more than a few hours, show a gentle reminder to complete the order.
 */
export function CartReminder() {
  const { items, count, hydrated } = useCart();
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      try {
        window.localStorage.removeItem(SINCE_KEY);
      } catch {
        /* ignore */
      }
      setShow(false);
      return;
    }

    let since: number | null = null;
    try {
      since = Number(window.localStorage.getItem(SINCE_KEY)) || null;
    } catch {
      /* ignore */
    }
    if (!since) {
      try {
        window.localStorage.setItem(SINCE_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
      setShow(false);
      return;
    }

    const hours = (Date.now() - since) / (1000 * 60 * 60);
    setShow(hours >= REMIND_HOURS);
  }, [items.length, hydrated]);

  if (!show) return null;

  const firstItem = items[0];

  return (
    <div className="container-site pt-6">
      <div className="relative flex flex-col items-start justify-between gap-3 rounded-3xl border border-gold-300 bg-gradient-to-r from-gold-50 to-cream p-5 sm:flex-row sm:items-center">
        <button
          onClick={() => {
            setShow(false);
            try {
              window.localStorage.setItem(SINCE_KEY, String(Date.now()));
            } catch {
              /* ignore */
            }
          }}
          aria-label={t("cart.dismissReminder")}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gold-800/60 transition-colors hover:bg-gold-100"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 pr-8">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-base font-bold text-brand-950">{count === 1 ? t("cart.leftItem").replace("{count}", String(count)) : t("cart.leftItems").replace("{count}", String(count))}</p>
            <p className="text-sm text-ink/60">
              {firstItem?.name || t("cart.yourItems")} {count > 1 ? t("cart.waitingPlural") : t("cart.waitingSingular")}
            </p>
          </div>
        </div>
        <Link href="/cart" className="btn-primary btn-md shrink-0">
          {t("cart.completeOrder")}
        </Link>
      </div>
    </div>
  );
}
