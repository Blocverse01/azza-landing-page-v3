import type { IconName } from "@/components/ui";

/**
 * The single source of navigation data.
 *
 * `TopNav` and `Footer` both read from here; no nav label or href is written
 * inside a component. Contract: design/components.md S7.3.
 *
 * Copy is transcribed verbatim from the Figma nodes:
 *   bar          412:2066  (Products / Socials / Blog / About Us / Chat with Azza)
 *   Products     94:850    (three rows, title + description)
 *   Socials      63:350    (three rows, label only)
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
 * PLACEHOLDER - the design names the three social destinations but carries no
 * URLs and no handles. Empty handles resolve to each platform's own home page,
 * which is a real destination rather than an invented account.
 */
const SOCIAL_HANDLE = {
  x: "",
  instagram: "",
  youtube: "",
} as const;

/** Products - 94:850. Hrefs follow the D-002 route map.
 *
 * Icons landed after wave 2B: the r2 icon sweep exported the three glyphs this
 * dropdown draws (507:820 / 507:835 / 507:840), which the first pass missed
 * because it traversed only the 672:246 FOR BUILD section. Slots reserved here
 * under D-023 are now filled. */
const PRODUCT_ITEMS: readonly NavDropdownItem[] = [
  {
    label: "Crypto Wallet",
    description: "Crypto made accessible.",
    href: "/products/crypto-wallet",
    icon: "wallet",
  },
  {
    label: "Cross-Border Payments",
    description: "Make payments across borders.",
    href: "/products/cross-border-payments",
    // 507:835. The design's own glyph for this row carries a YEN mark - see
    // DECISIONS D-036. Shipped verbatim; swapping a currency symbol on an
    // Africa-corridor product is the operator's call, not an implementer's.
    icon: "money-bag",
  },
  {
    label: "Azza Business",
    description: "Set up your business account.",
    href: "/products/for-business",
    icon: "briefcase",
  },
];

/**
 * Socials - 63:350. `social-x` and `social-instagram` are the exported Fluent
 * outline glyphs and match the design's marks. The YouTube glyph (507:864) was
 * added by the r2 icon sweep after wave 2B, so this row no longer reserves an
 * empty slot.
 *
 * NOTE (DECISIONS D-037): the design contains THREE disagreeing social sets -
 * nav = X/Instagram/YouTube, Help = X/Instagram/WhatsApp, blog share =
 * X/Instagram/TikTok/link - and the footer has none. This list is the nav's,
 * transcribed from 63:350. Do not reconcile it against the others here.
 */
const SOCIAL_ITEMS: readonly NavDropdownItem[] = [
  {
    label: "X (Twitter)",
    href: `https://x.com/${SOCIAL_HANDLE.x}`,
    icon: "social-x",
  },
  {
    label: "Instagram",
    href: `https://www.instagram.com/${SOCIAL_HANDLE.instagram}`,
    icon: "social-instagram",
  },
  {
    label: "YouTube",
    href: `https://www.youtube.com/${SOCIAL_HANDLE.youtube}`,
    icon: "social-youtube",
  },
];

/**
 * The four bar destinations, in design order (412:2077 / 412:2081 / 412:2085 /
 * 412:2086).
 *
 * `/about` has no frame in the Figma file and no route in the D-002 sitemap.
 * The label is the designer's, so the destination is kebab-cased from it the
 * same way every other route was, and the gap is raised rather than papered
 * over by pointing the link at a page that exists but is not About Us. It
 * therefore carries `prefetch: false` - see `NavLink.prefetch`.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Products", items: PRODUCT_ITEMS },
  { label: "Socials", items: SOCIAL_ITEMS },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about", prefetch: false },
];

/** 412:2087 - the product's entire conversion action. */
export const NAV_CTA: NavLink = {
  label: "Chat with Azza",
  href: WHATSAPP_CHAT_URL,
};
