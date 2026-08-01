"use client";

import { useEffect, useState } from "react";

/**
 * The motion runtime.
 *
 * The durations mirror the `--motion-*` tokens in `src/app/theme.css` exactly
 * (design/components.md S10.2). They exist in JS only for the handful of places
 * that must schedule something in script - a close delay, a staggered timeout.
 * Anything that can be a CSS transition should read the CSS token instead.
 *
 * Nothing on the site is longer than 640ms, and nothing outside the card deck
 * is longer than 520ms.
 */
export const MOTION = {
  /** Press states, focus box-shadow, icon colour change. */
  instant: 80,
  /** Hover on small controls - links, nav items, chips, icon buttons. */
  fast: 160,
  /** The default state change. Accordion, dropdown, chevron, crossfade. */
  base: 240,
  /** Mobile nav sheet, modal-scale surfaces. */
  slow: 360,
  /** Scroll entrance. */
  reveal: 520,
  /** Card-deck promotion. The longest thing on the site. */
  deck: 640,
  /** Per-child delay in a staggered group. */
  stagger: 60,
} as const;

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether the user has asked for reduced motion.
 *
 * Subscribes to the media query's `change` event rather than reading it once at
 * mount. People toggle this setting mid-session - typically the moment they
 * start feeling unwell - and a component that read it once would keep animating
 * at them. components.md S10.10.
 *
 * Returns `false` on the server and for the first client paint, so the markup
 * hydrates identically either way; the effect corrects it before any
 * user-visible animation can run.
 *
 * This is the only place in the codebase permitted to read the query.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const list = window.matchMedia(QUERY);
    setReduced(list.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * The `behavior` to pass to `scrollTo` / `scrollIntoView`.
 *
 * Programmatic scrolling always goes through this. Never hard-code
 * `behavior: "smooth"` - that ignores the user's preference, and the CSS
 * `scroll-behavior` override cannot reach a scripted scroll.
 */
export function scrollBehavior(reduced: boolean): ScrollBehavior {
  return reduced ? "auto" : "smooth";
}
