"use client";

import { useId, useMemo, useState } from "react";

import { Button, Icon, SelectPill } from "@/components/ui";
import {
  ASSETS,
  CURRENCIES,
  convert,
  formatQuote,
  formatRateLine,
  pairRate,
  parseAmount,
  tickerIcon,
  type AssetCode,
  type CurrencyCode,
  type RateTable,
} from "@/content/rates";
import { cn } from "@/lib/cn";

import { RollingFigure } from "./RollingFigure";

import bankCardAsset from "@design-system/assets/illustration/bank-card-yellow.svg";
import banknoteAsset from "@design-system/assets/illustration/banknote-naira.svg";

/**
 * `next/image-types/global` declares `*.svg` as `any` so an SVGR setup could
 * override it. Narrow it once, here, rather than letting `any` spread.
 */
const BANKNOTE_SRC: string = banknoteAsset.src;
const BANK_CARD_SRC: string = bankCardAsset.src;

type Direction = "buy" | "sell";

/**
 * Verbatim from 766:540 / 766:542, including the inconsistent capitalisation
 * ("Buy crypto" vs "Sell Crypto"). That is a source-file defect and it ships as
 * designed - see the report's `findings`.
 */
const DIRECTIONS: readonly { value: Direction; label: string }[] = [
  { value: "buy", label: "Buy crypto" },
  { value: "sell", label: "Sell Crypto" },
];

/**
 * The copy that swaps with the direction.
 *
 * The BUY strings are 766:544 / 766:556 / 766:577 verbatim. The SELL strings are
 * the operator's, given in the brief - "You are selling", "You will get",
 * "Sell now" - and are used exactly as written, including "You will get" rather
 * than the contracted "You'll get" that would have matched the buy side's
 * "You'll pay". 766:340 authors no Sell state, so there is nothing to check them
 * against and nothing to reconcile them with.
 *
 * BOTH DIRECTIONS CONVERT THE SAME WAY, which is why only the labels live here.
 * Buying 100 USDT and selling 100 USDT are both `100 x quotePerBase` naira - the
 * amount field is the crypto side and the output the fiat side in each case, so
 * the arithmetic, the two chips and the rate line are all direction-independent.
 * A real desk would price the two legs differently, but a spread is a figure the
 * design does not carry and this must not invent one.
 */
const COPY: Record<
  Direction,
  { amountLabel: string; quoteLabel: string; cta: string; amountHint: string }
> = {
  buy: {
    amountLabel: "You want to buy",
    quoteLabel: "You’ll pay",
    cta: "Buy now",
    amountHint: "Amount of crypto to buy",
  },
  sell: {
    amountLabel: "You are selling",
    quoteLabel: "You will get",
    cta: "Sell now",
    amountHint: "Amount of crypto to sell",
  },
};

/**
 * `SelectPill` (components.md S4.11) is authored for a light surface -
 * `bg-field-surface` (#F0F0F0) with `text-field-fg` (#353535). Both of its two
 * consumers place it on the orchid exchange widgets, where the design draws it
 * as a solid raised chip with white text (766:546, 766:558).
 *
 * Rather than fight the primitive with competing `bg-*` utilities - `cn` joins,
 * it does not merge, so two background utilities would be resolved by
 * Tailwind's internal sort order rather than by the author - this remaps the
 * four theme variables the primitive reads. Same element, same cascade,
 * deterministic, and every value is still a token.
 *
 * THE FILL CHANGED WITH THE RECOLOUR. 412:1652 drew this chip as white-at-9%
 * over a pale card, so it read as a frosted inset. 766:546 draws it #C194E5 -
 * `accent-orchid-soft`, the same solid raised value the selected tab tile takes -
 * over the deeper panel, so it now reads as a raised chip. The glass fill is
 * gone rather than tinted, because at this depth a 9% white veil over #B179DF is
 * very nearly invisible.
 *
 * `--color-surface-sunken` is the primitive's hover, and the design authors none
 * for this chip - so it takes the next step UP the same ramp the frame
 * establishes (#B179DF panel -> #C194E5 chip -> #D2B0EE), which is exactly
 * `accent-orchid-flat`. Staying inside the design's own ramp is what keeps the
 * invented state from looking invented.
 *
 * The primitive mismatch itself is recorded as a finding against the primitive.
 */
/** The pickers' choices - the codes are their own labels, as the pills draw
 * them, each beside the same mark its pill shows. Module-level so the arrays
 * are stable across renders. */
const ASSET_OPTIONS = ASSETS.map((value) => ({
  value,
  icon: tickerIcon(value),
}));
const CURRENCY_OPTIONS = CURRENCIES.map((value) => ({
  value,
  icon: tickerIcon(value),
}));

const PILL_ON_ORCHID = cn(
  "[--color-field-surface:var(--color-surface-accent-orchid-soft)]",
  "[--color-field-fg:var(--color-fg-on-inverse)]",
  "[--color-surface-sunken:var(--color-surface-accent-orchid-flat)]",
  "[--color-fg-secondary:var(--color-fg-on-inverse-soft)]",
  "shrink-0",
);

export interface BuyCryptoWidgetProps {
  /**
   * The per-USD anchor table every pair rate derives from, resolved on the
   * server. Required - there is no default, so a caller cannot accidentally
   * ship a hardcoded figure again. See `src/server/rates.ts` for where it
   * comes from and `content/rates.ts` for the anchor model.
   */
  rates: RateTable;
}

/**
 * The Buy / Sell Crypto widget - 412:1626, recoloured at 766:520.
 *
 * WHAT IS REAL HERE, AND WHAT IS STILL NOT
 * ----------------------------------------
 * The conversion is real. The amount field is editable, the output recomputes
 * from it on every keystroke, and the multiplier is the same resolved rate that
 * the rate line prints - so the three figures on the card can no longer
 * disagree with each other. `rate` arrives as a prop from a server component,
 * which means the first paint already carries the right number: no loading
 * state, no post-hydration correction of the LCP element, and a reader with
 * JavaScript disabled still gets a correct conversion for the default amount.
 *
 * THE TWO CHIPS ARE REAL PICKERS NOW (operator request, 2026-08-11): the asset
 * chip selects USDC / USDT / cNGN and the currency chip selects one of the
 * seven currencies Azza settles in. Each selection re-derives the pair rate
 * from the server-resolved anchor table, so the chips, the rate line and the
 * output always agree - see `pairRate` in `content/rates.ts`.
 *
 * Still not real, and deliberately:
 *
 *   - "Buy now" / "Sell now" is an inert `<button>`. Wiring it would mean
 *     choosing a real destination and a real prefilled order, which is a product
 *     decision and not this component's to take.
 *
 * The visually hidden note (`aria-describedby` on the group) states exactly that
 * split, so the honesty is not sighted-only - and it no longer claims the
 * conversion is fake, because it is not any more.
 *
 * `<output>` for the result is load-bearing: it carries an implicit
 * `role="status"`, so the recomputed figure is announced to a screen-reader user
 * as they type without an explicit `aria-live` - which is the entire reason to
 * prefer it over a `<span>` now that the value actually changes.
 *
 * THE DIRECTION CONTROL IS A RADIO GROUP, NOT A TABLIST
 * ----------------------------------------------------
 * It swaps three labels on one form; it does not swap a panel. That is a mode
 * switch, and a radio group is the honest semantic for it - `role="tablist"`
 * promises a `tabpanel` per tab, and there is one form here, not two. Native
 * radios also give arrow-key traversal and a roving tabindex for free.
 */
export function BuyCryptoWidget({ rates }: BuyCryptoWidgetProps) {
  const [direction, setDirection] = useState<Direction>("buy");
  const [amount, setAmount] = useState("100");
  /*
   * USDT / NGN as the resting pair - the two chips the design itself draws
   * (766:546 / 766:558), so the first paint is byte-identical to the frame.
   */
  const [asset, setAsset] = useState<AssetCode>("USDT");
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");

  const copy = COPY[direction];

  /** The selected pair, derived fresh from the anchors on every selection. */
  const rate = useMemo(() => pairRate(asset, currency, rates), [asset, currency, rates]);

  /*
   * Parse and convert in one memo. Both are trivial, but the memo keeps the two
   * derived strings referentially stable across the re-render that a direction
   * change causes, and it puts the whole calculation in one place.
   */
  const converted = useMemo(
    () => formatQuote(convert(parseAmount(amount), rate), rate),
    [amount, rate],
  );
  const rateLine = useMemo(() => formatRateLine(rate), [rate]);

  const uid = useId();
  const amountId = `${uid}-amount`;
  const payId = `${uid}-pay`;
  const noteId = `${uid}-note`;
  const rateId = `${uid}-rate`;
  const groupName = `${uid}-direction`;

  return (
    /*
     * `flow-root` is load-bearing, not cosmetic. The card below carries
     * `md:mt-[36.897%]` (214px at 580) and is this box's first in-flow child -
     * the art stage is `absolute` and therefore out of flow. Without a block
     * formatting context here (`relative` does NOT create one) that margin is
     * adjoining to this box's own top margin and collapses out of it, moving
     * THIS box down by 214px and carrying the `absolute ... top-0` art stage
     * with it, so the stage landed exactly on the card and the banknotes were
     * unreachable behind an opaque surface.
     *
     * `flow-root` is geometry-neutral: the collapsed margin already stops at
     * the grid item in `HeroCryptoWallet` (grid items establish an independent
     * formatting context), so containing it here only moves the 214px from
     * this box's margin into its height. Measured identical card and inner-card
     * positions at 390/768/1024/1280/1440/1920 before and after.
     *
     * Not `overflow-hidden`/`overflow-clip`: they would also make a BFC but
     * would crop the rotated banknote, which overhangs this box by ~50px on
     * the right at 1440. Not `pt-[36.897%]` here: percentage padding resolves
     * against the CONTAINING BLOCK's width, and at `md` that is the 688px grid
     * item rather than this 580px box - 254px instead of 214px.
     */
    <div className="relative mx-auto flow-root w-full max-w-[580px]">
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
        {/* 766:521 - 580x436 at y 162, radius 48. Recoloured #AE92C5 -> #7E4DA6. */}
        <div className="rounded-7xl bg-surface-accent-orchid-dim absolute inset-x-0 top-[24.923%] h-[67.077%]" />

        {/*
         * 412:1628 "Vector 2156" - the yellow bank card with the black magnetic
         * stripe, tucked behind the widget. 358 x 116.558 at (32, 120), so
         * 18.4615% / 5.5172% / 61.7241% against the 580 x 650 stage. Painted
         * after the back plate and before the banknotes, per the file's own
         * child order.
         *
         * Only the top ~94px clears the card at y 214; the rest is covered.
         * The export is the node's tight bounding box - rounded 22.7px top
         * corners, square bottom - so no transform is needed here.
         *
         * `opacity-50 lg:opacity-100` matches its two sibling art vectors.
         * responsive.md S7.3.1 names only 412:1629/412:1635 for the 50%-at-md
         * treatment because its inventory omits this node altogether - the same
         * omission that left it unbuilt. It is background art on the same
         * stage, and leaving it at full strength would put a saturated yellow
         * band at 100% over banknotes at 50%.
         */}
        <div
          className="absolute top-[18.4615%] left-[5.5172%] aspect-[358/116.558] w-[61.7241%] bg-contain bg-center bg-no-repeat opacity-50 lg:opacity-100"
          style={{ backgroundImage: `url(${BANK_CARD_SRC})` }}
        />

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

      {/*
       * 766:535 - the card. 580x475 at y 214, radius 48.
       *
       * Was a flat #D2B0EE; the recolour makes it a vertical gradient, #AD69E5
       * to #A26CCE with the final stop at 67.959%. The stop is the design's own
       * odd number and is kept rather than rounded to 68% - the gradient runs
       * over 475px, where the two differ by 0.2px, but a rounded value here is a
       * value nobody can trace back to the frame.
       *
       * `/srgb` IS A FIDELITY FIX, NOT A STYLE PREFERENCE. Tailwind v4 emits
       * `in oklab` on gradients by default, and measuring the rendered card
       * confirmed it: `linear-gradient(in oklab, ...)`. Figma interpolates in
       * sRGB, so the two agree only at the endpoints and drift through the
       * middle - which is most of a 475px card. The modifier pins the ramp to the
       * space the design was authored in.
       */}
      <div
        role="group"
        aria-label="Buy or sell crypto converter"
        aria-describedby={noteId}
        /*
         * Switches `:focus-visible` to `--color-focus-ring-inverse` for the whole
         * subtree - the same mechanism `Footer` and `FaqQuestionList` use, defined
         * once in theme.css.
         *
         * The card is a saturated purple, and the base ring is brand blue
         * (#3430E9) because that is the LIGHT-surface ring. Blue on this card was
         * the operator's complaint and it was never only the amount field: the
         * tabs, both currency chips and the CTA all drew it. One attribute fixes
         * every focusable descendant, because `Button` and `SelectPill` set only
         * `focus-visible:bg-*` and inherit the outline from the base rule.
         *
         * The one exception is an explicit `outline-*` utility, which lives in
         * `@layer utilities` and therefore beats `@layer base` - see the tab
         * tiles below, which name the inverse colour themselves.
         */
        data-surface="inverse"
        /*
         * NO `overflow-clip` here any more: the two pills open real menus
         * (SelectPillPicker), and a clip would amputate any panel reaching
         * past the card's edge - which the seven-row currency menu does.
         * Nothing needed it: the gradient paints inside `rounded-7xl` on its
         * own, and no child overhangs the card at rest.
         */
        className="rounded-7xl from-gradient-orchid-from to-gradient-orchid-to relative bg-linear-to-b/srgb to-[67.959%] p-4 sm:p-5 md:mt-[36.897%]"
      >
        <p id={noteId} className="sr-only">
          The conversion is live: choose an asset and a currency, and the amount you type is
          multiplied by the exchange rate shown below it. This widget cannot complete a purchase or
          a sale.
        </p>

        {/* 766:537 - 540x56, radius 24, 7px inset, 12px gap, two equal tabs. */}
        <fieldset className="bg-surface-accent-orchid-deep min-w-0 rounded-4xl p-[7px]">
          <legend className="sr-only">Choose whether to buy or sell crypto</legend>
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
                      /*
                       * `outline-focus-ring-inverse`, named explicitly. The card's
                       * `data-surface="inverse"` cannot reach this one: it is an
                       * `@layer utilities` declaration and beats the `@layer base`
                       * rule that the attribute keys off, so without naming the
                       * inverse colour here these two tiles would be the only
                       * things left ringing blue.
                       */
                      "peer-focus-visible:outline-focus-ring-inverse peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                      /*
                       * 766:539: the selected tile is #C194E5 with a
                       * 0 4px 1.3px rgba(148,107,182,0.59) drop shadow, both of
                       * which moved into their tokens.
                       *
                       * The unselected hover CANNOT be the old
                       * `accent-orchid-flat`. That is #D2B0EE, which after the
                       * recolour is LIGHTER than the #C194E5 selected tile - so
                       * hovering an unselected tab would out-emphasise the
                       * selected one and read as the selection moving. A 9% white
                       * veil lifts it just off the #B179DF bar instead, which is
                       * unmistakably not the solid selected tile.
                       */
                      selected
                        ? "bg-surface-accent-orchid-soft shadow-tile"
                        : "hoverable:bg-overlay-glass-inverse",
                    )}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* 766:543 - 533x102 at (27, 104), radius 20. Recoloured -> #B179DF. */}
        <div
          className={cn(
            "bg-surface-accent-orchid mt-6 flex items-center justify-between gap-4 rounded-3xl px-6 pt-4 pb-3.5 sm:mx-[7px] sm:mt-7",
            /*
             * THE AMOUNT FIELD'S FOCUS INDICATOR. It lives here, on the panel,
             * because the panel is what the design draws as the field - see the
             * note on the input below.
             *
             * `has-[input:focus-visible]`, NOT `focus-within`: this row also holds
             * the asset chip, which carries its own ring, and `focus-within` would
             * draw a second one around the whole row whenever the chip was focused.
             * `ExchangeWidget` records the same reasoning for the same composite.
             *
             * `outline`, NOT `ring`. Tailwind's `ring-*` compiles to a box-shadow,
             * and box-shadows are dropped in forced-colors / High Contrast mode -
             * which would delete this indicator for the users who depend on it most.
             * Outlines survive there, and follow the panel's own 20px radius.
             *
             * NOT transitioned, per theme.css: "a 160ms focus ring reads as lag
             * during keyboard navigation".
             *
             * The panel fill deliberately does NOT lift on focus. Raising it to
             * `accent-orchid-soft` (#C194E5) to echo the chips was tried and
             * rejected on contrast: white against that is 2.42:1, under the 3:1
             * floor for non-text contrast, so the lift would have broken the very
             * ring it was decorating. Against the unchanged #B179DF panel white is
             * 3.15:1, and 3.5:1+ against the card gradient behind its corners.
             */
            "has-[input:focus-visible]:outline-focus-ring-inverse has-[input:focus-visible]:outline-2",
          )}
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <label htmlFor={amountId} className="text-sm-regular text-fg-on-inverse-soft">
              {copy.amountLabel}
            </label>
            {/*
             * The driver of the whole widget. Controlled now, not
             * `defaultValue` - the output is computed from this string, so React
             * has to own it.
             *
             * `aria-describedby` points at the rate line as well as the note, so
             * a screen-reader user is told what the figure below is being
             * multiplied by while focus is still in the field. The visible label
             * changes with the direction, and `amountHint` is NOT rendered as a
             * second name - it exists for the `title` on the group's own labels
             * further down.
             *
             * `outline-none` HERE IS ONLY LEGAL BECAUSE THE PANEL REPLACES IT.
             * components.md S10.7 - and theme.css - are absolute that a bare
             * `outline: none` is a defect. The replacement is the
             * `has-[input:focus-visible]` outline on the row above; delete one and
             * you must delete the other.
             *
             * The indicator moved because the input's own box is the wrong shape
             * to draw: it is a full-width, border-less rectangle that exists in the
             * layout but not in the design, so ringing it outlined nothing a reader
             * can see. The design's field is the 102px rounded panel; the input is
             * text inside it. `ExchangeWidget` reached the same conclusion for the
             * same reason and its note is the canonical one.
             */}
            <input
              id={amountId}
              name="crypto-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              aria-describedby={`${rateId} ${noteId}`}
              className="font-accent text-accent-num text-fg-on-inverse mt-3 w-full min-w-0 border-0 bg-transparent p-0 outline-none"
            />
          </div>
          <SelectPill
            icon={tickerIcon(asset)}
            code={asset}
            options={ASSET_OPTIONS}
            value={asset}
            onChange={(next) => setAsset(next as AssetCode)}
            aria-label={`Select the crypto asset. ${asset} selected`}
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
              className="bg-palette-violet-700/[0.33] pointer-events-none absolute top-[-20.5px] left-[13.5px] h-[76px] w-px"
            />
            {/* 412:1676 - 28px disc, 412:1678 lightning at 17.5 -> snapped to 20. */}
            <span className="bg-surface-inverse relative inline-flex size-7 shrink-0 items-center justify-center rounded-full">
              <Icon name="bolt" size="sm" className="text-fg-on-inverse" />
            </span>
            <span className="text-sm-regular text-fg-on-inverse">Rate</span>
          </div>
          {/*
           * 766:575's phrasing with live figures - every part of it now renders
           * from the resolved rate, so the tickers here cannot drift from the
           * chips and the multiplier cannot drift from the output. That also
           * silently fixes the frame's "1 USDC" beside a USDT chip; see the note
           * on DEFAULT_RATE.
           */}
          <p
            id={rateId}
            className="text-xs-tabular text-fg-on-inverse-soft text-right tabular-nums"
          >
            {/*
             * The rate line changes only on a SELECTION - occasional, not
             * per-keystroke - so it takes the gentler treatment: the key
             * remounts the span and `@starting-style` plays a short
             * blur-to-sharp fade. The blur bridges the two strings so the
             * swap reads as one line resolving rather than two overlapping
             * (the crossfade-masking trick). Opacity and filter only, so it
             * needs no reduced-motion carve-out.
             */}
            <span
              key={rateLine}
              className="inline-block transition-[opacity,filter] duration-(--motion-base) ease-out starting:opacity-0 starting:blur-xs"
            >
              {rateLine}
            </span>
          </p>
        </div>

        {/* 766:555 - 533x102 at (27, 270), radius 20. Recoloured -> #B179DF. */}
        <div className="bg-surface-accent-orchid mt-4.5 flex items-center justify-between gap-4 rounded-3xl px-6 pt-4 pb-3.5 sm:mx-[7px]">
          <div className="flex min-w-0 flex-1 flex-col">
            <label htmlFor={payId} className="text-sm-regular text-fg-on-inverse-soft">
              {copy.quoteLabel}
            </label>
            {/*
             * `<output>` rather than a second input, and now for its full value:
             * it is a labelable element so the visible label still associates
             * programmatically, it makes plain that this figure is a RESULT
             * rather than something the reader is being asked to supply, and its
             * implicit `role="status"` announces each recomputation without an
             * explicit `aria-live`. Polite by default, so it waits for a pause
             * rather than interrupting every keystroke.
             */}
            {/*
             * The figure rolls - see RollingFigure for the whole motion
             * rationale. The `<output>`'s `role="status"` still announces the
             * plain string: the animated cells are aria-hidden and a visually
             * hidden copy inside RollingFigure carries the text.
             */}
            <output
              id={payId}
              htmlFor={amountId}
              className="font-accent text-accent-num text-fg-on-inverse mt-3 block"
            >
              <RollingFigure value={converted} />
            </output>
          </div>
          <SelectPill
            icon={tickerIcon(currency)}
            code={currency}
            options={CURRENCY_OPTIONS}
            value={currency}
            onChange={(next) => setCurrency(next as CurrencyCode)}
            aria-label={
              direction === "buy"
                ? `Select the currency you pay with. ${currency} selected`
                : `Select the currency you receive. ${currency} selected`
            }
            className={PILL_ON_ORCHID}
          />
        </div>

        {/* 766:576 - 533x51 at (27, 404), radius 100, #111 (unchanged). */}
        <div className="mt-8 sm:mx-[7px]">
          <Button type="button" variant="primary" size="md" fullWidth aria-describedby={noteId}>
            {copy.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BuyCryptoWidget;
