import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/**
 * `/manifest.webmanifest`. The icons are the brand mark on its own blue
 * plate (public/icon-*.png, rendered from app/icon.svg), full-bleed so they
 * survive a maskable crop. `theme_color` is the brand blue, matching the
 * `viewport.themeColor` in layout.tsx.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.legalName,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#3430E9",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
