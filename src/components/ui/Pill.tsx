import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/*
 *  eyebrow    -> text-2xs uppercase, py-2.5 px-3, border line-emphasis
 *                (412:1617, 412:1856, 412:2439, 800:316)
 *  eyebrow-md -> text-sm-eyebrow uppercase, same chrome at 16px (800:395 -
 *                the business narrative's pill, upsized from 12 in the
 *                2026-08 operator revision; the hero pill 800:316 stays 12)
 *  tag        -> text-xs, py-2 px-3, surface.page + line.subtle  (802:645)
 *  tag-md     -> text-sm-tag, same chrome at 16px                (802:840 -
 *                the featured article's chip on the revised /blog)
 *  cta        -> text-md, py-2.5 px-4, surface.page + line.cta hairline
 *                (412:1292 "START NOW"; it was `bg-action-quiet` - see below)
 *
 * The 10px vertical padding on eyebrow pills is deliberate and retained
 * (layout.md S1.3) - `py-2.5`, not rounded to 8 or 12.
 *
 * THE TAG CHIP IS OUTLINED NOW. The 2026-08 revision of /blog (802:569)
 * redraws every category chip as `surface.page` with a `line.subtle` border
 * (802:645, 802:840), replacing the original two-fill scheme (brand-subtle on
 * white cards, white on the lavender panel - 500:2217 / 500:1838). The `tone`
 * prop that chose between those fills is gone with the scheme; its only
 * consumer was ArticleCard. One fill again, and it reads on both grounds.
 *
 * The tag ink is `fg.body`. It was `fg.brand`, which no blog chip in the file
 * uses: 500:2218 and 500:1839 are both `fg.body`.
 *
 * THE CTA PILL IS OUTLINED TOO (operator ruling, 2026-08-23: "change the
 * lavender fill button for the white pill everywhere"). `action.quiet`'s
 * #F1F1FF fill is retired site-wide in favour of the white pill with the
 * `line.cta` (#DCDCDC) hairline that 521:572 / 802:848 draw; this is the same
 * chrome `Button variant="outline"` carries, on the one non-interactive pill
 * that wore the fill.
 */
const VARIANT_CLASS: Record<NonNullable<PillProps["variant"]>, string> = {
  eyebrow: "text-2xs uppercase px-3 py-2.5 border border-line-emphasis text-fg-body",
  "eyebrow-md": "text-sm-eyebrow uppercase px-3 py-2.5 border border-line-emphasis text-fg-body",
  tag: "text-xs px-3 py-2 border border-line-subtle bg-surface-page text-fg-body",
  "tag-md": "text-sm-tag px-3 py-2 border border-line-subtle bg-surface-page text-fg-body",
  cta: "text-md px-4 py-2.5 border border-line-cta bg-surface-page text-fg-body",
};

export interface PillProps {
  variant?: "eyebrow" | "eyebrow-md" | "tag" | "tag-md" | "cta";
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
export function Pill({ variant = "eyebrow", as = "span", href, className, children }: PillProps) {
  const Tag: ElementType = href ? "a" : as;

  return (
    <Tag
      href={href}
      className={cn(
        "rounded-pill inline-flex w-fit items-center justify-center",
        href
          ? // `transition-[color]`, NOT `transition-colors` - the latter's
            // property list includes `outline-color`, which makes the
            // :focus-visible ring interpolate from currentColor instead of
            // appearing at t=0. components.md S10.7.
            "hoverable:text-link-hover focus-visible:text-link-hover no-underline transition-[color] duration-(--motion-fast) ease-out"
          : undefined,
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
