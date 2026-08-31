import type { Metadata } from "next";

import { Faq } from "@/components/sections/Faq";
import { HeroCrossBorder } from "@/components/sections/HeroCrossBorder";
import { WhyAzzaCrossBorder } from "@/components/sections/WhyAzzaCrossBorder";
import { FAQ_CROSS_BORDER } from "@/content/faq";

/** Copy is the hero standfirst (`412:1860`), verbatim. */
export const metadata: Metadata = {
  title: "Cross-Border Payments",
  description:
    "Make payments globally with your local currency — wherever you are.",
};

/**
 * Re-render at most every 5 minutes - the same window `/products/crypto-wallet`
 * carries, and for the same reason: the hero's converter now renders the
 * server-resolved rate table, and without this Next would prerender this page
 * once and serve that HTML forever, freezing the rates at build time. An admin
 * change lands sooner than the window - `PUT /api/rates` revalidates this path
 * explicitly.
 */
export const revalidate = 300;

/**
 * `/products/cross-border-payments` - Figma `412:1829`.
 *
 * Three sections in the frame's own order: the hero with the exchange widget
 * (`412:1854`), the two-card "Spend money effortlessly across borders" block
 * (`553:287`), then the shared FAQ (`412:1996`).
 *
 * The `<h1>` ("Your financial passport.") lives in `HeroCrossBorder`.
 */
export default function CrossBorderPaymentsPage() {
  return (
    <>
      <HeroCrossBorder />
      <WhyAzzaCrossBorder />
      <Faq items={FAQ_CROSS_BORDER} />
    </>
  );
}
