import Image from "next/image";
import type { CSSProperties } from "react";

import azzaMark from "@design-system/assets/testimonials/azza-mark.svg";
import coinUsdc from "@design-system/assets/testimonials/coin-usdc.webp";
import coinUsdt from "@design-system/assets/testimonials/coin-usdt.webp";
import patternOverlay from "@design-system/assets/testimonials/pattern-azza-overlay.webp";

import { VisuallyHidden } from "@/components/ui";
import { SUPER_WORDS } from "@/content/testimonials";
import { cn } from "@/lib/cn";

/*
 * The blue "SUPER FAST" panel - 861:342. 600x580 at 1440, `surface.hero-deep`
 * (#2624DF, the drawn fill is the token's own value), left corners at
 * radius.6xl and square on the seam side; below `lg` the two panels stack and
 * this one takes the TOP corners instead.
 *
 * DECORATION. Four layers, all clipped by the panel:
 *   - the Azza chevron pattern at 735px, `mix-blend-overlay` at 20% (861:462)
 *   - the USDT cluster bleeding off the TOP-RIGHT edge (861:441)
 *   - the USDC cluster bleeding off the BOTTOM-LEFT edge (861:451)
 *   - the lime Azza plate at the drawn (53, 44), 97x99 (861:464)
 * The two coin clusters are FLAT EXPORTS of their Figma groups, not rebuilt
 * transforms: the drawing stacks skews, rotations, y-scales and alpha masks
 * per coin, and re-deriving that in CSS reproduces the maths, not the art.
 * Each export is positioned by its drawn offset and the panel's clip does the
 * cropping, exactly as it does in the file.
 *
 * THE WORD CYCLE (operator request, 2026-09-05). "SUPER" is static; beneath it
 * the drawn "FAST" (861:475) becomes a cycle of Fast / Smooth / Easy. Each
 * word slides in from outside the LEFT edge, decelerates hard into the centre
 * - the cinematic ease-out - holds for exactly 1s, then accelerates out
 * through the RIGHT edge, and the next word repeats it. The choreography lives
 * in `theme.css` (`testimonials-word-*`), keyed by one custom property:
 *
 *   slot     2600ms = 900 in (ease-out-expo) + 1000 hold + 700 out (ease-in)
 *   cycle    7800ms = 3 slots; each word starts one slot after the previous
 *
 * Each word spans the panel's full width with its glyphs centred, so
 * `translateX(±102%)` is "fully outside" for every word regardless of its own
 * width - "Smooth" travels the same track as "Easy" without measurement.
 *
 * MOTION IS ADDITIVE, NEVER REQUIRED. Following the `azza-float` contract, the
 * animation classes bind only under `prefers-reduced-motion: no-preference`.
 * The base state is the DRAWN state: "Fast" resting at the centre, the other
 * two words parked outside the clip. A reduced-motion reader, a crawler, and
 * the moment before hydration all see exactly what the Figma frame draws.
 *
 * TYPE. The drawn face is Subjectivity Serif, which typography.md S2.2 records
 * as absent with `font-accent` (-> Poppins) as its stand-in - so both lines
 * take the accent stack. "Bold Slanted" is expressed as 700 italic; no italic
 * Poppins face is loaded, so the browser's synthetic oblique carries the slant,
 * which for a display word is indistinguishable from a drawn oblique.
 *
 * ACCESSIBILITY. The animated stack is `aria-hidden`: three absolutely
 * positioned words would read as three separate headings-worth of noise, and
 * mid-flight text is meaningless to a screen reader. The panel's whole claim
 * is spoken once, statically, by the VisuallyHidden sentence.
 */

export function SuperPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-surface-hero-deep relative isolate min-h-[420px] overflow-clip sm:min-h-[480px] lg:min-h-[580px]",
        className,
      )}
    >
      {/* chevron pattern wash - 861:462 */}
      <Image
        src={patternOverlay}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[735px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-20 mix-blend-overlay"
      />

      {/*
       * The coin clusters - 861:441 top-right, 861:451 bottom-left. Figma
       * exported each group ALREADY CLIPPED to the panel: the USDT export is
       * 266x145.5 against a drawn visible box of 265.5x143, the USDC export
       * 304.5x244.5 against 304x244. So each image simply pins to its corner
       * at natural size - no negative offsets to re-derive the bleed, and the
       * drawn crop survives every panel size. Scaled down ~72% below `lg`,
       * where the full-size clusters would swallow a phone-width panel.
       */}
      <Image
        src={coinUsdt}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-[192px] max-w-none lg:w-[266px]"
      />
      <Image
        src={coinUsdc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-[220px] max-w-none lg:w-[305px]"
      />

      {/* the lime Azza plate - 861:464, drawn at (53, 44) */}
      <Image
        src={azzaMark}
        alt=""
        aria-hidden="true"
        className="absolute top-11 left-[53px] h-[99px] w-[97px] max-lg:top-8 max-lg:left-8 max-lg:h-[74px] max-lg:w-[73px]"
      />

      {/* the words */}
      <div
        aria-hidden="true"
        /*
         * `pb-9` lifts the optical centre: the drawn block sits at 204..338,
         * centred on 271 in a 580 panel whose middle is 290 - 19px high. A
         * 36px bottom pad moves a justify-centred column up by half of it.
         */
        className="font-accent absolute inset-0 flex flex-col items-center justify-center pb-9 uppercase"
      >
        {/* SUPER - 861:472: 64px white, -0.04em */}
        <span className="text-[44px] leading-none font-medium tracking-[-0.04em] text-white lg:text-[64px]">
          Super
        </span>

        {/*
         * The cycle slot. Full panel width so ±102% clears the clip for any
         * word; height reserves one line of the biggest word so the layout
         * never moves as words fly through.
         */}
        <div className="relative h-[76px] w-full lg:h-[110px]">
          {SUPER_WORDS.map((word, i) => (
            <span
              key={word}
              style={{ "--word-slot": i } as CSSProperties}
              className={cn(
                "testimonials-word",
                "absolute inset-0 text-center",
                // FAST - 861:475: 100px lime, -0.04em, Bold Slanted -> 700 italic
                "text-surface-accent-lime text-[68px] leading-none font-bold italic lg:text-[100px]",
                "tracking-[-0.04em]",
                /*
                 * The drawn resting state: word one centred, the rest parked
                 * outside the clip - expressed as `transform`, NEVER as a
                 * `translate-x-*` utility. Tailwind v4 emits those as the
                 * standalone `translate` property, which COMPOSES with the
                 * keyframes' `transform` instead of being replaced by it, so a
                 * parked word rode +102% right of every keyframe: its 1s hold
                 * happened outside the clip and its parked phase sat at the
                 * centre - which LOOKS almost right, one word at the centre at
                 * a time, and only measuring rendered boxes against keyframe
                 * values exposed it. On `transform`, the running animation
                 * replaces the base value; at rest (reduced motion, no-JS,
                 * pre-hydration) the base is exactly the drawn frame.
                 */
                i === 0 ? "[transform:translateX(0)]" : "[transform:translateX(102%)]",
              )}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <VisuallyHidden>Super fast, smooth, and easy.</VisuallyHidden>
    </div>
  );
}

export default SuperPanel;
