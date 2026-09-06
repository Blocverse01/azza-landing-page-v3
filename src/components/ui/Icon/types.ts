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
  | "logo-azza-wordmark"
  // Added after wave 2B by the r2 icon sweep. The first pass traversed only the
  // `672:246` FOR BUILD section; both nav dropdowns (`94:850`, `63:350`) are
  // direct children of the canvas and were never reached, so these four were
  // missing while TopNav was already importing them. Appended, never reordered.
  | "wallet" //         507:820 - Products > Crypto Wallet
  | "money-bag" //      507:835 - Products > Cross-Border Payments
  | "briefcase" //      507:840 - Products > Azza Business
  | "social-youtube" // 507:864 - Socials > YouTube
  /*
   * The redesigned Socials dropdown, `765:340`. These are the PLATFORMS' OWN
   * brand marks - full-colour, fixed-fill - and they are NOT the `social-*`
   * three above, which are monochrome Fluent outlines that inherit
   * `currentColor`. A name match is not a glyph match, so these are separate
   * entries rather than a redefinition of those.
   *
   * WHAT THAT LEAVES THE OUTLINE SET. `social-x` and `social-instagram` still
   * draw the Help page's contact rows (content/help.ts) and `social-whatsapp`
   * draws those plus TopNav's chat affordance, so they stay. `social-youtube`
   * is now referenced by NOTHING: 507:864 was exported for the old flat
   * `63:350` row and `765:340` replaced it with `brand-youtube`. It is kept
   * rather than deleted because it is a real glyph in the design's exported set
   * and `map-pin`'s removal (see above) shows a deletion here is a documented
   * decision, not a cleanup. Recorded so an auditor reads it as deliberate.
   */
  | "brand-x" //         765:367
  | "brand-instagram" // 765:375
  | "brand-youtube" //   765:380
  /*
   * The 771:303 / 776:464 dropdown redesign: every row hover-swaps an outline
   * glyph for a filled one. The three Products outlines already exist above
   * (`wallet` / `money-bag` / `briefcase` - 771:303 re-exports the identical
   * artwork), so only their filled counterparts are new. The Socials outlines
   * are NOT `social-x` / `social-instagram` / `social-youtube` re-exports:
   * those are 22- and 16-viewBox drawings with different optical insets, and
   * these are the design's own 24px set, so they are separate entries
   * (`-regular`, the design's own suffix). X's filled state IS the existing
   * `brand-x` block scaled - verified path-for-path - so no new entry for it.
   */
  // The first two traded colours on 2026-08-17 at the operator's request; the
  // pairing below is the current one, not a transposition.
  | "wallet-filled" //            775:329 - Products hover, #A57DD9
  | "money-bag-filled" //         775:331 - Products hover, #6764EE
  | "briefcase-filled" //         775:333 - Products hover, #76B94D
  | "social-x-regular" //         776:449 - Socials rest
  | "social-instagram-regular" // 776:451 - Socials rest
  | "social-youtube-regular" //   776:459 - Socials rest
  | "social-instagram-filled" //  776:455 - Socials hover, #FF0069
  | "social-youtube-filled" //    776:457 - Socials hover, #FF4040
  | "social-tiktok-filled" //     809:304's path baked black - Socials hover (operator row, 2026-09-06)
  /*
   * The crypto-wallet converter's asset and currency pickers (operator request,
   * 2026-08-11: assets USDC / USDT / cNGN, currencies XOF / UGX / GHS / KES /
   * ZAR / RWF / NGN). None of these exist in the Figma file - the design draws
   * only USDT and NGN - so the artwork comes from outside it, from sets whose
   * licence permits that: the six flags are HatScripts' circle-flags (MIT),
   * `crypto-usdc` is spothq's cryptocurrency-icons (MIT), and `crypto-cngn` is
   * hand-authored (no brand asset was available; see its entry). Flags are
   * named by COUNTRY like `flag-ng`; `content/rates.ts` owns the
   * currency->flag mapping, including XOF -> `flag-sn` (a currency union has
   * no flag of its own, so it wears Senegal's - a WAEMU member - as its
   * conventional stand-in).
   */
  | "crypto-usdc"
  | "crypto-cngn"
  /**
   * Hand-authored UI glyph (like `crypto-cngn`): the selected-option tick in
   * `SelectPillPicker`'s listbox. The design file draws no menus and so has no
   * check to export; `currentColor` so the menu colours it.
   */
  | "check"
  /*
   * The article share row's 2026-08 revision (282:803 - nodes 809:299 /
   * 809:301 / 809:304 / 809:306, named by the design after their source
   * packs). These REPLACE `share-x` / `share-instagram` / `share-tiktok` and the
   * 16px `link` disc in ShareRow, which was their only consumer; those three
   * now reference nothing and are kept for the `social-youtube` reason above.
   * Name match is not glyph match, so they are separate entries: the X is the
   * streamline block glyph (the same artwork as `brand-x`, re-exported at 24
   * and `currentColor` so the row can still ink it), the Instagram is basil's
   * solid mark in Instagram's flat #FF0069 (not the old gradient badge, not
   * `social-instagram-filled`'s different drawing), and the TikTok and link are
   * filled glyphs where the old ones were a clipped squircle and an outline.
   */
  | "share-x-block" //         809:299 - streamline-logos:x-twitter-logo-block
  | "share-instagram-solid" // 809:301 - basil:instagram-solid, #FF0069
  | "share-tiktok-filled" //   809:304 - tiktok_filled
  | "share-link-filled" //     809:306 - link_2_filled
  | "flag-sn" // XOF
  | "flag-ug" // UGX
  | "flag-gh" // GHS
  | "flag-ke" // KES
  | "flag-za" // ZAR
  | "flag-rw"; // RWF

/** 16 / 20 / 24 / 32 / 40. `md` (24) is the default. */
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
