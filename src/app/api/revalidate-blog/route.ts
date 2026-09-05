import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { BLOG_CACHE_TAG } from "@/lib/hashnode";

/**
 * The "instantly" half of the blog's freshness model (lib/hashnode.ts owns
 * the other half, a 5-minute ISR floor).
 *
 * POST here busts the Hashnode feed cache, so the next request to `/blog` or
 * any article re-fetches the feed immediately. Wire it to Hashnode:
 *
 *   Publication dashboard -> Webhooks -> Add webhook
 *     URL:    https://<site>/api/revalidate-blog?secret=<HASHNODE_WEBHOOK_SECRET>
 *     Events: post published, post updated, post deleted
 *
 * and set the same HASHNODE_WEBHOOK_SECRET in the deployment's env. The
 * secret is compared from the query string because Hashnode's webhook config
 * takes a URL, not headers; over TLS the query string is encrypted in
 * transit. Without the env var the endpoint answers 503 and does nothing -
 * an unauthenticated cache-bust endpoint is a free denial-of-cache lever, so
 * it does not exist until it can be a secret one.
 *
 * The handler does not read the webhook body: any of the three events means
 * the same thing here - the feed changed, forget the cached copy. That also
 * makes the endpoint safe to point anything else at (a CMS button, a curl)
 * with the same secret.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.HASHNODE_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { revalidated: false, reason: "HASHNODE_WEBHOOK_SECRET is not configured" },
      { status: 503 },
    );
  }

  if (request.nextUrl.searchParams.get("secret") !== secret) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidateTag(BLOG_CACHE_TAG);
  return NextResponse.json({ revalidated: true, tag: BLOG_CACHE_TAG });
}
