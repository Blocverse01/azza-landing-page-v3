import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ProseProps {
  /**
   * md-prose  -> 20/1.60 Regular, article + help body.
   * 2xl-prose -> 32/1.40 Medium, business narrative.
   */
  step?: "md-prose" | "2xl-prose";
  /**
   * Paragraph gap. 60px in the article body (352:3707), 20px in the business
   * narrative (412:2520).
   */
  gap?: 20 | 60;
  /**
   * Body ink. Defaults to whichever the design gives the chosen `step`:
   * `md-prose` -> `prose` (352:3708), `2xl-prose` -> `body`
   * (412:2521-2525). Pass it explicitly only to override that.
   */
  tone?: "prose" | "body";
  /** Caps the reading measure at 842px. Never grows above it. Default true. */
  measure?: boolean;
  as?: "div" | "section";
  className?: string;
  children: ReactNode;
}

const STEP_CLASS: Record<NonNullable<ProseProps["step"]>, string> = {
  "md-prose": "text-md-prose",
  "2xl-prose": "text-2xl-prose",
};

const GAP_CLASS: Record<NonNullable<ProseProps["gap"]>, string> = {
  20: "gap-5",
  60: "gap-15",
};

const TONE_CLASS: Record<NonNullable<ProseProps["tone"]>, string> = {
  prose: "text-fg-prose", // article + help body, 352:3708
  body: "text-fg-body", // business narrative, 412:2521-2525
};

/*
 * Ink is a function of the step in the design, so that is the default rather
 * than a single pinned colour. `text-fg-prose` was pinned for both, which made
 * the business narrative `fg.prose` against an authored `fg.body`, and there
 * was no prop to say otherwise - only a `className`, which `cn` will not
 * resolve against the pinned class (D7). The explicit `tone` prop is the
 * override.
 */
const STEP_TONE: Record<
  NonNullable<ProseProps["step"]>,
  NonNullable<ProseProps["tone"]>
> = {
  "md-prose": "prose",
  "2xl-prose": "body",
};

/**
 * Long-form body copy.
 *
 * Run-in bold inside prose is `<strong>` at the same size, leading and
 * tracking - not a separate token (typography.md S4.3). Preflight's
 * `font-weight: bolder` would land on 700, so it is pinned to the authored
 * Semi Bold 600 here.
 *
 * Inline prose links are underlined at Regular 400 and take `link.inline`.
 *
 * The 842px measure is a reading measure: it must never grow with the viewport.
 * Fluid-scaling it to 1920 would give roughly 140 characters per line, which is
 * a regression caused by a larger screen.
 */
export function Prose({
  step = "md-prose",
  gap = 60,
  tone,
  measure = true,
  as = "div",
  className,
  children,
}: ProseProps) {
  const Tag: ElementType = as;

  return (
    <Tag
      className={cn(
        "flex flex-col",
        TONE_CLASS[tone ?? STEP_TONE[step]],
        STEP_CLASS[step],
        GAP_CLASS[gap],
        measure ? "w-full max-w-(--container-prose)" : "w-full",
        "[&_strong]:font-semibold",
        "[&_a]:text-link-inline [&_a]:underline",
        // `transition-[color]`, NOT `transition-colors`: the latter's property
        // list carries `outline-color`, so an inline link's focus ring would
        // interpolate from currentColor. It is invisible today only because
        // `link.inline` happens to equal `focus.ring`; the moment either token
        // moves it becomes a 160ms-late focus ring. components.md S10.7.
        "[&_a]:transition-[color] [&_a]:duration-(--motion-fast) [&_a]:ease-out",
        "fine-pointer:[&_a:hover]:text-link-inline-hover",
        "[&_a:focus-visible]:text-link-inline-hover",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
