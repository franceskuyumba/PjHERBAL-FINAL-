import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop Supplements",
  description:
    "Browse our full range of premium health supplements in Tanzania — men's health, weight management, immunity, women's wellness, brain & focus, and detox.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
