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
  /**
   * Marks the nav item for the current route with aria-current + nav.fg-current.
   *
   * OPTIONAL, and falls back to `usePathname()`. It was required, and that was
   * the sole reason `SiteChrome` carried `"use client"`: a server layout cannot
   * read its own pathname, so the only way to satisfy a required prop was to
   * make the caller a client component - which dragged `SkipLink` and `Footer`
   * into the client bundle with it. `TopNav` is already a client component and
   * already calls `usePathname()`, so reading it here costs nothing and lets the
   * caller stay on the server. The prop is kept so a caller that DOES hold the
   * path (a test, a story, a future server-resolved route segment) can override.
   */
  currentPath?: string;
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

/*
 * THE NO-JS COUNTERPART. Same shape as `layout.tsx`'s `.reveal` rescue and
 * `CardDeck`'s deck rescue: the fallback markup is always in the DOM and always
 * `display: none`, and this stylesheet - which only a browser with scripting
 * DISABLED ever applies - swaps which of the two is shown.
 *
 * Without it, below 1024 a no-JS reader gets the logo and the WhatsApp CTA and
 * nothing else: the bar's destination list is `hidden lg:flex` and the sheet
 * that replaces it opens from a `useState` setter that never runs. There is no
 * route out of the page.
 *
 * Written as a string through `dangerouslySetInnerHTML` because once scripting
 * is ENABLED the browser parses <noscript> content as raw text, so hydrating
 * real element children against that text node is a mismatch. Every selector is
 * a `[data-azza-nav-*]` attribute, so nothing outside this component is
 * reachable. `!important` beats the utilities it overrides for the reason
 * `layout.tsx` records: important always wins over normal, whatever the layer.
 *
 *   header    static + auto height. The bar is `sticky` at a FIXED 64/72/123px;
 *             the fallback lives inside it and would otherwise overflow that
 *             box AND pin a full-height panel to the top of the viewport.
 *   bar links hidden. At >= 1024 they would duplicate the fallback, and their
 *             two dropdown siblings cannot open without a script - so at every
 *             width the fallback is the complete list and the bar row is a
 *             partial one. One nav, not one and a half.
 *   trigger   hidden. Its entire behaviour is a state setter.
 *   sheet     hidden. `inert` and translated off-screen by props that never
 *             change without a script.
 */
const NO_JS_STYLE =
  "<style>" +
  "[data-azza-nav]{position:static!important;height:auto!important}" +
  "[data-azza-nav-links],[data-azza-nav-trigger],[data-azza-nav-sheet]{display:none!important}" +
  "[data-azza-nav-fallback]{display:block!important}" +
  "</style>";

/** 44px rows - the no-JS surface is the only nav there is, so it is not tight. */
const FALLBACK_ROW = cn(
  "flex min-h-11 items-center text-sm no-underline",
  "text-nav-fg hoverable:text-nav-fg-hover focus-visible:text-nav-fg-hover",
);

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

  /** The prop wins when given; otherwise the router's own value. */
  const activePath = currentPath ?? pathname;

  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
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
   * THE TRAP SPANS THE WHOLE <header>, not { trigger, ...panel }.
   *
   * The narrower cycle was wrong, and visibly so: `<header>` also holds the
   * logo home link and the bar's "Chat with Azza" CTA. Neither is inert, both
   * stay visible and mouse-clickable while the sheet is open, and both were
   * unreachable by keyboard - the trap wrapped straight over them. A control a
   * mouse can press and a keyboard cannot is the defect; the two states have to
   * agree. Marking them `inert` instead would agree by taking the CTA away from
   * the pointer as well, and the CTA is the product's conversion action.
   *
   * `focusableWithin` already excludes anything inside `[inert]` and anything
   * with no client rects, so the cycle self-selects: the `hidden lg:flex` bar
   * list and the no-JS fallback are `display: none` and drop out, collapsed
   * accordion panels are `inert` and drop out, and what remains is exactly the
   * visible interactive surface, in document order - logo, CTA, trigger, then
   * the sheet's own rows. Tab off the last wraps to the first and Shift+Tab off
   * the first wraps to the last, so focus still cannot reach the inert page.
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

    const cycle = focusableWithin(headerRef.current);
    if (cycle.length === 0) return;

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
      ref={headerRef}
      data-azza-nav=""
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
            {/*
             * `-my-3 py-3` is the responsive.md S6.1 hit expansion, the same
             * one `Footer.tsx` uses: 12px of padding above and below turns the
             * 20px wordmark into a 44px target, and the equal negative margin
             * cancels it in the flow so the margin box - which is what
             * `items-end` aligns - is still 20px and the glyph does not move by
             * a pixel. The link was a 20px target on all seven routes.
             */}
            <Logo
              variant="wordmark"
              height={20}
              asHomeLink
              className="-my-3 py-3"
            />

            <ul
              data-azza-nav-links=""
              className="hidden items-center gap-8 lg:flex"
            >
              {PRIMARY_NAV.map((item) => {
                const children = item.items;

                if (children) {
                  return (
                    <NavDropdown
                      key={item.label}
                      label={item.label}
                      items={children}
                      currentPath={activePath}
                    />
                  );
                }

                const href = item.href ?? "/";
                const isCurrent = activePath === href;

                return (
                  <li key={item.label}>
                    <Link
                      href={href}
                      prefetch={item.prefetch}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        // Same 44px hit expansion as the logo above. `inline-flex`
                        // is required, not cosmetic: vertical margins are ignored
                        // on a plain inline box, so the cancellation only works on
                        // an atomic inline one. The `ul` centre-aligns the 20px
                        // margin box, so the label stays exactly where it was.
                        "-my-3 inline-flex items-center py-3",
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
            {/*
             * THE DISPLAY SWITCH LIVES ON A WRAPPER, NOT ON `Button`.
             *
             * It used to be `className="hidden xs:inline-flex"` straight on the
             * Button, and below 480 that rendered BOTH this pill and the icon
             * button below it - two controls, same accessible name, two tab
             * stops. `Button` sets `inline-flex` in its own base string and `cn`
             * is a plain de-duplicating join with no Tailwind conflict
             * resolution, so `hidden` and `inline-flex` BOTH reached the class
             * attribute and the cascade - not the argument order - picked the
             * winner. Tailwind v4 emits the display group alphabetically
             * (`.contents .flex .grid .hidden .inline .inline-block
             * .inline-flex`), so `.inline-flex` is written after `.hidden`, has
             * equal specificity, and wins. The pill never hid.
             *
             * A wrapper fixes it at the source rather than out-shouting it: the
             * <span> has no base display of its own, so `hidden` is unopposed
             * below 480, and above it `xs:contents` wins because Tailwind
             * GUARANTEES variant rules are emitted after unprefixed ones - a
             * documented ordering, not an alphabetical accident.
             *
             * `contents` and not `block`/`inline-flex`: the wrapper then leaves
             * no box behind, so the Button stays the direct flex item of this
             * row and the >= 480 layout is byte-for-byte what it was.
             *
             * Do NOT collapse this back onto the Button, and do not "fix" it by
             * teaching `cn` to merge - see the note in src/lib/cn.ts.
             */}
            <span className="hidden xs:contents">
              <Button variant="chat" size="md" href={NAV_CTA.href}>
                {NAV_CTA.label}
              </Button>
            </span>

            {/*
             * Below `xs` the same action collapses to a 44x44 icon button and
             * the full-text CTA reappears as the first row of the sheet. Same
             * wrapper treatment as the pill above, inverted: the icon's own
             * `xs:hidden` happened to beat `Button`'s base `inline-flex`, but
             * only by the same stylesheet-order luck, so the pair is made
             * symmetric rather than left half-trapped.
             *
             * The two `!` utilities override `size="sm"`'s own `px-4`/auto width
             * to land exactly on 44x44. `shrink-0` is what KEEPS it there: this
             * row is a flex container, `flex-shrink` defaults to 1, and at 320
             * the row's content exceeded the 280px container and compressed both
             * this control and the trigger below it to 32.7px wide - under the
             * responsive.md S6.1 44px floor. A declared hit target that a parent
             * can renegotiate is not a hit target.
             */}
            <span className="contents xs:hidden">
              <Button
                variant="chat"
                size="sm"
                href={NAV_CTA.href}
                aria-label={NAV_CTA.label}
                className="w-11! shrink-0 px-0!"
              >
                <Icon name="social-whatsapp" size="sm" />
              </Button>
            </span>

            <button
              ref={triggerRef}
              data-azza-nav-trigger=""
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => (open ? close(true) : setOpen(true))}
              className={cn(
                // `shrink-0` for the reason given on the icon CTA above: this
                // is a flex item, so without it `size-11` is only an opening
                // offer and a crowded row at 320 shaved it to 32.7px wide.
                "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center",
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
        currentPath={activePath}
      />

      <noscript dangerouslySetInnerHTML={{ __html: NO_JS_STYLE }} />

      {/*
       * The no-JS navigation. `hidden` (the UTILITY, a normal declaration -
       * never the `hidden` ATTRIBUTE, which Tailwind v4's preflight pins with
       * `!important` and which an author rule then cannot reliably beat), so it
       * is inert, unfocusable and invisible whenever a script is running, and
       * `NO_JS_STYLE` above is the only thing that can reveal it.
       *
       * It carries EVERY destination, including the six inside the two
       * dropdowns - those are `<button>`-opened at every width, so without a
       * script they are unreachable on desktop too, not only below `lg`.
       *
       * Plain `<a>`, not `next/link`: with scripting off there is no router to
       * hand them to, and with scripting on this subtree is `display: none` so
       * nothing here should ever be prefetched or clicked.
       */}
      <nav
        data-azza-nav-fallback=""
        aria-label="All pages"
        className="hidden border-t border-nav-border bg-nav-surface"
      >
        <Container width="nav" className="flex flex-col gap-4 py-4">
          {PRIMARY_NAV.map((item) => {
            const children = item.items;

            if (children) {
              return (
                <div key={item.label}>
                  {/*
                   * A <p>, not a heading. These are group labels for a list, and
                   * two extra headings ahead of the page's own <h1> would break
                   * the outline for exactly the reader this block exists for.
                   * `aria-label` on the <ul> carries the grouping instead.
                   */}
                  <p className="text-xs text-nav-dropdown-fg-muted">
                    {item.label}
                  </p>
                  <ul aria-label={item.label}>
                    {children.map((child) => {
                      const external = !child.href.startsWith("/");

                      return (
                        <li key={child.href + child.label}>
                          <a
                            href={child.href}
                            {...(external
                              ? { target: "_blank", rel: "noreferrer noopener" }
                              : null)}
                            className={FALLBACK_ROW}
                          >
                            {child.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href ?? "/"}
                aria-current={activePath === item.href ? "page" : undefined}
                className={FALLBACK_ROW}
              >
                {item.label}
              </a>
            );
          })}
        </Container>
      </nav>
    </header>
  );
}
