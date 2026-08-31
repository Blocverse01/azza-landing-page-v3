import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

import { Icon } from "./Icon";
import { VisuallyHidden } from "./VisuallyHidden";

export interface SearchFieldProps {
  /**
   * Always visually hidden. Required - the field is never label-less.
   *
   * This said "visually hidden unless `labelVisible`", naming a prop that has
   * never existed on this interface. Neither search field in the design draws a
   * visible label (500:2202, 500:1739), so the comment was corrected rather
   * than the prop invented: a typed option nothing needs is API surface that
   * has to be maintained and can drift again.
   */
  label: string;
  placeholder: string;
  name?: string;
  defaultValue?: string;
  /** 360x50 on /blog (802:636); 300 wide in the help sidebar (500:1739). */
  width?: number | "full";
  className?: string;
}

/**
 * The search field.
 *
 * `field.surface` fill, `field.border` border, radius.xl (12px), 12px inset
 * padding, `search` icon at `sm` (20) - 802:636, the 2026-08 operator revision
 * of the control (the original 500:2202 drew 16px inset at radius 16 on the
 * old token values; the revision moved the fill to #F2F2F2 and thinned the
 * border to 30% alpha, both carried by the tokens). The 50px height falls out
 * of 12 + 26 + 12 rather than being pinned, so it survives a user text-size
 * bump. The /help sidebar mounts this same control and follows the revision
 * with it - one component, one look.
 *
 * The placeholder uses `field.placeholder`, which fails AA at 3.87:1 and
 * SHIPS AS DESIGNED (components.md S11 C-9 / D-018). It is a design defect, not
 * an implementation defect, and the operator's fix belongs in the token layer -
 * a local correction here would be invisible drift.
 */
export function SearchField({
  label,
  placeholder,
  name = "q",
  defaultValue,
  width = "full",
  className,
}: SearchFieldProps) {
  const id = `azza-search-${name}`;

  return (
    <div
      className={cn("w-full", className)}
      style={
        width === "full" ? undefined : ({ width: `${width}px`, maxWidth: "100%" } as CSSProperties)
      }
    >
      {/*
       * THE VISIBLE BOX IS THE <label>, not a <div> wrapping one.
       *
       * This element is the whole control the user sees - 360x60 on /blog,
       * 300x60 in the /help sidebar - but only the 26px-tall <input> inside it
       * used to accept a click: the 16px `p-4` inset all round was inert, so
       * 57% of the control's height did nothing. The <label> was a separate
       * sibling holding only `sr-only` text, and `sr-only` clips to 1px - so
       * the label named the input but gave it essentially no activation area.
       *
       * Measured on /help before the change: control 300x60, input 234x26;
       * `elementFromPoint` returned the wrapper <div> for 5 of 9 sample heights
       * and real clicks at 8%/25%/75%/92% of the control height all failed to
       * focus. After, on both routes: 9 of 9 sample heights resolve inside the
       * label and all 7 sampled clicks (5%..95% of the height) focus the input,
       * each firing exactly ONE click event on it.
       *
       * The accessible name is unchanged and is NOT nested: there is exactly
       * one <label> now, and `VisuallyHidden` is its text content rather than a
       * second labelling element. `htmlFor` is kept alongside the wrapping so
       * the association stays explicit; per the HTML label activation steps a
       * click whose target is already the labeled control is not re-dispatched,
       * so wrapping plus `for` does not double-fire.
       *
       * `sr-only` is `position:absolute`, so it takes no part in this flex row
       * and consumes none of the `gap-3`.
       */}
      <label
        htmlFor={id}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl p-3",
          "bg-field-surface text-field-fg",
          "border-field-border border",
          /*
           * `transition-[border-color]`, NOT `transition-colors`. Tailwind's
           * `transition-colors` expands to a property list that includes
           * `outline-color`, and this wrapper is where the focus indicator
           * lives - so the ring faded in over 160ms from `currentColor`.
           * components.md S10.7 forbids transitioning a focus indicator, and a
           * ring that is the wrong colour at t=0 is not there when a keyboard
           * user needs it. Measured: `outline-color` immediately after focus
           * read rgb(53,53,53) and only reached rgb(52,48,233) at t=600ms.
           * The border is the only colour this element actually animates.
           */
          "transition-[border-color] duration-(--motion-fast) ease-out",
          "hoverable:border-field-border-hover",
          // The input suppresses its own outline, so the focus indicator moves
          // to the wrapper - `outline: none` without a replacement is a defect.
          "has-[input:focus-visible]:border-field-border-focus",
          "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2",
          "has-[input:focus-visible]:outline-focus-ring",
        )}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        <Icon name="search" size="sm" className="text-fg-placeholder" />
        <input
          id={id}
          name={name}
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={cn(
            "text-md text-field-fg min-w-0 flex-1 bg-transparent",
            "placeholder:text-field-placeholder",
            "outline-none",
          )}
        />
      </label>
    </div>
  );
}
