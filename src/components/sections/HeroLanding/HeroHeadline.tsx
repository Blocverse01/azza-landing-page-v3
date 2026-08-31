import type { CSSProperties } from "react";

/**
 * The landing <h1> - 734:345.
 *
 * THE COPY
 * --------
 * Transcribed verbatim from the three text nodes:
 *
 *   734:346  "Your mONEY"      <- authored mixed case, preserved
 *   734:347  "should work"
 *   734:348  "anywhere. "      <- trailing space trimmed
 *
 * The mixed case of "mONEY" is the AUTHORED string and is kept on purpose
 * (components.md S4.10): uppercasing is a CSS concern, and normalising the
 * source here would throw the designer's own casing away. Unlike the previous
 * hero, line 2 arrives as ONE node - the designer no longer cuts the word open,
 * so there is no fragment to reassemble and no risk of a screen reader hearing
 * "sh uld w rk".
 *
 * THE LETTER COINS ARE GONE
 * -------------------------
 * 734:338 retires the device the old hero was built around: no flag coin stands
 * in for a letter any more, every "O" is a real glyph, and the coins have moved
 * out to the corners as free-floating ornaments (`HeroOrnaments`). That deletes
 * the whole slot/transparent-letter mechanism this file used to carry. The
 * accent-face O-swap (`DisplayHeading`'s `swapIndices`) is likewise absent from
 * this headline - 734:346's middle "o" is not on a different family, it is the
 * same Lemon face with a stylistic alternate, which is a font feature and not a
 * span.
 *
 * THE OPENTYPE ALTERNATES
 * -----------------------
 * Each line carries its own `font-feature-settings`, verbatim from the frame,
 * and lines 1 and 3 differ from line 2:
 *
 *   734:346  "salt" 1, "ss01" 1
 *   734:347  "salt" 1
 *   734:348  "salt" 1, "ss01" 1
 *
 * This is the one place the design distinguishes the lines typographically, so
 * it is reproduced per line rather than hoisted to the <h1>. If Lemon ever ships
 * without one of these sets the declaration is simply inert - it cannot break
 * the render.
 *
 * SIZE
 * ----
 * `text-display-hero`, which this project deliberately serves at 75% of the
 * frame's drawn 164px (operator request, 2026-08-04, applied to the token so
 * every consumer of the style follows). The frame still draws 164 and 135px
 * leading; that reduction is a live instruction newer than this file, so it
 * stands and is NOT reverted here. The consequence is that the headline block
 * measures shorter than the frame's 413px, which is why `HeroLanding` centres
 * the content column instead of pinning it to the drawn y offsets.
 *
 * The 4px inter-line gap is the frame's own (`gap-[4px]` on 734:345) and rides
 * on top of the 0.82 line-height the token already sets.
 */

/** The three lines, in order, with the frame's own feature settings. */
const LINES = [
  { text: "Your mONEY", features: '"salt" 1, "ss01" 1' },
  { text: "should work", features: '"salt" 1' },
  { text: "anywhere.", features: '"salt" 1, "ss01" 1' },
] as const;

export interface HeroHeadlineProps {
  /** Wired to the section's aria-labelledby. */
  id: string;
}

export function HeroHeadline({ id }: HeroHeadlineProps) {
  return (
    <h1
      id={id}
      className="flex w-full flex-col items-center gap-1 text-center font-display text-display-hero uppercase text-fg-on-brand"
    >
      {LINES.map(({ text, features }) => (
        <span
          key={text}
          className="block w-full"
          style={{ fontFeatureSettings: features } as CSSProperties}
        >
          {text}
        </span>
      ))}
    </h1>
  );
}
