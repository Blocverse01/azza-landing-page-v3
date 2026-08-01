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
  measure = true,
  as = "div",
  className,
  children,
}: ProseProps) {
  const Tag: ElementType = as;

  return (
    <Tag
      className={cn(
        "flex flex-col text-fg-prose",
        STEP_CLASS[step],
        GAP_CLASS[gap],
        measure ? "w-full max-w-(--container-prose)" : "w-full",
        "[&_strong]:font-semibold",
        "[&_a]:text-link-inline [&_a]:underline",
        "[&_a]:transition-colors [&_a]:duration-(--motion-fast) [&_a]:ease-out",
        "fine-pointer:[&_a:hover]:text-link-inline-hover",
        "[&_a:focus-visible]:text-link-inline-hover",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
