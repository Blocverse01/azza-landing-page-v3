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
 * Those 14 carry `FAQ_ANSWER_PENDING`. They are NOT lorem and they are NOT
 * paraphrase: inventing product copy about KYC, supported currencies or OTC
 * services would be a factual claim on a regulated money product, made by an
 * implementer with no authority to make it. This follows the pattern already
 * ratified for the /help open state (D-027 item 2): ship a visible, obviously
 * provisional placeholder so the gap stays visible rather than disguised.
 *
 * `FaqAnswerPanel` stamps `data-answer-pending="true"` on every panel holding
 * the placeholder, so a Phase 3 auditor can count them without reading prose.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * The stand-in for a question the design never answered. Exported so the panel
 * can mark itself, and so one string change updates all 14 sites.
 */
export const FAQ_ANSWER_PENDING =
  "Answer copy pending. This question has no answer written in the source design.";

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
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "landing-local-currency-1",
    // 412:1567
    question: "Supported Local Currency?",
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "landing-local-currency-2",
    // 412:1569 - duplicate of the row above, in the source
    question: "Supported Local Currency?",
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "landing-local-currency-3",
    // 412:1571 - duplicate of the two rows above, in the source
    question: "Supported Local Currency?",
    answer: FAQ_ANSWER_PENDING,
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
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "crypto-kyc",
    // 412:1770 - same source typo as the landing set
    question: "Why should i doo KYC?",
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "crypto-local-currency-1",
    // 412:1774
    question: "Supported Local Currency?",
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "crypto-local-currency-2",
    // 412:1776 - duplicate of the row above, in the source
    question: "Supported Local Currency?",
    answer: FAQ_ANSWER_PENDING,
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
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "cross-border-recipient-account",
    // 412:2009
    question: "Do recipients need an Azza account?",
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "cross-border-cost",
    // 412:2011
    question: "How much does it cost to send money internationally?",
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "cross-border-suppliers",
    // 412:2013
    question: "Can I pay suppliers and contractors abroad?",
    answer: FAQ_ANSWER_PENDING,
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
    answer: FAQ_ANSWER_PENDING,
  },
  {
    id: "business-otc",
    // 412:2646
    question: "Do you offer OTC services for businesses?",
    answer: FAQ_ANSWER_PENDING,
  },
];
