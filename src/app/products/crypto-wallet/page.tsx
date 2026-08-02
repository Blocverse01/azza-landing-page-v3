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
 * `/products/crypto-wallet` - Figma `412:1586`.
 *
 * Two sections, and that is the whole route: the hero with its buy/sell widget
 * (`412:1587`) and the shared FAQ (`412:1759`). Verified against the frame
 * render - there is no third band between them.
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
