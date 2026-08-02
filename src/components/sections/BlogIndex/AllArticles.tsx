"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  ArticleCard,
  Button,
  Reveal,
  SearchField,
  Section,
  type BlogPost,
} from "@/components/ui";
import { cn } from "@/lib/cn";

import {
  ArticleFilters,
  type CategoryFilter,
} from "./ArticleFilters";

const HEADING_ID = "all-articles-heading";

/**
 * responsive.md S7.4: at base only, show six cards and a "View More" button.
 * Nine cards at ~470px each is a 4,200px scroll on a 320px phone, and the
 * affordance already exists in the design (507:477). From `xs` up all nine
 * render, so the limit is expressed in CSS rather than in JS - there is no
 * viewport read, no hydration mismatch, and no flash of the wrong count.
 */
const INITIAL_VISIBLE = 6;

/**
 * The label token for this section's two `action.quiet` pills.
 *
 * `Button`'s `md` step is `text-sm-btn` (16 / 1.21 / -0.02em / 600), which is
 * correct for a button and is not to be widened - `sm/md/lg` are 14/16/16 Semi
 * Bold against their own design nodes, and every other `size="md"` caller on
 * the site depends on it. But 507:478, the "View More" label, is authored
 * `Inter Medium 20 / 1.3 / -0.6px` - i.e. exactly `text-md` (-0.6 / 20 =
 * -0.03em). It is a CTA pill drawn with a button's affordances, so the type
 * token belongs at the call site rather than in the ladder.
 *
 * The `!` is load-bearing, for the reason BlogHero.tsx:84 already documents:
 * `cn` joins and de-duplicates but does not resolve conflicts, so without it
 * `text-sm-btn` vs `text-md` would be settled by Tailwind's emission order
 * rather than by this file.
 *
 * `Button` is kept - and `Pill variant="cta"` is not substituted, despite
 * carrying this token already - because both controls here must be real
 * `<button>`s: each sits inside a wrapper that owns the click handler, and
 * `Pill` renders a `<span>` with no `as="button"`, which would leave the
 * control unreachable by keyboard.
 */
const PILL_LABEL = "text-md!";

export interface AllArticlesProps {
  /**
   * `readonly` where components.md S6 writes `BlogPost[]`. S7.1 declares
   * `BLOG_POSTS` as `readonly BlogPost[]`, and a readonly array is not
   * assignable to a mutable one - as written the two halves of the contract
   * cannot be composed, and the route that mounts this section would not
   * typecheck. Widening the parameter accepts both.
   */
  posts: readonly BlogPost[];
}

/**
 * `/blog` article grid - Figma 500:2197.
 *
 * Toolbar (500:2201) of search (500:2202) and category filters (500:2207), a
 * 3x3 grid of 360-wide cards (500:2213), and "View More" (507:477).
 *
 * WHY THIS IS A CLIENT COMPONENT: category filter state and the base-breakpoint
 * expand state (components.md S3). Search state is not named there because the
 * design cannot show it; it lives in the same component and adds no new client
 * entry point.
 *
 * THE FEATURED POST IS DROPPED HERE, not by the caller. `BlogHero` already
 * presents it, full width, immediately above. Filtering is idempotent, so a
 * route that passes the whole of `BLOG_POSTS` and one that passes a
 * pre-filtered array both render the design's nine cards.
 */
export function AllArticles({ posts }: AllArticlesProps) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const focusAfterExpand = useRef(false);

  const articles = useMemo(
    () => posts.filter((post) => !post.featured),
    [posts],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return articles.filter((post) => {
      if (category !== "All" && post.category !== category) return false;
      if (!needle) return true;

      return (
        post.title.toLowerCase().includes(needle) ||
        post.category.toLowerCase().includes(needle) ||
        (post.standfirst?.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [articles, category, query]);

  /*
   * `SearchField` is uncontrolled by contract - it takes `defaultValue` and
   * exposes no change handler, and components.md S4.11 forbids adding one. The
   * native `input` event bubbles, and React propagates `onInput` through the
   * component tree, so the wrapper hears every keystroke, the browser's own
   * clear (x) button, and paste, without the primitive changing at all.
   */
  const handleSearchInput = useCallback((event: FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!(target instanceof HTMLInputElement)) return;
    setQuery(target.value);
    setExpanded(false);
  }, []);

  const handleCategoryChange = useCallback((next: CategoryFilter) => {
    setCategory(next);
    setExpanded(false);
  }, []);

  const handleViewMore = useCallback(() => {
    focusAfterExpand.current = true;
    setExpanded(true);
  }, []);

  /*
   * Same reason the field is read through the DOM: it is uncontrolled, so
   * clearing React state alone would leave the typed text sitting in the input
   * while the grid showed everything. This is the only way to reset it without
   * changing the primitive.
   */
  const handleReset = useCallback(() => {
    const input =
      toolbarRef.current?.querySelector<HTMLInputElement>(
        'input[type="search"]',
      ) ?? null;
    if (input) input.value = "";

    setQuery("");
    setCategory("All");
    setExpanded(false);
  }, []);

  /*
   * "View More" removes itself from the page. Without this the focus ring lands
   * on <body> and a keyboard user has to tab from the top of the document to
   * reach the three cards they just asked for. Moving focus to the first of
   * them is the whole point of the control.
   */
  useEffect(() => {
    if (!expanded || !focusAfterExpand.current) return;
    focusAfterExpand.current = false;

    const item = gridRef.current?.children[INITIAL_VISIBLE];
    item?.querySelector("a")?.focus();
  }, [expanded]);

  const empty = visible.length === 0;

  return (
    <Section
      rhythm="final"
      container="grid"
      align="start"
      gap={48}
      aria-labelledby={HEADING_ID}
    >
      {/*
        The design gives this section no visible heading (500:2197 opens
        straight into the toolbar). A named region with no heading leaves a hole
        in the document outline between the route's <h1> and nine <h3> cards, so
        the heading exists and is not painted. `sr-only` is out of flow, so it
        does not consume one of the container's 48px gaps.
      */}
      <h2 id={HEADING_ID} className="sr-only">
        All articles
      </h2>

      <div
        ref={toolbarRef}
        className={cn(
          "flex w-full flex-col gap-6",
          // responsive.md S7.4 puts search and filters on one row from `md`.
          // The arithmetic does not close: at 768 the container is 688 and the
          // two together need ~950, and even at 1024 (container 928) they
          // overflow. They are placed on one row from `xl`, where 1120 of
          // container holds them with room, and stacked below it - which is the
          // artifact's own base/xs behaviour extended two stops up.
          "xl:flex-row xl:items-center xl:justify-between",
        )}
      >
        <div
          onInput={handleSearchInput}
          className="w-full xl:w-90 xl:shrink-0"
        >
          <SearchField
            label="Search for articles"
            placeholder="Search for articles"
            name="q"
            width="full"
          />
        </div>

        <ArticleFilters
          active={category}
          onChange={handleCategoryChange}
          className="xl:justify-end"
        />
      </div>

      {empty ? (
        <div className="flex w-full flex-col items-center gap-6 py-10 text-center">
          {/* The design has no empty state - it cannot, it is one static
              composition. This is the minimum that is still useful: what
              happened, and the one control that undoes it. */}
          <p className="text-md text-fg-subtle">
            No articles match that search.
          </p>
          <div className="w-fit" onClick={handleReset}>
            <Button variant="quiet" size="md" className={PILL_LABEL}>
              Show all articles
            </Button>
          </div>
        </div>
      ) : (
        <ul
          ref={gridRef}
          className={cn(
            "grid w-full grid-cols-1 gap-x-6 gap-y-10",
            // 1 / 2 / 2 / 2 / 3 / 3 columns at base/xs/sm/md/lg/xl,
            // gaps 32 at lg and the designed 40 x 56 from xl. responsive.md S7.4.
            "xs:grid-cols-2",
            "lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12",
            "xl:gap-x-10 xl:gap-y-14",
          )}
        >
          {visible.map((post, index) => (
            <Reveal
              as="li"
              key={post.slug}
              index={index}
              className={cn(
                "min-w-0",
                // The base-only six-card limit. `display: none` also takes the
                // card out of the tab order and the accessibility tree, which
                // is what "not shown yet" has to mean.
                index >= INITIAL_VISIBLE && !expanded
                  ? "hidden xs:block"
                  : undefined,
              )}
            >
              <ArticleCard post={post} />
            </Reveal>
          ))}
        </ul>
      )}

      {/* 507:477. Only reachable at base, and only while something is hidden. */}
      {!empty && !expanded && visible.length > INITIAL_VISIBLE ? (
        <div className="w-fit self-center xs:hidden" onClick={handleViewMore}>
          <Button
            variant="quiet"
            size="md"
            aria-label="View more articles"
            className={PILL_LABEL}
          >
            View More
          </Button>
        </div>
      ) : null}

      <p role="status" className="sr-only">
        {empty
          ? "No articles match the current filters."
          : `${visible.length} ${visible.length === 1 ? "article" : "articles"} shown.`}
      </p>
    </Section>
  );
}
