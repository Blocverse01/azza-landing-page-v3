import { cn } from "@/lib/cn";

import { Icon } from "./Icon";
import type { IconName } from "./Icon/types";

export interface SelectPillProps {
  /** Leading glyph - a currency flag or a coin mark. */
  icon?: IconName;
  /** The ticker or currency code, e.g. "NGN", "USDT". */
  code: string;
  /** Renders the trailing chevron-down. Default true. */
  chevron?: boolean;
  /** Accessible name for the control, e.g. "Select send currency". Required. */
  "aria-label": string;
  className?: string;
}

/**
 * The currency / ticker selector chip.
 *
 * The design draws these at three different heights - 42, 44 and 24
 * (412:1652, 412:1664, 412:1869/412:1883). ALL of them render at 44:
 * responsive.md S6.2 sets a 44px floor for every interactive element at every
 * breakpoint, and a 24px tap target on a WhatsApp-first consumer product is not
 * a fidelity question.
 *
 * The leading glyph is decorative - the visible `code` beside it already
 * carries the meaning, and the control's own `aria-label` names it. One
 * accessible name, never two.
 */
export function SelectPill({
  icon,
  code,
  chevron = true,
  "aria-label": ariaLabel,
  className,
}: SelectPillProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-pill px-4",
        "bg-field-surface text-sm text-field-fg",
        "transition-[background-color,transform] duration-(--motion-fast) ease-out",
        "hoverable:bg-surface-sunken focus-visible:bg-surface-sunken",
        "active:translate-y-px active:duration-(--motion-instant)",
        className,
      )}
    >
      {icon ? <Icon name={icon} size="md" /> : null}
      <span>{code}</span>
      {chevron ? (
        <Icon name="chevron-down" size="sm" className="text-fg-secondary" />
      ) : null}
    </button>
  );
}
