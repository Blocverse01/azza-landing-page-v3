import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type DisplayStep =
  | "display-hero"
  | "display-1"
  | "display-2"
  | "display-3"
  | "display-3-bold"
  | "display-4"
  | "display-4-tight"
  | "display-5"
  | "display-6";

/*
 * Static class names - Tailwind must see the literal string to emit the
 * utility, so a template literal like `text-${step}` would produce nothing.
 */
const STEP_CLASS: Record<DisplayStep, string> = {
  "display-hero": "text-display-hero",
  "display-1": "text-display-1",
  "display-2": "text-display-2",
  "display-3": "text-display-3",
  "display-3-bold": "text-display-3-bold",
  "display-4": "text-display-4",
  "display-4-tight": "text-display-4-tight",
  "display-5": "text-display-5",
  "display-6": "text-display-6",
};

/*
 * The Subjectivity weight is chosen to balance the display weight
 * (typography.md S5): Bold -> Bold, Semi Bold -> Medium, Regular -> Light.
 */
const SWAP_WEIGHT_CLASS: Record<
  NonNullable<DisplayHeadingProps["swapWeight"]>,
  string
> = {
  light: "font-light",
  medium: "font-medium",
  bold: "font-bold",
};

export interface DisplayHeadingProps {
  /**
   * The COMPLETE, verbatim source string, in its original case - e.g.
   * "Your mONEY", not "YOUR MONEY". Uppercasing happens in CSS and in the font
   * (Bebas Neue is uppercase-only). Screen readers and copy/paste must get the
   * authored string.
   */
  children: string;
  /**
   * Zero-based character indices in `children` whose glyph is replaced by the
   * accent face. Data-driven and auditable. NEVER a regex over every "o" - that
   * would corrupt the six headlines which deliberately do not carry the device
   * (412:787, 412:1620, 412:1859, 507:759, 458:385, 458:394).
   */
  swapIndices?: readonly number[];
  /** Weight of the swapped glyph. Default "medium". */
  swapWeight?: "light" | "medium" | "bold";
  /** Typography token, without the `text-` prefix. */
  step: DisplayStep;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
  className?: string;
}

/**
 * The AZZA brand device: nine display headlines replace one "O" with a glyph
 * from the accent face mid-word.
 *
 * The swapped span inherits font-size, line-height and letter-spacing
 * unchanged. ONLY font-family and font-weight differ.
 *
 * `display-2` keeps its POSITIVE +0.03em tracking and Regular weight. It is the
 * one display step an implementer is most likely to "correct". Do not.
 */
export function DisplayHeading({
  children,
  swapIndices,
  swapWeight = "medium",
  step,
  as: Tag = "h2",
  id,
  className,
}: DisplayHeadingProps) {
  const Element: ElementType = Tag;

  return (
    <Element
      id={id}
      className={cn(
        "font-display uppercase",
        STEP_CLASS[step],
        className,
      )}
    >
      {renderSegments(children, swapIndices, SWAP_WEIGHT_CLASS[swapWeight])}
    </Element>
  );
}

function renderSegments(
  text: string,
  swapIndices: readonly number[] | undefined,
  weightClass: string,
): ReactNode {
  if (!swapIndices || swapIndices.length === 0) return text;

  const swaps = new Set(swapIndices);
  const nodes: ReactNode[] = [];
  let buffer = "";

  const flush = (key: string) => {
    if (buffer) {
      nodes.push(<span key={key}>{buffer}</span>);
      buffer = "";
    }
  };

  for (let i = 0; i < text.length; i += 1) {
    if (swaps.has(i)) {
      flush(`run-${i}`);
      nodes.push(
        <span key={`swap-${i}`} className={cn("font-accent", weightClass)}>
          {text[i]}
        </span>,
      );
    } else {
      buffer += text[i];
    }
  }

  flush("run-end");
  return nodes;
}
