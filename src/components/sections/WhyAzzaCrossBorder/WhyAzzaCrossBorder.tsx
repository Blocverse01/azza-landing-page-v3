import { Card, Reveal, Section } from "@/components/ui";

import { FeatureCard } from "./FeatureCard";

const HEADING_ID = "why-azza-cross-border-heading";

/**
 * The alt text is prescribed verbatim by assets.md S8 for
 * `product/phone-screen-whatsapp-transfer.webp`. Both mockups (553:298 and
 * 553:304) are the same file - md5-verified in assets.md S3 - so both carry
 * the same description.
 */
const SCREEN_ALT =
  "WhatsApp chat with Azza showing a completed withdrawal and a cross-border transfer confirmation";

/**
 * "Why Azza?" as it appears on the Cross Border Payments frame - Figma
 * `553:287`, and that node only.
 *
 * DECISIONS D-012: "Why Azza?" is FOUR structurally different components
 * across this file, not one component with four variants. This directory owns
 * exactly one of them and generalises over none of the others.
 *
 * Geometry (layout.md S4.5, responsive.md S7.3.2):
 *
 *   553:287  section   V, gap 48, py 80, container 1200
 *   553:288  card      1200 x 808, radius 24, surface.accent-violet, clipped
 *   553:289  inner     1056 x 664 - i.e. 72px of card padding all round
 *                      V, gap 40, align start
 *   553:290  heading   661 x 106, Inter Medium 48 / 1.1 / -0.03em
 *   553:291  row       H, gap 40, two 508 x 518 columns
 *
 * Server component. It holds no state, no handler and no browser API, so it
 * ships no client JavaScript of its own; `Reveal` is the one client boundary
 * and it is a shared primitive that owns its own directive.
 */
export function WhyAzzaCrossBorder() {
  return (
    <Section background="bg-surface-page" aria-labelledby={HEADING_ID}>
      <Card
        surface="accent-violet"
        radius="4xl"
        className="flex w-full flex-col items-start gap-10 overflow-hidden p-6 md:p-10 lg:p-18"
      >
        <Reveal className="w-full">
          <h2 id={HEADING_ID} className="text-5xl-tight text-fg-primary max-w-[661px]">
            Spend money effortlessly across borders.
          </h2>
        </Reveal>

        {/*
         * Tailwind's preflight strips list markers, which also strips list
         * semantics in Safari/VoiceOver. `role="list"` puts them back.
         */}
        <ul role="list" className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
          <FeatureCard
            label="Send funds with just a click."
            labelMeasure={400}
            screenAlt={SCREEN_ALT}
            bleed="bottom"
            index={0}
          />
          <FeatureCard
            label="Receive funds very fast, no matter where you are."
            labelMeasure={281}
            screenAlt={SCREEN_ALT}
            bleed="top"
            index={1}
          />
        </ul>
      </Card>
    </Section>
  );
}

export default WhyAzzaCrossBorder;
