"use client";

import { useId, useState, type ChangeEvent } from "react";

import { Button, DisplayHeading, Icon, SelectPill } from "@/components/ui";
import {
  CURRENCIES,
  convert,
  crossRate,
  formatPlain,
  formatRateLine,
  groupDigits,
  parseAmount,
  tickerIcon,
  type CurrencyCode,
  type RateTable,
} from "@/content/rates";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * The Cross-Border Payments exchange widget - redesigned at Figma `782:563`.
 *
 * WHAT CHANGED FROM THE FIRST BUILD (412:1861), because two of the three are
 * corrections rather than restyles:
 *
 *   1. It has a TITLE now - "Send money abroad", the operator's copy replacing
 *      the frame's "PAYMENT CONVERTER" at 782:609. The old build carried
 *      `role="group" aria-label="Send money"` and a comment explaining that the
 *      design gave the card no heading, so a name had to be invented for screen
 *      readers. The design now supplies one, so the invented label is gone and
 *      the group is `aria-labelledby` the real `<h2>`.
 *   2. BOTH CHIPS ARE REAL PICKERS over the seven currencies Azza settles in,
 *      and each renders ITS OWN flag. The old build hardcoded `flag-ng` on both
 *      fields, so the GHS row flew the Nigerian flag - the defect the operator
 *      pointed at. Flags come from `tickerIcon`, the same map the crypto page
 *      uses, so the two pages cannot disagree about which flag a currency flies.
 *   3. IT CONVERTS. The old build's two fields were deliberately independent,
 *      because the only rate the design stated was a USDC/NGN one and deriving
 *      NGN -> GHS from it would have meant inventing a pair. That reasoning
 *      expired when the per-USD anchor table landed: every fiat pair is now
 *      derived from anchors that are resolved on the server, so nothing is
 *      invented and nothing is hardcoded. See `crossRate`.
 *
 * THE RATE LINE IS THE SELECTED PAIR - send against receive (operator request).
 * 782:580 draws it as "1 USDC ~ NGN 1,387", the send currency's settlement anchor
 * over the dollar stablecoin Azza settles on. That was implemented first and is
 * factually true, but it is not the number this widget is for: the reader is
 * converting NGN to GHS and wants the rate BETWEEN them, not a third currency's
 * anchor. It is `formatRateLine(forward)` now, so it names whichever two
 * currencies the pickers hold and moves the moment either one does.
 *
 * `"use client"` is mandated by components.md S3: amount inputs and currency
 * selects. It is the only client boundary in this section - the hero shell above
 * it stays on the server, which is also what keeps `server/rates.ts` out of the
 * bundle.
 *
 * MOTION. Nothing here animates in JavaScript. Hover recolours only, at
 * `--motion-fast`, per components.md S10.6; the focus ring is a box-shadow and
 * is not transitioned, per S10.7. Every transition therefore inherits the global
 * `prefers-reduced-motion: reduce` floor in theme.css, and no element is ever
 * left at `opacity: 0`.
 */
export interface ExchangeWidgetProps {
  /**
   * The per-USD anchor table, resolved on the server. Required - there is no
   * default, so no caller can reintroduce a hardcoded rate.
   */
  rates: RateTable;
  className?: string;
}

/** Both pickers offer the same seven currencies, each with its own flag. */
const CURRENCY_OPTIONS = CURRENCIES.map((value) => ({
  value,
  icon: tickerIcon(value),
}));

/** Which field the reader last typed in - that one is the source of truth. */
type Source = "send" | "receive";

export function ExchangeWidget({ rates, className }: ExchangeWidgetProps) {
  const titleId = useId();
  const sendId = useId();
  const receiveId = useId();
  const rateId = useId();

  /* 782:577 / 782:632 - the frame's own resting pair. */
  const [sendCurrency, setSendCurrency] = useState<CurrencyCode>("NGN");
  const [receiveCurrency, setReceiveCurrency] = useState<CurrencyCode>("GHS");

  /*
   * ONE amount in state, not two, plus which field it was typed into.
   *
   * Both fields are editable - the design draws a "0.00" placeholder in each -
   * so either can drive the other, and holding two independent strings would let
   * them fall out of step the moment a currency changed. With a single source the
   * derived side is always a pure function of (amount, source, pair), including
   * after a picker moves.
   */
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<Source>("send");

  const forward = crossRate(sendCurrency, receiveCurrency, rates);
  const backward = crossRate(receiveCurrency, sendCurrency, rates);

  const derived =
    amount.trim() === ""
      ? ""
      : formatPlain(
          convert(parseAmount(amount), source === "send" ? forward : backward),
        );

  const sendValue = source === "send" ? amount : derived;
  const receiveValue = source === "send" ? derived : amount;

  /*
   * The field hands back the already-grouped string and this stores it VERBATIM.
   * That is load-bearing for the caret trick in `AmountField`: the value React
   * renders back must be character-identical to the one the field just wrote into
   * the DOM, or React replaces the DOM value and the caret jumps to the end.
   */
  const edit = (next: Source) => (formatted: string) => {
    setSource(next);
    setAmount(formatted);
  };

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={cn(
        // 782:563 - 580 wide, radius 20, 32px padding, 80 between the body and
        // the CTA. `shadow-widget` is the token for its 0 0 16px #DFDFFF glow.
        "bg-surface-page shadow-widget flex w-full flex-col gap-20 rounded-3xl p-4 md:p-8",
        className,
      )}
    >
      {/* 782:615 - title over body, gap 48. */}
      <div className="flex flex-col gap-12">
        {/*
         * 782:609. `display-7` is the 56px Lemon step added for this title; see
         * its note in theme.css for why `accent-3`, also 56px, is not it.
         *
         * `text-box: trim-both cap alphabetic` is the frame's own setting, and it
         * is load-bearing for the 48px gap below. Figma measures this text at 39
         * tall - cap height to baseline - while a CSS line box at leading 1 is 53,
         * so without the trim the title carries ~14px of dead ascender/descender
         * space and the gap to the fields READS as 62 rather than the designed 48.
         *
         * A PROGRESSIVE ENHANCEMENT, not a requirement: `text-box` needs Chrome
         * 133+ / Safari 18.4+ and Firefox has not shipped it. Where it is
         * unsupported the title simply keeps that extra 14px, which is exactly
         * what this widget looked like before - a slightly looser gap, never a
         * broken layout. Written as an arbitrary property because it is one
         * declaration and naming what the design set is clearer here than a
         * utility alias.
         */}
        <DisplayHeading
          as="h2"
          id={titleId}
          step="display-7"
          className="text-fg-primary [text-box:trim-both_cap_alphabetic]"
        >
          Send money abroad
        </DisplayHeading>

        <div className="flex flex-col gap-8">
          {/* 782:565 - the two field groups, gap 12. */}
          <div className="flex flex-col gap-3">
            {/* 782:566 - the send field with its rate note, right-aligned. */}
            <div className="flex flex-col items-end gap-4">
              <AmountField
                id={sendId}
                label="You send"
                value={sendValue}
                onValueChange={edit("send")}
                currency={sendCurrency}
                onCurrencyChange={setSendCurrency}
                selectLabel="Select send currency"
                describedBy={rateId}
              />
              {/*
               * responsive.md S3.4 names this string specifically: long unbroken
               * tokens must never force a page scroll, so it carries
               * `overflow-wrap: anywhere`. `tabular-nums` because the figure now
               * changes with the send picker and proportional digits would make
               * a right-aligned line jitter as it does.
               */}
              <p
                id={rateId}
                className="text-fg-body-soft w-full text-right text-sm tabular-nums wrap-anywhere"
              >
                {formatRateLine(forward)}
              </p>
            </div>

            {/* 782:581 */}
            <AmountField
              id={receiveId}
              label="Receiver gets"
              value={receiveValue}
              onValueChange={edit("receive")}
              currency={receiveCurrency}
              onCurrencyChange={setReceiveCurrency}
              selectLabel="Select receive currency"
            />
          </div>

          {/*
           * 782:594 - two benefit rows. The glyphs carry no information the
           * adjacent text does not, so they stay decorative.
           *
           * `role="list"` for the reason WhyAzzaSteps.tsx and
           * WhyAzzaCrossBorder.tsx already record: Tailwind's preflight sets
           * `list-style: none` on every <ul>, and Safari/VoiceOver drops list
           * semantics from an un-marked list. `display: flex` is a second,
           * independent trigger for the same loss.
           */}
          <ul role="list" className="flex flex-col gap-5">
            <MetaRow icon="bolt">Arrives in seconds</MetaRow>
            {/*
             * 782:606 hardcodes "NGN" here. It follows the send picker instead,
             * for the same reason the flags do: a fee note naming a currency the
             * reader is not sending is simply wrong, and the picker makes that
             * reachable in one click.
             */}
            <MetaRow icon="receipt">
              {`Total fees included in ${sendCurrency} amount`}
            </MetaRow>
          </ul>
        </div>
      </div>

      {/*
       * 782:607. The design wires this to nothing - the file carries no
       * prototype links at all (D-008) - and there is no account, no session and
       * no transfer API behind a marketing hero. It resolves to the one place a
       * transfer can actually be started on this product: the shared WhatsApp
       * constant every other CTA on the site already uses (D-041). The
       * accessible name keeps the visible label as a prefix so voice control
       * still matches "Send now".
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
  currency: CurrencyCode;
  onCurrencyChange: (next: CurrencyCode) => void;
  selectLabel: string;
  describedBy?: string;
}

/**
 * One labelled amount row - `782:569` / `782:583`.
 *
 * The field is a composite (a text input plus a currency chip), so the focus
 * affordance sits on the wrapper and is scoped with `:has(input:focus-visible)`
 * rather than `:focus-within` - otherwise focusing the chip, which already
 * carries its own outline, would draw a second ring around the whole row. The
 * input's own outline is suppressed only because that replacement exists.
 *
 * Height: 72, which the redesign sets directly (the old row was 52). It stays a
 * FLOOR rather than a fixed height so the 44px chip inside it - responsive.md
 * S6.2's minimum, taller than the 24px roundel the frame draws - is absorbed
 * instead of clipped.
 */
function AmountField({
  id,
  label,
  value,
  onValueChange,
  currency,
  onCurrencyChange,
  selectLabel,
  describedBy,
}: AmountFieldProps) {
  /*
   * Group the digits as they are typed, and KEEP THE CARET WHERE THE READER PUT
   * IT.
   *
   * Reformatting a controlled input on every keystroke is the classic way to
   * throw the caret to the end of the field: fine while appending, infuriating
   * the moment someone fixes a digit in the middle of "1,000,000". So the caret
   * is re-derived rather than restored literally - a comma inserted to the left
   * of the caret shifts every character index, but the count of AUTHORED
   * characters before it does not change. Count those, reformat, then walk the
   * formatted string until the same count is passed.
   *
   * "AUTHORED" MEANS DIGITS AND THE DECIMAL POINT, not digits alone. Counting only
   * digits looks right and silently breaks decimals: the walk stops immediately
   * after the last digit, which strands a just-typed "." to the RIGHT of the
   * caret, so the next keystroke lands in front of it. Measured, before the fix -
   * typing "0.5" produced "5." and "1000.99" produced "100,099.". The comma is the
   * only character this function inserts on the reader's behalf, so the comma is
   * the only one the walk may skip.
   *
   * Written to the DOM here, synchronously, instead of in a layout effect. The
   * parent stores this exact string, so React's next render finds the DOM value
   * already identical and leaves it - and the caret with it - alone. No effect
   * means no `useLayoutEffect`-during-SSR warning and no frame where the caret is
   * visibly in the wrong place.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const el = event.target;
    const authoredBeforeCaret = (
      el.value.slice(0, el.selectionStart ?? el.value.length).match(/[\d.]/g) ?? []
    ).length;

    const formatted = groupDigits(el.value);

    let caret = 0;
    let seen = 0;
    while (caret < formatted.length && seen < authoredBeforeCaret) {
      if (/[\d.]/.test(formatted[caret]!)) seen += 1;
      caret += 1;
    }

    el.value = formatted;
    el.setSelectionRange(caret, caret);
    onValueChange(formatted);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <label htmlFor={id} className="text-fg-primary text-sm">
        {label}
      </label>

      <div
        className={cn(
          "flex min-h-18 w-full items-center justify-between gap-2",
          // 782:569 - radius 24 with a `line-subtle` (#EFEFEF) hairline. The
          // first build drew `line-muted` (#BDBDBD), which the redesign lightens.
          "border-line-subtle rounded-4xl border px-4",
          "transition-[border-color] duration-(--motion-fast) ease-out",
          // One step down the neutral ramp, not the old jump to `line-divider`
          // (#B0B0B0) - that was a reasonable hover off a #BDBDBD base and is far
          // too loud off #EFEFEF.
          "hoverable:border-line-default",
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
            /*
             * `font-accent text-accent-num` - the crypto converter's numerals
             * (operator request: bigger amounts, more contrast against the 16px
             * labels, matching that widget). 782:570 draws these at 16px, the same
             * size as the label above them, which left the figure - the one thing
             * in the card the reader is actually reading - with no emphasis at all.
             *
             * `accent-num` is 40px at desktop with a 1.03 line box, so it fits the
             * 72px field without growing it: the 44px currency chip is still the
             * tallest child and sets the row height. It clamps to 28px by `xs`,
             * where the field is far narrower.
             *
             * `fg-primary` rather than the crypto widget's `fg-on-inverse` - same
             * ramp, opposite surface.
             */
            "font-accent text-accent-num text-fg-primary placeholder:text-fg-disabled",
          )}
        />
        <SelectPill
          icon={tickerIcon(currency)}
          code={currency}
          tone="outlined"
          options={CURRENCY_OPTIONS}
          value={currency}
          onChange={(next) => onCurrencyChange(next as CurrencyCode)}
          aria-label={`${selectLabel}. ${currency} selected`}
        />
      </div>
    </div>
  );
}

interface MetaRowProps {
  icon: "bolt" | "receipt";
  children: string;
}

/** `782:595` / `782:601` - a 32px brand-tinted disc with a 20px glyph. */
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

