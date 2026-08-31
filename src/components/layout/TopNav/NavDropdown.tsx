import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import { Icon, VisuallyHidden } from "@/components/ui";
import type { NavDropdownItem } from "@/content/navigation";
import { cn } from "@/lib/cn";

export interface NavDropdownProps {
  /** Trigger text, verbatim from 412:2078 / 412:2082. */
  label: string;
  items: readonly NavDropdownItem[];
  /** The route currently rendered, so the open row can be marked. */
  currentPath: string;
}

/**
 * A desktop nav dropdown - 412:2077 (Products, panel 771:303) and 412:2081
 * (Socials, panel 776:464).
 *
 * WHY THIS IS NOT BUILT ON `ui/Disclosure`
 * ----------------------------------------
 * `Disclosure` is the shared accordion contract and it is right for an
 * accordion, which is what `MobileNavPanel` uses it for. A nav dropdown has a
 * materially different keyboard contract and `Disclosure` implements none of
 * the difference: it does not return focus to the trigger on Escape, it does
 * not close on outside click, it does not close when focus leaves the
 * disclosure, it has no ArrowDown-to-open, and it has no hover-open with a
 * close delay. Its `panelProps` also carry `role="region"`, which would put two
 * extra landmarks inside the primary nav. Rather than modify `Disclosure` -
 * which is outside this agent's allowlist and has three other consumers - the
 * menu behaviour is built locally here.
 *
 * The pattern is the WAI disclosure-navigation one, NOT `role="menu"`:
 * `role="menu"` demands roving `tabindex`, arrow-only traversal and no Tab
 * between items, which is wrong for a list of page links and would make Tab
 * skip the whole panel.
 */
/*
 * THE HOVER ICON SWAP - 771:303 / 776:464, whose component prototypes connect
 * each row's Default variant to a hover variant that exchanges the tile's grey
 * outline glyph for a filled, coloured one.
 *
 * Both glyphs render stacked in the tile (`grid-area: 1/1`) and CROSSFADE,
 * because the pair share one silhouette - outline and filled cuts of the same
 * Fluent shape - so a crossfade reads as the shape filling with colour rather
 * than as two objects swapping. Motion, per the design system's own tokens:
 *
 *   - The filled glyph fades in on `--motion-fast` (160ms) but SCALES from
 *     0.85 on `--motion-base` (240ms), both on `--ease-out`. The split is the
 *     point: colour resolves crisply while the shape settles a beat longer,
 *     which is what makes the swap read as fluid instead of mechanical.
 *   - 0.85, never 0: the filled mark grows out of the outline that is already
 *     there, not out of nothing.
 *   - The outline fades on `--motion-fast` underneath - it sits first in
 *     source order, so the incoming fill paints over it, and the shape never
 *     visibly empties mid-swap.
 *   - CSS transitions, not keyframes: a pointer skating down the panel
 *     retargets every half-finished crossfade smoothly instead of restarting
 *     it, and un-hovering simply plays the same values back.
 *   - `fine-pointer:` + `group-hover` gates the swap exactly the way
 *     `hoverable:` gates every other hover style here (S10.6); keyboard focus
 *     triggers it via `group-focus-visible`, so the states match. On reduced
 *     motion the scale is pinned and only the opacity crossfade remains -
 *     gentler, not gone.
 */
const ICON_OUTLINE_SWAP = cn(
  "[grid-area:1/1]",
  "transition-opacity duration-(--motion-fast) ease-out",
  "fine-pointer:group-hover:opacity-0 group-focus-visible:opacity-0",
);

const ICON_FILLED_SWAP = cn(
  "scale-[0.85] opacity-0 [grid-area:1/1]",
  // `scale`, not `transform`: Tailwind v4's scale-* utilities set the
  // independent CSS `scale` property, which a `transform` transition ignores.
  "[transition:opacity_var(--motion-fast)_var(--ease-out),scale_var(--motion-base)_var(--ease-out)]",
  "fine-pointer:group-hover:scale-100 fine-pointer:group-hover:opacity-100",
  "group-focus-visible:scale-100 group-focus-visible:opacity-100",
  "motion-reduce:scale-100 motion-reduce:transition-[opacity]",
);

export function NavDropdown({ label, items, currentPath }: NavDropdownProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Rows carrying a description get the wide 349px panel (771:303). */
  const wide = items.some((item) => Boolean(item.description));

  /** Products is "current" whenever any of its destinations is the route. */
  const current = items.some(
    (item) => item.href.startsWith("/") && currentPath.startsWith(item.href),
  );

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const close = useCallback(
    (restoreFocus: boolean) => {
      clearCloseTimer();
      setOpen(false);
      if (restoreFocus) triggerRef.current?.focus();
    },
    [clearCloseTimer],
  );

  /*
   * Outside click. `onBlur` below already covers every keyboard path and most
   * pointer paths, but a click on a non-focusable region while the panel was
   * opened by hover never produces a blur, so the document listener is the
   * belt to that braces. Only mounted while open.
   */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      close(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  /*
   * Hover-open, components.md S10.5. Guarded on a fine pointer: an unguarded
   * `mouseenter` fires on a tap, which on a touch device at >= 1024 (an iPad in
   * landscape still gets the desktop nav) would open the panel and then have
   * the synthesised click immediately toggle it shut.
   */
  const finePointer = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onPointerEnter = () => {
    if (!finePointer()) return;
    clearCloseTimer();
    setOpen(true);
  };

  /*
   * 150ms close delay so a diagonal mouse path from the trigger to the panel
   * does not dismiss it mid-travel.
   */
  const onPointerLeave = () => {
    if (!finePointer()) return;
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      // Open and step into the list. Enter and Space are left to the native
      // button, which toggles and keeps focus on the trigger - Tab then walks
      // the rows in source order.
      event.preventDefault();
      clearCloseTimer();
      setOpen(true);
      requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
      });
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    event.stopPropagation();
    close(true);
  };

  /*
   * Focus must never leave an open menu invisibly. React's `onBlur` is the
   * bubbling `focusout`, so this fires for Tab out of the last row just as it
   * does for a click elsewhere.
   */
  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    close(false);
  };

  return (
    <li
      ref={rootRef}
      className="relative"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close(false) : setOpen(true))}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          // `-my-3 py-3` is the responsive.md S6.1/S6.2 hit expansion - S6.2 asks
          // for "the whole trigger row, >= 44 tall" and the row measured ~20.
          // The negative margin cancels the padding in the flow, so the <li>'s
          // height is unchanged, `top-full` on the panel below still resolves to
          // the same y, and the label and chevron do not move. The trigger's hit
          // box now reaches exactly to the panel's `mt-3` top edge, which also
          // closes the 12px hover gap between them.
          "-my-3 inline-flex cursor-pointer items-center gap-0.5 bg-transparent px-0 py-3 text-sm",
          "transition-colors duration-(--motion-fast) ease-out",
          "motion-reduce:transition-none",
          current ? "text-nav-fg-current" : "text-nav-fg",
          "hoverable:text-nav-fg-hover focus-visible:text-nav-fg-hover",
        )}
      >
        {label}
        <Icon
          name="chevron-down"
          size="sm"
          className={cn(
            "transition-transform duration-(--motion-base) ease-in-out",
            "motion-reduce:transition-none",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        inert={!open}
        className={cn(
          "absolute top-full left-0 z-10 mt-3",
          "bg-nav-dropdown-surface shadow-dropdown",
          /*
           * Both redesigned panels agree on the shell: 8px of padding and a
           * 16px radius. `wide` decides the width - 349 on 771:303, 280 on
           * 776:464 - and, below, the row gap the two frames disagree on.
           */
          "rounded-2xl p-2",
          wide ? "w-[349px]" : "w-[280px]",
          "transition-[opacity,transform] motion-reduce:transition-none",
          // Asymmetric on purpose (components.md S10.5): it opens on
          // --motion-base/--ease-out and closes faster on --motion-fast/
          // --ease-in, because a slow dismissal reads as lag.
          open
            ? "translate-y-0 opacity-100 duration-(--motion-base) ease-out"
            : "pointer-events-none -translate-y-1.5 opacity-0 duration-(--motion-fast) ease-in",
        )}
      >
        {/*
         * `role="list"` for the reason WhyAzzaSteps.tsx and
         * WhyAzzaCrossBorder.tsx already record: Tailwind's preflight sets
         * `list-style: none` on every <ul>, and Safari/VoiceOver drops list
         * semantics from an un-marked list. This panel's whole job is to be a
         * bounded set of destinations, and the count is what tells a
         * screen-reader user when the panel ends.
         */}
        {/* 8px between rows on 771:303, 4px on 776:464. */}
        <ul role="list" className={cn("flex flex-col", wide ? "gap-2" : "gap-1")}>
          {items.map((item) => {
            const isCurrent = item.href.startsWith("/") && currentPath === item.href;
            const external = !item.href.startsWith("/");

            const body = (
              <>
                {/*
                 * The icon box is always reserved so that dropping the missing
                 * glyphs in later causes no reflow - D-023.
                 *
                 * A white tile with a 1px #F2F2F2 border and an 8px radius,
                 * 40px around a 24px glyph, identical on both frames now.
                 * `grid` + `grid-area: 1/1` stacks the outline and filled
                 * glyphs dead-centre on top of each other for the crossfade -
                 * see ICON_OUTLINE_SWAP / ICON_FILLED_SWAP above. The tile's
                 * text colour is what paints the outline glyph: the `_regular`
                 * exports are `currentColor` shapes and the token holds the
                 * frames' own #868686.
                 */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-10 shrink-0 place-items-center",
                    "border-nav-dropdown-tile-border rounded-lg border",
                    "bg-nav-dropdown-tile text-nav-dropdown-icon",
                  )}
                >
                  {item.icon ? (
                    <Icon
                      name={item.icon}
                      size="md"
                      className={cn(
                        "[grid-area:1/1]",
                        // A lone outline with no filled partner never fades.
                        item.iconFilled ? ICON_OUTLINE_SWAP : undefined,
                      )}
                    />
                  ) : null}
                  {item.iconFilled ? (
                    <Icon name={item.iconFilled} size="md" className={ICON_FILLED_SWAP} />
                  ) : null}
                </span>
                {/*
                 * `leading-[normal]` is 771:303's own value and NOT the type
                 * tokens' leading. The frame draws a 19px title over a 17px
                 * description with a 4px gap - exactly the 40 that its icon tile
                 * is - and the tokens' taller leading pushed the pair to 42 and
                 * the whole row from 64 to 66. The keyword, not Tailwind's
                 * `leading-normal`, which is 1.5.
                 *
                 * Keyed on `wide` because only the two-line stack has to total
                 * the tile's height exactly. 776:464 has one line beside the
                 * 40px tile, so its line box never sets the row height and
                 * `--text-sm`'s own 1.21 (19.36px) is left alone - that frame's
                 * 16px/-0.32px/500 label IS `text-sm` to the letter.
                 */}
                <span
                  className={cn(
                    "flex min-w-0 flex-col gap-1",
                    wide && "leading-[normal]",
                    /* 19 + gap 4 + 17 = the tile's own 40. See the note above. */
                    wide && "[&>span:first-child]:leading-[19px]",
                    wide && "[&>span:last-child]:leading-[17px]",
                  )}
                >
                  <span className="text-nav-dropdown-fg text-sm">{item.label}</span>
                  {item.description ? (
                    <span className="text-nav-dropdown-fg-muted text-xs font-normal">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </>
            );

            const className = cn(
              /*
               * `group` is what wires the row to its tile's icon crossfade:
               * ICON_OUTLINE_SWAP / ICON_FILLED_SWAP key off `group-hover` and
               * `group-focus-visible`, so ONE hover target drives the row fill
               * and the glyph swap together and they can never fall out of sync.
               */
              "group flex items-center gap-3 no-underline",
              /*
               * A 12px-radius row on both frames; the padding differs - 12px on
               * 771:303 (row = 12+40+12 = 64), 8px on 776:464 (8+40+8 = 56).
               * Both clear responsive.md S6.2's 44px minimum on their own
               * geometry, so no `::after` hit expansion.
               */
              "rounded-xl",
              wide ? "p-3" : "p-2",
              /*
               * Rest is the panel's own white; hover/focus lays the frames'
               * #F9F9F9 under the row. Background and press-scale share one
               * transition so a press mid-hover retargets both smoothly.
               */
              "hoverable:bg-nav-dropdown-row-hover focus-visible:bg-nav-dropdown-row-hover",
              // `scale`, not `transform` - see the note on ICON_FILLED_SWAP.
              "transition-[background-color,scale] duration-(--motion-fast) ease-out",
              "motion-reduce:transition-none",
              // Press feedback, the standard pressable treatment: subtle at
              // this row width, and instant on --motion-fast.
              "active:scale-[0.98]",
            );

            return (
              <li key={item.href + item.label}>
                {external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={className}
                  >
                    {body}
                    {/*
                     * The same treatment `ArticleBody.tsx`'s `ProseLink` already
                     * ships, for the same reason it states: a new tab that opens
                     * with no warning is the classic unannounced context change.
                     * Every row in the Socials panel is one. The note is a
                     * sibling of `body`'s two spans and inherits the row's
                     * `flex`, so it lays out as a zero-width sr-only box and the
                     * painted row is unchanged.
                     */}
                    <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={className}
                  >
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
