"use client";

import { useEffect, useRef } from "react";

/** Fires a product-view signal once per mount for signed-in users. */
export function TrackProductView({ productId }: { productId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch("/api/account/product-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    }).catch(() => {});
  }, [productId]);

  return null;
}
