"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Button, Container, Icon, Logo } from "@/components/ui";
import { NAV_CTA, PRIMARY_NAV } from "@/content/navigation";
import { cn } from "@/lib/cn";

import { MobileNavPanel } from "./MobileNavPanel";
import { NavDropdown } from "./NavDropdown";

export interface TopNavProps {
  /** Marks the nav item for the current route with aria-current + nav.fg-current. */
  currentPath: string;
}

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableWithin(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      !element.closest("[inert]") && element.getClientRects().length > 0,
  );
}

/**
 * The site's top navigation - 412:2066 and its seven identical siblings
 * (511:432, 412:1831, 412:2609, 412:2779, 412:2803, 498:210, 500:2282). All
 * eight render at 1440 x 123 with zero disagreement (layout.md S5.1), so this
 * is one component with no variants.
 *
 * GEOMETRY. The bar is full-bleed white; the contents are an 852px island
 * centred on the viewport, `justify-content: space-between`. The 258px gap in
 * the Figma auto-layout is computed slack, not a designed gap - logo cluster
 * 450.4 + CTA 144 + 258 = 852.4 exactly - so there is no magic number here.
 * The island is deliberately NOT aligned to any content container; do not
 * "fix" it to 1200 (layout.md S3, flagged twice).
 *
 * HEIGHT steps 64 (base) / 72 (`xs`-`md`) / 123 (`lg`+). It is published as
 * `--azza-nav-h` on the <header> so the sheet below can offset itself against
 * whichever step is live, without duplicating the media queries.
 *
 * The desktop dropdowns are replaced wholesale below `lg` (1024) rather than at
 * the width where the island geometrically breaks - hover-opened dropdowns have
 * no acceptable touch equivalent at any width, and 1024 is where every other
 * two-column split in the site stacks.
 *
 * `Reveal` is deliberately absent: components.md S10.4 excludes TopNav from
 * scroll entrances.
 */
export function TopNav({ currentPath }: TopNavProps) {
  const menuId = useId();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  /** Set false only for the viewport-crossing close, where the trigger is gone. */
  const restoreFocusRef = useRef(true);
  const wasOpenRef = useRef(false);

  const close = useCallback((restoreFocus = true) => {
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
  }, []);

  /* --- Dismissal 4: route change. ---------------------------------------- */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* --- Dismissal 5: crossing to >= 1024. --------------------------------
   * Non-negotiable. At `lg` the desktop nav appears and the panel becomes
   * invisible; if it stayed "open" the `inert` on <main> would silently trap
   * the whole page. A `matchMedia` change subscription, never a resize poll.
   */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        restoreFocusRef.current = false;
        setOpen(false);
      }
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  /* --- Scroll lock. -------------------------------------------------------
   * `overflow: hidden` on <html> is not sufficient on iOS Safari; the fixed-body
   * sequence below is. The scroll position is captured on open and restored on
   * close, including an Escape close - losing it 4,000px into the landing page
   * would be a severe regression.
   *
   * `inert` on <main> and <footer> is what isolates the sheet without lying
   * about the content type the way `role="dialog"` would. Both are owned by
   * SiteChrome (wave 2D) and may not exist yet, hence the null guards.
   */
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const isolated = [
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter((element): element is HTMLElement => element !== null);

    for (const element of isolated) {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
    }

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);

      for (const element of isolated) {
        element.removeAttribute("inert");
        element.removeAttribute("aria-hidden");
      }
    };
  }, [open]);

  /* --- Focus in on open, focus back to the trigger on close. --------------
   * Declared AFTER the scroll lock on purpose: effects run in declaration
   * order, and focusing an element inside the fixed sheet before the body is
   * pinned lets the browser scroll the page to reveal it - which would corrupt
   * the very scroll position the lock above has just captured. `preventScroll`
   * is the second guard on the same hazard.
   */
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;

    if (open) {
      // The first focusable INSIDE the panel, never the container itself.
      focusableWithin(panelRef.current)[0]?.focus({ preventScroll: true });
      return;
    }

    if (wasOpen && restoreFocusRef.current) {
      triggerRef.current?.focus({ preventScroll: true });
    }
    restoreFocusRef.current = true;
  }, [open]);

  /* --- Escape (dismissal 1) and the focus trap. ---------------------------
   * Bound in the CAPTURE phase so one Escape always closes the whole sheet,
   * even when focus sits on an open accordion trigger whose own handler would
   * otherwise swallow it. A sheet is one layer to the user; staged dismissal
   * is surprising.
   *
   * The trap spans { trigger, ...panel }. Tab off the last member wraps to the
   * trigger and Shift+Tab off the trigger wraps to the last, so focus cannot
   * reach the page behind while it is inert.
   */
  const onKeyDownCapture = (event: KeyboardEvent<HTMLElement>) => {
    if (!open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }

    if (event.key !== "Tab") return;

    const trigger = triggerRef.current;
    if (!trigger) return;

    const cycle = [trigger, ...focusableWithin(panelRef.current)];
    const first = cycle[0];
    const last = cycle[cycle.length - 1];
    const active = document.activeElement;

    if (!(active instanceof HTMLElement) || !cycle.includes(active)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const bar = "block h-0.5 w-full rounded-pill bg-current";
  const barMotion =
    "transition-[transform,opacity] duration-(--motion-base) ease-in-out motion-reduce:transition-none";

  return (
    <header
      onKeyDownCapture={onKeyDownCapture}
      className={cn(
        // The one place the bar height is declared. Everything else reads it.
        "[--azza-nav-h:64px] xs:[--azza-nav-h:72px] lg:[--azza-nav-h:var(--height-nav)]",
        "sticky top-0 z-50 h-(--azza-nav-h)",
        // The design has no bottom border (color.md D-6); nav and page are both
        // white, so the bar dissolves against content on scroll without one.
        // `nav.border` is the token derived for exactly this.
        "border-b border-nav-border bg-nav-surface",
      )}
    >
      <nav aria-label="Primary" className="h-full">
        <Container
          width="nav"
          className="flex h-full items-center justify-between gap-4"
        >
          {/* Left cluster. `items-end` reproduces the design's MAX cross-axis
              alignment - the 20px logo and the 19px link row are baseline
              matched, not centre matched (layout.md S8). */}
          <div className="flex items-end gap-8">
            <Logo variant="wordmark" height={20} asHomeLink />

            <ul className="hidden items-center gap-8 lg:flex">
              {PRIMARY_NAV.map((item) => {
                const children = item.items;

                if (children) {
                  return (
                    <NavDropdown
                      key={item.label}
                      label={item.label}
                      items={children}
                      currentPath={currentPath}
                    />
                  );
                }

                const href = item.href ?? "/";
                const isCurrent = currentPath === href;

                return (
                  <li key={item.label}>
                    <Link
                      href={href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "text-sm no-underline",
                        "transition-colors duration-(--motion-fast) ease-out",
                        "motion-reduce:transition-none",
                        isCurrent ? "text-nav-fg-current" : "text-nav-fg",
                        "hoverable:text-nav-fg-hover focus-visible:text-nav-fg-hover",
                        "active:text-link-active",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right cluster. The CTA stays in the BAR at every width - it is the
              product's entire conversion action and burying it behind a
              hamburger would be a conversion regression. */}
          <div className="flex items-center gap-2">
            <Button
              variant="chat"
              size="md"
              href={NAV_CTA.href}
              className="hidden xs:inline-flex"
            >
              {NAV_CTA.label}
            </Button>

            {/*
             * Below `xs` the same action collapses to a 44x44 icon button and
             * the full-text CTA reappears as the first row of the sheet. The
             * two `!` utilities override `size="sm"`'s own `px-4`/auto width to
             * land exactly on 44x44; `cn` is a plain join, so without them the
             * winner would be decided by stylesheet order rather than intent.
             */}
            <Button
              variant="chat"
              size="sm"
              href={NAV_CTA.href}
              aria-label={NAV_CTA.label}
              className="w-11! px-0! xs:hidden"
            >
              <Icon name="social-whatsapp" size="sm" />
            </Button>

            <button
              ref={triggerRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => (open ? close(true) : setOpen(true))}
              className={cn(
                "inline-flex size-11 cursor-pointer items-center justify-center",
                "rounded-2xl text-nav-fg lg:hidden",
                "transition-colors duration-(--motion-fast) ease-out",
                "motion-reduce:transition-none",
                "hoverable:text-nav-fg-hover",
              )}
            >
              {/* Hamburger to X. No hamburger or close glyph exists in the
                  design or the exported set (icons.md F-8) and the whole mobile
                  bar is invented chrome, so this is drawn from three rules
                  rather than a fabricated SVG. */}
              <span aria-hidden="true" className="relative block h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0",
                    bar,
                    barMotion,
                    open ? "top-[7px] rotate-45" : "top-0 rotate-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute top-[7px] left-0",
                    bar,
                    barMotion,
                    open ? "opacity-0" : "opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0",
                    bar,
                    barMotion,
                    open ? "top-[7px] -rotate-45" : "top-[14px] rotate-0",
                  )}
                />
              </span>
            </button>
          </div>
        </Container>
      </nav>

      <MobileNavPanel
        open={open}
        id={menuId}
        panelRef={panelRef}
        onDismiss={() => close(true)}
        currentPath={currentPath}
      />
    </header>
  );
}
