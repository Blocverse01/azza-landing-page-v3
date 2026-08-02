/**
 * The three deck records.
 *
 * SOURCE: Figma component set `507:498`, the only real component set in the
 * file. It lives outside `FOR BUILD`, as a direct child of canvas `1:3`.
 *
 *   507:684  "Variant4"        1300x700  blush  <- the placed instance (511:364)
 *   507:496  "Operate Locally" 1200x700  lilac
 *   507:497  "Move Money"      1200x700  mint
 *
 * ORDER. The array order is the fan's resting z-order, front to back, read off
 * the placed instance `507:684`: blush on top (fill `507:728`, x=100), lilac
 * behind it (`507:725`, x=50), mint at the back (`507:724`, x=0). It is also
 * the DOM order in every one of the three presentations, and it never changes
 * - responsive.md S7.0.1: "Card content in DOM order 1, 2, 3 always."
 *
 * COPY. Every string is transcribed verbatim from the variant's own text
 * nodes, em dashes and all. No card copy is hard-coded in a component.
 *
 * COLOUR. Every value resolves through a token from `design/color.md` S4.
 * There is not a raw hex anywhere in this directory.
 */

/**
 * Which decorative composition sits behind the card's text. One per card - the
 * design gives all three a full-card background, and `DeckCard` paints each of
 * them from a committed export in `design-system/assets/illustration/`.
 *
 * `null` remains legal for a card whose art has no export yet. Nothing is null
 * today; every one of the three is wired.
 */
export type DeckArt = "crypto-coins" | "globe" | "flag-ribbon" | null;

export interface DeckRecord {
  /** Stable id - drives React keys, DOM ids and the dot controls. */
  id: string;
  /** The Figma variant this record was transcribed from. */
  figmaVariant: string;
  /** The Figma text nodes the two strings came from. */
  figmaText: readonly [title: string, body: string];
  /** Verbatim headline. Rendered uppercase by the display face, never in data. */
  title: string;
  /** Verbatim subcopy. */
  body: string;
  /** Card fill. `surface.accent-*`. */
  surfaceClass: string;
  /** Headline colour. Each card has its own near-black, tuned to its fill. */
  titleClass: string;
  /** Subcopy colour. `fg.body` at the alpha the design uses on that card. */
  bodyClass: string;
  /** Decorative art, or `null` where the design's art was never exported. */
  art: DeckArt;
}

/**
 * The phone screenshot is the SAME asset on all three cards (`507:764` and its
 * two siblings - one file, md5-verified in assets.md S3). It is described once
 * here rather than three times in markup.
 */
export const DECK_SCREEN_ALT =
  "Azza on WhatsApp, confirming a completed transfer.";

export const DECK_RECORDS: readonly DeckRecord[] = [
  {
    id: "one-wallet",
    figmaVariant: "507:684",
    figmaText: ["507:759", "507:760"],
    title: "One wallet for all your crypto payments",
    body: "Store, send, receive, and convert your crypto to local currency instantly on WhatsApp.",
    surfaceClass: "bg-surface-accent-blush",
    titleClass: "text-fg-on-accent-blush",
    // 507:760 is fg.body at 70% alpha, which is the `fg.body-soft` role.
    bodyClass: "text-fg-body-soft",
    art: "crypto-coins",
  },
  {
    id: "operate-locally",
    figmaVariant: "507:496",
    figmaText: ["458:394", "458:395"],
    title: "Operate locally. Move money globally.",
    body: "Accept payments in naira or stablecoins, and pay across borders — without delays or complexity.",
    surfaceClass: "bg-surface-accent-lilac",
    titleClass: "text-fg-on-accent-lilac",
    // 458:395 is fg.body at 80% alpha, which is the `fg.body-strong` role.
    bodyClass: "text-fg-body-strong",
    // The globe `458:396` WAS exported after this section was first built -
    // assets.md S4.4 / S14 row 3, `illustration/deck-globe.svg`. It is wired.
    //
    // Its three red pins (`458:399` / `458:414` / `458:429`) are still not
    // shipped: assets.md S12.4 records them as the SAME shape as
    // `location-pin-1/2/3.svg`, but those three files were exported with their
    // /products/for-business rotations (-35.07 / +39.78 / +24.20 deg) baked in,
    // and the deck's pins sit at 0 deg. There is no upright export to point at,
    // so the globe ships without them rather than with three tilted ones.
    art: "globe",
  },
  {
    id: "move-money",
    figmaVariant: "507:497",
    figmaText: ["458:385", "458:386"],
    title: "Move money globally, without limits.",
    body: "Move money between Nigeria, Ghana, South Africa, the UK, the US, and beyond — instantly.",
    surfaceClass: "bg-surface-accent-mint",
    titleClass: "text-fg-on-accent-mint",
    bodyClass: "text-fg-body-strong",
    // The five flag roundels (458:334 Nigeria / 458:340 Ghana / 458:348 South
    // Africa / 458:352 Kenya / 458:374 Rwanda) ship as ONE file - they are a
    // single frame `458:333` in the design and were exported as such, assets.md
    // S4.4 / S14 row 2, `illustration/deck-flag-roundel-ribbon.svg`.
    art: "flag-ribbon",
  },
];
