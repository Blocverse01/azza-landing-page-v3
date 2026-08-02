import { ArticleCard, Button, Container, Reveal } from "@/components/ui";
import type { BlogPost } from "@/content/blog";

/*
 * RELATED ARTICLES - 352:3741, `V, gap 40` (layout.md S4.8).
 *
 * It is 1160 wide at x = -87.5 relative to the 985 article column: the block
 * deliberately BREAKS OUT wider than the article it follows (responsive.md
 * S7.5). That is why it is a sibling of the <article> inside a bleed section
 * rather than a child of the article container - an 1160 block cannot live
 * inside a 985 one.
 *
 * responsive.md S7.5 rules it an `<aside aria-labelledby>` outside the
 * `<article>`, and that is what it renders.
 */

const HEADING_ID = "related-articles";

export interface RelatedArticlesProps {
  posts: readonly BlogPost[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <aside
      aria-labelledby={HEADING_ID}
      /*
       * 120px above, from 352:3682's `V, gap 120`. It is padding rather than
       * margin because vertical rhythm lives in a block's own padding-block
       * (layout.md S10.3), and it rides responsive.md S4.3's stepped section
       * ramp - 56/64/72/80/96/design value - rather than holding 120 at 320.
       */
      className="xs:pt-16 w-full pt-14 sm:pt-18 md:pt-20 lg:pt-24 xl:pt-30"
    >
      <Container width="grid" className="flex flex-col gap-10">
        {/* 521:575 - 1160 x 46, H, SPACE_BETWEEN. */}
        <Reveal index={0} className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 352:3742 - text-2xl-related on fg.primary. */}
            <h2 id={HEADING_ID} className="text-2xl-related text-fg-primary">
              Related Articles
            </h2>

            {/*
             * 521:572 / 521:573 - a 129x46 `action.quiet` pill. The design
             * gives it no destination; /blog is the only page that lists
             * articles. Recorded in open_questions.
             *
             * `text-md!` is the label token 521:573 is authored in - Inter
             * Medium 20 / 1.3 / -0.6px, i.e. `text-md` exactly. `Button`'s `md`
             * step is `text-sm-btn` (16 Semi Bold), which is right for a button
             * and must not be widened: every other `size="md"` caller on the
             * site depends on that ladder. The `!` is load-bearing for the
             * reason BlogHero.tsx:84 documents - `cn` does not resolve
             * conflicts, so without it Tailwind's emission order would decide.
             *
             * The box already agrees with the design at this token: a 20px
             * Medium "View More" measures ~89px, and 89 + px-5 either side is
             * the authored 129. Only the height differs (h-12 = 48 against the
             * drawn 46), which is the 44px floor being kept.
             *
             * `Button` is kept rather than `Pill variant="cta"` - which carries
             * `text-md` natively - because this is an internal destination and
             * `Button` routes it through next/link. `Pill`'s href path emits a
             * bare <a>, which would cost a full document navigation.
             */}
            <Button
              variant="quiet"
              size="md"
              href="/blog"
              className="text-md!"
            >
              View More
            </Button>
          </div>
        </Reveal>

        {/*
         * 352:3743 - three 360-wide cards at gap 40. One column to `sm`, two at
         * `md`, three at `lg` (responsive.md S7.5), on S4.3's card-gap ramp
         * 20/24/28/32/40/40.
         */}
        <ul className="xs:gap-6 grid grid-cols-1 gap-5 sm:gap-7 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
          {posts.map((post, index) => (
            <Reveal key={post.slug} as="li" index={index + 1} className="flex min-w-0">
              <ArticleCard post={post} variant="grid" className="w-full" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </aside>
  );
}
