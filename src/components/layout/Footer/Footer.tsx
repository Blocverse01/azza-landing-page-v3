import Link from "next/link";

import { Container, Logo } from "@/components/ui";
import { FOOTER_COLUMNS, FOOTER_LEGAL } from "@/content/footer";
import { cn } from "@/lib/cn";

import { FooterWatermark } from "./FooterWatermark";

export interface FooterProps {
  className?: string;
  /**
   * The route currently rendered. The matching footer link gets
   * `aria-current="page"` - design/responsive.md S6.4 row 9 asks for it on the
   * footer links as well as the nav ones, and until now `FooterProps` had no
   * way to receive it.
   *
   * OPTIONAL, and it stays optional. `Footer` is a SERVER component; the App
   * Router gives a server tree no way to read its own pathname, so the value
   * can only arrive from a caller that already holds it. Requiring it would
   * force every caller across a client boundary, which is the exact cost
   * `SiteChrome` is currently paying for `TopNav` and which this pass removes.
   * Omitted, the footer renders exactly as before and marks nothing.
   *
   * No visual treatment is attached: the design draws no "current" state for a
   * footer link and inventing one is not an implementation decision. This is
   * the assistive-technology cue only.
   */
  currentPath?: string;
}

/**
 * `tel:`, `mailto:` and absolute URLs must not go through `next/link`'s router.
 * Everything else is an in-app route.
 */
function isExternalHref(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

/**
 * Every footer link shares one treatment: `link.on-inverse` resolving to
 * `link.on-inverse-hover` on hover, per design/color.md. It sits inside the `hoverable:`
 * variant - `@media (hover: hover) and (pointer: fine)` - because an unguarded
 * `:hover` sticks after a tap on iOS Safari (components.md S10.6). It has a
 * `:focus-visible` twin, because no interactive state may be communicated by
 * hover alone.
 *
 * `-my-3 py-3` is the touch-target expansion from design/responsive.md S6.2:
 * the designed link is 22px tall on a 46px pitch, so 12px of padding above and
 * below produces a 46px target, and the equal negative margin cancels it in the
 * flow. Adjacent targets abut exactly and the rendering is unchanged at every
 * width - "zero visual change" is the artifact's own requirement.
 */
const LINK_CLASS = cn(
  "-my-3 inline-flex items-center py-3",
  "text-base text-link-on-inverse",
  "transition-colors duration-(--motion-fast) ease-out",
  "hoverable:text-link-on-inverse-hover focus-visible:text-link-on-inverse-hover",
);

/**
 * The site footer - Figma `498:599` and its seven identical siblings
 * (`498:641`, `498:683`, `412:2665`, `498:725`, `498:851`, `498:767`,
 * `500:2385`). Present on all eight frames, therefore on all seven routes.
 * Verified identical against `500:2385`: same tree, same copy, same geometry.
 * There is no variant, so there is no prop for one.
 *
 * GEOMETRY at the design width (design/layout.md S5.2, components.md S5):
 *
 *   footer box   1440 x 764, padding 107 top / 106 bottom
 *   content      1002 centred (`Container width="footer"`), V, gap 89
 *     upper      V, gap 48  -> link row / divider slot / legal row
 *       row      H, gap 100 -> logo column + four link columns at gap 80
 *     band       162 tall wordmark, clipped
 *
 * 107 / 106 / 89 are sanctioned off-scale values (layout.md S1.4) held in
 * `theme.css` as `--spacing-footer-*`; they are deliberately not balanced.
 * 107 + (160 + 48 + 0 + 48 + 44) + 89 + 162 + 106 = 764, so the designed height
 * falls out of the content and is never asserted as a fixed number.
 *
 * THE DIVIDER `498:633` RENDERS NO RULE. layout.md S5.2 adjudicated it against a
 * real render: it has no contrasting stroke and is invisible on the near-black
 * ground. Its zero-height slot is reserved, because the two 48px gaps around it
 * are what produce the measured 160 -> 208 -> 256 offsets.
 *
 * SERVER COMPONENT. Nothing here holds state and nothing needs a browser API.
 * `Reveal` is deliberately absent: components.md S10.4 excludes `Footer` and
 * `FooterWatermark` from scroll entrances by name.
 *
 * RESPONSIVE - design/responsive.md S7.1.1, every stop:
 *   base  logo above, link columns 1-col stacked, legal row stacked left
 *   xs    link columns 2 x 2
 *   sm    link columns 2 x 2, wider gap
 *   md    link columns 4-up in one row, logo above, legal row horizontal
 *   lg    logo left, 4-up links right - the designed arrangement
 *   xl/2xl  as designed, content 1002 centred
 */
export function Footer({ className, currentPath }: FooterProps) {
  return (
    <footer
      // Switches `:focus-visible` to `--color-focus-ring-inverse` for the whole
      // subtree - a dark-on-dark focus ring on `surface.inverse` is unusable.
      data-surface="inverse"
      className={cn(
        "bg-surface-inverse pt-(--spacing-footer-top) pb-(--spacing-footer-bottom)",
        className,
      )}
    >
      <Container width="footer" className="flex flex-col gap-(--spacing-footer-split)">
        {/*
         * 498:601 - V, gap 48.
         *
         * It is 1016 wide inside its own 1002 parent: (1002 - 1016) / 2 = -7, a
         * deliberate breakout that layout.md S3.1 and S6 both record. Those 14px
         * are load-bearing rather than cosmetic - 114 (logo) + 100 (gap) + 802
         * (links) is exactly 1016, so dropping the breakout makes the designed
         * 4-up link row wrap at the design width. Applied only from `lg`, where
         * the gutter is 48px or more and 7px of bleed cannot reach the viewport
         * edge.
         */}
        <div className="flex w-full flex-col gap-12 lg:-mx-[7px] lg:w-[calc(100%+14px)]">
          {/* 498:602 - logo column + link block */}
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-25">
            {/* 498:603 - wordmark 95x32 over the RC line, V, gap 8 */}
            <div className="flex shrink-0 flex-col gap-2">
              <Logo variant="wordmark" />
              <p className="text-fg-on-inverse text-sm">{FOOTER_LEGAL.rc}</p>
            </div>

            {/*
             * 498:613 - four columns of unequal measured width (199/128/116/119)
             * at gap 80. Laid out with `flex` at md and above, never a grid,
             * which would equalise widths the design does not equalise
             * (components.md S7.4). The 2 x 2 arrangement below md is a grid
             * because there equal columns are the intended result.
             *
             * Every gap is axis-specific on purpose: a bare `md:gap-20` and an
             * `sm:gap-x-16` are the same CSS property written two ways, and
             * which one wins depends on stylesheet order rather than on the
             * breakpoint.
             *
             * The four columns measure 199 + 128 + 116 + 119 = 562, so the
             * designed 80px gap needs 802px and only fits once the container
             * reaches its 1002 + 14 pin. The gap steps down to 48 at `lg` and 40
             * at `md` so the 4-up row survives the narrower containers there, as
             * responsive.md S7.1.1 requires. `flex-wrap` is the safety net: if a
             * fallback face measures wider than Inter, a column drops to a
             * second row rather than pushing the page sideways.
             */}
            <nav aria-label="Footer" className="w-full">
              <div
                className={cn(
                  "flex flex-col gap-y-10",
                  "xs:grid xs:grid-cols-2 xs:gap-x-10 xs:gap-y-12",
                  "sm:gap-x-16",
                  "md:flex md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-12",
                  "lg:gap-x-12",
                  "xl:gap-x-20",
                )}
              >
                {FOOTER_COLUMNS.map((column) => (
                  <div key={column.heading} className="flex flex-col gap-6">
                    {/*
                     * typography.md S4.2 maps the footer column heading to the
                     * `text-base-bold` role (Inter Bold 18 / 1.21 / -0.02em) and
                     * names h4 alongside it. The TOKEN is what that artifact
                     * owns and it is unchanged; the LEVEL is a per-page fact and
                     * h4 was wrong here. The last heading before the footer is an
                     * <h2> on `/` and on `/help`'s article state, so h4 skipped a
                     * level in the document outline. h3 is the first level that
                     * is correct on every one of the seven routes.
                     */}
                    <h3 className="text-base-bold text-fg-on-inverse">{column.heading}</h3>
                    <ul className="flex flex-col gap-6">
                      {column.links.map((link) => {
                        const external = isExternalHref(link.href);

                        return (
                          <li key={link.href} className="flex">
                            {external ? (
                              <a href={link.href} className={LINK_CLASS}>
                                {link.label}
                              </a>
                            ) : (
                              <Link
                                href={link.href}
                                prefetch={link.prefetch}
                                aria-current={
                                  currentPath === link.href ? "page" : undefined
                                }
                                className={LINK_CLASS}
                              >
                                {link.label}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>

          {/* 498:633 - reserves the flow slot, renders no visible rule. */}
          <div aria-hidden="true" className="h-0 w-full" />

          {/* 498:634 - H, SPACE_BETWEEN across the full width. */}
          <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-fg-on-inverse-muted text-base">{FOOTER_LEGAL.copyright}</p>
            <p className="text-fg-on-inverse-muted text-base">{FOOTER_LEGAL.rights}</p>
          </div>
        </div>

        <FooterWatermark />
      </Container>
    </footer>
  );
}
