import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/*
 *  eyebrow -> text-2xs uppercase, py-2.5 px-3, border line-emphasis
 *             (412:1617, 412:1856, 412:2439, 412:2518)
 *  tag     -> text-xs, py-2 px-3, fill by `tone`           (500:2217 / 500:1838)
 *  cta     -> text-md, py-2.5 px-4, bg-action-quiet        (412:1292 "START NOW")
 *
 * The 10px vertical padding on eyebrow pills is deliberate and retained
 * (layout.md S1.3) - `py-2.5`, not rounded to 8 or 12.
 *
 * The tag ink is `fg.body`. It was `fg.brand`, which no blog chip in the file
 * uses: 500:2218 and 500:1839 are both `fg.body`.
 */
const VARIANT_CLASS: Record<NonNullable<PillProps["variant"]>, string> = {
  eyebrow:
    "text-2xs uppercase px-3 py-2.5 border border-line-emphasis text-fg-body",
  tag: "text-xs px-3 py-2 text-fg-body",
  cta: "text-md px-4 py-2.5 bg-action-quiet text-action-quiet-fg",
};

/*
 * The design draws the tag chip with TWO fills, chosen by what it sits on:
 *
 *   500:2217  surface.brand-subtle  - chip on a `surface.page` card
 *   500:1838  surface.page          - chip on the brand-subtle panel
 *
 * Shipping only the first put a brand-subtle chip on the brand-subtle hero
 * panel, where it is exactly invisible. This is a prop rather than a
 * `className` override because `cn` has no last-wins resolution - two `bg-*`
 * utilities on one element are resolved by Tailwind's emission order, not by
 * the caller (D7 / the `cn` doc comment).
 */
const TAG_TONE_CLASS: Record<NonNullable<PillProps["tone"]>, string> = {
  "brand-subtle": "bg-surface-brand-subtle",
  page: "bg-surface-page",
};

export interface PillProps {
  variant?: "eyebrow" | "tag" | "cta";
  /**
   * `variant="tag"` only - which of the two designed chip fills to paint.
   * `brand-subtle` (default) is the chip on a white card (500:2217); `page` is
   * the chip on a `surface.brand-subtle` panel (500:1838). Ignored by the
   * other variants, which have one fill each.
   */
  tone?: "brand-subtle" | "page";
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
  tone = "brand-subtle",
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
          ? // `transition-[color]`, NOT `transition-colors` - the latter's
            // property list includes `outline-color`, which makes the
            // :focus-visible ring interpolate from currentColor instead of
            // appearing at t=0. components.md S10.7.
            "no-underline transition-[color] duration-(--motion-fast) ease-out hoverable:text-link-hover focus-visible:text-link-hover"
          : undefined,
        VARIANT_CLASS[variant],
        variant === "tag" ? TAG_TONE_CLASS[tone] : undefined,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
