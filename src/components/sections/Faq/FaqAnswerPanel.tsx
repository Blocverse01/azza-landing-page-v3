import type { CSSProperties, HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface FaqAnswerPanelProps {
  /** Whether this row's answer is the one on show. */
  open: boolean;
  /** Spread verbatim from `Disclosure` - id, role, aria-labelledby, hidden. */
  panelProps: HTMLAttributes<HTMLDivElement>;
  /** The authored answer. Always present - see `FaqItem` in content/faq.ts. */
  answer: string;
  /**
   * This answer's grid row at `lg`+ - the same line its question sits on,
   * i.e. `index + 2`.
   *
   * It has NO effect on the scripted path, where every panel deliberately
   * shares one cell (see below). It exists solely so the no-JS stylesheet in
   * `FaqQuestionList` can re-place each answer beside its own question: with
   * scripting off every panel is open at once, and a stack of open panels in a
   * single shared cell is a pile of superimposed text.
   */
  row: number;
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
 * `hidden={undefined}`, and take the collapsed subtree out of the focus order
 * and the accessibility tree by another means.
 *
 * Dropping `hidden` on its own would be the worse defect - it leaves a 0fr row
 * whose children are still in the focus order, so Tab would land on invisible
 * content.
 *
 * WHY THAT MEANS IS `visibility`, NOT `inert`
 * -------------------------------------------
 * D-030 names `inert`, and this file used it. `inert` is a CONTENT ATTRIBUTE,
 * and no stylesheet can reach it - which made the collapsed answer permanently
 * unreachable for a reader with scripting disabled. `open` here is React state
 * that, with no script, can never change: `Faq` opens `items[0]` and nothing
 * else ever opens, so on each of the four FAQ routes every panel but the first
 * was in the DOM and absent from the accessibility tree, at every width,
 * forever. The
 * `<noscript>` counterpart in `FaqQuestionList` can force `grid-template-rows`
 * and `opacity`; it could not have forced `inert` off.
 *
 * `visibility: hidden` is the substitute, and it is the codebase's own
 * precedent, not an invention: `HelpSidebar` records that its collapsed browse
 * panel "uses `visibility` rather than `inert` precisely because visibility can
 * carry an `lg:` override and `inert` cannot ... Both mechanisms remove the
 * subtree from the tab order, which is the property D-030 actually requires."
 * A `<noscript>` stylesheet is the same kind of CSS-reachable escape hatch as
 * an `lg:` override. `Disclosure` deliberately leaves this choice to the
 * consumer for exactly this reason, so nothing shared changes.
 *
 * Equivalence on the scripted path, property by property:
 *   layout          `visibility` and `inert` are both non-layout. Geometry
 *                   cannot move, and measurement confirms it does not.
 *   a11y tree       both remove the subtree.
 *   tab order       both remove the subtree. (Nothing in here is focusable
 *                   anyway - the panel holds one text node.)
 *   find-in-page    both exclude it.
 *   animation       `visibility` is in the transition list below, and CSS
 *                   interpolates it so that visible->hidden stays VISIBLE for
 *                   the whole duration and flips only at the end. The
 *                   close animation is therefore unchanged; by the time it
 *                   flips, the 0fr track and `overflow-hidden` have already
 *                   clipped the box to nothing. hidden->visible flips at once.
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
  row,
}: FaqAnswerPanelProps) {
  return (
    <div
      {...panelProps}
      hidden={undefined}
      /* The two hooks the no-JS stylesheet in `FaqQuestionList` needs: an
       * attribute selector it can target, and this row's line number so it can
       * be re-placed beside its own question at `lg`+. Neither has any effect
       * while scripting is on. */
      data-faq-panel=""
      style={{ "--faq-row": row } as CSSProperties}
      className={cn(
        "relative grid px-3 sm:px-4",
        // <lg: the accordion height animation. S10.5 - never max-height.
        // `visibility` rides the same duration - see the header for why it is
        // here rather than `inert`, and why it does not alter the animation.
        "transition-[grid-template-rows,visibility] duration-(--motion-base) ease-in-out",
        "motion-reduce:transition-none",
        open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        // lg+: every panel stacks in column 2, spanning the question rows, and
        // the height is pinned so only the crossfade moves.
        "lg:col-start-2 lg:row-start-2 lg:[grid-row-end:-1] lg:self-start",
        // Row 2 begins at the first question's MARGIN box, 12px above the row
        // itself, so -8 here lands the bubble 20px above the first question -
        // the offset measured on 412:1573 (top 150) against 412:1562 (top 170).
        "lg:-mt-2 lg:grid-rows-[1fr] lg:px-0",
        "lg:transition-[opacity,visibility] lg:ease-out",
        open ? "lg:opacity-100" : "lg:pointer-events-none lg:opacity-0",
      )}
    >
      {/* The clipping row. `min-h-0` is what lets a grid child shrink below its
       * content height - without it the 0fr track has no effect at all. */}
      <div className="min-h-0 overflow-hidden">
        <div
          data-faq-answer=""
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
