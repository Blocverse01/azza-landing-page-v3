import { QrBadge } from "@/components/sections/QrBadge";
import { Button, DisplayHeading, Pill, Section } from "@/components/ui";

import { BuyCryptoWidget } from "./BuyCryptoWidget";

const HEADING_ID = "crypto-wallet-hero-heading";

/**
 * The design gives this CTA no destination - no prototype link, no annotation.
 * AZZA is a WhatsApp-only product ("No apps. No switching platforms. Just
 * WhatsApp." is this hero's own subcopy), so WhatsApp is the faithful reading,
 * and the number is the one confirmed by the operator in D-041 from the footer
 * node 498:631. It is transcribed, never invented.
 *
 * This duplicates a run-level constant that has no home I am permitted to
 * import - see `open_questions`. It belongs in `src/lib/site.ts` alongside the
 * other infrastructure values, once one agent owns that edit.
 */
const WHATSAPP_CHAT_URL = "https://wa.me/2347041900011";

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
 *   xl/2xl    as designed - the widget sits 76px above the copy, QR appears
 *
 * The 76px lift is the design's own offset (widget top 127, section content top
 * 203 under the standard rhythm) and is applied only where the two-column
 * composition is at its designed measure.
 *
 * No `Reveal` anywhere in here. This is the route's above-the-fold hero and its
 * <h1> is the LCP element - components.md S10.4 forbids an entrance on both.
 */
export function HeroCryptoWallet() {
  return (
    <Section
      rhythm="standard"
      container={1140}
      align="start"
      gap={0}
      clip
      aria-labelledby={HEADING_ID}
      className="relative xl:min-h-[972px]"
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
              <p className="text-sm text-fg-body-muted">
                Deposit, withdraw, buy, sell, swap, and spend &#8212; all in one
                place. No apps. No switching platforms. Just WhatsApp.
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

        {/* 412:1626 */}
        <div className="xl:-mt-19">
          <BuyCryptoWidget />
        </div>
      </div>

      {/*
       * 511:464. Self-positions against the nearest positioned ancestor, which
       * is why this <section> carries `relative`, and hides itself below `lg` -
       * a QR code cannot be scanned by the device rendering it.
       */}
      <QrBadge />
    </Section>
  );
}

export default HeroCryptoWallet;
