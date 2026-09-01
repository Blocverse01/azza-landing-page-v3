import { Prose, Section } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LegalDocument } from "@/content/legal";

import { LegalBody } from "./LegalBody";
import { LegalToc } from "./LegalToc";
import { LegalTocMobile } from "./LegalTocMobile";

/*
 * The shell both legal routes mount - `/privacy-policy` and `/terms-of-use`.
 *
 * ONE COMPONENT, TWO ROUTES. The documents differ only in their content: same
 * masthead, same two-column frame, same rail, same rhythm. A second component
 * would be the same file with two strings changed.
 *
 * THE FRAME. A `wide` (1280) container holding a two-column grid at `lg`+ -
 * an 18rem rail on the left, prose on the right, 64px between them. Below `lg`
 * it is one column with the rail collapsed into a disclosure above the copy.
 * The masthead is indented to the copy's left edge, not the page margin, so the
 * title sits above the document it titles rather than above the rail.
 *
 * THE TYPE RAMP was stepped down one token throughout (operator request,
 * 2026-09-01), which is why nothing here is on the step it was authored at:
 *
 *   page title   text-3xl        -> text-2xl          36 -> 32
 *   standfirst   text-lg-standfirst -> text-md         24 -> 20
 *   date         text-sm-meta    -> text-xs           16 -> 14
 *   section      text-xl-h2      -> text-lg           28 -> 24
 *   subsection   text-lg-h3      -> text-md-semibold  24 -> 20
 *   body         text-md-prose   -> text-base-answer  20 -> 18
 *   rail         text-sm-body    -> text-xs           16 -> 14
 *
 * MEASURE, AND THE ONE THING THAT GOT WORSE. The prose column is still capped
 * at `--container-prose` (842), the site's own reading measure, shared with
 * `/blog` and `/help`. That cap was tuned against the 20px step, where it lands
 * near 80 characters; at 18px the SAME 842px now runs about 90, which is past
 * the comfortable range. Measured in a browser, not estimated. The token is
 * site-wide and narrowing it here alone would fork the reading measure, so it
 * is left as it is and reported instead - the fix, if wanted, is a local cap
 * around 660px on this subtree.
 *
 * WHY THE TITLE IS NOT THE DISPLAY FACE. The study proposed Bebas Neue here.
 * `ArticleHeader` sets the site's other long-form title in the body face and a
 * legal document is that kind of page, not a hero - so the existing convention
 * wins over the proposal. The display face stays on the marketing routes, which
 * is what makes it read as voice rather than as decoration.
 */

export interface LegalPageProps {
  document: LegalDocument;
  /** Id of the route's single <h1>, so the section can name itself by it. */
  titleId: string;
}

export function LegalPage({ document: doc, titleId }: LegalPageProps) {
  const tocLabel = `${doc.title} contents`;

  return (
    <Section rhythm="flush" container="wide" align="start" gap={0} aria-labelledby={titleId}>
      {/*
       * `rhythm="flush"` plus an explicit padding-block, rather than
       * `rhythm="standard"`. The operator asked for the copy to start higher
       * once the eyebrow came off, and the top and bottom now want different
       * values - the bottom keeps the standard 56/64/72/80 ramp, the top runs
       * at roughly half. `SectionRhythm` has no asymmetric member and inventing
       * one for a single consumer would widen a shared contract; passing
       * `standard` and overriding `pt-*` from here is worse still, since `cn`
       * joins without merging and `py-20` + `pt-12` would both survive into the
       * class attribute with the cascade picking the winner.
       *
       * `--rail` and `--rail-gap` are declared here so the grid below and the
       * masthead's indent read the SAME two numbers. The masthead is aligned to
       * the copy, not to the page margin (operator request), which means its
       * indent must equal the rail column plus the gutter - and that is exactly
       * the sort of duplicated constant that drifts the first time either
       * changes.
       */}
      <div
        className={cn(
          "[--rail-gap:4rem] [--rail:18rem]",
          "flex w-full flex-col gap-10 lg:gap-12",
          "xs:pb-16 pt-8 pb-14 sm:pt-10 sm:pb-18 md:pt-12 md:pb-20",
        )}
      >
        {/*
         * ALIGNED TO THE COPY. The masthead used to start at the page margin,
         * which put the title above the rail rather than above the document it
         * titles. At `lg`+ it is indented by the rail column plus the gutter so
         * its left edge is the copy's left edge; below `lg` the rail is a
         * disclosure and there is nothing to align to, so the indent is absent.
         */}
        <header
          className={cn(
            /*
             * NO `w-full`. The parent is a `flex-col`, so this stretches to the
             * container's width already - and a literal `w-full` is 100% of
             * that container, which the `ms-` indent below then ADDS to,
             * overflowing by exactly the indent. It shipped that way for one
             * build and put a horizontal scrollbar on the page at 1024, where
             * the container is narrow enough for 352px of indent to matter.
             * Stretch subtracts the margin; `width: 100%` does not.
             */
            "flex max-w-(--container-prose) flex-col gap-5",
            "lg:ms-[calc(var(--rail)+var(--rail-gap))]",
          )}
        >
          <h1 id={titleId} className="text-fg-body text-2xl">
            {doc.title}
          </h1>

          <p className="text-md text-fg-caption">{doc.standfirst}</p>

          {/*
           * DEMOTED, DELIBERATELY. Interfere styles its "Last updated" line
           * exactly like body copy - same size, weight and colour - which
           * wastes the one piece of metadata a returning reader scans for. A
           * caption-weight <time> is both easier to find and machine-readable.
           */}
          <p className="text-fg-caption-soft text-xs">
            Effective from <time dateTime={doc.effectiveDate}>{doc.effectiveDateLabel}</time>
          </p>
        </header>

        <LegalTocMobile sections={doc.sections} label={tocLabel} className="lg:hidden" />

        {/*
         * RAIL LEFT, PROSE RIGHT (operator request, 2026-09-01 - it was drawn
         * the other way round, following interfere.com).
         *
         * The rail is FIRST IN THE DOM as well as first visually. Ordering it
         * with `lg:order-*` while leaving the prose first in source would put
         * the tab sequence out of step with the reading order - a keyboard user
         * would tab from the masthead past the whole document to reach a rail
         * sitting at the left margin. The cost of source order is that the rail
         * is 15 (or 20) tab stops ahead of the copy, which is the ordinary cost
         * of a sidebar and is what its `<nav>` landmark exists to let assistive
         * tech skip.
         */}
        <div className="grid grid-cols-1 gap-x-(--rail-gap) lg:grid-cols-[var(--rail)_minmax(0,1fr)]">
          {/*
           * The rail is `sticky` inside a grid item, which only works while
           * that item is not stretched to the row height - hence `self-start`.
           * Without it the column is as tall as the document and the rail has
           * nothing left to travel within, so it silently never sticks.
           *
           * `top` clears the sticky bar plus one 24px step of breathing room.
           */}
          <aside className="hidden self-start lg:sticky lg:top-[calc(var(--height-nav)+1.5rem)] lg:block">
            <LegalToc sections={doc.sections} label={tocLabel} />
          </aside>

          {/*
           * `Prose` carries the body ink, the measure and the inline-link
           * treatment; `LegalBody` supplies the structure inside it. Headings
           * are not `Prose`'s concern - it sets one step - so they take their
           * own from the scale.
           *
           * `gap` is passed as the contract's smallest value and spaces
           * nothing, because `Prose` gaps its DIRECT children and there is one.
           * The clause rhythm is composed inside `LegalBody` instead - the same
           * shape `ArticleBody` documents. It is NOT overridden to `gap-0` from
           * here: `cn` joins without merging, so `gap-5` and `gap-0` would both
           * survive into the class attribute and the cascade, not the call
           * site, would pick the winner.
           */}
          <Prose step="md-prose" gap={20} tone="prose" as="div">
            <LegalBody sections={doc.sections} />
          </Prose>
        </div>
      </div>
    </Section>
  );
}

export default LegalPage;
