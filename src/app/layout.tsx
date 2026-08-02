import type { Metadata } from "next";
import { Bebas_Neue, Inter, Poppins } from "next/font/google";

import { SiteChrome } from "@/components/layout/SiteChrome";
import { SITE } from "@/lib/site";

import "./globals.css";

/* ---------------------------------------------------------------------------
 * Fonts - typography.md S2 + S9, through the components.md S12.3 seam.
 *
 * `theme.css` declares each family as `var(--font-x, "X"), <fallbacks>`, so
 * waves 2A-2C built and rendered in the literal fallback faces. These three
 * loaders are the other half of that seam: once the generated custom properties
 * exist on <html>, the same `theme.css` declaration resolves to the real face
 * with no edit there. Expect every display headline to reflow when they land -
 * that is the fonts arriving (D-031), not a regression.
 *
 * `display: "swap"` on all three. The display ramp runs to 164px; a FOIT at
 * that size is a visibly blank hero (typography.md S9).
 * ------------------------------------------------------------------------ */

/**
 * The text face - 84% of all segments (typography.md S2.3).
 *
 * Loaded as the VARIABLE font, which is what S2.3 asks for in prose ("Use the
 * variable font"); S9's reference snippet pins four static weights instead.
 * The variable file covers 400/500/600/700 and every other step the O-swap
 * spans need, in one request. Reported as an artifact inconsistency.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * The display face - operator directive, 2026-08-01 (D-011): Bebas Neue
 * replaces `Lemon`, and it is a decision rather than a stopgap.
 *
 * WEIGHT 400 AND ONLY 400. The family serves one weight. The design used Lemon
 * at three, so the hierarchy collapses to one weight and is carried by size and
 * tracking instead - which `theme.css` already varies, pinning every
 * `--text-display-*--font-weight` to 400. Asking for 600/700 anywhere on this
 * family gets browser-synthesised faux-bold, which is why the request here is a
 * single-element array.
 */
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});

/**
 * The accent / numeric face. `Subjectivity` is absent from Figma's font service
 * and needs a purchased commercial web licence, so Poppins stands in for it
 * (typography.md S2.2, D-011). The load-bearing property is the perfectly
 * circular `O`, which is the whole reason the O-swap device works, and Poppins
 * preserves it.
 *
 * Five weights, mapped Light 300 / Medium 500 / Bold 700 / Extra Bold 800 /
 * Super 900 (typography.md S2.2). Poppins is not a variable family on Google
 * Fonts, so each is a separate static face.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "500", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

/*
 * `--font-cal-sans` is deliberately NOT loaded. Cal Sans is not on Google Fonts
 * and no `.woff2` exists anywhere under this project, so `next/font/local` has
 * nothing to point at (D-024). The custom property therefore stays undefined
 * and `--font-brand` falls through its own `var(--font-inter, "Inter")` arm, so
 * the five `brand-wordmark` segments render in Inter. Adding the file and one
 * `localFont()` call here is the entire fix; nothing else changes.
 */

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — money that moves on WhatsApp`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Send, receive, and spend money across borders, instantly on WhatsApp. " +
    "Crypto or local currency, without the usual stress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${poppins.variable}`}
    >
      <body>
        {/*
         * THE `Reveal` NO-JS COUNTERPART. Do not remove it (D-031, seam 1).
         *
         * `Reveal`'s hidden from-state (`opacity: 0; translateY(16px)`) lives in
         * `theme.css` inside `@media (prefers-reduced-motion: no-preference)`,
         * which correctly spares a reduced-motion user. It does NOT spare a
         * no-JS user: `IntersectionObserver` never runs, `data-in` never becomes
         * `"true"`, and every revealed block stays invisible forever - to a
         * reader with scripting off and to any crawler that does not execute JS.
         * `theme.css` and `Reveal.tsx` both document this file as the
         * counterpart. Nothing in typecheck, lint or build can catch its
         * absence.
         *
         * CASCADE. `.reveal`'s from-state is in `@layer components`. These
         * declarations are unlayered AND `!important`, and important always
         * beats normal regardless of layer, so the override lands.
         *
         * `dangerouslySetInnerHTML` rather than a nested <style> element: with
         * scripting enabled the browser parses <noscript> content as raw text,
         * so hydrating a real child element against that text node is a
         * mismatch. Passing the markup as a string sidesteps it entirely.
         */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>.reveal{opacity:1!important;transform:none!important}</style>",
          }}
        />

        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
