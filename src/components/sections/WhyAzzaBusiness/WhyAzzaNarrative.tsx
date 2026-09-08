import { Pill, Section } from "@/components/ui";

import { NarrativeReveal } from "./NarrativeReveal";

/**
 * "Why Azza?" — the narrative block on /products/for-business.
 *
 * Figma `800:393` ONLY (the 2026-08 operator revision of `412:2516`).
 * DECISIONS D-012 records that "Why Azza?" is four structurally different
 * components across the file, not one component with a mode prop. This file is
 * one of those four and shares nothing with the other three - do not
 * generalise it.
 *
 * Structure (800:393, re-measured 2026-08-22):
 *
 *   800:393  section   V, pad 120/0/120/0, centre    -> Section rhythm="deep"
 *   800:532  group     881 x 667 @ x279.5, H gap 48  -> Section container={881}
 *   800:395  eyebrow   183 x 39, pad 10/12, 16px     -> Pill variant="eyebrow-md"
 *   800:397  prose     650 x 667, V gap 48           -> Prose gap={48}
 *   800:398-402         five paragraphs, verbatim
 *
 * What the revision changed against `412:2516`: section padding 80 -> 120,
 * eyebrow type 12 -> 16 (at the authored -4% tracking - see
 * `--text-sm-eyebrow`), eyebrow -> prose gap 53 -> 48, and paragraph gap
 * 20 -> 48 measured cap-to-cap: every paragraph in `800:397` carries
 * `text-box: trim-both cap alphabetic`, so the 48 is between one paragraph's
 * baseline and the next one's cap height. The trim is reproduced below and is
 * load-bearing for both the gap and the eyebrow alignment; where `text-box` is
 * unsupported (Firefox) the block reads ~22px looser and the pill sits ~14px
 * above the first cap - looser, never broken - exactly the ExchangeWidget
 * precedent.
 *
 * THE SCROLL REVEAL (operator request, 2026-09-08). The block sits on a
 * sticky stage inside a tall track and its words light up in reading order
 * as the page scrolls - `NarrativeReveal` owns the mechanic and its own
 * header explains it. This file stays a server component; the client
 * boundary is the reveal, which takes the paragraphs as data and the pill as
 * a node; the container and its measurements are still declared here.
 *
 * The one-block `Reveal` entrance that used to wrap this is gone: the words
 * arriving IS the entrance now, and two verbs on one block would fight.
 */

/** 800:396 — transcribed verbatim; `Pill` supplies the uppercase treatment. */
const EYEBROW = "WHY AZZA BUSINESS";

/**
 * 800:398 - 800:402, transcribed verbatim, in source order. Keys are the
 * Figma node ids so the copy stays traceable to the design during audit.
 */
const PARAGRAPHS = [
  {
    id: "800-398",
    text: "Because modern businesses are no longer confined by borders.",
  },
  {
    id: "800-399",
    text: "Today, teams hire globally, creators work with international clients, and companies pay vendors across different countries every single day.",
  },
  {
    id: "800-400",
    text: "But moving money across borders still feels slower, harder, and more complicated than it should.",
  },
  {
    id: "800-401",
    text: "We built Azza for Business to change that.",
  },
  {
    id: "800-402",
    text: "Azza for Business helps businesses send, receive, and manage international payments with less friction and more confidence.",
  },
] as const;

const EYEBROW_ID = "why-azza-business-eyebrow";

export default function WhyAzzaNarrative() {
  return (
    <Section
      rhythm="deep"
      container={881}
      gap={0}
      background="bg-surface-page"
      aria-labelledby={EYEBROW_ID}
    >
      {/*
       * `Pill` takes no `id` prop and the contract forbids adding one, so the
       * wrapper carries the id that names the section. Its text content is the
       * pill's, which is exactly the accessible name we want.
       *
       * No top-margin compensation: 800:532 top-aligns the pill with the prose
       * column, and the paragraphs' cap trim is what makes the first cap land
       * at the column's top edge. The old `lg:mt-3.5` existed to chase the
       * untrimmed ascender space and would now double-shift.
       */}
      <NarrativeReveal
        paragraphs={PARAGRAPHS}
        aside={
          <div id={EYEBROW_ID} className="shrink-0">
            <Pill variant="eyebrow-md">{EYEBROW}</Pill>
          </div>
        }
      />
    </Section>
  );
}
