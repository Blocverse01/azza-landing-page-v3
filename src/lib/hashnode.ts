import type { StaticImageData } from "next/image";

import fallbackBanner from "@design-system/assets/blog/blog-banner-trade-crypto-whatsapp.webp";

import type { BlogPost } from "@/content/blog";

/**
 * The Hashnode adapter - the blog's one data source (operator request,
 * 2026-09-05: fetch the @useazza Hashnode, retire the dummy records).
 *
 * WHY RSS AND NOT THE GRAPHQL API. Hashnode retired free GraphQL access on
 * 2026-05-13 (hashnode.com/changelog/2026-05-13-graphql-api-paid-access):
 * every query, reads included, now requires the publication on a paid Pro
 * plan, and the old gql endpoint 301s to the announcement. The publication's
 * RSS feed is part of serving the blog itself, needs no token, and carries
 * everything the design consumes: title, slug, publish date, author, cover,
 * tags, the standfirst (description) and the FULL post body (content:encoded,
 * 7-10KB of HTML per post - verified against the live feed). If the operator
 * ever upgrades to Pro, a GraphQL driver can replace `fetchFeed` behind the
 * same two functions; nothing downstream would notice.
 *
 * FRESHNESS - two mechanisms, layered:
 *
 *   1. ISR. Every fetch carries `revalidate: 300`, so no reader is ever more
 *      than five minutes behind the feed, with zero configuration.
 *   2. INSTANT, opt-in. `/api/revalidate-blog` accepts a Hashnode webhook and
 *      busts the `hashnode-blog` tag on the spot - see that route for the
 *      dashboard setup. The interval is the floor, the webhook is the "if
 *      instantly is possible" the operator asked for.
 *
 * THE ADAPTATION CONTRACT. Everything returned satisfies the existing
 * `BlogPost` shape from content/blog.ts, so `ArticleCard`, `BlogHero`,
 * `AllArticles` and `BlogArticle` render Hashnode posts without a line of
 * change. Three fields need manufacturing:
 *
 *   - `image` is a SYNTHETIC StaticImageData: `Media` renders through
 *     next/image `fill`, which only reads `.src` (the width/height carried
 *     here feed `heroRatio`'s arithmetic, using Hashnode's standard 1600x840
 *     cover frame). Posts without a cover fall back to the committed banner
 *     asset rather than an empty slot.
 *   - `category` is mapped from Hashnode's freeform tags onto the design's
 *     closed union - see CATEGORY_RULES. The union is a published contract
 *     (`ArticleFilters` renders exactly those four), so the mapping is total:
 *     every post lands somewhere, "Crypto" when nothing else claims it, since
 *     that is what the publication writes about.
 *   - `readingTime` is words/220, floored at one minute, from the stripped
 *     body - the feed does not carry Hashnode's own estimate.
 */

/** The publication feed. Override via env for a future custom domain. */
const FEED_URL = process.env.HASHNODE_FEED_URL ?? "https://useazza.hashnode.dev/rss.xml";

/** ISR floor - the "next best thing" cadence. One number to tune. */
export const BLOG_REVALIDATE_SECONDS = 300;

/** The cache tag the webhook route busts for instant updates. */
export const BLOG_CACHE_TAG = "hashnode-blog";

/** A full article: the card contract plus what only the article page needs. */
export interface HashnodeArticle extends BlogPost {
  /** Sanitised post body, ready for the article prose styles. */
  contentHtml: string;
  /** The canonical post on Hashnode. */
  sourceUrl: string;
}

/* ------------------------------------------------------------------ *
 * Feed parsing
 * ------------------------------------------------------------------ */

/**
 * One tag's text out of an RSS item, CDATA unwrapped and entities decoded.
 * A hand parser rather than a dependency: the project has three runtime
 * dependencies on purpose (see lib/cn.ts), the feed is a single known shape
 * from a single known producer, and the tags read here are RSS 2.0 core.
 */
function tagText(xml: string, tag: string): string | null {
  const match = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`).exec(xml);
  if (!match) return null;

  const raw = match[1].trim();
  const cdata = /^<!\[CDATA\[([\s\S]*)\]\]>$/.exec(raw);
  return decodeEntities((cdata ? cdata[1] : raw).trim());
}

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&");
}

/**
 * Defence-in-depth over the feed's HTML before it reaches
 * `dangerouslySetInnerHTML`. Hashnode sanitises author content on its side,
 * but this body still crosses a trust boundary, so the classes of markup that
 * could execute are stripped regardless: script/style/iframe/object/embed
 * subtrees, inline `on*` handlers, and `javascript:` URLs. An allowlist
 * sanitiser is a dependency this project does not take (lib/cn.ts's rule);
 * this removal list plus the platform's own sanitisation is the proportionate
 * defence for a feed the operator controls.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe|object|embed)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed)\b[^>]*\/?>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'\s>]*\2/gi, "");
}

/** The design's closed category union, matched against Hashnode's tags. */
const CATEGORY_RULES: ReadonlyArray<{
  category: BlogPost["category"];
  pattern: RegExp;
}> = [
  { category: "Education", pattern: /guide|faq|beginner|how[ -]?to|educat|learn/i },
  { category: "Technology", pattern: /tech|ai|agent|blockchain|web3|whatsapp/i },
  { category: "Finance", pattern: /finan|fintech|payment|money|income|bank|invest/i },
  { category: "Crypto", pattern: /crypto|bitcoin|stablecoin|usdt|usdc|p2p|wallet/i },
];

function mapCategory(tags: readonly string[], title: string): BlogPost["category"] {
  const haystacks = [...tags, title];
  for (const { category, pattern } of CATEGORY_RULES) {
    if (haystacks.some((value) => pattern.test(value))) return category;
  }
  return "Crypto";
}

function readingTime(html: string): string {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

/**
 * Hashnode's standard cover frame is 1600x840. `Media` renders with `fill`,
 * so only `.src` paints; the dimensions exist for `heroRatio`'s arithmetic.
 * The mean-of-asset placeholder idiom (assets.md S6.3) has no sampled value
 * for a remote cover, so every post takes the shipped banner's sampled mean -
 * the blur-up tint, not the image.
 */
function coverImage(url: string | null): StaticImageData {
  if (!url) return fallbackBanner;
  return { src: url, width: 1600, height: 840 };
}

const REMOTE_PLACEHOLDER = "rgb(83 85 225)";

function parseItem(xml: string, index: number): HashnodeArticle | null {
  const title = tagText(xml, "title");
  const link = tagText(xml, "link");
  const pubDate = tagText(xml, "pubDate");
  const body = tagText(xml, "content:encoded");
  if (!title || !link || !pubDate || !body) return null;

  const slug = new URL(link).pathname.replace(/^\/|\/$/g, "");
  if (!slug) return null;

  const cover = /<enclosure[^>]*\surl="([^"]+)"/.exec(xml)?.[1] ?? null;
  const tags = [
    ...xml.matchAll(/<category(?:\s[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/g),
  ]
    .map((m) => decodeEntities(m[1].trim()))
    .filter(Boolean);
  const description = tagText(xml, "description");

  return {
    slug,
    title,
    standfirst: description?.replace(/\s+/g, " ").trim() || undefined,
    category: mapCategory(tags, title),
    date: new Date(pubDate).toISOString(),
    readingTime: readingTime(body),
    image: coverImage(cover),
    /*
     * "" on the same rule the dummy records applied (content/blog.ts ALT
     * note): the card is one stretched link whose accessible name is the
     * title, and a cover restating the title makes a screen reader say the
     * same sentence twice.
     */
    imageAlt: "",
    placeholderColor: REMOTE_PLACEHOLDER,
    /* The feed is newest-first; the newest post is the hero's featured card,
     * exactly the role index 0 played in the dummy set. */
    featured: index === 0,
    author: tagText(xml, "dc:creator") ?? undefined,
    contentHtml: sanitizeHtml(body),
    sourceUrl: link,
  };
}

/* ------------------------------------------------------------------ *
 * The public surface
 * ------------------------------------------------------------------ */

/**
 * All posts, newest first. Returns `[]` when the feed is unreachable rather
 * than throwing: `/blog` with an empty grid (AllArticles already renders its
 * empty state) beats a 500, and the next revalidation retries anyway.
 */
export async function getBlogPosts(): Promise<HashnodeArticle[]> {
  let response: Response;
  try {
    response = await fetch(FEED_URL, {
      next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] },
    });
  } catch {
    return [];
  }
  if (!response.ok) return [];

  const xml = await response.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return items
    .map((match, index) => parseItem(match[1], index))
    .filter((post): post is HashnodeArticle => post !== null);
}

export async function getBlogPost(slug: string): Promise<HashnodeArticle | undefined> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}

/**
 * Up to `count` other posts beneath an article - the same semantics the dummy
 * helper had: same category first, then the rest, featured excluded (it is
 * the hero's card, and a second differently-shaped appearance of it on the
 * same site reads as an error).
 */
export async function getRelatedPosts(slug: string, count = 3): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const pool = posts.filter((post) => post.slug !== slug && !post.featured);
  const current = posts.find((post) => post.slug === slug);

  if (!current) return pool.slice(0, count);

  const sameCategory = pool.filter((post) => post.category === current.category);
  const rest = pool.filter((post) => post.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}
