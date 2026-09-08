/**
 * Site-wide constants.
 *
 * Infrastructure values only - no design values live here. Colours, type and
 * spacing come from tokens.json via `pnpm tokens`.
 */
export const SITE = {
  name: "AZZA",
  /**
   * Transcribed from the landing hero standfirst (412:789).
   *
   * This was the Phase 0 placeholder "AZZA website" until wave 2D. It was never
   * reassigned an owner, and it would have shipped as the meta description of
   * every route - `impl-routes-marketing` noticed and stopped consuming it
   * rather than propagate it. Left wrong, it was a plausible-looking default
   * waiting to be picked up again.
   */
  description:
    "Send, receive, and spend money across borders, instantly on WhatsApp. " +
    "Crypto or local currency, without the usual stress.",
  /**
   * Absolute base for OG/Twitter image URLs. Without it, Next resolves relative
   * asset paths against localhost and bakes `http://localhost:3000/...` into
   * the static HTML of every page carrying an image - which is what happened
   * to all ten article pages before `impl-routes-content` caught it.
   *
   * Override with NEXT_PUBLIC_SITE_URL at build time for the real domain. The
   * fallback is the brand's own domain as far as the site knows it (the
   * handles are `useazza`, the company is Use Azza LTD) - it was
   * `https://azza.example` until the 2026-09-08 SEO pass. Every canonical,
   * og:url, sitemap entry and JSON-LD id is built from it, so if the live
   * domain differs, SET THE VARIABLE; a wrong host here is a wrong canonical
   * on every page.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://useazza.com",
  /** The registered company, as the footer prints it ("Use Azza LTD"). */
  legalName: "Use Azza LTD",
  /** The contact address the footer publishes (operator, 2026-09-08 - the frame's hq@azza.com was never live). */
  email: "info@blocverse.com",
  /** The X handle, for `twitter:site` / `twitter:creator` - SOCIAL_URLS.x. */
  twitter: "@useazza",
  /**
   * Open Graph locale. The copy is British English ("authorised", "optimise")
   * and Facebook's locale list has no en_NG, so en_GB is the honest match.
   */
  locale: "en_GB",
} as const;
