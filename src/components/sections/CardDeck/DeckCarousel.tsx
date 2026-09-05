import { useCallback, useEffect, useRef, useState } from "react";

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
 *
 * THE 2026-09-05 REVISION (Figma 862:785, operator-specified behaviour):
 *
 *   - The arrow controls are GONE, on request. The dots stay: with the
 *     carousel advancing on its own, the reader needs to see where they are,
 *     and the dots remain the one non-gestural way to reach a card - the
 *     drawn frame shows no controls at all, so keeping them is a deliberate
 *     departure recorded here, not an oversight.
 *   - Cards snap to the START edge, not the centre: the drawn frame parks the
 *     active card on the left gutter with the next one peeking in from the
 *     right, which start-snapping produces at every width.
 *   - AUTO-ADVANCE: the next card slides into focus every 2 seconds (the
 *     operator's interval - brisker than a read-through of a card's copy,
 *     flagged as such), wrapping from the last card to the first.
 *
 * AUTO-ADVANCE STOPS, in three ways, because a carousel that fights the
 * reader is worse than no carousel:
 *
 *   - It PAUSES while the carousel is off-screen or the tab is hidden -
 *     scrolling a stage nobody can see spends main-thread for nothing, and a
 *     reader returning mid-lap deserves a card at rest, not one in flight.
 *   - It ENDS - permanently, for the page's life - at the first sign of the
 *     reader taking over: a touch, a wheel, a key, or focus landing anywhere
 *     inside. "Users can also scroll between cards" only works if the machine
 *     lets go the moment they do; resuming after an idle timer reliably
 *     yanks the card mid-read. This is also the WCAG 2.2.2 pause mechanism:
 *     any interaction is the pause.
 *   - It never STARTS under reduced motion, where there is no carousel to
 *     drive - the same media query that removes the scroller.
 *
 * The aria-live region only speaks once auto-advance has ended: announcing a
 * self-advancing carousel every two seconds is exactly the noise a screen
 * reader user cannot dismiss, and once the reader is driving, every change is
 * theirs and worth reporting.
 */

/** The operator's interval. One number to tune when 2s proves too brisk. */
const AUTO_ADVANCE_MS = 2000;
export function DeckCarousel({ className }: DeckCarouselProps) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  /* Auto-advance: `autoPlay` ends for good on first interaction; the other two
   * merely gate it while the stage is out of sight. */
  const [autoPlay, setAutoPlay] = useState(true);
  const [inView, setInView] = useState(false);
  const [docVisible, setDocVisible] = useState(true);

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

  /* Only auto-advance a stage someone can see. */
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.4),
      { threshold: [0, 0.4] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setDocVisible(document.visibilityState === "visible");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
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

  /*
   * One timeout per resting card rather than an interval: every advance (auto
   * or manual) re-arms the clock via the `activeIndex` dependency, so a card
   * always gets its full dwell from the moment it settles.
   */
  useEffect(() => {
    if (reduced || !autoPlay || !inView || !docVisible) return;
    const id = window.setTimeout(() => goTo((activeIndex + 1) % count), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [reduced, autoPlay, inView, docVisible, activeIndex, count, goTo]);

  /* The reader has taken over. Capture-phase, so a touch anywhere in the
   * region - card, dot, gap - ends the machine before anything else runs. */
  const stopAutoPlay = useCallback(() => setAutoPlay(false), []);

  return (
    /*
     * The `data-deck-*` attributes are styling hooks for one caller only: the
     * <noscript> block in CardDeck.tsx, which has to reach in and turn this
     * tree into the reduced-motion vertical stack when the script never runs.
     * They are inert whenever scripting is on.
     */
    <div
      data-deck-flow=""
      className={cn("w-full", className)}
      onPointerDownCapture={stopAutoPlay}
      onTouchStartCapture={stopAutoPlay}
      onWheelCapture={stopAutoPlay}
      onKeyDownCapture={stopAutoPlay}
      onFocusCapture={stopAutoPlay}
    >
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
          "motion-reduce:[margin-inline:0] motion-reduce:overflow-visible motion-reduce:[padding-inline:0]",
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
              /* 380 is the drawn card (862:967); 88vw keeps the drawn peek -
               * at the drawn 430 frame it is 378, within a point of the file. */
              className="w-[min(88vw,380px)] shrink-0 snap-start motion-reduce:w-full"
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
        {!autoPlay && activeRecord
          ? `Card ${activeIndex + 1} of ${count}: ${activeRecord.title}`
          : ""}
      </span>

      <div
        data-deck-controls=""
        className="mt-6 flex items-center justify-center gap-2 motion-reduce:hidden"
      >
        <ul role="list" className="flex items-center gap-1.5">
          {DECK_RECORDS.map((record, index) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to card ${index + 1} of ${count}`}
                aria-current={index === activeIndex ? "true" : undefined}
                /*
                 * 14px dots, 6px apart (operator, 2026-09-05 - "space between
                 * the circles be just 6px and make the circles 6px bigger").
                 * The button narrows to the dot so the VISIBLE gap is exactly
                 * the list gap; the 44px height keeps a full-height tap band.
                 * That trades the 44px-wide target away - a 14px-wide control
                 * is under WCAG 2.5.8's 24 - which is accepted here because
                 * the dots are the tertiary route to a card: swipe and the
                 * auto-advance carry the primary interaction, and the row is
                 * exactly what the operator drew.
                 */
                className="grid h-11 w-3.5 cursor-pointer place-items-center"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block size-3.5 rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)]",
                    index === activeIndex ? "bg-fg-primary" : "bg-fg-primary/25",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
