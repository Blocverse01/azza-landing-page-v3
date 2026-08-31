import { ArticleCard, DisplayHeading, Section, type BlogPost } from "@/components/ui";

const HEADING_ID = "blog-hero-title";

export interface BlogHeroProps {
  featured: BlogPost;
}

/**
 * `/blog` hero - Figma 802:774 "The Azza Blog", the 2026-08 operator revision
 * of 352:3582.
 *
 * THE REVISION REPLACED THE PANEL WITH A MASTHEAD. The original was a
 * 1280-wide lavender card holding "THE AZZA BLOG" at display-4 with an O-swap.
 * The revision drops the panel entirely - the section is bare `surface.page` -
 * and sets a full-column headline in its place:
 *
 *   802:854  column      1280 @ 80/80 padding      -> Section standard/wide
 *   802:832  <h1>        "CATCH THE LATEST WITH AZZA", display-masthead
 *                        (178.81 Lemon Semi Bold, lh 1.1, no O-swap), drawn to
 *                        fill the column on one line at 1440, cap-trimmed
 *   802:835  standfirst  24 Inter LIGHT, fg.caption-alt, full measure -
 *                        gap 16 under the headline
 *   802:853  featured    banner -> title -> meta row, gap 64 under the text -
 *                        ArticleCard variant="featured" owns its structure
 *
 * The headline's `text-box: trim-both cap alphabetic` is the frame's own
 * setting (802:832 measures 125 tall against a 197px line box) and is what
 * makes the drawn 16px gap to the standfirst real; the ExchangeWidget
 * precedent applies - progressive enhancement, looser in Firefox, never
 * broken.
 *
 * NO `Reveal` ANYWHERE IN THIS FILE, deliberately. components.md S10.4 excludes
 * the route's <h1> and anything above the fold at 1440x900 from the scroll
 * entrance - it is the LCP element and must paint immediately. The featured
 * banner is the one raster S4.7 marks `priority` on this route, for the same
 * reason. Adding an entrance here would animate the largest contentful paint.
 */
export function BlogHero({ featured }: BlogHeroProps) {
  return (
    <Section rhythm="standard" container="wide" gap={0} aria-labelledby={HEADING_ID}>
      <div className="flex w-full flex-col gap-16">
        <div className="flex w-full flex-col gap-4">
          <DisplayHeading
            as="h1"
            id={HEADING_ID}
            step="display-masthead"
            className="text-fg-primary w-full [text-box:trim-both_cap_alphabetic]"
          >
            CATCH THE LATEST WITH AZZA
          </DisplayHeading>

          {/* 802:835 - full measure, no cap: the revision widened the
              standfirst to the column (the original capped it at 627). */}
          <p className="text-lg-standfirst-light text-fg-caption-alt">
            Stay updated with the latest product releases, crypto tips, and insights from the Azza
            team.
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

        <ArticleCard post={featured} variant="featured" priority />
      </div>
    </Section>
  );
}
