import { Button, DisplayHeading, Pill, Section } from "@/components/ui";
import { getRateTable } from "@/server/rates";

import { BuyCryptoWidget } from "./BuyCryptoWidget";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";

const HEADING_ID = "crypto-wallet-hero-heading";

/**
 * `/products/crypto-wallet` hero - 412:1587.
 *
 * The frame is absolutely composed: a 429-wide copy column at x 150 and the
 * 580-wide widget at x 710, inside a 1140 measure (layout.md S3.1). Rebuilt as
 * a grid rather than two absolute columns so it reflows - responsive.md S7.3.1
 * owns the stops:
 *
 *   base-sm   one column, copy then widget, widget full width
 *   md        still one column, widget capped at 580 and centred, art at 50%
 *   lg        two columns, minmax(0, 429fr) / 40px / minmax(0, 580fr)
 *   xl/2xl    the widget sits 70px above the copy (no QR badge - see the note
 *             at the foot of this component)
 *
 * VERTICAL PLACEMENT - corrected 2026-08-02. Every y below is FRAME-RELATIVE to
 * `412:1587`, which itself starts at page y 123 under the nav:
 *
 *   frame 412:1587   1440 x 972
 *   copy  412:1615   429 x 596 @ y 197   ->  bottom 793, 179 clear below
 *   widget 412:1626  580 x 650 @ y 127   ->  70 above the copy
 *
 * The previous build derived the widget lift as "widget top 127, section content
 * top 203" and shipped 76. 203 is PAGE-ABSOLUTE (123 nav + 80 padding) while 127
 * is frame-relative, so the two coordinate systems were subtracted from each
 * other. Two consequences, both measured in a browser: the lift was 6px too
 * large, and - far larger - the whole composition sat on the `standard` 80px
 * padding, putting the copy at y 80 (-117) and the widget at y 4 (-123). With
 * `xl:min-h-[972px]` holding the section at its designed height, the deficit
 * came out as ~120px of dead gradient below the CTA.
 *
 * `HeroCrossBorder` derives its identical-looking composition from `items-center`
 * with no magic numbers, and that was checked here first. It does not transfer:
 * in `412:1854` both columns are centred on the frame midline (367), whereas
 * here the copy centres on 495, the widget on 452 and the frame on 486 - three
 * different values. No `items-*` rule reproduces 197/127; the frame genuinely
 * stacks the two columns at absolute offsets. So the numbers below are the
 * design's own, snapped to the 4px scale in the idiom `HeroLanding` already uses
 * for its 173/97:
 *
 *   pt  197 -> `xl:pt-49` (196)      pb  179 -> `xl:pb-45` (180)
 *   lift 70 -> `xl:-mt-17.5`         196 + 596 + 180 = 972, the frame height
 *
 * THE FRAME'S 197/179/972 NO LONGER SHIP - CAPPED AT 96, at the operator's
 * request ("too much space between the nav bar and the content"). Measured
 * before: 196px of clear air between the nav's bottom edge and the eyebrow pill
 * at every width >= 1280, against 96px at `lg`. The `xl` step DOUBLED the gap,
 * which is what read as a void.
 *
 * It was faithful, and it stopped being right when the navbar changed. The frame
 * puts the copy 197 below a 123px-tall bar; this project's bar is now hug-height
 * at 89 (`--azza-nav-h`), so the same 197 no longer sits under enough visual mass
 * to justify itself - and the composition it was holding up, 972 tall, then ran
 * past the fold on any viewport shorter than ~880.
 *
 * 96 is not a new number: `lg:py-24` already carried it one breakpoint below, and
 * `HeroLanding` capped its own hero padding at 96 in 79ab214 for the same reason.
 * So this is three utilities DELETED rather than a fourth magic number invented,
 * and the ramp finally runs monotonically - 56/64/72/80/96, stop.
 *
 * `xl:min-h-[972px]` had to go WITH the padding, not after it. Its 972 is exactly
 * 196 + 596 + 180; leaving it while cutting 100px off the top would have held the
 * section at 972 and, under `align="start"`, dumped the whole 100px back out as
 * dead space below the CTA - the identical defect this docblock describes two
 * paragraphs up. The section is content-height now: 96 + 596 + 96.
 *
 * `xl:-mt-17.5` STAYS. The 70px lift is the relationship BETWEEN the two columns,
 * not the section's padding, and nothing about the nav or the fold changes it.
 *
 * No `Reveal` anywhere in here. This is the route's above-the-fold hero and its
 * <h1> is the LCP element - components.md S10.4 forbids an entrance on both.
 *
 * ASYNC, because the widget's rate table is resolved server-side and handed
 * down as a prop. That keeps the figures correct in the very first byte of HTML -
 * no loading state and no post-hydration correction inside the LCP element - and
 * it keeps `src/server/rates.ts` (which reads `process.env` and holds the admin
 * override) out of the client bundle entirely. `getRateTable` never throws and
 * never blocks on a third party for more than 2.5s; see its own notes.
 */
export async function HeroCryptoWallet() {
  const rates = await getRateTable();

  return (
    <Section
      rhythm="standard"
      container={1140}
      align="start"
      gap={0}
      clip
      aria-labelledby={HEADING_ID}
      className="relative lg:py-24"
    >
      <div className="grid w-full grid-cols-1 items-start gap-y-12 lg:grid-cols-[minmax(0,429fr)_minmax(0,580fr)] lg:gap-x-10 xl:gap-x-[131px]">
        {/* 412:1615 - V, gap 40 */}
        <div className="flex flex-col items-start gap-10">
          {/* 412:1616 - V, gap 32 */}
          <div className="flex flex-col items-start gap-8">
            {/* 412:1617 / 412:1618 */}
            <Pill variant="eyebrow">CRYPTO WALLET</Pill>

            {/* 412:1619 - V, gap 16 */}
            <div className="flex flex-col justify-center gap-4">
              {/*
               * 412:1620. `display-4-tight` (typography.md S4.1) and NO
               * `swapIndices` - this is one of the headlines that deliberately
               * does not carry the O-swap device (components.md S4.10).
               */}
              <DisplayHeading
                as="h1"
                id={HEADING_ID}
                step="display-4-tight"
                className="text-fg-primary"
              >
                Your all-in-one wallet, built for how money actually moves.
              </DisplayHeading>

              {/*
               * 412:1621. `fg.body-muted` is #353535 at 60% and fails AA at
               * 3.64:1. It ships as designed - D-018 / components.md S11 C-9
               * make that a design defect, not an implementation one, and a
               * local fix here would be invisible drift.
               */}
              <p className="text-fg-body-muted text-sm">
                Deposit, withdraw, buy, sell, swap, and spend &#8212; all in one place. No apps. No
                switching platforms. Just WhatsApp.
              </p>
            </div>
          </div>

          {/* 412:1622 - 193x56, soft brand fill, trailing arrow at 412:1624 */}
          <Button
            variant="soft"
            size="md"
            href={WHATSAPP_CHAT_URL}
            iconRight="arrow-right"
            className="w-full sm:w-auto"
          >
            Buy Crypto Now
          </Button>
        </div>

        {/*
         * 412:1626. The 70px lift is `412:1615`.y - `412:1626`.y = 197 - 127,
         * both frame-relative - the design's own offset between the two columns
         * and nothing else. It is a negative margin on a grid item under
         * `items-start`, so it also shrinks the widget's contribution to the row
         * (650 - 70 = 580 < the copy's 596): the row still measures 596 and the
         * section still closes at the designed 972.
         */}
        <div className="xl:-mt-17.5">
          <BuyCryptoWidget rates={rates} />
        </div>
      </div>

      {/*
       * NO QR BADGE ON THIS ROUTE - removed at the operator's request.
       *
       * `relative` stays on the <Section> above. It was originally there as the
       * badge's positioning context, but it is also what `clip` sits on, and every
       * other hero carries it. Dropping it would be an unrelated change to this
       * route's layout. (`HeroCrossBorder` DID drop its own `relative` with its
       * badge - it had no `clip` and nothing else positioned against it.)
       *
       * The other two heroes (landing, business) keep theirs.
       */}
    </Section>
  );
}

export default HeroCryptoWallet;
