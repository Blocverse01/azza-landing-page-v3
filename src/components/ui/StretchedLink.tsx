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
 * pair it with `<Card interactive>`.
 *
 * The visible text stays the accessible name, so the card announces as one
 * link rather than three. Only ONE StretchedLink may live inside a given
 * positioned ancestor; a second would sit underneath the first and be
 * unreachable by pointer.
 */
export function StretchedLink({
  href,
  children,
  className,
}: StretchedLinkProps) {
  const classes = cn(
    "no-underline after:absolute after:inset-0 after:content-['']",
    "transition-colors duration-(--motion-fast) ease-out",
    "hoverable:text-link-hover focus-visible:text-link-hover",
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
