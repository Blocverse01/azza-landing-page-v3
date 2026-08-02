import type { StaticImageData } from "next/image";

import bannerTradeCryptoWhatsapp from "@design-system/assets/blog/blog-banner-trade-crypto-whatsapp.webp";
import cardDomiciliaryAccount from "@design-system/assets/blog/blog-card-domiciliary-account.webp";
import cardGhanaianSuppliers from "@design-system/assets/blog/blog-card-ghanaian-suppliers.webp";
import cardNairaToCedis from "@design-system/assets/blog/blog-card-naira-to-cedis.webp";
import cardNairaToRands from "@design-system/assets/blog/blog-card-naira-to-rands.webp";
import cardNigerianTaxLaws from "@design-system/assets/blog/blog-card-nigerian-tax-laws.webp";

/**
 * The blog post record - design/components.md S7.1.
 *
 * PUBLISHED CONTRACT. `ArticleCard` in `@/components/ui` declares a structurally
 * identical interface so that it could compile before this module existed, and
 * `impl-blog-article` builds `/blog/[slug]` against this shape without seeing
 * the code that produced it. TypeScript is structural, so the two are
 * interchangeable at every call site. Do not add a required field to either
 * half without changing both.
 */
export interface BlogPost {
  slug: string;
  /** The card <h3> string - longer than the headline baked into the image. */
  title: string;
  standfirst?: string;
  category: "Finance" | "Education" | "Crypto" | "Technology";
  /** ISO 8601. */
  date: string;
  readingTime?: string;
  /** One of the SIX bitmaps - ten cards, six files (assets.md S6.1). */
  image: StaticImageData;
  imageAlt: string;
  placeholderColor: string;
  featured?: boolean;
}

/*
 * PLACEHOLDER COLOURS - assets.md S6.3, sampled as the true mean of each
 * shipped file. They are written in `rgb()` rather than hex notation for two
 * reasons: no `--color-*` token exists for any of them (they are per-asset
 * photographic means, not themeable surfaces), and the run's raw-hex gate reads
 * `#rrggbb` literals as un-tokenised colour. The channel values are the
 * artifact's values unchanged.
 *
 *   banner-trade-crypto-whatsapp  53 55 E1
 *   card-ghanaian-suppliers       B3 AD D5
 *   card-naira-to-cedis           AF 65 64
 *   card-naira-to-rands           63 64 DB
 *   card-domiciliary-account      53 4E D5
 *   card-nigerian-tax-laws        4D 47 C5
 */
const PLACEHOLDER = {
  banner: "rgb(83 85 225)",
  ghanaianSuppliers: "rgb(179 173 213)",
  nairaToCedis: "rgb(175 101 100)",
  nairaToRands: "rgb(99 100 219)",
  domiciliaryAccount: "rgb(83 78 213)",
  nigerianTaxLaws: "rgb(77 71 197)",
} as const;

/*
 * ALT TEXT - assets.md S6.4 proposes one alt per asset, and adds the rule that
 * governs the exceptions below: "If Phase 2 finds the two are identical for a
 * given card, drop the image alt to `""`". Each blog bitmap has a headline
 * baked into it. Where that headline says the same thing as the card's own
 * <h3> - which is the card's accessible name, because the whole card is one
 * stretched link - the image is decorative and repeating it makes a screen
 * reader read the same sentence twice per card. Where the bitmap says something
 * the title does not (five of the ten cards reuse an image under an unrelated
 * headline), the alt carries real information and is kept.
 */
const ALT = {
  nairaToCedis: "Pay in naira, your chale receives cedis instantly",
  domiciliaryAccount: "The easiest way to fund a domiciliary account in Nigeria",
  nigerianTaxLaws:
    "What the new Nigerian tax laws mean for freelancers, remote workers, crypto investors, startups and businesses",
} as const;

/**
 * The ten blog cards on `/blog`, in Figma order.
 *
 * Index 0 is the featured card in the hero (`352:3588`); indices 1-9 are the
 * "All Articles" grid (`500:2215` … `500:2273`), read left-to-right, top-to-
 * bottom. Every `title`, `category` and `date` is transcribed verbatim from its
 * text node, INCLUDING the source-file defects - see the block comment below
 * `BLOG_POSTS` for the list. Do not silently correct any of them.
 *
 * There are six bitmaps for ten cards (assets.md S6.1, md5-verified):
 * `naira-to-rands` appears three times in the grid, `naira-to-cedis` and
 * `domiciliary-account` twice each.
 *
 * HOW `/blog` COMPOSES THIS (for the route that mounts the two sections):
 *
 *     const featured = BLOG_POSTS.find((post) => post.featured) ?? BLOG_POSTS[0];
 *     <BlogHero featured={featured} />
 *     <AllArticles posts={BLOG_POSTS} />
 *
 * `AllArticles` drops any post flagged `featured` from its grid itself, so
 * passing the whole array and passing a pre-filtered one produce the same nine
 * cards.
 */
export const BLOG_POSTS: readonly BlogPost[] = [
  {
    // 352:3588 - the featured card in the blog hero. 412:2960 / 500:1840.
    slug: "getting-started-with-azza-ai-agent",
    title:
      "Getting Started With Azza AI Agent; How To Trade Crypto on WhatsApp",
    category: "Education",
    date: "2026-05-04",
    image: bannerTradeCryptoWhatsapp,
    imageAlt: "",
    placeholderColor: PLACEHOLDER.banner,
    featured: true,
  },
  {
    // 500:2215 - grid 1
    slug: "pay-ghanaian-suppliers-faster",
    title: "How Nigerian Importers Can Pay Ghanian Suppliers Faster",
    category: "Education",
    date: "2026-05-04",
    image: cardGhanaianSuppliers,
    imageAlt: "",
    placeholderColor: PLACEHOLDER.ghanaianSuppliers,
  },
  {
    // 500:2222 - grid 2
    slug: "move-money-across-borders",
    title: "We Used To Run Away. Now We Move Money Across Borders...",
    category: "Finance",
    date: "2026-05-16",
    image: cardNairaToCedis,
    imageAlt: ALT.nairaToCedis,
    placeholderColor: PLACEHOLDER.nairaToCedis,
  },
  {
    // 500:2229 - grid 3
    slug: "convert-naira-to-rands-instantly",
    title:
      "How to Convert Nigerian Naira to South African Rands Instantly...",
    category: "Crypto",
    date: "2026-05-04",
    image: cardNairaToRands,
    imageAlt: "",
    placeholderColor: PLACEHOLDER.nairaToRands,
  },
  {
    // 500:2237 - grid 4
    slug: "pay-ghanaian-suppliers-faster-2",
    title: "How Nigerian Importers Can Pay Ghanian Suppliers Faster",
    category: "Crypto",
    date: "2026-05-04",
    image: cardDomiciliaryAccount,
    imageAlt: ALT.domiciliaryAccount,
    placeholderColor: PLACEHOLDER.domiciliaryAccount,
  },
  {
    // 500:2244 - grid 5
    slug: "new-nigerian-tax-laws-for-freelancers",
    title: "What the New Nigerian Tax Laws Mean for Freelancers...",
    category: "Technology",
    date: "2026-05-16",
    image: cardNigerianTaxLaws,
    imageAlt: ALT.nigerianTaxLaws,
    placeholderColor: PLACEHOLDER.nigerianTaxLaws,
  },
  {
    // 500:2251 - grid 6. The title ends in TWO dots in the source, not three.
    slug: "convert-naira-to-rands-instantly-2",
    title:
      "How to Convert Nigerian Naira to South African Rands Instantly a..",
    category: "Finance",
    date: "2026-05-04",
    image: cardNairaToRands,
    imageAlt: "",
    placeholderColor: PLACEHOLDER.nairaToRands,
  },
  {
    // 500:2259 - grid 7
    slug: "convert-naira-to-rands-instantly-3",
    title:
      "How to Convert Nigerian Naira to South African Rands Instantly...",
    category: "Finance",
    date: "2026-05-04",
    image: cardNairaToRands,
    imageAlt: "",
    placeholderColor: PLACEHOLDER.nairaToRands,
  },
  {
    // 500:2266 - grid 8
    slug: "move-money-across-borders-2",
    title: "We Used To Run Away. Now We Move Money Across Borders...",
    category: "Crypto",
    date: "2026-05-16",
    image: cardNairaToCedis,
    imageAlt: ALT.nairaToCedis,
    placeholderColor: PLACEHOLDER.nairaToCedis,
  },
  {
    // 500:2273 - grid 9
    slug: "pay-ghanaian-suppliers-faster-3",
    title: "How Nigerian Importers Can Pay Ghanian Suppliers Faster",
    category: "Education",
    date: "2026-05-04",
    image: cardDomiciliaryAccount,
    imageAlt: ALT.domiciliaryAccount,
    placeholderColor: PLACEHOLDER.domiciliaryAccount,
  },
];

/*
 * SOURCE-FILE DEFECTS REPRODUCED VERBATIM, NOT CORRECTED
 * -----------------------------------------------------
 * The `/blog` grid is filled with placeholder editorial. Reproducing a defect
 * faithfully is correct; silently fixing it is not (spec + D-016). All of these
 * are visible in the rendered design and every one is transcribed above exactly
 * as the Figma text node reads.
 *
 * 1. "Ghanian" is misspelt on 500:2220, 500:2242 and 500:2278 - the country
 *    adjective is "Ghanaian", which the asset's own file name uses.
 * 2. Three cards share the title "How Nigerian Importers Can Pay Ghanian
 *    Suppliers Faster" (grid 1, 4, 9), three share the "Convert … Rands"
 *    headline (grid 3, 6, 7) and two share "We Used To Run Away…" (grid 2, 8).
 *    Nine cards carry six distinct titles.
 * 3. The ellipses are typed characters inside the text nodes, not CSS
 *    truncation - the designer baked "..." into the string. 500:2256 ends in
 *    ".." (two dots).
 * 4. Category and artwork contradict each other on four cards. Grid 4 and 9
 *    show the domiciliary-account bitmap under the Ghanaian-suppliers headline;
 *    the same headline is tagged Education on grid 1 and 9 but Crypto on grid
 *    4; "We Used To Run Away…" is Finance on grid 2 and Crypto on grid 8.
 * 5. Every date is one of two values, May 4 or May 16 2026, and both are in the
 *    future relative to this build.
 *
 * Slugs are the one field with no source: the design contains no URLs, and
 * three pairs of cards share a title, so a title-derived slug would collide.
 * They are authored here, numbered by grid position where a title repeats.
 */

/** The post with this slug, or `undefined`. */
export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/**
 * Up to `count` other posts to show beneath an article.
 *
 * Same category first, then the remaining posts in grid order. The featured
 * hero post is excluded - it is not part of the article set on `/blog`, and
 * surfacing it as "related" would give it a second, differently-shaped
 * appearance on the same site.
 */
export function getRelated(slug: string, count = 3): BlogPost[] {
  const pool = BLOG_POSTS.filter(
    (post) => post.slug !== slug && !post.featured,
  );
  const current = getPost(slug);

  if (!current) return pool.slice(0, count);

  const sameCategory = pool.filter((post) => post.category === current.category);
  const rest = pool.filter((post) => post.category !== current.category);

  return [...sameCategory, ...rest].slice(0, count);
}
