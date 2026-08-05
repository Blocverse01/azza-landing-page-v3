import { HeroCoinLetter } from "./HeroOrnaments";

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
 * neither must anyone who copies the headline. `HeroCoinLetter` keeps each
 * replaced "o" as real, transparent text inside the coin's slot, so both hold.
 *
 * The mixed case of "mONEY" is the AUTHORED string and is preserved on purpose
 * (components.md S4.10). Uppercasing happens in CSS. Normalising it here would
 * lose the source.
 *
 * THE O-SWAP
 * ----------
 * S4.10's accent-face swap on this headline sits on the "o" of "Your" - the
 * same letter the Nigeria coin replaces. With the coin standing in the slot the
 * glyph is transparent, so no `font-accent` span is rendered: painting an
 * invisible letter in a different face is unobservable, and the coin IS the
 * device on this row. Lines 2 and 3 never carried the swap: 412:787 is on
 * S4.10's explicit do-not-swap list, and line 2's Os are the coins themselves.
 *
 * THE LETTER SLOTS
 * ----------------
 * Each coin "O" is a `HeroCoinLetter`: the real letter rendered transparent in
 * a fixed-width inline slot, with the coin art centred on it. The slot widths
 * are the designer's own letter gaps measured off the Figma fragments - see
 * HeroOrnaments for the numbers and the drift argument for why the coins are
 * anchored to slots rather than offset from the line centre.
 *
 * PROGRESSIVE DISCLOSURE
 * ----------------------
 * responsive.md S7.2.1 drops the collage on small screens and restores it in
 * steps. Honoured as a count: base-sm shows the Nigeria disc only, `md` adds
 * the Kenya coin, `lg` restores all three. Below its breakpoint a coin's
 * letter simply paints as type, so the words stay whole at every width.
 */

export interface HeroHeadlineProps {
  /** Wired to the section's aria-labelledby. */
  id: string;
}

export function HeroHeadline({ id }: HeroHeadlineProps) {
  return (
    <h1
      id={id}
      className="w-full text-center font-display text-display-hero uppercase text-fg-primary"
    >
      <span className="block">
        Y<HeroCoinLetter name="nigeria">o</HeroCoinLetter>ur mONEY
      </span>
      <span className="block">
        sh
        <HeroCoinLetter name="ghana" from="lg">
          o
        </HeroCoinLetter>
        uld w
        <HeroCoinLetter name="kenya" from="md">
          o
        </HeroCoinLetter>
        rk
      </span>
      <span className="block">anywhere.</span>
    </h1>
  );
}
