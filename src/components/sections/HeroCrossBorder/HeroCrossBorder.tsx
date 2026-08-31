import { DisplayHeading, Pill, Section } from "@/components/ui";
import { getRateTable } from "@/server/rates";

import { ExchangeWidget } from "./ExchangeWidget";

const HEADING_ID = "hero-cross-border-title";

/**
 * `/products/cross-border-payments` hero - Figma `412:1854`, recomposed at
 * `782:563`.
 *
 * GEOMETRY - REVISED. The frame is still 1440 x 734 with a 1200 measure (copy
 * 580 at x 120, widget 580 at x 740, 580 + 40 + 580 = 1200: responsive.md
 * S7.3.2's clearest confirmation in the file). What moved is the vertical
 * placement, and the two columns no longer share it:
 *
 *   copy   412:1855   580 x 357  @ y 107   (was y 188.5, the frame midline)
 *   widget 782:563    580 x 663  @ y 36    (centred: (734 - 663) / 2 = 35.5)
 *
 * So the widget is still centred and the COPY is not any more - it is pinned near
 * the top. That is the operator's note about how close both sit to the top of the
 * screen, and it is why `items-center` on the row had to go.
 *
 * Expressed without magic numbers: the section's padding brackets the WIDGET,
 * which is both centred and the taller column, and the copy takes one additive
 * nudge to reach its own offset.
 *
 *   py 36  ->  `lg:py-9`        36 + 663 + 36 = 735, the frame's 734 to 1px
 *   copy   ->  `lg:mt-18` (72)  36 + 72 = 108, the frame's 107 to 1px
 *
 * Both land on the 4px scale, in the idiom `HeroCryptoWallet` uses for its own
 * inter-column offset. 36px of padding is far tighter than the `standard` rhythm
 * this section keeps below `lg`, and deliberately so: below `lg` the columns
 * stack and the hero is an ordinary section, while from `lg` it is the designed
 * two-column composition that hugs the bar.
 *
 * This is the route's `<h1>`, at `display-3-bold` (typography.md S4.1) - which is
 * already exactly the frame's 128px / Bold / leading-1 / -0.01em, so the redesign
 * changed its position and nothing else. `412:1859` is on components.md S4.10's
 * list of headlines that contain an O and deliberately do NOT carry the brand
 * swap, so it passes no `swapIndices`.
 *
 * ASYNC, because the widget's rate table is resolved server-side and handed down
 * as a prop - the same wiring as `HeroCryptoWallet`. It keeps the figures right
 * in the first byte of HTML and keeps `server/rates.ts`, which reads
 * `process.env`, out of the client bundle.
 *
 * ENTRANCE. There is none, and that is the contract rather than an omission:
 * components.md S10.4 forbids `Reveal` on any route's `<h1>` or on anything
 * else above the fold at 1440x900, which is this entire section.
 */
export async function HeroCrossBorder() {
  const rates = await getRateTable();

  return (
    <Section
      rhythm="standard"
      container="default"
      align="start"
      gap={0}
      aria-labelledby={HEADING_ID}
      className="lg:py-9"
    >
      <div className="grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-2">
        {/* 412:1855 - see the geometry note for the `lg:mt-18` nudge. */}
        <div className="flex flex-col gap-8 lg:mt-18">
          <Pill variant="eyebrow">CROSS-BORDER PAYMENTS</Pill>

          {/* 412:1858 */}
          <div className="flex flex-col gap-4">
            {/*
             * `text-fg-primary` (#1E1E1E) - 412:1859 draws #1A1A1A and this
             * heading was inheriting `fg.body` (#353535) from the page, a
             * pre-existing drift measured in the browser while implementing the
             * redesign. There is no #1A1A1A foreground token and adding one for a
             * 4-unit delta would be noise; `fg.primary` is the token every other
             * hero headline uses, `HeroCryptoWallet` included.
             */}
            <DisplayHeading
              as="h1"
              id={HEADING_ID}
              step="display-3-bold"
              className="text-fg-primary"
            >
              Your financial passport.
            </DisplayHeading>
            <p className="text-fg-body-muted text-sm">
              Make payments globally with your local currency — wherever you are.
            </p>
          </div>
        </div>

        {/*
         * responsive.md S7.3.2: full width to `sm`, capped at the designed 580
         * and centred at `md`, then the right half of the two-column grid from
         * `lg`. 36.25rem is the design's own 580 - `layout.md` tokenises no
         * container at that width, and the nearest named step (`narrow`, 661)
         * would overshoot it by 81px.
         */}
        <ExchangeWidget rates={rates} className="md:mx-auto md:max-w-[36.25rem]" />
      </div>

      {/*
       * NO QR BADGE ON THIS ROUTE - removed at the operator's request, as on
       * `/products/crypto-wallet`.
       *
       * `relative` came off the <Section> with it. Unlike the crypto-wallet hero
       * - where it also underpins `clip` and `xl:min-h-[972px]` and therefore
       * stays - the badge was its ONLY purpose here, and `ExchangeWidget` has no
       * absolutely-positioned descendant to re-anchor. Checked before removing it.
       *
       * Also gone with it: a real overlap defect this hero had documented rather
       * than fixed. The badge anchored to the SECTION's right edge while the
       * widget's right edge walked outwards as the viewport narrowed, so it
       * covered 50px of the "Send now" CTA at 1440 (which `412:1829` does draw)
       * and 154px of it - over a third - at 1024.
       *
       * The landing and business heroes keep their badge.
       */}
    </Section>
  );
}

export default HeroCrossBorder;
