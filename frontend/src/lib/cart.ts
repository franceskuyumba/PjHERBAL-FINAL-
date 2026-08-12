import type { CartItem, Product } from "./types";

const CART_KEY = "afyaplus_cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function toCartItem(product: Product, quantity = 1): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    image: product.images[0],
    price: product.price,
    quantity,
    category: product.category,
  };
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
