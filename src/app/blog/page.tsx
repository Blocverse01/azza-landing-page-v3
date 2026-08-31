import type { Metadata } from "next";

import { AllArticles, BlogHero } from "@/components/sections/BlogIndex";
import { BLOG_POSTS } from "@/content/blog";

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
 * THE SEAM IS 160 NOW, AND BOTH SECTIONS OWN HALF. The original grid section
 * had no top padding and leaned on the hero's 80; the revision gives `802:627`
 * its own 80 on top of the hero's (the `final` rhythm carries it), so the two
 * paddings meet at the designed 160. Sections still abut at 0px (layout.md
 * S10.3, assertion 1). Hence the fragment.
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
