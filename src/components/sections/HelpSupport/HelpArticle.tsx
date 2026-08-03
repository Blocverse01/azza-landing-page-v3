import type { Ref } from "react";

import { VisuallyHidden } from "@/components/ui";
import { cn } from "@/lib/cn";

import { helpArticleDomId, type HelpArticle as HelpArticleData } from "@/content/help";

export interface HelpArticleProps {
  article: HelpArticleData;
  /** Focus target for the open-state transition. Owned by `HelpSupport`. */
  containerRef?: Ref<HTMLElement | null>;
  className?: string;
}

/**
 * The open-state article - `500:2365`.
 *
 * HEADING LEVELS. The design gives the article no visible title: the only place
 * its name appears is the last breadcrumb crumb (`501:216`). A route still owes
 * an `<h1>`, so the title is rendered visually hidden and the two authored
 * sub-heads (`501:223`, `501:232`) sit under it as `<h2>`.
 *
 * typography.md S4.1 labels those two nodes "h3". That label assumes an
 * intermediate `<h2>` which does not exist in the design - taking it literally
 * would skip a level. The TOKEN it names (`text-lg-h3`) is used exactly as
 * specified; only the element differs. Recorded in this agent's `findings`.
 *
 * The `<article>` is the focus target for the hub -> article transition. It is
 * `tabIndex={-1}` so it can receive programmatic focus without joining the tab
 * order, and `aria-labelledby` points at the hidden title so the region
 * announces with a name. Programmatic focus on a non-interactive element does
 * not match `:focus-visible`, so no outline is painted - the announcement is
 * the feedback.
 *
 * THERE IS NO BODY COPY, AND NOTHING STANDS IN FOR IT.
 *
 * Every body block the design draws (`500:2368`, `501:219`, `501:220`,
 * `501:224`, `501:225`, `501:233`, `501:234`) is lorem ipsum. This component
 * used to render a dashed-bordered panel reading "Copy for this section is not
 * written yet. The source design uses placeholder text here." three times -
 * build-team scaffolding served to the public on a live route. Inventing help
 * copy is out of bounds and a note about the gap is worse than the gap, so the
 * paragraph slot renders nothing at all. What survives is what the design
 * actually authors: the two sub-headings.
 *
 * They are rendered as bare `<h2>`s rather than as `<section aria-labelledby>`
 * regions. A `<section>` with an accessible name is a `region` landmark, and a
 * landmark whose only content is its own heading is noise a screen-reader user
 * has to step through for no return. When real copy arrives, the wrapper comes
 * back with it.
 */
export function HelpArticle({
  article,
  containerRef,
  className,
}: HelpArticleProps) {
  const domId = helpArticleDomId(article.topicId);
  const titleId = `${domId}-title`;

  return (
    <article
      ref={containerRef}
      id={domId}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={cn("flex w-full flex-col gap-10", className)}
    >
      <VisuallyHidden as="div">
        <h1 id={titleId}>{article.title}</h1>
      </VisuallyHidden>

      {/* `501:221`, the intro block, is three lorem paragraphs in the source
          and therefore has no counterpart here. */}

      {article.sections.map((section) => (
        <h2
          key={section.id}
          id={`${domId}-${section.id}`}
          className="text-lg-h3 text-fg-primary"
        >
          {section.heading}
        </h2>
      ))}
    </article>
  );
}
