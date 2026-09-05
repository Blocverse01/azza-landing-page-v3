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

/** The three drawn lines, in order, with the frame's own feature settings. */
const LINES = [
  { text: "Your mONEY", features: '"salt" 1, "ss01" 1' },
  { text: "should work", features: '"salt" 1' },
  { text: "anywhere.", features: '"salt" 1, "ss01" 1' },
] as const;

/*
 * THE PHONE LOCKUP - operator mock, 2026-09-05: one word per line at 100px on
 * an 80px leading, "money" and "anywhere" in the lime #D3FEB6 (which IS
 * `surface.accent-lime`, so it is spoken as the token). Each word keeps the
 * feature settings of the drawn line it came from, and "mONEY" keeps its
 * authored casing - uppercasing stays a CSS concern.
 *
 * The mock writes "ANYWHERE" without the drawn full stop. That is presentation,
 * not copy: the accessible name below carries the authored sentence, period
 * included, at every width.
 */
const WORDS = [
  { text: "Your", lime: false, features: '"salt" 1, "ss01" 1' },
  { text: "mONEY", lime: true, features: '"salt" 1, "ss01" 1' },
  { text: "should", lime: false, features: '"salt" 1' },
  { text: "work", lime: false, features: '"salt" 1' },
  { text: "anywhere", lime: true, features: '"salt" 1, "ss01" 1' },
] as const;

export interface HeroHeadlineProps {
  /** Wired to the section's aria-labelledby. */
  id: string;
}

export function HeroHeadline({ id }: HeroHeadlineProps) {
  return (
    /*
     * ONE <h1>, ONE NAME, TWO LOCKUPS. The drawn three-line desktop headline
     * and the mock's five-line phone lockup are both `aria-hidden`
     * presentation; the sr-only sentence is the single accessible name, so a
     * screen reader hears the authored copy once, with its period, regardless
     * of which lockup is painted. Exactly one lockup is displayed at any
     * width (`lg` is the seam, as everywhere in this hero).
     */
    <h1 id={id} className="font-display w-full text-center uppercase">
      <span className="sr-only">Your money should work anywhere.</span>

      {/* The drawn lockup - 734:345, unchanged, `lg`+ only now. */}
      <span
        aria-hidden="true"
        className="text-display-hero text-fg-on-brand hidden w-full flex-col items-center gap-1 lg:flex"
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
      </span>

      {/*
       * The phone lockup. `min(100px, 25.5vw)` is the mock's 100px wherever
       * it fits and a proportional step-down below ~392px viewport - at 320
       * "ANYWHERE" measures wider than the screen at a hard 100, so the guard
       * is what keeps the widest word inside the gutters. Leading is the
       * mock's 80/100 = 0.8, carried as a ratio so it follows the guard down.
       */}
      <span
        aria-hidden="true"
        className="flex w-full flex-col items-center [font-size:min(100px,25.641vw)] leading-[0.8] lg:hidden"
      >
        {WORDS.map(({ text, lime, features }) => (
          <span
            key={text}
            className={
              lime ? "text-surface-accent-lime block w-full" : "text-fg-on-brand block w-full"
            }
            style={{ fontFeatureSettings: features } as CSSProperties}
          >
            {text}
          </span>
        ))}
      </span>
    </h1>
  );
}
