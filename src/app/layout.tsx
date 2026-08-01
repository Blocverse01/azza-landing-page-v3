import type { Metadata } from "next";

import { SITE } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.description,
};

/*
 * Fonts are deliberately not wired here. The typeface set is derived from the
 * design in Phase 1 (design/typography.md); loading one now would be a guess.
 * When it lands, add the `next/font` loaders here and expose them as CSS
 * variables on <html>, then reference those variables from tokens.json.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
