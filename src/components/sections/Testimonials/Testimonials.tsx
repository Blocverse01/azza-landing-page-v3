import portraitPlaceholder from "@design-system/assets/product/testimonial-portrait-placeholder.webp";

import { DisplayHeading, Reveal, Section } from "@/components/ui";
import { cn } from "@/lib/cn";

import { TestimonialCard } from "./TestimonialCard";

const HEADING_ID = "testimonials-heading";

/**
 * THE PORTRAIT IS A PLACEHOLDER, AND THE DESIGN FILE SAYS SO.
 *
 * 412:1069, 412:1077 and 412:1085 are the same 433x577 photograph of the same
 * person, in a Figma layer named "Profile, for now 4". D-020 rules that we ship
 * what the design contains: one asset, marked as placeholder in the code, with
 * no invented or sourced substitutes and no pretence that it is three people.
 *
 * The attribution reinforces it - all three cards name "Snow Olohijere". This
 * section is not three customers; it is one customer drawn three times.
 *
 * To fix: supply three real portraits (plus the subjects' consent), import them
 * here, and give each record its own `portrait` and `portraitAlt`. Nothing else
 * changes.
 */
const PLACEHOLDER_PORTRAIT = portraitPlaceholder;

/*
 * DOM order is VISUAL order, left to right: 242, 567, 892.
 *
 * The Figma layer order is 242, 892, 567 - it already diverges from its own
 * visual order (responsive.md S7.2.4). Transcribing the layer order would give
 * a single-column stack of 1, 3, 2: correct on desktop, wrong on every phone,
 * and invisible to anyone reviewing the desktop render. The desktop stagger is
 * produced by margin below, never by `order` or grid placement.
 *
 * Every string is transcribed verbatim, curly quotation marks included. Two of
 * the three cards carry the same quote; the middle one carries a title rather
 * than a quotation. Both are faithful to the source.
 */
const TESTIMONIALS = [
  {
    node: "412:1068",
    quote: "“Azza has impacted and helped me in so many ways.”",
    isQuotation: true,
    name: "Snow Olohijere",
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    node: "412:1084",
    quote: "My Amazing Experience using Azza",
    isQuotation: false,
    name: "Snow Olohijere",
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    node: "412:1076",
    quote: "“Azza has impacted and helped me in so many ways.”",
    isQuotation: true,
    name: "Snow Olohijere",
    portrait: PLACEHOLDER_PORTRAIT,
  },
] as const;

/**
 * "What People Say" - 412:1065, the landing page's testimonial row.
 *
 * LAYOUT (layout.md S4.3, responsive.md S7.2.4)
 *   section    772 tall, pad-top 80, pad-bottom 111, bg surface.subtle
 *   heading    662 x 135, centred, 140px display with the O-swap at index 7
 *   gap        64 from the heading to the topmost card
 *   row        container 955, three 305 x 319 cards, pitch 325 -> gap 20
 *   stagger    the MIDDLE card sits 63px higher
 *
 * The stagger is built as `margin-block-start` on the first and third cards
 * rather than a negative margin on the second. Both produce the same pixels,
 * but only this direction reproduces the measured boxes: the group bbox is
 * 955 x 382 (= 63 + 319) and the heading-to-cards gap is 64 measured to the
 * RAISED card, so the row's own box must start at the raised card's top. A
 * negative margin on the second child would make the row 319 tall and force a
 * meaningless 127px gap above it. Recorded as a finding against
 * responsive.md S7.2.4.
 *
 * The margin is a percentage of the grid area (63 / 305), so the stagger
 * ratio-scales with the card exactly as responsive.md asks.
 */
export default function Testimonials() {
  return (
    <Section
      rhythm="standard"
      container={955}
      align="center"
      /*
       * The measured heading-to-cards gap is 64. `SectionProps.gap` offers only
       * 0 | 48, so the section gap is switched off and the 64 is carried by the
       * row, stepped down on small screens where a 64px gap after a wrapped
       * 38px headline reads as a hole rather than as rhythm.
       */
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
           * "what people say" -> w0 h1 a2 t3 _4 p5 e6 o7 p8 l9 e10 _11 s12 a13
           * y14. Index 7 is the "o" of "people", which is the glyph the Figma
           * node splits out into its own Subjectivity/Medium segment. Confirmed
           * against the rendered text, not just the table.
           */
          swapIndices={[7]}
          swapWeight="medium"
          className="text-fg-primary text-center"
        >
          what people say
        </DisplayHeading>
      </Reveal>

      <ul
        className={cn(
          "mt-10 grid w-full list-none grid-cols-1 items-start justify-items-center gap-5",
          "sm:mt-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-3",
        )}
      >
        {TESTIMONIALS.map((testimonial, index) => (
          <Reveal
            key={testimonial.node}
            as="li"
            index={index + 1}
            className={cn(
              // base/xs: one column, max 360. sm: max 420. md+: fills its cell.
              "w-full max-w-[360px] sm:max-w-[420px] md:max-w-none",
              // 63 / 305 of the grid area. Only at `lg`, where the row is 3-up:
              // a stagger in a 2-up reads as misalignment, not rhythm.
              index === 1 ? undefined : "lg:mt-[20.6557%]",
            )}
          >
            <TestimonialCard
              quote={testimonial.quote}
              isQuotation={testimonial.isQuotation}
              name={testimonial.name}
              portrait={testimonial.portrait}
            />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
