import { QrBadge } from "@/components/sections/QrBadge";
import { Button, Section } from "@/components/ui";

import { HeroHeadline } from "./HeroHeadline";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";

/**
 * The landing hero - 412:761, the first thing anyone sees on `/`.
 *
 * A server component. Nothing here holds state, listens for an event or touches
 * a browser API, so there is no `"use client"` anywhere in this directory
 * (components.md S3).
 *
 * LAYOUT - layout.md S4.3 row 2, verified against the frame
 * ---------------------------------------------------------
 *   section   1440 x 850, padding-top 173 / padding-bottom 97
 *   column    878 centred at x = 281, `V, gap 32`
 *   headline  412:1366  878 x 497
 *   subcopy   412:789   586 x 56
 *   CTA       412:1367  182 x 51, centred
 *   QR        412:884   119 x 174, absolutely floated at the section's right
 *
 * 878 is one of the seven one-off section widths `Container` takes as a literal
 * (components.md S4.2), so it needs no new token.
 *
 * The section supplies the positioning context for `QrBadge`, which
 * self-positions and hides itself below `lg` - a QR code cannot be scanned by
 * the device rendering it (responsive.md S7.1.2). It is rendered, never
 * rebuilt.
 *
 * VERTICAL RHYTHM
 * ---------------
 * The frame draws 173 / 97, but the drawn 173 was judged too tall in the built
 * page (operator request, 2026-08-04): the ramp now caps at 96 (`lg:py-24`)
 * instead of continuing to 172 at `xl`. `rhythm="standard"` supplies the
 * stepped ramp from base to `md` (56/64/72/80, responsive.md S4.3) and
 * `lg:py-24` carries both sides to 96 from `lg` up. 97 is off the 4px scale,
 * so the bottom lands on its nearest step, 96 - unchanged from the frame.
 *
 * MOTION
 * ------
 * None. components.md S10.4 bars `Reveal` from the <h1> of any route and from
 * anything above the fold at 1440x900, which is this entire section - it is the
 * LCP element and must paint immediately. The only transition on the page is
 * `Button`'s own, which already carries its reduced-motion branch inside the
 * primitive.
 */

const HEADING_ID = "hero-landing-heading";


/** 412:789, verbatim. */
const SUBCOPY =
  "Send, receive, and spend money across borders, instantly on WhatsApp. Crypto or local currency, without the usual stress.";

/** 412:1368, verbatim. */
const CTA_LABEL = "Get Started";

export default function HeroLanding() {
  return (
    <Section
      id="hero"
      aria-labelledby={HEADING_ID}
      rhythm="standard"
      container={878}
      gap={0}
      background="bg-surface-page"
      className="relative lg:py-24"
    >
      <div className="flex w-full flex-col items-center gap-8">
        <HeroHeadline id={HEADING_ID} />

        <p className="mx-auto max-w-146 text-center text-md-hero text-fg-body-muted">
          {SUBCOPY}
        </p>

        {/*
         * responsive.md S7.2.1: full width to `sm`, auto width and centred from
         * `md`. `Button`'s own `fullWidth` is a boolean, so the responsive pair
         * is expressed here.
         *
         * THE 182 IS AUTHORED, NOT DERIVED - which is why it lives here and not
         * in `Button`'s `md` step.
         *
         * 412:1367 is the ONLY CTA in the file whose frame is
         * `layoutSizingHorizontal: "FIXED"`. Its padding is 12px, well under
         * `md`'s px-5, and its label measures 86 - so hugging it would give
         * 12 + 86 + 12 = 110, not the drawn 182. The designer pinned the width
         * and let 36px of slack fall either side of a centred label. Every
         * other CTA in the file HUGS: the nav CTA is 144x43 = 16 + 112 + 16,
         * and "View More" is 129x46 = 16 + 97 + 16. So `md`'s padding is not
         * wrong for its other seven consumers and must not be widened to chase
         * this one node - `w-[182px]` reproduces an authored width, which is
         * what it actually is.
         *
         * Measured before: 124.52 x 48, centred on x=720. Of the 57.5px gap,
         * ~1.5px is font substitution (the label renders 84.52 against the
         * file's 86) and the remaining ~56px was the missing fixed width.
         * The 48 vs 51 height is `md`'s shared h-12 step and is left alone.
         */}
        <Button
          href={WHATSAPP_CHAT_URL}
          variant="primary"
          size="md"
          className="w-full md:w-[182px]"
        >
          {CTA_LABEL}
        </Button>
      </div>

      <QrBadge />
    </Section>
  );
}
