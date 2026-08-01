import type { CSSProperties, KeyboardEvent } from "react";

import { Disclosure, DisplayHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/content/faq";

import { FaqAnswerPanel } from "./FaqAnswerPanel";

export interface FaqQuestionListProps {
  items: readonly FaqItem[];
  /** The row currently showing its answer, or `null` when all are closed. */
  openId: string | null;
  onOpenChange: (id: string | null) => void;
}

const ROVING_KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);

/**
 * The question column and, interleaved with it, the answer panels.
 *
 * ONE DOM, TWO PRESENTATIONS, ZERO REORDERING (responsive.md S7.2.5)
 * -----------------------------------------------------------------
 * Every question is followed IN SOURCE ORDER by its own answer. Below `lg`
 * that is exactly what you see - a plain accordion. At `lg`+ CSS Grid alone
 * produces the designed two-pane look: questions run down column 1, and every
 * answer is placed in column 2 spanning rows 2 to the end, so they share one
 * cell and the open one is simply the one that is not transparent. No
 * duplicated markup, no `order:`, no breakpoint-conditional rendering.
 *
 * WHY EVERY ITEM IS PLACED EXPLICITLY AT `lg`
 * -------------------------------------------
 * The dark panel behind the questions is a decorative cell, not a wrapper -
 * it cannot wrap the questions because the answers sit between them in source
 * order and outside the panel on screen. A decorative cell overlaps the rows it
 * sits behind, and grid auto-placement REFUSES to put an auto-placed item in an
 * occupied cell: it would push the questions past the backdrop into empty rows.
 * So at `lg` nothing is auto-placed - each question carries its own row index
 * through `--faq-row` - and overlap becomes legal. Below `lg` none of those
 * placement rules apply and ordinary source-order auto-placement takes over.
 *
 * `grid-template-rows` is declared from `lg` up for the same reason: `-1`
 * resolves against the EXPLICIT grid, so on an implicit grid `2 / -1` would
 * silently collapse to a single row.
 *
 * FOCUS RING. `data-surface="inverse"` switches `:focus-visible` to the
 * inverse ring token (theme.css). The default ring is the brand blue, which is
 * close to unreadable against the near-black question rows.
 */
export function FaqQuestionList({
  items,
  openId,
  onOpenChange,
}: FaqQuestionListProps) {
  /*
   * Keyboard behaviour the design cannot express and the primitive does not
   * cover:
   *
   * Escape - `Disclosure` closes on Escape only while its own trigger holds
   * focus, and stops propagation when it does, so this handler is the path for
   * Escape pressed anywhere else in the accordion. It closes the open row and
   * moves focus back to that row's trigger, which is the half a keyboard user
   * actually notices.
   *
   * Arrow / Home / End - roving movement between triggers, the optional half of
   * the ARIA accordion pattern. Tab order is untouched: this only moves focus
   * when a trigger already has it, so nothing is trapped and nothing is skipped.
   */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const root = event.currentTarget;

    if (event.key === "Escape") {
      if (openId === null) return;
      event.stopPropagation();
      const trigger = readTriggers(root).find(
        (element) => element.dataset.faqTrigger === openId,
      );
      onOpenChange(null);
      trigger?.focus();
      return;
    }

    if (!ROVING_KEYS.has(event.key)) return;

    const target = event.target as HTMLElement;
    if (target.dataset?.faqTrigger === undefined) return;

    const triggers = readTriggers(root);
    const current = triggers.indexOf(target as HTMLButtonElement);
    if (current === -1) return;

    event.preventDefault();

    const last = triggers.length - 1;
    let next = current;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else if (event.key === "ArrowDown") next = current === last ? 0 : current + 1;
    else next = current === 0 ? last : current - 1;

    triggers[next]?.focus();
  }

  return (
    <div
      data-surface="inverse"
      onKeyDown={handleKeyDown}
      className={cn(
        "relative grid grid-cols-1 p-3 sm:p-4",
        "lg:grid-cols-[447fr_393fr] lg:gap-x-15 lg:p-0",
        "lg:[grid-template-rows:repeat(var(--faq-rows),auto)]",
      )}
      style={{ "--faq-rows": items.length + 1 } as CSSProperties}
    >
      {/* The dark panel `412:1560`. Absolute below `lg` so it backs the whole
       * accordion; a column-1 cell from `lg` up so it backs only the questions.
       * The -40px block bleed reproduces the panel's inset around its content. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-4xl bg-accordion-panel",
          "lg:static lg:col-start-1 lg:row-span-full lg:-my-10 lg:rounded-5xl",
        )}
      />

      {/*
       * `412:1572`. Rendered as a paragraph, not a heading: responsive.md
       * S7.2.5 pins the questions at `h3` under the section's `h2`, and slotting
       * a panel label between them would either break that or push every
       * question down a level.
       *
       * `swapIndices={[6]}` - components.md S4.10 tabulates `[4]` for all four
       * QUESTIONS nodes, which lands on the T. The Figma spans are "QUESTI" +
       * "O" + "NS", so the accent glyph is index 6. Reported in `findings`.
       */}
      <DisplayHeading
        as="p"
        step="display-6"
        swapIndices={[6]}
        swapWeight="medium"
        className={cn(
          "relative mb-7 px-3 text-accordion-row-fg sm:px-4",
          "lg:col-start-1 lg:row-start-1 lg:px-10",
        )}
      >
        QUESTIONS
      </DisplayHeading>

      {items.map((item, index) => (
        <Disclosure
          key={item.id}
          open={openId === item.id}
          onOpenChange={(next) => onOpenChange(next ? item.id : null)}
        >
          {({ open, triggerProps, panelProps }) => (
            <>
              <h3
                className={cn(
                  "relative mt-3 px-3 sm:px-4",
                  "lg:col-start-1 lg:px-10 lg:[grid-row:var(--faq-row)]",
                )}
                style={{ "--faq-row": index + 2 } as CSSProperties}
              >
                <button
                  {...triggerProps}
                  data-faq-trigger={item.id}
                  className={cn(
                    "w-full min-h-14 cursor-pointer rounded-lg text-left",
                    "border border-accordion-row-border bg-accordion-row",
                    "px-4 py-4 sm:px-6",
                    "text-lg text-accordion-row-fg",
                    "transition-colors duration-(--motion-fast) ease-out",
                    "motion-reduce:transition-none",
                    "hoverable:bg-accordion-row-hover",
                    // The open row keeps a persistent fill - the design's only
                    // selected-state affordance. There is no chevron on this
                    // accordion and inventing one would be new chrome.
                    "aria-expanded:bg-accordion-row-open",
                  )}
                >
                  {item.question}
                </button>
              </h3>

              <FaqAnswerPanel
                open={open}
                panelProps={panelProps}
                answer={item.answer}
              />
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}

function readTriggers(root: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-faq-trigger]"),
  );
}
