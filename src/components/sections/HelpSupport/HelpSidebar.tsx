import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { Disclosure, Icon, SearchField } from "@/components/ui";
import { cn } from "@/lib/cn";

import {
  HELP_BROWSE_TOPICS_LABEL,
  HELP_SEARCH_CLEAR_LABEL,
  HELP_SEARCH_EMPTY,
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
 * Row geometry - responsive.md S6.2, measured against `500:1738`.
 *
 * The design's rows are 22px tall on a 42px pitch (`500:1747` at y=39,
 * `500:1751` at y=81, `500:1755` at y=123, `500:1757` at y=165), which is under
 * the touch floor. `py-2.5` around a 22px line gives a 42px target; `min-h-12`
 * lifts it to 48 below `lg`, which is the pitch responsive.md asks for there.
 *
 * `-my-2.5` IS NOT COSMETIC. Without it that 10px of padding is silently
 * subtracted from every gap declared around the row, and the file has to write
 * `gap-2.5`/`gap-7.5` (10/30) to render the designed 20/40 - values that
 * layout.md S10.3 assertion 3 puts off-scale and assertion 4 bans by name, and
 * which make the sidebar unauditable: the declared number and the measured
 * number disagree everywhere. Cancelling the padding out of the margin box
 * restores the row to its designed 22px in layout while leaving the 42px hit
 * area intact, so every surrounding gap can be declared at its true value:
 * `gap-5` (20) between rows and after a group label, `gap-10` (40) between
 * groups and under the search field. Same rendered pitch, honest declarations.
 *
 * Each `<li>` is a flex item and therefore an independent formatting context,
 * so the negative margins cannot collapse out through the list.
 *
 * responsive.md's own wording - "Row -> 44; pitch 42 -> 48 at < lg" - cannot
 * hold at `lg`+: a 44px row does not fit a 42px pitch. 42 is the closest value
 * that keeps the designed rhythm and still clears WCAG 2.5.8's 24px minimum.
 * Recorded in this agent's `findings`.
 */
const ROW =
  "flex min-h-12 w-full items-center justify-between gap-2 py-2.5 -my-2.5 lg:min-h-0";

/*
 * THE NO-JS COUNTERPART. Same shape as `layout.tsx`'s `.reveal` rescue,
 * `TopNav.tsx`'s nav fallback and `CardDeck.tsx`'s deck rescue: a stylesheet
 * that only a browser with scripting DISABLED ever applies.
 *
 * WHAT IT RESCUES. `browseOpen` starts `false` and, with no script, can never
 * become anything else. The collapsed panel below carries `lg:grid-rows-[1fr]`
 * and `lg:visible lg:opacity-100` - both escapes fire at >= 1024 and NEITHER
 * fires below it. So on a phone with scripting off the entire topic tree is
 * `grid-template-rows: 0px` + `visibility: hidden`, and the "Browse topics"
 * button that would reveal it is a state setter that never runs. Measured at
 * 390 x 900, scripting off: panel height 0, inner `visibility: hidden`,
 * `opacity: 0`. At 1440 the same page looks fine, which is why this hid.
 *
 * A phone is this product's declared primary device, so that is the whole of
 * `/help`'s in-page navigation gone on the device it was built for.
 *
 * WHAT IT DOES.
 *   panel    forced open at every width. There is no disclosure without a
 *            script, so the tree is simply the page.
 *   inner    visible and opaque - the two properties the collapsed state uses.
 *   tree     `pt-10` zeroed. That 40px exists to separate the tree from the
 *            trigger; with the trigger gone it would double the sidebar's own
 *            40px gap under the search field.
 *   trigger  hidden. Its entire behaviour is a state setter, exactly as
 *            `TopNav.tsx` records for its own menu button. A control that
 *            visibly does nothing is worse than no control.
 *
 * Written as a string through `dangerouslySetInnerHTML` because once scripting
 * is ENABLED the browser parses <noscript> content as raw text, so hydrating
 * real element children against that text node is a mismatch (the hazard
 * `TopNav.tsx` documents). Every selector is a `[data-help-topics-*]`
 * attribute, so nothing outside this component is reachable. `!important`
 * beats the utilities it overrides for the reason `layout.tsx` records:
 * important always wins over normal, whatever the cascade layer.
 */
const NO_JS_STYLE =
  "<style>" +
  "[data-help-topics-panel]{grid-template-rows:1fr!important}" +
  "[data-help-topics-inner]{visibility:visible!important;opacity:1!important}" +
  "[data-help-topics-tree]{padding-top:0!important}" +
  "[data-help-topics-trigger]{display:none!important}" +
  "</style>";

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

/**
 * Depth-first search filter over the topic tree.
 *
 * A topic survives if its own label matches - in which case its whole subtree
 * comes with it, because the user asked for that branch by name - or if any
 * descendant matches, in which case only the matching descendants survive.
 * Matching a third-level label therefore surfaces the second-level row that
 * owns it, which is the row the reader can actually open.
 */
function filterTopic(topic: HelpTopic, needle: string): HelpTopic | null {
  if (topic.label.toLowerCase().includes(needle)) return topic;

  const children = (topic.children ?? [])
    .map((child) => filterTopic(child, needle))
    .filter((child): child is HelpTopic => child !== null);

  return children.length > 0 ? { ...topic, children } : null;
}

/**
 * What the result count announces: the rows a sighted user can see at rest.
 *
 * A group with children contributes its rows; a group with none ("Introduction",
 * `500:1744`) is itself a row. Third-level topics sit inside a collapsed
 * disclosure and are deliberately NOT counted - announcing a number larger than
 * the visible list is a worse failure than announcing nothing.
 */
function countRows(groups: readonly HelpTopic[]): number {
  return groups.reduce(
    (total, group) => total + (group.children?.length ?? 1),
    0,
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
              /*
               * NO `aria-current="page"`. responsive.md S7.6 asks for it, but it
               * was written for a tree of links; D-001 made these disclosure
               * triggers, and this one opens a panel inside the route it is
               * already on. `page` names the current page in a set of pages, so
               * on a control that never navigates it is a false statement about
               * what pressing it does. `aria-expanded` - which `triggerProps`
               * already carries - is the accurate one, and the 90deg chevron is
               * its non-colour visual twin.
               */
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
                  {/*
                   * `pt-5` is the 20px that separates the parent row from the
                   * first child row; the rows themselves sit on the same
                   * `gap-5` as every other list here. 20 + 22 + 20 + 22 = 84,
                   * which is exactly the +84 layout.md S4.10 measures on
                   * `500:1745` -> `500:2314` when this panel opens.
                   */}
                  {/* `role="list"` - same preflight/WebKit reason as the group
                      list in `TopicGroup` below. */}
                  <ul role="list" className="flex w-full flex-col gap-5 pt-5">
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
    /* `500:1745` / `500:1759` - V, gap 20 between the label and the rows. */
    <div className="flex w-full flex-col gap-5">
      <p id={labelId} className="text-sm-bold text-fg-primary">
        {group.label}
      </p>

      {children.length > 0 ? (
        /* Rows are 22 tall on a 42 pitch, so the declared gap is the 20 the
           design draws - the row's touch padding is cancelled by `-my-2.5`. */
        /*
         * `role="list"` IS LOAD-BEARING HERE, not a nicety. Tailwind's preflight
         * sets `list-style: none`, which makes WebKit drop the implicit `list`
         * role - and a <ul> stripped of that role maps to `generic`, which
         * PROHIBITS an accessible name. The `aria-labelledby` would then be both
         * inert and an axe `aria-prohibited-attr` violation, exactly as
         * Disclosure.tsx records for a bare `aria-labelledby` on a <div>. The
         * <p> above is deliberately not a heading, so this label is the only
         * thing naming the group: the two ship together or not at all.
         */
        <ul
          role="list"
          aria-labelledby={labelId}
          className="flex w-full flex-col gap-5"
        >
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
 * SEARCH FILTERS THIS TREE, and says how many rows are left.
 *
 * It previously rendered a field labelled "Search help & support" with no
 * handler, no `<form>` and no state: a control whose accessible name states a
 * function it does not perform, which is worse than no control. It now filters
 * the topic tree and announces the count through an `sr-only role="status"`,
 * the same shape `/blog` already uses.
 *
 * `SearchField` is uncontrolled by contract - components.md S4.11 gives it a
 * `defaultValue` and no change handler - so the query is read the way `/blog`
 * reads it: the native `input` event bubbles, React propagates `onInput`
 * through the tree, and the wrapper hears every keystroke, the browser's own
 * clear (x) and paste, without the shared primitive changing at all. Clearing
 * writes back through a ref for the same reason.
 *
 * SCOPE. The field sits inside `<nav aria-label="Help topics">` and filters
 * that nav - what the DOM says it does is what it does. It deliberately does
 * NOT reach across into the content column: the hub's four cards are the same
 * four topics, and having a sidebar control silently empty the main region -
 * including while an article is open - would be a surprise, not a feature.
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
  const [query, setQuery] = useState("");
  const [browseOpen, setBrowseOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const needle = query.trim().toLowerCase();

  const visibleTopics = useMemo(() => {
    if (!needle) return topics;

    return topics
      .map((group) => filterTopic(group, needle))
      .filter((group): group is HelpTopic => group !== null);
  }, [needle, topics]);

  const handleSearchInput = useCallback((event: FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!(target instanceof HTMLInputElement)) return;

    setQuery(target.value);

    /*
     * Below `lg` the tree lives behind "Browse topics". Filtering a list the
     * reader cannot see is the same defect in a new shape, so a non-empty query
     * opens the panel. It stays a normal disclosure otherwise - the trigger can
     * still close it, and clearing the field does not force it back open.
     */
    if (target.value.trim()) setBrowseOpen(true);
  }, []);

  /*
   * The field is uncontrolled, so resetting React state alone would leave the
   * typed text sitting in the input while the tree showed everything. Focus
   * returns to the field because the control that took it is about to be
   * removed from the DOM.
   */
  const clearSearch = useCallback(() => {
    const input =
      searchRef.current?.querySelector<HTMLInputElement>(
        'input[type="search"]',
      ) ?? null;

    if (input) {
      input.value = "";
      input.focus();
    }

    setQuery("");
  }, []);

  const count = countRows(visibleTopics);
  const empty = count === 0;

  return (
    <nav
      aria-label="Help topics"
      className={cn(
        // `500:1738` - V, gap 40: search bottom (58) to "Introduction" (98).
        "flex w-full min-w-0 flex-col gap-10",
        "lg:w-75 lg:shrink-0",
        // responsive.md S7.6: sticky rail at `lg`+. `Section` must not carry
        // `clip` anywhere above this - `overflow: hidden` on an ancestor makes
        // a sticky descendant silently inert.
        "lg:sticky lg:top-[calc(var(--height-nav)+1.5rem)]",
        "lg:max-h-[calc(100dvh-var(--height-nav)-3rem)] lg:overflow-y-auto",
        className,
      )}
    >
      {/*
       * The `hidden` ATTRIBUTE on the <noscript> itself. With scripting
       * disabled a <noscript> renders as a normal inline box, and this <nav> is
       * `flex flex-col gap-10` - so an unstyled one would become a flex item
       * and open a 40px hole above the search field on exactly the browsers
       * this block exists to serve.
       *
       * The attribute rather than the `hidden` utility, inverting the caveat
       * `TopNav.tsx` records: preflight pins the attribute with `!important`,
       * which is a problem only when something must later reveal the element.
       * Nothing ever reveals this one, so unconditional wins is the property we
       * want. `display: none` does not stop the <style> inside from applying -
       * a stylesheet's effect is independent of its own box.
       */}
      <noscript hidden dangerouslySetInnerHTML={{ __html: NO_JS_STYLE }} />

      <div ref={searchRef} onInput={handleSearchInput} className="w-full">
        <SearchField
          label={HELP_SEARCH_LABEL}
          placeholder={HELP_SEARCH_PLACEHOLDER}
          name="help"
          width="full"
        />
      </div>

      {/*
       * `sr-only` is `position: absolute`, so this is not a flex item and costs
       * the sidebar no gap. It re-announces on every keystroke, which is what a
       * filtered list owes a screen-reader user who cannot see it shrink.
       *
       * The empty wording differs from the visible empty state's on purpose:
       * both are in the reading order, and identical strings would be spoken
       * twice in a row as if the second were new information.
       */}
      <p role="status" className="sr-only">
        {empty
          ? "No topics match the current search."
          : `${count} ${count === 1 ? "topic" : "topics"} shown.`}
      </p>

      <Disclosure open={browseOpen} onOpenChange={setBrowseOpen}>
        {({ open, triggerProps, panelProps }) => (
          /*
           * The trigger and its panel are ONE flex item of the sidebar, not
           * two. As siblings of the search field they each took a 40px gap, and
           * below `lg` the collapsed panel is zero-height - so a closed sidebar
           * carried 40px of dead space after the button. Grouping them puts the
           * gap only where there is something to separate; the spacing the open
           * panel needs is `pt-10` inside it, which collapses with the panel.
           */
          <div className="flex w-full min-w-0 flex-col">
            <button
              {...triggerProps}
              data-help-topics-trigger=""
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
              data-help-topics-panel=""
              hidden={undefined}
              className={cn(
                "grid transition-[grid-template-rows]",
                "duration-(--motion-base) ease-in-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr] lg:grid-rows-[1fr]",
              )}
            >
              <div
                data-help-topics-inner=""
                className={cn(
                  "min-h-0 overflow-hidden",
                  "transition-opacity duration-(--motion-fast)",
                  open
                    ? "opacity-100 ease-out delay-[40ms]"
                    : "invisible opacity-0 ease-in lg:visible lg:opacity-100",
                )}
              >
                {/* Groups sit 40 apart - `500:1744` -> `500:1745` -> `500:1759`
                    measure 117 -> 157 and 344 -> 384. `pt-10` separates the
                    tree from the "Browse topics" trigger below `lg` only; at
                    `lg`+ the trigger is not rendered and the sidebar's own gap
                    does that job. */}
                <div
                  data-help-topics-tree=""
                  className="flex w-full flex-col gap-10 pt-10 lg:pt-0"
                >
                  {empty ? (
                    /* The design has no empty state - it cannot, it is one
                       static composition. This is the minimum that is still
                       useful: what happened, and the control that undoes it. */
                    <div className="flex w-full flex-col items-start gap-3">
                      <p className="text-sm-regular text-fg-muted">
                        {HELP_SEARCH_EMPTY}
                      </p>
                      <button
                        type="button"
                        onClick={clearSearch}
                        className={cn(
                          "rounded-sm text-sm-bold text-fg-brand",
                          "transition-[color] duration-(--motion-fast) ease-out",
                          "hoverable:text-link-hover focus-visible:text-link-hover",
                        )}
                      >
                        {HELP_SEARCH_CLEAR_LABEL}
                      </button>
                    </div>
                  ) : (
                    visibleTopics.map((group) => (
                      <TopicGroup
                        key={group.id}
                        group={group}
                        activeTopicId={activeTopicId}
                        onSelectTopic={onSelectTopic}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Disclosure>
    </nav>
  );
}
