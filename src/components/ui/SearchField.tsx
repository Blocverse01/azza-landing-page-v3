import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

import { Icon } from "./Icon";
import { VisuallyHidden } from "./VisuallyHidden";

export interface SearchFieldProps {
  /** Visually hidden unless `labelVisible`. Required - the field is never label-less. */
  label: string;
  placeholder: string;
  name?: string;
  defaultValue?: string;
  /** 360x58 on /blog (500:2202); 300x58 in the help sidebar (500:1739). */
  width?: number | "full";
  className?: string;
}

/**
 * The search field.
 *
 * `surface.field` fill, `line.default` border, radius.2xl (16px), 16px inset
 * padding, `search` icon at `sm` (20). The 58px design height falls out of
 * 16 + 26 + 16 rather than being pinned, so it survives a user text-size bump.
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
        width === "full"
          ? undefined
          : ({ width: `${width}px`, maxWidth: "100%" } as CSSProperties)
      }
    >
      <label htmlFor={id}>
        <VisuallyHidden>{label}</VisuallyHidden>
      </label>

      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl p-4",
          "bg-field-surface text-field-fg",
          "border border-field-border",
          "transition-colors duration-(--motion-fast) ease-out",
          "hoverable:border-field-border-hover",
          // The input suppresses its own outline, so the focus indicator moves
          // to the wrapper - `outline: none` without a replacement is a defect.
          "has-[input:focus-visible]:border-field-border-focus",
          "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2",
          "has-[input:focus-visible]:outline-focus-ring",
        )}
      >
        <Icon name="search" size="sm" className="text-fg-placeholder" />
        <input
          id={id}
          name={name}
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-md text-field-fg",
            "placeholder:text-field-placeholder",
            "outline-none",
          )}
        />
      </div>
    </div>
  );
}
