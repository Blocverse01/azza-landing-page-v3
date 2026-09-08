import type { IconName } from "@/components/ui";

/**
 * The single source of navigation data.
 *
 * `TopNav` and `Footer` both read from here; no nav label or href is written
 * inside a component. Contract: design/components.md S7.3.
 *
 * Copy is transcribed verbatim from the Figma nodes:
 *   bar          412:2066  (Products / Socials / Blog / About Us / Chat with Azza -
 *                           About Us retired 2026-09-08, see PRIMARY_NAV)
 *   Products     94:850    (three rows, title + description)
 *   Socials      765:340   (three rows, label only) - supersedes 63:350
 */

export interface NavLink {
  label: string;
  href: string;
  /**
   * Passed straight to `next/link`'s `prefetch`. Omitted everywhere except the
   * destinations the design NAMES but the D-002 sitemap has no route for.
   *
   * Next's App Router prefetches every in-viewport `<Link>`; a prefetch of a
   * route that does not exist is a real 404 request, on every page load, on
   * every route the link ships on. `prefetch={false}` disables it on viewport
   * AND on hover (next 15.5 `link.d.ts`), so the anchor still renders, still
   * looks identical and still navigates - it just stops asking the server for a
   * page nobody has built. Keeping the link is deliberate: removing a
   * destination the designer drew is a scope decision, not an implementation
   * one. Delete this flag the moment the route lands.
   */
  prefetch?: false;
}

export interface NavDropdownItem extends NavLink {
  /**
   * DELIBERATE WIDENING of components.md S7.3, which types this `icon: IconName`
   * (required). The six dropdown-row glyphs live on `94:850` / `63:350`, which
   * sit outside the `672:246` FOR BUILD section that `iconography-expert`
   * traversed - so they were never exported and no file exists for four of them.
   * Per D-023 the slot is reserved and renders nothing rather than substituting
   * an invented glyph. Two rows (X, Instagram) do have a genuine glyph match in
   * the exported set and use it.
   */
  icon?: IconName;
  description?: string;
  /**
   * The row's hover glyph - `771:303` (Products) and `776:464` (Socials), which
   * supersede the tinted-row design and its `accent` field. Every row now draws
   * a white bordered tile whose glyph is a grey OUTLINE at rest and this filled,
   * coloured mark on hover/focus - the connected hover states in the component
   * prototypes. Which filled mark a row swaps to is not derivable from its
   * label or href, so it is content, exactly as the accent was.
   *
   * Optional for the same D-023 reason `icon` is: a row missing either half of
   * the pair renders whichever half exists, statically, rather than inventing
   * artwork.
   */
  iconFilled?: IconName;
}

export interface NavItem extends Omit<NavLink, "href"> {
  /**
   * DELIBERATE WIDENING of components.md S7.3, which has `NavItem extends
   * NavLink` and therefore requires an href on every entry. The two dropdown
   * parents are `<button>` triggers, not links (layout.md S9 row 1: "Trigger is
   * a `<button>` (never an `<a>`)"), and no `/products` or `/socials` route
   * exists in D-002's sitemap. A required href here could only ever be a
   * fabricated dead link, so it is optional and the two parents omit it.
   */
  href?: string;
  items?: readonly NavDropdownItem[];
}

/**
 * The single source of truth for every "Chat with Azza" destination on the site.
 * QrBadge and UseAzzaToday both import WHATSAPP_CHAT_URL from here - do not
 * redeclare it locally.
 *
 * Source: Figma node `498:631`, the contact number in the footer, also recorded
 * twice in responsive.md (S189, S899) as an overflow-wrap case. `07041900011`
 * in E.164 form: drop the leading 0, prefix 234.
 *
 * CONFIRMED by the operator on 2026-08-02 (DECISIONS D-041): this is the
 * WhatsApp destination. It was an inference until then - the design labels
 * 498:631 only as a contact number beside hq@azza.com - and is now settled.
 */
const WHATSAPP_NUMBER = "2347041900011";

export const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * THE TEAM'S OWN CHAT - a different number from the bot above (2348146843432),
 * supplied by the operator on 2026-09-07 for the footer's "Chat with the team"
 * and extended on 2026-09-08 to "Help & Support" and the business page's
 * "Contact the team" CTAs. The prefilled text is the operator's, verbatim
 * (so the team can see the message came from the site). The one place this
 * URL lives; the footer, the business cards and anything else that means
 * "talk to a person, not the bot" imports it from here.
 */
export const WHATSAPP_TEAM_URL =
  "https://api.whatsapp.com/send/?phone=2348146843432&text=Hi+Victor%2C+Im+from+Azza+Website.&type=phone_number&app_absent=0";

/**
 * THE REAL ACCOUNTS - supplied by the operator on 2026-09-06, replacing the
 * empty-handle placeholders that resolved to each platform's home page.
 *
 * Canonical profile URLs, exactly as each platform's address bar shows them.
 * The operator's pasted links carried per-share tracking tokens (Instagram's
 * `stkn`, YouTube's `si`, TikTok's `_r`/`_t`) - those identify the person who
 * copied the link, not the profile, so they are stripped rather than shipped
 * on a public site. Note the handles genuinely differ per platform: `useazza`
 * on X and YouTube, `azza.hq` on Instagram, `useazza_` (trailing underscore)
 * on TikTok.
 *
 * Exported as the ONE place a profile URL lives: Help's community rows import
 * from here. D-037 still governs which PLATFORMS each surface shows; this
 * object only settles where each platform points.
 */
export const SOCIAL_URLS = {
  x: "https://x.com/useazza",
  instagram: "https://www.instagram.com/azza.hq",
  youtube: "https://www.youtube.com/@useazza",
  tiktok: "https://www.tiktok.com/@useazza_",
} as const;

/** Products - REDESIGNED, now `771:303` (was `94:850`). Same three rows, same
 * copy verbatim; the tinted rows are gone and each row hover-swaps its outline
 * glyph for the filled, coloured one - see `NavDropdownItem.iconFilled`.
 *
 * The outline glyphs are unchanged: `771:303` re-exports the identical artwork
 * the r2 icon sweep already transcribed (507:820 / 507:835 / 507:840), verified
 * path-for-path. Hrefs follow the D-002 route map. */
const PRODUCT_ITEMS: readonly NavDropdownItem[] = [
  {
    label: "Crypto Wallet",
    description: "Crypto made accessible.",
    href: "/products/crypto-wallet",
    icon: "wallet",
    iconFilled: "wallet-filled",
  },
  {
    label: "Cross-Border Payments",
    description: "Make payments across borders.",
    href: "/products/cross-border-payments",
    // 507:835. The design's own glyph for this row carries a YEN mark - see
    // DECISIONS D-036. Shipped verbatim; swapping a currency symbol on an
    // Africa-corridor product is the operator's call, not an implementer's.
    // Its filled counterpart (775:331) draws the same mark.
    icon: "money-bag",
    iconFilled: "money-bag-filled",
  },
  {
    label: "Azza Business",
    description: "Set up your business account.",
    href: "/products/for-business",
    icon: "briefcase",
    iconFilled: "briefcase-filled",
  },
];

/**
 * Socials - REDESIGNED AGAIN, now `776:464` (supersedes `765:340`, which
 * superseded the flat `63:350`). Same three destinations; the labels are new
 * copy, transcribed verbatim ("Follow on ..." / "Subscribe to ..."), and the
 * full-colour brand marks moved from the resting state to the HOVER state.
 *
 * At rest each row draws a grey Fluent outline. These are the design's own
 * 24px `_regular` exports (776:449 / 776:451 / 776:459), which are NOT the
 * existing `social-*` entries - those are 22- and 16-viewBox drawings with
 * different optical insets, still used by the Help page and blog share row.
 * On hover the outline swaps to the filled mark: X's block is the existing
 * `brand-x` artwork (identical paths, verified), while Instagram and YouTube
 * draw NEW flat marks (#FF0069 / #FF4040) - not `brand-instagram`'s gradient
 * squircle or `brand-youtube`'s red lozenge, so those two get their own
 * `-filled` entries and the `brand-*` pair joins `social-youtube` as recorded,
 * deliberate orphans.
 *
 * NOTE (DECISIONS D-037): the design contains THREE disagreeing social sets -
 * nav = X/Instagram/YouTube, Help = X/Instagram/WhatsApp, blog share =
 * X/Instagram/TikTok/link - and the footer has none. This list is the nav's.
 * Do not reconcile it against the others here.
 */
const SOCIAL_ITEMS: readonly NavDropdownItem[] = [
  {
    label: "Follow on X (Twitter)",
    href: SOCIAL_URLS.x,
    icon: "social-x-regular",
    iconFilled: "brand-x",
  },
  {
    label: "Follow on Instagram",
    href: SOCIAL_URLS.instagram,
    icon: "social-instagram-regular",
    iconFilled: "social-instagram-filled",
  },
  {
    label: "Subscribe to YouTube",
    href: SOCIAL_URLS.youtube,
    icon: "social-youtube-regular",
    iconFilled: "social-youtube-filled",
  },
  /*
   * NOT IN 776:464 - the drawn dropdown authors three rows. The TikTok row is
   * an operator addition (2026-09-06, supplied with the real account URLs).
   * TikTok's flat brand mark is a solid silhouette with no outline variant, so
   * the rest state reuses the share row's `share-tiktok-filled` (a
   * currentColor shape - the tile's grey token paints it, matching the other
   * rows' rest ink) and the hover state gets `social-tiktok-filled`, the same
   * path baked black the way `brand-x`'s hover block is.
   */
  {
    label: "Follow on TikTok",
    href: SOCIAL_URLS.tiktok,
    icon: "share-tiktok-filled",
    iconFilled: "social-tiktok-filled",
  },
];

/**
 * The bar destinations, in design order (412:2077 / 412:2081 / 412:2085).
 *
 * "ABOUT US" IS RETIRED (operator, 2026-09-08: "remove the about page").
 * 412:2086 drew it, but `/about` never had a frame in the Figma file nor a
 * route in the D-002 sitemap - the link only ever pointed at a page that did
 * not exist, which is why it carried `prefetch: false`. It is kept here as a
 * comment rather than deleted so the day an About page is designed the entry
 * goes back in one line, in its designed position:
 *
 *   { label: "About Us", href: "/about", prefetch: false },
 *
 * TopNav and MobileNavPanel both render this list, so the bar and the sheet
 * lose the item together.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Products", items: PRODUCT_ITEMS },
  { label: "Socials", items: SOCIAL_ITEMS },
  { label: "Blog", href: "/blog" },
];

/** 412:2087 - the product's entire conversion action. */
export const NAV_CTA: NavLink = {
  label: "Chat with Azza",
  href: WHATSAPP_CHAT_URL,
};
