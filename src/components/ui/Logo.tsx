import Link from "next/link";

import { cn } from "@/lib/cn";

import { Icon } from "./Icon";

const HOME_LABEL = "Azza — home";

export interface LogoProps {
  /** wordmark -> 95x32 (footer) / 59.4x20 (nav).  mark -> 40x40 app mark (FAQ). */
  variant?: "wordmark" | "mark";
  /** Rendered height in px; width follows the aspect ratio. Default 32 / 40. */
  height?: number;
  /** Wraps in a link to `/`. Accessible name "Azza - home". Default false. */
  asHomeLink?: boolean;
  className?: string;
}

/**
 * The Azza logo.
 *
 * Single source: `design-system/icons/logo-azza-wordmark.svg` and
 * `logo-azza-mark.svg`, via the Icon glyph map.
 * `design-system/assets/brand/logo-azza-wordmark.svg` is a duplicate export of
 * the same node (498:604) and is imported by nothing - components.md S11 C-3.
 *
 * When it is a link, the accessible name lives on the LINK and the glyph is
 * decorative. One accessible name, never two.
 */
export function Logo({
  variant = "wordmark",
  height,
  asHomeLink = false,
  className,
}: LogoProps) {
  const name = variant === "wordmark" ? "logo-azza-wordmark" : "logo-azza-mark";
  const size = height ?? (variant === "wordmark" ? 32 : 40);

  if (asHomeLink) {
    return (
      <Link
        href="/"
        aria-label={HOME_LABEL}
        className={cn("inline-flex items-center", className)}
      >
        <Icon name={name} size={size} />
      </Link>
    );
  }

  return (
    <Icon
      name={name}
      size={size}
      title={variant === "wordmark" ? "Azza" : undefined}
      className={className}
    />
  );
}
