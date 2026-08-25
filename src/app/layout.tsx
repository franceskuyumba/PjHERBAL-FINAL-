import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Providers } from "@/components/Providers";
import { SearchProvider } from "@/context/SearchContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveSupport } from "@/components/layout/LiveSupport";
import { ChatBot } from "@/components/layout/ChatBot";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SITE } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "PJHERBAL Clinic",
    "supplements Tanzania",
    "herbal clinic Dar es Salaam",
    "Segerea supplements",
    "Moringa capsules",
    "black seed oil Tanzania",
    "herbal products",
    "online supplement store Tanzania",
  ],
  authors: [{ name: "PJHERBAL Clinic" }],
  openGraph: {
    type: "website",
    locale: "en_TZ",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: `${SITE.url}/images/hero.svg`, width: 900, height: 900, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
    images: [`${SITE.url}/images/hero.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Health & Wellness",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f733d",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": SITE.url,
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${SITE.url}/images/logo.svg`,
  priceRange: "TZS",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Segerea",
    addressLocality: "Dar es Salaam",
    addressCountry: "TZ",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "20:00",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const lang = getLocale();

  return (
    <html
      lang={lang}
      style={{ "--font-inter": "system-ui", "--font-playfair": "Georgia" } as CSSProperties}
    >
      <body className="flex min-h-screen flex-col overflow-x-hidden pb-16 lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Providers>
          <SearchProvider>
            <div className="site-chrome"><Navbar user={user} /></div>
            <main className="flex-1">{children}</main>
            <div className="site-chrome"><Footer /></div>
            <div className="site-chrome"><MobileBottomNav user={user} /></div>
            <div className="site-chrome"><ChatBot /><LiveSupport /></div>
          </SearchProvider>
        </Providers>
      </body>
    </html>
  );
}
