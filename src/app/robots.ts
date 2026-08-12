import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/customer-dashboard", "/api", "/cart", "/checkout", "/login", "/register"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
