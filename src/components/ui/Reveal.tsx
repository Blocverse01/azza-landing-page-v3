"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type HTMLAttributes,
  type Ref,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export interface RevealProps {
  /** Stagger position. Multiplied by --motion-stagger, capped at 6. */
  index?: number;
  as?: "div" | "li" | "section" | "article";
  className?: string;
  children: ReactNode;
}

/**
 * The one entrance verb on the site: fade up 16px. No scale entrances, no blur
 * entrances, no directional variety per section (components.md S10.4).
 *
 * The observer fires once and then disconnects - a reveal that replays on every
 * scroll-by is a distraction, not an entrance.
 *
 * WHY THIS IS NOT AN IntersectionObserver ON ITS OWN. An observer only reports
 * at sampled frames. An element that travels from below the viewport to above
 * it inside ONE scroll step is not intersecting at any sampled frame, so the
 * callback never runs at all - checking `entry.boundingClientRect` inside it
 * fixes nothing - and `data-in` stays `false` forever. That leaves the
 * `opacity: 0` from-state permanent, which is content lost rather than an
 * entrance missed. Measured at 1440x900: a single `wheel(0, 8563)` past this
 * element left it at `opacity: 0` at t=1000ms and still at t=4000ms.
 *
 * Reachable in ordinary use by back-navigation scroll restoration, a scrollbar
 * drag, a hash deep link, or one fast wheel flick. So the observer is backed by
 * the same test expressed geometrically, run on mount and on a passive,
 * rAF-coalesced scroll/resize fallback. Everything unhooks on first reveal.
 *
 * Stagger is capped at 6 so a nine-card blog grid does not take 540ms to finish
 * arriving.
 *
 * REDUCED MOTION AND NO-JS. The hidden from-state lives only inside
 * `@media (prefers-reduced-motion: no-preference)` in theme.css, and layout.tsx
 * ships a `<noscript>` override. A reduced-motion user, a no-JS user and a
 * crawler all get the final state. Never leave an element at opacity 0 when the
 * animation does not run - that is the most common reduced-motion bug and it
 * makes content invisible, which is worse than the animation was.
 *
 * Not applied to: any route's <h1> or anything above the fold at 1440x900 (it
 * is the LCP element and must paint immediately), TopNav, Footer,
 * FooterWatermark, QrBadge, or anything inside CardDeck.
 */
export function Reveal({
  index = 0,
  as = "div",
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  /*
   * `as` is a union of four intrinsic tags, and JSX intersects the props of a
   * union component type - which makes `ref` unassignable to
   * HTMLDivElement & HTMLElement & HTMLLIElement. The four tags share every
   * attribute we actually pass, so the cast narrows to that common surface.
   */
  const Tag = as as unknown as FC<
    HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement | null> }
  >;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /*
     * The observer's own trigger line, expressed geometrically: `threshold: 0`
     * with `rootMargin: 0 0 -12% 0` fires once the element's top crosses 88% of
     * the viewport height.
     *
     * The usual companion test `rect.bottom > 0` is deliberately NOT applied.
     * An element that is already ABOVE the viewport must count as revealed -
     * that is precisely the state the observer cannot see, and treating it as
     * "not yet" is what strands the content.
     */
    const pastTrigger = () =>
      element.getBoundingClientRect().top < window.innerHeight * 0.88;

    // Mount check first: scroll restoration and hash deep links land here, with
    // the element already behind the reader before the observer ever runs.
    if (pastTrigger() || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    let done = false;
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            return;
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    function teardown() {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }

    function reveal() {
      if (done) return;
      done = true;
      teardown();
      setInView(true);
    }

    function onScroll() {
      if (done || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (pastTrigger()) reveal();
      });
    }

    observer.observe(element);

    /*
     * The fallback that closes the single-frame jump. Passive so it never
     * blocks scrolling, rAF-coalesced so it costs one rect read per frame at
     * most, and removed the moment this instance reveals - so the listener
     * count falls to zero as the page is read rather than accumulating.
     */
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return teardown;
  }, []);

  const steps = Math.min(Math.max(index, 0), 6);

  return (
    <Tag
      ref={ref}
      data-in={inView ? "true" : "false"}
      className={cn("reveal", className)}
      style={
        {
          "--reveal-delay": `calc(${steps} * var(--motion-stagger))`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
