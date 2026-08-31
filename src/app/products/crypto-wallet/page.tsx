import type { Metadata } from "next";

import { Faq } from "@/components/sections/Faq";
import { HeroCryptoWallet } from "@/components/sections/HeroCryptoWallet";
import { FAQ_CRYPTO_WALLET } from "@/content/faq";

/** Copy is the hero standfirst (`412:1621`), verbatim. */
export const metadata: Metadata = {
  title: "Crypto Wallet",
  description:
    "Deposit, withdraw, buy, sell, swap, and spend — all in one place. " +
    "No apps. No switching platforms. Just WhatsApp.",
};

/**
 * Re-render at most every 5 minutes.
 *
 * WITHOUT THIS THE EXCHANGE RATE WOULD BE FROZEN AT BUILD TIME. The hero is a
 * static server component, so Next would prerender it once and serve that HTML
 * forever - an operator could move the rate through any of the four sources in
 * `src/server/rates.ts` and this page would keep showing the figure that was
 * true when it was built.
 *
 * 300s is the ceiling on staleness, not the mechanism for a deliberate change:
 * `PUT /api/rates` calls `revalidatePath` on this route, so an admin update
 * lands on the next request rather than waiting out the window. The window is
 * what catches a rate that moved at its upstream feed instead.
 */
export const revalidate = 300;

/**
 * `/products/crypto-wallet` - Figma `412:1586`.
 *
 * Two sections, and that is the whole route: the hero with its buy/sell widget
 * (`412:1587`, recoloured at `766:520`) and the shared FAQ (`412:1759`). Verified
 * against the frame render - there is no third band between them.
 *
 * The `<h1>` ("Your all-in-one wallet, built for how money actually moves.")
 * lives in `HeroCryptoWallet`, at `display-4-tight` with no O-swap.
 */
export default function CryptoWalletPage() {
  return (
    <>
      <HeroCryptoWallet />
      <Faq items={FAQ_CRYPTO_WALLET} />
    </>
  );
}
