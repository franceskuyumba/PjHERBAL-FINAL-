"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <LanguageProvider>
        <CartProvider>
          <AnalyticsScripts />
          {children}
        </CartProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}
