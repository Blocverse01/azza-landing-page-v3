"use client";

import { useId, useState, type ChangeEvent } from "react";

import { Button, Icon, SelectPill } from "@/components/ui";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * The Cross-Border Payments exchange widget - Figma `412:1861`.
 *
 * PRESENTATIONAL. There is no rates feed, no backend and no calculation
 * anywhere in this file. The two amount fields are independent: typing in
 * "You send" does NOT derive "Receiver gets", because the only rate the design
 * states is `1 USDC ~ NGN 1,387` (`412:1878`) and that is a USDC/NGN rate while
 * the fields are set to NGN and GHS. Deriving one field from the other would
 * mean inventing a rate for a pair the design never gives - fabricated data
 * dressed up as a live quote, on a payments product. The rate line is
 * transcribed verbatim and is never recomputed.
 *
 * `"use client"` is mandated by components.md S3: amount inputs and currency
 * selects. It is the only client boundary in this section - the hero shell
 * above it stays on the server.
 *
 * MOTION. Nothing here animates in JavaScript. Hover recolours only, at
 * `--motion-fast`, per components.md S10.6; the focus ring is a box-shadow and
 * is not transitioned, per S10.7. Every transition therefore inherits the
 * global `prefers-reduced-motion: reduce` floor in theme.css, and no element is
 * ever left at `opacity: 0`.
 */
export interface ExchangeWidgetProps {
  className?: string;
}

/**
 * The rate string exactly as authored in `412:1878`. Transcribed content, not a
 * computed value - it must never be derived from the amounts, and the amounts
 * must never be derived from it.
 */
const RATE_NOTE = "1 USDC ~ NGN 1,387";

export function ExchangeWidget({ className }: ExchangeWidgetProps) {
  const sendId = useId();
  const receiveId = useId();
  const rateId = useId();

  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  return (
    <div
      // `role="group"` + a name, rather than a heading: the design gives the
      // card no heading of its own, and inventing a visible one would change
      // the composition. Without a name a screen-reader user meets four
      // unexplained controls in the middle of a hero.
      role="group"
      aria-label="Send money"
      className={cn(
        "bg-surface-page shadow-widget flex w-full flex-col gap-28 rounded-3xl p-4 md:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          {/* 412:1864 - the send field and its rate note, right-aligned. */}
          <div className="flex flex-col gap-4">
            <AmountField
              id={sendId}
              label="You send"
              value={sendAmount}
              onValueChange={setSendAmount}
              currency="NGN"
              currencyIcon="flag-ng"
              selectLabel="Select send currency"
              describedBy={rateId}
            />
            {/*
             * responsive.md S3.4 names this string specifically: long unbroken
             * tokens must never force a page scroll, so it carries
             * `overflow-wrap: anywhere`.
             */}
            <p
              id={rateId}
              className="text-xs-tabular text-fg-body-soft w-full text-right wrap-anywhere"
            >
              {RATE_NOTE}
            </p>
          </div>

          {/* 412:1879 */}
          <AmountField
            id={receiveId}
            label="Receiver gets"
            value={receiveAmount}
            onValueChange={setReceiveAmount}
            currency="GHS"
            currencyIcon="flag-ng"
            selectLabel="Select receive currency"
          />
        </div>

        {/* 412:1892 - two benefit rows. The glyphs carry no information the
            adjacent text does not, so they stay decorative. */}
        <ul className="flex flex-col gap-5">
          <MetaRow icon="bolt">Arrives in seconds</MetaRow>
          <MetaRow icon="receipt">Total fees included in NGN amount</MetaRow>
        </ul>
      </div>

      {/*
       * 412:1905. The design wires this to nothing - the file carries no
       * prototype links at all (D-008) - and there is no account, no session
       * and no transfer API behind a marketing hero. It resolves to the one
       * place a transfer can actually be started on this product: the shared
       * WhatsApp constant every other CTA on the site already uses (D-041).
       * The accessible name keeps the visible label as a prefix so voice
       * control still matches "Send now".
       */}
      <Button
        variant="brand"
        size="md"
        fullWidth
        href={WHATSAPP_CHAT_URL}
        aria-label="Send now - continue on WhatsApp"
      >
        Send now
      </Button>
    </div>
  );
}

interface AmountFieldProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (next: string) => void;
  currency: string;
  currencyIcon: "flag-ng";
  selectLabel: string;
  describedBy?: string;
}

/**
 * One labelled amount row - `412:1865` / `412:1879`.
 *
 * The field is a composite (a text input plus a currency chip), so the focus
 * affordance sits on the wrapper and is scoped with `:has(input:focus-visible)`
 * rather than `:focus-within` - otherwise focusing the chip, which already
 * carries its own outline, would draw a second ring around the whole row. The
 * input's own outline is suppressed only because that replacement exists.
 *
 * Height: the design draws the row at 52 with a 24px currency chip inside it.
 * responsive.md S6.2 raises every interactive target to 44, which `SelectPill`
 * already hard-codes, so the row is a 52px FLOOR rather than a fixed height and
 * the taller chip is absorbed instead of clipped.
 */
function AmountField({
  id,
  label,
  value,
  onValueChange,
  currency,
  currencyIcon,
  selectLabel,
  describedBy,
}: AmountFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(sanitiseAmount(event.target.value));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <label htmlFor={id} className="text-fg-primary text-sm">
        {label}
      </label>

      <div
        className={cn(
          "flex min-h-13 w-full items-center justify-between gap-2",
          "border-line-muted rounded-xl border px-4",
          "transition-[border-color] duration-(--motion-fast) ease-out",
          "hoverable:border-line-divider",
          "has-[input:focus-visible]:border-field-border-focus",
          "has-[input:focus-visible]:shadow-focus-ring",
        )}
      >
        <input
          id={id}
          name={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          onChange={handleChange}
          aria-describedby={describedBy}
          className={cn(
            "h-11 min-w-0 flex-1 bg-transparent outline-none",
            "text-field-fg placeholder:text-fg-disabled text-sm",
          )}
        />
        <SelectPill
          icon={currencyIcon}
          code={currency}
          tone="plain"
          aria-label={selectLabel}
        />
      </div>
    </div>
  );
}

interface MetaRowProps {
  icon: "bolt" | "receipt";
  children: string;
}

/** `412:1893` / `412:1899` - a 32px brand-tinted disc with a 20px glyph. */
function MetaRow({ icon, children }: MetaRowProps) {
  return (
    <li className="flex items-center gap-3">
      <span className="bg-surface-brand-subtle flex size-8 shrink-0 items-center justify-center rounded-full">
        <Icon name={icon} size="sm" className="text-fg-brand" />
      </span>
      <span className="text-fg-body-soft min-w-0 text-sm">{children}</span>
    </li>
  );
}

/**
 * Keep the field to something that can plausibly be an amount, without
 * reformatting what the user typed.
 *
 * Digits, thousands commas and at most one decimal point survive; everything
 * else is dropped as it is typed. This is deliberately not validation: there is
 * nothing to submit and therefore nothing that can fail, so the widget has no
 * error state to show. Rejecting the keystroke is honest; inventing an error
 * message for a form that never submits is not.
 */
function sanitiseAmount(raw: string): string {
  const cleaned = raw.replace(/[^\d.,]/g, "");
  const firstDot = cleaned.indexOf(".");

  if (firstDot === -1) return cleaned;

  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
}
