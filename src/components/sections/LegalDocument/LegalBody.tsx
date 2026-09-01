import { Icon, VisuallyHidden } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LegalBlock, LegalSection } from "@/content/legal";

import { LegalText } from "./LegalText";

/*
 * The clause body.
 *
 * THREE LEVELS, THREE TREATMENTS. The teardown's sharpest complaint about
 * interfere.com/legal/* was that its heading levels collapse: page title,
 * section and subsection all render at 18px/500, so a reader cannot tell a
 * top-level clause from a nested one and neither can the rail. Here the ramp is
 * explicit and drawn from the existing scale -
 *
 *   page title   text-2xl        32/500
 *   section      text-lg         24/500
 *   subsection   text-md-semibold 20/600
 *   body         text-base-answer 18/1.44/400
 *
 * - so every step is a real change of size, not of weight alone.
 *
 * THE SECTION CARRIES THE ID, NOT THE HEADING. Two things depend on it. The
 * anchor target is then the whole clause rather than a zero-height heading, so
 * `:target` and the browser's own scroll land on the clause; and `LegalToc`
 * hit-tests these same elements to decide which clauses are on screen, which
 * only works if the element spans heading-to-end-of-clause.
 */

/** Paragraph and list rhythm, one step of the 4px scale apart. */
const BLOCK_GAP = "flex flex-col gap-6";

/*
 * THE BODY STEP, set here rather than through `Prose`.
 *
 * `Prose`'s `step` is a two-member union (`md-prose` | `2xl-prose`) and the
 * ui barrel's contract is explicit: do not widen a union. 18px prose is not in
 * it, so the step is re-declared on this subtree instead - which is a plain
 * inheritance override on a DIFFERENT element, not a class fighting `Prose`'s
 * own `text-md-prose` on the same one, so `cn`'s no-merge rule is not in play.
 * `Prose` still owns what it is good for here: the ink, the measure and the
 * inline-link treatment.
 *
 * `base-answer` is the only 18px step authored at Regular 400 with a reading
 * line-height (1.44), which is what a prose step has to be.
 */
const BODY_STEP = "text-base-answer";

function Blocks({ blocks, depth = 0 }: { blocks: readonly LegalBlock[]; depth?: number }) {
  return (
    <div className={BLOCK_GAP}>
      {blocks.map((block, i) => {
        if (block.kind === "p") {
          return (
            <p key={i}>
              <LegalText>{block.text}</LegalText>
            </p>
          );
        }

        if (block.kind === "list") {
          return (
            /*
             * `list-disc` with an inside-the-flow marker colour. The list sits
             * at the same measure as the prose and indents by one step; the
             * marker takes `fg.ghost` so it reads as structure rather than as
             * a word.
             */
            <ul key={i} className="marker:text-fg-ghost flex list-disc flex-col gap-3 ps-6">
              {block.items.map((item, j) => (
                <li key={j} className="ps-1">
                  <LegalText>{item}</LegalText>
                </li>
              ))}
            </ul>
          );
        }

        // A numbered subsection. Rendered as an <h3> because every one of them
        // sits under the section's <h2>; nesting deeper than this does not
        // occur in either document.
        return (
          <section key={i} className="flex flex-col gap-3">
            <h3 className="text-md-semibold text-fg-body flex gap-2">
              {block.number ? (
                <span className="text-fg-ghost shrink-0 tabular-nums">{block.number}</span>
              ) : null}
              <span>{block.heading}</span>
            </h3>
            <Blocks blocks={block.blocks} depth={depth + 1} />
          </section>
        );
      })}
    </div>
  );
}

export interface LegalBodyProps {
  sections: readonly LegalSection[];
}

export function LegalBody({ sections }: LegalBodyProps) {
  return (
    <div className={cn(BODY_STEP, "flex flex-col gap-14")}>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="flex scroll-mt-4 flex-col gap-5">
          <h2 className="text-fg-body group flex items-baseline gap-3 text-lg">
            <span className="text-fg-ghost shrink-0 tabular-nums">{section.number}</span>
            <span className="min-w-0">{section.heading}</span>

            {/*
             * THE ANCHOR AFFORDANCE - the other half of the teardown's finding.
             * Interfere gives every heading a slug and then reveals none of
             * them, so the deep links exist and are unreachable through the
             * interface. This is that link, hidden until the heading is hovered
             * or the control itself is focused.
             *
             * It is NOT hidden with `opacity-0` alone: an opacity-0 anchor is
             * still in the tab order and still announced, so a keyboard user
             * meets an invisible control on every one of 15 (or 20) headings.
             * `hoverable:` reveals it on pointer hover; `focus-visible:` brings
             * it back for the keyboard user who actually lands on it.
             *
             * THE `!` IS LOAD BEARING. This anchor is a descendant of `Prose`,
             * which styles `[&_a]` with `link.inline` and `underline` - a
             * descendant selector, so it outranks this element's own
             * `text-fg-ghost` on specificity and `cn` does not merge the two
             * away. Without the overrides the affordance renders as a blue,
             * underlined body link rather than a quiet chrome glyph; caught in
             * a browser, since it typechecks and lints clean either way. This
             * is the "caller overrules the component" case `cn`'s own note
             * reserves `!` for.
             */}
            <a
              href={`#${section.id}`}
              className={cn(
                "text-fg-ghost! shrink-0 self-center no-underline! opacity-0",
                "transition-[opacity,color] duration-(--motion-fast) ease-out",
                "fine-pointer:group-hover:opacity-100",
                "focus-visible:opacity-100",
                "hoverable:text-fg-body!",
                "focus-visible:text-fg-body!",
              )}
            >
              <Icon name="link" size="sm" />
              <VisuallyHidden>Link to “{section.heading}”</VisuallyHidden>
            </a>
          </h2>

          <Blocks blocks={section.blocks} />
        </section>
      ))}
    </div>
  );
}

export default LegalBody;
