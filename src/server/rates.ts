import "server-only";

import {
  DEFAULT_RATE,
  DEFAULT_RATE_TABLE,
  type ExchangeRate,
  type ResolvedRate,
  type ResolvedRateTable,
} from "@/content/rates";

/**
 * Resolves the exchange rate the converter runs on.
 *
 * `server-only` is the first line for a reason: this module reads
 * `process.env` and holds the admin override, and neither may ever be reachable
 * from a client bundle. The import makes an accidental `"use client"` consumer a
 * BUILD error rather than a leak.
 *
 * THE PRECEDENCE LADDER
 * ---------------------
 * Highest wins. Each rung is one of the three ways the operator asked to be able
 * to move the rate, plus the shipped floor:
 *
 *   1. override   set at runtime by `PUT /api/rates`. Changeable at any time,
 *                 no deploy, effective immediately.
 *   2. feed       `AZZA_RATE_FEED_URL` - an upstream JSON endpoint, polled with
 *                 a 60s cache. This is the rung to use for a real rates API.
 *   3. env        `AZZA_RATE_QUOTE_PER_BASE` (and optionally
 *                 `AZZA_RATE_BASE` / `AZZA_RATE_QUOTE`) - a manual figure set on
 *                 the host, changeable without touching code.
 *   4. default    `DEFAULT_RATE` in `content/rates.ts`, committed to the repo.
 *
 * NOTHING HERE THROWS. This rate renders inside the route's LCP element, so a
 * dead feed or a malformed env var must degrade to the next rung, not 500 the
 * page. Every failure is logged once, server-side, and falls through.
 *
 * DURABILITY OF THE OVERRIDE - READ BEFORE RELYING ON RUNG 1
 * The override lives in PROCESS memory (see the `globalThis` note below for why
 * it cannot be module memory). That is all one Next server needs to serve it, and
 * it is genuinely NOT durable: it is lost on restart or redeploy, and on a
 * multi-instance or serverless host each instance holds its own, so a single PUT
 * reaches one instance and the others keep serving the lower rungs. A single
 * long-lived server (the usual `next start` container) is fully consistent.
 *
 * For a fleet, or for an override that must survive a deploy, point rung 2 at a
 * store every instance can read - that is what rung 2 is for. Documented rather
 * than papered over, because a rate that silently differs per instance is a
 * money bug.
 */

/*
 * THE OVERRIDE LIVES ON `globalThis`, NOT IN A MODULE VARIABLE. THIS IS NOT
 * OPTIONAL - A PLAIN `let` HERE IS A BUG, AND IT WAS ONE.
 *
 * Next compiles each route into its own bundle, so this module is instantiated
 * more than once in a single server process: once in the graph behind
 * `app/api/rates/route.ts`, and again in the graph behind the page that renders
 * the widget. A module-scoped `let` therefore gives each graph its OWN override.
 *
 * Measured, before this was moved: `PUT /api/rates` with 1600 returned
 * `{"quotePerBase":1600,"source":"override"}`, and the very next request for
 * `/products/crypto-wallet` still server-rendered "1 USDT ~ NGN 1,387". The
 * write landed in the route handler's copy; the page read its own copy, found
 * `null`, and fell through to the committed default. The API agreed with itself
 * and disagreed with the page - the worst possible shape for a rate bug, because
 * the endpoint you would check to diagnose it is the one lying to you.
 *
 * `globalThis` is per-process rather than per-bundle, so both graphs see one
 * value. The key is namespaced to avoid colliding with anything else on it.
 */
const OVERRIDE_KEY = "__azzaRateOverride" as const;

type OverrideHost = { [OVERRIDE_KEY]?: ExchangeRate | null };

const host = globalThis as unknown as OverrideHost;

export function setRateOverride(rate: ExchangeRate): void {
  host[OVERRIDE_KEY] = rate;
}

export function clearRateOverride(): void {
  host[OVERRIDE_KEY] = null;
}

function readOverride(): ExchangeRate | null {
  return host[OVERRIDE_KEY] ?? null;
}

/**
 * Narrow an unknown parsed body to an `ExchangeRate`.
 *
 * Shared by the feed reader and the PUT handler so a hand-written admin payload
 * and an upstream response are held to exactly one standard. Returns `null`
 * rather than throwing - both callers want to fall through, not explode.
 *
 * `quotePerBase` must be finite and strictly positive: zero would render every
 * conversion as ₦0 and a negative rate is not a rate. `Number.isFinite` also
 * rejects the `NaN` that `Number(undefined)` produces.
 */
export function parseRatePayload(input: unknown): ExchangeRate | null {
  if (typeof input !== "object" || input === null) return null;

  const body = input as Record<string, unknown>;

  // `rate` is accepted as an alias so an upstream feed that already calls the
  // figure `rate` needs no adapter to sit on rung 2.
  const raw = body.quotePerBase ?? body.rate;
  const quotePerBase = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(quotePerBase) || quotePerBase <= 0) return null;

  const base =
    typeof body.base === "string" && body.base.trim() !== ""
      ? body.base.trim().toUpperCase()
      : DEFAULT_RATE.base;
  const quote =
    typeof body.quote === "string" && body.quote.trim() !== ""
      ? body.quote.trim().toUpperCase()
      : DEFAULT_RATE.quote;

  // An upstream `updatedAt` is honoured only if it is a real date; otherwise the
  // instant we accepted the figure is the truthful answer to "how fresh is this".
  const updatedAt =
    typeof body.updatedAt === "string" && !Number.isNaN(Date.parse(body.updatedAt))
      ? new Date(body.updatedAt).toISOString()
      : new Date().toISOString();

  return { base, quote, quotePerBase, updatedAt };
}

/** Rung 2. Resolves to `null` on any failure, having logged it. */
async function readFeed(url: string): Promise<ExchangeRate | null> {
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      /*
       * A hero must not wait on a third party. 2.5s is generous for a rates
       * endpoint and still under any sane render budget; past it we serve the
       * next rung rather than hold the page.
       */
      signal: AbortSignal.timeout(2500),
      /*
       * 60s of shared cache. Without this every render of the route would hit
       * the feed, which is both slow and a good way to get rate-limited by it.
       */
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn(`[rates] feed responded ${response.status}; falling through to the next source`);
      return null;
    }

    const parsed = parseRatePayload(await response.json());
    if (parsed === null) {
      console.warn(
        "[rates] feed payload had no usable positive `quotePerBase`/`rate`; falling through",
      );
    }
    return parsed;
  } catch (error) {
    // Includes the abort on timeout and any JSON parse failure.
    console.warn("[rates] feed unreachable; falling through", error);
    return null;
  }
}

/** Rung 3. */
function readEnv(): ExchangeRate | null {
  const raw = process.env.AZZA_RATE_QUOTE_PER_BASE;
  if (raw === undefined || raw.trim() === "") return null;

  const parsed = parseRatePayload({
    quotePerBase: raw.trim(),
    base: process.env.AZZA_RATE_BASE,
    quote: process.env.AZZA_RATE_QUOTE,
  });

  if (parsed === null) {
    console.warn(`[rates] AZZA_RATE_QUOTE_PER_BASE is not a positive number (${raw}); ignoring it`);
  }
  return parsed;
}

/**
 * The rate to render, and where it came from.
 *
 * Callers get a plain serialisable object so it can cross the server/client
 * boundary as a prop.
 */
export async function getRate(): Promise<ResolvedRate> {
  const override = readOverride();
  if (override !== null) return { ...override, source: "override" };

  const feedUrl = process.env.AZZA_RATE_FEED_URL;
  if (feedUrl !== undefined && feedUrl.trim() !== "") {
    const fromFeed = await readFeed(feedUrl.trim());
    if (fromFeed !== null) return { ...fromFeed, source: "feed" };
  }

  const fromEnv = readEnv();
  if (fromEnv !== null) return { ...fromEnv, source: "env" };

  return { ...DEFAULT_RATE, source: "default" };
}

/**
 * The full asset x currency table the converter's pickers run on - see the
 * table note in `content/rates.ts` for the anchor model.
 *
 * The ladder above resolves ONE pair, and every rung of it - the PUT override,
 * the feed, the env pair - describes a dollar-stablecoin -> NGN figure. So the
 * resolved figure is applied to the table as its NGN anchor, and the other six
 * currencies keep their committed defaults: the operator's existing levers
 * keep moving every NGN figure on the site (and, through cNGN's definition,
 * every cNGN pair) without a deploy, exactly as before.
 *
 * Guarded on `quote === "NGN"`: a rung could legitimately be pointed at some
 * other pair (`AZZA_RATE_QUOTE=KES`), and blindly writing that figure into the
 * NGN slot would corrupt the whole table. In that case the table keeps its
 * committed NGN anchor and says so - `source: "default"` - rather than lying
 * about where its numbers came from.
 */
export async function getRateTable(): Promise<ResolvedRateTable> {
  const resolved = await getRate();

  if (resolved.quote.toUpperCase() !== "NGN") {
    return { ...DEFAULT_RATE_TABLE, source: "default" };
  }

  return {
    currencyPerUsd: {
      ...DEFAULT_RATE_TABLE.currencyPerUsd,
      NGN: resolved.quotePerBase,
    },
    updatedAt: resolved.updatedAt,
    source: resolved.source,
  };
}
