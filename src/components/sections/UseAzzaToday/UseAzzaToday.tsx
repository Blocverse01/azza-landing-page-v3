import ctaCoins from "@design-system/assets/illustration/cta-coins-composition.svg";

import {
  Button,
  DisplayHeading,
  Media,
  Pill,
  Reveal,
  Section,
} from "@/components/ui";
import { WHATSAPP_CHAT_URL as WHATSAPP_HREF } from "@/content/navigation";

const HEADING_ID = "use-azza-today-heading";

/**
 * `UseAzzaToday` - the closing call to action on `/`. Figma `412:1233`.
 *
 * Server component (components.md S3). One route, one owner - it is in wave 2B
 * for dependency reasons only and must never be abstracted (components.md S2.3).
 *
 * GEOMETRY, measured at 1440 (layout.md S4.3, responsive.md S7.2.7):
 *
 *   section 412:1233   1440 x 1128, CTA wash gradient, pad-top 112 / pad-bottom 45.6
 *   pill    412:1292   146 x 48  @ y 112   "START NOW"
 *   gap     20
 *   block   412:1284   635 x 271 @ y 180, V gap 24, centred ((1440-635)/2 = 402.5)
 *     412:1285         heading + subcopy, V gap 0 - deliberately flush, the
 *                      display line-height carries the gap (layout.md S1.2 space-0)
 *     412:1286         "use azza today!" display-1, the O-swap device
 *     412:1287         subcopy, 529 wide
 *     412:1288         CTA 253 x 56
 *   art     412:1234   1069.9 x 615.4 @ (170, 467) - see the note on the slot below
 *
 * The vertical order is already badge -> text -> art in the design, so nothing
 * reorders at any breakpoint (responsive.md S7.2.7).
 */
export default function UseAzzaToday() {
  return (
    <Section
      aria-labelledby={HEADING_ID}
      rhythm="standard"
      container="default"
      /*
       * Section's own `gap` is the 48px heading -> body constant, which this
       * section does not use: its internal rhythm is 20 / 24 / 0 / 16. Set it to
       * 0 and let the blocks below own their own spacing.
       */
      gap={0}
      /*
       * The CTA wash - color.md S7. The one full-bleed gradient on the route:
       * linear-gradient(180deg, gradient.cta-from 0%, gradient.cta-to 100%).
       */
      background="bg-linear-to-b from-gradient-cta-from to-gradient-cta-to"
    >
      {/*
       * One entrance verb site-wide: fade up 16px (components.md S10.4). The
       * whole block arrives as a unit - S10.4 puts entrances on section
       * headings, not on every paragraph and button inside them. This section is
       * never above the fold, so the LCP carve-out does not apply.
       */}
      <Reveal className="flex w-full flex-col items-center gap-5">
        {/* 412:1292 - 146 x 48. `cta` is the variant components.md S4.4 names
            for exactly this node. */}
        <Pill variant="cta">START NOW</Pill>

        {/* 412:1284 - the 635 measure (responsive.md S3.2 `--measure-centered`),
            centred inside the 1200 container. */}
        <div className="flex w-full max-w-[635px] flex-col items-center gap-6 text-center">
          {/* 412:1285 - V gap 0. Flush by design; do not add a gap here. */}
          <div className="flex w-full flex-col items-center">
            {/*
             * 412:1286. The string is the verbatim authored source in its
             * original case - the uppercasing happens in CSS and in Bebas Neue
             * itself, so screen readers and copy/paste still get "use azza
             * today!" (typography.md S0.3, D-011).
             *
             * swapIndices is the AZZA O-swap device (typography.md S5): the "o"
             * of "today" is set in the accent face at Medium, balancing the
             * display weight. Index 10 is that "o" -
             * "use azza t" is characters 0-9. See the report finding on the
             * components.md S4.10 index.
             */}
            <DisplayHeading
              as="h2"
              id={HEADING_ID}
              step="display-1"
              swapIndices={[10]}
              swapWeight="medium"
              className="text-fg-primary"
            >
              use azza today!
            </DisplayHeading>

            {/*
             * 412:1287. Authored in Google Sans Flex, which is not licensable
             * for web use; typography.md S2.4 substitutes Inter Medium
             * 20 / 1.40 / -0.02em, i.e. `text-md-hero`.
             *
             * fg.body-muted is fg.body at 60%. It measures 3.52:1 against this
             * section's settled surface.muted end and fails AA (color.md
             * C-02b). It ships as designed per D-018 - a design defect, not an
             * implementation one, and not mine to repaint.
             *
             * 529 is the authored text box inside the 635 block; it is what sets
             * the two-line break at 1440.
             */}
            <p className="max-w-[529px] text-md-hero text-fg-body-muted">
              Azza is your all-in-one crypto solution built on WhatsApp, built to
              make crypto globally accessible.
            </p>
          </div>

          {/*
           * 412:1288 - 253 x 56, surface.brand-muted fill with an fg.brand
           * label, i.e. the `soft` action family (color.md S5). `lg` is the
           * size components.md S4.3 names for a 253 x 56 button.
           *
           * Full width to `sm` inclusive, intrinsic from `md`
           * (responsive.md S7.2.7 + S6.1).
           */}
          <Button
            href={WHATSAPP_HREF}
            variant="soft"
            size="lg"
            iconRight="arrow-right"
            className="w-full md:w-auto"
          >
            Text Azza on WhatsApp
          </Button>
        </div>
      </Reveal>

      {/*
       * 412:1234 - the decorative "AZ ZA" coin cluster, 1069.9 x 615.4 at
       * (170, 467).
       *
       * This slot was reserved and empty (the D-023 pattern) for as long as the
       * composition had no committed export: fifteen overlapping ellipse and
       * vector nodes, of which only `brand/wordmark-azza-outline.svg` had been
       * exported, and that mark is invisible on its own (its paths are filled
       * surface.brand-faint and need the indigo disc beneath them).
       *
       * `illustration/cta-coins-composition.svg` is that export, and it is the
       * whole band flattened into one file. design-system/assets.md S3 explains
       * why it is flat rather than six positioned pieces: the discs blend
       * against each other, and `mix-blend-mode` across sibling DOM nodes
       * resolves to the page backdrop instead. The file carries
       * `isolation:isolate` on its root group so the page can never leak into
       * that blend, and it is vector, so it stays crisp at all six stops
       * (1070x616 at 1440 down to 238x137 at 320) where a raster sized for 1440
       * would be soft below `lg`.
       *
       * RATIO. `1070/616` is the file's own viewBox and the node's own
       * 1069.9 x 615.4 - so `object-cover` crops nothing and nothing distorts.
       * The slot previously reserved 1069/615, a 0.07% difference, so this is a
       * zero-reflow change.
       *
       * Decorative throughout: `alt=""` plus `aria-hidden` on the wrapper, no
       * focusable child, contributing no accessible name. It is below the fold
       * on every viewport, so it stays lazy - no `priority`.
       *
       * No parallax, at any motion setting (components.md S10.9).
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-4 w-full max-w-[1069px]"
        data-figma-node="412:1234"
      >
        <Media
          src={ctaCoins}
          alt=""
          ratio="1070/616"
          sizes="(max-width: 1069px) 100vw, 1069px"
        />
      </div>
    </Section>
  );
}
