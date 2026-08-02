import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

const SURFACE_CLASS: Record<NonNullable<CardProps["surface"]>, string> = {
  page: "bg-surface-page",
  raised: "bg-surface-raised",
  contrast: "bg-surface-contrast",
  "brand-subtle": "bg-surface-brand-subtle",
  "accent-violet": "bg-surface-accent-violet",
  "accent-violet-subtle": "bg-surface-accent-violet-subtle",
};

/*
 * `2xl` (16) was missing, so the union jumped 12 -> 20 and a consumer whose
 * measured radius was 16 had to pass `radius="xl"` and then win a class fight
 * with `rounded-2xl!`. `cn` deliberately does not merge, so that fight is
 * decided by Tailwind's emission order rather than by the caller - the step
 * belongs in the union (D7).
 */
const RADIUS_CLASS: Record<NonNullable<CardProps["radius"]>, string> = {
  xl: "rounded-xl", // 12
  "2xl": "rounded-2xl", // 16
  "3xl": "rounded-3xl", // 20 - default
  "4xl": "rounded-4xl", // 24
  "5xl": "rounded-5xl", // 32
  "6xl": "rounded-6xl", // 36
  "7xl": "rounded-7xl", // 48
};

export interface CardProps {
  surface?:
    | "page"
    | "raised"
    | "contrast"
    | "brand-subtle"
    | "accent-violet"
    | "accent-violet-subtle";
  radius?: "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  /** line-subtle. Defaults to true when surface="raised". */
  bordered?: boolean;
  /**
   * Adds position:relative so a StretchedLink child can cover the card, plus
   * the hover-lift treatment and its :has(a:focus-visible) twin.
   */
  interactive?: boolean;
  as?: "div" | "article" | "li";
  className?: string;
  children: ReactNode;
}

/**
 * The card surface.
 *
 * `interactive` gives the whole card the affordance rather than the link
 * inside it: a `translateY(-4px)` lift plus `shadow.hover-lift`, mirrored on
 * `:has(a:focus-visible)` so a keyboard user gets exactly the same signal.
 *
 * The lift is `translateY` only. Scaling a text-bearing card resamples the type
 * and reads cheap next to a 164px display face (components.md S10.6).
 *
 * THE TRANSITION LISTS `translate`, NOT `transform`. In Tailwind v4
 * `-translate-y-1` sets the standalone `translate` property; it does not touch
 * `transform`. So `transition-[transform,box-shadow]` transitioned nothing that
 * moves, and the card jumped 4px instantly while its shadow faded over 240ms.
 * Verified in a browser: computed `transition-property` read
 * "transform, box-shadow" while the animated property was `translate`.
 */
export function Card({
  surface = "page",
  radius = "3xl",
  bordered,
  interactive = false,
  as = "div",
  className,
  children,
}: CardProps) {
  const Tag: ElementType = as;
  const showBorder = bordered ?? surface === "raised";

  return (
    <Tag
      className={cn(
        SURFACE_CLASS[surface],
        RADIUS_CLASS[radius],
        showBorder ? "border border-line-subtle" : undefined,
        interactive
          ? cn(
              "relative transition-[translate,box-shadow] duration-(--motion-base) ease-out",
              "hoverable:-translate-y-1 hoverable:shadow-hover-lift",
              "has-[a:focus-visible]:-translate-y-1 has-[a:focus-visible]:shadow-hover-lift",
            )
          : undefined,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
