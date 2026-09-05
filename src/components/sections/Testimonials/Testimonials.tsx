import { DisplayHeading, Reveal, Section } from "@/components/ui";

import { SuperPanel } from "./SuperPanel";
import { TweetMarquee } from "./TweetMarquee";

const HEADING_ID = "testimonials-heading";

/**
 * "What People Say" - Figma `861:312`, the 2026-09 operator revision that
 * replaces the three-portrait row of `412:1065`. The heading survives the
 * redesign byte-for-byte - same copy, same 140px display step, same O-swap on
 * the "o" of "people" - so `DisplayHeading` carries over unchanged.
 *
 * THE BAND. Two 600x580 panels forming one 1200 card at 1440 - the `default`
 * container, not the old section's 955 - sharing a single 36px (radius.6xl)
 * outline: the blue "SUPER FAST" stage on the left with its word cycle, the
 * white tweet marquee on the right. Each panel rounds only its outer corners,
 * so the seam between them is square and the pair reads as one object. Below
 * `lg` the panels stack, blue above white, and the rounding rotates with them:
 * top corners to the stage, bottom corners to the rail.
 *
 * The old `TestimonialCard` and its placeholder portrait ("Snow Olohijere",
 * D-020's one-customer-drawn-three-times finding) are retired with 412:1065 -
 * the redesign quotes twelve real posts instead.
 */
export default function Testimonials() {
  return (
    <Section
      rhythm="standard"
      container="default"
      align="center"
      /* The measured heading-to-band gap carries on the band, as before. */
      gap={0}
      background="bg-surface-subtle"
      aria-labelledby={HEADING_ID}
    >
      <Reveal className="w-full">
        <DisplayHeading
          as="h2"
          id={HEADING_ID}
          step="display-1"
          /*
           * "what people say" -> index 7 is the "o" of "people", the glyph
           * 861:315 splits into its own Subjectivity/Medium segment - the same
           * split 412:1066 made. Verified against the rendered text.
           */
          swapIndices={[7]}
          swapWeight="medium"
          className="text-fg-primary text-center"
        >
          what people say
        </DisplayHeading>
      </Reveal>

      <Reveal className="w-full" index={1}>
        <div className="mt-10 grid w-full grid-cols-1 overflow-clip sm:mt-12 lg:mt-16 lg:grid-cols-2">
          <SuperPanel className="rounded-t-6xl lg:rounded-l-6xl lg:rounded-t-none" />
          <TweetMarquee className="rounded-b-6xl lg:rounded-r-6xl lg:rounded-b-none" />
        </div>
      </Reveal>
    </Section>
  );
}
