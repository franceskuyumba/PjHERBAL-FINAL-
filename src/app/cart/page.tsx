"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/LanguageContext";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatTZS } from "@/lib/utils";
import { SHIPPING } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { trackClientEvent } from "@/lib/client-analytics";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totals, coupon, setCoupon } = useCart();
  const { t } = useI18n();
  const { toast } = useToast();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput.trim(), subtotal: totals.subtotal }),
    });
    const data = await res.json().catch(() => null);
    setCouponLoading(false);
    if (res.ok && data?.coupon) {
      setCoupon(data.coupon);
      toast(t("cart.couponApplied"), "success");
      setCouponInput("");
    } else {
      toast(data?.error || t("cart.couponInvalid"), "error");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-site py-16 sm:py-24">
        <h1 className="mb-8 text-center font-display text-3xl font-bold text-brand-950">{t("cart.title")}</h1>
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title={t("cart.empty")}
          description={t("cart.emptyDesc")}
          action={
            <Link href="/shop" className="btn-primary btn-md">
              {t("cart.startShopping")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  const progress = Math.min(100, (totals.subtotal / SHIPPING.freeThreshold) * 100);
  const remaining = SHIPPING.freeThreshold - totals.subtotal;

  return (
    <div className="container-site py-8 sm:py-12">
      <h1 className="font-display text-3xl font-bold text-brand-950">{t("cart.title")}</h1>
      <p className="mt-1 text-sm text-ink/55">
        {items.length} {items.length === 1 ? t("cart.item") : t("cart.items")} {t("cart.inCart")}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {totals.subtotal < SHIPPING.freeThreshold && totals.subtotal > 0 && (
            <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4">
              <p className="text-sm font-medium text-gold-800">
                {t("cart.freeShippingCta").replace("{amount}", formatTZS(remaining))} <strong>{t("cart.freeDelivery")}</strong> 🚚
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gold-200">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="card flex gap-4 p-4 sm:p-5"
              >
                <Link href={`/product/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-brand-50">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link href={`/product/${item.slug}`} className="line-clamp-1 font-display font-bold text-brand-950 hover:text-brand-700">
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink/45">{formatTZS(item.price)} {t("cart.each")}</p>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.productId);
                        toast(t("cart.removed"), "info");
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label={t("cart.removeAria").replace("{name}", item.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <QuantityStepper value={item.quantity} onChange={(q) => updateQuantity(item.productId, q)} max={item.stock || 99} />
                    <p className="font-bold text-brand-800">{formatTZS(item.price * item.quantity)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link href="/shop" className="btn-outline btn-md">
            {t("cart.continueShopping")}
          </Link>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-brand-950">{t("cart.orderSummary")}</h2>

            <div className="mt-5 flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder={t("cart.couponPlaceholder")}
                className="input flex-1 uppercase"
              />
              <button onClick={applyCoupon} disabled={couponLoading} className="btn-outline btn-sm shrink-0">
                {couponLoading ? "..." : t("cart.apply")}
              </button>
            </div>
            {coupon && (
              <button
                onClick={() => setCoupon(null)}
                className="mt-2 flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
              >
                {coupon.code} ({coupon.type === "PERCENTAGE" ? `${coupon.value}%` : formatTZS(coupon.value)} {t("cart.off")})
                <span className="ml-1">×</span>
              </button>
            )}

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">{t("cart.subtotal")}</dt>
                <dd className="font-semibold text-ink">{formatTZS(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-brand-600">
                  <dt>{t("cart.discount")}</dt>
                  <dd className="font-semibold">−{formatTZS(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/60">{t("cart.delivery")}</dt>
                <dd className="font-semibold text-ink">
                  {totals.shipping === 0 ? <span className="text-brand-600">{t("cart.free")}</span> : formatTZS(totals.shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3">
                <dt className="font-bold text-brand-950">{t("cart.total")}</dt>
                <dd className="font-display text-xl font-bold text-brand-800">{formatTZS(totals.total)}</dd>
              </div>
            </dl>

            <Link href="/checkout" onClick={() => trackClientEvent("begin_checkout", { value: totals.total })} className="btn-gold btn-lg mt-6 w-full">
              {t("cart.proceedCheckout")}
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-sm mt-3 w-full"
            >
              <MessageCircle className="h-4 w-4" />
              {t("cart.needHelp")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
