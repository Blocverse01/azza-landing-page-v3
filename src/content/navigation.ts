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
 * OUTSTANDING (DECISIONS D-034): the design labels 498:631 as a contact number
 * beside hq@azza.com. It does not state that it is the WhatsApp destination.
 * Treating it as such is the most faithful reading available - it is the only
 * number in the file and the product is a WhatsApp bot - but it is an inference
 * and the operator has been asked to confirm it.
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

/** Products - 94:850. Hrefs follow the D-002 route map. */
const PRODUCT_ITEMS: readonly NavDropdownItem[] = [
  {
    label: "Crypto Wallet",
    description: "Crypto made accessible.",
    href: "/products/crypto-wallet",
  },
  {
    label: "Cross-Border Payments",
    description: "Make payments across borders.",
    href: "/products/cross-border-payments",
  },
  {
    label: "Azza Business",
    description: "Set up your business account.",
    href: "/products/for-business",
  },
];

/**
 * Socials - 63:350. `social-x` and `social-instagram` are the exported Fluent
 * outline glyphs and match the design's marks; there is no YouTube glyph in the
 * 21-name set, so that row reserves its slot and renders none (D-023).
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
  },
];

/**
 * The four bar destinations, in design order (412:2077 / 412:2081 / 412:2085 /
 * 412:2086).
 *
 * `/about` has no frame in the Figma file and no route in the D-002 sitemap.
 * The label is the designer's, so the destination is kebab-cased from it the
 * same way every other route was, and the gap is raised rather than papered
 * over by pointing the link at a page that exists but is not About Us.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Products", items: PRODUCT_ITEMS },
  { label: "Socials", items: SOCIAL_ITEMS },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
];

/** 412:2087 - the product's entire conversion action. */
export const NAV_CTA: NavLink = {
  label: "Chat with Azza",
  href: WHATSAPP_CHAT_URL,
};
