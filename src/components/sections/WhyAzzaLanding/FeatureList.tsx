/*
 * FeatureList - Figma 570:436, the seven-row selectable list inside the landing
 * "Why Azza?" section (570:434).
 *
 * NO "use client" DIRECTIVE HERE, DELIBERATELY. components.md S3: a file that is
 * only ever imported by a client component is client-bundle by import, not by
 * directive. Adding one here would be noise and would hide which file is the
 * real entry point (WhyAzzaLanding.tsx, which holds the state).
 *
 * WHAT THE FIGMA FRAME ACTUALLY SHOWS. Six of the seven rows are authored as
 * 32px-tall boxes containing ~100px of content, with `clipsContent: true` on the
 * parent - so their descriptions overflow and are clipped. layout.md S6.1
 * rendered the section and resolved it: that is a COLLAPSED ACCORDION STATE, not
 * a defect to reproduce. Collapsed rows render title-only at 40% opacity; the one
 * active row (570:446 "Create Your Azza Name") renders title + description at
 * full opacity with the 22x23 marker (570:460) on the container's left edge.
 * Row gap is 40 in both states.
 */

import { Disclosure } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface Feature {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

/*
 * Copy transcribed verbatim from 570:437 - 570:457.
 *
 * 570:445 and 570:451 each carry a second, empty paragraph holding a single
 * zero-width space. That is authoring debris in the source file, not content;
 * only the real sentence is transcribed. Reported in `findings`.
 */
export const FEATURES: readonly Feature[] = [
  {
    id: "buy-crypto",
    title: "Buy Crypto",
    body: "Buy USDT and other supported cryptocurrencies instantly using your local currency.",
  },
  {
    id: "sell-crypto",
    title: "Sell Crypto",
    body: "Convert crypto to cash and receive funds directly into your bank account.",
  },
  {
    id: "ngn-to-zar",
    title: "NGN to ZAR",
    body: "Send value from Naira to South African Rand quickly and seamlessly.",
  },
  {
    id: "create-your-azza-name",
    title: "Create Your Azza Name",
    body: "Create your unique Azza identity and receive payments without sharing long wallet addresses.",
  },
  {
    id: "ngn-to-ghs",
    title: "NGN to GHS",
    body: "Convert Nigerian Naira to Ghanaian Cedi instantly at competitive rates.",
  },
  {
    id: "ngn-to-kes",
    title: "NGN to KES",
    body: "Move money from Nigeria to Kenya in seconds without traditional remittance delays.",
  },
  {
    id: "buy-data",
    title: "Buy Data",
    body: "Purchase mobile data bundles for yourself, friends, or family in seconds.",
  },
] as const;

/** The row the design ships open: 570:446, the only one hugging its full height. */
export const DEFAULT_FEATURE_ID = "create-your-azza-name";

export interface FeatureListProps {
  features: readonly Feature[];
  /** Controlled. Exactly one row is open at a time; there is no all-closed state. */
  activeId: string;
  onActiveChange: (id: string) => void;
  className?: string;
}

export function FeatureList({
  features,
  activeId,
  onActiveChange,
  className,
}: FeatureListProps) {
  return (
    <ul
      className={cn(
        /*
         * The left rail. layout.md S8.2: the marker sits on the 1200 container's
         * left edge (x=120) while the list text is inset a further 68 (x=188).
         * The rail is the padding; the marker hangs back into it at -left-*.
         * 68px at lg+, narrowed to 32 below it so a 320px viewport keeps the
         * affordance without spending a quarter of its width on it.
         */
        "grid grid-cols-1 items-start gap-10 pl-8",
        /*
         * responsive.md S7.2.2 `md`: features in two columns, 4 + 3.
         * `grid-flow-col` + four row tracks fills column one with rows 1-4 and
         * column two with 5-7, which keeps DOM order == reading order.
         *
         * The tracks are `min-content`, NOT `grid-rows-4`. Tailwind's numeric
         * form emits `repeat(4, minmax(0, 1fr))`, which makes every track as tall
         * as the tallest - so the one expanded row inflates all four and opens
         * ~70px of dead space under every collapsed title.
         *
         * `items-start` then pins each row to the top of its track, so expanding
         * a row in one column never drags its neighbour down.
         */
        "md:grid-flow-col md:grid-cols-2 md:grid-rows-[repeat(4,min-content)] md:gap-x-10",
        /* lg+: back to the designed single column. */
        "lg:grid-flow-row lg:grid-cols-1 lg:grid-rows-none lg:pl-17",
        className,
      )}
    >
      {features.map((feature) => (
        <li key={feature.id} className="relative">
          <Disclosure
            open={feature.id === activeId}
            /*
             * Select-only, never deselect. The design has no all-closed state -
             * the marker and one description are always visible - so re-pressing
             * the open row is a no-op rather than a collapse.
             */
            onOpenChange={() => onActiveChange(feature.id)}
          >
            {({ open, triggerProps, panelProps }) => (
              <div
                className={cn(
                  /*
                   * 40% opacity on a collapsed row is the design's own encoding
                   * of "inactive" (570:437 etc. carry `opacity: 0.4`), so the
                   * hover and focus affordances are expressed in the same
                   * variable rather than in an invented colour token.
                   * components.md S10.2: a state change runs at --motion-base.
                   */
                  "transition-opacity duration-(--motion-base) ease-out motion-reduce:transition-none",
                  open
                    ? "opacity-100"
                    : "opacity-40 hoverable:opacity-70 has-[:focus-visible]:opacity-70",
                )}
              >
                {/*
                 * The active-item marker, 570:460 (22 x 23, surface.brand-solid).
                 * It lives inside the row rather than in the section, so it
                 * tracks the active row for free and can never drift out of sync
                 * with it. `top-1` centres it on the 28px/1.13 title line.
                 */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-1 -left-8 h-[23px] w-[22px] bg-surface-brand-solid",
                    "transition-opacity duration-(--motion-base) ease-out motion-reduce:transition-none",
                    "lg:-left-17",
                    open ? "opacity-100" : "opacity-0",
                  )}
                />

                <h3 className="text-xl text-fg-primary">
                  {/*
                   * The trigger is always a <button> (Disclosure's contract), and
                   * it spans the row so the whole line is pressable. The design
                   * row is 32px tall, which fails the 44px minimum target in
                   * responsive.md S6.1; `py-1.5 -my-1.5` grows the hit box to 44
                   * into the 40px inter-row gap while taking zero space in flow.
                   */}
                  <button
                    {...triggerProps}
                    className="-my-1.5 block w-full cursor-pointer py-1.5 text-left"
                  >
                    {feature.title}
                  </button>
                </h3>

                {/*
                 * components.md S10.5: panel height animates
                 * `grid-template-rows: 0fr -> 1fr`, never `max-height`. D-030:
                 * spread panelProps, drop `hidden` (display:none cannot
                 * transition) and mark the collapsed panel `inert` so its content
                 * leaves the focus order and the a11y tree while staying
                 * animatable.
                 */}
                <div
                  {...panelProps}
                  hidden={undefined}
                  inert={!open}
                  className={cn(
                    "grid ease-in-out",
                    "transition-[grid-template-rows] duration-(--motion-base) motion-reduce:transition-none",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p
                      className={cn(
                        "pt-4 text-md-feature text-fg-muted",
                        "transition-opacity duration-(--motion-fast) motion-reduce:transition-none",
                        open
                          ? "opacity-100 delay-[40ms] ease-out"
                          : "opacity-0 ease-in",
                      )}
                    >
                      {feature.body}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Disclosure>
        </li>
      ))}
    </ul>
  );
}
