import { PhoneMockup, Reveal, Section } from "@/components/ui";

/**
 * "Why Azza?" — the numbered getting-started block on /products/for-business.
 *
 * Figma `800:403` ONLY (the 2026-08 operator revision of `458:261`). It is a
 * different component from the narrative next door (DECISIONS D-012):
 * different auto-layout axis, different palette, different child count.
 * Nothing is shared between the two files on purpose.
 *
 * Structure (800:403, re-measured 2026-08-22 — the frame has no auto-layout;
 * everything below is absolute geometry inside the 1440 x 802 band):
 *
 *   800:404  left     500 x 424 @ (170, 189)  - 189 top, 189 bottom: centred
 *   800:405  header   V gap 16 -> 800:406 h2 (36) + 800:407 subcopy (16)
 *   800:408  steps    V gap 24 -> three 500 x 69 rows, gap to header 48
 *   800:409  row      pad 14/12, gap 18, radius 12, fill surface.inverse-raised
 *   800:410  numeral  58 x 41, pad 12, radius 8, fill surface.inverse-chip
 *   800:421  phone    464 x 698.32 @ (806, 104) - flush with the section's
 *                     BOTTOM edge, right edge on the 1100 container's edge
 *
 * What the revision changed against `458:261`: the numeral chip dropped its
 * 60% white outline for a solid `surface.inverse-chip` fill and full-white
 * figures; the row fill darkened to #202020 (tracked by `surface.
 * inverse-raised`, which only this component consumes); the row keeps its
 * authored pad 14/12 and gap 18 rather than the old normalisation to 16/12
 * and 16; and the phone grew from a 400 x 502 mid-band crop to a 464-wide
 * device cropped by the section's own bottom edge, now showing the real
 * business-onboarding chat (see PhoneMockup's D-019 note — the shipped asset
 * is scrubbed).
 *
 * GEOMETRY. `Section` is `flush` because the band's height is not padding
 * driven: the phone pins to the bottom edge (698 tall + 104 clearance = the
 * designed 802) while the left column centres against whatever that resolves
 * to — `items-center` + `lg:self-end` reproduce both without hard-coding the
 * band height. Below `lg` the phone stacks under the copy and stays flush
 * with the section's bottom, which is the same crop the design draws.
 *
 * The 01 / 02 / 03 numbering is a genuine sequence - an ordered setup process -
 * so it is an <ol> and not a <ul> (responsive.md S7.3.3).
 *
 * Server component (components.md S3). Nothing here holds state.
 */

/** 800:406 — the section heading. A mid-page section never owns the page title. */
const HEADING = "How to get started with Azza Business.";

/** 800:407 */
const SUBCOPY = "Follow the steps below to set up your business on Azza.";

/**
 * 800:409 / 800:413 / 800:417, transcribed verbatim.
 *
 * All three labels really are the identical string in the source file — still,
 * in the 2026-08 revision. That is a copy defect in the design, not a
 * transcription slip - it is reproduced as-designed and reported, in line with
 * how every other source defect on this run is handled (DECISIONS D-016).
 */
const STEPS = [
  { id: "800-409", numeral: "01", label: "Text the Azza bot on Whatsapp" },
  { id: "800-413", numeral: "02", label: "Text the Azza bot on Whatsapp" },
  { id: "800-417", numeral: "03", label: "Text the Azza bot on Whatsapp" },
] as const;

const HEADING_ID = "why-azza-business-steps-heading";

export default function WhyAzzaSteps() {
  return (
    <Section
      rhythm="flush"
      container={1100}
      gap={0}
      background="bg-surface-inverse"
      aria-labelledby={HEADING_ID}
    >
      {/*
       * The top padding ramp below `lg` is the `standard` rhythm's own ladder,
       * carried here because the section is `flush` (the phone owns the bottom
       * edge at every width, so no rhythm class fits). At `lg`+ the copy column
       * centres against the phone-driven 802 and needs no padding at the design
       * sizes; the left column's own `lg:py-20` is a guard for copy ever
       * outgrowing the phone, inert today (424 + 160 < 802). It sits on the
       * COLUMN, not this wrapper - here it would pad under the phone and break
       * the bottom-flush crop.
       *
       * `lg:justify-between` is the layout: left column on the container's left
       * edge, phone on its right edge, which at the 1100 design box resolves to
       * the drawn 136px gutter with no magic number. `gap` is the floor it
       * shrinks to at `lg`, where 500 + 464 outgrows the 928 box and flex
       * shrinks both.
       */}
      <div className="xs:pt-16 flex w-full flex-col items-center gap-12 pt-14 sm:pt-18 md:pt-20 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:pt-0">
        <div className="flex w-full max-w-125 flex-col gap-12 lg:py-20">
          <Reveal className="flex flex-col gap-4">
            {/*
             * The 411 cap is 800:406's own text box, and it is what produces
             * the designed break after "with" - at the column's full 500 the
             * browser fits "How to get started with Azza" on one line.
             */}
            <h2 className="text-3xl-medium text-fg-on-inverse max-w-[411px]" id={HEADING_ID}>
              {HEADING}
            </h2>
            <p className="text-sm-regular text-fg-on-inverse-body">{SUBCOPY}</p>
          </Reveal>

          {/*
           * `role="list"` is not redundant here: Tailwind's preflight sets
           * `list-style: none` on every <ol>, and Safari/VoiceOver drops list
           * semantics from an un-marked list. Without it the ordinal - the only
           * thing distinguishing three otherwise identical rows - is lost.
           */}
          <ol className="flex flex-col gap-6" role="list">
            {STEPS.map((step, i) => (
              <Reveal
                as="li"
                key={step.id}
                index={i + 1}
                className="bg-surface-inverse-raised flex w-full items-center gap-4.5 overflow-hidden rounded-xl px-3 py-3.5"
              >
                {/*
                 * The ordinal is already carried by the <ol>, so the painted
                 * numeral is decorative - announcing "zero one" on top of
                 * "1 of 3" is noise, not information.
                 *
                 * The chip is the design's fixed 58px box (800:410) - the
                 * design draws 01 narrower than 02/03, and the fixed width plus
                 * centring is what keeps the three labels aligned, replacing
                 * the old tabular-nums approach. The cap trim is the numeral's
                 * own `text-box` setting (58 x 41, not 43); a progressive
                 * enhancement per the ExchangeWidget note - untrimmed the chip
                 * runs 2px taller, never broken.
                 */}
                <span
                  aria-hidden="true"
                  className="bg-surface-inverse-chip font-accent text-accent-step text-fg-on-inverse flex w-14.5 shrink-0 items-center justify-center rounded-lg py-3 [text-box:trim-both_cap_alphabetic]"
                >
                  {step.numeral}
                </span>
                <span className="text-fg-on-inverse min-w-0 flex-1 text-lg">{step.label}</span>
              </Reveal>
            ))}
          </ol>
        </div>

        {/*
         * 800:421 - a 464 x 698.32 clipping frame over a 950-tall device: the
         * handset is deliberately cropped by the section's own bottom edge, at
         * 104px below the band's top at the design width (`lg:mt-26`,
         * `lg:self-end`). The aspect-ratio box reproduces the crop at every
         * width instead of pinning a height. Width caps: 280 base-sm, 360 md,
         * 400 lg, the drawn 464 at xl (the 1100 box only fits it from xl).
         * PhoneMockup's own `maxWidth: 100%` does the shrinking, so `width`
         * stays at the designed 465 (the device box is 464.913, drawn 1px
         * proud of its clip frame).
         *
         * `rasterShadow`: 800:422 is the 70% raster shadow layer, kept over
         * the CSS drop-shadow because the crop would clip a CSS shadow's
         * bottom lobe differently than the design's baked plate.
         */}
        <div className="aspect-[464/698.32] w-full max-w-70 shrink-0 overflow-hidden md:max-w-90 lg:mt-26 lg:max-w-100 lg:self-end xl:max-w-[464px]">
          <PhoneMockup
            width={465}
            rasterShadow
            screen="whatsapp-business"
            screenAlt="WhatsApp chat with the Azza bot: sending 'Business account' returns a Create Business Account button, and the bot replies with the new account's details."
          />
        </div>
      </div>
    </Section>
  );
}
