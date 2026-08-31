import type { CSSProperties } from "react";

import buildingsAsset from "@design-system/assets/illustration/hero-buildings-skyline.svg";

/*
 * next/image-types declares `*.svg` as `any` so an SVGR setup can override it.
 * Narrowed here rather than letting `any` leak, exactly as `DeckCard` does.
 */
const buildings = buildingsAsset as { src: string };

/**
 * The landing hero's backdrop - 759:315 (rings) + 734:343 (skyline).
 *
 * Two decorative layers behind the headline, both `aria-hidden`, neither
 * carrying meaning. Painted in this order: page blue (owned by the section) ->
 * three discs -> skyline.
 *
 * THE "RINGS" ARE FILLED DISCS, NOT STROKES
 * -----------------------------------------
 * They read as concentric outlines in the mock, but each one is a solid circle a
 * step lighter than the one behind it, carrying a drop shadow in the PAGE colour
 * (#2624DF, `surface.hero-deep`). Confirmed from the exported SVGs, e.g.
 * 734:339 is `<circle r="673" fill="#2F2DDF">` under a `dy=4 stdDeviation=60`
 * shadow whose colour matrix resolves to #2624DF at full alpha. Stacking three
 * of those on the page blue is what produces the soft banded halo; there is no
 * ring geometry to reproduce, so these are CSS circles rather than three more
 * SVG requests.
 *
 * SVG stdDeviation -> CSS blur radius is x2 (60 -> 120, 28 -> 56, 36 -> 72).
 *
 * All three are concentric on (720, 297) in the 1440x914 frame - dead centre
 * horizontally, 297 down - so each one's `top` is `297 - d/2` and horizontal
 * centring is a plain `left-1/2`. Verified: 47+673, 190+530.5 and 386+334 all
 * land on 720.
 *
 * THE SKYLINE
 * -----------
 * 734:343 is a 1841x1806 vector in Figma, but only its lower band falls inside
 * the hero; the export is already cropped to the frame at 1440x752 and 162+752
 * is exactly the frame's 914, so it anchors to the BOTTOM and needs no top
 * offset.
 *
 * `background-size: 100% auto` scales it with the viewport and keeps its own
 * ratio, so at 1440 it is exactly the drawn 1440x752 and the silhouette reaches
 * both edges at every width. It was first written `max(100%, 1440px) auto` on
 * the theory that the art should never render smaller than it was drawn - which
 * backfired: all of this illustration's mass sits in the four CORNERS of a
 * 1440-wide canvas, so holding it at 1440 on a phone showed the empty middle and
 * the decoration disappeared entirely below about 900px. Scaling keeps the
 * composition - shapes framing the text - legible all the way down.
 *
 * The height stays a literal 752 rather than tracking the art, so the band's
 * top edge lands where the frame puts it on a 914 stage; `background-size`
 * decides how much of the art fills that band.
 *
 * A CSS background rather than `next/image` because this project serves SVG
 * unoptimised and paints every illustration this way (`DeckCard`,
 * `BusinessHeroArt`); the optimiser would need `dangerouslyAllowSVG`.
 */

/** d = diameter in design px, blur = CSS blur radius, tint = the disc's own fill. */
const DISCS = [
  { d: 1346, blur: 120, tint: "bg-surface-hero-ring-1" },
  { d: 1061, blur: 56, tint: "bg-surface-hero-ring-2" },
  { d: 668, blur: 72, tint: "bg-surface-hero-ring-3" },
] as const;

/** The shared centre of all three discs, measured from the hero's top edge. */
const DISC_CENTRE_Y = 297;

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {DISCS.map(({ d, blur, tint }) => (
        <div
          key={d}
          className={`absolute left-1/2 -translate-x-1/2 rounded-full ${tint}`}
          style={{
            width: `${d}px`,
            height: `${d}px`,
            top: `${DISC_CENTRE_Y - d / 2}px`,
            boxShadow: `0 4px ${blur}px var(--color-surface-hero-deep)`,
          }}
        />
      ))}

      <div
        className="absolute inset-x-0 bottom-0 h-[752px]"
        style={
          {
            backgroundImage: `url(${buildings.src})`,
            backgroundPosition: "bottom center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% auto",
          } as CSSProperties
        }
      />
    </div>
  );
}
