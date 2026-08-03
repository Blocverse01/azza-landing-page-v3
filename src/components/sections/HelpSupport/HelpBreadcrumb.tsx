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
                    /*
                     * responsive.md S6.1 - the 44px floor, and this crumb needs
                     * it more than most: below `lg` the topic tree is behind
                     * "Browse topics", so this anchor is the control a phone
                     * user reaches for to close an opened article. It was the
                     * bare 20.8px line box (`text-sm-crumb` = 16px x 1.3).
                     *
                     * `-my-3 py-3` is the same idiom `Footer.tsx` and
                     * `TopNav.tsx` use, for the same reason: 12px of padding
                     * either side of a 20.8px line box gives a 44.8px target,
                     * and the equal negative margin cancels it out of the flow
                     * so the margin box is still 20.8 and the trail does not
                     * move by a pixel. `inline-flex` is load-bearing, not
                     * cosmetic - vertical margins are ignored on a plain inline
                     * box, so the cancellation only works on an atomic one.
                     *
                     * Padding, not the `::after` box `NavDropdown.tsx` uses:
                     * nothing is painted on this element's padding box (no
                     * fill, no border), so growing it is invisible, whereas
                     * NavDropdown's hover pill fills its padding and had to
                     * keep it small.
                     *
                     * `relative` IS PART OF THE FIX, not decoration. The trail
                     * wraps at <= ~330px (108.8 + 6 + 181.5 does not fit a
                     * 280px content box at 320), and `gap-y-1` puts the next
                     * line 4px below this one - inside the 12px of padding
                     * this rule just added. Without `relative` the wrapped
                     * crumb's in-flow text paints over the bottom 8px of the
                     * hit box and swallows the press: measured with
                     * `elementFromPoint`, the bottom edge resolved to the
                     * <span>, not the <a>. Positioning the anchor lifts it into
                     * the positioned paint layer above its in-flow siblings, so
                     * the whole 44.8px hit-tests as the link. Nothing else
                     * moves - the sibling it now covers is the non-interactive
                     * current-page crumb, so no target is stolen from anything.
                     */
                    "relative -my-3 inline-flex items-center py-3",
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
