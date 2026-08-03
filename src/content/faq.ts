/**
 * The four FAQ question sets - design/components.md S7.2.
 *
 * Every question and every answer below is transcribed VERBATIM from the Figma
 * nodes, including the defects. Two are already on the record:
 *
 *   - `412:1566`, `412:1568` and `412:1570` are all "Supported Local Currency?"
 *     on the landing FAQ (responsive.md S14.3 #3).
 *   - `412:1565` reads "Why should i doo KYC?" - lowercase `i`, "doo"
 *     (responsive.md S14.3 #4).
 *
 * Reproduce them and let the operator decide; do not silently correct copy.
 *
 * THE THIRD DEFECT, FOUND WHILE TRANSCRIBING - only ONE answer exists per
 * instance. Each of the four FAQ frames authors a single answer panel
 * (`412:1574`, `412:1779`, `412:2016`, `412:2653`), and it belongs to that
 * frame's FIRST question - the one shown open at rest. The other 14 questions
 * across the four sets have no answer copy anywhere in the design file.
 *
 * HOW THAT GAP IS REPRESENTED HERE - BY ABSENCE, NOT BY A PLACEHOLDER STRING.
 * ---------------------------------------------------------------------------
 * `answer` is OPTIONAL. A question the design never answered simply omits it.
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
 * DO NOT FILL THESE IN BY INFERENCE. Inventing product copy about KYC,
 * supported currencies, transfer limits, fees or OTC services would be a
 * factual claim on a regulated money product, made by someone with no authority
 * to make it. The answers must come from the design or from the client.
 *
 * TO FIND ALL 14: grep this file for `NO ANSWER IN SOURCE`, or query the served
 * DOM for `[data-answer-pending="true"]` - `FaqAnswerPanel` stamps that marker
 * on every panel with no authored answer.
 */

export interface FaqItem {
  id: string;
  question: string;
  /**
   * The authored answer. OMITTED when the design file contains none - see the
   * file header. `FaqAnswerPanel` renders neutral holding copy in its place and
   * marks the panel `data-answer-pending="true"`.
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
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "landing-local-currency-1",
    // 412:1567
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "landing-local-currency-2",
    // 412:1569 - duplicate of the row above, in the source
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "landing-local-currency-3",
    // 412:1571 - duplicate of the two rows above, in the source
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
];

/**
 * `412:1759` - Products, Crypto Wallet.
 * Source order is `412:1771`, `1767`, `1769`, `1773`, `1775` - the layer names
 * are out of sequence in the file but the rendered order is the one below.
 */
export const FAQ_CRYPTO_WALLET: readonly FaqItem[] = [
  {
    id: "crypto-deposit-anytime",
    // 412:1772
    question: "Can I deposit funds into my Azza crypto wallet at any time?",
    // 412:1779 - the one authored answer on this frame
    answer:
      "Yes. You can fund your Azza crypto wallet anytime using supported cryptocurrencies and start sending, swapping, or withdrawing funds whenever you need to.",
  },
  {
    id: "crypto-supported-chain",
    // 412:1768
    question: "Supported Chain on Azza?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "crypto-kyc",
    // 412:1770 - same source typo as the landing set
    question: "Why should i doo KYC?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "crypto-local-currency-1",
    // 412:1774
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "crypto-local-currency-2",
    // 412:1776 - duplicate of the row above, in the source
    question: "Supported Local Currency?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
];

/** `412:1996` - Products, Cross Border Payments. Rows `412:2004` … `412:2012`. */
export const FAQ_CROSS_BORDER: readonly FaqItem[] = [
  {
    id: "cross-border-transfer-time",
    // 412:2005
    question: "How long do international transfers take?",
    // 412:2016 - the one authored answer on this frame
    answer:
      "Most transfers are processed within minutes, depending on payment method, destination, and compliance checks.",
  },
  {
    id: "cross-border-currencies",
    // 412:2007
    question: "What currencies can I send?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "cross-border-recipient-account",
    // 412:2009
    question: "Do recipients need an Azza account?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "cross-border-cost",
    // 412:2011
    question: "How much does it cost to send money internationally?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "cross-border-suppliers",
    // 412:2013
    question: "Can I pay suppliers and contractors abroad?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
];

/**
 * `412:2633` - Products, Azza For Business. Three rows, not five: the card is
 * 561 tall rather than 712 because two question rows are absent, not because
 * the layout differs (layout.md S5.3).
 */
export const FAQ_BUSINESS: readonly FaqItem[] = [
  {
    id: "business-who-can-open",
    // 412:2642
    question: "Who can open a Business Account?",
    // 412:2653 - the one authored answer on this frame
    answer:
      "Registered businesses, startups, agencies, exporters, importers, e-commerce businesses, and global teams can apply.",
  },
  {
    id: "business-international-payments",
    // 412:2644
    question:
      "Can businesses send and receive payments from international customers?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
  {
    id: "business-otc",
    // 412:2646
    question: "Do you offer OTC services for businesses?",
    // NO ANSWER IN SOURCE - the design file authors none. Do not invent one.
  },
];
