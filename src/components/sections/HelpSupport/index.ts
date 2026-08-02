/**
 * The `/help` surface - `500:1736` (closed) + `500:2305` (opened), one route in
 * two states (D-001).
 *
 * ONLY `HelpSupport` is exported, deliberately.
 *
 * `HelpSidebar`, `HelpResourceGrid`, `HelpArticle` and `HelpBreadcrumb` carry no
 * `"use client"` directive of their own - they reach the client bundle by being
 * imported from `HelpSupport`, which does (components.md S3). Re-exporting them
 * here would let a server component import one directly, at which point
 * `HelpSidebar` would render `Disclosure` - a client component - with a
 * function as its child, and React would reject it at build time. The barrel is
 * the seam where that mistake becomes possible, so the seam stays closed.
 */
export { HelpSupport, type HelpSupportProps } from "./HelpSupport";
