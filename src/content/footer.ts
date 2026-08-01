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
 *   498:630-632  Contact Us   07041900011 / hq@azza.com
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
 * which a DIFFERENT agent writes in this same wave. Importing it would be exactly
 * the same-wave content dependency that S8/S13.2 exists to prevent - if that module
 * lands late or deviates, this one stops compiling. The two are structurally
 * identical, so TypeScript treats them as the same type at every call site and
 * either import satisfies any consumer.
 */
export interface NavLink {
  label: string;
  href: string;
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
 * frame names. Four footer labels have no frame and therefore no route:
 * Documentation, Media Kit, Privacy Policy and Terms of Use. Each is pointed at
 * the path its label names rather than at a placeholder or at a near-miss route;
 * reversing any of them is a one-line change here and touches no component.
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
      { label: "Documentation", href: "/docs" },
      { label: "Help & Support", href: "/help" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Media Kit", href: "/media-kit" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
  {
    heading: "Contact Us",
    links: [
      // Kept in the authored local Nigerian format. Promoting it to +234 would
      // be inventing a country code the design never states.
      { label: "07041900011", href: "tel:07041900011" },
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
