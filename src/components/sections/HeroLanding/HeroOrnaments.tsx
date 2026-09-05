import type { CSSProperties } from "react";

import coinGhanaAsset from "@design-system/assets/illustration/hero-coin-ghana-tilted.svg";
import coinKenyaAsset from "@design-system/assets/illustration/hero-coin-kenya-tilted.svg";
import notesLeftAsset from "@design-system/assets/illustration/hero-notes-left.svg";
import notesRightAsset from "@design-system/assets/illustration/hero-notes-right.svg";

import { cn } from "@/lib/cn";

/*
 * `*.svg` is typed `any` by next/image-types; narrowed rather than left to leak.
 */
const ASSET = {
  coinKenya: coinKenyaAsset as { src: string },
  coinGhana: coinGhanaAsset as { src: string },
  notesLeft: notesLeftAsset as { src: string },
  notesRight: notesRightAsset as { src: string },
};

/**
 * The landing hero's four floating ornaments - 734:350, 734:359, 734:371,
 * 734:372.
 *
 * WHAT CHANGED FROM THE PREVIOUS HERO
 * -----------------------------------
 * The old hero wedged flag coins INTO the headline, replacing three letter "O"s,
 * which is why this file used to export `HeroCoinLetter` and its slot machinery.
 * 734:338 drops that device entirely: the headline is now plain type (the O's are
 * real glyphs, see `HeroHeadline`) and the coins have moved out into the corners
 * as free-floating decoration. None of the slot code survives, because nothing
 * displaces a letter any more.
 *
 * THE MOTION
 * ----------
 * All four share ONE 3.1s looping timeline (cohort root 734:337). Each ornament
 * rises a little, tips a few degrees and settles; they are offset from one
 * another by where their keyframes sit inside that shared 3.1s, NOT by
 * animation-delay. The keyframes themselves live in `theme.css` next to the
 * rest of the project's motion, one `@keyframes` per ornament, with the Figma
 * `times` arrays converted to percentages and each segment's easing declared on
 * the keyframe it starts from. See that block for the full derivation.
 *
 * REST ROTATION IS BAKED IN, ANIMATION IS THE DELTA
 * -------------------------------------------------
 * Figma reports each node's ABSOLUTE rotation. Two of these rest at an angle:
 * the Ghana coin at -14.692deg and the right-hand notes at 51.693deg. For the
 * coins the resting angle is already inside the exported artwork - the export is
 * the group as drawn, so `hero-coin-ghana-tilted.svg` IS the tilted coin - and
 * for the notes it is carried by the static inner wrapper below. Either way the
 * `@keyframes` animate only the delta from rest (-3deg and +3deg at the peak).
 * Animating the absolute angle would apply the rest rotation a second time.
 *
 * WHY THE ART IS A CSS BACKGROUND
 * ------------------------------
 * Same reason as `HeroBackdrop`: this project serves SVG unoptimised and every
 * illustration is painted as a background. It also keeps each ornament a single
 * box with nothing for a screen reader to reach - the whole layer is decorative
 * and `aria-hidden`, and it carries no accessible name because it says nothing
 * the headline does not.
 *
 * PLACEMENT
 * ---------
 * Each ornament is pinned to the edge it is nearest, at the inset the design
 * draws, using the `min(100%, 90rem)` frame arithmetic `QrBadge` already
 * established: at and below 1440 that resolves to the design's own inset from
 * the viewport edge, and above 1440 the 1440 frame centres and the ornament
 * keeps its designed distance from that frame instead of drifting out to a bare
 * gutter. The right-hand notes deliberately resolve to a NEGATIVE inset
 * (-65.6px): the design hangs them off the right edge and lets the frame clip
 * them, and the section's `overflow-clip` reproduces that.
 *
 * `xl` AND UP ONLY. These sit in 1440-space at the far left and right of a
 * centred 709px column. At 1280 there is still clear air either side of the
 * text; below it there is not, and a coin sliding under the headline is worse
 * than no coin. The design file has no frame narrower than 1440 to defer to, so
 * this is a judgement recorded rather than a value read.
 */

interface OrnamentSpec {
  readonly src: string;
  /** Which edge the design inset is measured from. */
  readonly edge: "left" | "right";
  /** The design inset from that edge, in px. Negative deliberately overhangs. */
  readonly inset: number;
  /** Distance from the hero's top edge, in px. */
  readonly top: number;
  /** The ornament's box in design px. */
  readonly width: number;
  readonly height: number;
  /** The `@keyframes` driving it, as a `.azza-float--*` modifier. */
  readonly float: string;
  /**
   * A resting rotation that the artwork does NOT already carry, in degrees.
   * Applied to a static inner wrapper so the animated outer box only ever
   * writes the delta - the two transforms must not share one element.
   */
  readonly restRotation?: number;
  /** The unrotated artwork box, required whenever `restRotation` is set. */
  readonly artWidth?: number;
  readonly artHeight?: number;
}

const ORNAMENTS: readonly OrnamentSpec[] = [
  /* 734:350 - Kenya coin, top right. Frame x 1238..1404 -> 36 from the right. */
  {
    src: ASSET.coinKenya.src,
    edge: "right",
    inset: 36,
    top: 194,
    width: 166,
    height: 155,
    float: "azza-float--coin-kenya",
  },
  /* 734:359 - Ghana coin, left. Rests at -14.692deg, baked into the export. */
  {
    src: ASSET.coinGhana.src,
    edge: "left",
    inset: 71,
    top: 565,
    width: 145,
    height: 158,
    float: "azza-float--coin-ghana",
  },
  /* 734:371 - notes, top left. The only ornament with no resting rotation. */
  {
    src: ASSET.notesLeft.src,
    edge: "left",
    inset: 50,
    top: 147,
    width: 93,
    height: 124,
    float: "azza-float--notes-left",
  },
  /*
   * 734:372 - notes, bottom right. 105.357x213.151 of artwork rotated 51.693deg
   * inside a 232.567x214.801 box: 105.357*cos51.69 + 213.151*sin51.69 = 232.57
   * and 105.357*sin51.69 + 213.151*cos51.69 = 214.75, which is that box. The
   * design pins the box at x 1273 of 1440, so it overhangs the right edge by
   * 1440 - (1273 + 232.567) = -65.567 and is clipped, as drawn.
   */
  {
    src: ASSET.notesRight.src,
    edge: "right",
    inset: -65.567,
    top: 715,
    width: 232.567,
    height: 214.801,
    float: "azza-float--notes-right",
    restRotation: 51.693,
    artWidth: 105.357,
    artHeight: 213.151,
  },
];

/**
 * The decorative layer. Rendered by `HeroLanding`, which supplies the
 * positioning context and the clip.
 */
export function HeroOrnaments() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {ORNAMENTS.map((ornament) => (
        <FloatingOrnament key={ornament.float} {...ornament} />
      ))}
    </div>
  );
}

function FloatingOrnament({
  src,
  edge,
  inset,
  top,
  width,
  height,
  float,
  restRotation,
  artWidth,
  artHeight,
}: OrnamentSpec) {
  /*
   * At and below 1440 the first term is 0 and this is the design's own inset
   * from the viewport edge; above it the frame centres and the surplus goes to
   * the gutters. Same arithmetic as `QrBadge`.
   */
  const edgeInset = `calc((100% - min(100%, 90rem)) / 2 + ${inset}px)`;

  const art = (
    <span
      className="block"
      style={{
        width: `${artWidth ?? width}px`,
        height: `${artHeight ?? height}px`,
        backgroundImage: `url(${src})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    />
  );

  return (
    <span
      className={cn("absolute hidden xl:flex", "items-center justify-center", "azza-float", float)}
      style={
        {
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          [edge]: edgeInset,
        } as CSSProperties
      }
    >
      {restRotation === undefined ? (
        art
      ) : (
        /*
         * The resting rotation lives HERE, never on the animated parent: the
         * `@keyframes` write the `transform` property, so a rotation on the same
         * element would be overwritten on the first frame and the notes would
         * snap upright.
         */
        <span className="block flex-none" style={{ transform: `rotate(${restRotation}deg)` }}>
          {art}
        </span>
      )}
    </span>
  );
}
