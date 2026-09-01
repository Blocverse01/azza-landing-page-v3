"use client";

import { Disclosure, Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LegalSection } from "@/content/legal";

/*
 * THE CONTENTS RAIL, BELOW `lg`.
 *
 * The desktop rail is `hidden` under `lg` for the reason the teardown records:
 * a 20-clause rail cannot sit beside the prose on a phone, and the sliding pill
 * is a reading-position indicator that has nothing to indicate once the rail is
 * a jump menu you scroll through yourself. Interfere swaps in a bottom sheet;
 * this swaps in a disclosure, because `Disclosure` is the site's one accordion
 * contract (`Faq`, `HelpSidebar`, `FeatureList` all wire through it) and adding
 * a modal sheet primitive for a single consumer is a new pattern, not a reuse.
 * The behaviour it needs is identical either way: reveal the list, jump, close.
 *
 * IT CLOSES ON CHOICE. A disclosure that stays open after you pick a clause
 * leaves a 20-row list sitting between the reader and the clause they just
 * asked for. Native anchor navigation does the scrolling, so the only work here
 * is collapsing the panel.
 */

export interface LegalTocMobileProps {
  sections: readonly LegalSection[];
  label: string;
  className?: string;
}

export function LegalTocMobile({ sections, label, className }: LegalTocMobileProps) {
  return (
    <Disclosure>
      {({ open, toggle, triggerProps, panelProps }) => (
        <nav
          aria-label={label}
          className={cn("border-line-divider bg-surface-page w-full rounded-xl border", className)}
        >
          <button
            {...triggerProps}
            onClick={toggle}
            className={cn(
              "text-fg-body flex w-full cursor-pointer items-center justify-between text-base",
              "gap-4 rounded-xl px-5 py-4 text-left",
              "transition-colors duration-(--motion-fast) ease-out",
              "hoverable:bg-surface-faint",
            )}
          >
            Contents
            <Icon
              name="chevron-down"
              size="sm"
              className={cn(
                "text-fg-caption-soft shrink-0",
                "transition-transform duration-(--motion-base) ease-out",
                "motion-reduce:transition-none",
                open ? "rotate-180" : "rotate-0",
              )}
            />
          </button>

          {/*
           * D-030, both halves: `panelProps` is spread as the contract asks,
           * `hidden` is overridden because `display:none` cannot animate, and
           * the collapsed subtree leaves the focus order via `inert` instead.
           * Missing either half ships 20 focusable links inside a closed panel.
           */}
          <div
            {...panelProps}
            hidden={undefined}
            inert={!open}
            className={cn(
              "grid transition-[grid-template-rows] duration-(--motion-base) ease-out",
              "motion-reduce:transition-none",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <ul className="m-0 flex list-none flex-col gap-1 px-2 pt-1 pb-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={() => toggle()}
                      className={cn(
                        "text-fg-caption flex gap-3 rounded-lg px-3 py-2 text-xs no-underline",
                        "transition-colors duration-(--motion-fast) ease-out",
                        "hoverable:bg-surface-faint hoverable:text-fg-body",
                        "focus-visible:text-fg-body",
                      )}
                    >
                      <span className="text-fg-ghost w-10 shrink-0 whitespace-nowrap tabular-nums">
                        {section.number}
                      </span>
                      <span className="min-w-0">{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      )}
    </Disclosure>
  );
}

export default LegalTocMobile;
