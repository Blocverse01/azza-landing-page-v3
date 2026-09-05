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

/*
 * THE HERO FRAME AND ITS CROP.
 *
 * 352:3706 is 985 x 600 and its fill is `cover`. The Figma fill transform is
 * `w-full max-w-none h-[131.33%] top-[-2.67%]`: the master is fitted to the
 * frame's WIDTH and cropped vertically, anchored 16px (2.67% of 599) below its
 * own top edge. 1400 / 1120 scaled to 985 wide is 788 tall, and 788 / 600 is
 * that 131.33% - the numbers close exactly.
 *
 * What shipped was `object-position: 50% 50%`. On the design's own artwork that
 * moves the cut 78px further down and slices the AZZA badge off the top of
 * every article; on the portrait master it removed the headline outright.
 * `object-top` is the token in `MediaProps["position"]` closest to the authored
 * anchor - 0% against the authored 8.5% of the crop, a 16px difference on a
 * 788px image - and it is the same ruling assets.md S6.2 already made for the
 * portrait master in the card slot: "so the headline survives".
 *
 * WHY THE RATIO IS A FLOOR RATHER THAN A CONSTANT. Anchoring the top fixes
 * every master that is TALLER than the frame, because the crop is vertical and
 * the subject is top-weighted. It cannot fix a master that is WIDER: the
 * featured post's banner is 2320 x 696 (3.33) and a 1.64 frame takes 51% of its
 * width out of the middle of a headline that spans the full file. The design
 * never draws that placement - 352:3706 is authored with the 1.25 master, and
 * the banner's only authored placement is the /blog featured card at its exact
 * 3.33 - so the faithful reading is that the frame never crops horizontally.
 * Taking the greater of the designed ratio and the master's own leaves all
 * three designed steps untouched for the nine posts that are taller than them,
 * and lets the one wide banner keep its own aspect, which is what it already
 * does correctly on /blog.
 */
/** The three designed steps, verbatim from components.md S4.7, and their values. */
const HERO_RATIO = [
  ["3/2", 3 / 2],
  ["16/9", 16 / 9],
  ["985/600", 985 / 600],
] as const satisfies ReadonlyArray<readonly [string, number]>;

function heroRatio(
  image: BlogPost["image"],
  [designed, value]: (typeof HERO_RATIO)[number],
): string {
  return image.width / image.height > value ? `${image.width}/${image.height}` : designed;
}

export interface BlogArticleProps {
  /** The full article - the card contract plus its body. */
  post: BlogPost & { contentHtml: string };
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
         * Ratio steps 985/600 -> 16/9 -> 3/2 and `sizes` are taken verbatim
         * from components.md S4.7; `heroRatio` only ever widens a step, and
         * only for a master already wider than it. `position="top"` is the
         * authored crop anchor. Both are explained above.
         *
         * assets.md S6.2 provisionally ruled centre cover acceptable here and
         * asked for it to be verified in Phase 3. It was, and it is not.
         */}
        <Media
          src={post.image}
          alt={post.imageAlt}
          ratio={heroRatio(post.image, HERO_RATIO[2])}
          ratioMd={heroRatio(post.image, HERO_RATIO[1])}
          ratioBase={heroRatio(post.image, HERO_RATIO[0])}
          position="top"
          placeholderColor={post.placeholderColor}
          sizes="(max-width:1023px) 100vw, 985px"
          radius="4xl"
          priority
        />

        <ArticleBody title={post.title} contentHtml={post.contentHtml} />
      </Container>

      <RelatedArticles posts={relatedPosts} />
    </Section>
  );
}
