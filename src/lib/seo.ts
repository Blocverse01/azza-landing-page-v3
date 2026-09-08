import type { Metadata } from "next";

import type { BlogPost } from "@/content/blog";
import type { FaqItem } from "@/content/faq";
import { SOCIAL_URLS } from "@/content/navigation";

import { SITE } from "./site";

/**
 * Structured data - JSON-LD builders for the handful of shapes the site can
 * honestly claim. Every builder maps to content that is actually rendered on
 * the page it goes on; nothing here invents ratings, prices, addresses or
 * anything the copy does not say.
 *
 *   organization   the company behind the site, once, in the root layout
 *   webSite        the site itself, once, in the root layout
 *   faqPage        the FAQ section's own questions and answers, on the four
 *                  routes that render one (`Faq items={...}`)
 *   blogPosting    one article, from the same Hashnode record the page draws
 *
 * Rendered through `JsonLd` (components/seo), which escapes `<` so a `</script>`
 * inside a Hashnode title can never break out of the tag.
 */

/**
 * A page's Open Graph block. Next merges metadata one top-level key at a
 * time, so a page that sets `openGraph.url` on its own would drop the
 * layout's `type` / `siteName` / `locale` with it - this restates them and
 * adds the one thing only the page knows, its URL, which must equal its
 * canonical. Title and description are left out on purpose: Next fills them
 * from the page's own `title` and `description`.
 */
export function pageOpenGraph(path: string): NonNullable<Metadata["openGraph"]> {
  return { type: "website", siteName: SITE.name, locale: SITE.locale, url: path };
}

const ORGANIZATION_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon-512.png`,
    email: SITE.email,
    sameAs: Object.values(SOCIAL_URLS),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function faqPageJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * `image` is the post's cover as the page renders it: an absolute Hashnode
 * CDN URL for posts with a cover, or the committed banner's `/_next/static`
 * path for those without - resolved against the site URL either way.
 */
export function blogPostingJsonLd(post: BlogPost, description: string) {
  const image = post.image.src.startsWith("http") ? post.image.src : `${SITE.url}${post.image.src}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image,
    datePublished: post.date,
    dateModified: post.date,
    author: post.author ? { "@type": "Person", name: post.author } : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    articleSection: post.category,
    inLanguage: "en",
  };
}
