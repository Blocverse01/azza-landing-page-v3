import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/hashnode";
import { SITE } from "@/lib/site";

/**
 * `/sitemap.xml` - every public route, plus one entry per live blog post.
 *
 * The static routes are the D-002 sitemap as built. `/help` is listed even
 * though the footer now sends "Help & Support" to WhatsApp (2026-09-08): the
 * route still builds and is reachable, so it is still a page. The blog list
 * comes from the same Hashnode feed the /blog route renders, so the two can
 * never disagree about which posts exist.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE.url}/products/crypto-wallet`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/products/cross-border-payments`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/products/for-business`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${SITE.url}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/terms-of-use`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const posts = await getBlogPosts();
  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...routes, ...articles];
}
