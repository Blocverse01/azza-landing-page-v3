/*
 * WhyAzzaLanding - Figma 570:434, the landing page's "Why Azza?" section.
 *
 * SCOPE. D-012: "Why Azza?" is FOUR structurally different components across the
 * file, not one component with variants (570:434 / 553:287 / 412:2516 / 458:261
 * differ in child count, auto-layout direction and height for structural
 * reasons). This directory owns 570:434 and nothing else. Nothing in it
 * generalises over the other three.
 *
 * CLIENT. This file used to carry `"use client"` because it held "which feature
 * row is expanded". That state moved into `FeatureCycle` along with the cycle it
 * belongs to, so this is a server component again: it renders one client island
 * (`FeatureCycle`) and one already-client primitive (`Reveal`), and nothing else
 * in the section reaches the browser bundle.
 *
 * GEOMETRY (layout.md S4 / S7.5 - 570:434 has no auto-layout at all):
 *   heading      570:435  661 x 108  @ (120, 131)
 *   feature list 570:436  560 x 581  @ (188, 319)      text inset 68 from x=120
 *   marker       570:460   22 x  23  @ (120, 576)      on the container edge
 *   top fade     570:458  567 x 274  @ (108, 312)
 *   media panel  570:461  518 x 653  @ (802, 312)      right edge 1320
 * The 1200 container spans 120 - 1320, so the columns are 628 and 518 with 54px
 * of slack: `justify-between`, not a designed gap (layout.md S7.4). Both columns
 * are expressed as ratios of the container so `lg` scales rather than overflows.
 */

import { PhoneMockup, Reveal, Section } from "@/components/ui";

import { FeatureCycle } from "./FeatureCycle";
import { DEFAULT_FEATURE_ID, FEATURES } from "./FeatureList";

const HEADING_ID = "why-azza-landing-heading";

export function WhyAzzaLanding() {
  return (
    <Section
      id="why-azza"
      aria-labelledby={HEADING_ID}
      rhythm="standard"
      container="default"
      align="start"
      gap={48}
      clip
    >
      <Reveal index={0} className="w-full">
        {/*
         * h2, not h1 - this is the second section of the landing route and the
         * hero owns the page's only h1. typography.md S6 maps 570:435 to
         * `text-5xl` (48 / 1.13 / -0.03em / Medium 500), which clamps down to
         * 28px at the small end per components.md S11 C-1.
         * 661px is responsive.md S3's `--measure-narrow` for this node; the
         * token was never emitted into theme.css (reported in `findings`).
         */}
        <h2 id={HEADING_ID} className="max-w-[661px] text-5xl text-fg-primary">
          Your financial Super App inside WhatsApp
        </h2>
      </Reveal>

      <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:justify-between lg:gap-0">
        {/*
         * components.md S10.4 names "the Why-Azza feature list" as one of the
         * surfaces that gets the site's single entrance verb. One Reveal for the
         * list as a unit - S10.4 also rules out per-item entrances on rows
         * inside a group like this.
         */}
        <Reveal index={1} className="relative w-full lg:w-[52.33%]">
          {/*
           * The edge fades, 570:458 and its mirrored twin 570:459.
           *
           * components.md S11 C-5 ruled that only the top plate be built, on the
           * grounds that the list was static and nothing crossed the bottom edge.
           * The cycle changes that: rows now travel up and out of the top and in
           * from the bottom, so BOTH edges have traffic and both need to dissolve
           * it. Building only one would leave every incoming row popping into
           * existence against a hard bottom line.
           *
           * They also do the second job the cycle depends on - masking the one
           * discontinuity in the whole mechanism. The tripled track renormalises
           * by shifting a whole copy's height, and although that shift lands on a
           * pixel-identical picture, the rows nearest the edges are the ones with
           * least margin for error. Under 274px and 262px of fade they are all
           * but gone.
           *
           * `z-10` puts them over the rows but under the marker (`z-20`... the
           * marker is z-10 inside the viewport, which is a separate stacking
           * context, so it stays above these). responsive.md S7.2.2: the plates
           * are desktop-composition scaffolding and drop below `lg`.
           */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-[274px] bg-linear-to-b from-gradient-fade-from to-gradient-fade-to lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-[262px] bg-linear-to-t from-gradient-fade-from to-gradient-fade-to lg:block"
          />

          <FeatureCycle features={FEATURES} initialId={DEFAULT_FEATURE_ID} />
        </Reveal>

        {/*
         * The media panel, 570:461: a 518 x 653 surface.sunken plate that CLIPS
         * the handset - the phone is 709 tall and starts 11.93% down, so its
         * bottom third is cut off by design. Everything inside is a percentage of
         * the plate, so the whole composition scales as one instead of coming
         * apart at each breakpoint.
         */}
        <div className="relative aspect-[518/653] w-full max-w-[518px] shrink-0 overflow-hidden bg-surface-sunken lg:w-[43.17%]">
          <div className="absolute top-[11.93%] left-[16.6%] w-[66.83%]">
            {/*
             * 347 is the device-frame width measured off 570:464; it reproduces
             * 570:465's 314.3px screen exactly through PhoneMockup's 90.6% inset.
             * `maxWidth: 100%` inside the primitive lets it shrink with the
             * plate. Not `priority` - components.md S4.7 gives the landing
             * route's single above-the-fold raster to the QR code.
             */}
            <PhoneMockup
              screen="whatsapp-transfer"
              width={347}
              screenAlt="A WhatsApp conversation with Azza confirming a completed transfer of GHS 720."
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

export default WhyAzzaLanding;
