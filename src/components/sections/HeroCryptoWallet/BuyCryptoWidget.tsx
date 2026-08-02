"use client";

import { useId, useState } from "react";

import { Button, Icon, SelectPill } from "@/components/ui";
import { cn } from "@/lib/cn";

import banknoteAsset from "@design-system/assets/illustration/banknote-naira.svg";

/**
 * `next/image-types/global` declares `*.svg` as `any` so an SVGR setup could
 * override it. Narrow it once, here, rather than letting `any` spread.
 */
const BANKNOTE_SRC: string = banknoteAsset.src;

type Direction = "buy" | "sell";

/**
 * Verbatim from 412:1646 / 412:1648, including the inconsistent capitalisation
 * ("Buy crypto" vs "Sell Crypto"). That is a source-file defect and it ships as
 * designed - see the report's `findings`.
 */
const DIRECTIONS: readonly { value: Direction; label: string }[] = [
  { value: "buy", label: "Buy crypto" },
  { value: "sell", label: "Sell Crypto" },
];

/**
 * `SelectPill` (components.md S4.11) is authored for a light surface -
 * `bg-field-surface` (#F0F0F0) with `text-field-fg` (#353535). Both of its two
 * consumers place it on the orchid exchange widgets, where the design draws it
 * as white-at-9% with white text (412:1652, 412:1664).
 *
 * Rather than fight the primitive with competing `bg-*` utilities - `cn` joins,
 * it does not merge, so two background utilities would be resolved by
 * Tailwind's internal sort order rather than by the author - this remaps the
 * four theme variables the primitive reads. Same element, same cascade,
 * deterministic, and every value is still a token.
 *
 * The mismatch itself is recorded as a finding against the primitive.
 */
const PILL_ON_ORCHID = cn(
  "[--color-field-surface:var(--color-overlay-glass-inverse)]",
  "[--color-field-fg:var(--color-fg-on-inverse)]",
  "[--color-surface-sunken:var(--color-surface-accent-orchid-soft)]",
  "[--color-fg-secondary:var(--color-fg-on-inverse-soft)]",
  "shrink-0",
);

/**
 * The Buy Crypto widget - 412:1626.
 *
 * WHAT THIS IS, AND WHAT IT IS NOT
 * --------------------------------
 * A presentational surface. There is no backend, no rates feed and no submit
 * target, so this deliberately does not compute a conversion, does not fetch a
 * price, and does not fake a successful purchase:
 *
 *   - "You want to buy" is a real, editable amount field. Letting someone type
 *     their own number invents nothing.
 *   - "You'll pay" is an `<output>`, not a second input. Making it editable
 *     would imply a two-way conversion that does not exist; recomputing it
 *     would require an exchange rate this project does not have.
 *   - The rate line is transcribed verbatim and is never presented as live.
 *   - "Buy now" is an inert `<button>`. A handler that appeared to do something
 *     would be the exact thing the spec forbids.
 *
 * A visually hidden note (`aria-describedby` on the group) states all of that
 * to assistive technology, so the honesty is not sighted-only.
 *
 * THE DIRECTION CONTROL
 * ---------------------
 * The design authors only the "Buy crypto" state - there is no Sell panel, no
 * Sell copy and no Sell figures anywhere in the file. So this is built as a
 * native radio group rather than a tablist: a radio group states a preference
 * and promises nothing about a panel, whereas a tab that fails to swap its
 * panel is a broken tab. Native radios also give arrow-key navigation and a
 * roving tabindex for free. Raised in `open_questions`.
 */
export function BuyCryptoWidget() {
  const [direction, setDirection] = useState<Direction>("buy");

  const uid = useId();
  const amountId = `${uid}-amount`;
  const payId = `${uid}-pay`;
  const noteId = `${uid}-note`;
  const groupName = `${uid}-direction`;

  return (
    <div className="relative mx-auto w-full max-w-[580px]">
      {/*
       * The decorative stage - back plate 412:1627 and the naira banknote at
       * its two placements, 412:1630 and 412:1636.
       *
       * It is an aspect-ratio box so that every offset inside it scales with
       * the widget width instead of pinning to 1440. `top` percentages resolve
       * against the box height (580x650), widths against the box width.
       *
       * responsive.md S7.3.1: the decorative vectors drop below `md` and return
       * at 50% opacity at `md`. The back plate goes with them - its only job is
       * to peek out from behind artwork that is no longer there.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden aspect-[580/650] md:block"
      >
        {/* 412:1627 - 580x436 at y 162, radius 48 */}
        <div className="absolute inset-x-0 top-[24.923%] h-[67.077%] rounded-7xl bg-surface-accent-orchid-dim" />

        {/*
         * 412:1630 - the exported SVG is the group's own bounding box, so the
         * 9.57deg rotation is already baked into the artwork. Placed at its
         * measured offset with no further transform.
         */}
        <div
          className="absolute top-[1.709%] left-[13.0994%] aspect-[524/418] w-[90.2612%] bg-contain bg-center bg-no-repeat opacity-50 lg:opacity-100"
          style={{ backgroundImage: `url(${BANKNOTE_SRC})` }}
        />
        {/*
         * 412:1636 - the same artwork again, 19.13deg in the file. Since the
         * export already carries 9.57deg, the difference (9.56deg) is applied
         * here and the box is re-centred so its rotated bounding box lands on
         * the measured 559.47 x 479.58 at (58, 0).
         */}
        <div
          className="absolute top-[4.787%] left-[13.0994%] aspect-[524/418] w-[90.2612%] rotate-[9.56deg] bg-contain bg-center bg-no-repeat opacity-50 lg:opacity-100"
          style={{ backgroundImage: `url(${BANKNOTE_SRC})` }}
        />
      </div>

      {/* 412:1641 - the card. 580x475 at y 214, radius 48. */}
      <div
        role="group"
        aria-label="Buy crypto preview"
        aria-describedby={noteId}
        className="relative overflow-clip rounded-7xl bg-surface-accent-orchid-flat p-4 sm:p-5 md:mt-[36.897%]"
      >
        <p id={noteId} className="sr-only">
          Preview only. The amounts, currencies and exchange rate shown here are
          examples taken from the design. This widget does not fetch live prices
          and cannot complete a purchase.
        </p>

        {/* 412:1643 - 540x56, radius 24, 7px inset, 12px gap, two equal tabs. */}
        <fieldset className="min-w-0 rounded-4xl bg-surface-accent-orchid-deep p-[7px]">
          <legend className="sr-only">
            Choose whether to buy or sell crypto
          </legend>
          <div className="flex gap-3">
            {DIRECTIONS.map((option) => {
              const selected = direction === option.value;

              return (
                <label key={option.value} className="relative flex-1">
                  <input
                    type="radio"
                    name={groupName}
                    value={option.value}
                    checked={selected}
                    onChange={() => setDirection(option.value)}
                    className="peer sr-only"
                  />
                  {/*
                   * Designed at 42 tall; rendered at 44 - responsive.md S6.1
                   * puts a 44px floor under every target at every breakpoint.
                   * The tab bar grows 56 -> 58 and that is not a fidelity
                   * defect.
                   *
                   * The selected state is carried by the fill and the tile
                   * shadow, and independently by `aria-checked` on the input -
                   * never by hover alone (responsive.md S6.3). The focus ring
                   * is mirrored off the visually hidden input.
                   */}
                  <span
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center justify-center rounded-3xl px-4 text-center",
                      "text-base-tab text-fg-on-inverse",
                      "transition-[background-color,box-shadow,transform] duration-(--motion-base) ease-out",
                      "active:translate-y-px active:duration-(--motion-instant)",
                      "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring",
                      selected
                        ? "bg-surface-accent-orchid-soft shadow-tile"
                        : "hoverable:bg-surface-accent-orchid-flat",
                    )}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* 412:1649 - 533x102 at (27, 104), radius 20. */}
        <div className="mt-6 flex items-center justify-between gap-4 rounded-3xl bg-surface-accent-orchid px-6 pt-4 pb-3.5 sm:mx-[7px] sm:mt-7">
          <div className="flex min-w-0 flex-1 flex-col">
            <label
              htmlFor={amountId}
              className="text-sm-regular text-fg-on-inverse-soft"
            >
              You want to buy
            </label>
            {/*
             * The one genuinely editable control. No `onChange` recomputes
             * anything downstream - there is no rate to compute with.
             *
             * The default focus outline is deliberately left in place: the
             * field has no border in the design, so the outline is its only
             * focus indicator, and `outline: none` without a replacement is a
             * defect everywhere (components.md S10.7).
             */}
            <input
              id={amountId}
              name="buy-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              defaultValue="100"
              aria-describedby={noteId}
              className="mt-3 w-full min-w-0 border-0 bg-transparent p-0 font-accent text-accent-num text-fg-on-inverse"
            />
          </div>
          <SelectPill
            icon="crypto-usdt"
            code="USDT"
            aria-label="Select the crypto asset to buy"
            className={PILL_ON_ORCHID}
          />
        </div>

        {/* 412:1674 - 485x28 at (51, 224). */}
        <div className="mt-4.5 flex items-center justify-between gap-3 sm:mx-[31px]">
          <div className="relative flex items-center gap-2">
            {/*
             * 412:1642 - a 76px hairline at 33% behind the badge. First child
             * of the card in the file, so it paints under everything; the badge
             * below is `relative` and therefore paints over it.
             */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[-20.5px] left-[13.5px] h-[76px] w-px bg-palette-violet-700/[0.33]"
            />
            {/* 412:1676 - 28px disc, 412:1678 lightning at 17.5 -> snapped to 20. */}
            <span className="relative inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-inverse">
              <Icon name="bolt" size="sm" className="text-fg-on-inverse" />
            </span>
            <span className="text-sm-regular text-fg-on-inverse">Rate</span>
          </div>
          {/*
           * 412:1681, verbatim. It is illustrative, never live - the hidden
           * note above says so, and nothing in this component updates it.
           */}
          <p className="text-xs-tabular text-right text-fg-on-inverse-soft tabular-nums">
            1 USDC ~ NGN 1,387
          </p>
        </div>

        {/* 412:1661 - 533x102 at (27, 270), radius 20. */}
        <div className="mt-4.5 flex items-center justify-between gap-4 rounded-3xl bg-surface-accent-orchid px-6 pt-4 pb-3.5 sm:mx-[7px]">
          <div className="flex min-w-0 flex-1 flex-col">
            <label
              htmlFor={payId}
              className="text-sm-regular text-fg-on-inverse-soft"
            >
              You&#8217;ll pay
            </label>
            {/*
             * `<output>` rather than a second input: it is a labelable element,
             * so the visible label still associates programmatically, and it
             * makes plain that this figure is a result rather than something
             * the reader is being asked to supply. It never changes, because
             * changing it would require an exchange rate that does not exist.
             */}
            <output
              id={payId}
              className="mt-3 block font-accent text-accent-num text-fg-on-inverse"
            >
              &#8358;134,000
            </output>
          </div>
          <SelectPill
            icon="flag-ng"
            code="NGN"
            aria-label="Select the currency you pay with"
            className={PILL_ON_ORCHID}
          />
        </div>

        {/* 456:204 - 533x51 at (27, 404), radius 100. */}
        <div className="mt-8 sm:mx-[7px]">
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            aria-describedby={noteId}
          >
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BuyCryptoWidget;
