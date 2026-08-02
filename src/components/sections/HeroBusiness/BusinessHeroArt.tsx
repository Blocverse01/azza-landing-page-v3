import type { StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import locationPin1 from "@design-system/assets/illustration/location-pin-1.svg";
import locationPin2 from "@design-system/assets/illustration/location-pin-2.svg";
import locationPin3 from "@design-system/assets/illustration/location-pin-3.svg";
import mapGhanaFlag from "@design-system/assets/illustration/map-ghana-flag.svg";
import mapNigeriaFlag from "@design-system/assets/illustration/map-nigeria-flag.webp";
import mapSouthAfricaFlag from "@design-system/assets/illustration/map-south-africa-flag.svg";

import { Media } from "@/components/ui";
import { cn } from "@/lib/cn";

/*
 * The decorative composition behind the Azza-for-Business hero headline -
 * 412:2444 (Ghana), 412:2453 (South Africa), 412:2465 (Nigeria) and the three
 * "Location" pins 412:2474 / 412:2488 / 412:2502.
 *
 * THE STAGE
 * ---------
 * Every piece is placed against a 1280 x 609 stage - the exact geometry of the
 * hero card 412:2437 at the 1440 design width. responsive.md S7.3.3 asks for
 * exactly this at `lg`: "percentage positions of the 1280 stage".
 *
 * THE STAGE IS THE CARD ITSELF. This layer is stretched over the card by the
 * grid in HeroBusiness, so `left` and `width` are percentages of the card's
 * width and `top` is a percentage of its height. Whenever the card holds the
 * designed 1280:609 proportion - which `HeroBusiness`'s aspect keeper enforces
 * as a floor from `lg` up - every piece lands exactly where Figma put it. When
 * the copy makes the card taller, the composition spreads down with it instead
 * of leaving a band of bare lime below the art. That case is live today: Bebas
 * Neue is wider than the Lemon the headline was set in, so the H1 wraps to four
 * lines rather than three and the card runs past 609 (D-011).
 *
 * Piece WIDTHS are percentages of the card width only, never of its height, so
 * nothing distorts when the card grows - the art keeps its aspect ratio and
 * only its centre moves.
 *
 * An earlier version nested a `w-full aspect-[1280/609] min-h-full` stage in
 * here. Do not reintroduce it: `min-height` transfers through `aspect-ratio`
 * into a MIN-WIDTH, so a card taller than the design re-derived the stage 25%
 * too wide and pushed 412:2444 off the right edge. It typechecks, builds and
 * lints clean, and is only visible in a browser.
 *
 * THE COORDINATES
 * ---------------
 * Each piece is given as the CENTRE of its art box plus the art's unrotated
 * size, both in stage pixels, and is placed with translate(-50%,-50%) followed
 * by its rotation. Tailwind v4 emits `translate` and `rotate` as individual
 * transform properties, which the spec applies in the order translate -> rotate
 * about the element's own centre, so the centre lands exactly on (left, top)
 * whatever the rotation is.
 *
 * The centres are derived from the rendered bounding boxes reported by
 * `get_design_context` on 412:2436. NOTE that `get_metadata` reports a
 * DIFFERENT x/y for these six nodes - it gives the post-rotation position of
 * the node's original top-left corner, not the bounding box. Both were
 * reconciled by hand and agree; the bounding box is the value CSS needs.
 *
 * NOTHING HERE IS INTERACTIVE
 * ---------------------------
 * The whole layer is `aria-hidden`, `pointer-events-none` and contains no
 * focusable node. A transparent full-bleed layer that swallows clicks is a
 * defect this run has already paid for once.
 */

/** The hero card's designed inner box, 412:2437. */
const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 609;

const percentOfWidth = (px: number) => `${(px / STAGE_WIDTH) * 100}%`;
const percentOfHeight = (px: number) => `${(px / STAGE_HEIGHT) * 100}%`;

interface ArtPiece {
  /** Figma node id, so an auditor can go straight to the source. */
  node: string;
  src: StaticImageData;
  /** Centre of the art box, in stage pixels. */
  centreX: number;
  centreY: number;
  /** Unrotated art size, in stage pixels. Matches the exported file's own box. */
  artWidth: number;
  artHeight: number;
  /**
   * Breakpoint gating and rotation. Literal strings so Tailwind can see them.
   * responsive.md S7.3.3: everything drops below `md`; only 412:2444 returns at
   * `md`, at 40% opacity; all three groups and all three pins return at `lg`.
   */
  className: string;
  sizes?: string;
}

const ART_PIECES: readonly ArtPiece[] = [
  {
    // Nigeria. Drawn FIRST rather than third: the exported WebP has no alpha
    // channel - its transparency was flattened against the card's lime fill -
    // so it must sit under its neighbours. Its ink stops at stage y 133 and
    // x 560, and 412:2453 starts at y 190 while 412:2444 starts at x 965, so
    // no ink actually overlaps and the render is identical to the design.
    node: "412:2465",
    src: mapNigeriaFlag,
    centreX: 382.905,
    centreY: 141.665,
    artWidth: 765.81,
    artHeight: 283.33,
    className: "hidden lg:block",
    // components.md S4.7's verbatim `sizes` table does not cover the business
    // hero, so this is derived: the slot is 59.83% of the card, and the card
    // pins at 1280 from `2xl` up. The piece is `display:none` below `lg`.
    sizes: "(max-width: 1279px) 60vw, 766px",
  },
  {
    // Ghana, right. The one decoration responsive.md reintroduces at `md`.
    node: "412:2444",
    src: mapGhanaFlag,
    centreX: 1248.7165,
    centreY: 226.807,
    artWidth: 407.206,
    artHeight: 571.993,
    className: "hidden opacity-40 rotate-[-21.09deg] md:block lg:opacity-100",
  },
  {
    // South Africa, left. Its bounding box starts at stage x -223, so it bleeds
    // off the left edge by design and the card must clip it.
    node: "412:2453",
    src: mapSouthAfricaFlag,
    centreX: 114.95,
    centreY: 502.3355,
    artWidth: 596.991,
    artHeight: 533.558,
    className: "hidden rotate-[12.71deg] lg:block",
  },
  {
    // Three DIFFERENT pin shapes, not one glyph placed three times
    // (components.md S11 C-2): 84.6x93.6, 87.7x92.4, 75.3x93.8. Each file has
    // its own rotation already baked in, so no rotate class here.
    node: "412:2474",
    src: locationPin1,
    centreX: 1200.3115,
    centreY: 376.785,
    artWidth: 84.623,
    artHeight: 93.57,
    className: "hidden lg:block",
  },
  {
    node: "412:2488",
    src: locationPin2,
    centreX: 83.8595,
    centreY: 458.217,
    artWidth: 87.719,
    artHeight: 92.434,
    className: "hidden lg:block",
  },
  {
    // location-pin-3.svg was exported ALREADY CLIPPED by the card's top edge -
    // its own file carries the card's 1280x609 clip path. The unclipped node is
    // 75.35 x 93.765 at stage y -13; what ships is the visible 75.35 x 80.31
    // sitting flush against the top edge.
    node: "412:2502",
    src: locationPin3,
    centreX: 110.675,
    centreY: 40.155,
    artWidth: 75.35,
    artHeight: 80.31,
    className: "hidden lg:block",
  },
];

export interface BusinessHeroArtProps {
  className?: string;
}

export function BusinessHeroArt({ className }: BusinessHeroArtProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative overflow-clip select-none", className)}
    >
      {ART_PIECES.map((piece) => (
        <div
          key={piece.node}
          data-node-id={piece.node}
          className={cn("absolute -translate-x-1/2 -translate-y-1/2", piece.className)}
          style={
            {
              left: percentOfWidth(piece.centreX),
              top: percentOfHeight(piece.centreY),
              width: percentOfWidth(piece.artWidth),
            } as CSSProperties
          }
        >
          <Media
            src={piece.src}
            alt=""
            ratio={`${piece.artWidth} / ${piece.artHeight}`}
            sizes={piece.sizes}
          />
        </div>
      ))}
    </div>
  );
}

export default BusinessHeroArt;
