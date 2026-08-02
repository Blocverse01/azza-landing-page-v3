"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Icon, Reveal, Section } from "@/components/ui";
import { cn } from "@/lib/cn";

import {
  HELP_COMMUNITY,
  HELP_COMMUNITY_HEADING,
  HELP_COMMUNITY_STANDFIRST,
  HELP_HUB_HEADING,
  HELP_HUB_STANDFIRST,
  HELP_RESOURCES,
  getHelpArticle,
  type HelpArticle as HelpArticleData,
  type HelpTopic,
} from "@/content/help";

import { HelpArticle } from "./HelpArticle";
import { HelpBreadcrumb } from "./HelpBreadcrumb";
import { HelpResourceGrid } from "./HelpResourceGrid";
import { HelpSidebar } from "./HelpSidebar";

export interface HelpSupportProps {
  topics: readonly HelpTopic[];
  /**
   * Present => the surface starts in its OPEN state (components.md S6).
   *
   * It sets the INITIAL state only. Opening and closing afterwards is internal,
   * because D-001 rules `/help` one route in two states rather than two routes:
   * `498:209` and `500:2281` differ only in this column, and every other
   * element on both frames is byte-identical.
   */
  article?: HelpArticleData;
}

/** Where focus goes after a state change. Never nowhere. */
type FocusIntent = "article" | "hub" | "keep";

/**
 * Help & Support - `500:1736` (closed) and `500:2305` (opened).
 *
 * ONE COMPONENT, ONE ROUTE, TWO STATES. The sidebar and the page chrome are
 * shared; only the right-hand column swaps between the hub (heading + 2x2
 * resource grid + community) and the article (breadcrumb + body).
 *
 * FOCUS. Every state change moves focus deliberately, and the rule differs by
 * origin because the right answer differs:
 *
 *   - a hub CARD opens an article: the card is removed from the DOM, so focus
 *     would fall to <body>. It moves to the article region instead.
 *   - the BREADCRUMB closes an article: the breadcrumb is removed, so focus
 *     moves to the hub's <h1>.
 *   - a SIDEBAR row toggles: the trigger stays mounted and visible, so focus
 *     stays on it. Yanking focus away from a disclosure trigger the user just
 *     pressed is a regression, not a feature.
 *
 * MOTION. The hub <-> article swap is deliberately NOT animated.
 * components.md S10 is the whole of the site's motion contract and it does not
 * describe a state swap of this kind; S10 also says an implementer must raise
 * such a gap rather than fill it locally. Raised in `open_questions`. What IS
 * animated here is what the contract does cover: the sidebar disclosure
 * (`grid-template-rows: 0fr -> 1fr`), the chevron, the resource-grid entrance,
 * and every hover/focus transition - each of which the theme.css reduced-motion
 * floor collapses to 0.01ms under `prefers-reduced-motion: reduce`.
 */
export function HelpSupport({ topics, article }: HelpSupportProps) {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(
    article?.topicId ?? null,
  );

  const hubHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef<FocusIntent | null>(null);

  const openArticle = activeTopicId
    ? article?.topicId === activeTopicId
      ? article
      : getHelpArticle(activeTopicId)
    : undefined;

  const selectTopic = useCallback(
    (topicId: string | null, intent: FocusIntent) => {
      pendingFocus.current = intent;
      setActiveTopicId(topicId);
    },
    [],
  );

  // Runs only after a user-initiated change, never on mount: `pendingFocus` is
  // null until a handler sets it, so the initial render never steals focus.
  useEffect(() => {
    const intent = pendingFocus.current;
    if (!intent || intent === "keep") {
      pendingFocus.current = null;
      return;
    }
    pendingFocus.current = null;

    const node =
      intent === "article" ? articleRef.current : hubHeadingRef.current;
    node?.focus();
  }, [activeTopicId]);

  return (
    <Section rhythm="standard" container="wide" align="start" gap={0}>
      <div
        className={cn(
          "flex w-full flex-col gap-10",
          "lg:flex-row lg:items-start lg:gap-18",
        )}
      >
        <HelpSidebar
          topics={topics}
          activeTopicId={activeTopicId}
          onSelectTopic={(topicId, open) =>
            selectTopic(open ? topicId : null, "keep")
          }
        />

        <div className="flex w-full min-w-0 flex-col lg:flex-1">
          {openArticle ? (
            /* `500:2334` - V, gap 48. */
            <div className="flex w-full min-w-0 flex-col gap-12">
              <HelpBreadcrumb
                items={openArticle.breadcrumb}
                onNavigate={() => selectTopic(null, "hub")}
              />
              <HelpArticle article={openArticle} containerRef={articleRef} />
            </div>
          ) : (
            /* `500:1765` - V, gap 64. */
            <div className="flex w-full min-w-0 flex-col gap-16">
              {/* `500:1766` - V, gap 40. */}
              <div className="flex w-full min-w-0 flex-col gap-10">
                {/*
                 * `500:1767`. No `Reveal` here: this is the route's <h1> and the
                 * LCP element, and components.md S10.4 excludes both from the
                 * entrance.
                 */}
                <header className="flex w-full flex-col gap-4">
                  <h1
                    ref={hubHeadingRef}
                    tabIndex={-1}
                    className="text-4xl text-fg-primary"
                  >
                    {HELP_HUB_HEADING}
                  </h1>
                  <p className="text-md text-fg-muted">{HELP_HUB_STANDFIRST}</p>
                </header>

                <HelpResourceGrid
                  resources={HELP_RESOURCES}
                  onSelectTopic={(topicId) => selectTopic(topicId, "article")}
                />
              </div>

              {/* `500:1796` - V, gap 40. */}
              <section
                aria-labelledby="help-community-heading"
                className="flex w-full min-w-0 flex-col gap-10"
              >
                <Reveal className="flex w-full flex-col gap-4">
                  <h2
                    id="help-community-heading"
                    className="text-2xl-section text-fg-primary"
                  >
                    {HELP_COMMUNITY_HEADING}
                  </h2>
                  <p className="text-md text-fg-muted">
                    {HELP_COMMUNITY_STANDFIRST}
                  </p>
                </Reveal>

                {/*
                 * `500:1800` - H, gap 38 across three 264-wide columns. 38 is
                 * off-scale; layout.md S1.3 already snaps this file's other 38
                 * to 40, so the same snap is applied here (1.3px per column).
                 *
                 * The rows are static, not links: `500:1801`/`500:1806`/
                 * `500:1811` are plain frames in Figma and no destination is
                 * authored for any of the three. D-037 also records that Help's
                 * social set (X / Instagram / WhatsApp) deliberately differs
                 * from the nav's and the blog's - do not reconcile it.
                 */}
                <Reveal index={1}>
                  <ul className="grid grid-cols-1 gap-10 xs:grid-cols-2 md:grid-cols-3">
                    {HELP_COMMUNITY.map((item) => (
                      <li key={item.id} className="flex min-w-0 gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center text-fg-body">
                          <Icon name={item.icon} size="sm" />
                        </span>
                        <div className="flex min-w-0 flex-col gap-2">
                          <h3 className="text-base text-fg-body">
                            {item.label}
                          </h3>
                          <p className="text-sm-regular text-fg-muted">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </section>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
