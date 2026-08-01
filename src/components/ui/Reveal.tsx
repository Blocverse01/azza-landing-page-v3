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

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
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
