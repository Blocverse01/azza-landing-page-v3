import { DisplayHeading } from "@/components/ui";

import { HeroCoin } from "./HeroOrnaments";

/**
 * The landing <h1> - 412:786 + 412:860.
 *
 * THE COPY, AND WHY IT LOOKS ODD
 * ------------------------------
 * Transcribed verbatim from the Figma text nodes:
 *
 *   412:788  "Your mONEY"                          <- authored mixed case
 *   412:863  "sh"  +  412:862  "uld w"  +  412:861  "rk"
 *   412:787  "anywhere. "                          <- trailing space trimmed
 *
 * Line 2 arrives in three fragments because the designer cut the word open to
 * wedge the flag coins into it. The complete sentence is reassembled here -
 * "Your mONEY should work anywhere." - because assets.md S4.1 requires the <h1>
 * to carry the whole string; a screen reader must never hear "sh uld w rk", and
 * neither must anyone who copies the headline.
 *
 * The mixed case of "mONEY" is the AUTHORED string and is preserved on purpose
 * (components.md S4.10). Uppercasing happens in CSS, and again in Bebas Neue,
 * which has no lowercase. Normalising it here would lose the source.
 *
 * THE O-SWAP
 * ----------
 * `swapIndices = [1]` - the lowercase "o" of "Your".
 * Y0 o1 u2 r3 _4 m5 O6 N7 E8 Y9.
 *
 * This was built as [6] first, because components.md S4.10 said [6]. The agent
 * that built it checked the source anyway and reported the disagreement: the
 * Figma node's middle segment is `font-['Subjectivity:Bold']` around the "o" of
 * "Your", and typography.md S5 says "the 1st `o`" and shows the worked example
 * `Y<span class="font-accent">o</span>ur mONEY`. Both agree on index 1.
 *
 * The orchestrator adjudicated to the file and corrected S4.10 (which had now
 * been wrong twice on this row: [5], then [6]). The device is explicitly NOT
 * automatic - S5 states that - so the index is whatever the node's own segment
 * split puts on the accent face, never the nearest "O".
 *
 * Lines 2 and 3 carry no `swapIndices`: 412:787 is on S4.10's explicit
 * do-not-swap list, and line 2's Os are coin ornaments, not accent glyphs.
 *
 * THE ORNAMENT LAYER
 * ------------------
 * Each line is wrapped in its own positioned <span>, so a coin's `top-1/2` is
 * the centre of that exact line box rather than an approximation of it. This
 * matters: line 1's box is ~8px taller than lines 2 and 3 at 1440 because the
 * accent-face swap span carries different vertical metrics, so splitting the
 * heading box into three equal rows would put every coin a few pixels low.
 *
 * PROGRESSIVE DISCLOSURE
 * ----------------------
 * responsive.md S7.2.1 drops the collage on small screens and restores it in
 * steps. Honoured as a count: base-sm shows the Nigeria disc only, `md` adds the
 * Kenya coin, `lg` restores all three. The artifact reaches that by relocating
 * discs to inline-blocks beside other words; that mechanic is not reproduced -
 * see the report's findings.
 */

const LINE_YOUR_MONEY = "Your mONEY";
const LINE_SHOULD_WORK = "should work";
const LINE_ANYWHERE = "anywhere.";

export interface HeroHeadlineProps {
  /** Wired to the section's aria-labelledby. */
  id: string;
}

export function HeroHeadline({ id }: HeroHeadlineProps) {
  return (
    <h1 id={id} className="w-full text-center font-display text-display-hero text-fg-primary">
      <span className="relative block">
        <DisplayHeading
          as="span"
          step="display-hero"
          swapIndices={[1]}
          swapWeight="bold"
          className="block"
        >
          {LINE_YOUR_MONEY}
        </DisplayHeading>
        <HeroCoin name="nigeria" />
      </span>

      <span className="relative block">
        <DisplayHeading as="span" step="display-hero" className="block">
          {LINE_SHOULD_WORK}
        </DisplayHeading>
        <HeroCoin name="ghana" className="hidden lg:block" />
        <HeroCoin name="kenya" className="hidden md:block" />
      </span>

      <DisplayHeading as="span" step="display-hero" className="block">
        {LINE_ANYWHERE}
      </DisplayHeading>
    </h1>
  );
}
