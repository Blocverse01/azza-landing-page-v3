import {
  ArticleCard,
  DisplayHeading,
  Section,
  type BlogPost,
} from "@/components/ui";

const HEADING_ID = "blog-hero-title";

export interface BlogHeroProps {
  featured: BlogPost;
}

/**
 * `/blog` hero - Figma 352:3582.
 *
 * A 1280-wide lavender panel (352:3583, radius 20, surface.brand-subtle)
 * holding a 1160 content column (352:3584): the route's <h1>, the standfirst,
 * and the featured article card.
 *
 * NO `Reveal` ANYWHERE IN THIS FILE, deliberately. components.md S10.4 excludes
 * the route's <h1> and anything above the fold at 1440x900 from the scroll
 * entrance - it is the LCP element and must paint immediately. The featured
 * banner is the one raster S4.7 marks `priority` on this route, for the same
 * reason. Adding an entrance here would animate the largest contentful paint.
 *
 * THE O-SWAP. `swapIndices={[11]}` is the "O" of BLOG, counting from zero
 * through "THE AZZA BLOG" including both spaces (T0 H1 E2 _3 A4 Z5 Z6 A7 _8 B9
 * L10 O11 G12). Verified against the rendered text, not just the table:
 * components.md S4.10's original value of [10] landed on the L.
 */
export function BlogHero({ featured }: BlogHeroProps) {
  return (
    <Section
      rhythm="standard"
      container="wide"
      gap={0}
      aria-labelledby={HEADING_ID}
    >
      <div
        className={[
          "w-full overflow-clip rounded-3xl bg-surface-brand-subtle",
          // 60/66 at 1440 (1280 panel around a 1160 column, 866 around 734).
          // Everything below xl is derived - the design has no sub-1440 frames.
          "px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14 xl:px-15 xl:py-16",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-grid flex-col gap-10">
          <div className="flex flex-col gap-4">
            <DisplayHeading
              as="h1"
              id={HEADING_ID}
              step="display-4"
              swapIndices={[11]}
              swapWeight="bold"
              className="text-fg-primary"
            >
              THE AZZA BLOG
            </DisplayHeading>

            {/* 352:3587 - 627 wide at 1440. No token carries 627; the two
                measure tokens that exist are 661 and 635, and substituting
                either would silently move the line break. */}
            <p className="max-w-[627px] text-lg-standfirst text-fg-caption-alt">
              Stay updated with the latest product releases, crypto tips, and
              insights from the Azza team.
            </p>
          </div>

          {/*
            `ArticleCard` renders its title as an <h3>. Without this the outline
            runs h1 -> h3 with nothing between, which is a skipped level on the
            route's only above-the-fold heading. The design has no visible label
            for the featured slot, so the level that closes the gap is not
            painted. `sr-only` is out of flow and consumes no gap.
          */}
          <h2 className="sr-only">Featured article</h2>

          {/*
           * `ArticleCard` paints `surface.page` (white). On this lavender panel
           * that reads as a white slab behind the banner gap and the meta
           * block, which the design does not have - 352:3590 sits directly on
           * 352:3583's fill. The card surface is not a prop, so the override
           * goes through `className`, which is. The `!` is load-bearing: `cn`
           * joins and de-duplicates but does not resolve conflicts, so without
           * it the winner would be decided by Tailwind's own utility ordering
           * rather than by this file.
           */}
          <ArticleCard
            post={featured}
            variant="featured"
            priority
            className="bg-transparent!"
          />
        </div>
      </div>
    </Section>
  );
}
