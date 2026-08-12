import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: "PJHERBAL",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#1f733d",
    icons: [
      { src: "/images/logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
