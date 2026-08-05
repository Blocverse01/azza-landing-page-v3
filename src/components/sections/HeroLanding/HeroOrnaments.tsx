import type { CSSProperties, ReactNode } from "react";

import coinGhana from "@design-system/assets/illustration/coin-flag-ghana.svg";
import coinKenya from "@design-system/assets/illustration/coin-flag-kenya.svg";
import coinNigeria from "@design-system/assets/illustration/coin-flag-nigeria.svg";

import { cn } from "@/lib/cn";

/**
 * The landing hero's coin letters - 412:761.
 *
 * WHAT THESE ARE
 * --------------
 * The headline reads "Your mONEY should work anywhere." and three of its letter
 * "O"s are not type at all: they are illustrated flag coins standing IN PLACE of
 * the letter (assets.md S4.1). In Figma the second line is split into fragments
 * around them ("sh" / "uld w" / "rk", nodes 412:863 / 412:862 / 412:861) with
 * the coin art dropped into the gaps.
 *
 * That split must NOT survive into the DOM. assets.md S4.1 is explicit: the
 * <h1> carries the complete sentence - otherwise a screen reader announces
 * "sh uld w rk". So each replaced "o" is REAL TEXT, kept in the accessibility
 * tree and in copy/paste, but rendered transparent inside a fixed-width
 * inline-block slot. The coin is an aria-hidden background layer centred on
 * that slot. Readers hear "should work"; the eye sees the coin where the
 * letter would be.
 *
 * WHY A SLOT AND NOT AN OFFSET
 * ----------------------------
 * The first build kept the words intact and floated each coin over its "O" at
 * a measured em offset from the line-box centre. That is brittle: the offset
 * bakes in the glyph advances of one specific render, and any change to font
 * loading, tracking or line breaking silently slides the coin off its letter -
 * which is exactly what happened. A slot cannot drift: the coin is anchored to
 * the box that displaces the letter, so layout and art move together by
 * construction.
 *
 * WHERE THE NUMBERS COME FROM
 * ---------------------------
 * All em values are the Figma frame's pixels divided by the 164px display size,
 * so the collage scales with the `--text-display-hero` clamp.
 *
 * Slot widths are the designer's own letter gaps:
 *   ghana   "sh" ends x=176, "uld w" begins x=301  ->  125px  ->  0.762em
 *   kenya   "uld w" ends x=561, "rk" begins x=688  ->  127px  ->  0.774em
 *   nigeria line 1 is one text node (412:788), so there is no authored gap;
 *           the slot reproduces the same coin-overlap ratio as line 2 and was
 *           then tuned against the frame export.
 *
 * Coin BOX sizes are the Figma art dimensions (assets.md S4 intrinsics / 164).
 * The art is wider than its slot on purpose - in the frame the coins overlap
 * the neighbouring letters by 16-24px, and the box centred on the slot
 * reproduces exactly that.
 *
 * THE FOURTH COIN
 * ---------------
 * assets.md S4.1 lists a fourth ornament, `coin-dollar.svg` (412:834), over the
 * "O" of "mONEY". It is NOT rendered, and that is deliberate: in the Figma file
 * the only paintable copy of that group (412:790) carries `hidden = true`, and
 * the frame export shows plain type on that letter. Recorded as a finding
 * rather than silently restored.
 *
 * NO GRAIN
 * --------
 * Figma clips a shared grain fill to each coin silhouette (412:852, 412:807,
 * 412:873) at 24-50% opacity in overlay / colour-dodge. At that strength it is
 * imperceptible in the frame export, and rebuilding it with the shared `Grain`
 * primitive produced a plainly visible dot pattern. Omitted; recorded as a
 * finding.
 */

interface CoinSpec {
  /** Static import of the exported SVG. Never hand-drawn, never re-pathed. */
  readonly src: string;
  /** Rendered art box, in `em` of the display font-size. Figma dims / 164. */
  readonly width: string;
  readonly height: string;
  /** The letter slot's advance width - the gap the designer left in the type. */
  readonly slot: string;
  /** Vertical nudge of the art from the slot's line-box centre. */
  readonly dy: string;
}

const COIN = {
  /** 412:846 - Nigeria roundel replacing the "O" of "YOUR". 132 x 132. */
  nigeria: {
    src: coinNigeria.src,
    width: "0.805em",
    height: "0.805em",
    slot: "0.80em",
    dy: "0.064em",
  },
  /** 412:798 - Ghana coin replacing the "O" of "SHOULD". 160.682 x 185.049. */
  ghana: {
    src: coinGhana.src,
    width: "0.98em",
    height: "1.128em",
    slot: "0.762em",
    dy: "0.045em",
  },
  /** 412:864 - Kenya coin replacing the "O" of "WORK". 168.999 x 157.258. */
  kenya: {
    src: coinKenya.src,
    width: "1.03em",
    height: "0.959em",
    slot: "0.774em",
    dy: "0.07em",
  },
} as const satisfies Record<string, CoinSpec>;

export type HeroCoinName = keyof typeof COIN;

/**
 * The disclosure ladder (responsive.md S7.2.1), as static class sets - Tailwind
 * must see every literal. Below a coin's breakpoint the wrapper is plain inline
 * and the letter paints normally, so small screens read "SHOULD WORK" as type.
 * At the breakpoint the wrapper becomes the fixed-width slot, the letter goes
 * transparent, and the coin appears in its place.
 */
const GATE = {
  base: {
    wrap: "inline-block w-[var(--coin-slot)]",
    letter: "text-transparent",
    coin: "block",
  },
  md: {
    wrap: "md:inline-block md:w-[var(--coin-slot)]",
    letter: "md:text-transparent",
    coin: "hidden md:block",
  },
  lg: {
    wrap: "lg:inline-block lg:w-[var(--coin-slot)]",
    letter: "lg:text-transparent",
    coin: "hidden lg:block",
  },
} as const;

export type HeroCoinGate = keyof typeof GATE;

export interface HeroCoinLetterProps {
  name: HeroCoinName;
  /** Breakpoint at which the letter gives way to the coin. Default: always. */
  from?: HeroCoinGate;
  /** The single letter being replaced, verbatim from the authored string. */
  children: ReactNode;
}

/**
 * One replaced letter: the real character, transparent inside a slot the width
 * of the designer's letter gap, with the coin art centred over it.
 *
 * The art is a CSS background rather than an <img> because it carries no
 * meaning and needs no alt text, because an <img> inside an <h1> would be
 * announced, and because components.md S4.7 rule 1 keeps SVG out of `Media`.
 *
 * It never animates, so there is nothing for `prefers-reduced-motion` to
 * switch off.
 */
export function HeroCoinLetter({
  name,
  from = "base",
  children,
}: HeroCoinLetterProps) {
  const coin = COIN[name];
  const gate = GATE[from];

  return (
    <span
      className={cn("relative", gate.wrap)}
      style={{ "--coin-slot": coin.slot } as CSSProperties}
    >
      <span className={gate.letter}>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2",
          gate.coin,
        )}
        style={
          {
            width: coin.width,
            height: coin.height,
            transform: `translate(-50%, calc(-50% + ${coin.dy}))`,
            backgroundImage: `url(${coin.src})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          } as CSSProperties
        }
      />
    </span>
  );
}
