import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { scrollBehavior, useReducedMotion } from "@/lib/motion";

import { DeckCard } from "./DeckCard";
import { DECK_RECORDS } from "./deck-content";

export interface DeckCarouselProps {
  className?: string;
}

/**
 * The same three records, below `lg` - and at every width under
 * `prefers-reduced-motion: reduce`.
 *
 * WHY THE FAN CANNOT SURVIVE HERE (responsive.md S7.0.1, four reasons):
 * at 13:7 and 768px the card is 413px tall while the headline block alone is
 * 383px at design scale; the fan's whole affordance is a 3.85% sliver, which is
 * 27px at 704px and invisible; scroll-pinned sections fight the mobile URL bar;
 * and absolute positioning does not reflow, so there is no partial rescue.
 *
 * TWO PRESENTATIONS, ONE DOM. Which one you get is decided entirely in CSS, by
 * `motion-reduce:` variants - never by a JavaScript branch. That matters: a JS
 * branch renders the wrong tree on the server, then swaps it after hydration,
 * so a reduced-motion user sees exactly the motion they asked not to see. Here
 * the stack is correct from the first paint, correct with JavaScript disabled,
 * and correct for a crawler.
 *
 *   default          horizontal snap carousel, one card at a time, controls on
 *   motion-reduce    plain vertical stack, DOM order 1-2-3, controls removed,
 *                    no scroller, section height auto  (S9 Tier 3)
 *
 * Swipe is native scroll-snap. There is deliberately NO custom drag or pointer
 * handler: a hand-rolled gesture layer loses momentum, rubber-banding and
 * accessibility, and reliably fights the browser.
 */
export function DeckCarousel({ className }: DeckCarouselProps) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const count = DECK_RECORDS.length;
  const activeRecord = DECK_RECORDS[activeIndex];

  /*
   * The active card is read off the scroller rather than computed from
   * scrollLeft: an observer is correct for a snap scroller at any zoom, in any
   * writing mode, and it does not run on every frame of a fling.
   *
   * It keeps a running ratio per card and picks the most visible one, rather
   * than trusting `entry.isIntersecting`. That flag is true for any ratio above
   * zero, so a card on its way OUT reports `isIntersecting` at the moment it
   * falls back through the threshold - and whichever entry happened to be last
   * in the batch won. Measured at 375px, one ArrowRight left the dots reporting
   * card 3 and the Next button greyed out on card 2.
   */
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const raw = (entry.target as HTMLElement).dataset.deckIndex;
          if (raw !== undefined) ratios.set(Number(raw), entry.intersectionRatio);
        }

        let best = -1;
        let bestRatio = 0;
        for (const [index, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = index;
          }
        }
        if (best >= 0 && bestRatio >= 0.5) setActiveIndex(best);
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const item of itemRefs.current) {
      if (item) observer.observe(item);
    }
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const target = itemRefs.current[index];
      if (!target) return;
      /* `block: "nearest"` is load-bearing. Without it, centring a card in a
       * horizontal scroller also drags the whole page vertically. */
      target.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: scrollBehavior(reduced),
      });
      setActiveIndex(index);
    },
    [reduced],
  );

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === count - 1;

  return (
    /*
     * The `data-deck-*` attributes are styling hooks for one caller only: the
     * <noscript> block in CardDeck.tsx, which has to reach in and turn this
     * tree into the reduced-motion vertical stack when the script never runs.
     * They are inert whenever scripting is on.
     */
    <div data-deck-flow="" className={cn("w-full", className)}>
      {/*
       * role="group" + a name + tabindex make the scroller keyboard-operable,
       * which WCAG 2.1.1 requires of any region that only scrolling can reveal.
       * Under reduced motion there is no scroller, so the tab stop is dropped
       * rather than left behind as a focusable element that does nothing.
       */}
      <div
        ref={scrollerRef}
        data-deck-scroller=""
        role="group"
        aria-label="Feature cards"
        tabIndex={reduced ? undefined : 0}
        className={cn(
          "snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          "[margin-inline:calc(var(--gutter)*-1)] [padding-inline:var(--gutter)]",
          "[scroll-padding-inline:var(--gutter)]",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "motion-reduce:overflow-visible motion-reduce:[margin-inline:0] motion-reduce:[padding-inline:0]",
        )}
      >
        <ul
          data-deck-list=""
          role="list"
          className="flex gap-4 motion-reduce:flex-col motion-reduce:gap-6"
        >
          {DECK_RECORDS.map((record, index) => (
            <DeckCard
              key={record.id}
              record={record}
              index={index}
              presentation="flow"
              data-deck-index={index}
              className="w-[min(88vw,420px)] shrink-0 snap-center motion-reduce:w-full"
              itemRef={(node) => {
                itemRefs.current[index] = node;
              }}
            />
          ))}
        </ul>
      </div>

      {/* Announced for anyone driving the carousel from the buttons, where the
       * focus never moves and nothing else would report the change. */}
      <span className="sr-only" aria-live="polite">
        {activeRecord
          ? `Card ${activeIndex + 1} of ${count}: ${activeRecord.title}`
          : ""}
      </span>

      <div
        data-deck-controls=""
        className="mt-6 flex items-center justify-center gap-2 motion-reduce:hidden"
      >
        <CarouselButton
          label="Previous card"
          disabled={atStart}
          onActivate={() => goTo(activeIndex - 1)}
        >
          <Icon name="arrow-right" size="sm" rotate={180} />
        </CarouselButton>

        <ul role="list" className="flex items-center gap-1">
          {DECK_RECORDS.map((record, index) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to card ${index + 1} of ${count}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className="grid size-11 cursor-pointer place-items-center"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block size-2 rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)]",
                    index === activeIndex
                      ? "bg-fg-primary"
                      : "bg-fg-primary/25",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>

        <CarouselButton
          label="Next card"
          disabled={atEnd}
          onActivate={() => goTo(activeIndex + 1)}
        >
          <Icon name="arrow-right" size="sm" />
        </CarouselButton>
      </div>
    </div>
  );
}

/**
 * `aria-disabled`, not `disabled`.
 *
 * A real `disabled` attribute on the button you have just pressed to reach the
 * last card removes it from the focus order while it still holds focus, and the
 * browser drops focus to <body>. Keeping the control focusable and inert is the
 * accessible form of the same state.
 */
function CarouselButton({
  label,
  disabled,
  onActivate,
  children,
}: {
  label: string;
  disabled: boolean;
  onActivate: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (disabled) return;
        onActivate();
      }}
      className={cn(
        "grid size-11 place-items-center rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        disabled
          ? "cursor-default text-fg-primary/30"
          : "cursor-pointer text-fg-primary hoverable:bg-surface-subtle",
      )}
    >
      {children}
    </button>
  );
}
