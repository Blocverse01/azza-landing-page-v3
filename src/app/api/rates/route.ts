import { createHash, timingSafeEqual } from "node:crypto";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  clearRateOverride,
  getRate,
  parseRatePayload,
  setRateOverride,
} from "@/server/rates";

/**
 * The exchange-rate admin endpoint.
 *
 *   GET     read the rate the site is currently serving, and which rung of the
 *           precedence ladder it came from. Unauthenticated - it returns exactly
 *           the figure already painted on the public page, so there is nothing
 *           here to protect.
 *   PUT     set the runtime override. Authenticated.
 *   DELETE  drop the override, so the ladder falls back to the feed / env / the
 *           committed default. Authenticated.
 *
 * `force-dynamic` because the whole point of GET is to report the CURRENT
 * figure; a cached response would report a stale one.
 *
 * USAGE
 *   curl https://.../api/rates
 *   curl -X PUT https://.../api/rates \
 *        -H 'authorization: Bearer $AZZA_RATE_ADMIN_TOKEN' \
 *        -H 'content-type: application/json' \
 *        -d '{"quotePerBase": 1425}'
 *   curl -X DELETE https://.../api/rates \
 *        -H 'authorization: Bearer $AZZA_RATE_ADMIN_TOKEN'
 *
 * See `src/server/rates.ts` for the ladder, and for the documented limit on how
 * far a runtime override travels on a multi-instance host.
 */
export const dynamic = "force-dynamic";

/**
 * Every page whose render embeds a rate. BOTH are required: the cross-border
 * hero's converter started rendering the anchor table too, and a `revalidatePath`
 * that names only the crypto page would leave this endpoint reporting a new rate
 * while `/products/cross-border-payments` kept serving the old one until its ISR
 * window expired - the same API-disagrees-with-the-page shape the `globalThis`
 * note in `server/rates.ts` describes. Add a path here whenever a new route
 * renders a rate.
 */
const RATE_PATHS = [
  "/products/crypto-wallet",
  "/products/cross-border-payments",
] as const;

function revalidateRatePages(): void {
  for (const path of RATE_PATHS) revalidatePath(path);
}

/**
 * Constant-time bearer check.
 *
 * FAILS CLOSED. With no `AZZA_RATE_ADMIN_TOKEN` configured the write verbs are
 * unavailable (503) rather than open: an unauthenticated endpoint that can move
 * the exchange rate on a live page is the one outcome worth refusing outright,
 * and "the env var was not set yet" is exactly when that would happen.
 *
 * Both sides are SHA-256'd before comparison because `timingSafeEqual` throws on
 * a length mismatch - comparing raw would leak the token's length through that
 * exception. Digests are always 32 bytes, so the comparison itself is the only
 * thing that can vary, and it is constant-time.
 */
function authorise(request: Request): "ok" | "unconfigured" | "denied" {
  const expected = process.env.AZZA_RATE_ADMIN_TOKEN;
  if (expected === undefined || expected === "") return "unconfigured";

  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (provided === "") return "denied";

  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();

  return timingSafeEqual(a, b) ? "ok" : "denied";
}

/**
 * Turn the auth verdict into a response, or `null` to proceed.
 *
 * The 401 deliberately says nothing about whether the token was wrong, absent or
 * malformed, and the log line never contains the submitted value.
 */
function reject(verdict: ReturnType<typeof authorise>): NextResponse | null {
  if (verdict === "ok") return null;

  if (verdict === "unconfigured") {
    console.warn(
      "[rates] refused a write: AZZA_RATE_ADMIN_TOKEN is not configured",
    );
    return NextResponse.json(
      {
        error:
          "Rate updates are not configured. Set AZZA_RATE_ADMIN_TOKEN to enable them.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  return NextResponse.json(await getRate(), {
    headers: { "cache-control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const denied = reject(authorise(request));
  if (denied !== null) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body must be JSON." },
      { status: 400 },
    );
  }

  const rate = parseRatePayload(body);
  if (rate === null) {
    return NextResponse.json(
      {
        error:
          "Expected `quotePerBase` (or `rate`) to be a number greater than 0. " +
          "`base`, `quote` and `updatedAt` are optional.",
      },
      { status: 400 },
    );
  }

  setRateOverride(rate);
  // Push it to the rendered page immediately instead of waiting out the ISR
  // window - "changeable at any time" has to mean visible at any time.
  revalidateRatePages();

  return NextResponse.json(await getRate());
}

export async function DELETE(request: Request) {
  const denied = reject(authorise(request));
  if (denied !== null) return denied;

  clearRateOverride();
  revalidateRatePages();

  return NextResponse.json(await getRate());
}
