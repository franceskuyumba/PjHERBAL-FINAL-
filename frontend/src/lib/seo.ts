import type { Metadata } from "next";
import { SITE } from "./constants";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
}: SeoProps = {}): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title: title
      ? `${title} | ${SITE.name}`
      : `${SITE.name} — ${SITE.tagline}`,
    description:
      description ||
      "Shop premium health supplements in Tanzania. Free delivery in Dar es Salaam, M-Pesa & mobile money payments, and expert WhatsApp support.",
    alternates: { canonical: url },
    openGraph: {
      title: title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`,
      description:
        description || "Premium supplements delivered across Tanzania. Secure mobile money payments and expert WhatsApp support.",
      url,
      siteName: SITE.name,
      type,
      locale: "en_TZ",
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: title || SITE.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${SITE.name}` : SITE.name,
      description:
        description || "Premium supplements delivered across Tanzania.",
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
