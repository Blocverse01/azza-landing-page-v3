import type { IconName } from "@/components/ui";

/**
 * `/help` content - Figma `500:1736` (closed) and `500:2305` (opened).
 *
 * D-001: these are ONE route in TWO states, not two routes. Everything below
 * therefore describes a single surface: the sidebar tree is shared by both
 * states, the resource grid + community block are the hub state, and the
 * breadcrumb + article are the open state.
 *
 * Every string here is transcribed verbatim from its Figma node, INCLUDING the
 * source defects (see the notes at each site). The one thing that is NOT
 * transcribed is the article body: `500:2368`, `501:219`, `501:220`, `501:224`,
 * `501:225`, `501:233`, `501:234` are all lorem ipsum, and D-027 item 2 rules
 * that the open state ships a visible placeholder rather than invented copy.
 *
 * DEVIATIONS FROM THE components.md S7.5 CONTRACT - all additive, all forced by
 * a gap in the source design, all recorded in this agent's `findings`:
 *
 *   1. `HELP_RESOURCES[].icon` is OPTIONAL, not `IconName`. All four source
 *      frames (`500:1773`, `500:1779`, `500:1786`, `500:1792`) are empty 40x40
 *      frames - there is no glyph to name (D-023). The slot reserves its space
 *      and renders no icon.
 *   2. `HELP_COMMUNITY[].href` is OPTIONAL. The three community rows
 *      (`500:1801`, `500:1806`, `500:1811`) are plain frames in Figma, not
 *      links, and no destination is authored anywhere in the file. Guessing a
 *      social URL is the same class of error as guessing a phone number
 *      (D-032/D-034), so they ship as designed: static rows.
 *   3. `HelpArticle` gains `topicId` and `sections`. `topicId` makes the
 *      sidebar-topic <-> article linkage explicit rather than matching on a
 *      display string; `sections` carries the two sub-headings the design DOES
 *      author (`501:223`, `501:232`), whose bodies are lorem.
 *   4. `HelpCrumb` is declared here rather than imported as `NavLink` from
 *      `src/content/navigation.ts`. It is structurally identical, so any
 *      consumer typed against `NavLink` accepts it, and this module gains no
 *      dependency on a file another agent owns.
 */

/** A breadcrumb entry. Structurally identical to `NavLink` in navigation.ts. */
export interface HelpCrumb {
  label: string;
  href: string;
}

export interface HelpTopic {
  id: string;
  label: string;
  href: string;
  children?: readonly HelpTopic[];
  /**
   * The design draws a disclosure chevron on this row - `500:1747` ("Getting
   * started with Azza", `500:1749`) and `500:1751` ("Products", `500:1753`).
   *
   * It is separate from `children` on purpose: "Products" carries the chevron
   * in BOTH frames and yet no child is ever authored for it. Encoding the
   * chevron as "has children" would silently drop it; encoding it here keeps
   * the affordance the design draws and leaves the missing content visible.
   */
  expandable?: boolean;
}

export interface HelpArticleSection {
  id: string;
  /** Verbatim from the design. Only the BODY beneath it is placeholder. */
  heading: string;
}

export interface HelpArticle {
  /** The `HELP_TOPICS` leaf this article belongs to. */
  topicId: string;
  title: string;
  breadcrumb: readonly HelpCrumb[];
  /**
   * The visible placeholder that stands in for the source file's lorem body.
   * D-027 item 2 - not article copy, and deliberately not written as if it were.
   */
  body: string;
  sections: readonly HelpArticleSection[];
}

export interface HelpResource {
  id: string;
  /** The `HELP_TOPICS` leaf this card opens. */
  topicId: string;
  title: string;
  body: string;
  /** Absent for all four - the source icon frames are empty (D-023). */
  icon?: IconName;
  href: string;
}

export interface HelpCommunityLink {
  id: string;
  label: string;
  /** `500:1805` / `500:1810` / `500:1815`. */
  description: string;
  icon: IconName;
  /** Absent for all three - no destination is authored in the design. */
  href?: string;
}

/** The id an open article's region carries, so `HelpTopic.href` resolves. */
export function helpArticleDomId(topicId: string): string {
  return `help-article-${topicId}`;
}

/* -------------------------------------------------------------------------
 * The sidebar tree - `500:1738` (closed) / `500:2307` (opened)
 *
 * Three top-level blocks, matching the three labels the design draws at a
 * uniform 40px pitch: "Introduction" (`500:1744`, a bare label with nothing
 * under it), "Azza" (`500:1746`) and "Support" (`500:1760`).
 *
 * "Introduction" having no items is the design, not an omission here - the
 * label sits between the search field and the "Azza" group as a sibling of
 * both, at the same gap.
 * ---------------------------------------------------------------------- */

export const HELP_TOPICS: readonly HelpTopic[] = [
  {
    id: "introduction",
    label: "Introduction",
    href: "#help-introduction",
  },
  {
    id: "azza",
    label: "Azza",
    href: "#help-azza",
    children: [
      {
        id: "getting-started-with-azza",
        label: "Getting started with Azza",
        href: `#${helpArticleDomId("getting-started-with-azza")}`,
        expandable: true,
        // `501:207` and `501:212`, revealed only in the opened state.
        children: [
          {
            id: "create-account",
            label: "Create account",
            href: "#help-create-account",
          },
          {
            id: "complete-your-kyc",
            label: "Complete your KYC",
            href: "#help-complete-your-kyc",
          },
        ],
      },
      {
        // `500:1751` draws a chevron - so it is expandable - but the design
        // authors no children for it in either state. Reproduced faithfully:
        // the chevron ships, the row has nothing to expand. Recorded as a
        // design gap rather than silently dropping the chevron or inventing
        // sub-topics.
        id: "products",
        label: "Products",
        href: "#help-products",
        expandable: true,
      },
      {
        id: "fee-structure",
        label: "Fee structure",
        href: "#help-fee-structure",
      },
      {
        id: "faqs",
        label: "FAQs",
        href: "#help-faqs",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    href: "#help-support",
    children: [
      {
        id: "send-feedback",
        label: "Send feedback",
        href: "#help-send-feedback",
      },
      {
        id: "report-an-issue",
        label: "Report an issue",
        href: "#help-report-an-issue",
      },
    ],
  },
];

/* -------------------------------------------------------------------------
 * The hub - `500:1766`
 *
 * NOTE, verbatim transcription: all four cards carry the SAME body string
 * (`500:1776`, `500:1782`, `500:1789`, `500:1795` are byte-identical). Three of
 * them describe account creation while sitting under "Products", "Fee
 * Structure" and "FAQs". That is a source-file defect and it ships as designed.
 * ---------------------------------------------------------------------- */

const HELP_RESOURCE_BODY =
  "Understand how to create an account with Azza, deposit money (stablecoins or fiat), transfer, etc.";

export const HELP_RESOURCES: readonly HelpResource[] = [
  {
    id: "get-started-with-azza",
    topicId: "getting-started-with-azza",
    title: "Get Started With Azza",
    body: HELP_RESOURCE_BODY,
    href: `#${helpArticleDomId("getting-started-with-azza")}`,
  },
  {
    id: "products",
    topicId: "products",
    title: "Products",
    body: HELP_RESOURCE_BODY,
    href: "#help-products",
  },
  {
    id: "fee-structure",
    topicId: "fee-structure",
    title: "Fee Structure",
    body: HELP_RESOURCE_BODY,
    href: "#help-fee-structure",
  },
  {
    id: "faqs",
    topicId: "faqs",
    title: "FAQs",
    body: HELP_RESOURCE_BODY,
    href: "#help-faqs",
  },
];

export const HELP_HUB_HEADING = "Help & Support";
export const HELP_HUB_STANDFIRST =
  "All resources needed to give you the best experience using Azza.";

export const HELP_COMMUNITY_HEADING = "Community";
/** `500:1799` repeats `500:1769` exactly. Transcribed, not deduplicated. */
export const HELP_COMMUNITY_STANDFIRST = HELP_HUB_STANDFIRST;

/**
 * `500:1800`. Help's social set is X / Instagram / WhatsApp, which differs from
 * the nav dropdown's (X / Instagram / YouTube) and the blog share row's
 * (X / Instagram / TikTok). D-037: each surface ships its own set. Do not
 * reconcile this list against another surface's.
 *
 * Verbatim transcription note: all three descriptions read "Follow us on X ..."
 * (`500:1805`, `500:1810`, `500:1815` are byte-identical), so the Instagram and
 * WhatsApp rows describe X. Source-file defect; ships as designed.
 */
const HELP_COMMUNITY_DESCRIPTION =
  "Follow us on X to get the latest news and updates.";

export const HELP_COMMUNITY: readonly HelpCommunityLink[] = [
  {
    id: "x",
    label: "X (Twitter)",
    description: HELP_COMMUNITY_DESCRIPTION,
    icon: "social-x",
  },
  {
    id: "instagram",
    label: "Instagram",
    description: HELP_COMMUNITY_DESCRIPTION,
    icon: "social-instagram",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: HELP_COMMUNITY_DESCRIPTION,
    icon: "social-whatsapp",
  },
];

/* -------------------------------------------------------------------------
 * The open state - `500:2334`
 *
 * ONE article exists in the design. `500:2368`, `501:219`, `501:220`, `501:224`,
 * `501:225`, `501:233` and `501:234` are lorem ipsum; the two sub-headings
 * `501:223` and `501:232` are real copy and are transcribed.
 *
 * D-027 item 2 and this agent's acceptance criterion 12: build the full
 * structure, mark the body an explicit visible placeholder, invent nothing.
 * ---------------------------------------------------------------------- */

/**
 * The stand-in for every lorem block. Deliberately written as an interface
 * notice rather than as prose, so it can never be mistaken for article copy by
 * a reader, a crawler or a later agent.
 */
export const HELP_ARTICLE_BODY_PLACEHOLDER =
  "Copy for this section is not written yet. The source design uses placeholder text here.";

export const HELP_ARTICLES: readonly HelpArticle[] = [
  {
    topicId: "getting-started-with-azza",
    title: "Getting started with Azza",
    breadcrumb: [
      { label: "Help & Support", href: "/help" },
      {
        label: "Getting started with Azza",
        href: `#${helpArticleDomId("getting-started-with-azza")}`,
      },
    ],
    body: HELP_ARTICLE_BODY_PLACEHOLDER,
    sections: [
      { id: "create-account", heading: "Create account" },
      { id: "hitches-while-creating-one", heading: "Hitches while creating one?" },
    ],
  },
];

/** The single authored article, for a route that wants to land on the open state. */
export const HELP_ARTICLE: HelpArticle = HELP_ARTICLES[0];

export function getHelpArticle(
  topicId: string | null | undefined,
): HelpArticle | undefined {
  if (!topicId) return undefined;
  return HELP_ARTICLES.find((article) => article.topicId === topicId);
}

/**
 * Whether a topic has an article behind it.
 *
 * Exactly one topic does. The sidebar rows and hub cards for the other six are
 * rendered exactly as designed but NOT made interactive: the design authors no
 * destination for them, and fabricating six article shells would look like real
 * structure while being entirely invented. Same reasoning as D-023's empty icon
 * slots - an obviously inert element is easier to spot and fix later than a
 * plausible fake.
 */
export function hasHelpArticle(topicId: string): boolean {
  return HELP_ARTICLES.some((article) => article.topicId === topicId);
}

/** The sidebar search field. `500:1739` / `500:2308`. */
export const HELP_SEARCH_LABEL = "Search help & support";
export const HELP_SEARCH_PLACEHOLDER = "Search help & support";

/** The `< lg` sidebar disclosure trigger (responsive.md S7.6). Not a Figma string. */
export const HELP_BROWSE_TOPICS_LABEL = "Browse topics";
