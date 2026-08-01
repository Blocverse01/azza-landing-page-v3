import { Pill, Prose, Reveal, Section } from "@/components/ui";

/**
 * "Why Azza?" — the narrative block on /products/for-business.
 *
 * Figma `412:2516` ONLY. DECISIONS D-012 records that "Why Azza?" is four
 * structurally different components across the file, not one component with a
 * mode prop. This file is one of those four and shares nothing with the other
 * three - do not generalise it.
 *
 * Structure (layout.md S4.6, responsive.md S7.3.3):
 *
 *   412:2516  section   V, pad 80/0/80/0, centre     -> Section rhythm="standard"
 *   412:2517  group     846 x 665 @ x297             -> Section container={846}
 *   412:2518  eyebrow   143 x 34, pad 10/12          -> Pill variant="eyebrow"
 *   412:2520  prose     650 x 665 @ x493, V gap 20   -> Prose step="2xl-prose" gap={20}
 *   412:2521-2525       five paragraphs, verbatim
 *
 * The eyebrow -> prose gap of 53px is a sanctioned off-scale value: the group
 * carries no auto-layout to normalise it against, and layout.md S1.4 / S10 row
 * 15 both rule "keep". It is the only arbitrary length in this file.
 *
 * Server component (components.md S3). Nothing here holds state.
 */

/** 412:2519 — transcribed verbatim; `Pill` supplies the uppercase treatment. */
const EYEBROW = "WHY AZZA BUSINESS";

/**
 * 412:2521 - 412:2525, transcribed verbatim, in source order. Keys are the
 * Figma node ids so the copy stays traceable to the design during audit.
 */
const PARAGRAPHS = [
  {
    id: "412-2521",
    text: "Because modern businesses are no longer confined by borders.",
  },
  {
    id: "412-2522",
    text: "Today, teams hire globally, creators work with international clients, and companies pay vendors across different countries every single day.",
  },
  {
    id: "412-2523",
    text: "But moving money across borders still feels slower, harder, and more complicated than it should.",
  },
  {
    id: "412-2524",
    text: "We built Azza for Business to change that.",
  },
  {
    id: "412-2525",
    text: "Azza for Business helps businesses send, receive, and manage international payments with less friction and more confidence.",
  },
] as const;

const EYEBROW_ID = "why-azza-business-eyebrow";

export default function WhyAzzaNarrative() {
  return (
    <Section
      rhythm="standard"
      container={846}
      gap={0}
      background="bg-surface-page"
      aria-labelledby={EYEBROW_ID}
    >
      {/*
       * One Reveal for the whole block. components.md S10.4 permits entrances on
       * section headings and grids but explicitly NOT on body paragraphs, so the
       * five paragraphs are never staggered individually.
       */}
      <Reveal className="w-full">
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start lg:gap-[53px]">
          {/*
           * `Pill` takes no `id` prop and the contract forbids adding one, so the
           * wrapper carries the id that names the section. Its text content is
           * the pill's, which is exactly the accessible name we want.
           */}
          <div id={EYEBROW_ID} className="shrink-0 lg:mt-3.5">
            <Pill variant="eyebrow">{EYEBROW}</Pill>
          </div>

          {/*
           * measure={false} because this column caps at the designed 650, which
           * is tighter than the 842 reading measure - never wider.
           */}
          <Prose
            step="2xl-prose"
            gap={20}
            measure={false}
            className="min-w-0 max-w-[650px] flex-1"
          >
            {PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.id}>{paragraph.text}</p>
            ))}
          </Prose>
        </div>
      </Reveal>
    </Section>
  );
}
