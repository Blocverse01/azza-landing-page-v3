/**
 * Footer link data - design/components.md S7.4.
 *
 * Every label below is transcribed verbatim from Figma `498:599` and re-verified
 * against `500:2385`; all eight footer placements are byte-identical, so there is
 * no variant and no prop.
 *
 *   498:615-618  Products     Crypto Wallet / Cross-Border Payments / Azza Business
 *   498:620-623  Resources    Blog / Documentation / Help & Support
 *   498:625-628  Company      Media Kit / Privacy Policy / Terms of Use
 *   498:630-632  Contact Us   07041900011 / hq@azza.com  (the number was replaced by
 *                             "Chat with the team" on 2026-09-07 - see the column)
 *   498:612      RC line      "RC: 7810789"
 *   498:635/636  legal row    "(c) 2026 - Use Azza LTD"  /  "All rights reserved."
 *
 * No label and no href is hard-coded inside a component - the Footer renders
 * entirely from this module.
 */

/**
 * `{ label, href }`.
 *
 * design/components.md S7.3 declares the same shape in `src/content/navigation.ts`,
 * which a DIFFERENT agent wrote in that wave. Importing the TYPE would have been
 * exactly the same-wave content dependency that S8/S13.2 exists to prevent, so
 * the shape is restated; the two are structurally identical and TypeScript
 * treats them as one type at every call site. (The wave is long over - the
 * `WHATSAPP_TEAM_URL` VALUE is now imported from there, because a URL that
 * appears in three places must live in one.)
 */
import { WHATSAPP_TEAM_URL } from "./navigation";

export interface NavLink {
  label: string;
  href: string;
  /**
   * Passed straight to `next/link`'s `prefetch`. Set only on the destinations
   * the design NAMES but the D-002 sitemap has no route for (see the routing
   * note on `FOOTER_COLUMNS`).
   *
   * Next's App Router prefetches every in-viewport `<Link>`, and the footer is
   * on all seven routes - so three non-existent routes were being requested,
   * and 404ing, on every page load. `prefetch={false}` disables it on viewport
   * AND on hover (next 15.5 `link.d.ts`). The anchor is untouched: same markup,
   * same treatment, same destination. Delete the flag when the route lands.
   */
  prefetch?: false;
  /**
   * "brand" inks the link in Azza blue (`link.on-inverse-brand`) instead of the
   * column grey. One consumer: the footer's "Chat with the team" (operator
   * request, 2026-09-07), a highlighted contact affordance where the design
   * once printed a phone number.
   */
  tone?: "brand";
}

export interface FooterColumn {
  heading: string;
  links: readonly NavLink[];
}

/**
 * Four columns of unequal measured width - Products 199, Resources 128,
 * Company 116, Contact 119 (design/layout.md S5.2). They are laid out with
 * `flex`, never a grid, at the designed 4-up arrangement: a grid would equalise
 * widths the design deliberately does not equalise (components.md S7.4).
 *
 * ROUTE TARGETS. design/DECISIONS.md D-002 invents the seven routes from the
 * frame names. Four footer labels had no frame and therefore no route:
 * Documentation, Media Kit, Privacy Policy and Terms of Use. Each is pointed at
 * the path its label names rather than at a placeholder or at a near-miss route;
 * reversing any of them is a one-line change here and touches no component.
 *
 * TWO OF THE FOUR HAVE LANDED. `/privacy-policy` and `/terms-of-use` were built
 * on 2026-09-01 from operator-supplied documents, at exactly the paths this
 * table already named, so both dropped `prefetch: false` - the flag exists to
 * stop the browser requesting a page that does not exist, and these now do.
 * Documentation and Media Kit are PARKED as comments (operator, 2026-09-08)
 * until there is something to link to; the Resources column runs two links
 * and Company three in the meantime.
 */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "Products",
    links: [
      { label: "Crypto Wallet", href: "/products/crypto-wallet" },
      {
        label: "Cross-Border Payments",
        href: "/products/cross-border-payments",
      },
      { label: "Azza Business", href: "/products/for-business" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      // PARKED (operator, 2026-09-08): no documentation exists to link to yet.
      // Restore this line when it does - the route it names is still the one.
      // { label: "Documentation", href: "/docs", prefetch: false },
      //
      // "Help & Support" goes to the team's WhatsApp, not `/help` (operator,
      // 2026-09-08: it "should redirect to the number Chat with the team has").
      // The `/help` route itself still builds and is reachable by URL; only
      // the footer stops pointing at it.
      { label: "Help & Support", href: WHATSAPP_TEAM_URL },
    ],
  },
  {
    heading: "Company",
    links: [
      // PARKED (operator, 2026-09-08): no media kit exists to link to yet.
      // Restore this line when it does - the route it names is still the one.
      // { label: "Media Kit", href: "/media-kit", prefetch: false },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
  {
    heading: "Contact Us",
    links: [
      // Operator request, 2026-09-07: the design's phone number (498:630,
      // "07041900011") is replaced by a WhatsApp deep link to the team, inked
      // in Azza blue. The prefilled text is the operator's, verbatim.
      {
        label: "Chat with the team",
        href: WHATSAPP_TEAM_URL,
        tone: "brand",
      },
      { label: "hq@azza.com", href: "mailto:hq@azza.com" },
    ],
  },
];

export const FOOTER_LEGAL: {
  rc: string;
  copyright: string;
  rights: string;
} = {
  rc: "RC: 7810789",
  // The Figma node carries a second, empty line (a lone zero-width space). It is
  // a source artefact with no content and is not reproduced.
  copyright: "© 2026 - Use Azza LTD",
  rights: "All rights reserved.",
};
