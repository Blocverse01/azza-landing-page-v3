"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import type { LegalSection } from "@/content/legal";

/*
 * THE CONTENTS RAIL.
 *
 * The interaction is adapted from the teardown of interfere.com/legal/* (design
 * study, 2026-09-01), with its two structural defects fixed rather than copied.
 *
 * WHAT WAS TAKEN - the RANGE highlight. A conventional rail marks the one
 * section you are "in". This one brackets EVERY section whose body currently
 * intersects the viewport, with a single pill that grows and slides to cover
 * the whole run, and darkens all of them together. On a document of short
 * clauses that is the more honest signal: when three clauses fit on screen,
 * three light up. The pill's height is therefore a multiple of a row, not a
 * fixed 1-row marker.
 *
 * WHAT WAS FIXED:
 *
 *   1. Their rows are `<button>` with no href, and no hash is ever written, so
 *      no clause on either page is linkable, shareable, or openable in a new
 *      tab - on documents whose whole purpose is being cited clause by clause.
 *      Ours are plain `<a href="#id">`. That also deletes every line of scroll
 *      code: `html` already carries `scroll-behavior: smooth` under
 *      `prefers-reduced-motion: no-preference` and `scroll-padding-top:
 *      var(--height-nav)` unconditionally (theme.css S10.8), so a native anchor
 *      lands correctly under the sticky bar, animates when it should, and
 *      updates the URL - none of which their JS handler does.
 *
 *   2. Their `aria-current` tracks something other than the visual highlight -
 *      measured six entries adrift at scrollY 9000 - and marks exactly one row
 *      while three are lit. Ours puts `aria-current="location"` on the FIRST
 *      row of the live run, which is the section a reader would name as "where
 *      I am", and the run itself is conveyed by the rows' own styling. The two
 *      can never disagree because both derive from the same `live` state.
 *
 * THE PILL IS NOT ANIMATED IN REACT. Its `top`/`height` are written straight to
 * the node from a rAF loop, so a 60fps settle costs no re-renders; React owns
 * only the discrete `live` range. Under `prefers-reduced-motion: reduce` the
 * spring is skipped and the pill snaps.
 */

/** Spring constants. Critically damped enough to settle without overshoot. */
const STIFFNESS = 170;
const DAMPING = 26;
/** Below this, in px, the spring is done and the target is written exactly. */
const EPSILON = 0.25;

export interface LegalTocProps {
  sections: readonly LegalSection[];
  /** Labels the rail for assistive tech, e.g. "Privacy Policy contents". */
  label: string;
  className?: string;
}

interface Geometry {
  top: number;
  height: number;
}

export function LegalToc({ sections, label, className }: LegalTocProps) {
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  /** [firstIndex, lastIndex] of the sections currently on screen. */
  const [live, setLive] = useState<[number, number]>([0, 0]);

  /* ---- the spring, driven outside React ---- */
  const frame = useRef(0);
  const current = useRef<Geometry | null>(null);
  const velocity = useRef<Geometry>({ top: 0, height: 0 });
  const target = useRef<Geometry>({ top: 0, height: 0 });

  const paint = useCallback((g: Geometry) => {
    const node = pillRef.current;
    if (!node) return;
    node.style.top = `${g.top}px`;
    node.style.height = `${Math.max(0, g.height)}px`;
    node.style.opacity = "1";
  }, []);

  const springTo = useCallback(
    (next: Geometry) => {
      target.current = next;

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // First paint and reduced motion both snap: there is no previous
      // position to travel from, and animating on mount would slide the pill
      // in from nowhere on every page load.
      if (!current.current || reduce) {
        current.current = { ...next };
        velocity.current = { top: 0, height: 0 };
        paint(next);
        return;
      }
      if (frame.current) return;

      let last = performance.now();
      const step = (now: number) => {
        // Clamped so a backgrounded tab cannot integrate one enormous step.
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;

        const cur = current.current;
        const tgt = target.current;
        if (!cur) return;

        let settled = true;
        for (const axis of ["top", "height"] as const) {
          const force = -STIFFNESS * (cur[axis] - tgt[axis]) - DAMPING * velocity.current[axis];
          velocity.current[axis] += force * dt;
          cur[axis] += velocity.current[axis] * dt;
          if (
            Math.abs(tgt[axis] - cur[axis]) > EPSILON ||
            Math.abs(velocity.current[axis]) > EPSILON
          ) {
            settled = false;
          }
        }

        if (settled) {
          current.current = { ...tgt };
          velocity.current = { top: 0, height: 0 };
          paint(tgt);
          frame.current = 0;
          return;
        }

        paint(cur);
        frame.current = requestAnimationFrame(step);
      };

      frame.current = requestAnimationFrame(step);
    },
    [paint],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  /* ---- which sections are on screen ---- */
  useEffect(() => {
    const ids = sections.map((s) => s.id);

    const measure = () => {
      // The sticky bar covers the top of the viewport, so a section hidden
      // behind it is not "on screen". `--azza-nav-h` is the MEASURED bar
      // height (85/89 by breakpoint), not the 88 design token - this is a hit
      // test, so the real number is the right one.
      const navRaw = getComputedStyle(document.documentElement).getPropertyValue("--azza-nav-h");
      const navH = Number.parseFloat(navRaw) || 0;
      const viewTop = navH;
      const viewBottom = window.innerHeight;

      let first = -1;
      let last = -1;
      let lastPassed = 0;

      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < viewBottom && r.bottom > viewTop) {
          if (first === -1) first = i;
          last = i;
        }
        if (r.top <= viewTop) lastPassed = i;
      });

      // Nothing intersecting means we are deep inside one long clause (or past
      // the last one); hold the section we are inside rather than blanking.
      const range: [number, number] = first === -1 ? [lastPassed, lastPassed] : [first, last];

      setLive((prev) => (prev[0] === range[0] && prev[1] === range[1] ? prev : range));
    };

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  /* ---- move the pill whenever the range changes ---- */
  useEffect(() => {
    const firstRow = rowRefs.current[live[0]];
    const lastRow = rowRefs.current[live[1]];
    if (!firstRow || !lastRow) return;
    springTo({
      top: firstRow.offsetTop,
      height: lastRow.offsetTop + lastRow.offsetHeight - firstRow.offsetTop,
    });
  }, [live, springTo]);

  return (
    <nav aria-label={label} className={cn("w-full", className)}>
      <p className="text-sm-meta text-fg-caption-soft mb-3 px-2">Contents</p>

      <ul className="relative m-0 list-none p-0">
        {/*
         * The pill. `aria-hidden` and out of flow: it is the visual half of a
         * state the rows already carry in text colour and `aria-current`, so
         * announcing it would be a third telling of the same fact.
         */}
        <span
          ref={pillRef}
          aria-hidden="true"
          className={cn(
            "bg-surface-faint pointer-events-none absolute inset-x-0 top-0 -z-10",
            "rounded-lg opacity-0",
          )}
        />

        {sections.map((section, i) => {
          const isLive = i >= live[0] && i <= live[1];
          return (
            <li
              key={section.id}
              ref={(node) => {
                rowRefs.current[i] = node;
              }}
              className="relative"
            >
              <a
                href={`#${section.id}`}
                aria-current={i === live[0] ? "location" : undefined}
                className={cn(
                  "flex gap-2 rounded-lg px-2 py-1.5",
                  "text-sm-body no-underline",
                  "transition-[color] duration-(--motion-fast) ease-out",
                  /*
                   * THREE INKS, THREE MEANINGS. Hover used to resolve to
                   * `fg-body` - the SAME ink the live rows take - so pointing
                   * at a row made it indistinguishable from the highlighted
                   * range, and with the pill spanning two or three rows the
                   * rail read as four things selected at once. Reported from
                   * the browser, and reproduced: hovering row 12 painted it
                   * rgb(53,53,53), byte-identical to live rows 5 and 6.
                   *
                   *   rest   fg-caption-soft  #5C5C5CCC
                   *   hover  fg-caption       #4C4C4C    + underline
                   *   live   fg-body          #353535    + the pill
                   *
                   * Hover now lands BETWEEN rest and live and never reaches the
                   * live ink, so "where I am reading" and "what I am pointing
                   * at" can never look the same. The underline carries most of
                   * the affordance - it is a different KIND of signal from a
                   * colour step, which is what keeps the two unambiguous
                   * rather than merely a shade apart. A live row keeps its own
                   * ink on hover and takes only the underline.
                   */
                  isLive ? "text-fg-body" : "text-fg-caption-soft hoverable:text-fg-caption",
                  "hoverable:underline hoverable:underline-offset-2",
                  // Focus already draws the global ring, so it needs no ink of
                  // its own; the underline keeps pointer and keyboard matched.
                  "focus-visible:underline focus-visible:underline-offset-2",
                )}
              >
                {/*
                 * The clause number is a fixed column so the labels align on a
                 * single left edge whatever the number's width (1.0 -> 20.0).
                 * `tabular-nums` keeps that column from shuffling.
                 */}
                <span className="text-fg-ghost w-10 shrink-0 whitespace-nowrap tabular-nums">
                  {section.number}
                </span>
                <span className="min-w-0">{section.heading}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default LegalToc;
