import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/**
 * `/robots.txt`. Everything public is crawlable; the two API routes serve the
 * site's own widgets and have nothing a crawler should index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
