/**
 * The icon set - design/icons.md S7, as adjudicated in design/components.md S11.
 *
 * 21 names. `map-pin` is REMOVED (C-2): `design-system/icons/map-pin.svg` and
 * `design-system/assets/illustration/location-pin-{1,2,3}.svg` are the same
 * three Figma nodes, and those nodes measure 84.62x93.57, 87.72x92.43 and
 * 75.35x93.77 - three different shapes, not one glyph placed three times. The
 * three pins are illustration and ship through `Media`, not `Icon`.
 */
export type IconName =
  | "arrow-right"
  | "bolt"
  | "bolt-outline"
  | "chevron-down"
  | "chevron-right"
  | "link"
  | "play-circle"
  | "receipt"
  | "search"
  | "share-instagram"
  | "share-tiktok"
  | "share-x"
  | "social-instagram"
  | "social-whatsapp"
  | "social-x"
  | "crypto-bnb"
  | "crypto-polygon"
  | "crypto-usdt"
  | "flag-ng"
  | "logo-azza-mark"
  | "logo-azza-wordmark";

/** 16 / 20 / 24 / 32 / 40. `md` (24) is the default. */
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
