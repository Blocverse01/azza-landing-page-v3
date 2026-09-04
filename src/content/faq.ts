/**
 * The four FAQ question sets - design/components.md S7.2.
 *
 * TWO SOURCES, IN THIS ORDER OF AUTHORITY
 * ---------------------------------------
 *   1. THE CLIENT FAQ DOCUMENT (Google Doc `1rAvFZ4eak…`, received 2026-09-04).
 *      It authors answers for the Cross Border Payments set (all five) and the
 *      Business set (all three), and re-confirms the Crypto Wallet deposit
 *      answer already carried here. Where it speaks, it wins.
 *   2. THE FIGMA NODES, for everything it does not cover - the questions
 *      themselves, and the four answers the design file authored.
 *
 * Questions are still transcribed VERBATIM from Figma, including the defects.
 * Two are on the record:
 *
 *   - `412:1566`, `412:1568` and `412:1570` are all "Supported Local Currency?"
 *     on the landing FAQ (responsive.md S14.3 #3).
 *   - `412:1565` reads "Why should i doo KYC?" - lowercase `i`, "doo"
 *     (responsive.md S14.3 #4).
 *
 * Reproduce them and let the operator decide; do not silently correct copy.
 * The client document does not address either, so both still stand.
 *
 * WHAT IS STILL UNANSWERED - 7 OF 18 ROWS
 * ---------------------------------------
 * The design file authored one answer per frame (`412:1574`, `412:1779`,
 * `412:2016`, `412:2653`) - the first question of each, the one shown open at
 * rest. The client document closed eight more of those gaps. Seven remain, all
 * of them "Why should i doo KYC?" or "Supported Local Currency?", on the
 * landing and crypto-wallet sets.
 *
 * HOW THAT GAP IS REPRESENTED HERE - BY ABSENCE, NOT BY A PLACEHOLDER STRING.
 * ---------------------------------------------------------------------------
 * `answer` is OPTIONAL. A question nobody has answered yet simply omits it.
 * This file holds authored copy and nothing else: there is no stand-in string
 * to leak, because there is no stand-in string.
 *
 * An earlier revision stored a build-team-facing sentence ("Answer copy
 * pending...") as the answer VALUE, and it was rendered verbatim to visitors on
 * four public routes. Prose written for the build must never live in the
 * content layer - the content layer is, by definition, the thing that ships.
 * What a visitor sees while an answer is unwritten is a PRESENTATION decision
 * and belongs to `FaqAnswerPanel`, which owns the holding copy.
 *
 * DO NOT FILL THE REMAINING SEVEN IN BY INFERENCE. The cross-border answer
 * below lists the currencies AZZA settles in, and it is tempting to reuse it
 * for "Supported Local Currency?" - do not. That is a different question, and
 * answering it is a factual claim on a regulated money product made by someone
 * with no authority to make it. The answers must come from the client.
 *
 * TO FIND ALL SEVEN: grep this file for `NO ANSWER IN SOURCE`, or query the
 * served DOM for `[data-answer-pending="true"]` - `FaqAnswerPanel` stamps that
 * marker on every panel with no authored answer.
 */

export interface FaqItem {
  id: string;
  question: string;
  /**
   * The authored answer. OMITTED when neither the client document nor the
   * design file supplies one - see the file header. `FaqAnswerPanel` renders
   * neutral holding copy in its place and marks the panel
   * `data-answer-pending="true"`.
   */
  answer?: string;
}

/** `412:1554` - Main Landing. Rows `412:1562` / `1564` / `1566` / `1568` / `1570`. */
export const FAQ_LANDING: readonly FaqItem[] = [
  {
    id: "landing-supported-chain",
    // 412:1563
    question: "Supported Chain on Azza?",
    // 412:1574 - the one authored answer on this frame
    answer:
      "AZZA supports the following blockchains and networks: Optimism, Ethereum, Solana, Binance Smart Chain, Tron, Polygon, Arbitrum, Base, Celo, Lisk and Assetchain.",
  },
  {
    id: "landing-kyc",
    // 412:1565 - typo is in the source and is reproduced deliberately
    question: "Why should i doo KYC?",
    // NO ANSWER IN SOURCE - neither Figma nor the client doc authors one.
  },
  {
    id: "landing-local-currency-1",
    // 412:1567
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - neither Figma nor the client doc authors one.
  },
  {
    id: "landing-local-currency-2",
    // 412:1569 - duplicate of the row above, in the source
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - neither Figma nor the client doc authors one.
  },
  {
    id: "landing-local-currency-3",
    // 412:1571 - duplicate of the two rows above, in the source
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - neither Figma nor the client doc authors one.
  },
];

/**
 * `412:1759` - Products, Crypto Wallet.
 * Source order is `412:1771`, `1767`, `1769`, `1773`, `1775` - the layer names
 * are out of sequence in the file but the rendered order is the one below.
 *
 * The client document's Crypto Wallet section reads "Everything crypto faq +
 * this", followed by the deposit answer. The deposit answer was already here;
 * the instruction to carry the whole crypto FAQ is why "Supported Chain on
 * Azza?" below now repeats the landing set's authored answer verbatim - same
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
  {
    id: "crypto-kyc",
    // 412:1770 - same source typo as the landing set
    question: "Why should i doo KYC?",
    // NO ANSWER IN SOURCE - neither Figma nor the client doc authors one.
  },
  {
    id: "crypto-local-currency-1",
    // 412:1774
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - neither Figma nor the client doc authors one.
  },
  {
    id: "crypto-local-currency-2",
    // 412:1776 - duplicate of the row above, in the source
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - neither Figma nor the client doc authors one.
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
