"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { TopNav } from "@/components/layout/TopNav";
import { SkipLink } from "@/components/ui";

export interface SiteChromeProps {
  /** The route's own tree. Passed straight through, so it stays server-rendered. */
  children: ReactNode;
}

/**
 * The chrome every one of the seven routes wears: skip link, top nav, the
 * single `<main>` landmark, footer (components.md S1).
 *
 * WHY THIS FILE CARRIES `"use client"`, which components.md S3 does not list.
 * `TopNavProps.currentPath` is required and is what drives `aria-current="page"`
 * on the active nav item and dropdown row (responsive.md S6.3). Next's App
 * Router gives a layout no way to know its own pathname on the server - there
 * is no `pathname` prop, no header, and `usePathname` is a client hook - so the
 * value can only come from a client boundary. Rendering the chrome from one is
 * the smallest such boundary that exists: `children` arrives as a prop from the
 * server layout, so every route's sections stay server components and none of
 * their code reaches the browser bundle. `TopNav` was already a client
 * component. The measurable cost is `SkipLink` (one anchor) and `Footer` (links
 * and a watermark, no state) being hydrated as well.
 *
 * The alternative - taking `<Footer />` as a `ReactNode` prop so it renders on
 * the server - keeps the bundle a shade smaller but invents a prop no contract
 * describes and splits ownership of the chrome across two files. Recorded as a
 * finding rather than decided silently.
 *
 * `<main>` is `tabIndex={-1}` so `SkipLink` genuinely MOVES focus. A fragment
 * link to a non-focusable element only sets the sequential-focus starting point
 * in most engines; `document.activeElement` stays on `<body>`, and a screen
 * reader user is told nothing. The focus ring that follows comes from the
 * global `:focus-visible` rule and is deliberately not suppressed
 * (components.md S10.7) - landing on `<main>` outlined is how a keyboard user
 * sees the skip worked.
 *
 * No `Reveal` anywhere in here: components.md S10.4 excludes `TopNav` and
 * `Footer` from scroll entrances.
 */
export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  return (
    <>
      <SkipLink />
      <TopNav currentPath={pathname} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default SiteChrome;
