import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/*
 *  eyebrow -> text-2xs uppercase, py-2.5 px-3, border line-emphasis
 *             (412:1617, 412:1856, 412:2439, 412:2518)
 *  tag     -> text-xs, py-2 px-3, bg-surface-brand-subtle  (500:1838 blog chip)
 *  cta     -> text-md, py-2.5 px-4, bg-action-quiet        (412:1292 "START NOW")
 *
 * The 10px vertical padding on eyebrow pills is deliberate and retained
 * (layout.md S1.3) - `py-2.5`, not rounded to 8 or 12.
 */
const VARIANT_CLASS: Record<NonNullable<PillProps["variant"]>, string> = {
  eyebrow:
    "text-2xs uppercase px-3 py-2.5 border border-line-emphasis text-fg-body",
  tag: "text-xs px-3 py-2 bg-surface-brand-subtle text-fg-brand",
  cta: "text-md px-4 py-2.5 bg-action-quiet text-action-quiet-fg",
};

export interface PillProps {
  variant?: "eyebrow" | "tag" | "cta";
  as?: "span" | "div" | "a" | "li";
  href?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Eyebrow / tag / badge. Always `rounded-pill`.
 *
 * When `href` is present the element renders as an `<a>` regardless of `as`,
 * because a clickable non-interactive element is never the right answer.
 */
export function Pill({
  variant = "eyebrow",
  as = "span",
  href,
  className,
  children,
}: PillProps) {
  const Tag: ElementType = href ? "a" : as;

  return (
    <Tag
      href={href}
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-pill",
        href
          ? "no-underline transition-colors duration-(--motion-fast) ease-out hoverable:text-link-hover focus-visible:text-link-hover"
          : undefined,
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
