"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/context/CartContext";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <AnalyticsScripts />
        {children}
      </CartProvider>
    </ToastProvider>
  );
}
