import { QrBadge } from "@/components/sections/QrBadge";
import { Button, Section } from "@/components/ui";

import { HeroHeadline } from "./HeroHeadline";

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
 * The hero is the one section whose padding is not a `SectionRhythm` value:
 * 173 / 97 rather than 80 / 80. `rhythm="standard"` supplies the stepped ramp
 * from base to `md` (56/64/72/80, responsive.md S4.3) and the two classes here
 * carry it on to 96 at `lg` and to the design value at `xl`. 173 and 97 are off
 * the 4px scale, so they land on the nearest steps - 172 (`pt-43`) and 96
 * (`pb-24`). Reported rather than hard-coded as arbitrary pixels.
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

/**
 * D-041, confirmed by the operator: 412:631's `07041900011` in the footer is the
 * WhatsApp number, in international form. One destination for every "Chat with
 * Azza" / "Get Started" CTA on the site.
 *
 * Held locally because no shared constants module is in this agent's allowlist.
 * Flagged for extraction in `open_questions`.
 */
const WHATSAPP_CHAT_URL = "https://wa.me/2347041900011";

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
      className="relative lg:py-24 xl:pt-43 xl:pb-24"
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
         */}
        <Button
          href={WHATSAPP_CHAT_URL}
          variant="primary"
          size="md"
          className="w-full md:w-auto"
        >
          {CTA_LABEL}
        </Button>
      </div>

      <QrBadge />
    </Section>
  );
}
