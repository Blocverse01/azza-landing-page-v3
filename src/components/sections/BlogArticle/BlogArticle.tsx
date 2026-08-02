import { Container, Media, Section } from "@/components/ui";
import type { BlogPost } from "@/content/blog";

import { ArticleBody } from "./ArticleBody";
import { ArticleHeader } from "./ArticleHeader";
import { RelatedArticles } from "./RelatedArticles";

/*
 * THE ARTICLE SHELL - 352:3681, `V, gap 48, pad 80/0/80/0` inside
 * `container-article` 985 (layout.md S4.8).
 *
 * WHY THE SECTION CONTAINER IS `bleed` AND NOT `article`.
 * 352:3682 holds two blocks at `V, gap 120`: the 985-wide article body
 * 352:3683, and the related grid 352:3741, which is **1160 wide at x = -87.5**
 * and breaks out symmetrically past the article column (responsive.md S7.5).
 * An 1160 block cannot be nested inside a 985 one, so the section runs full
 * bleed and each block declares its own `Container` - `article` (985) and
 * `grid` (1160). Nesting one `Container` inside another would subtract the
 * gutter twice and narrow both.
 *
 * The 80/80 block padding is `Section rhythm="standard"`; the 120 between the
 * two blocks is the related block's own padding-top.
 */

/** The route's single <h1>. One instance per page, so a constant id is safe. */
const TITLE_ID = "article-title";

export interface BlogArticleProps {
  post: BlogPost;
  related: BlogPost[];
}

export function BlogArticle({ post, related }: BlogArticleProps) {
  /*
   * `getRelated` already excludes the current slug, but the route hands this
   * array in and the guarantee belongs where it is cheap to keep: an article
   * that lists itself as related is a dead end. Three cards, as 352:3743 draws.
   */
  const relatedPosts = related.filter((entry) => entry.slug !== post.slug).slice(0, 3);

  return (
    <Section rhythm="standard" container="bleed" gap={0} aria-labelledby={TITLE_ID}>
      {/*
       * 352:3683 - `V, gap 80, center`. The header and the body sit on the 842
       * reading measure; the hero image spans the full 985 column, which is
       * what `items-center` plus `w-full` on the media gives without a second
       * container.
       */}
      <Container
        as="article"
        width="article"
        className="xs:gap-16 flex flex-col items-center gap-14 sm:gap-18 md:gap-20"
      >
        <ArticleHeader post={post} titleId={TITLE_ID} />

        {/*
         * 352:3706 - 985 x 600, radius 24, `cover`. The hero is byte-identical
         * to the /blog featured card (assets.md S6.1), so it is `post.image`
         * rather than a second import. It is the one raster above the fold on
         * this route (components.md S4.7), hence `priority`.
         *
         * Ratio steps 985/600 -> 16/9 -> 3/2 and `sizes` are both taken
         * verbatim from components.md S4.7. Figma anchors the crop near the top
         * (-2.67% of an image scaled to 131.33%); assets.md S6.2 rules centre
         * cover acceptable here and that ruling is followed - reported as a
         * finding.
         */}
        <Media
          src={post.image}
          alt={post.imageAlt}
          ratio="985/600"
          ratioMd="16/9"
          ratioBase="3/2"
          placeholderColor={post.placeholderColor}
          sizes="(max-width:1023px) 100vw, 985px"
          radius="4xl"
          priority
        />

        <ArticleBody title={post.title} />
      </Container>

      <RelatedArticles posts={relatedPosts} />
    </Section>
  );
}
