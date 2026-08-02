import { Disclosure, Icon, SearchField } from "@/components/ui";
import { cn } from "@/lib/cn";

import {
  HELP_BROWSE_TOPICS_LABEL,
  HELP_SEARCH_LABEL,
  HELP_SEARCH_PLACEHOLDER,
  hasHelpArticle,
  type HelpTopic,
} from "@/content/help";

export interface HelpSidebarProps {
  topics: readonly HelpTopic[];
  /** The topic whose article is open, or null in the hub state. */
  activeTopicId: string | null;
  onSelectTopic: (topicId: string, open: boolean) => void;
  className?: string;
}

/*
 * Row geometry - responsive.md S6.2.
 *
 * The design's rows are 22px tall on a 42px pitch (`500:1748` and siblings),
 * which is under the touch floor. `py-2.5` around a 22px line gives a 42px
 * target on the SAME 42px pitch, so the desktop composition is unchanged while
 * the target grows; `min-h-12` lifts it to 48 below `lg`, which is the pitch
 * responsive.md asks for there.
 *
 * responsive.md's own wording - "Row -> 44; pitch 42 -> 48 at < lg" - cannot
 * hold at `lg`+: a 44px row does not fit a 42px pitch. 42 is the closest value
 * that keeps the designed rhythm and still clears WCAG 2.5.8's 24px minimum.
 * Recorded in this agent's `findings`.
 */
const ROW =
  "flex min-h-12 w-full items-center justify-between gap-2 py-2.5 lg:min-h-0";

/**
 * The disclosure chevron.
 *
 * The design uses two different glyphs - `right_regular` collapsed
 * (`500:1749`), `down_regular` expanded (`501:204`) - so the rotation is 90deg,
 * not the 180deg in components.md S10.5. Same property, same duration, same
 * easing; only the angle follows the design. Under `prefers-reduced-motion` the
 * global floor in theme.css collapses the duration to 0.01ms, which is Tier 2:
 * the state change still happens, it is simply immediate.
 */
function RowChevron({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center text-fg-secondary",
        "transition-transform duration-(--motion-base) ease-in-out",
        open ? "rotate-90" : "rotate-0",
      )}
    >
      <Icon name="chevron-right" size="sm" />
    </span>
  );
}

function TopicRow({
  topic,
  activeTopicId,
  onSelectTopic,
}: {
  topic: HelpTopic;
  activeTopicId: string | null;
  onSelectTopic: (topicId: string, open: boolean) => void;
}) {
  const openable = hasHelpArticle(topic.id);
  const children = topic.children ?? [];
  const showChevron = topic.expandable === true;

  /*
   * Rows without an article are rendered exactly as designed but are NOT
   * interactive - see the note on `hasHelpArticle`. `500:1751` ("Products")
   * keeps its chevron because the design draws one; it has nothing behind it
   * because the design authors no children for it. Reproduced rather than
   * quietly dropped, so the gap stays visible to the operator.
   */
  if (!openable) {
    return (
      <li>
        <div className={cn(ROW, "text-base text-fg-secondary")}>
          <span>{topic.label}</span>
          {showChevron ? <RowChevron open={false} /> : null}
        </div>
      </li>
    );
  }

  return (
    <li>
      <Disclosure
        open={activeTopicId === topic.id}
        onOpenChange={(next) => onSelectTopic(topic.id, next)}
      >
        {({ open, triggerProps, panelProps }) => (
          <>
            <button
              {...triggerProps}
              aria-current={open ? "page" : undefined}
              className={cn(
                ROW,
                "rounded-sm text-left text-base",
                /*
                 * `transition-[color]`, NOT `transition-colors`. Tailwind's
                 * `transition-colors` includes `outline-color`, and
                 * components.md S10.7 is explicit that the focus outline is
                 * never transitioned - a 160ms focus ring reads as lag during
                 * keyboard navigation. Caught by measuring the computed
                 * `outline-color` immediately after a Tab: it was still
                 * interpolating from `currentColor`.
                 */
                "transition-[color] duration-(--motion-fast) ease-out",
                open
                  ? "text-fg-brand"
                  : "text-fg-secondary hoverable:text-link-hover focus-visible:text-link-hover",
              )}
            >
              <span>{topic.label}</span>
              {showChevron ? <RowChevron open={open} /> : null}
            </button>

            {children.length > 0 ? (
              <div
                {...panelProps}
                /*
                 * D-030. `panelProps.hidden` computes to `display: none`, which
                 * cannot transition, so it is dropped - but dropping it alone
                 * leaves a 0fr row whose children stay in the tab order, which
                 * is the worse defect. `inert` removes the subtree from focus
                 * order and the a11y tree while leaving it animatable.
                 */
                hidden={undefined}
                inert={!open}
                className={cn(
                  "grid transition-[grid-template-rows]",
                  "duration-(--motion-base) ease-in-out",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div
                  className={cn(
                    "min-h-0 overflow-hidden",
                    "transition-opacity duration-(--motion-fast)",
                    // components.md S10.5: 40ms delay on open, 0 on close.
                    open ? "opacity-100 ease-out delay-[40ms]" : "opacity-0 ease-in",
                  )}
                >
                  <ul className="flex w-full flex-col">
                    {children.map((child) => (
                      <li key={child.id}>
                        <div className={cn(ROW, "text-base text-fg-secondary")}>
                          <span>{child.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </>
        )}
      </Disclosure>
    </li>
  );
}

function TopicGroup({
  group,
  activeTopicId,
  onSelectTopic,
}: {
  group: HelpTopic;
  activeTopicId: string | null;
  onSelectTopic: (topicId: string, open: boolean) => void;
}) {
  const labelId = `help-topic-group-${group.id}`;
  const children = group.children ?? [];

  return (
    <div className="flex w-full flex-col gap-2.5">
      <p
        id={labelId}
        className={cn(
          "text-sm-bold text-fg-primary",
          // "Introduction" (`500:1744`) is a bare label with no items under it -
          // a sibling of the two real groups at the same 40px pitch, not their
          // parent. Its own padding restores that pitch, which the groups get
          // from their last row's padding instead.
          children.length === 0 && "py-2.5",
        )}
      >
        {group.label}
      </p>

      {children.length > 0 ? (
        <ul aria-labelledby={labelId} className="flex w-full flex-col">
          {children.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              activeTopicId={activeTopicId}
              onSelectTopic={onSelectTopic}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * The help sidebar - `500:1738` (closed) / `500:2307` (opened).
 *
 * ONE DOM, TWO PRESENTATIONS. At `lg`+ this is the designed 300px sticky rail.
 * Below `lg` the tree collapses behind a "Browse topics" disclosure while the
 * search field stays visible above it, because search is the primary entry
 * point and must not be hidden behind a toggle (responsive.md S7.6).
 *
 * The breakpoint switch is pure CSS - no `matchMedia`, no hydration guess. The
 * collapsed panel uses `visibility` rather than `inert` precisely because
 * visibility can carry an `lg:` override and `inert` cannot: at `lg`+ the tree
 * must be visible and focusable no matter what the disclosure's state says.
 * Both mechanisms remove the subtree from the tab order, which is the property
 * D-030 actually requires.
 *
 * DOM ORDER. responsive.md S7.6 asks for both "sidebar before the content,
 * preserving reading order and skip-link semantics" and "directly under the
 * page title". Those are mutually exclusive, since the page title lives in the
 * content column. The DOM-order rule wins - it is the one with a stated reason
 * and the one that keeps keyboard order matching visual order. Recorded.
 */
export function HelpSidebar({
  topics,
  activeTopicId,
  onSelectTopic,
  className,
}: HelpSidebarProps) {
  return (
    <nav
      aria-label="Help topics"
      className={cn(
        "flex w-full min-w-0 flex-col gap-7.5",
        "lg:w-75 lg:shrink-0",
        // responsive.md S7.6: sticky rail at `lg`+. `Section` must not carry
        // `clip` anywhere above this - `overflow: hidden` on an ancestor makes
        // a sticky descendant silently inert.
        "lg:sticky lg:top-[calc(var(--height-nav)+1.5rem)]",
        "lg:max-h-[calc(100dvh-var(--height-nav)-3rem)] lg:overflow-y-auto",
        className,
      )}
    >
      <SearchField
        label={HELP_SEARCH_LABEL}
        placeholder={HELP_SEARCH_PLACEHOLDER}
        name="help"
        width="full"
      />

      <Disclosure>
        {({ open, triggerProps, panelProps }) => (
          <>
            <button
              {...triggerProps}
              className={cn(
                "flex h-14 w-full items-center justify-between gap-2 lg:hidden",
                "rounded-2xl border border-field-border bg-field-surface px-4",
                "text-base text-fg-primary",
                // Border only - see the note on the topic row above.
                "transition-[border-color] duration-(--motion-fast) ease-out",
                "hoverable:border-field-border-hover",
              )}
            >
              <span>{HELP_BROWSE_TOPICS_LABEL}</span>
              <RowChevron open={open} />
            </button>

            <div
              {...panelProps}
              hidden={undefined}
              className={cn(
                "grid transition-[grid-template-rows]",
                "duration-(--motion-base) ease-in-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr] lg:grid-rows-[1fr]",
              )}
            >
              <div
                className={cn(
                  "min-h-0 overflow-hidden",
                  "transition-opacity duration-(--motion-fast)",
                  open
                    ? "opacity-100 ease-out delay-[40ms]"
                    : "invisible opacity-0 ease-in lg:visible lg:opacity-100",
                )}
              >
                <div className="flex w-full flex-col gap-7.5">
                  {topics.map((group) => (
                    <TopicGroup
                      key={group.id}
                      group={group}
                      activeTopicId={activeTopicId}
                      onSelectTopic={onSelectTopic}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </nav>
  );
}
