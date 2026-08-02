import { Card, Reveal } from "@/components/ui";
import { cn } from "@/lib/cn";

import { hasHelpArticle, type HelpResource } from "@/content/help";

export interface HelpResourceGridProps {
  /** `500:1770` + `500:1783` - two rows of two. */
  resources: readonly HelpResource[];
  /** Opens a topic's article. Only called for topics that have one. */
  onSelectTopic: (topicId: string) => void;
  className?: string;
}

/**
 * The hub's 2 x 2 resource grid - `500:1770` / `500:1783`.
 *
 * GRID GEOMETRY. The design is two auto-layout ROWS (H, gap 28) inside a column
 * (V, gap 40), so the horizontal gutter and the vertical gutter are different
 * numbers: 28 across, 40 down. A single `gap-7` would silently equalise them.
 * responsive.md S7.6 steps the horizontal gutter 28 -> 24 at `md`.
 *
 * CONTAINER QUERY #3 (responsive.md S5). Whether the 40px icon slot sits above
 * the title or beside it follows the CARD's width, not the viewport's: the same
 * card renders at 420 in the desktop 2-up, at 332 in the `md` 2-up and at full
 * width when stacked, and those ranges overlap on the viewport axis. The query
 * is declared on the card and read by its descendant - never by the element
 * that declares it.
 *
 * THE ICON SLOT IS EMPTY, ON PURPOSE (D-023). `500:1773`, `500:1779`,
 * `500:1786` and `500:1792` are 40x40 frames with zero children. Choosing four
 * glyphs would be deciding what these four support categories mean, which is
 * not an implementer's call. The slot reserves its exact footprint - fill,
 * radius and all, as the design draws it - so real icons drop in with no
 * reflow.
 *
 * INTERACTIVITY IS CONDITIONAL. Exactly one of the four topics has an article
 * in the source file. The other three cards render identically at rest and are
 * not made interactive, because the design authors no destination for them and
 * fabricating three article shells would look like real structure. Same
 * reasoning as the icon slots: an inert element is easier to spot than a
 * plausible fake.
 */
export function HelpResourceGrid({
  resources,
  onSelectTopic,
  className,
}: HelpResourceGridProps) {
  return (
    <ul
      className={cn(
        "grid w-full grid-cols-1 gap-x-6 gap-y-6",
        "md:grid-cols-2 md:gap-y-10 xl:gap-x-7",
        className,
      )}
    >
      {resources.map((resource, index) => {
        const openable = hasHelpArticle(resource.topicId);

        return (
          <Reveal as="li" index={index} key={resource.id} className="flex">
            <Card
              surface="raised"
              radius="xl"
              interactive={openable}
              className={cn(
                "@container/help-card w-full overflow-clip px-5 py-6",
                openable &&
                  "has-[button:focus-visible]:-translate-y-1 has-[button:focus-visible]:shadow-hover-lift",
              )}
            >
              <div
                className={cn(
                  "flex gap-3",
                  "@min-[17rem]/help-card:flex-col @min-[17rem]/help-card:gap-5",
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-10 shrink-0 rounded-sm bg-surface-placeholder-alt"
                />

                <div className="flex min-w-0 flex-col gap-3">
                  <h2 className="text-md-semibold text-fg-primary">
                    {openable ? (
                      <button
                        type="button"
                        onClick={() => onSelectTopic(resource.topicId)}
                        className="rounded-sm text-left after:absolute after:inset-0 after:content-['']"
                      >
                        {resource.title}
                      </button>
                    ) : (
                      resource.title
                    )}
                  </h2>
                  <p className="text-sm-body text-fg-muted">{resource.body}</p>
                </div>
              </div>
            </Card>
          </Reveal>
        );
      })}
    </ul>
  );
}
