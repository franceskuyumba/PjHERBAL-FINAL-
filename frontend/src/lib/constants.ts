export const SITE = {
  name: "AfyaPlus",
  fullName: "AfyaPlus Tanzania",
  tagline: "Premium Supplements for a Healthier You",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  currency: "TZS",
  phone: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+255 712 345 678",
  phoneHref: "tel:+255712345678",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "255712345678",
  email: "care@afyaplus.co.tz",
  address: "Samora Avenue, Dar es Salaam, Tanzania",
  hours: "Mon–Sat: 8:00 – 21:00, Sun: 10:00 – 18:00",
  freeShippingThreshold: 80000,
  defaultShippingFee: 5000,
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
    x: "https://x.com",
  },
} as const;

export const WHATSAPP_LINK = (message?: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    message ?? "Hello AfyaPlus! I would like some help choosing a supplement."
  )}`;

export const PAYMENT_METHODS = [
  { id: "mpesa", name: "M-Pesa", label: "M-Pesa", color: "#00a951" },
  { id: "tigo-pesa", name: "Tigo Pesa", label: "Tigo Pesa", color: "#005f9e" },
  { id: "airtel-money", name: "Airtel Money", label: "Airtel Money", color: "#e40000" },
  { id: "halopesa", name: "HaloPesa", label: "HaloPesa", color: "#9c1f8f" },
  { id: "crdb", name: "CRDB Bank", label: "CRDB Bank", color: "#0f7a3d" },
  { id: "nmb", name: "NMB Bank", label: "NMB Bank", color: "#c4122e" },
  { id: "card", name: "Card", label: "Visa / Mastercard", color: "#1a1f71" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;
