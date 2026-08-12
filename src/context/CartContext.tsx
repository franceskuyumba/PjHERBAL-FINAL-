"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CART_STORAGE_KEY, COUPON_STORAGE_KEY, calculateTotals, cartCount, type CartItem } from "@/lib/cart";

export interface AppliedCoupon {
  code: string;
  type: string;
  value: number;
  maxDiscount?: number | null;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  coupon: AppliedCoupon | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  totals: ReturnType<typeof calculateTotals>;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCouponState] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage<CartItem[]>(CART_STORAGE_KEY, []));
    setCouponState(readStorage<AppliedCoupon | null>(COUPON_STORAGE_KEY, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (coupon) window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    else window.localStorage.removeItem(COUPON_STORAGE_KEY);
  }, [coupon, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock || 99) }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponState(null);
  }, []);

  const setCoupon = useCallback((c: AppliedCoupon | null) => setCouponState(c), []);

  const totals = useMemo(() => calculateTotals(items, coupon), [items, coupon]);
  const count = useMemo(() => cartCount(items), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        coupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setCoupon,
        totals,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
