export const SITE = {
  name: "PJHERBAL Clinic",
  fullName: "PJHERBAL Clinic – Segerea Branch",
  tagline: "Premium natural supplements for a healthier Tanzania",
  description:
    "PJHERBAL Clinic – Segerea Branch is a trusted Tanzanian supplier of premium natural herbal supplements. Shop authentic products for men's health, weight management, energy, immunity, brain focus and detox.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "info@pjherbal.co.tz",
  phone: "+255 700 000 000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "255700000000",
  whatsappDefaultMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE ||
    "Hello PJHERBAL Clinic, I would like some assistance.",
  address: "Segerea, Dar es Salaam, Tanzania",
  currency: "TZS",
};

export const SHIPPING = {
  fee: Number(process.env.SHIPPING_FEE_TZS || 7000),
  freeThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD_TZS || 200000),
};

export interface DeliveryZone {
  fee: number;
  eta: string;
  sameDay?: boolean;
}

/**
 * Delivery fee calculator zones. Fees are per-region in TZS.
 * Prices/days can be tuned with env vars (SHIPPING_FEE_TZS etc. act as fallback).
 */
export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  "Dar es Salaam": { fee: 7000, eta: "Same-day delivery in Dar es Salaam", sameDay: true },
  "Pwani": { fee: 9000, eta: "1–2 days" },
  "Morogoro": { fee: 10000, eta: "1–2 days" },
  "Dodoma": { fee: 10000, eta: "2–3 days" },
  "Tanga": { fee: 10000, eta: "2–3 days" },
  "Arusha": { fee: 10000, eta: "2–3 days" },
  "Kilimanjaro": { fee: 10000, eta: "2–3 days" },
  "Mwanza": { fee: 12000, eta: "2–3 days" },
  "Zanzibar": { fee: 12000, eta: "3–5 days" },
  "Pemba": { fee: 12000, eta: "3–5 days" },
  "Mbeya": { fee: 12000, eta: "3–4 days" },
  "Iringa": { fee: 12000, eta: "3–4 days" },
  "Tabora": { fee: 15000, eta: "4–5 days" },
  "Singida": { fee: 15000, eta: "4–5 days" },
  "Shinyanga": { fee: 15000, eta: "4–5 days" },
  "Kagera": { fee: 15000, eta: "4–6 days" },
  "Mara": { fee: 15000, eta: "4–6 days" },
  "Manyara": { fee: 15000, eta: "4–5 days" },
  "Njombe": { fee: 15000, eta: "4–5 days" },
  "Rukwa": { fee: 15000, eta: "4–6 days" },
  "Songwe": { fee: 15000, eta: "4–5 days" },
  "Katavi": { fee: 18000, eta: "5–7 days" },
  "Ruvuma": { fee: 15000, eta: "4–6 days" },
  "Lindi": { fee: 15000, eta: "4–6 days" },
  "Mtwara": { fee: 15000, eta: "4–6 days" },
  "Geita": { fee: 15000, eta: "4–5 days" },
  "Simiyu": { fee: 15000, eta: "4–5 days" },
  "Kigoma": { fee: 18000, eta: "5–7 days" },
};

export function deliveryZoneFor(region: string): DeliveryZone {
  return (
    DELIVERY_ZONES[region] || {
      fee: Number(process.env.SHIPPING_FEE_TZS || 7000),
      eta: "3–5 days",
    }
  );
}

export const GOOGLE_MAPS = {
  // Google Business Profile listing URL (set after the profile is verified).
  businessUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "",
  // Embed src for the store location. Use the public "Share -> Embed a map" link.
  embedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps?q=Segerea,Dar+es+Salaam,Tanzania&output=embed",
};

export const SOCIAL_LINKS = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/pjherbal",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/pjherbal",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/@pjherbal",
  x: process.env.NEXT_PUBLIC_X_URL || "https://x.com/pjherbal",
};

export const TANZANIA_REGIONS = [
  "Dar es Salaam",
  "Arusha",
  "Mwanza",
  "Dodoma",
  "Morogoro",
  "Mbeya",
  "Kilimanjaro",
  "Tanga",
  "Pwani",
  "Zanzibar",
  "Pemba",
  "Kigoma",
  "Tabora",
  "Singida",
  "Shinyanga",
  "Kagera",
  "Mara",
  "Manyara",
  "Iringa",
  "Njombe",
  "Rukwa",
  "Songwe",
  "Katavi",
  "Ruvuma",
  "Lindi",
  "Mtwara",
  "Geita",
  "Simiyu",
] as const;

export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending", color: "amber" },
  { value: "PAID", label: "Paid", color: "blue" },
  { value: "PROCESSING", label: "Processing", color: "indigo" },
  { value: "DISPATCHED", label: "Dispatched", color: "violet" },
  { value: "DELIVERED", label: "Delivered", color: "green" },
  { value: "CANCELLED", label: "Cancelled", color: "red" },
] as const;

export const PAYMENT_STATUSES = ["UNPAID", "PAID", "FAILED", "REFUNDED"] as const;

export const PAYMENT_METHODS = [
  { id: "M-PESA", name: "M-Pesa", description: "Vodacom mobile money", icon: "mobile" },
  { id: "TIGO_PESA", name: "Tigo Pesa", description: "Tigo mobile money", icon: "mobile" },
  { id: "AIRTEL_MONEY", name: "Airtel Money", description: "Airtel mobile money", icon: "mobile" },
  { id: "HALOPESA", name: "HaloPesa", description: "Halotel mobile money", icon: "mobile" },
  { id: "CRDB", name: "CRDB Bank", description: "Bank transfer to CRDB", icon: "bank" },
  { id: "NMB", name: "NMB Bank", description: "Bank transfer to NMB", icon: "bank" },
] as const;

export const PRODUCT_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "OUT_OF_STOCK", label: "Out of stock" },
  { value: "DRAFT", label: "Draft" },
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  "mens-health": "shield",
  "weight-management": "scale",
  "energy-immunity": "zap",
  "womens-wellness": "flower",
  "brain-focus": "brain",
  "detox-digestion": "leaf",
};

export const ANALYTICS = {
  gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
};
