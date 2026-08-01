import { Card, PhoneMockup, Reveal } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface FeatureCardProps {
  /** The caption, transcribed verbatim from 553:294 / 553:305. */
  label: string;
  /**
   * The caption's measured measure in px - 400 on 553:294 (one line), 281 on
   * 553:305 (two lines). It is the measure that produces the designed line
   * break, so it is data rather than style and is passed in per instance.
   */
  labelMeasure: number;
  /** Alt text for the WhatsApp screenshot inside the device (assets.md S8). */
  screenAlt: string;
  /**
   * Which edge the device bleeds off at `lg`+.
   *
   *   "bottom" -> caption above the phone   553:292 / 553:293
   *   "top"    -> phone above the caption   553:299 / 553:300
   *
   * Below `lg` BOTH columns normalise to caption-then-phone (responsive.md
   * S7.3.2). Stacking while preserving each column's own order would produce
   * caption / phone / phone / caption - two device mockups adjacent with no
   * intervening text - and the alternation is a two-column visual device that
   * carries no meaning in a single column.
   */
  bleed: "bottom" | "top";
  /** Stagger position within the 2-up (components.md S10.4). */
  index?: number;
}

/*
 * The device deliberately overruns the card and is clipped by it - 553:292
 * shows the top half of the handset entering from below, 553:299 the bottom
 * half leaving through the top. The slot therefore carries the *visible*
 * aspect ratio and the mockup overflows it:
 *
 *   553:292  400 wide x 409 visible of an 818-tall device  (48 + 29 + 32 + 409 = 518)
 *   553:299  400 wide x 380 visible                        (380 + 32 + 58 + 48 = 518)
 *
 * Expressing the slot as a ratio rather than a fixed height is what lets the
 * same proportion survive every breakpoint: the slot tracks the phone's own
 * capped width (280 / 360 / 400 per responsive.md S7.3.2) with no per-stop
 * height to keep in sync.
 *
 * Both ratios are written out as whole literal class names. Tailwind v4 scans
 * source text, so a class assembled at runtime (`lg:${ratio}`) is never
 * generated.
 */

/**
 * One component, two instances - 553:292 and 553:299. Everything that differs
 * between the two columns is a prop; nothing about this file generalises over
 * the other three "Why Azza?" sections in the file (DECISIONS D-012).
 */
export function FeatureCard({
  label,
  labelMeasure,
  screenAlt,
  bleed,
  index = 0,
}: FeatureCardProps) {
  const bleedsTop = bleed === "top";

  return (
    <Reveal as="li" index={index} className="flex">
      <Card
        surface="accent-violet-subtle"
        radius="3xl"
        className={cn(
          "relative flex w-full flex-col items-center gap-8 overflow-hidden px-6 pt-12",
          // At lg+ the second column inverts: the caption drops to the foot of
          // the card and the device bleeds off the top instead of the bottom.
          bleedsTop ? "lg:flex-col-reverse lg:pt-0 lg:pb-12" : undefined,
        )}
      >
        <p
          className="text-lg-caption text-fg-body w-full text-center"
          style={{ maxWidth: labelMeasure }}
        >
          {label}
        </p>

        <div
          className={cn(
            "relative aspect-[400/409] w-full max-w-[280px] md:max-w-[360px] lg:max-w-[400px]",
            bleedsTop ? "lg:aspect-[400/380]" : undefined,
          )}
        >
          <div
            className={cn(
              "absolute inset-x-0 top-0",
              bleedsTop ? "lg:top-auto lg:bottom-0" : undefined,
            )}
          >
            <PhoneMockup screen="whatsapp-transfer" width={400} screenAlt={screenAlt} />
          </div>
        </div>
      </Card>
    </Reveal>
  );
}
