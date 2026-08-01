import type { ElementType, ReactNode } from "react";

export interface VisuallyHiddenProps {
  as?: "span" | "div";
  children: ReactNode;
}

/**
 * Content that is available to assistive technology but not painted.
 *
 * Use it for the half of a label the design leaves to context - a search
 * field's name, a table caption, the "opens in a new tab" note. Do NOT use it
 * to hide something from everyone: that is `aria-hidden`, and the two are not
 * interchangeable.
 */
export function VisuallyHidden({
  as = "span",
  children,
}: VisuallyHiddenProps) {
  const Tag: ElementType = as;
  return <Tag className="sr-only">{children}</Tag>;
}
