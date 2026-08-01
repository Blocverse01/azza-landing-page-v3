import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { FAQ_ANSWER_PENDING } from "@/content/faq";

export interface FaqAnswerPanelProps {
  /** Whether this row's answer is the one on show. */
  open: boolean;
  /** Spread verbatim from `Disclosure` - id, role, aria-labelledby, hidden. */
  panelProps: HTMLAttributes<HTMLDivElement>;
  answer: string;
}

/**
 * One answer bubble - `412:1573` and its three siblings.
 *
 * WHY `hidden` IS OVERRIDDEN (orchestrator ruling D-030)
 * -----------------------------------------------------
 * `Disclosure` supplies `hidden: !open` because components.md S4.11 lists it,
 * while S10.5 mandates the panel animate `grid-template-rows: 0fr -> 1fr`.
 * `hidden` computes to `display: none`, which cannot transition, so the two
 * cannot both hold. The ruling: spread `panelProps`, override
 * `hidden={undefined}`, and mark the collapsed panel `inert`.
 *
 * Dropping `hidden` on its own would be the worse defect - it leaves a 0fr row
 * whose children are still in the focus order, so Tab would land on invisible
 * content. `inert` takes the subtree out of both the focus order and the
 * accessibility tree while leaving it laid out, painted and animatable.
 *
 * TWO PRESENTATIONS, ONE ELEMENT (responsive.md S7.2.5, components.md S10.5)
 * -------------------------------------------------------------------------
 * Below `lg` this is a plain accordion panel: the height animates on the grid
 * row, and the content crossfades a beat behind it (40ms in, none out).
 *
 * At `lg`+ every panel is placed in the SAME grid cell in column 2, so the
 * column holds a fixed footprint and nothing reflows as the selection moves.
 * There the height must not animate at all - only opacity - which is why the
 * row track is pinned to 1fr from `lg` up.
 *
 * REDUCED MOTION - S10.10 tier 2. The state change still happens, instantly.
 * The `motion-reduce:transition-none` branches are explicit rather than left to
 * the global floor in theme.css, and neither branch can leave an open panel at
 * `opacity: 0` or clipped at `0fr`: the open classes set the final state
 * outright, and only the transition between states is removed.
 */
export function FaqAnswerPanel({
  open,
  panelProps,
  answer,
}: FaqAnswerPanelProps) {
  const pending = answer === FAQ_ANSWER_PENDING;

  return (
    <div
      {...panelProps}
      hidden={undefined}
      inert={!open}
      /* Machine-readable marker for the 14 questions the design never answered.
       * No visual effect - it exists so an audit can count them. */
      data-answer-pending={pending ? "true" : undefined}
      className={cn(
        "relative grid px-3 sm:px-4",
        // <lg: the accordion height animation. S10.5 - never max-height.
        "transition-[grid-template-rows] duration-(--motion-base) ease-in-out",
        "motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        // lg+: every panel stacks in column 2, spanning the question rows, and
        // the height is pinned so only the crossfade moves.
        "lg:col-start-2 lg:row-start-2 lg:[grid-row-end:-1] lg:self-start",
        // Row 2 begins at the first question's MARGIN box, 12px above the row
        // itself, so -8 here lands the bubble 20px above the first question -
        // the offset measured on 412:1573 (top 150) against 412:1562 (top 170).
        "lg:-mt-2 lg:grid-rows-[1fr] lg:px-0",
        "lg:transition-opacity lg:ease-out",
        open ? "lg:opacity-100" : "lg:pointer-events-none lg:opacity-0",
      )}
    >
      {/* The clipping row. `min-h-0` is what lets a grid child shrink below its
       * content height - without it the 0fr track has no effect at all. */}
      <div className="min-h-0 overflow-hidden">
        <div
          className={cn(
            // The 12px gap to the question above lives INSIDE the animated box,
            // so a closed panel contributes exactly zero height.
            "pt-3 lg:pt-0",
            "transition-opacity duration-(--motion-fast)",
            "motion-reduce:transition-none",
            open
              ? "opacity-100 delay-[40ms] ease-out"
              : "opacity-0 delay-0 ease-in",
            // At lg the outer element owns the crossfade instead.
            "lg:opacity-100 lg:delay-0 lg:duration-(--motion-base) lg:ease-out",
          )}
        >
          <div
            className={cn(
              "rounded-bubble bg-accordion-answer shadow-card",
              "px-6 py-6 sm:px-10 sm:py-8",
              "text-base-answer text-accordion-answer-fg",
            )}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
