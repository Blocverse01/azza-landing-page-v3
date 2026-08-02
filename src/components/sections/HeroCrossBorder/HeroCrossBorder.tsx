import { QrBadge } from "@/components/sections/QrBadge";
import { DisplayHeading, Pill, Section } from "@/components/ui";

import { ExchangeWidget } from "./ExchangeWidget";

const HEADING_ID = "hero-cross-border-title";

/**
 * `/products/cross-border-payments` hero - Figma `412:1854`.
 *
 * GEOMETRY. The design composes this frame absolutely (1440 x 734): copy
 * `412:1855` is 580 wide at x 120 / y 188.5, the widget `412:1861` is 580 wide
 * at x 740 / y 80, and 580 + 40 + 580 = 1200 is the clearest confirmation of
 * the default container in the whole file (responsive.md S7.3.2). Both columns
 * are centred on y 367 - the frame's own midline - so the two absolute offsets
 * fall straight out of `items-center` plus the standard 80/80 rhythm, with no
 * magic numbers: 80 + 574 + 80 = 734.
 *
 * This is the route's `<h1>`, at `display-3-bold` (typography.md S4.1).
 * `412:1859` is on components.md S4.10's list of headlines that contain an O
 * and deliberately do NOT carry the brand swap, so it passes no `swapIndices`.
 *
 * ENTRANCE. There is none, and that is the contract rather than an omission:
 * components.md S10.4 forbids `Reveal` on any route's `<h1>` or on anything
 * else above the fold at 1440x900, which is this entire section.
 */
export function HeroCrossBorder() {
  return (
    <Section
      rhythm="standard"
      container="default"
      align="start"
      gap={0}
      aria-labelledby={HEADING_ID}
      // The positioning context QrBadge anchors to. The badge self-positions at
      // right 82 / top 488 relative to the hero, which is measured off the
      // route frame: 1440 - (1239 + 119) = 82 and 612 - 123 = 489.
      className="relative"
    >
      <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* 412:1855 */}
        <div className="flex flex-col gap-8">
          <Pill variant="eyebrow">CROSS-BORDER PAYMENTS</Pill>

          {/* 412:1858 */}
          <div className="flex flex-col gap-4">
            <DisplayHeading as="h1" id={HEADING_ID} step="display-3-bold">
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
        <ExchangeWidget className="md:mx-auto md:max-w-[36.25rem]" />
      </div>

      {/*
       * The badge anchors to the SECTION's right edge (right 82), not to the
       * content container, so as the viewport narrows it walks inwards over the
       * widget while the widget's own right edge walks outwards. Verified in a
       * browser: at 1440 it covers 50px of the "Send now" button's right end -
       * which is exactly what `412:1829` renders, so that much is faithful - but
       * at 1024 it covers 154px, more than a third of the CTA.
       *
       * `QrBadge` itself unhides at `lg`. responsive.md S7.3.1 says the badge
       * "appears" at `xl`/`2xl` and is hidden below, so that rule is applied
       * here rather than inside a component four heroes share. One class, in my
       * own file, reversible.
       */}
      <div className="hidden xl:block">
        <QrBadge />
      </div>
    </Section>
  );
}

export default HeroCrossBorder;
