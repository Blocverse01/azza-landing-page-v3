import type { CSSProperties } from "react";

import coinGhana from "@design-system/assets/illustration/coin-flag-ghana.svg";
import coinKenya from "@design-system/assets/illustration/coin-flag-kenya.svg";
import coinNigeria from "@design-system/assets/illustration/coin-flag-nigeria.svg";

import { cn } from "@/lib/cn";

/**
 * The landing hero's coin ornaments - 412:761.
 *
 * WHAT THESE ARE
 * --------------
 * The headline reads "Your mONEY should work anywhere." and three of its letter
 * "O"s are not type at all: they are illustrated flag coins wedged into the word
 * (assets.md S4.1). In Figma the headline is split into fragments around them
 * ("sh" / "uld w" / "rk", nodes 412:863 / 412:862 / 412:861) with the coin art
 * dropped into the gaps.
 *
 * That split must NOT survive into the DOM. assets.md S4.1 is explicit: the <h1>
 * carries the complete sentence and the coins are absolutely-positioned,
 * aria-hidden decorations layered over it - otherwise a screen reader announces
 * "sh uld w rk". Each coin is rendered as a <span>, which is phrasing content and
 * therefore legal inside an <h1>, carries `aria-hidden`, holds no text and no
 * focusable child, and so contributes nothing to the heading's accessible name.
 *
 * HOW THEY STAY ON THE "O" AS THE TYPE SCALES
 * -------------------------------------------
 * `--text-display-hero` is a clamp (40px -> 164px), so a coin pinned at a fixed
 * pixel offset would slide off its letter at every width except 1440. Every
 * number below is therefore in `em` of the display font-size: the coin box, and
 * the offset from the centre of its line box to the centre of its letter. The
 * collage then scales with the type by construction, which is what
 * responsive.md S7.2.1 means by "full collage restored at ratio-scaled
 * positions". Verified in a browser: the required offsets came out identical to
 * four decimal places at 320, 768 and 1440.
 *
 * WHERE THE OFFSETS COME FROM - and why they are not the Figma numbers
 * --------------------------------------------------------------------
 * They were measured off a real render with Bebas Neue loaded, by taking a DOM
 * Range over each "o" and comparing its centre with its line box's centre.
 *
 * That is deliberate. The design was set in Lemon, which the project does not
 * have and will never ship (D-011 replaces it with Bebas Neue outright). The
 * coins have to sit on the "O" of the face that actually renders, so their
 * positions follow Bebas's glyph advances, not Lemon's. D-011 says as much:
 * "metrics differ from Lemon, so every display headline reflows and the line
 * break notes need re-checking against a real render."
 *
 * For the record, the two do not disagree by much except on the first line:
 *
 *   coin      Figma dx (px @164 -> em)      measured dx (Bebas)
 *   nigeria   189..321 vs centre 439.5  ->  -1.1250    -1.5135
 *   ghana     156.96..317.6 vs 432.5    ->  -1.1902    -1.1170
 *   kenya     537..706 vs 432.5         ->  +1.1524    +1.0919
 *
 * Coin BOX sizes are still the Figma values (assets.md S4 intrinsics divided by
 * 164), because those are art dimensions rather than type metrics.
 *
 * THE FOURTH COIN
 * ---------------
 * assets.md S4.1 lists a fourth ornament, `coin-dollar.svg` (412:834), over the
 * "O" of "mONEY". It is NOT rendered, and that is deliberate: in the Figma file
 * the only paintable copy of that group (412:790) carries `hidden = true`, and
 * 412:834 survives solely as the alpha mask for the grain rectangle 412:844.
 * `get_design_context` on 412:761 emits that texture and no coin for the
 * subtree, and the frame export shows plain type on that letter. Building it
 * would add art the design does not show. Recorded as a finding rather than
 * silently restored.
 *
 * NO GRAIN
 * --------
 * Figma clips a shared grain fill to each coin silhouette (412:852, 412:807,
 * 412:873) at 24-50% opacity in overlay / colour-dodge. At that strength it is
 * imperceptible in the frame export - the coins read as clean flat art. Building
 * it with the shared `Grain` primitive, whose blend mode is `multiply` and whose
 * 1700px tile crops rather than fits inside a ~132px coin, produced a plainly
 * visible dot pattern on all three coins. Reproducing an invisible source layer
 * as a visible artefact is less faithful than omitting it, so it is omitted.
 * Recorded as a finding.
 */

interface CoinSpec {
  /** Static import of the exported SVG. Never hand-drawn, never re-pathed. */
  readonly src: string;
  /** Rendered box, in `em` of the display font-size. Figma art dimensions / 164. */
  readonly width: string;
  readonly height: string;
  /** Offset from the line-box centre to the letter centre, in the same `em`. */
  readonly dx: string;
  readonly dy: string;
}

const COIN = {
  /** 412:846 - Nigeria roundel on the "O" of "YOUR". 132 x 132. */
  nigeria: {
    src: coinNigeria.src,
    width: "0.805em",
    height: "0.805em",
    dx: "-1.5135em",
    dy: "0.0199em",
  },
  /** 412:798 - Ghana coin on the "O" of "SHOULD". 160.682 x 185.049. */
  ghana: {
    src: coinGhana.src,
    width: "0.98em",
    height: "1.128em",
    dx: "-1.117em",
    dy: "-0.0045em",
  },
  /** 412:864 - Kenya coin on the "O" of "WORK". 168.999 x 157.258. */
  kenya: {
    src: coinKenya.src,
    width: "1.03em",
    height: "0.959em",
    dx: "1.0919em",
    dy: "-0.0045em",
  },
} as const satisfies Record<string, CoinSpec>;

export type HeroCoinName = keyof typeof COIN;

export interface HeroCoinProps {
  name: HeroCoinName;
  /** Responsive visibility only - see HeroHeadline for the disclosure ladder. */
  className?: string;
}

/**
 * One coin, centred on its line box and offset onto its letter.
 *
 * Drawn as a CSS background rather than an <img> because it carries no meaning
 * and needs no alt text, because an <img> inside an <h1> would be announced, and
 * because components.md S4.7 rule 1 keeps SVG out of `Media` entirely.
 *
 * It never animates, so there is nothing here for `prefers-reduced-motion` to
 * switch off.
 */
export function HeroCoin({ name, className }: HeroCoinProps) {
  const coin = COIN[name];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 block",
        className,
      )}
      style={
        {
          width: coin.width,
          height: coin.height,
          transform: `translate(calc(-50% + ${coin.dx}), calc(-50% + ${coin.dy}))`,
          backgroundImage: `url(${coin.src})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        } as CSSProperties
      }
    />
  );
}
