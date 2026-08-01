import { PhoneMockup, Reveal, Section } from "@/components/ui";

/**
 * "Why Azza?" — the numbered getting-started block on /products/for-business.
 *
 * Figma `458:261` ONLY. It is a different component from `412:2516` next door
 * (DECISIONS D-012): different auto-layout axis, different palette, different
 * child count. Nothing is shared between the two files on purpose.
 *
 * Structure (layout.md S4.6, responsive.md S7.3.3):
 *
 *   458:261  section  H, gap 200, pad 100/0/100/0  -> Section rhythm="spotlight"
 *                     container-steps 1100 (500 + 200 + 400)
 *   458:262  left     500 x 430, V gap 48
 *   458:263  header   V gap 16 -> 458:264 h2 + 458:265 subcopy
 *   458:266  steps    V gap 24 -> three 500 x 71 rows
 *   458:267  row      pad 14/12 -> 16/12, gap 18 -> 16   (layout.md S1.3)
 *   458:268  numeral  58 x 43, pad 12, radius 8, 60% white outline
 *   458:279  phone    400 x 502, device clipped at 502   -> PhoneMockup
 *
 * The 01 / 02 / 03 numbering is a genuine sequence - an ordered setup process -
 * so it is an <ol> and not a <ul> (responsive.md S7.3.3).
 *
 * PhoneMockup is passed no `screen` prop, so it renders the redacted panel.
 * That is required, not an oversight: components.md S4.8 / DECISIONS D-019
 * quarantine `phone-screen-whatsapp-business.webp` because it carries a legible
 * real Nigerian account number. Dropping a scrubbed screenshot in and changing
 * one prop is the entire fix.
 *
 * Server component (components.md S3). Nothing here holds state.
 */

/** 458:264 — the section heading. A mid-page section never owns the page title. */
const HEADING = "How to get started with Azza Business.";

/** 458:265 */
const SUBCOPY = "Follow the steps below to set up your business on Azza.";

/**
 * 458:267 / 458:271 / 458:275, transcribed verbatim.
 *
 * All three labels really are the identical string in the source file. That is
 * a copy defect in the design, not a transcription slip - it is reproduced
 * as-designed and reported, in line with how every other source defect on this
 * run is handled (DECISIONS D-016).
 */
const STEPS = [
  { id: "458-267", numeral: "01", label: "Text the Azza bot on Whatsapp" },
  { id: "458-271", numeral: "02", label: "Text the Azza bot on Whatsapp" },
  { id: "458-275", numeral: "03", label: "Text the Azza bot on Whatsapp" },
] as const;

const HEADING_ID = "why-azza-business-steps-heading";

export default function WhyAzzaSteps() {
  return (
    <Section
      rhythm="spotlight"
      container={1100}
      gap={0}
      background="bg-surface-inverse"
      aria-labelledby={HEADING_ID}
    >
      {/*
       * The designed 200px column gutter (space-50) only fits once the content
       * box reaches its 1100 design width, which happens at `xl` where the
       * gutter ladder steps to 80 (1280 - 160 = 1120). At `lg` the box is 928,
       * and 500 + 200 + 400 would not fit - so the gutter steps up to its design
       * value at `xl`, exactly as every other property does in responsive.md
       * S4.3. The `lg` step of 64 is an invented rung, reported as such.
       */}
      <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-16 xl:gap-50">
        <div className="flex w-full max-w-125 flex-col gap-12">
          <Reveal className="flex flex-col gap-4">
            <h2 className="text-3xl-medium text-fg-on-inverse" id={HEADING_ID}>
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
                className="flex min-h-16 w-full items-center gap-4 overflow-hidden rounded-xl bg-surface-inverse-raised px-3 py-4"
              >
                {/*
                 * The ordinal is already carried by the <ol>, so the painted
                 * numeral is decorative - announcing "zero one" on top of
                 * "1 of 3" is noise, not information.
                 *
                 * `tabular-nums` is what keeps the three chips the same width.
                 * In the source only 458:268 is a fixed 58px box while 458:272
                 * and 458:276 hug their text; equal figure widths give all
                 * three the designed alignment with no magic number.
                 */}
                <span
                  aria-hidden="true"
                  className="flex shrink-0 items-center justify-center rounded-lg border border-line-on-inverse p-3 font-accent text-accent-step tabular-nums text-fg-on-inverse-muted"
                >
                  {step.numeral}
                </span>
                <span className="min-w-0 flex-1 text-lg text-fg-on-inverse">
                  {step.label}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>

        {/*
         * 458:279 is a 400 x 502 clipping frame over an 819-tall device, i.e.
         * the handset is deliberately cropped at the section's lower edge. The
         * aspect-ratio box reproduces that crop at every width instead of
         * pinning a height. Phone caps: 280 base-sm, 360 md, 400 lg+
         * (responsive.md S7.3.3). PhoneMockup's own `maxWidth: 100%` does the
         * shrinking, so `width` stays at the designed 400.
         */}
        <div className="aspect-[400/502] w-full max-w-70 shrink-0 overflow-hidden md:max-w-90 lg:max-w-100">
          <PhoneMockup width={400} />
        </div>
      </div>
    </Section>
  );
}
