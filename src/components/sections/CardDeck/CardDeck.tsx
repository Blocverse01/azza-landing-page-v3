"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Section } from "@/components/ui";
import { scrollBehavior, useReducedMotion } from "@/lib/motion";

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
 * HOW IT ADVANCES - components.md S10.8, responsive.md S7.0.1, DECISIONS D-035
 * ---------------------------------------------------------------------------
 * At `xl`+ the fan is pinned: a `~280vh` TRACK holds a `position: sticky` STAGE
 * at `top: var(--height-nav)`, and the active index is read off how far the
 * track has scrolled past that pin - three beats, one per card. There is no
 * wheel or touch listener anywhere in this directory and nothing calls
 * `preventDefault` on a scroll gesture: the page scrolls natively and the deck
 * merely reads it. That is the whole difference between this and scroll-jacking.
 *
 * At `lg` (1024-1279) responsive.md gives the fan but no track, so the stage is
 * static and the reader advances the deck directly - click or `Enter` on a
 * peeking card, or an arrow key. Those affordances are live at `xl` too, where
 * they scroll the track to the requested beat instead of setting the index, so
 * there is exactly one source of truth per mode.
 *
 * The mode is detected from the DOM (`getComputedStyle(stage).position`), never
 * from a media query re-declared in JavaScript. CSS decides where the track
 * exists; the script only asks.
 *
 * WHAT HAPPENS IF THE SCRIPT NEVER RUNS
 * -------------------------------------
 * "If JS fails the section degrades to a plain long section with three legible
 * cards" (S10.8) is a requirement, and sticky alone does not deliver it: a
 * pinned stage with a frozen index shows card 1 for 280vh and calls it a
 * section. So the no-JS presentation is stated, once, in the `<noscript>` block
 * below - it collapses the track, drops the fan, and promotes the flow tree to
 * the same vertical stack that reduced-motion users get. It costs nothing when
 * scripting is on, and it means the enhancement is never load-bearing for the
 * content.
 */

/*
 * Written as a string through `dangerouslySetInnerHTML` because React does not
 * render element children of <noscript> reliably once scripting is enabled -
 * the browser parses that subtree as text, and hydration then disagrees about
 * it. The selectors are all `[data-deck-*]`, so nothing outside this section
 * can be reached. Values mirror the `motion-reduce:` variants they stand in
 * for: gap 1.5rem is `gap-6`, and the controls are hidden because their click
 * handlers cannot exist here.
 */
const NO_JS_STYLE =
  "<style>" +
  "[data-deck-track]{height:auto!important}" +
  "[data-deck-stage]{position:static!important;height:auto!important;display:block!important}" +
  "[data-deck-fan]{display:none!important}" +
  "[data-deck-flow]{display:block!important}" +
  "[data-deck-scroller]{overflow:visible!important;margin-inline:0!important;padding-inline:0!important}" +
  "[data-deck-list]{display:flex!important;flex-direction:column!important;gap:1.5rem!important}" +
  "[data-deck-list]>li{width:100%!important}" +
  "[data-deck-controls]{display:none!important}" +
  "</style>";

/** What the scroll link needs, cached between frames. Null whenever the sticky
 *  track is not the active mechanism - `lg`, reduced motion, or no layout yet. */
interface TrackMetrics {
  /** The resolved `top` the stage pins at, in px. `var(--height-nav)`. */
  pinTop: number;
  /** Track height minus stage height: how far the stage stays pinned. */
  travel: number;
}

export function CardDeck() {
  const count = DECK_RECORDS.length;
  const reduced = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fanRef = useRef<HTMLUListElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metrics = useRef<TrackMetrics | null>(null);

  /*
   * Ask the DOM whether the track is the active mechanism, rather than
   * re-declaring `xl` and `prefers-reduced-motion` in JavaScript. The stage
   * computes to `sticky` only where the CSS says the track exists, so the two
   * can never drift apart - and a media query rewritten in script is exactly
   * how they drift.
   */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage || typeof window === "undefined") {
      metrics.current = null;
      return;
    }

    const computed = window.getComputedStyle(stage);
    if (computed.position !== "sticky") {
      metrics.current = null;
      return;
    }

    const pinTop = Number.parseFloat(computed.top);
    const travel = track.offsetHeight - stage.offsetHeight;
    metrics.current =
      Number.isFinite(pinTop) && travel > 0 ? { pinTop, travel } : null;
  }, []);

  /*
   * `will-change: transform` is a standing instruction to the compositor to
   * keep three full-bleed layers promoted. components.md S10.8 requires it be
   * applied only while the deck is intersecting and dropped on exit; leaving it
   * on permanently costs memory on every page that mounts the section.
   */
  useEffect(() => {
    const node = fanRef.current;
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
   * The scroll link. `passive: true` on both listeners is a promise to the
   * browser that nothing here will ever call `preventDefault` - which is the
   * literal difference between a scroll-linked deck and a scroll-jacked one -
   * and it lets the compositor scroll without waiting on this handler.
   *
   * Reads are rAF-throttled and the state setter compares first, so a fling
   * through the whole track re-renders three times, not once per frame.
   *
   * `reduced` is a dependency because toggling the preference mid-session flips
   * the stage out of `sticky`, and the cached metrics have to be re-taken.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const sync = () => {
      frame = 0;
      const cached = metrics.current;
      const track = trackRef.current;
      if (!cached || !track) return;

      const progressed = cached.pinTop - track.getBoundingClientRect().top;
      const beat = Math.floor((progressed / cached.travel) * count);
      const next = Math.min(count - 1, Math.max(0, beat));
      setActiveIndex((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(sync);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    sync();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [count, measure, reduced]);

  /*
   * The direct affordance - click / Enter on a peeking card, or an arrow key.
   *
   * Where the track exists, this must NOT set the index: it scrolls the page to
   * the middle of the requested beat and lets the scroll listener do what it
   * already does. Setting both would fight, because the listener would
   * immediately overwrite the optimistic value with whatever beat the animation
   * happened to be passing through.
   *
   * Focus moves synchronously either way. Activating "Show card 2 of 3: ..."
   * destroys the button that was activated, so without this the browser drops
   * focus to <body> and a keyboard user is thrown back to the top of the
   * document. Every fan panel carries `tabindex="-1"` permanently so the target
   * is focusable before it becomes active - during a smooth scroll it is not
   * active yet - and `preventScroll` keeps that focus call from fighting the
   * scroll it was just asked to make.
   */
  const promote = useCallback(
    (index: number) => {
      const cached = metrics.current;
      const track = trackRef.current;

      if (cached && track) {
        window.scrollTo({
          top:
            window.scrollY +
            track.getBoundingClientRect().top -
            cached.pinTop +
            ((index + 0.5) / count) * cached.travel,
          behavior: scrollBehavior(reduced),
        });
      } else {
        setActiveIndex(index);
      }

      panelRefs.current[index]?.focus({ preventScroll: true });
    },
    [count, reduced],
  );

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
     * `overflow-x: clip`, NOT `overflow: hidden`.
     *
     * Clipping is still required - the carousel below `lg` reaches into both
     * gutters, and criterion 15 (no horizontal overflow at six widths) is the
     * thing this component is most likely to fail. But `overflow: hidden` makes
     * the <section> a scroll container, and a sticky descendant sticks to its
     * nearest scrollport: inside a scroll container that never scrolls, sticky
     * is silently inert. `overflow-x: clip` clips without establishing a
     * scrollport, and leaves `overflow-y` computing to `visible` (CSS Overflow
     * 3 only rewrites `visible`/`clip` when the other axis is scroll/auto/
     * hidden), so the stage pins and the phone mockup still bleeds vertically
     * the way `507:761` does.
     *
     * That is why `clip` is passed as false and the utility is supplied here
     * instead: `Section`'s `clip` prop is `overflow-hidden`, `cn()` does no
     * conflict resolution, and both would have survived on the same element.
     *
     * `gap={0}` because the section has exactly one child; the deck carries no
     * section heading in the design (`412:2196` contains only the instance), so
     * the three card headlines are the h2s and nothing is invented above them.
     *
     * THE 70px GUTTER - responsive.md S3.3 and S7.0.1, and it is this surface ONLY
     * ---------------------------------------------------------------------------
     * `container="deck"` resolves `min(var(--container-deck), 100% - 2 *
     * var(--gutter))`, and `--gutter` is the GLOBAL ladder, which steps to 80 at
     * `xl`. That gives `min(1300, 1440 - 160)` = 1280 at the design width - 20px
     * narrow - and, far worse, it is not invariant above 1440: at 1920 the same
     * expression resolves to the full 1300, so the stage GROWS between 1440 and
     * 1920 and the section height moves with it (689.2 -> 700 at 13:7). That
     * fails responsive.md S12 check 9, which requires >= 1440 to be one layout.
     *
     * The design does not use the global gutter here. `511:364` sits at x = 70
     * in a 1440 frame, w = 1300, so responsive.md S7.0.1 states the rule for
     * this one surface at `xl` and `2xl`: `min(1300px, 100% - 140px)`. A 70px
     * gutter, not 80.
     *
     * So `--gutter` is overridden to 70 on THIS section, at `xl`+ only. It is a
     * custom property, so it inherits to the `Container` this section renders
     * and to nothing else in the document - every other container on the site
     * keeps the ladder untouched. The alternative, widening the global step to
     * 70, would move all 22 sections to fix one.
     *
     * Scoped to `xl`+ deliberately. Below 1280 responsive.md S7.0.1 says the
     * stage is simply "width: 100%" of the content box, which is what the
     * unmodified ladder already gives, and the carousel that replaces the fan
     * there bleeds into the gutters with `var(--gutter)` and must keep reading
     * the real one. (It cannot see this override in practice - it is
     * `motion-safe:lg:hidden` above 1024, and under reduced motion it zeroes its
     * own inline margin - but the breakpoint keeps the two independent by
     * construction rather than by coincidence.)
     */
    <Section
      rhythm="spotlight"
      container="deck"
      gap={0}
      className="overflow-x-clip xl:[--gutter:70px]"
    >
      <div className="w-full">
        <noscript dangerouslySetInnerHTML={{ __html: NO_JS_STYLE }} />

        {/* The scroll track. Height only where the fan is pinned - at `lg` and
         *  under reduced motion this is a plain wrapper of auto height. */}
        <div ref={trackRef} data-deck-track="" className="motion-safe:xl:h-[280vh]">
          {/*
           * The sticky stage. `max-w` on the fan, not `max-h`, is what keeps
           * the 13:7 stage inside a short viewport: capping the height would
           * override `aspect-ratio` and squash three absolutely-positioned
           * cards whose every offset is a percentage.
           */}
          <div
            ref={stageRef}
            data-deck-stage=""
            className="motion-safe:xl:sticky motion-safe:xl:top-[var(--height-nav)] motion-safe:xl:flex motion-safe:xl:h-[calc(100dvh-var(--height-nav))] motion-safe:xl:items-center"
          >
            <ul
              ref={fanRef}
              data-deck-fan=""
              role="list"
              onKeyDown={onKeyDown}
              className="relative mx-auto hidden aspect-[13/7] w-full motion-safe:lg:block motion-safe:xl:max-w-[calc((100dvh-var(--height-nav))*13/7)]"
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
          </div>
        </div>

        <DeckCarousel className="motion-safe:lg:hidden" />
      </div>
    </Section>
  );
}
