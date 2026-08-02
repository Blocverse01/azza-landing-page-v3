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
   * fallback is a placeholder and MUST be replaced before a public deploy.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://azza.example",
} as const;
