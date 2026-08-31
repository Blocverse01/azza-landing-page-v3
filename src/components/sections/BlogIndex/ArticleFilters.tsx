import { cn } from "@/lib/cn";

/**
 * The five cells of 802:630, in Figma order: 808:254, 808:259 … 808:262.
 *
 * "All" is not a category on `BlogPost`; it is the unfiltered state, and it
 * stays "All" as a VALUE because `AllArticles` compares against it. The design
 * paints it "All posts" (802:631), which is a label concern - see
 * `FILTER_LABEL`. The other four are exactly the `BlogPost["category"]` union,
 * and every one of them matches at least one post.
 */
export const CATEGORY_FILTERS = ["All", "Finance", "Education", "Crypto", "Technology"] as const;

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const FILTER_LABEL: Partial<Record<CategoryFilter, string>> = { All: "All posts" };

export interface ArticleFiltersProps {
  active: CategoryFilter;
  onChange: (next: CategoryFilter) => void;
  className?: string;
}

/**
 * Blog category filters - Figma 802:630, the 2026-08 operator revision of
 * 500:2207.
 *
 * WHAT THE REVISION CHANGED: the five text chips became a tab strip. Every
 * cell is a fixed 120 wide with 12px inset and an 8px gap to the next; the
 * strip is `self-stretch` against the 50px search field beside it, so the
 * cells fill the toolbar's height; and the selected cell is marked by a 2px
 * `line.emphasis` rule along its bottom edge (808:254) in `fg.primary` ink,
 * where the rest sit in `fg.muted` with no rule. The underline-on-text of the
 * original is gone with the chips. Labels are `Inter Medium 20 / 1.3 / -0.6px`
 * - `text-md` - in every state.
 *
 * No `"use client"` directive: this file is only ever imported by
 * `AllArticles`, which has one. components.md S3 is explicit that a file which
 * is client-bundle by import must not carry its own directive - it is noise and
 * it hides which files are real entry points.
 *
 * SEMANTICS. Still five `<button>`s inside a named `role="group"`, each
 * carrying `aria-pressed`, and NOT a `role="tablist"` even though the design
 * now draws them as tabs. Tabs own panels: selecting one shows that panel and
 * hides the others, and a screen reader announces "tab, 1 of 5" with that
 * contract implied. These are filters on a single list that also answers to a
 * search field - nothing is a panel, nothing about the URL changes - so
 * `aria-pressed` remains the attribute that maps onto what they do. The
 * selection is carried three ways, none of them hover or colour alone: the
 * bottom rule at rest, darker ink, and the accessibility tree.
 *
 * TARGET SIZE. Each cell is 120 x 50 beside the search field at `xl` and
 * 120 x 44 (`min-h-11`) when the toolbar stacks below it: responsive.md
 * S6.1's 44px floor either way, with the designed 8px of clear space between
 * adjacent targets.
 *
 * OVERFLOW. Five 120s and four 8s are 632; the container is narrower than that
 * below `md`, so the strip scrolls horizontally with proximity snapping. The
 * scroller is unconditional - where the strip fits it simply does not scroll -
 * which keeps the cells at their designed width instead of wrapping a tab
 * strip, which has no designed wrapped state. Because the cells fill the
 * scroller's height, the 2px focus ring would be clipped at the top and bottom
 * edges (and at the side edges while scrolled); it is drawn INSET instead
 * (`-outline-offset-2`), so it stays whole at every scroll position. The edge
 * fade responsive.md S7.4 suggests is still not implemented: a `mask-image` on
 * the scroller would fade that same ring.
 */
export function ArticleFilters({ active, onChange, className }: ArticleFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter articles by category"
      className={cn("flex min-w-0 snap-x snap-proximity gap-2 overflow-x-auto", className)}
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
              "inline-flex min-h-11 w-30 shrink-0 snap-start items-center justify-center",
              "text-md px-3 text-center whitespace-nowrap",
              // `border-b-2` in every state so selection never shifts the row by
              // 2px; only the colour changes. `transition-[color,border-color]`,
              // not `transition-colors` - the latter also animates
              // `outline-color`, and the focus ring must appear at t=0
              // (components.md S10.7).
              "border-b-2 transition-[color,border-color] duration-(--motion-fast) ease-out",
              "focus-visible:-outline-offset-2",
              selected
                ? "border-line-emphasis text-fg-primary"
                : cn(
                    "text-fg-muted border-transparent",
                    "hoverable:text-fg-body focus-visible:text-fg-body",
                    "active:text-link-active",
                  ),
            )}
          >
            {FILTER_LABEL[category] ?? category}
          </button>
        );
      })}
    </div>
  );
}
