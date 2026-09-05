"use client";

import { useCallback, useEffect, useRef } from "react";

import { PhoneMockup } from "@/components/ui";
import { cn } from "@/lib/cn";

import { DeckCard } from "./DeckCard";
import { DECK_RECORDS } from "./deck-content";

/**
 * DeckFold - the scroll-driven fold/unfold deck, reproducing owo.app/#features.
 *
 * WHY THIS REPLACES THE FAN (DECISIONS D-014 amended, operator 2026-08-05)
 * ----------------------------------------------------------------------
 * D-014 borrowed owo's fan but kept Figma's resting state as the source of
 * appearance: the deck fanned LEFT along X and advanced in discrete beats, one
 * per card, promoting an active card by index. The operator has now ruled that
 * owo's mechanic wins outright. That is a bigger change than an axis - owo has
 * no active index at all. Its deck is one continuous function of scroll
 * progress, in three phases, and phases 2 and 3 have no Figma equivalent to
 * defer to. Recorded here rather than in the fan, which this supersedes.
 *
 * THE MECHANIC, MEASURED OFF THE LIVE SITE AT 1440x900
 * ---------------------------------------------------
 * A tall track holds a sticky stage, and one progress value `p` (0 at the
 * moment the stage pins, 1 when the track has finished passing it) drives
 * everything:
 *
 *   p < FOLD_END              FOLDED. Cards fanned toward the lower left,
 *                             static. Each card behind steps left, steps down
 *                             and is shorter than the one in front.
 *   FOLD_END .. UNFOLD_END    UNFOLDING. The fan resolves into a uniform
 *                             vertical column - every card the same size, at a
 *                             one-card pitch.
 *   > UNFOLD_END              SCROLLING. The column travels up by one card per
 *                             beat, so each card passes through the stage in
 *                             turn.
 *
 * owo's measured folded state, as ratios of its front card (1074x500), which is
 * what makes them reusable at our stage size:
 *
 *   index   x        y       height
 *   0       0        0       1
 *   1      -0.057   +0.100   0.88
 *   2      -0.102   +0.244   0.68
 *
 * owo fans FOUR cards; this deck has three (operator, 2026-08-05), so the
 * fourth row of its table (-0.136 / +0.34 / 0.52) is deliberately unused rather
 * than a card being invented to fill it.
 *
 * THE FOLD CREASES
 * ----------------
 * The detail that makes it read as folded paper rather than an offset stack.
 * Behind each card sits a dark wedge, z-ordered BETWEEN the cards, clipped so
 * its lower-left corner cuts inward - so the eye reads a crease and a shadow
 * where two panels meet. owo uses `polygon(0 0, 100% 0, 100% 100%, 5.7% 100%)`
 * and then 4.7%, at `bottom` origin, in a single flat brown. They only mean
 * anything while the deck is folded, so they fade out across the unfold.
 *
 * HOW IT IS ANIMATED, AND WHY NOT IN REACT
 * ---------------------------------------
 * The card transforms are written straight to the elements inside the scroll
 * handler, rAF-throttled. A scroll-linked animation cannot go through React
 * state: at 60fps that is a re-render per frame of three cards and their
 * contents. `activeIndex` IS React state, but it changes at most twice across
 * the whole track and exists only so assistive technology has a current card.
 *
 * Nothing here listens to `wheel` or `touchmove` and nothing calls
 * `preventDefault`. Both listeners are `passive`. The page scrolls natively and
 * this reads it - which is the whole difference between a scroll-linked deck
 * and a scroll-jacked one.
 *
 * BELOW `xl`, AND UNDER REDUCED MOTION
 * -----------------------------------
 * Neither gets this. The stage is only `sticky` where the CSS says so, and the
 * handler asks the DOM for that (`getComputedStyle(stage).position`) rather than
 * re-declaring the breakpoint in script, so the two cannot drift. Where the
 * track is absent every card sits at its unfolded position in a plain vertical
 * column, which is a legible reading order with no motion at all - and is also
 * exactly what a reader with no JavaScript gets.
 */

/*
 * THE UNFOLD IS TIME-BASED; ONLY THE SCROLL-THROUGH IS SCROLL-LINKED.
 *
 * This is the shape owo actually has, and the earlier version had it wrong.
 * Mapping the unfold onto a RANGE of track progress - 14% to 34% here - ties it
 * to the scroll wheel, so it creeps open at whatever rate the reader happens to
 * scroll and can be held half-open indefinitely. owo spends about 100px of a
 * 3600px track on it, which is not a range at all: it is a single gesture
 * TRIGGERING an animation that then runs on its own clock.
 *
 * So `FOLD_TRIGGER` is a threshold, not a boundary. Crossing it downward starts a
 * 1000ms `inOutSine` run from stack to column; crossing back up runs the same
 * curve home again. The 1000ms is the operator's own anime.js config, and having
 * a real duration is the whole point of moving off the scroll.
 *
 * `SCROLL_START` then gives the animation somewhere to play before the column
 * begins travelling - a stretch of track where the deck is pinned and nothing is
 * mapped to the wheel. It is deliberately far enough past the trigger to cover
 * the full 1000ms at a normal scroll rate, which is the same breathing room owo
 * leaves between its unfold at ~1600 and its column starting at ~2100.
 */
const FOLD_TRIGGER = 0.06;
const SCROLL_START = 0.3;
const UNFOLD_MS = 1000;

/*
 * THE FOLDED STATE IS FIGMA'S STACK, NOT owo's (operator, 2026-08-05).
 *
 * owo folds like paper: its cards step left AND down, get shorter, and carry
 * dark clip-path wedges between them to read as creases. That was built here and
 * withdrawn - the resting stack is Azza's own, `507:724` / `507:725` / `507:726`
 * via `511:364`, which fans left along X at a decreasing SCALE with no vertical
 * step and no creases at all. Only the mechanic is borrowed now; the appearance
 * is the design's, which is what D-014 said in the first place.
 *
 * These three constants are `DeckCard`'s, restated rather than imported so the
 * interpolation reads in one place - `DEPTH_STEP` is 50/1300 of the stage, one
 * fan step along X, and `DEPTH_SCALE` is the designer's eyeballed 625 -> 569 ->
 * 482. The origin is the fill's own left edge, so the stack shrinks toward the
 * spine instead of toward the middle of the stage.
 *
 * Deleting the creases also deleted a bug rather than fixing one: they were
 * positioned in STAGE percentages while the cards were moved by `transform`
 * percentages, which resolve against each card's own box. With cards of
 * differing heights the two bases disagreed and the wedges slid out from behind
 * their cards as black slabs. Every card is now the same size, so the whole
 * mechanism has a single basis.
 */
const DEPTH_STEP = 3.8462;
const DEPTH_SCALE = [1, 0.9104, 0.7712] as const;
const FAN_ORIGIN = "7.6923% 50%";

/* The phone's slot, also `DeckCard`'s: 917/1300, -0.15/700, 342.932/1300. */
const PHONE_LEFT = 70.5385;
const PHONE_TOP = -0.0214;
const PHONE_WIDTH = 26.3794;
const PHONE_INTRINSIC = 343;

/*
 * THE COLUMN PITCH, and why it is not 100%.
 *
 * A card's BOX is the full 13:7 frame, but the painted fill inside it is
 * `FILL_HEIGHT` - 625 of 700 - centred, so 75px of each box is empty. Stacking
 * the boxes edge to edge at a 100% pitch therefore leaves 75px of daylight
 * between two fills, which is what the deck was doing. The operator has capped
 * that at 16px, so the pitch is the fill plus 16:
 *
 *   625/700 + 16/700  =  89.2857% + 2.2857%  =  91.5714%
 *
 * Expressed against the box height, so on a viewport too short for the full 700
 * the gap scales down with everything else - a MAXIMUM of 16px, which is what
 * was asked for.
 */
const COLUMN_PITCH = 91.5714;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/*
 * THE ONE CURVE THE FOLD MOVES ON - anime.js `inOutSine` (operator, 2026-08-05).
 *
 * `-(cos(pi * t) - 1) / 2`, which is anime.js's own definition. Because the fold
 * is scroll-linked rather than time-based there is no `duration` to set; the
 * curve is applied to the progress value instead, and scrolling back up runs it
 * in reverse for free - the vertical stack folds back into the card stack on
 * exactly the same easing it opened with.
 *
 * WHAT THIS REPLACES, AND WHY. A previous pass tried to add drama three ways at
 * once: a per-card STAGGER so the stack swung open, a back-out OVERSHOOT that
 * sailed each card past its target, and a transient TILT proportional to depth.
 * The operator's verdict was that the cards stopped moving naturally and the
 * exaggeration was too much, and all three are gone rather than dialled down -
 * `inOutSine` is a symmetric, gentle curve, and layering an overshoot or a
 * stagger on top of it would be arguing with the thing that was asked for. One
 * curve, every card, both directions.
 */
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

interface Metrics {
  /** Where the stage pins, in px - the resolved `top`. */
  pinTop: number;
  /** Track height minus stage height: how far the stage stays pinned. */
  travel: number;
  /** The stage's own height, which is one card's height. */
  card: number;
}

export interface DeckFoldProps {
  className?: string;
}

export function DeckFold({ className }: DeckFoldProps) {
  const count = DECK_RECORDS.length;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const metrics = useRef<Metrics | null>(null);

  /** The last beat published to `aria-current`. Not state - see `paint`. */
  const currentBeat = useRef(-1);

  /*
   * The unfold's own clock. `unfoldValue` is where the run has got to, 0 folded
   * and 1 open; `unfoldTarget` is where it is heading. `unfoldFrom` and
   * `unfoldStart` let a reversal pick up from wherever the current run had
   * reached rather than snapping, so scrolling up mid-unfold folds back from
   * there. `lastProgress` is kept because the animation frames have to repaint
   * without a scroll event to tell them where the track is.
   */
  const unfoldValue = useRef(0);
  const unfoldTarget = useRef(0);
  const unfoldFrom = useRef(0);
  const unfoldStart = useRef(0);
  const unfoldFrame = useRef(0);
  const lastProgress = useRef(0);

  /*
   * Ask the DOM whether the track is live, rather than re-declaring `xl` and
   * `prefers-reduced-motion` in script. The stage computes to `sticky` only
   * where the CSS puts a track around it.
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
    const card = stage.offsetHeight;
    metrics.current =
      Number.isFinite(pinTop) && travel > 0 && card > 0 ? { pinTop, travel, card } : null;
  }, []);

  /**
   * Place every card for a given progress and the current unfold value. The only
   * function in here that knows the mechanic; everything else decides when to
   * call it.
   */
  const paint = useCallback(
    (p: number) => {
      const cached = metrics.current;
      if (!cached) return;

      /*
       * The unfold is NOT derived from `p` - it is whatever the 1000ms run has
       * reached, and `tick` owns it. Only the column's travel is read off the
       * scroll, from `SCROLL_START` onward.
       */
      const unfold = unfoldValue.current;
      const scrolled = clamp01((p - SCROLL_START) / (1 - SCROLL_START));

      /*
       * The column, in units of ONE CARD. Every card is the same box - each is
       * `inset-0` of the same 13:7 frame - so `translateY` percentages resolve
       * against an identical basis for all three and the whole mechanism shares
       * one coordinate system.
       */
      const columnY = -scrolled * (count - 1) * COLUMN_PITCH;

      for (let i = 0; i < count; i += 1) {
        const card = cardRefs.current[i];
        if (!card) continue;

        const depth = Math.min(i, DEPTH_SCALE.length - 1);

        /*
         * Folded: Figma's stack - stepped left, scaled down toward the spine, no
         * vertical offset. Unfolded: identity, at the column pitch. Every card
         * crosses between the two on the same eased progress, so the stack moves
         * as one object rather than as three things arriving separately.
         */
        const x = -DEPTH_STEP * depth * (1 - unfold);
        const scale = DEPTH_SCALE[depth] + (1 - DEPTH_SCALE[depth]) * unfold;
        const y = i * COLUMN_PITCH * unfold + columnY;

        card.style.zIndex = `${count - i}`;
        card.style.transformOrigin = FAN_ORIGIN;
        card.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
      }

      /*
       * Which card is "current", for assistive technology. Written as an
       * attribute rather than held in React state: this is a scroll handler, and
       * a state setter here would re-render three cards and their whole interiors
       * on the frame the beat flips. Guarded by the last value so the DOM is
       * touched twice across the entire track, not once per frame.
       */
      const beat = Math.round(scrolled * (count - 1));
      if (beat !== currentBeat.current) {
        currentBeat.current = beat;
        for (let i = 0; i < count; i += 1) {
          const card = cardRefs.current[i];
          if (!card) continue;
          if (i === beat) card.setAttribute("aria-current", "true");
          else card.removeAttribute("aria-current");
        }
      }
    },
    [count],
  );

  /**
   * The unfold's clock. Advances `unfoldValue` along `inOutSine` toward whatever
   * `unfoldTarget` currently is, repainting each frame, and stops itself when it
   * arrives - so the loop only runs during the 1000ms and never idles.
   */
  const tick = useCallback(() => {
    unfoldFrame.current = 0;

    const elapsed = performance.now() - unfoldStart.current;
    const t = clamp01(elapsed / UNFOLD_MS);
    const from = unfoldFrom.current;
    unfoldValue.current = from + (unfoldTarget.current - from) * easeInOutSine(t);

    paint(lastProgress.current);

    if (t < 1) unfoldFrame.current = requestAnimationFrame(tick);
  }, [paint]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const sync = () => {
      frame = 0;
      const cached = metrics.current;
      const track = trackRef.current;
      if (!cached || !track) return;

      const progressed = cached.pinTop - track.getBoundingClientRect().top;
      const p = clamp01(progressed / cached.travel);
      lastProgress.current = p;

      /*
       * The trigger. Past the threshold the deck wants to be open, before it
       * closed; a change of mind starts a fresh run FROM WHEREVER THE LAST ONE
       * GOT TO, so reversing mid-unfold folds back from there instead of
       * snapping to one end and easing from that.
       */
      const wanted = p >= FOLD_TRIGGER ? 1 : 0;
      if (wanted !== unfoldTarget.current) {
        unfoldTarget.current = wanted;
        unfoldFrom.current = unfoldValue.current;
        unfoldStart.current = performance.now();
        if (unfoldFrame.current === 0) {
          unfoldFrame.current = requestAnimationFrame(tick);
        }
      }

      paint(p);
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
      if (frame) window.cancelAnimationFrame(frame);
      if (unfoldFrame.current) window.cancelAnimationFrame(unfoldFrame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [measure, paint, tick]);

  return (
    <div ref={trackRef} data-deck-track="" className={cn("w-full", className)}>
      {/*
       * The track's height IS the choreography's budget, and it is owo's 400vh
       * rather than the fan's old 280 for a measurable reason: the column has to
       * travel `(count - 1) x card` = 1624px inside the scroll phase, which is
       * the last 66% of the pinned range. At 300vh the pinned range is 1888px,
       * so that phase got 1246px of scroll to do 1624px of movement - the cards
       * ran at 1.3x the scroll and felt detached from the gesture. At 400vh the
       * range is 2788px, the phase gets 1840, and the ratio lands at 0.88x,
       * which is owo's own (1890px of scroll for 1580px of travel).
       *
       * Only at `xl` and motion-safe - everywhere else this is a plain wrapper
       * and the cards fall into their unfolded column.
       */}
      <div className="motion-safe:xl:h-[400vh]">
        <div
          ref={stageRef}
          data-deck-stage=""
          className={cn(
            "relative",
            "motion-safe:xl:sticky motion-safe:xl:top-(--height-nav)",
            "motion-safe:xl:h-[calc(100dvh-var(--height-nav))]",
            "motion-safe:xl:overflow-clip",
          )}
        >
          {/*
           * THE 13:7 CARD FRAME, restored from the original fan (operator,
           * 2026-08-05: keep the card size). Every offset inside `DeckCard` is a
           * percentage of a 1300x700 stage, so the frame has to BE that ratio -
           * my first pass made the cards fill the whole sticky stage instead,
           * which stretched them to 812 tall against the design's 700 and left the
           * interiors looking half-empty.
           *
           * `max-w` on the frame rather than `max-h`: capping the height would
           * override `aspect-ratio` and squash three absolutely-positioned cards
           * whose every offset is a percentage. Centred in the stage, so the
           * column that forms below it is clipped by the stage and the next card
           * shows its top edge - which is what gives the scroll somewhere to
           * arrive from.
           */}
          <div className="relative mx-auto aspect-[13/7] w-full max-w-[calc((100dvh-var(--height-nav))*13/7)]">
            <ul role="list" className="absolute inset-0">
              {DECK_RECORDS.map((record, index) => (
                /*
                 * THE CARDS ARE THE EXISTING `DeckCard`, UNCHANGED.
                 *
                 * A first pass rebuilt the card interior here - headline, body,
                 * fill - and that was the wrong call: the operator asked for the
                 * MECHANIC to change, not the design. Everything the fan draws
                 * (the fill, the art layer, the text block, every measure) is
                 * `DeckCard`'s and stays `DeckCard`'s. This component only decides
                 * where each card sits.
                 *
                 * `presentation="fan"` is what keeps that design. `depth={0}` on
                 * every card neutralises the fan: its own layer transform resolves
                 * to `translateX(0) scale(1)`, so it cannot fight the transform
                 * written to the root here, and `isPeeking` is false so no promote
                 * button is drawn over a card that no longer peeks. `active` is
                 * true on all three because the fold shows three interiors at once
                 * where the fan only ever shows one - the crossfade that hides the
                 * other two would blank the cards mid-scroll.
                 *
                 * `transform`, `transform-origin` and `z-index` are written to the
                 * root in `paint`, which is where the rest of the geometry lives.
                 */
                <DeckCard
                  key={record.id}
                  record={record}
                  index={index}
                  presentation="fan"
                  depth={0}
                  active
                  animating
                  hidePhone
                  itemRef={(node) => {
                    cardRefs.current[index] = node;
                  }}
                />
              ))}
            </ul>

            {/*
             * ONE phone, at the coordinates `DeckCard` itself uses for the fan's
             * (`917 / 1300`, `-0.15 / 700`, `342.932 / 1300`), so it lands exactly
             * where the design puts it - but it belongs to the FRAME rather than
             * to any card, which is what lets the cards travel behind it while it
             * holds still. owo pins it and keeps only its screen scrolling; that
             * screen is out of scope, so this is a static capture.
             */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-40"
              style={{
                left: `${PHONE_LEFT}%`,
                top: `${PHONE_TOP}%`,
                width: `${PHONE_WIDTH}%`,
              }}
            >
              <PhoneMockup screen="whatsapp-transfer" width={PHONE_INTRINSIC} screenAlt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckFold;
