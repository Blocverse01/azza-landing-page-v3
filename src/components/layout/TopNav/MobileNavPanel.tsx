import Link from "next/link";
import type { RefObject } from "react";

import { Button, Disclosure, Icon, VisuallyHidden } from "@/components/ui";
import { NAV_CTA, PRIMARY_NAV, type NavDropdownItem } from "@/content/navigation";
import { cn } from "@/lib/cn";

export interface MobileNavPanelProps {
  open: boolean;
  /** The id the bar's trigger points at with `aria-controls`. */
  id: string;
  /** Focus trapping and "focus the first row on open" both read this. */
  panelRef: RefObject<HTMLElement | null>;
  /** Dismissal path 3 - tapping the backdrop. */
  onDismiss: () => void;
  currentPath: string;
}

/** 56px rows, 24px inline padding, 20px label - responsive.md S7.0.2. */
const ROW =
  "flex min-h-14 w-full items-center justify-between gap-3 px-6 text-md no-underline " +
  "transition-colors duration-(--motion-fast) ease-out motion-reduce:transition-none " +
  "hoverable:bg-nav-dropdown-item-hover focus-visible:bg-nav-dropdown-item-hover";

function SubRow({ item, currentPath }: { item: NavDropdownItem; currentPath: string }) {
  const external = !item.href.startsWith("/");
  const isCurrent = !external && currentPath === item.href;

  const body = (
    <>
      {/* Slot always reserved so the missing glyphs drop in without reflow - D-023. */}
      <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center">
        {item.icon ? <Icon name={item.icon} size="md" /> : null}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-nav-dropdown-fg text-sm">{item.label}</span>
        {item.description ? (
          // Dropped below `xs` so the row holds its 56px height.
          <span className="text-nav-dropdown-fg-muted xs:block hidden text-xs font-normal">
            {item.description}
          </span>
        ) : null}
      </span>
    </>
  );

  const className = cn(
    "flex min-h-14 w-full items-center gap-3 py-2 pr-6 pl-12 no-underline",
    "transition-colors duration-(--motion-fast) ease-out motion-reduce:transition-none",
    "hoverable:bg-nav-dropdown-item-hover focus-visible:bg-nav-dropdown-item-hover",
  );

  return (
    <li>
      {external ? (
        <a href={item.href} target="_blank" rel="noreferrer noopener" className={className}>
          {body}
          {/*
           * The same treatment `ArticleBody.tsx`'s `ProseLink` already ships,
           * for the same reason it states: a new tab that opens with no warning
           * is the classic unannounced context change. These are the mobile
           * Socials rows - the same destinations `NavDropdown` serves above `lg`
           * - so the two surfaces now say the same thing.
           */}
          <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
        </a>
      ) : (
        <Link href={item.href} aria-current={isCurrent ? "page" : undefined} className={className}>
          {body}
        </Link>
      )}
    </li>
  );
}

/**
 * The `< lg` navigation sheet - responsive.md S7.0.2.
 *
 * A full-width TOP SHEET, not a side drawer: the design's nav is centred and
 * symmetric and a drawer would import a directional metaphor the design does
 * not have. It is rendered in the DOM immediately after the trigger rather than
 * portalled to `<body>`, so the focus order is natural and needs no repair.
 *
 * The two dropdowns become in-place accordions rather than a second-level
 * flyout. A flyout needs its own focus trap, a "back" affordance and its own
 * dismissal rules; an in-place accordion needs none of that and keeps one
 * linear focus order. Both may be open at once - there are two, both short.
 *
 * These accordions DO use the shared `ui/Disclosure`, because an accordion is
 * exactly what it is built for. `panelProps.hidden` is overridden to
 * `undefined` and replaced with `inert`, per D-030: `hidden` computes to
 * `display: none` and cannot transition, while simply dropping it would leave
 * the collapsed rows keyboard-focusable inside a 0fr row.
 *
 * Semantics: `<nav>`, never `role="dialog"`. This is navigation; `dialog` would
 * suppress the landmark. Isolation comes from `inert` on the rest of the page,
 * applied by `TopNav`.
 */
export function MobileNavPanel({
  open,
  id,
  panelRef,
  onDismiss,
  currentPath,
}: MobileNavPanelProps) {
  return (
    <div
      // `TopNav`'s <noscript> stylesheet hides the whole sheet: without a script
      // it can never open, and leaving its rows in the layer stack would put a
      // second, unreachable copy of the nav behind the no-JS fallback list.
      data-azza-nav-sheet=""
      className={cn(
        // Fixed to the viewport below the bar. `--azza-nav-h` is set on the
        // <header> and steps 64 / 72 / 123 with the bar itself.
        "fixed inset-x-0 top-(--azza-nav-h) bottom-0 z-40 overflow-hidden lg:hidden",
        open ? undefined : "pointer-events-none",
      )}
      inert={!open}
    >
      <div
        aria-hidden="true"
        onClick={onDismiss}
        className={cn(
          "bg-overlay-scrim absolute inset-0",
          "transition-opacity duration-(--motion-base) ease-out",
          "motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <nav
        ref={panelRef}
        id={id}
        aria-label="Site menu"
        className={cn(
          "absolute inset-x-0 top-0 max-h-full overflow-y-auto overscroll-contain",
          "bg-surface-page pb-6",
          "transition-transform motion-reduce:transition-none",
          /*
           * The shadow rides the OPEN state, not the element (operator report
           * with screenshot, 2026-09-05). Parked, the sheet sits exactly one
           * panel-height above its wrapper's top edge - inert and invisible,
           * but `shadow-dropdown` still projected 32px past its bottom edge
           * into the wrapper, painting a permanent grey band across the top
           * of the hero on every phone. A hidden control must not cast.
           */
          open
            ? "shadow-dropdown translate-y-0 duration-(--motion-slow) ease-out"
            : "-translate-y-full duration-(--motion-base) ease-in",
        )}
      >
        {/*
         * Below `xs` the bar CTA collapses to a 44x44 icon button, so the
         * full-text CTA reappears here as the first row and the label is never
         * lost. At `xs`+ the bar already carries it and this is hidden.
         */}
        <div className="xs:hidden px-6 pt-6 pb-2">
          <Button variant="chat" size="md" href={NAV_CTA.href} fullWidth>
            {NAV_CTA.label}
          </Button>
        </div>

        {/*
         * `role="list"` for the reason WhyAzzaSteps.tsx and
         * WhyAzzaCrossBorder.tsx already record: Tailwind's preflight sets
         * `list-style: none` on every <ul>, and Safari/VoiceOver drops list
         * semantics from an un-marked list. Below `lg` this sheet IS the site's
         * navigation, so losing the "list, N items" boundary loses the only cue
         * that tells a screen-reader user how long the menu is.
         */}
        <ul role="list" className="flex flex-col py-2">
          {PRIMARY_NAV.map((item) => {
            const children = item.items;

            if (children) {
              return (
                <li key={item.label}>
                  <Disclosure>
                    {({ open: expanded, triggerProps, panelProps }) => (
                      <>
                        <button {...triggerProps} className={cn(ROW, "text-nav-fg cursor-pointer")}>
                          {item.label}
                          <Icon
                            name="chevron-down"
                            size="sm"
                            className={cn(
                              "transition-transform duration-(--motion-base) ease-in-out",
                              "motion-reduce:transition-none",
                              expanded ? "rotate-180" : "rotate-0",
                            )}
                          />
                        </button>
                        <div
                          {...panelProps}
                          hidden={undefined}
                          inert={!expanded}
                          className={cn(
                            // grid-template-rows 0fr -> 1fr, never max-height:
                            // a guessed max-height either clips or stalls.
                            "grid transition-[grid-template-rows]",
                            "duration-(--motion-base) ease-in-out",
                            "motion-reduce:transition-none",
                            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          )}
                        >
                          <div className="min-h-0 overflow-hidden">
                            {/* `role="list"` - same preflight/WebKit reason as
                                the outer list above. */}
                            <ul
                              role="list"
                              className={cn(
                                "flex flex-col transition-opacity ease-out",
                                "motion-reduce:transition-none",
                                expanded
                                  ? "opacity-100 delay-[40ms] duration-(--motion-fast)"
                                  : "opacity-0 duration-(--motion-fast)",
                              )}
                            >
                              {children.map((child) => (
                                <SubRow
                                  key={child.href + child.label}
                                  item={child}
                                  currentPath={currentPath}
                                />
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </Disclosure>
                </li>
              );
            }

            const href = item.href ?? "/";
            const isCurrent = currentPath === href;

            return (
              <li key={item.label}>
                <Link
                  href={href}
                  prefetch={item.prefetch}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(ROW, isCurrent ? "text-nav-fg-current" : "text-nav-fg")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
