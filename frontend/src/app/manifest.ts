import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f0",
    theme_color: "#1f7a4b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
