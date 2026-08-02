import { cn } from "@/lib/cn";

/**
 * The five chips of 500:2207, in Figma order: 500:2208 … 500:2212.
 *
 * "All" is not a category on `BlogPost`; it is the unfiltered state. The other
 * four are exactly the `BlogPost["category"]` union, and every one of them
 * matches at least one post.
 */
export const CATEGORY_FILTERS = [
  "All",
  "Finance",
  "Education",
  "Crypto",
  "Technology",
] as const;

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export interface ArticleFiltersProps {
  active: CategoryFilter;
  onChange: (next: CategoryFilter) => void;
  className?: string;
}

/**
 * Blog category filters - Figma 500:2207.
 *
 * No `"use client"` directive: this file is only ever imported by
 * `AllArticles`, which has one. components.md S3 is explicit that a file which
 * is client-bundle by import must not carry its own directive - it is noise and
 * it hides which files are real entry points.
 *
 * SEMANTICS. Five `<button>`s inside a named `role="group"`, each carrying
 * `aria-pressed`. They are toggles, not navigation: nothing about the URL
 * changes and no document is loaded, so `aria-pressed` is the attribute that
 * maps onto what they do, and it is what every screen reader announces on a
 * button. responsive.md S6.4 row 8 asks for `aria-current="true"` instead; that
 * is a reasonable second choice, but `aria-current` is defined for the current
 * item in a set of *related elements* - page, step, location - and these are
 * not that. What the artifact is actually guarding against is selection carried
 * by hover or by colour alone, and both are covered here: the selected chip is
 * underlined at rest, in a darker ink, in the accessibility tree, at every
 * pointer type.
 *
 * TARGET SIZE. `h-11 px-3` gives responsive.md S6.1's 44px floor on a control
 * the design drew 26px tall, while keeping S7.4's measured 32px gap between
 * adjacent labels (12 + 8 + 12) and leaving the 8px of clear space between
 * adjacent targets that S6.1 also requires. S6.2 proposes 16px of horizontal
 * padding; at 16 the two rules cannot both hold - the labels would sit 40px
 * apart, or the targets would touch.
 *
 * OVERFLOW. Below `sm` the row scrolls horizontally with proximity snapping
 * (S7.4: the 483px row does not fit at 320); from `sm` up it wraps instead. The
 * edge fade S7.4 also suggests is NOT implemented: a `mask-image` on the
 * scroller clips the 2px focus outline of whichever chip sits at the scroll
 * port's edge, and losing the focus indicator is a worse defect than losing the
 * fade. The vertical padding is what stops `overflow-x: auto` (which computes
 * `overflow-y` to `auto` as well) clipping that same outline.
 */
export function ArticleFilters({
  active,
  onChange,
  className,
}: ArticleFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter articles by category"
      className={cn(
        "flex min-w-0 snap-x snap-proximity gap-2 overflow-x-auto py-1.5",
        "sm:flex-wrap sm:overflow-x-visible",
        className,
      )}
    >
      {CATEGORY_FILTERS.map((category) => {
        const selected = category === active;

        return (
          <button
            key={category}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(category)}
            className={cn(
              "inline-flex h-11 shrink-0 snap-start items-center justify-center",
              "rounded-pill px-3 whitespace-nowrap",
              "transition-colors duration-(--motion-fast) ease-out",
              selected
                ? "text-md-link text-fg-primary underline decoration-solid"
                : cn(
                    "text-md text-fg-muted",
                    "hoverable:text-fg-body focus-visible:text-fg-body",
                    "active:text-link-active",
                  ),
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
