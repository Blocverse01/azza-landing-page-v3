import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface StretchedLinkProps {
  href: string;
  /** The visible link text. The ::after covers the nearest positioned ancestor. */
  children: ReactNode;
  className?: string;
}

/**
 * A link whose hit area is the whole of its nearest positioned ancestor -
 * pair it with a `relative` card (or `<Card interactive>` where the lift is
 * wanted).
 *
 * The visible text stays the accessible name, so the card announces as one
 * link rather than three. Only ONE StretchedLink may live inside a given
 * positioned ancestor; a second would sit underneath the first and be
 * unreachable by pointer.
 *
 * NO HOVER STATE, deliberately (operator request, 2026-08-22: "remove the
 * hover effects on the blog posts" - this primitive's one consumer is the
 * blog card). The link paints nothing on hover; `:focus-visible` keeps the
 * global 2px ring plus an INSTANT `link.hover` tint on the text - unanimated,
 * because a focus signal that fades in reads as lag (components.md S10.7).
 * A consumer that wants a hover treatment on the text brings it in through
 * `className` - the grid blog card's underline sweep (ArticleCard.tsx,
 * `TITLE_SWEEP`, 2026-08-23) is the one that does.
 */
export function StretchedLink({ href, children, className }: StretchedLinkProps) {
  const classes = cn(
    "no-underline after:absolute after:inset-0 after:content-['']",
    "focus-visible:text-link-hover",
    className,
  );

  const internal = href.startsWith("/") || href.startsWith("#");

  if (internal) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
