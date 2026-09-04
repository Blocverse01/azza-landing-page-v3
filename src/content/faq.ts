/**
 * The four FAQ question sets - design/components.md S7.2.
 *
 * EVERY ROW HERE IS REAL, ANSWERED COPY. THAT IS THE WHOLE RULE.
 * -------------------------------------------------------------
 * A question with no authored answer does not belong in this file, does not
 * get a placeholder, and does not ship. `answer` is REQUIRED, so the compiler
 * enforces it rather than a convention nobody can see.
 *
 * SOURCES, IN ORDER OF AUTHORITY
 *   1. THE CLIENT FAQ DOCUMENT (Google Doc `1rAvFZ4eak…`, received 2026-09-04).
 *      It authors every Cross Border Payments answer and every Business
 *      answer, and re-confirms the Crypto Wallet deposit answer.
 *   2. THE FIGMA NODES, for what it does not cover - the question strings, and
 *      the four answers the design file itself authored.
 *   3. THE LIVE SITE, https://www.useazza.com - for the LANDING set only. Its
 *      five-row FAQ is AZZA's own published copy, questions and answers both,
 *      and it answers the two the design file only asked.
 *
 * WHAT WAS REMOVED, AND WHY NOTHING HERE IS INFERRED
 * -------------------------------------------------
 * The design file drew 18 question rows and authored only 4 answers - one per
 * frame, the row shown open at rest. The client document closed 8 more. The
 * remaining 7 were "Why should i doo KYC?" (landing + crypto wallet) and
 * "Supported Local Currency?" (three times on landing - a duplicate row in the
 * source, responsive.md S14.3 #3 - and twice on crypto wallet). None had an
 * answer from anyone, so all 7 were deleted rather than shown with holding
 * copy.
 *
 * The landing set has since been repopulated from the live site, which answers
 * both of those questions in AZZA's own words. THE CRYPTO WALLET SET HAS NOT
 * BEEN, and must not be by copy-paste: the live rows are a general product FAQ
 * and that page is about the wallet specifically. Its two unanswered questions
 * stay gone until the client says what belongs there.
 *
 * Nothing in this file is written by an implementer. AZZA is a regulated money
 * product; a sentence about KYC, rates or supported currencies invented during
 * the build is a factual claim made by someone with no authority to make it.
 *
 * WHOSE WORDING WINS FOR A QUESTION
 * --------------------------------
 * The landing rows below carry the LIVE SITE's question strings, not Figma's,
 * because a question and its answer are one authored pair and splitting them
 * across two sources invents a third thing. That retires two Figma defects as
 * a side effect - the triple-duplicated "Supported Local Currency?" row
 * (`412:1567`/`1569`/`1571`) and the "Why should i doo KYC?" typo (`412:1565`,
 * responsive.md S14.3 #4) - by replacement, not by correction.
 */

export interface FaqItem {
  id: string;
  question: string;
  /** Required. See the file header - unanswered questions are not carried. */
  answer: string;
}

/**
 * `412:1554` - Main Landing.
 *
 * All five rows are the live site's FAQ (https://www.useazza.com), question
 * and answer, in its order. The first answer is the one the design file also
 * authored at `412:1574`, word for word - the two sources agree, which is why
 * the live question wording is safe to take for the rest.
 */
export const FAQ_LANDING: readonly FaqItem[] = [
  {
    id: "landing-supported-chains",
    question: "What are the supported blockchains/networks on AZZA?",
    // Identical to the design file's `412:1574`.
    answer:
      "AZZA supports the following blockchains and networks: Optimism, Ethereum, Solana, Binance Smart Chain, Tron, Polygon, Arbitrum, Base, Celo, Lisk and Assetchain.",
  },
  {
    id: "landing-supported-cryptocurrencies",
    question: "What are the supported cryptocurrencies on AZZA?",
    answer: "Azza supports USDT, USDC, BNB, ETH, SOL, CNGN, CELO and TRX.",
  },
  {
    id: "landing-local-currencies",
    question: "What local currencies are available on AZZA?",
    // Verbatim but for a stray leading space on the live string.
    answer:
      "Naira (NGN), Kenya Shillings (KES), Ghana Cedis (GHS) and South Africa Rand (ZAR) are the only local currencies available on AZZA for now. More local currencies will be added soon.",
  },
  {
    id: "landing-rates",
    question: "What are the rates like?",
    /**
     * Verbatim, and weaker than the rows around it - it reassures without
     * saying anything, on the one question where a visitor wants a number or a
     * method. Left as published because it IS published: rewriting it here
     * would be an implementer making a pricing claim. Worth raising with the
     * client, alongside the cross-border fees answer, which does answer it.
     */
    answer: "The rates are satisfactory, and not something to worry about.",
  },
  {
    id: "landing-kyc",
    question: "Why should I do KYC?",
    answer:
      "KYC is required to ensure the security of your account and to comply with regulations.",
  },
];

/**
 * `412:1759` - Products, Crypto Wallet.
 *
 * The client document's Crypto Wallet section reads "Everything crypto faq +
 * this", followed by the deposit answer. The deposit answer was already
 * carried; the instruction to carry the whole crypto FAQ is why "Supported
 * Chain on Azza?" repeats the landing set's authored answer verbatim - same
 * question string, same product, one authored answer.
 */
export const FAQ_CRYPTO_WALLET: readonly FaqItem[] = [
  {
    id: "crypto-deposit-anytime",
    // 412:1772
    question: "Can I deposit funds into my Azza crypto wallet at any time?",
    // 412:1779, re-confirmed verbatim by the client document
    answer:
      "Yes. You can fund your Azza crypto wallet anytime using supported cryptocurrencies and start sending, swapping, or withdrawing funds whenever you need to.",
  },
  {
    id: "crypto-supported-chain",
    // 412:1768
    question: "Supported Chain on Azza?",
    // Carried from `landing-supported-chain` (412:1574) - identical question.
    answer:
      "AZZA supports the following blockchains and networks: Optimism, Ethereum, Solana, Binance Smart Chain, Tron, Polygon, Arbitrum, Base, Celo, Lisk and Assetchain.",
  },
];

/**
 * `412:1996` - Products, Cross Border Payments. Rows `412:2004` … `412:2012`.
 * All five answers come from the client document, in this order.
 */
export const FAQ_CROSS_BORDER: readonly FaqItem[] = [
  {
    id: "cross-border-transfer-time",
    // 412:2005
    question: "How long do international transfers take?",
    // 412:2016, re-confirmed verbatim by the client document
    answer:
      "Most transfers are processed within minutes, depending on payment method, destination, and compliance checks.",
  },
  {
    id: "cross-border-currencies",
    // 412:2007
    question: "What currencies can I send?",
    answer:
      "Azza supports payments in USD, NGN, GHS, KES, RWF, ZAR, CAD, and CNY, as well as USD-backed stablecoins such as USDT and USDC. Additional currencies may be available upon request, depending on the payment corridor.",
  },
  {
    id: "cross-border-recipient-account",
    // 412:2009
    question: "Do recipients need an Azza account?",
    answer:
      "No. Recipients can receive funds directly into their bank account or mobile money (MoMo) wallet without needing an Azza account.",
  },
  {
    id: "cross-border-cost",
    // 412:2011
    question: "How much does it cost to send money internationally?",
    answer:
      "Fees vary by corridor, currency pair, and transaction size. Pricing is displayed before you confirm your transaction, so you’ll always know exactly what you’re paying.",
  },
  {
    id: "cross-border-suppliers",
    // 412:2013
    question: "Can I pay suppliers and contractors abroad?",
    answer:
      "Yes. Businesses and individuals can use Azza to make international payments to suppliers, freelancers, employees, and partners in USD, CNY, CAD, NGN, RWF, GHS, ZAR, and KES. Need another currency? Simply request it from our team.",
  },
];

/**
 * `412:2633` - Products, Azza For Business. Three rows, not five: the card is
 * 561 tall rather than 712 because two question rows are absent, not because
 * the layout differs (layout.md S5.3).
 *
 * All three answers come from the client document.
 */
export const FAQ_BUSINESS: readonly FaqItem[] = [
  {
    id: "business-who-can-open",
    // 412:2642
    question: "Who can open a Business Account?",
    // 412:2653, re-confirmed verbatim by the client document
    answer:
      "Registered businesses, startups, agencies, exporters, importers, e-commerce businesses, and global teams can apply.",
  },
  {
    id: "business-international-payments",
    // 412:2644
    question:
      "Can businesses send and receive payments from international customers?",
    /**
     * THE ONE PLACE THE CLIENT DOCUMENT IS NOT TRANSCRIBED VERBATIM. It reads:
     *
     *   "Yes. Businesses can receive funds from international customers and
     *    business USD, CYN, CAN, NGN, RWF, GSH, ZAR,KSH, you can request for
     *    currency"
     *
     * That sentence has no main verb after "and business", no terminal stop,
     * and four transposed ISO 4217 codes - CYN/CAN/GSH/KSH for CNY/CAD/GHS/KES.
     * The correct codes are not a guess: the SAME document spells all eight
     * correctly in the cross-border answer above, so this is a typing slip in
     * one line, not a different currency list.
     *
     * Repaired to the document's own wording elsewhere. No claim is added or
     * removed - same eight currencies, same "request another" offer. Flagged to
     * the operator; revert this to the raw string if they want it as written.
     */
    answer:
      "Yes. Businesses can send and receive funds from international customers in USD, CNY, CAD, NGN, RWF, GHS, ZAR, and KES. Need another currency? Simply request it from our team.",
  },
  {
    id: "business-otc",
    // 412:2646
    question: "Do you offer OTC services for businesses?",
    answer:
      "Yes. Businesses can access OTC (Over-the-Counter) services for large-volume crypto and fiat transactions, with dedicated support, competitive rates, and customized settlement options.",
  },
];
