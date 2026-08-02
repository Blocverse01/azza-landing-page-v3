import type { Ref } from "react";

import { Prose, VisuallyHidden } from "@/components/ui";
import { cn } from "@/lib/cn";

import { helpArticleDomId, type HelpArticle as HelpArticleData } from "@/content/help";

export interface HelpArticleProps {
  article: HelpArticleData;
  /** Focus target for the open-state transition. Owned by `HelpSupport`. */
  containerRef?: Ref<HTMLElement | null>;
  className?: string;
}

/**
 * A body block whose copy does not exist.
 *
 * D-027 item 2: `500:2368`, `501:219`, `501:220`, `501:224`, `501:225`,
 * `501:233` and `501:234` are lorem ipsum in the source file, so the open state
 * has nothing to transcribe. The structure is built in full and the copy slot
 * is marked in the interface, visibly - NOT filled with invented prose and NOT
 * left as lorem, either of which would read as finished content.
 *
 * The dashed rule and the muted ink are the whole treatment. It is meant to be
 * obviously unfinished at a glance and unmistakable in a Phase 3 capture.
 */
function PendingCopy({ children }: { children: string }) {
  return (
    <Prose step="md-prose" gap={20} measure={false}>
      <p
        className={cn(
          // `line-divider`, not `line-placeholder`: the latter resolves to the
          // exact same value as `surface-placeholder`, so the dashes vanished
          // into the fill. Caught in a browser, not by reading token names.
          // The fill is the palest surface so the dash is what carries the
          // signal - a solid grey panel could be mistaken for a designed one.
          "rounded-xl border border-dashed border-line-divider",
          "bg-surface-subtle px-5 py-4 text-fg-muted",
        )}
      >
        {children}
      </p>
    </Prose>
  );
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

      {/* `501:221` - the intro block, three lorem paragraphs in the source. */}
      <PendingCopy>{article.body}</PendingCopy>

      {article.sections.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`${domId}-${section.id}`}
          className="flex w-full flex-col gap-8"
        >
          <h2
            id={`${domId}-${section.id}`}
            className="text-lg-h3 text-fg-primary"
          >
            {section.heading}
          </h2>
          <PendingCopy>{article.body}</PendingCopy>
        </section>
      ))}
    </article>
  );
}
