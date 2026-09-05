import type { Metadata } from "next";

import { AllArticles, BlogHero } from "@/components/sections/BlogIndex";
import { getBlogPosts } from "@/lib/hashnode";

/**
 * Copy is the blog hero's own standfirst (`802:835`), verbatim. The `<title>`
 * keeps "The Azza Blog": the revised `<h1>` is the masthead slogan "CATCH THE
 * LATEST WITH AZZA" (`802:832`), which names a mood, not the document - and a
 * `<title>` is what tabs, bookmarks and search results show.
 */
export const metadata: Metadata = {
  title: "The Azza Blog",
  description:
    "Stay updated with the latest product releases, crypto tips, and " +
    "insights from the Azza team.",
};

/**
 * `/blog` - Figma `802:569` "Blog", the 2026-08 operator revision of `281:56`.
 *
 * Two sections between the nav and the footer, in the frame's own order:
 * the masthead hero `802:774` at y 123, then "All Articles" `802:627`.
 * Site chrome is `layout.tsx` + `SiteChrome`; nothing here repeats it.
 *
 * DATA IS THE HASHNODE FEED NOW (2026-09-05, replacing the ten dummy
 * records). `getBlogPosts` is ISR-cached at five minutes and tag-busted by
 * the webhook route, so this page re-renders with fresh posts without a
 * deploy - see `src/lib/hashnode.ts`. The adapter marks the newest post
 * `featured`, which is the same role index 0 played in the dummy set: the
 * hero's card, dropped from the grid by `AllArticles` itself.
 *
 * An unreachable feed returns `[]`: the hero renders its masthead without a
 * card and the grid shows its own empty state - a degraded page, never a 500,
 * and the next revalidation retries.
 *
 * The `<h1>` ("THE AZZA BLOG" slogan node) lives in `BlogHero`, which is why
 * this file renders no heading of its own.
 */
export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];

  return (
    <>
      <BlogHero featured={featured} />
      <AllArticles posts={posts} />
    </>
  );
}
