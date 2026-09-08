"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { Prose } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface NarrativeParagraph {
  id: string;
  text: string;
}

export interface NarrativeRevealProps {
  paragraphs: readonly NarrativeParagraph[];
  /**
   * What sits beside the prose on the stage - the eyebrow pill and its id
   * carrier. A node, not a render function: this is a client component and a
   * server component cannot hand it a function across the boundary, only
   * serialisable props and already-rendered elements.
   */
  aside: ReactNode;
}

/**
 * NarrativeReveal - the scroll-pinned, word-by-word reveal on the business
 * narrative (operator request, 2026-09-08: "that GSAP style scroll to reveal
 * text feel where the scroll is hijacked for a bit to reveal the entire
 * paragraph").
 *
 * THE MECHANIC
 * ------------
 * A tall track holds a sticky stage. While the stage is pinned, one progress
 * value `p` (0 as it pins, 1 as the track finishes passing it) is written to
 * the prose as a CSS custom property, and every word carries its own start
 * fraction `--w` (its index over the word count). The word's opacity is a
 * pure CSS function of the two - see `.narrative-reveal` in theme.css - so a
 * scroll frame touches ONE property on ONE element, never a word. The words
 * light from 18% to full in reading order, a few words wide at a time, and
 * the reveal is complete at 85% of the travel so the finished paragraph holds
 * on screen for the last stretch before the page moves on.
 *
 * Nothing here listens to `wheel` or `touchmove` and nothing calls
 * `preventDefault`. The page scrolls natively and this reads it - the
 * "hijack" is `position: sticky`, which is the browser's own, interruptible
 * and accessible, not a scroll lock. Both listeners are `passive` and
 * rAF-throttled, the DeckFold precedent.
 *
 * WHERE THE STAGE IS NOT PINNED - below `lg`, and under reduced motion - the
 * words still reveal, but off their own position: `p` becomes how far the
 * prose block has travelled up through the lower 88% of the viewport, which
 * lights each word as it comes into comfortable view and never dims one the
 * reader can already read. Under reduced motion theme.css holds every word at
 * full opacity regardless, and there is no track and no pin.
 *
 * The stage asks the DOM whether it is pinned (`getComputedStyle(stage)
 * .position`) rather than re-declaring `lg` and `prefers-reduced-motion` in
 * script, so the two cannot drift - the DeckFold precedent again.
 *
 * NO JS, CRAWLERS, REDUCED MOTION. The CSS default is `--p: 1`: every word is
 * fully visible until a script says otherwise, and layout.tsx's <noscript>
 * pins it there. The only way a word is ever dim is a live handler that will
 * brighten it. Never leave copy at 18% when nothing is going to run.
 */

/** The reveal completes at this fraction of the pinned travel; the rest holds the finished text. */
const SETTLE = 0.85;

/** Unpinned: a word lights once it rises past this fraction of the viewport height. */
const VIEW_LINE = 0.88;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function NarrativeReveal({ paragraphs, aside }: NarrativeRevealProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const proseRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);
  const last = useRef(-1);

  /*
   * Split once, in render: the word count is what every `--w` is relative to,
   * so it has to be the whole narrative's, not the paragraph's, or the reveal
   * would restart at every paragraph break.
   */
  const total = paragraphs.reduce((sum, paragraph) => sum + paragraph.text.split(" ").length, 0);
  let index = 0;

  const paint = useCallback(() => {
    frame.current = 0;
    const track = trackRef.current;
    const stage = stageRef.current;
    const prose = proseRef.current;
    if (!track || !stage || !prose || typeof window === "undefined") return;

    let p: number;
    const computed = window.getComputedStyle(stage);

    if (computed.position === "sticky") {
      const pinTop = Number.parseFloat(computed.top) || 0;
      const travel = track.offsetHeight - stage.offsetHeight;
      const top = track.getBoundingClientRect().top;
      p = travel > 0 ? clamp01((pinTop - top) / travel / SETTLE) : 1;
    } else {
      const rect = prose.getBoundingClientRect();
      const line = window.innerHeight * VIEW_LINE;
      p = rect.height > 0 ? clamp01((line - rect.top) / rect.height) : 1;
    }

    // Two decimals is below what a 0.82-wide opacity ramp can show; skipping
    // equal frames keeps a still page from touching the DOM at all.
    const rounded = Math.round(p * 200) / 200;
    if (rounded === last.current) return;
    last.current = rounded;
    prose.style.setProperty("--p", `${rounded}`);
  }, []);

  useEffect(() => {
    const schedule = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame.current) window.cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [paint]);

  const prose = (
    <div ref={proseRef} className="narrative-reveal contents">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.id}>
          {paragraph.text.split(" ").map((word, i) => {
            const start = index / total;
            index += 1;
            return (
              <span key={`${paragraph.id}-${i}`}>
                {i > 0 ? " " : null}
                <span
                  className="narrative-word"
                  style={{ "--w": `${start.toFixed(4)}` } as CSSProperties}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );

  return (
    /*
     * 240vh of track at `lg` and motion-safe: the stage is one viewport (less
     * the nav) and the words get the remaining ~140vh of scroll - about 1300px
     * at 1440x900 for the narrative's ~110 words, which is a deliberate pace
     * without ever feeling stuck. Everywhere else this is a plain wrapper and
     * the block sits in normal flow.
     */
    <div ref={trackRef} className="motion-safe:lg:h-[240vh]">
      <div
        ref={stageRef}
        className={cn(
          "relative",
          "motion-safe:lg:sticky motion-safe:lg:top-(--height-nav)",
          "motion-safe:lg:flex motion-safe:lg:min-h-[calc(100dvh-var(--height-nav))] motion-safe:lg:items-center",
        )}
      >
        {/*
         * 800:532 - the pill beside a 650 prose column, H gap 48 at `lg`,
         * stacked at 48 below. Declared here rather than in WhyAzzaNarrative
         * only because the prose has to be a child of this client boundary;
         * every measurement is still the frame's.
         */}
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start">
          {aside}

          {/*
           * measure={false} because this column caps at the designed 650, which
           * is tighter than the 842 reading measure - never wider.
           *
           * The cap trim on every paragraph is 800:397's own setting; a
           * progressive enhancement per the ExchangeWidget note. `[&_p]` rather
           * than `[&>p]`: the paragraphs sit inside the `display: contents`
           * div that carries the progress property.
           */}
          <Prose
            step="2xl-prose"
            gap={48}
            measure={false}
            className="max-w-[650px] min-w-0 flex-1 [&_p]:[text-box:trim-both_cap_alphabetic]"
          >
            {prose}
          </Prose>
        </div>
      </div>
    </div>
  );
}
