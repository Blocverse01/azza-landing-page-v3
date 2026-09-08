import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/LegalDocument";
import { TERMS_OF_USE } from "@/content/legal";
import { pageOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: TERMS_OF_USE.title,
  description: TERMS_OF_USE.standfirst,
  alternates: { canonical: "/terms-of-use" },
  openGraph: pageOpenGraph("/terms-of-use"),
};

/**
 * `/terms-of-use` - the second of the two footer legal routes. See the note on
 * `/privacy-policy` for the shared frame and for why both hrefs lost their
 * `prefetch: false`.
 *
 * The source document is titled "TERMS OF USE", not "Terms of Service", and the
 * Privacy Policy refers to it by that name in clause 1.0. The footer label and
 * the route slug already agreed with it, so nothing here needed renaming.
 */
const TITLE_ID = "terms-of-use-title";

export default function TermsOfUsePage() {
  return <LegalPage document={TERMS_OF_USE} titleId={TITLE_ID} />;
}
