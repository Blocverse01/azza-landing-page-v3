import { useRef } from "react";
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

/*
 * THE NO-JS COUNTERPART. Same shape as `layout.tsx`'s `.reveal` rescue,
 * `TopNav.tsx`'s nav fallback, `CardDeck.tsx`'s deck rescue and
 * `HelpSidebar.tsx`'s topic-tree rescue: a stylesheet only a browser with
 * scripting DISABLED ever applies.
 *
 * WHAT IT RESCUES. Which row is open is React state in `Faq.tsx`. With no
 * script it is set once - `items[0]` - and can never change again, so every
 * other answer is collapsed forever. Measured on the four FAQ routes with
 * `java_script_enabled=False`: one readable answer per route, at 390 and at
 * 1440 alike. This is not a breakpoint-gated collapse; it is total.
 *
 * THE PRESENTATION CHOSEN: a plain Q&A list.
 * An accordion without a script is not an accordion - it is a list of
 * questions with a control on each that does nothing. So every answer is
 * opened, and the chrome that encodes a CHOICE the visitor can no longer make
 * is suppressed. The question text itself is NOT suppressed: unlike
 * `HelpSidebar`'s "Browse topics" trigger, which is pure affordance and is
 * hidden outright, the FAQ trigger carries the question, and hiding it would
 * leave answers with nothing to answer.
 *
 * WHAT IT DOES.
 *   panel    opened on all three of the axes that collapse it. All three are
 *            needed: the 0fr track clips it, `visibility` keeps it out of the
 *            accessibility tree, and at `lg`+ opacity alone still hides it.
 *            Fixing fewer than three leaves the content unreachable by
 *            whichever route was missed.
 *   answer   the inner crossfade wrapper, opaque.
 *   trigger  `cursor: default`, because it no longer does anything, and the
 *            open-row fill neutralised - with every answer showing, a single
 *            highlighted row marks a selection that no longer exists. One
 *            declaration also lands the hover fill, which is normal-weight.
 *   travel   the `lg`+ directional offset zeroed. It positions each closed
 *            answer 8px off centre on its own side of the open one, which is
 *            meaningless when every answer is open at once - it would simply
 *            leave all but one of them sitting 8px out of line.
 *   lg+      each answer re-placed on its own question's row. This is the one
 *            rule that is not a simple revert: at `lg` every panel is
 *            deliberately placed in ONE shared cell in column 2, which is
 *            correct when exactly one is open and is a pile of superimposed
 *            text when all of them are. `--faq-row` is carried by the panel
 *            for this and only this. `grid-row: auto` is NOT an option - the
 *            backdrop occupies column 1 for the full row span, and grid
 *            auto-placement refuses an occupied cell, so it would push every
 *            answer past the end of the panel (see the header).
 *
 * Written as a string through `dangerouslySetInnerHTML` because once scripting
 * is ENABLED the browser parses <noscript> content as raw text, so hydrating
 * real element children against that text node is a mismatch. Every selector
 * is a `[data-faq-*]` attribute, so nothing outside this section is reachable.
 * `!important` beats the utilities it overrides for the reason `layout.tsx`
 * records: important always wins over normal, whatever the cascade layer.
 *
 * 64rem is `lg`. theme.css overrides only `xs` and `2xl`, so `lg` is Tailwind's
 * default and this media query and the `lg:` utilities switch together.
 */
const NO_JS_STYLE =
  "<style>" +
  "[data-faq-panel]{grid-template-rows:1fr!important;visibility:visible!important;" +
  "opacity:1!important;pointer-events:auto!important}" +
  "[data-faq-answer]{opacity:1!important}" +
  "[data-faq-trigger]{cursor:default!important;" +
  "background-color:var(--color-accordion-row)!important}" +
  "@media(min-width:64rem){[data-faq-panel]{grid-row:var(--faq-row)!important;" +
  "margin-top:0!important;translate:none!important}}" +
  "</style>";

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
 * THE TRAILING 40px TRACK - THE DARK PANEL'S BOTTOM PADDING
 * ---------------------------------------------------------
 * The panel is a decorative CELL, so it has no children to pad against; its
 * inset around the question list has to be produced by the grid instead. The
 * top 40 comes from the negative top margin below. The bottom 40 comes from
 * this extra, permanently empty track at the end of `grid-template-rows`: it
 * pushes the grid's bottom edge - and therefore the panel's, which stretches to
 * it - exactly 40px past the last question.
 *
 * Expressing it as a track rather than a bottom bleed is what makes the two
 * edges independent. The panel's top overhangs the grid (bleed 40) and its
 * bottom must NOT (bleed 0), because the card's own 24px bottom padding is what
 * separates the panel from the card border. A symmetric `-my-10` gets the top
 * right and overruns the card by 16px at the bottom, where `overflow-hidden`
 * clips the panel's rounded corners off.
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
  /*
   * The anchor for the directional travel at `lg`+ (see `FaqAnswerPanel`).
   * Each panel is told whether it sits above, on, or below the open row, and
   * rests on that side until it is the one selected.
   *
   * The ref is what makes Escape behave. Escape closes every row, and with no
   * open index the anchor would jump to 0 and slide every panel that is ALREADY
   * FADING OUT sideways on its way. Holding the last open index keeps the
   * closing frame still, and the next selection travels from where the visitor
   * last left off. Writing it during render is safe because it is idempotent -
   * the same render always computes the same value.
   */
  const openIndex = items.findIndex((item) => item.id === openId);
  const lastOpenIndex = useRef(0);
  if (openIndex !== -1) lastOpenIndex.current = openIndex;
  const anchor = openIndex === -1 ? lastOpenIndex.current : openIndex;

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
        // One auto row for QUESTIONS, one per question, then the empty 40px
        // track that becomes the dark panel's bottom padding (see the header).
        "lg:[grid-template-rows:repeat(var(--faq-rows),auto)_40px]",
      )}
      style={{ "--faq-rows": items.length + 1 } as CSSProperties}
    >
      {/*
       * The `hidden` ATTRIBUTE on the <noscript> itself, exactly as
       * `HelpSidebar.tsx` records. With scripting disabled a <noscript> renders
       * as a normal inline box, and this element is a grid container - so an
       * unstyled one would become a grid item and take a cell, on precisely the
       * browsers this block exists to serve. `display: none` does not stop the
       * <style> inside from applying; a stylesheet's effect is independent of
       * its own box.
       */}
      <noscript hidden dangerouslySetInnerHTML={{ __html: NO_JS_STYLE }} />

      {/* The dark panel `412:1560`. Absolute below `lg` so it backs the whole
       * accordion; a column-1 cell from `lg` up so it backs only the questions.
       *
       * The bleed is ASYMMETRIC, because the panel's two insets are produced by
       * different things. Top: -40 lifts the panel above the card's 68px top
       * padding to y=28, the design's value. Bottom: none - the panel stretches
       * to the grid's bottom edge, which the trailing 40px track has already
       * placed 40px below the last question, and which the card's `pb-6` then
       * holds 24px clear of the card border. Design: panel 447x660 at (28,28)
       * inside a 712-tall card, i.e. 24px of card below the panel. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-4xl bg-accordion-panel",
          "lg:static lg:col-start-1 lg:row-span-full lg:-mt-10 lg:rounded-5xl",
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
                    // Press feedback. The row is the whole interaction and it
                    // had none: a click changed the panel and the thing you
                    // actually touched never acknowledged you. 1% is under a
                    // pixel of travel at the mobile width and ~4px at the
                    // design width - felt rather than seen, which is the point.
                    // It matters most on touch, where there is no hover state
                    // to have confirmed the target beforehand.
                    //
                    // Asymmetric on purpose: `--motion-instant` (80ms) going
                    // down, the standard `--motion-fast` coming back up. Fast
                    // in, softer out is how a physical button behaves, and
                    // theme.css names 80ms for "press" specifically.
                    "transition-[background-color,border-color,translate,scale]",
                    "duration-(--motion-fast) ease-out",
                    "active:scale-[0.99] active:duration-(--motion-instant)",
                    // No transition means the scale would SNAP rather than
                    // animate, which is a worse press than none at all.
                    "motion-reduce:transition-none motion-reduce:active:scale-100",
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
                /* The same line its question sits on above. Used only by the
                 * no-JS stylesheet; see `row` on FaqAnswerPanelProps. */
                row={index + 2}
                position={Math.sign(index - anchor)}
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
