import { SITE } from "@/lib/constants";

interface OrgInput {
  type: "Organization";
  name: string;
  url: string;
  description: string;
  logo?: string;
  address?: string;
  phone?: string;
}

interface StoreInput {
  type: "Store";
  name: string;
  url: string;
  description: string;
  logo?: string;
}

interface ProductInput {
  type: "Product";
  name: string;
  description: string;
  image: string;
  url: string;
  price: number;
  currency: string;
  sku?: string;
  rating?: { ratingValue: number; ratingCount: number };
  stock?: number;
  brand?: string;
}

interface BreadcrumbInput {
  type: "Breadcrumb";
  items: { name: string; url: string }[];
}

interface ArticleInput {
  type: "Article";
  headline: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  author: string;
}

export function generateJsonLd(
  input: OrgInput | StoreInput | ProductInput | BreadcrumbInput | ArticleInput
): Record<string, unknown> {
  const base = { "@context": "https://schema.org" };

  switch (input.type) {
    case "Organization":
      return {
        ...base,
        "@type": "Organization",
        name: input.name,
        url: input.url,
        description: input.description,
        logo: input.logo || `${SITE.url}/images/logo.svg`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE.phone,
          contactType: "customer service",
          areaServed: "TZ",
        },
      };
    case "Store":
      return {
        ...base,
        "@type": "Store",
        name: input.name,
        url: input.url,
        description: input.description,
        logo: input.logo || `${SITE.url}/images/logo.svg`,
        priceRange: "TZS",
      };
    case "Product":
      return {
        ...base,
        "@type": "Product",
        name: input.name,
        description: input.description,
        image: input.image,
        url: input.url,
        sku: input.sku,
        brand: { "@type": "Brand", name: input.brand || SITE.name },
        offers: {
          "@type": "Offer",
          price: input.price,
          priceCurrency: input.currency || "TZS",
          availability:
            typeof input.stock === "number" && input.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: input.url,
        },
        aggregateRating: input.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: input.rating.ratingValue,
              reviewCount: input.rating.ratingCount,
            }
          : undefined,
      };
    case "Breadcrumb":
      return {
        ...base,
        "@type": "BreadcrumbList",
        itemListElement: input.items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      };
    case "Article":
      return {
        ...base,
        "@type": "Article",
        headline: input.headline,
        description: input.description,
        image: input.image,
        url: input.url,
        datePublished: input.datePublished,
        author: { "@type": "Person", name: input.author },
        publisher: { "@type": "Organization", name: SITE.name },
      };
  }
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
