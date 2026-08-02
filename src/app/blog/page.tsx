import type { Metadata } from "next";

import { AllArticles, BlogHero } from "@/components/sections/BlogIndex";
import { BLOG_POSTS } from "@/content/blog";

/**
 * Copy is the blog hero's own standfirst (`352:3587`), verbatim. The title is
 * the `<h1>` string (`352:3586`) in sentence case - the design sets it
 * uppercase through `textCase: UPPER` and the display face, not through the
 * characters (typography.md S0.3), and a `<title>` is not styled type.
 */
export const metadata: Metadata = {
  title: "The Azza Blog",
  description:
    "Stay updated with the latest product releases, crypto tips, and " +
    "insights from the Azza team.",
};

/**
 * `/blog` - Figma `281:56` "Blog".
 *
 * Two sections between the nav and the footer, in the frame's own order:
 * the hero `352:3582` at y 123, then "All Articles" `500:2197` at y 1149.
 * Site chrome is `layout.tsx` + `SiteChrome`; nothing here repeats it.
 *
 * THE SEAM BETWEEN THE TWO SECTIONS IS DELIBERATE AND ASYMMETRIC.
 * `BlogHero` is `rhythm="standard"` (80/80) and `AllArticles` is
 * `rhythm="final"` (pt-0 pb-30) - components.md S4.1 states the reason in one
 * line: "the blog hero's 80 supplies the seam". Adding any wrapper, gap or
 * padding here would double it, and sections abut at 0px (layout.md S10.3,
 * assertion 1). Hence the fragment.
 *
 * ONE FEATURED POST, NINE IN THE GRID, TEN RECORDS.
 * `BLOG_POSTS` holds ten: index 0 is the hero's featured card (`352:3588`) and
 * 1-9 are the grid (`500:2215` … `500:2273`). The whole array is passed to
 * `AllArticles` because it drops `featured` posts from the grid itself
 * (content/blog.ts, "HOW /blog COMPOSES THIS"), so passing the array and
 * passing a pre-filtered one produce the same nine cards - and only one place
 * knows the rule.
 *
 * The `<h1>` ("THE AZZA BLOG", `352:3586`) lives in `BlogHero`, which is why
 * this file renders no heading of its own.
 */
export default function BlogPage() {
  const featured = BLOG_POSTS.find((post) => post.featured) ?? BLOG_POSTS[0];

  return (
    <>
      <BlogHero featured={featured} />
      <AllArticles posts={BLOG_POSTS} />
    </>
  );
}
