import type { StaticImageData } from "next/image";

/**
 * The blog post record - design/components.md S7.1.
 *
 * PUBLISHED CONTRACT. `ArticleCard` in `@/components/ui` declares a
 * structurally identical interface so that it could compile before this module
 * existed, and `impl-blog-article` builds `/blog/[slug]` against this shape
 * without seeing the code that produced it. TypeScript is structural, so the
 * two are interchangeable at every call site. Do not add a REQUIRED field to
 * either half without changing both.
 *
 * THE DUMMY RECORDS ARE GONE (operator request, 2026-09-05). This module used
 * to carry ten hand-transcribed placeholder posts and their helpers; the blog
 * now reads the @useazza Hashnode publication through `src/lib/hashnode.ts`,
 * which returns exactly this shape (plus the article body) - see that file for
 * the source, the freshness model and the adaptation rules. What remains here
 * is the CONTRACT the components render against, which is design-owned and
 * outlives any data source.
 *
 * `image` stays `StaticImageData` on purpose: `Media` renders through
 * next/image `fill`, and the adapter satisfies the type with a synthetic
 * `{ src, width, height }` for remote covers - so no ui contract widened and
 * no component changed when the data source did.
 */
export interface BlogPost {
  slug: string;
  /** The card <h3> string. */
  title: string;
  standfirst?: string;
  category: "Finance" | "Education" | "Crypto" | "Technology";
  /** ISO 8601. */
  date: string;
  readingTime?: string;
  image: StaticImageData;
  imageAlt: string;
  /** The blur-up tint behind the cover while it loads (assets.md S6.3). */
  placeholderColor: string;
  featured?: boolean;
  /**
   * The post's author, from the source. Optional because the drawn design
   * carries a byline node of its own that `ArticleHeader` falls back to
   * (352:3689).
   */
  author?: string;
}
