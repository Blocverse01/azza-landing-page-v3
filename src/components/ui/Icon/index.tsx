import { cn } from "@/lib/cn";

import { GLYPHS } from "./glyphs";
import type { IconName, IconSize } from "./types";

export type { IconName, IconSize } from "./types";

const SIZE_PX: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

const ROTATE_CLASS: Record<90 | 180 | 270, string> = {
  90: "rotate-90",
  180: "rotate-180",
  270: "-rotate-90",
};

export interface IconProps {
  /** Required. No default - a typo must be a type error, not a blank box. */
  name: IconName;
  /**
   * Scale step, or an explicit px number for the documented off-scale cases
   * (the 140px BNB mark in Azza Wrapped, the 43x75 bolt outline). Default "md".
   */
  size?: IconSize | number;
  /**
   * Presence of this prop is what makes the icon meaningful. Absent means
   * decorative. When the icon is the only content of a button or link, put
   * `aria-label` on the CONTROL and leave the icon decorative - one accessible
   * name, never two.
   */
  title?: string;
  /**
   * Colour is set here, via a text-colour utility. There is deliberately no
   * `color` prop: it would invite a raw hex and defeat the token layer. The 13
   * single-colour glyphs inherit `currentColor`; the 8 fixed-fill glyphs (brand
   * marks and a national flag) ignore colour entirely and must not be recoloured.
   */
  className?: string;
  /**
   * Rotation in degrees. The one legitimate use is 180 on the Azza Wrapped
   * "previous" arrow.
   */
  rotate?: 0 | 90 | 180 | 270;
}

/**
 * The icon primitive - design/icons.md S7, as adjudicated in components.md S4.5.
 *
 * Both `width` and `height` are always set explicitly in px, never `auto`:
 * an `auto` dimension lets the glyph expand to its intrinsic size, which for
 * `crypto-bnb` is 141px. Non-square glyphs honour their own aspect ratio -
 * `size` sets the height and the width follows from the viewBox.
 *
 * THIS COMPONENT USES NO HOOKS AND MUST NOT START. It renders from Server
 * Components across the site, so `useId()` is unavailable to it - which is why
 * the accessible name below is an `aria-label` rather than `aria-labelledby` +
 * `<title id>`, and why glyphs.tsx carries an absolute ban on `<defs>` ids.
 * Both are the same constraint, met twice.
 */
export function Icon({
  name,
  size = "md",
  title,
  className,
  rotate = 0,
}: IconProps) {
  const glyph = GLYPHS[name];
  const height = typeof size === "number" ? size : SIZE_PX[size];

  // Preserve the glyph's own viewBox verbatim; derive the box from it rather
  // than re-projecting the artwork onto a common square, which would shift the
  // circular coin marks and the flag roundel off-centre.
  const [, , viewW, viewH] = glyph.viewBox.split(" ").map(Number);
  const aspect = viewH > 0 ? viewW / viewH : 1;
  const width = Math.round(height * aspect * 1000) / 1000;

  const labelled = typeof title === "string" && title.length > 0;

  return (
    <svg
      viewBox={glyph.viewBox}
      width={width}
      height={height}
      fill="none"
      className={cn(
        "inline-block shrink-0 align-middle",
        /*
         * Three glyphs were exported clipped to the circle inscribed in their
         * viewBox (`<rect width=W height=W rx=W/2>`). A `<clipPath>` needs a
         * document-unique id and this component cannot mint one, so the clip is
         * expressed on the element box instead. It is the same circle, not an
         * approximation: `width`/`height` above map the viewBox 1:1 onto a
         * square box at every step of the scale, so `border-radius: 50%` cuts
         * exactly where `rx=W/2` did. `overflow-hidden` is the outermost
         * `<svg>`'s UA default and is restated only so the clip cannot be lost
         * to a future reset.
         */
        glyph.clip === "circle" ? "overflow-hidden rounded-full" : undefined,
        rotate !== 0 ? ROTATE_CLASS[rotate] : undefined,
        className,
      )}
      role={labelled ? "img" : undefined}
      // `aria-label`, not `aria-labelledby` + `<title id>`. The id form needs a
      // document-unique id, and this is a server component so `useId()` is not
      // available. Any id derived from (name, title) instead collides the moment
      // the same labelled icon renders twice on a page - which `logo-azza-wordmark`
      // ("Azza - home") does on every route, once in TopNav and once in Footer.
      // Duplicate ids are invalid HTML and an axe violation. `aria-label` on
      // `role="img"` produces the identical accessible name with no id at all.
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      {glyph.body}
    </svg>
  );
}
