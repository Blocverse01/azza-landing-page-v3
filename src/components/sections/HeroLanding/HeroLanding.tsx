import { QrBadge } from "@/components/sections/QrBadge";
import { Button } from "@/components/ui";

import { HeroBackdrop } from "./HeroBackdrop";
import { HeroHeadline } from "./HeroHeadline";
import { HeroOrnaments } from "./HeroOrnaments";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";

/**
 * The landing hero - 734:338, the redesigned first thing anyone sees on `/`.
 *
 * A server component. Nothing here holds state, listens for an event or touches
 * a browser API, so there is no `"use client"` anywhere in this directory
 * (components.md S3). The float motion is CSS, which is the whole reason it can
 * stay that way.
 *
 * WHAT REPLACED WHAT
 * ------------------
 * This supersedes 412:761. The white hero with flag coins wedged into the
 * headline is gone; 734:338 is a full-bleed blue stage with a layered disc
 * backdrop, a city skyline along the bottom, plain white type, and the coins
 * moved out to the corners as animated ornaments. `Section` is deliberately NOT
 * used: its contract is a rhythm ramp plus a centred `Container`, and this hero
 * is a fixed-height painted stage whose children are absolutely placed against
 * the design frame. Wrapping it would add a container it does not want and a
 * padding ramp it cannot use.
 *
 * LAYOUT - 734:338, verified against the frame
 * -------------------------------------------
 *   frame     1440 x 914, bg surface.hero-deep, clipped
 *   backdrop  759:315 three discs + 734:343 skyline   -> HeroBackdrop
 *   column    709 wide, centred; headline + 35 + subcopy
 *   CTA       734:369  182 x 51, "Chat with Azza"
 *   ornaments 734:350 / :359 / :371 / :372            -> HeroOrnaments
 *   QR        734:396  119 x 174 at top 517, right inset 120
 *
 * HEIGHT
 * ------
 * The frame is a flat 914, which on its own 1440x914 artboard means "one
 * screenful". `min-h-svh` up to a 914 cap at `2xl` says that continuously:
 * exactly 914 at the design frame, a full screenful below it, never taller than
 * drawn above it. Pinning 914 at `2xl` alone made the stage snap 250px on
 * crossing 1440 and left it so short at `lg` that the QR badge's drawn `top:
 * 517` fell outside the clip. `svh` rather than `dvh` so a retracting mobile URL
 * bar cannot resize the stage mid-scroll.
 *
 * WHY THE COLUMN IS CENTRED RATHER THAN PINNED TO y=180
 * ----------------------------------------------------
 * The frame draws the headline at y 180 and the CTA at y 745, both measured for
 * 164px type. This project serves `text-display-hero` at 75% of that (operator
 * request, 2026-08-04, applied at the token so every consumer follows), so the
 * headline block measures about 100px shorter than the frame's 413 and every
 * drawn y below it is stale. Pinning the drawn offsets would bank the content at
 * the top and leave a widening void above the skyline. Centring the column in
 * the space below the nav is self-correcting: it lands within ~13px of the
 * frame's own optical centre at the drawn size and stays balanced at any type
 * scale. The backdrop and the ornaments keep their absolute offsets - they are
 * anchored to the stage, not to the text.
 *
 * THE HERO SITS UNDER THE NAV
 * ---------------------------
 * 734:373 draws the top nav INSIDE the hero frame, over the blue. The bar is
 * `position: sticky`, so it occupies flow space; `-mt-(--azza-nav-h)` pulls this
 * section up by exactly that height to put the blue behind it, and the matching
 * `pt-(--azza-nav-h)` on the content column keeps the text out from under it.
 * `TopNav` reads the `data-azza-hero-overlay` hook below to go transparent while
 * it is over this stage. Nothing here hard-codes the bar's height, so the two
 * cannot drift apart.
 *
 * MOTION
 * ------
 * No `Reveal`: components.md S10.4 bars it from the <h1> of any route and from
 * anything above the fold, which is this entire section - it is the LCP element
 * and must paint immediately. The only motion is the ornaments' authored 3.1s
 * float, which is decorative, CSS-only, and gated on `prefers-reduced-motion`.
 */

const HEADING_ID = "hero-landing-heading";

/** 734:349, verbatim. */
const SUBCOPY =
  "Send, receive, and spend money across borders, instantly on WhatsApp. Crypto or local currency, without the usual stress.";

/** 734:370, verbatim - the drawn label is no longer "Get Started". */
const CTA_LABEL = "Chat with Azza";

export default function HeroLanding() {
  return (
    <section
      id="hero"
      aria-labelledby={HEADING_ID}
      data-azza-hero-overlay=""
      className="bg-surface-hero-deep relative -mt-(--azza-nav-h) flex min-h-svh w-full flex-col justify-start overflow-clip lg:justify-center 2xl:min-h-[914px]"
    >
      <HeroBackdrop />
      <HeroOrnaments />

      {/*
       * The content stage. `pt-(--azza-nav-h)` is the bar's own height, so the
       * column centres in the space BELOW the nav rather than behind it. The
       * bottom ramp carries the air on short viewports and drops to 0 at `2xl`,
       * where `min-h` plus the section's `justify-center` own the balance - a
       * bottom pad there would bank the column upward, away from the frame's
       * optical centre. Backdrop, ornaments and QR are all out of flow, so this
       * column is the only thing the section's flexbox lays out.
       *
       * `lg:-translate-y-[10vh]` - operator request (2026-08-11, revised same
       * day from 20vh): the whole content column (headline, subcopy, CTA)
       * rides 10vh above the flex centre described above. A transform, not a
       * margin, so the flow height the section centres against is untouched.
       *
       * PINNED, NOT CENTRED, ON PHONES (operator request 2026-09-05, with
       * screenshot): "let there be 64px from the nav bar and the header".
       * Below `lg` the section is `justify-start` and the column's top pad is
       * the bar plus exactly 4rem, so the gap is 64px on every phone rather
       * than whatever flex centring leaves on that screen's height - the
       * reported device parked the headline nearly touching the bar. From
       * `lg` the stage returns to the drawn centring.
       *
       * `lg:` SINCE THE INLINE QR ARRIVED (2026-09-05): with the badge under
       * the CTA the column fills a phone screen, and the 10vh ride pushed the
       * headline's first line under the sticky bar - measured top 80 against
       * a bar bottom of 85 at 390x844. The lift was drawn for the roomy
       * desktop stage; on phones the column now centres where flex puts it.
       */}
      <div className="xs:pb-16 relative flex flex-col items-center px-6 pt-[calc(var(--azza-nav-h)+4rem)] pb-14 sm:pb-18 md:pb-20 lg:-translate-y-[10vh] lg:pt-(--azza-nav-h) lg:pb-24 2xl:pb-0">
        {/*
         * 709 is 734:344's own width - the headline's measure, not a container
         * token. `max-w` rather than `w` so it shrinks with the viewport instead
         * of forcing a horizontal scrollbar below 709 + gutters.
         *
         * `gap-4`: operator request (2026-08-11), overriding the frame's drawn
         * 35 - a flat 16px between headline and subcopy, matching the 16px the
         * CTA wrapper below now carries.
         */}
        <div className="flex w-full max-w-[709px] flex-col items-center gap-4">
          <HeroHeadline id={HEADING_ID} />

          {/*
           * 586 wide at 1440 (734:349). `text-md-hero` is the existing 20/28
           * -0.4px step the previous hero already used for this exact node; only
           * the colour changes, to white on the blue stage.
           */}
          <p className="text-md-hero text-fg-on-brand mx-auto max-w-146 text-center">{SUBCOPY}</p>
        </div>

        {/*
         * 16px from the subcopy at every width: operator request (2026-08-11),
         * overriding the frame's drawn 61 (734:349 ends 684, 734:369 starts
         * 745). `w-full md:w-[182px]` is the same authored fixed width the
         * previous CTA carried and the frame still draws - 734:369 is `FIXED`
         * at 182 with 12px padding around an 112px label, so it does not hug.
         */}
        <div className="mt-4 flex w-full justify-center">
          <Button
            href={WHATSAPP_CHAT_URL}
            variant="primary"
            size="md"
            className="w-full md:w-[182px]"
          >
            {CTA_LABEL}
          </Button>
        </div>

        {/*
         * The QR card, under the CTA on phones (operator request 2026-09-05).
         * `inline` sits in the flow and self-hides at `lg`, where the floating
         * `landing` badge below takes the same job at the viewport's edge -
         * exactly one badge exists at any width. 24px off the CTA, one step
         * above the CTA's own 16, so the pair reads as button-then-aside.
         */}
        <QrBadge placement="inline" className="mt-6" />
      </div>

      <QrBadge placement="landing" />
    </section>
  );
}
