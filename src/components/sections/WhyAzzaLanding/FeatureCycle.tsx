"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { FeatureList, type Feature } from "./FeatureList";

/**
 * FeatureCycle - the "Why Azza?" feature list as a vertical cycle.
 *
 * THE INTERACTION (operator brief, 2026-08-05)
 * -------------------------------------------
 * One feature is active at a time. The active row sits dead centre of a fixed
 * viewport with its description open; every other row is a title at 40% opacity.
 * Every 2 seconds the active row travels up and out of the middle, its
 * description closing behind it, while the NEXT row arrives at the exact
 * position the old one left and opens its own description. A blue marker sits
 * permanently at the centre - the rows move past the highlighter, not the other
 * way round.
 *
 * Clicking a row makes it active, by the shortest route. The brief first asked
 * for clicks to travel forward only - a row that had passed would be reached by
 * carrying on round rather than reversing - and then withdrew it: a click on a
 * row sitting three slots above the centre now simply brings it down. Since all
 * seven rows are on screen at once, the clicked row is never more than three
 * slots away, so the shortest route is always the one the eye expects.
 *
 * WHY A TRIPLED TRACK, STILL
 * --------------------------
 * The AUTO-advance is the part that must never reverse. Left to a single run of
 * rows, stepping off the last row back onto the first would translate the track
 * DOWN by six rows - the whole list visibly rewinding once every lap. So the
 * track holds THREE copies of the seven rows and the counter walks off the end
 * of one copy into the next. Copy 2 is the real list; copies 1 and 3 exist so
 * there is always a full run of rows above and below it, and they are
 * `aria-hidden` and unfocusable (see `FeatureList`'s `presentational`).
 *
 * The counter is kept inside copy 2 - `[7, 14)` - and is renormalised by a whole
 * copy once the movement has settled, in whichever direction it left. Row `n`
 * and row `n + 7` are the same content in the same place relative to their
 * neighbours, so that shift is invisible: it moves the track by exactly one
 * copy's height and lands on a pixel-identical picture.
 *
 * WHY THE TITLE IS WHAT GETS CENTRED
 * ---------------------------------
 * The brief says the incoming row must arrive "at the exact former position" of
 * the outgoing one. Centring the whole row block would break that promise the
 * moment two descriptions wrapped to different heights - each title would come
 * to rest a few pixels off from the last. Centring the TITLE makes the resting
 * place identical for all seven, which is also what lets the marker be a single
 * static square rather than something that has to chase the active row.
 *
 * It also makes the arithmetic independent of every description: rows above the
 * active one are all collapsed, so the offset to the active title needs only the
 * collapsed row heights and the row gap. Nothing here has to know how tall any
 * description is.
 *
 * TWO ANIMATIONS THAT COMPOSE INTO ONE MOVEMENT
 * --------------------------------------------
 * Nothing animates per row. There are exactly two moving parts:
 *
 *   1. the track's `translate`, which carries the whole list up
 *   2. each description's `grid-template-rows: 0fr <-> 1fr`, which reflows the
 *      rows BELOW it as it opens and closes
 *
 * Both run for `--motion-slow` on `--ease-in-out`, so they read as a single
 * gesture rather than two things happening at once. The choreography falls out
 * of the sum: rows above the active one travel one row-pitch (72px), the
 * incoming row travels that pitch PLUS the height the outgoing description gave
 * back (~138px in the design, which is exactly the gap the frame draws between
 * the active title and the next one). No keyframes and no per-row transforms -
 * one composited property on one element, which is why it holds up while the
 * page is still loading.
 *
 * ON THE DURATION. This was `--motion-deck` (640ms) while the beat was 6s, which
 * is the token the project reserves for exactly this kind of promotion. The beat
 * is now 2s and 640ms of it would be spent moving - nearly a third of every
 * cycle - which reads as a list that never settles. `--motion-slow` (360ms)
 * restores the move-then-rest rhythm at the faster cadence and is still
 * unhurried for a 72px step. The frequency rule cuts both ways: the same motion
 * seen twice as often has to be shorter.
 *
 * Press feedback does not wait for the travel either way - the row's opacity
 * swaps at `--motion-base`, so a click is acknowledged in 240ms while the
 * movement settles behind it.
 *
 * PAUSING
 * -------
 * The cycle stops while a mouse (or pen - anything that can hover, never a
 * finger) is over it, while keyboard-visible focus is inside it, and while
 * the section is off screen; a tap or click on a row does NOT pause it, it
 * just restarts the dwell from that row - see the `hovered` / `focusWithin`
 * note in the component for the tap-stall this replaces. It never starts under
 * `prefers-reduced-motion: reduce` - motion that begins without being asked for
 * is exactly what that preference is about - and the visually-hidden toggle
 * below is the WCAG 2.2.2 "pause, stop or hide" mechanism, reachable by keyboard
 * and announced, without adding a control the design does not draw.
 *
 * BELOW `lg`
 * ----------
 * The BEAT runs, the TRAVEL does not (operator request, 2026-09-05: "this is
 * also supposed to cycle just like on desktop"). responsive.md S7.2.2 lays the
 * features out as a static flow there, and a 581px clipped viewport that
 * scrolls itself is still the wrong shape for a phone - so the viewport
 * height, the clip, the translate, the padding copies and the centre marker
 * stay `lg`-gated. What is no longer gated is the timer: the active row - its
 * marker and its open description - walks the list on the same 2s dwell at
 * every width, pausing for the same reasons (touch or focus inside, the
 * pause toggle, off-screen, reduced motion). The rows do not travel; the
 * highlight does.
 */

/** Copies of the seven rows in the track. Three is the minimum that keeps a full
 *  run of rows both above and below the real copy at every position. */
const COPIES = 3;

/** How long a row stays active (operator, 2026-09-08: 2s, down from 3; 2026-08-05: 3s, down from 6). */
const DWELL_MS = 2000;

/*
 * How long to wait before renormalising the counter - the travel duration plus a
 * little air, so the shift can never land inside a movement.
 *
 * It MIRRORS `--motion-slow` (360ms) and must be revisited with it. It is a
 * literal rather than a read of that custom property because the read is not
 * reliable: `getPropertyValue("--motion-slow")` hands back the authored token,
 * whose unit is whatever the stylesheet wrote, and `parseFloat` on a value that
 * arrives as seconds yields a fraction - a sub-millisecond timeout that snapped
 * the track before the movement had begun, which is exactly the bug this comment
 * replaces. A number that is obviously coupled beats a read that is silently
 * wrong.
 */
const SNAP_AFTER_MS = 420;

/*
 * The viewport height, 570:436. The cycle needs a fixed box to centre inside; at
 * `lg` and up that box is the frame's own 581.
 */
const VIEWPORT_H = 581;

/*
 * Design fallbacks for the first paint, before measurement runs: 570:437's 32px
 * collapsed row and the frame's 40px row gap. They are only ever used for the
 * one render between hydration and `useLayoutEffect`, and `Reveal` is still
 * holding this section hidden at that point - but a list parked at the top of
 * its clip would be an ugly thing to leave to chance.
 */
const FALLBACK_ROW_H = 32;
const FALLBACK_GAP = 40;

interface Metrics {
  /** Collapsed height of each row, in source order. */
  readonly rowHeights: readonly number[];
  /** Height each row's description ADDS when open, in source order. */
  readonly descHeights: readonly number[];
  /** The row gap, from the list's own computed `row-gap`. */
  readonly gap: number;
  /** The clipped viewport's height. */
  readonly viewport: number;
}

function fallbackMetrics(count: number): Metrics {
  return {
    rowHeights: Array.from({ length: count }, () => FALLBACK_ROW_H),
    descHeights: Array.from({ length: count }, () => 0),
    gap: FALLBACK_GAP,
    viewport: VIEWPORT_H,
  };
}

/**
 * The distance the track must be shifted for row `position` of the tripled run
 * to have its TITLE centred in the viewport.
 *
 * Within a copy the maths is only collapsed heights and gaps: every row above
 * the active one is closed, so no description can affect the offset to the
 * active title.
 *
 * ACROSS copies it is not, and that was a bug worth recording. All three copies
 * render the same active row, so each COMPLETED lap contains one open
 * description and is that much taller than the sum of its collapsed rows. With
 * the lap computed as collapsed-only, the position sat a whole description too
 * high for every lap already walked - measured as a 63px error one lap in, which
 * is exactly the open row's 67px of description. So the lap carries
 * `descHeights[index]`.
 *
 * The lap therefore varies with which row is active. That is still safe for the
 * renormalisation, which is the one place a wrong lap would show: the active row
 * is unchanged across that shift, so the lap used to leave a position is the
 * same one used to arrive.
 */
function trackOffset(position: number, metrics: Metrics): number {
  const { rowHeights, descHeights, gap, viewport } = metrics;
  const count = rowHeights.length;

  const laps = Math.floor(position / count);
  const index = position % count;

  const collapsedLap = rowHeights.reduce((total, h) => total + h + gap, 0);
  const lap = collapsedLap + descHeights[index];

  let offset = laps * lap;
  for (let k = 0; k < index; k += 1) offset += rowHeights[k] + gap;

  return viewport / 2 - (offset + rowHeights[index] / 2);
}

export interface FeatureCycleProps {
  features: readonly Feature[];
  /** The row the design ships active. */
  initialId: string;
  className?: string;
}

export function FeatureCycle({ features, initialId, className }: FeatureCycleProps) {
  const count = features.length;
  /** The real copy is the middle one, so the counter lives in [count, 2*count). */
  const home = count;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(() => {
    const start = features.findIndex((f) => f.id === initialId);
    return home + (start < 0 ? 0 : start);
  });

  /** True for exactly one frame, to land a renormalisation without animating it. */
  const [snapping, setSnapping] = useState(false);

  const [metrics, setMetrics] = useState<Metrics>(() => fallbackMetrics(count));

  const [reduceMotion, setReduceMotion] = useState(false);
  const [cycling, setCycling] = useState(false);
  const [inView, setInView] = useState(false);
  /*
   * The two ways a person can be "in" the list, kept APART. They were one
   * `engaged` flag set by pointerenter / focus and cleared by pointerleave /
   * blur, and that shape had two faults, one of which stalled the cycle for
   * every phone user who tapped a row (operator report with screenshot,
   * 2026-09-08 - a focused row and a marker that never moved again):
   *
   *   1. A TAP IS A POINTERENTER WITH NO POINTERLEAVE TO FOLLOW. A finger
   *      "enters" the viewport when it lands and the browser does send a
   *      leave after it lifts - but on Android the tapped <button> is then
   *      focused by the compatibility mousedown, which fires AFTER touchend
   *      and so after that leave. The last write won: engaged = true, and
   *      nothing a touch user does short of tapping somewhere else ever
   *      clears it. iOS does not focus buttons on tap, which is why the
   *      report came from Android and not from the desk.
   *   2. One flag for two conditions cancels itself: leave-while-focused
   *      resumed a cycle a keyboard user was reading, blur-while-hovered
   *      resumed one under a resting mouse.
   *
   * So: `hovered` is only ever set by a pointer that CAN hover - mouse or
   * pen, never touch (`pointerType`), the same distinction `hoverable:` makes
   * in CSS. `focusWithin` is only ever set by focus the browser would draw a
   * ring for (`:focus-visible` - keyboard, assistive tech, script), never by
   * the focus a tap or click leaves on a row. A pointer selection therefore
   * restarts the dwell from the row it picked and the beat carries on, which
   * is what selecting something should do; a keyboard user still holds the
   * list still for as long as they are in it.
   */
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [paused, setPaused] = useState(false);

  /*
   * When a pointer last pressed inside the list. Focus that lands within half
   * a second of a press came from that press - a tap or a click - and is not
   * a reason to pause, whatever `:focus-visible` says about it: some Android
   * builds draw the ring for a tapped button, and the whole point of this
   * change is that a tap must never stall the beat. Keyboard and assistive
   * focus arrive with no press in front of them and still pause.
   */
  const lastPress = useRef(0);

  const activeIndex = ((position % count) + count) % count;
  const activeId = features[activeIndex].id;

  /* --- Measurement. ------------------------------------------------------
   * Read from the DOM rather than threaded through refs: the rows are rendered
   * by `FeatureList`, and a `data-feature-title` query keeps that component from
   * having to know a cycle exists. Only the real copy is measured - the other
   * two are identical by construction.
   */
  const measure = useCallback(() => {
    const viewportEl = viewportRef.current;
    if (!viewportEl) return;

    const list = viewportEl.querySelector("[data-feature-measure]");
    if (!(list instanceof HTMLElement)) return;

    const titles = list.querySelectorAll("[data-feature-title]");
    const bodies = list.querySelectorAll("[data-feature-body]");
    if (titles.length !== count || bodies.length !== count) return;

    /*
     * `getBoundingClientRect().height`, NOT `offsetHeight`, everywhere below.
     *
     * `offsetHeight` rounds to whole pixels, and these numbers are summed across
     * a whole lap before they are used: a 28px title on a 1.13 line-height is
     * 31.64 tall, so seven of them reported as 32 walked the centre line 2.5px
     * off, and the measured error against the marker was 3-5px depending on how
     * far into the lap the active row sat. Fractional rects sum cleanly.
     */
    const rowHeights = Array.from(titles, (el) =>
      el instanceof HTMLElement ? el.getBoundingClientRect().height : FALLBACK_ROW_H,
    );
    /*
     * The description's own box, measured on the <p> rather than on the grid item
     * around it: that item is the thing being collapsed, so six of the seven are
     * zero tall, while the <p> inside keeps its natural height and simply
     * overflows a clipped parent. Its `pt-4` is part of that box, which is
     * exactly the height an opening row gains.
     */
    const descHeights = Array.from(bodies, (el) =>
      el instanceof HTMLElement ? el.getBoundingClientRect().height : 0,
    );
    const gap = Number.parseFloat(getComputedStyle(list).rowGap) || FALLBACK_GAP;
    const viewport = viewportEl.clientHeight || VIEWPORT_H;

    setMetrics((current) => {
      const same =
        current.gap === gap &&
        current.viewport === viewport &&
        current.rowHeights.length === rowHeights.length &&
        current.rowHeights.every((h, i) => h === rowHeights[i]) &&
        current.descHeights.every((h, i) => h === descHeights[i]);
      return same ? current : { rowHeights, descHeights, gap, viewport };
    });
  }, [count]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const viewportEl = viewportRef.current;
    if (!viewportEl) return;

    const observer = new ResizeObserver(measure);
    observer.observe(viewportEl);

    /* A late-arriving webfont changes every title's height. */
    document.fonts?.ready.then(measure).catch(() => {});

    return () => observer.disconnect();
  }, [measure]);

  /* --- Is the cycle live at all? -----------------------------------------
   * Both queries start false so the server render and the first client render
   * agree; the effect turns them on afterwards. A cycle that has not started
   * yet is the safe default - the alternative flashes motion during hydration.
   */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const wide = window.matchMedia("(min-width: 64rem)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setCycling(wide.matches);
      setReduceMotion(still.matches);
    };

    sync();
    wide.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const viewportEl = viewportRef.current;
    if (!viewportEl) return;

    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { threshold: 0.2 },
    );
    observer.observe(viewportEl);
    return () => observer.disconnect();
  }, []);

  /* --- Selection, by the shortest route. ----------------------------------
   * The delta is signed and folded into `[-3, +3]` for seven rows, so a row
   * above the centre comes DOWN to it and a row below comes up. With all seven
   * on screen the clicked row is never further than that, which makes the
   * shortest route and the visible route the same thing.
   *
   * The guard is the one place the tripled track shows through: selections that
   * pile up inside a single 360ms travel could walk the counter off the end of
   * the 21-row run. Idle positions sit in `[7, 14)` and one click moves at most
   * three, so it takes three clicks inside 420ms to get there. Refusing that
   * third one holds the picture together, where honouring it would leave the
   * track pointing at a position with nothing rendered.
   */
  const select = useCallback(
    (id: string) => {
      const target = features.findIndex((f) => f.id === id);
      if (target < 0) return;

      setPosition((current) => {
        const from = ((current % count) + count) % count;
        let delta = (target - from) % count;
        if (delta > count / 2) delta -= count;
        if (delta < -count / 2) delta += count;
        if (delta === 0) return current;

        const next = current + delta;
        return next < 0 || next >= COPIES * count ? current : next;
      });
    },
    [count, features],
  );

  /* --- The beat. ---------------------------------------------------------
   * `position` is a dependency on purpose: every change reschedules, so a row
   * the user picked gets a full dwell rather than the remainder of the previous
   * one.
   */
  /*
   * `cycling` is deliberately absent: the beat is live at every width since
   * 2026-09-05, while `cycling` keeps gating the things that only exist at
   * `lg` - the translate, the padding copies, the centre marker.
   */
  const running = inView && !hovered && !focusWithin && !paused && !reduceMotion;

  /*
   * Why the beat is or is not running, as a DOM attribute. Not read by any
   * style or script on the site - it exists so a stalled cycle can be
   * diagnosed from the element inspector (or a headless probe) instead of
   * from guesswork: the 2026-09-08 stall was only pinned down once the state
   * behind `running` could be read off the page.
   */
  const cycleState = running
    ? "running"
    : reduceMotion
      ? "still:reduced-motion"
      : paused
        ? "still:paused"
        : !inView
          ? "still:offscreen"
          : hovered
            ? "still:hover"
            : "still:focus";

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setPosition((p) => p + 1), DWELL_MS);
    return () => window.clearTimeout(id);
  }, [running, position]);

  /* --- Renormalisation. --------------------------------------------------
   * Once the travel has settled, walk the counter a whole copy back into the
   * middle run - forwards or backwards, since a click can now leave in either
   * direction. Scheduled off the travel duration rather than off `transitionend`,
   * which never fires below `lg` (there is no translate there) and would leave
   * the counter drifting until a resize made it matter.
   */
  useEffect(() => {
    const shift = position >= 2 * count ? -count : position < count ? count : 0;
    if (shift === 0) return;

    const id = window.setTimeout(() => {
      setSnapping(true);
      setPosition((p) => p + shift);
    }, SNAP_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [position, count]);

  useEffect(() => {
    if (!snapping) return;
    const id = requestAnimationFrame(() => setSnapping(false));
    return () => cancelAnimationFrame(id);
  }, [snapping]);

  /* --- Priming. ----------------------------------------------------------
   * The very first offset is not a movement, it is where the list starts, and
   * animating it would drag the whole column up half the viewport on load.
   * `primed` withholds the transition until one frame after the offset has been
   * applied, so the opening position lands instantly and everything after it
   * animates. Re-armed whenever the cycle switches on, which is also the moment
   * the translate first appears at `lg`.
   */
  const [primed, setPrimed] = useState(false);

  useEffect(() => {
    if (!cycling) {
      setPrimed(false);
      return;
    }
    const id = requestAnimationFrame(() => setPrimed(true));
    return () => cancelAnimationFrame(id);
  }, [cycling]);

  const offset = useMemo(() => trackOffset(position, metrics), [position, metrics]);

  const copies = useMemo(() => Array.from({ length: COPIES }, (_, copy) => copy), []);

  return (
    <div
      ref={viewportRef}
      data-cycle={cycleState}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setHovered(false);
      }}
      /*
       * `onFocus` / `onBlur` in React are focusin / focusout - they bubble, so
       * these see every row's button. Only ring-worthy focus counts (see the
       * state above); the blur clears it only when focus is LEAVING the list,
       * not when it moves from one row to the next, which is what
       * `relatedTarget` tells us.
       */
      onPointerDownCapture={() => {
        lastPress.current = Date.now();
      }}
      onFocus={(event) => {
        const target = event.target;
        const fromPress = Date.now() - lastPress.current < 500;
        if (!fromPress && target instanceof Element && target.matches(":focus-visible")) {
          setFocusWithin(true);
        }
      }}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setFocusWithin(false);
      }}
      className={cn("relative", "lg:h-[581px] lg:overflow-clip", className)}
    >
      {/*
       * WCAG 2.2.2 - "pause, stop or hide". The cycle starts on its own and runs
       * for longer than 5s, so a mechanism to stop it has to exist. Hovering and
       * focusing already pause it, but neither is something a user can be told
       * about, so this is the one they can rely on.
       *
       * `sr-only` until focused, borrowing `SkipLink`'s idiom verbatim: the design
       * draws no such control and inventing a visible one would change the
       * composition, while this costs nothing visually and stays keyboard
       * reachable and announced. Rendered at every width since the beat went
       * site-wide (2026-09-05) - wherever the highlight advances on its own,
       * the mechanism to stop it must exist.
       */}
      {
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className={cn(
            "sr-only",
            "focus-visible:not-sr-only focus-visible:absolute focus-visible:top-0 focus-visible:left-0 focus-visible:z-20",
            "focus-visible:inline-flex focus-visible:h-11 focus-visible:items-center",
            "focus-visible:rounded-pill focus-visible:bg-action-primary focus-visible:px-5",
            "focus-visible:text-sm-btn focus-visible:text-action-primary-fg",
          )}
        >
          {paused ? "Resume the feature carousel" : "Pause the feature carousel"}
        </button>
      }

      {/*
       * The track. One composited property on one element carries the whole
       * list - no per-row transforms, nothing for the main thread to keep up
       * with while the rest of the page is still loading.
       *
       * THE OFFSET IS AN INLINE `translate`, NOT A CUSTOM PROPERTY.
       *
       * It was written as `--azza-cycle-y` plus a `lg:translate-y-(--azza-cycle-y)`
       * class, which reads better and does not work: the declared value never
       * changes, only the variable it interpolates, and the browser applied each
       * new offset as a discrete jump. Measured with the transition correctly
       * resolved to `translate 0.64s cubic-bezier(0.65,0,0.35,1)` and the element
       * still teleporting. Setting `translate` itself gives the transition two
       * values to interpolate between - and it is what the element wants anyway,
       * since a custom property on the track would invalidate all 21 rows under
       * it on every step.
       *
       * Gated on `cycling` rather than on a `lg:` variant because an inline style
       * has no breakpoint: below `lg` there is no cycle, so there must be no
       * translate at all.
       */}
      <div
        ref={trackRef}
        style={cycling ? { translate: `0 ${offset}px` } : undefined}
        className={cn(
          "flex flex-col gap-10",
          primed && !snapping
            ? "transition-[translate] duration-(--motion-slow) ease-in-out"
            : "transition-none",
          "motion-reduce:transition-none",
        )}
      >
        {copies.map((copy) => (
          <FeatureList
            key={copy}
            features={features}
            activeId={activeId}
            onActiveChange={select}
            presentational={copy !== 1}
            /* Only the real copy exists below `lg`; the padding copies would
             * stack three lists on top of each other in the static layout. */
            className={copy === 1 ? undefined : "hidden lg:grid"}
          />
        ))}
      </div>

      {/*
       * The marker, 570:460 - ONE square, parked on the centre line, never
       * animated. Because every active title comes to rest centred, this is
       * always level with the active row, and the rows visibly travel past it.
       * It is a sibling of the track, so the track's translate does not carry it.
       */}
      <span
        aria-hidden="true"
        className="bg-surface-brand-solid pointer-events-none absolute top-1/2 left-0 z-10 hidden h-[23px] w-[22px] -translate-y-1/2 lg:block"
      />
    </div>
  );
}

export default FeatureCycle;
