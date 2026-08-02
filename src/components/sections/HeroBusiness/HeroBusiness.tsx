import { QrBadge } from "@/components/sections/QrBadge";
import { Container, DisplayHeading, Pill, Section } from "@/components/ui";

import { BusinessHeroArt } from "./BusinessHeroArt";

/*
 * Azza For Business hero - Figma 412:2436 (1440 x 769).
 *
 * A white section with 80/80 padding wrapping a single 1280 x 609 lime card
 * (412:2437, radius 20) that holds a centred 718-wide text column and the
 * decorative map composition behind it.
 *
 * THE CARD IS A ONE-CELL GRID, and that is load bearing:
 *
 *   cell 1  an aria-hidden aspect keeper, `lg` and up only
 *   cell 1  the decorative art layer
 *   cell 1  the copy
 *
 * All three share `col-start-1 row-start-1`, so the row resolves to the tallest
 * of them. From `lg` up the aspect keeper holds the card at the designed
 * 1280:609 proportion whenever the copy is shorter than that - which is what
 * makes the composition pixel-faithful at 1440 - while still letting the card
 * grow if the copy ever needs more room. Below `lg` the keeper is absent and
 * the card is purely content-sized. A hard `min-height` would clip the headline
 * the moment a substitute font measures differently, and fonts are not loaded
 * until wave 2D.
 *
 * The QR badge is a SIBLING of <Section>, not a child of it: components.md S6
 * places it at `right: 82px; top: 488px` relative to the hero's positioning
 * context, which is the full 1440 hero box. Inside <Section> it would resolve
 * against the 1280 container instead and land 80px out. It self-hides below
 * `lg`.
 */

const HEADING_ID = "hero-business-heading";

/*
 * 412:2442, verbatim. The O-swap indices are zero-based into this exact string
 * (components.md S4.10, corrected 2026-08-01):
 *
 *   Y0 o1 u2 r3 _4 m5 O6 n7 e8 y9 _10 s11 h12 O13 u14 l15 d16 _17 w18 O19 ...
 *
 * All three land on an "o". Verified in a browser, not by counting alone - the
 * previous table was wrong on eight of nine rows and put the brand glyph on an
 * "h" here.
 */
const HEADLINE = "Your money should work anywhere.";
const HEADLINE_O_SWAPS = [6, 13, 19] as const;

export function HeroBusiness() {
  return (
    <div className="relative">
      <Section
        rhythm="standard"
        container="wide"
        gap={0}
        background="bg-surface-page"
        clip
        aria-labelledby={HEADING_ID}
      >
        <div
          data-node-id="412:2437"
          className="bg-surface-accent-lime relative isolate grid w-full grid-cols-1 overflow-clip rounded-3xl"
        >
          {/*
           * The aspect keeper. `grid-cols-1` and `self-start` are both load
           * bearing: without them this element is stretched to the row height,
           * which makes its height definite, which transfers back through
           * `aspect-ratio` into a MIN-WIDTH of height x 1280/609 and sizes the
           * auto column 25% too wide. Every absolutely-positioned decoration
           * then resolves its percentages against that wrong width. Caught in a
           * browser; it typechecks, builds and lints clean either way.
           */}
          <div
            aria-hidden="true"
            className="col-start-1 row-start-1 hidden w-full self-start lg:block lg:aspect-[1280/609]"
          />

          <BusinessHeroArt className="z-0 col-start-1 row-start-1" />

          <div className="relative z-10 col-start-1 row-start-1 flex flex-col items-center justify-center py-13">
            <Container width={718} className="flex flex-col items-center gap-10 text-center">
              <Pill variant="eyebrow">AZZA BUSINESS</Pill>

              <div className="flex w-full flex-col items-center gap-4">
                <DisplayHeading
                  as="h1"
                  id={HEADING_ID}
                  step="display-2"
                  swapIndices={HEADLINE_O_SWAPS}
                  swapWeight="light"
                  className="text-fg-display"
                >
                  {HEADLINE}
                </DisplayHeading>

                <p className="text-md-auto text-fg-body-muted max-w-lg">
                  Receive payments, move money across borders, and access USD with ease.
                </p>
              </div>
            </Container>
          </div>
        </div>
      </Section>

      <QrBadge />
    </div>
  );
}

export default HeroBusiness;
