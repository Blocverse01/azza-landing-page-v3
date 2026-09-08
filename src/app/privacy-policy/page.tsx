import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/LegalDocument";
import { PRIVACY_POLICY } from "@/content/legal";
import { pageOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: PRIVACY_POLICY.title,
  description: PRIVACY_POLICY.standfirst,
  alternates: { canonical: "/privacy-policy" },
  openGraph: pageOpenGraph("/privacy-policy"),
};

/**
 * `/privacy-policy` - the route the footer's Company column has pointed at
 * since the first build (`content/footer.ts`, "Company" -> Privacy Policy).
 * That href carried `prefetch: false` for the reason its note gives - Next
 * prefetches every in-viewport `<Link>`, and the footer ships on every route,
 * so a missing page was being requested and 404ing site-wide. The flag is
 * deleted now that the page exists.
 *
 * The document is data (`content/legal.ts`) and the frame is shared with
 * `/terms-of-use`; both are transcriptions of operator-supplied Google Docs
 * dated 9 June 2026. The `<h1>` lives in `LegalPage`.
 */
const TITLE_ID = "privacy-policy-title";

export default function PrivacyPolicyPage() {
  return <LegalPage document={PRIVACY_POLICY} titleId={TITLE_ID} />;
}
