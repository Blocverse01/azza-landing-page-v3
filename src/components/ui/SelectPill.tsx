import { cn } from "@/lib/cn";

import { Icon } from "./Icon";
import type { IconName } from "./Icon/types";

/*
 * The design draws this chip two ways, and neither is an opaque grey:
 *
 *   412:1869  no fill,     fg.primary ink  - inside the light exchange row
 *   412:1652  white @ 9%,  on-inverse ink  - on the orchid crypto panel
 *
 * `field` reproduces the second (its two consumers reach the glass fill by
 * remapping `--color-field-surface` on the element). `plain` is the first.
 *
 * `field` REMAINS THE DEFAULT even though `plain` is what an unstyled light
 * surface should get. Flipping it would drop the fill out from under the
 * orchid consumers, whose override is keyed to the `bg-field-surface` class
 * this primitive emits - and those are consumers this pass may not edit. The
 * light-surface consumer therefore still needs `tone="plain"` passed to it;
 * that one-token edit is recorded as a finding.
 */
const TONE_CLASS: Record<NonNullable<SelectPillProps["tone"]>, string> = {
  field: "bg-field-surface text-field-fg",
  plain: "bg-transparent text-fg-primary",
};

export interface SelectPillProps {
  /** Leading glyph - a currency flag or a coin mark. */
  icon?: IconName;
  /** The ticker or currency code, e.g. "NGN", "USDT". */
  code: string;
  /**
   * Chip fill. `field` (default) is the filled chip; `plain` is the fill-less
   * chip the design draws inside the light exchange row (412:1869).
   */
  tone?: "field" | "plain";
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
  tone = "field",
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
        "text-sm",
        TONE_CLASS[tone],
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
