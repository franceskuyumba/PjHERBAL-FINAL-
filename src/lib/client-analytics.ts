"use client";

import { ANALYTICS } from "@/lib/constants";

let sessionId = "";
if (typeof window !== "undefined") {
  sessionId =
    window.sessionStorage.getItem("pjherbal_sid") ||
    Math.random().toString(36).slice(2, 12);
  window.sessionStorage.setItem("pjherbal_sid", sessionId);
}

type EventName =
  | "page_view"
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "purchase"
  | "search"
  | "whatsapp_click"
  | "filter_apply";

/**
 * Client-side analytics: records events in the store and fires configured
 * third-party pixels (GA4 / Meta / TikTok) when their IDs are set in .env.
 */
export async function trackClientEvent(event: EventName, data?: Record<string, unknown>) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data, sessionId, url }),
    });
  } catch {
    // Fire-and-forget; never block the UI.
  }

  firePixels(event, data);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track?: (event: string, data?: unknown) => void; page?: () => void };
  }
}

function firePixels(event: EventName, data?: Record<string, unknown>) {
  const value = data?.value ? Number(data.value) : undefined;

  if (ANALYTICS.gaId && typeof window !== "undefined") {
    if (event === "page_view") {
      window.gtag?.("event", "page_view");
    } else if (event === "view_item") {
      window.gtag?.("event", "view_item", { items: data?.items });
    } else if (event === "add_to_cart") {
      window.gtag?.("event", "add_to_cart", { value, currency: "TZS" });
    } else if (event === "begin_checkout") {
      window.gtag?.("event", "begin_checkout", { value, currency: "TZS" });
    } else if (event === "purchase") {
      window.gtag?.("event", "purchase", {
        transaction_id: data?.orderNumber,
        value,
        currency: "TZS",
      });
    } else if (event === "search") {
      window.gtag?.("event", "search", { search_term: data?.query });
    }
  }

  if (ANALYTICS.metaPixelId && typeof window !== "undefined") {
    const names: Partial<Record<EventName, string>> = {
      page_view: "PageView",
      view_item: "ViewContent",
      add_to_cart: "AddToCart",
      begin_checkout: "InitiateCheckout",
      purchase: "Purchase",
      search: "Search",
    };
    const name = names[event];
    if (name) {
      const payload =
        event === "purchase"
          ? { value, currency: "TZS" }
          : event === "add_to_cart" || event === "begin_checkout"
            ? { value, currency: "TZS" }
            : undefined;
      window.fbq?.("track", name, payload);
    }
  }

  if (ANALYTICS.tiktokPixelId && typeof window !== "undefined") {
    if (event === "page_view") {
      window.ttq?.page?.();
    } else {
      const names: Partial<Record<EventName, string>> = {
        add_to_cart: "AddToCart",
        begin_checkout: "InitiateCheckout",
        purchase: "CompletePayment",
      };
      const name = names[event];
      if (name) window.ttq?.track?.(name, { value, currency: "TZS" });
    }
  }
}
