"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Section } from "@/components/ui";

import { DeckCard } from "./DeckCard";
import { DeckCarousel } from "./DeckCarousel";
import { DECK_RECORDS } from "./deck-content";

/**
 * The fanned card deck - `412:2196` on the landing page, holding the one real
 * component set in the file, `507:498`, via instance `511:364`.
 *
 * THREE PRESENTATIONS, DECIDED IN CSS
 * -----------------------------------
 * Both trees are always rendered and the browser picks one, so the correct
 * presentation is on screen at first paint, with JavaScript disabled, and for a
 * crawler. Nothing here branches on a media query in JavaScript.
 *
 *   >= lg, motion-safe   the fan            (this file)
 *   <  lg, motion-safe   snap carousel      (DeckCarousel)
 *   reduced motion       vertical stack     (DeckCarousel, motion-reduce:)
 *
 * The third is not a nicety. components.md S10.10 Tier 3 makes the deck the one
 * component on the site whose meaning is carried by motion, and therefore the
 * one place where reduced motion is allowed to change layout rather than just
 * remove a transition.
 *
 * THE MECHANIC
 * ------------
 * An absolutely-positioned stack with descending z-index, the active card on
 * top at full size, and the two behind it fanned out along X to the LEFT with
 * decreasing height. That axis is DECISIONS D-014, which amends D-006: owo.app
 * fans downward along Y, Azza's own resting state (`507:724` / `507:725` /
 * `507:726`) fans left along X, and the axis is appearance, which Figma owns.
 * Only the mechanic is borrowed.
 *
 * `position: sticky` and a tall scroll track are deliberately NOT used, and the
 * deck does not advance itself on scroll. Advancing is something the reader
 * does - click or Enter on a peeking card, or an arrow key. See the report's
 * `findings`: this contradicts components.md S10.8 and responsive.md S7.0.1,
 * both of which specify a sticky stage, and follows the build spec, which
 * states plainly that sticky is not used. Reversing it touches this file only.
 */
export function CardDeck() {
  const count = DECK_RECORDS.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  const stageRef = useRef<HTMLUListElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  /* Set only by a real user action, so the deck never steals focus on mount
   * or on a re-render. */
  const focusPending = useRef(false);

  /*
   * `will-change: transform` is a standing instruction to the compositor to
   * keep three full-bleed layers promoted. components.md S10.8 requires it be
   * applied only while the deck is intersecting and dropped on exit; leaving it
   * on permanently costs memory on every page that mounts the section.
   */
  useEffect(() => {
    const node = stageRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setOnScreen(entry.isIntersecting);
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /*
   * Focus follows the promotion. Activating "Show card 2 of 3: ..." destroys
   * the button that was activated, so without this the browser drops focus to
   * <body> and a keyboard user is thrown back to the top of the document. The
   * promoted card is a labelled group with tabindex -1, so focus lands on it
   * and its headline is announced.
   */
  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    panelRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const promote = useCallback((index: number) => {
    focusPending.current = true;
    setActiveIndex(index);
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      let next: number;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (activeIndex + 1) % count;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (activeIndex - 1 + count) % count;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = count - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      promote(next);
    },
    [activeIndex, count, promote],
  );

  return (
    /*
     * `clip` is not optional here. The rear cards translate up to -7.69% of the
     * stage, the phone mockup bleeds past the stage on the vertical axis, and
     * the carousel below `lg` reaches into both gutters. Acceptance criterion
     * 15 - no horizontal overflow at 320 / 375 / 768 / 1024 / 1440 / 1920 - is
     * the one this component is most likely to fail, and this is the guard.
     *
     * `gap={0}` because the section has exactly one child; the deck carries no
     * section heading in the design (`412:2196` contains only the instance), so
     * the three card headlines are the h2s and nothing is invented above them.
     */
    <Section rhythm="spotlight" container="deck" gap={0} clip>
      <div className="w-full">
        <ul
          ref={stageRef}
          role="list"
          onKeyDown={onKeyDown}
          className="relative hidden aspect-[13/7] w-full motion-safe:lg:block"
        >
          {DECK_RECORDS.map((record, index) => (
            <DeckCard
              key={record.id}
              record={record}
              index={index}
              presentation="fan"
              depth={(index - activeIndex + count) % count}
              active={index === activeIndex}
              animating={onScreen}
              onPromote={promote}
              panelRef={(node) => {
                panelRefs.current[index] = node;
              }}
            />
          ))}
        </ul>

        <DeckCarousel className="motion-safe:lg:hidden" />
      </div>
    </Section>
  );
}
