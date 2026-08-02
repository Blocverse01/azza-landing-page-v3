import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/components/sections/BlogArticle";
import { BLOG_POSTS, getPost, getRelated, type BlogPost } from "@/content/blog";

interface ArticlePageProps {
  /** Next 15 hands route params in as a promise. */
  params: Promise<{ slug: string }>;
}

/**
 * ONE PAGE PER RECORD IN `BLOG_POSTS` - all ten, including the featured one.
 *
 * Every card on `/blog` is a stretched link to `/blog/{slug}` (`ArticleCard`),
 * and the hero's featured card is one of them, so leaving it out would ship a
 * dead link from the first thing on the route. `getRelated` separately excludes
 * the featured post from the "Related Articles" rail, which is a different
 * question - not being *recommended* is not the same as not *existing*.
 */
export function generateStaticParams(): Array<{ slug: string }> {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

/**
 * The `<meta name="description">` for one post.
 *
 * None of the ten records sets `standfirst` - the field is optional in the
 * S7.1 contract and the design authored only one standfirst node
 * (`352:3686`), which `ArticleHeader` uses as its on-page fallback. Reusing
 * that one sentence as the description of all ten pages would make every
 * article look identical to a search engine and to a link preview, so the
 * fallback here is composed from the post's own title and category instead.
 * It is per-post, it is derived rather than invented, and it disappears the
 * moment real standfirsts are authored.
 *
 * The trailing dots are stripped first: six of the ten titles end in a typed
 * "..." or ".." baked into the Figma text node (content/blog.ts, defect 3),
 * which would otherwise collide with the sentence period that follows.
 */
function describe(post: BlogPost): string {
  if (post.standfirst) return post.standfirst;

  return `${post.title.replace(/\.+$/, "")}. ${post.category} on the Azza blog.`;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

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
     * NO `images` HERE, deliberately - see `open_questions`.
     *
     * `post.image.src` is a root-relative `/_next/static/media/…` path. Open
     * Graph requires an absolute URL, and Next resolves relative ones against
     * `metadataBase`, which is unset. It therefore falls back to
     * `http://localhost:3000` and bakes that host into the static HTML of all
     * ten article pages - a broken preview everywhere, plus a build warning on
     * every run. `metadataBase` belongs in `layout.tsx` next to the rest of the
     * site-wide metadata, and this agent does not own that file. Adding the
     * property there re-enables this block unchanged.
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
 * related rail, and supplies the route's single `<h1>` (`352:3685`). Site
 * chrome is `layout.tsx` + `SiteChrome`.
 *
 * The design draws this frame for exactly one article; the ten records in
 * `content/blog.ts` are the same layout with different data, which is why the
 * route is dynamic and statically generated rather than ten hand-written
 * pages.
 */
export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return <BlogArticle post={post} related={getRelated(slug)} />;
}
