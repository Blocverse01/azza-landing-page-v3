import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/components/sections/BlogArticle";
import type { BlogPost } from "@/content/blog";
import { getBlogPost, getBlogPosts, getRelatedPosts } from "@/lib/hashnode";

interface ArticlePageProps {
  /** Next 15 hands route params in as a promise. */
  params: Promise<{ slug: string }>;
}

/**
 * ONE PAGE PER POST IN THE FEED - featured included: every card on `/blog` is
 * a stretched link here, and the hero's featured card is one of them.
 *
 * The list is fetched at build for static generation, and `dynamicParams`
 * stays at its default TRUE on purpose: a post published after the build has
 * no static page yet, and the default lets Next render it on first request
 * through the same ISR-cached fetch - which is the whole point of reading a
 * live feed. An unreachable feed at build time returns `[]` and every page
 * simply renders on demand instead; the build must not fail because Hashnode
 * had a bad minute.
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * The `<meta name="description">` for one post. Every Hashnode post carries a
 * real standfirst (the feed's description), so the composed fallback is for
 * the record that somehow lacks one - derived, never invented.
 */
function describe(post: BlogPost): string {
  if (post.standfirst) return post.standfirst;
  return `${post.title.replace(/\.+$/, "")}. ${post.category} on the Azza blog.`;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  /*
   * An unknown slug still reaches this function before the component runs.
   * Returning empty metadata lets the page below call `notFound()` and render
   * the 404, which is the single place that decision belongs.
   */
  if (!post) return {};

  return {
    title: post.title,
    description: describe(post),
    /*
     * NO `images` HERE still - the covers are absolute Hashnode CDN URLs now,
     * which WOULD satisfy Open Graph, but `metadataBase` remains unset in
     * layout.tsx and adding og images consistently belongs with that
     * site-wide decision. The standing note from the dummy era carries over.
     */
    openGraph: {
      type: "article",
      title: post.title,
      description: describe(post),
      publishedTime: post.date,
    },
  };
}

/**
 * `/blog/[slug]` - Figma `282:803` "Blog- Article Opened".
 *
 * One section between the nav and the footer: `BlogArticle` (`352:3681`),
 * which owns the header, the hero image, the body, the share rows and the
 * related rail, and supplies the route's single `<h1>` (`352:3685`).
 *
 * THE BODY IS REAL NOW: the post's own sanitised HTML from the Hashnode feed,
 * rendered by `ArticleBody` through the article prose styles - the era of
 * every slug sharing one hand-transcribed body (the old ArticleBody's
 * documented finding) ends with the dummy records.
 */
export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return <BlogArticle post={post} related={await getRelatedPosts(slug)} />;
}
