/**
 * The exchange rate the crypto-wallet converter runs on.
 *
 * THIS FILE IS THE FLOOR, NOT THE ONLY SOURCE. `src/server/rates.ts` resolves
 * the live figure through a four-step precedence ladder and this default is the
 * last rung - the value that ships in the bundle so the widget is never
 * rateless. See that file for how to override it without a deploy.
 *
 * Everything here is isomorphic on purpose: the server resolves the rate and
 * the client recomputes on every keystroke, so both need the same arithmetic and
 * the same formatting or the figure would change on hydration.
 */

import type { IconName } from "@/components/ui";

export interface ExchangeRate {
  /** Ticker of the asset being priced, e.g. "USDT". */
  base: string;
  /** Ticker of the currency it is priced in, e.g. "NGN". */
  quote: string;
  /**
   * Units of `quote` for ONE unit of `base`. The whole converter is this number:
   * `quote = amount * quotePerBase`.
   */
  quotePerBase: number;
  /** ISO-8601 instant this figure was last set. */
  updatedAt: string;
}

/**
 * Where the resolved rate came from, so `GET /api/rates` can say so and an
 * operator can tell a live feed from the shipped fallback without guessing.
 */
export type RateSource = "override" | "feed" | "env" | "default";

export interface ResolvedRate extends ExchangeRate {
  source: RateSource;
}

/**
 * 412:1681 draws "1 USDC ~ NGN 1,387", and 1,387 is the figure this default
 * carries because the operator's instruction was to make the converter work
 * "based on the rate shown in the converter" - so the rate line is the
 * authority.
 *
 * TWO SOURCE-DESIGN CONTRADICTIONS ARE RESOLVED BY THAT CHOICE, both recorded
 * here rather than silently absorbed:
 *
 *   1. The frame's own figures do not reconcile. It shows 100 USDT paying
 *      ₦134,000, which is a rate of 1,340 - not the 1,387 on its rate line.
 *      Computing from 1,387 makes the output ₦138,700, so the widget no longer
 *      matches that one static number in the frame. It cannot: a converter that
 *      actually multiplies has to pick one of the two, and the rate line is the
 *      one the operator pointed at.
 *   2. The rate line says USDC while the asset chip beside it says USDT. Both
 *      the chip and the line now render from `base` below, so they cannot
 *      disagree again. USDT wins because the chip is the control that names the
 *      asset being converted.
 */
export const DEFAULT_RATE: ExchangeRate = {
  base: "USDT",
  quote: "NGN",
  quotePerBase: 1387,
  updatedAt: "2026-08-09T00:00:00.000Z",
};

/* ---------------------------------------------------------------------------
 * The full asset x currency table (operator request, 2026-08-11)
 * ---------------------------------------------------------------------------
 * On Azza you can buy USDC, USDT and cNGN, priced in any of seven currencies.
 * The widget's two pills are real pickers now, so the converter needs a rate
 * for every pair - 21 of them - and they must not be 21 hand-typed numbers
 * that can disagree: a table where cNGN -> NGN is 0.99 or where the USDT and
 * USDC columns drift apart is a money bug.
 *
 * So the table stores per-USD ANCHORS - one figure per currency - and derives
 * every pair:
 *
 *   quotePerBase(asset, currency) = usdPerAsset(asset) x currencyPerUsd[currency]
 *
 * where USDC and USDT are 1 USD (they are dollar stablecoins; the design's own
 * rate line prices them identically) and cNGN is 1 NGN expressed in USD, i.e.
 * `1 / currencyPerUsd.NGN`. That single rule makes cNGN -> NGN EXACTLY 1 by
 * construction, keeps the two dollar columns identical, and means moving one
 * currency's anchor moves every figure that currency shows.
 */

/** `cNGN` is its own casing on purpose - that is the token's name. */
export const ASSETS = ["USDC", "USDT", "cNGN"] as const;
export type AssetCode = (typeof ASSETS)[number];

export const CURRENCIES = ["XOF", "UGX", "GHS", "KES", "ZAR", "RWF", "NGN"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export interface RateTable {
  /** Units of each currency for ONE US dollar. */
  currencyPerUsd: Record<CurrencyCode, number>;
  /** ISO-8601 instant the anchors were last set. */
  updatedAt: string;
}

export interface ResolvedRateTable extends RateTable {
  /** Where the NGN anchor came from - the ladder in `src/server/rates.ts`. */
  source: RateSource;
}

/**
 * The committed floor, like `DEFAULT_RATE` above it. NGN carries the same 1387
 * the design's rate line draws; the other six are indicative mid-market
 * figures entered 2026-08-11, precise to about the same degree the 1387 is.
 * The server may replace the NGN anchor through the ladder (see
 * `getRateTable`); the rest change by editing this file until a fuller feed
 * exists.
 */
export const DEFAULT_RATE_TABLE: RateTable = {
  currencyPerUsd: {
    XOF: 610,
    UGX: 3700,
    GHS: 13,
    KES: 129,
    ZAR: 18,
    RWF: 1440,
    NGN: 1387,
  },
  updatedAt: "2026-08-11T00:00:00.000Z",
};

/** 1 for the dollar stablecoins; `1 NGN in USD` for cNGN. */
export function usdPerAsset(asset: AssetCode, table: RateTable): number {
  return asset === "cNGN" ? 1 / table.currencyPerUsd.NGN : 1;
}

/** The derived pair - shaped as an `ExchangeRate` so every formatter below
 * and the widget's converter work unchanged. */
export function pairRate(asset: AssetCode, currency: CurrencyCode, table: RateTable): ExchangeRate {
  return {
    base: asset,
    quote: currency,
    quotePerBase: usdPerAsset(asset, table) * table.currencyPerUsd[currency],
    updatedAt: table.updatedAt,
  };
}

/**
 * A FIAT-TO-FIAT pair, for the cross-border converter - `782:563`.
 *
 * That widget sends one currency and receives another, so unlike `pairRate` it
 * has no crypto leg. Both sides are still priced off the same per-USD anchors,
 * which is the whole point: the cross-rate is derived, never stored, so it can
 * never disagree with the asset pairs on the crypto page or drift from them when
 * one anchor moves.
 *
 *   quotePerBase(from, to) = currencyPerUsd[to] / currencyPerUsd[from]
 *
 * `from -> from` is exactly 1 by construction, so a widget with both pickers on
 * the same currency shows the amount unchanged rather than a rounding artefact.
 *
 * Shaped as an `ExchangeRate` so `convert`, `formatQuote` and `formatRateLine`
 * all work on it unchanged.
 */
export function crossRate(
  from: CurrencyCode,
  to: CurrencyCode,
  table: RateTable,
): ExchangeRate {
  return {
    base: from,
    quote: to,
    quotePerBase: table.currencyPerUsd[to] / table.currencyPerUsd[from],
    updatedAt: table.updatedAt,
  };
}

/**
 * The glyph for a ticker. Absent is fine - `SelectPill`'s icon is optional and
 * the visible code already carries the meaning - so an asset added to the feed
 * that has no glyph in the set renders as a bare code rather than a wrong mark.
 */
const TICKER_ICON: Readonly<Record<string, IconName>> = {
  USDT: "crypto-usdt",
  USDC: "crypto-usdc",
  // Keyed uppercase because `tickerIcon` normalises; the display casing stays
  // "cNGN" everywhere else.
  CNGN: "crypto-cngn",
  NGN: "flag-ng",
  // XOF is a currency union with no flag of its own; it wears Senegal's, a
  // WAEMU member, as its conventional stand-in - see Icon/types.ts.
  XOF: "flag-sn",
  UGX: "flag-ug",
  GHS: "flag-gh",
  KES: "flag-ke",
  ZAR: "flag-za",
  RWF: "flag-rw",
};

export function tickerIcon(code: string): IconName | undefined {
  return TICKER_ICON[code.toUpperCase()];
}

/**
 * The currency symbol to prefix a formatted amount with. Falls back to the
 * ticker plus a space ("KES 1,200"), which is correct-if-plain for any currency
 * this map has not been taught.
 */
const QUOTE_SYMBOL: Readonly<Record<string, string>> = {
  NGN: "₦",
  USD: "$",
  GHS: "₵",
  KES: "KSh",
  ZAR: "R",
  UGX: "USh",
  // The two CFA-zone codes have no single-character symbol; the conventional
  // short forms read as symbols in the same position ("CFA 61,000").
  XOF: "CFA ",
  RWF: "FRw ",
};

/**
 * Parse the amount field.
 *
 * Deliberately tolerant, because this is a free-text `inputMode="decimal"` field
 * and a marketing hero must not show `NaN`: it strips grouping commas and
 * whitespace, and anything that still is not a finite positive number resolves
 * to 0. `Number()` and not `parseFloat`, so trailing junk ("12abc") is rejected
 * outright instead of silently becoming 12.
 */
export function parseAmount(input: string): number {
  const cleaned = input.replace(/[,\s]/g, "");
  if (cleaned === "") return 0;

  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return 0;

  return value;
}

/** The converter itself. */
export function convert(amount: number, rate: ExchangeRate): number {
  return amount * rate.quotePerBase;
}

/**
 * Group an amount AS IT IS TYPED - the exact inverse of `parseAmount`, which is
 * why it lives beside it: `parseAmount(groupDigits(x))` is always a clean number.
 *
 * Operator request: a cross-border amount is routinely six or seven digits, and
 * an ungrouped "1000000" makes the reader count zeros to know what they typed.
 *
 * RULES, each one a decision rather than a default:
 *   - Digits and at most one decimal point survive; anything else is dropped as
 *     it is typed. Rejecting the keystroke is honest, and there is nothing to
 *     submit here so there is no error state to show.
 *   - Leading zeros are stripped ("007" -> "7"), because "0,007,000" is not a
 *     number anyone means. A lone "0" survives so "0.5" can be typed.
 *   - A trailing "." survives, so the field does not fight the reader mid-entry
 *     the moment they reach for the decimal.
 *   - Decimals cap at 2. These are fiat currency fields, so a third decimal is
 *     not a precision the product has; the crypto converter is deliberately NOT
 *     given this treatment, since a token amount legitimately carries more.
 */
export function groupDigits(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");

  const digitsOnly = (s: string) => s.replace(/\./g, "");
  const whole = firstDot === -1 ? cleaned : cleaned.slice(0, firstDot);
  const fraction =
    firstDot === -1 ? null : digitsOnly(cleaned.slice(firstDot + 1)).slice(0, 2);

  // `replace` with a lookahead rather than `toLocaleString`: the value is still
  // a STRING being edited, and routing it through Number would drop a trailing
  // "." and re-introduce the leading zeros stripped just above.
  const trimmed = whole.replace(/^0+(?=\d)/, "");
  const grouped = trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (fraction === null) return grouped;
  return `${grouped === "" ? "0" : grouped}.${fraction}`;
}

/*
 * An explicit locale on every formatter, never the runtime default.
 *
 * `Intl.NumberFormat` with no locale resolves to the HOST's, which is the
 * server's on the first paint and the visitor's on hydration. A visitor in a
 * locale that groups with periods would see "138.700" replace "138,700" on
 * hydration - a React text-content mismatch on the LCP element. "en-NG" pins
 * the grouping the design draws (comma) for everyone.
 */
const QUOTE_FORMAT = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 0,
});

/*
 * Small quotes keep two decimals. The whole-units rule above is 766:557's own
 * drawing for ₦138,700-sized figures, but the table now contains genuinely
 * fractional pairs - 100 cNGN is about GHS 0.94 - and rounding those to a
 * whole unit would print "₵1" for every amount under ~160, which is a wrong
 * number, not a style.
 */
const QUOTE_FORMAT_SMALL = new Intl.NumberFormat("en-NG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const RATE_FORMAT = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 2,
});

/*
 * Sub-unit rates get significant digits instead: cNGN -> GHS is ~0.0094,
 * which the two-decimal formatter would print as the actively misleading
 * "0.01" (out by ~6%).
 */
const RATE_FORMAT_SMALL = new Intl.NumberFormat("en-NG", {
  maximumSignificantDigits: 3,
});

/** `138700` -> `"₦138,700"`; `0.94` -> `"₵0.94"`. */
export function formatQuote(value: number, rate: ExchangeRate): string {
  const symbol = QUOTE_SYMBOL[rate.quote.toUpperCase()] ?? `${rate.quote} `;
  const formatted =
    value !== 0 && value < 100
      ? QUOTE_FORMAT_SMALL.format(value)
      : QUOTE_FORMAT.format(Math.round(value));
  return `${symbol}${formatted}`;
}

/**
 * The same figure as `formatQuote` with NO currency symbol - `782:583`.
 *
 * The cross-border converter puts its result INSIDE an editable field whose chip
 * already names the currency, and the design draws it as a bare "0.00". A symbol
 * in an input is both redundant there and a nuisance to type around, so the two
 * formatters differ only in that prefix and share the small/large split above so
 * a sub-unit result never rounds to a wrong whole number.
 */
export function formatPlain(value: number): string {
  return value !== 0 && value < 100
    ? QUOTE_FORMAT_SMALL.format(value)
    : QUOTE_FORMAT.format(Math.round(value));
}

/** `"1 USDT ~ NGN 1,387"` - 766:575's own phrasing, with the figures live. */
export function formatRateLine(rate: ExchangeRate): string {
  const figure =
    rate.quotePerBase < 1
      ? RATE_FORMAT_SMALL.format(rate.quotePerBase)
      : RATE_FORMAT.format(rate.quotePerBase);
  return `1 ${rate.base} ~ ${rate.quote} ${figure}`;
}
