"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/cn";

import { Icon } from "./Icon";
import type { IconName } from "./Icon/types";
import type { SelectPillOption } from "./SelectPill";

export interface SelectPillPickerProps {
  icon?: IconName;
  code: string;
  options: readonly SelectPillOption[];
  value?: string;
  onChange?: (value: string) => void;
  ariaLabel: string;
  /** The fully composed pill classes - `SelectPill` owns tone and remapping. */
  triggerClassName?: string;
}

/**
 * The open half of `SelectPill`'s functional mode: the trigger pill plus its
 * designed listbox. Split into its own module because this half needs hooks
 * and therefore a client boundary, while `SelectPill`'s inert branch must stay
 * renderable from Server Components.
 *
 * THE MENU SPEAKS THE SITE'S OWN MENU LANGUAGE. It is deliberately the same
 * panel grammar the nav dropdowns (771:303 / 776:464) established, because a
 * product should have ONE way a menu looks: white surface, 16px radius, 8px
 * gutter, `shadow-dropdown`, rows on an 8px radius (concentric with the
 * panel's 16 - 8), the row hover fill `#F9F9F9`, and `text-sm` labels beside
 * the same coin/flag roundels the pill itself draws. The one element the nav
 * panels have no precedent for - marking the CURRENT choice - is the brand
 * blue check (`link-current`), the colour this site already uses to mean
 * "where you are".
 *
 * MOTION - the nav panels' exact contract, made origin-aware. Opens on
 * `--motion-base`/`--ease-out` with a 0.95 scale from the pill's corner plus a
 * 4px slide; closes faster on `--motion-fast`/`--ease-in`, because a slow
 * dismissal reads as lag (asymmetry per components.md S10.5). Transitions -
 * never keyframes - so re-triggering mid-flight retargets smoothly, and the
 * panel stays mounted with `inert` so the exit can play. `scale`/`translate`
 * are the standalone properties Tailwind v4 emits, so the transition list
 * names them, not `transform`. Reduced motion drops to an opacity change.
 *
 * PLACEMENT flips on measurement, not configuration: the currency pill sits
 * low in the converter card, where a downward menu would run past the fold.
 * On open the panel measures itself (it is always mounted, so `offsetHeight`
 * is real) and opens upward when the space below cannot hold it and the space
 * above can - `transform-origin` follows, so it always scales from the pill.
 *
 * KEYBOARD - the WAI-ARIA listbox contract: the trigger is a plain button
 * with `aria-haspopup="listbox"`/`aria-expanded`; ArrowDown/ArrowUp open the
 * menu and focus lands on the SELECTED option, not the first; arrows cycle,
 * Home/End jump, Escape closes and restores the trigger, Tab and focus-out
 * close without trapping, and printable characters jump to the next match.
 * Options are real buttons (`role="option"`), so Enter/Space activate them
 * natively.
 *
 * Focused rows show the hover fill rather than a focus ring: in a listbox the
 * highlight IS the focus indicator (the same convention every native menu
 * uses), and a ring inside an 8px-radius row would double-mark one state.
 */
export function SelectPillPicker({
  icon,
  code,
  options,
  value,
  onChange,
  ariaLabel,
  triggerClassName,
}: SelectPillPickerProps) {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<"down" | "up">("down");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const optionEls = () => [
    ...(panelRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []),
  ];

  const openMenu = useCallback(() => {
    const rect = rootRef.current?.getBoundingClientRect();
    const menuHeight = panelRef.current?.offsetHeight ?? 0;
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setDrop(below < menuHeight + 16 && rect.top > menuHeight + 16 ? "up" : "down");
    }
    setOpen(true);
    // After the panel un-inerts: land focus on the selected option, so the
    // keyboard user starts from their current choice.
    requestAnimationFrame(() => {
      const panel = panelRef.current;
      const target =
        panel?.querySelector<HTMLElement>('[aria-selected="true"]') ??
        panel?.querySelector<HTMLElement>('[role="option"]');
      target?.focus();
    });
  }, []);

  /* Outside click - same belt-to-braces as NavDropdown: `onBlur` covers the
   * keyboard paths, but a click on a non-focusable region produces no blur. */
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

  const onRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    event.stopPropagation();
    close(true);
  };

  const onRootBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    close(false);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const els = optionEls();
    if (els.length === 0) return;
    const current = els.indexOf(document.activeElement as HTMLElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      els[(current + 1) % els.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      els[(current - 1 + els.length) % els.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      els[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      els[els.length - 1]?.focus();
    } else if (event.key === "Tab") {
      // Not a trap: let Tab leave, close behind it (onRootBlur also fires).
      close(false);
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      // Type-ahead: the next option after the focused one whose code starts
      // with the typed character, wrapping.
      const query = event.key.toLowerCase();
      for (let step = 1; step <= els.length; step += 1) {
        const candidate = els[(current + step) % els.length];
        if (candidate?.textContent?.trim().toLowerCase().startsWith(query)) {
          candidate.focus();
          break;
        }
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative inline-flex shrink-0"
      onKeyDown={onRootKeyDown}
      onBlur={onRootBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={triggerClassName}
      >
        {icon ? <Icon name={icon} size="md" /> : null}
        <span>{code}</span>
        <Icon
          name="chevron-down"
          size="sm"
          className={cn(
            "text-fg-secondary",
            "transition-transform duration-(--motion-base) ease-in-out",
            "motion-reduce:transition-none",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      <div
        ref={panelRef}
        id={listId}
        role="listbox"
        aria-label={ariaLabel}
        inert={!open}
        onKeyDown={onListKeyDown}
        className={cn(
          "absolute right-0 z-30 flex w-max min-w-44 flex-col gap-1",
          drop === "down"
            ? "top-full mt-2 origin-top-right"
            : "bottom-full mb-2 origin-bottom-right",
          "bg-menu-surface shadow-dropdown rounded-2xl p-2",
          "transition-[opacity,translate,scale] motion-reduce:transition-none",
          open
            ? "translate-y-0 scale-100 opacity-100 duration-(--motion-base) ease-out"
            : cn(
                "pointer-events-none scale-95 opacity-0 duration-(--motion-fast) ease-in",
                drop === "down" ? "-translate-y-1" : "translate-y-1",
              ),
        )}
      >
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={selected}
              tabIndex={-1}
              onClick={() => {
                onChange?.(option.value);
                close(true);
              }}
              className={cn(
                "flex h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-left",
                "text-fg-primary text-sm",
                "transition-colors duration-(--motion-fast) ease-out",
                "motion-reduce:transition-none",
                // The fill is the focus indicator here - see the docblock.
                "hoverable:bg-menu-row-hover focus:bg-menu-row-hover focus:outline-none",
              )}
            >
              {option.icon ? <Icon name={option.icon} size="md" /> : null}
              <span>{option.label ?? option.value}</span>
              {/* The check's box is always reserved so rows align and the
                  panel cannot change width as the selection moves. */}
              <span aria-hidden="true" className="ml-auto inline-flex w-5 justify-end pl-1">
                {selected ? <Icon name="check" size="sm" className="text-link-current" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
