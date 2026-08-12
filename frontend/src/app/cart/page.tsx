"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Tag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { resolveCoupon, calculateDiscount, getRegionByName } from "@/lib/store";
import Button from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<ReturnType<typeof resolveCoupon>>(undefined);
  const [couponError, setCouponError] = useState("");
  const [region, setRegion] = useState("Dar es Salaam");
  const [note, setNote] = useState("");

  const regionInfo = getRegionByName(region) || getRegionByName("Other Regions")!;
  const discount = applied ? calculateDiscount(applied, subtotal) : 0;
  const shipping = subtotal >= SITE.freeShippingThreshold || subtotal === 0 ? 0 : regionInfo.deliveryFee;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    const coupon = resolveCoupon(code);
    if (!coupon) {
      setCouponError("Invalid or expired coupon code.");
      setApplied(undefined);
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`This coupon requires a minimum order of ${formatPrice(coupon.minOrder)}.`);
      setApplied(undefined);
      return;
    }
    setCouponError("");
    setApplied(coupon);
  };

  if (items.length === 0) {
    return (
      <div className="bg-cream py-20">
        <div className="mx-auto max-w-md px-4 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <ShoppingCart className="h-10 w-10" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-brand-950">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-brand-500">
            Discover our premium supplements and start your wellness journey today.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">
          Shopping Cart
        </h1>
        <p className="mt-1 text-sm text-brand-500">
          {items.reduce((s, i) => s + i.quantity, 0)} item(s) in your cart
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-card"
              >
                <Link href={`/product/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                  <Image src={item.image} alt={item.title} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="line-clamp-2 text-sm font-semibold text-brand-950 transition hover:text-brand-700"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-brand-400">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      aria-label="Remove item"
                      className="rounded-full p-1.5 text-brand-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-brand-200">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-700 hover:bg-brand-50"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-700 hover:bg-brand-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-display text-sm font-bold text-brand-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-card lg:sticky lg:top-32">
            <h2 className="font-display text-lg font-bold text-brand-950">Order Summary</h2>

            {/* Coupon */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-900">Coupon Code</label>
              {applied ? (
                <div className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                    <Tag className="h-4 w-4" /> {applied.code}
                  </span>
                  <button
                    onClick={() => {
                      setApplied(undefined);
                      setCode("");
                    }}
                    aria-label="Remove coupon"
                    className="text-brand-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter coupon"
                    className="h-11 flex-1 rounded-xl border border-brand-200 px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                  <button
                    onClick={applyCoupon}
                    className="h-11 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="mt-1 text-xs text-red-500">{couponError}</p>}
            </div>

            {/* Delivery region */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-900">
                Delivery Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              >
                <option value="">Select your region</option>
                {["Dar es Salaam", "Arusha", "Dodoma", "Mwanza", "Mbeya", "Tanga", "Morogoro", "Zanzibar", "Other Regions"].map(
                  (r) => (
                    <option key={r} value={r}>{r}</option>
                  )
                )}
              </select>
              <p className="mt-1 text-xs text-brand-500">
                {regionInfo.eta} • Delivery fee {region ? formatPrice(regionInfo.deliveryFee) : "—"}
              </p>
            </div>

            <div className="space-y-2 border-t border-brand-100 pt-4 text-sm">
              <div className="flex justify-between text-brand-600">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-950">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-600">
                  <span>Discount ({applied?.code})</span>
                  <span className="font-semibold text-brand-600">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-600">
                <span>Delivery</span>
                <span className="font-semibold text-brand-950">
                  {shipping === 0 ? (
                    <span className="text-brand-600">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {subtotal < SITE.freeShippingThreshold && subtotal > 0 && (
                <p className="rounded-lg bg-gold-50 px-3 py-2 text-xs text-gold-700">
                  Add {formatPrice(SITE.freeShippingThreshold - subtotal)} more to unlock FREE delivery.
                </p>
              )}
              <div className="flex justify-between border-t border-brand-100 pt-3 text-base">
                <span className="font-bold text-brand-950">Total</span>
                <span className="font-display text-xl font-bold text-brand-900">{formatPrice(total)}</span>
              </div>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Order note (optional)"
              className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 text-base font-semibold text-white shadow-sm shadow-gold-500/30 transition hover:from-gold-500 hover:to-gold-700"
            >
              Proceed to Checkout <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/shop"
              className="block text-center text-sm font-medium text-brand-600 underline-offset-2 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
