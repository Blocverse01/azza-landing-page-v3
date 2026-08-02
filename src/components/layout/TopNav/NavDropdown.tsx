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

import { Icon } from "@/components/ui";
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
 * A desktop nav dropdown - 412:2077 (Products, panel 94:850) and 412:2081
 * (Socials, panel 63:350).
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
export function NavDropdown({ label, items, currentPath }: NavDropdownProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Rows carrying a description get the wide 349px panel (94:850). */
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
          "rounded-xl bg-nav-dropdown-surface p-4 shadow-dropdown",
          wide ? "w-[349px]" : "w-[232px]",
          "transition-[opacity,transform] motion-reduce:transition-none",
          // Asymmetric on purpose (components.md S10.5): it opens on
          // --motion-base/--ease-out and closes faster on --motion-fast/
          // --ease-in, because a slow dismissal reads as lag.
          open
            ? "translate-y-0 opacity-100 duration-(--motion-base) ease-out"
            : "pointer-events-none -translate-y-1.5 opacity-0 duration-(--motion-fast) ease-in",
        )}
      >
        <ul className="flex flex-col gap-5">
          {items.map((item) => {
            const isCurrent =
              item.href.startsWith("/") && currentPath === item.href;
            const external = !item.href.startsWith("/");

            const body = (
              <>
                {/*
                 * The icon box is always reserved so that dropping the missing
                 * glyphs in later causes no reflow - D-023. Four of the six
                 * dropdown glyphs were never exported; see navigation.ts.
                 */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex shrink-0 items-center justify-center",
                    wide ? "size-9" : "size-6",
                  )}
                >
                  {item.icon ? (
                    <Icon name={item.icon} size={wide ? 36 : "md"} />
                  ) : null}
                </span>
                <span className="flex min-w-0 flex-col gap-2">
                  <span className="text-sm text-nav-dropdown-fg">
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="text-xs font-normal text-nav-dropdown-fg-muted">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </>
            );

            const className = cn(
              "-mx-2 flex items-center gap-3 rounded-xl px-2 py-1 no-underline",
              "transition-colors duration-(--motion-fast) ease-out",
              "motion-reduce:transition-none",
              "hoverable:bg-nav-dropdown-item-hover focus-visible:bg-nav-dropdown-item-hover",
              /*
               * responsive.md S6.2: the Products rows (`wide`) are 36px glyph +
               * py-1 = 44 and the artifact records them as "Passes. Keep." The
               * Socials rows are a 24px glyph + py-1 = 32 and the artifact asks
               * for 48 with the icon left at 24.
               *
               * This is S6.1's own `::after` recipe rather than more padding,
               * because padding here is PAINTED: `nav.dropdown.item-hover` fills
               * the padding box, so growing it 32 -> 48 would swell the hover
               * pill until the three rows nearly touched. The pseudo-element is
               * transparent, belongs to the `<a>` so it hit-tests as the link,
               * and takes 8px into each 20px gap - leaving 4px of clearance, so
               * no row can steal its neighbour's press.
               */
              !wide &&
                "relative after:absolute after:inset-x-0 after:top-1/2 after:h-12 after:-translate-y-1/2 after:content-['']",
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
