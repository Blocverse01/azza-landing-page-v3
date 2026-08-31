import { cn } from "@/lib/cn";

import { Icon } from "./Icon";
import type { IconName } from "./Icon/types";
import { SelectPillPicker } from "./SelectPillPicker";

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
/*
 * `outlined` was added for the redesigned cross-border converter (782:571 /
 * 782:626): a white chip with a `line-subtle` hairline and a 20px radius, sitting
 * inside the amount field's own bordered box. It is the first tone whose SHAPE
 * differs, which is why `rounded-*` moved out of `PILL_CLASS` and into each entry
 * here rather than being overridden from a call site - `cn` joins without
 * merging, so a `rounded-3xl` passed as `className` alongside a base
 * `rounded-pill` would be resolved by Tailwind's own sort order rather than by
 * the author. The two original tones keep `rounded-pill`, so nothing moves for
 * their call sites.
 */
const TONE_CLASS: Record<NonNullable<SelectPillProps["tone"]>, string> = {
  field: "rounded-pill bg-field-surface text-field-fg",
  plain: "rounded-pill bg-transparent text-fg-primary",
  outlined: "rounded-3xl border border-line-subtle bg-surface-page text-fg-primary",
};

export interface SelectPillOption {
  /** The value the consumer receives back, e.g. "USDT". */
  value: string;
  /** Visible menu text. Defaults to `value`. */
  label?: string;
  /** The row's coin mark or flag roundel, matching the pill's own. */
  icon?: IconName;
}

export interface SelectPillProps {
  /** Leading glyph - a currency flag or a coin mark. */
  icon?: IconName;
  /** The ticker or currency code, e.g. "NGN", "USDT". */
  code: string;
  /**
   * Chip fill. `field` (default) is the filled chip; `plain` is the fill-less
   * chip the design draws inside the light exchange row (412:1869).
   */
  tone?: "field" | "plain" | "outlined";
  /** Renders the trailing chevron-down. Default true. */
  chevron?: boolean;
  /**
   * The picker's choices. PRESENCE IS THE MODE SWITCH: with `options` the pill
   * is a real, working selector (see the note below); without them it renders
   * the historical inert chip, which is what the three light-exchange call
   * sites still draw. A consumer passing `options` must be a client component
   * and must pass `value` + `onChange` with it.
   */
  options?: readonly SelectPillOption[];
  /** The selected option's value. Functional mode only. */
  value?: string;
  /** Change handler. Functional mode only. */
  onChange?: (value: string) => void;
  /** Accessible name for the control, e.g. "Select send currency". Required. */
  "aria-label": string;
  className?: string;
}

/*
 * WHY THE INERT BRANCH IS `aria-disabled`.
 *
 * The design draws the chip with a chevron and specifies no picker: no menu
 * frame, no option list, no open state, nowhere for the alternatives to come
 * from. So for those call sites there is no behaviour to implement, and
 * inventing a listbox would be inventing design.
 *
 * What was shipped instead was a bare `<button>` with an `aria-label` and no
 * handler - a control that announces "Select send currency, button", accepts
 * Enter, and does nothing. That is the one outcome worse than an unavailable
 * control: it is an unavailable control that claims to work.
 *
 * `aria-disabled`, never `disabled`. A `disabled` button leaves the focus
 * order entirely, so a keyboard user tabbing the widget would never learn the
 * chip exists - and the chip carries the currency, which is information. This
 * is the project's established pattern for the seven other controls the design
 * defines no behaviour for (the Wrapped arrows, the testimonial play buttons):
 * reachable, focusable, and honest about being inert.
 *
 * HOW THE NOTE REACHES AT, AND WHY IT IS NOT A `<VisuallyHidden>` CHILD.
 * An `aria-label` REPLACES the element's contents for name computation, and a
 * button is a leaf in the accessibility tree - a screen reader announces its
 * name, not its subtree. A visually-hidden child would therefore be silent:
 * dead markup that reads as a fix. The note ships as part of the accessible
 * name, which is the only channel this control has that is not painted. It is
 * appended to - never replaces - the consumer's own label, so the call sites
 * keep the names the design gives them.
 *
 * `aria-disabled` alone already announces "unavailable"/"dimmed"; the sentence
 * says WHY, which "unavailable" cannot. The crypto-wallet widget now passes
 * `options` (operator request, 2026-08-11) and takes the functional branch;
 * delete the inert branch entirely the moment the remaining call sites do too.
 *
 * THE FUNCTIONAL BRANCH DELEGATES TO `SelectPillPicker` (operator request,
 * 2026-08-11: a designed menu, consistent with the site). It first shipped as
 * a native `<select>` overlaid on the pill; the OS popup it opened was the one
 * part of the control the design system could not touch, and the operator
 * asked for it to be designed. The picker draws the same panel grammar as the
 * nav dropdowns and implements the WAI-ARIA listbox contract - see its own
 * docblock. The split also keeps the client boundary out of THIS module, so
 * the inert branch stays renderable from Server Components.
 */
const UNAVAILABLE_NOTE = "Currency selection is not available";

/* No `rounded-*` here - the tone owns the shape. See TONE_CLASS. */
const PILL_CLASS = "inline-flex h-11 items-center gap-2 px-4";

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
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: SelectPillProps) {
  if (options !== undefined) {
    return (
      <SelectPillPicker
        icon={icon}
        code={code}
        options={options}
        value={value}
        onChange={onChange}
        ariaLabel={ariaLabel}
        triggerClassName={cn(
          PILL_CLASS,
          "cursor-pointer text-sm",
          TONE_CLASS[tone],
          "transition-[background-color,translate] duration-(--motion-fast) ease-out",
          "hoverable:bg-surface-sunken focus-visible:bg-surface-sunken",
          "active:translate-y-px active:duration-(--motion-instant)",
          className,
        )}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={`${ariaLabel}. ${UNAVAILABLE_NOTE}.`}
      aria-disabled="true"
      className={cn(
        PILL_CLASS,
        "text-sm",
        TONE_CLASS[tone],
        // `translate`, not `transform`: v4's translate-y-px sets the standalone
        // property - the same fix QrBadge documents.
        "transition-[background-color,translate] duration-(--motion-fast) ease-out",
        "hoverable:bg-surface-sunken focus-visible:bg-surface-sunken",
        "active:translate-y-px active:duration-(--motion-instant)",
        className,
      )}
    >
      {icon ? <Icon name={icon} size="md" /> : null}
      <span>{code}</span>
      {chevron ? <Icon name="chevron-down" size="sm" className="text-fg-secondary" /> : null}
    </button>
  );
}
