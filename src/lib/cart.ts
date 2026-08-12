export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShipping: boolean;
}

import { SHIPPING, deliveryZoneFor } from "@/lib/constants";

export const CART_STORAGE_KEY = "pjherbal_cart";
export const COUPON_STORAGE_KEY = "pjherbal_coupon";

export interface TotalsOptions {
  /** Region used by the delivery fee calculator. Empty when not yet chosen. */
  region?: string;
}

export function calculateTotals(
  items: CartItem[],
  coupon?: { type: string; value: number; maxDiscount?: number | null } | null,
  options: TotalsOptions = {}
): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon && subtotal > 0) {
    discount =
      coupon.type === "PERCENTAGE"
        ? (subtotal * coupon.value) / 100
        : coupon.value;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    discount = Math.min(discount, subtotal);
  }

  const afterDiscount = subtotal - discount;
  const freeShipping = afterDiscount >= SHIPPING.freeThreshold || afterDiscount === 0;

  // Delivery fee calculator: region-based fee when a region is selected.
  let shipping: number;
  if (freeShipping) {
    shipping = 0;
  } else if (options.region) {
    shipping = deliveryZoneFor(options.region).fee;
  } else {
    // No region chosen yet — show the base (Dar es Salaam) fee as an estimate.
    shipping = SHIPPING.fee;
  }

  return {
    subtotal: Math.round(subtotal),
    discount: Math.round(discount),
    shipping,
    total: Math.round(afterDiscount + shipping),
    freeShipping,
  };
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function deliveryEtaFor(region?: string): string {
  return deliveryZoneFor(region || "").eta;
}
