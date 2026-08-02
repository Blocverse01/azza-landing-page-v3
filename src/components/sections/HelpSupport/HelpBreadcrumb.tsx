import { cn } from "@/lib/cn";

import type { HelpCrumb } from "@/content/help";

export interface HelpBreadcrumbProps {
  /** `501:217`. Two crumbs in the design: the hub, then the open article. */
  items: readonly HelpCrumb[];
  /**
   * Called for a non-terminal crumb instead of following its href.
   *
   * The hub is a STATE of `/help`, not a separate route, so the crumb is
   * rendered as a real `<a href="/help">` and the handler cancels the
   * navigation when script is available. Without JavaScript the anchor still
   * works: `/help` renders the hub, which is exactly where the crumb points.
   */
  onNavigate?: (item: HelpCrumb, index: number) => void;
  className?: string;
}

/**
 * The breadcrumb - `501:217`, present ONLY in the opened state.
 *
 * `<nav aria-label="Breadcrumb"><ol>` per responsive.md S7.6. The last crumb is
 * not a link and carries `aria-current="page"`; the separators are `/` glyphs
 * marked `aria-hidden` so a screen reader reads the trail as a list rather than
 * as "Help ampersand Support slash Getting started with Azza".
 *
 * It WRAPS rather than truncating. responsive.md S7.6's truncation policy only
 * applies to a MIDDLE segment past two lines, and this trail has no middle
 * segment - two crumbs, so the policy is a no-op here by its own terms.
 */
export function HelpBreadcrumb({
  items,
  onNavigate,
  className,
}: HelpBreadcrumbProps) {
  if (items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm-crumb text-fg-muted">
        {items.map((item, index) => {
          const isCurrent = index === lastIndex;

          return (
            <li key={item.href} className="flex items-center gap-x-1">
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a
                  href={item.href}
                  onClick={
                    onNavigate
                      ? (event) => {
                          // Let the browser handle modified clicks - a
                          // ctrl/cmd-click on a breadcrumb must still open a
                          // new tab rather than silently changing state here.
                          if (
                            event.metaKey ||
                            event.ctrlKey ||
                            event.shiftKey ||
                            event.altKey ||
                            event.button !== 0
                          ) {
                            return;
                          }
                          event.preventDefault();
                          onNavigate(item, index);
                        }
                      : undefined
                  }
                  className={cn(
                    "rounded-sm no-underline",
                    // `transition-[color]`, not `transition-colors`: the latter
                    // includes `outline-color`, and components.md S10.7 forbids
                    // transitioning the focus ring.
                    "transition-[color] duration-(--motion-fast) ease-out",
                    "hoverable:text-link-hover focus-visible:text-link-hover",
                  )}
                >
                  {item.label}
                </a>
              )}

              {isCurrent ? null : (
                <span aria-hidden="true" className="select-none">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
