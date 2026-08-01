import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The container register - design/layout.md S3.2 measured 13 distinct content
 * widths across 22 sections. An implementer who assumes one `max-w-[1200px]`
 * gets 9 of them wrong, so the register is named rather than collapsed.
 */
export type ContainerWidth =
  | "bleed" //  100%   - nav bar, footer bar, all section backgrounds
  | "deck" //  1300   - 412:2196 -> 511:364
  | "wide" //  1280   - 412:2437, 352:3583, 500:1736, 500:2305
  | "default" //  1200   - 553:288, 412:1854, 570:434            <- modal value
  | "grid" //  1160   - 500:2198, 352:3584, 352:3741
  | "footer" //  1002   - 498:600
  | "faq" //   987   - 412:1556 and its 3 siblings
  | "article" //   985   - 352:3682
  | "prose" //   842   - 352:3684, 352:3707  <- reading measure, never grows
  | "nav"; //   852   - 412:2067 + 412:2087, aligns to nothing else

const WIDTH_VAR: Record<Exclude<ContainerWidth, "bleed">, string> = {
  deck: "var(--container-deck)",
  wide: "var(--container-wide)",
  default: "var(--container-default)",
  grid: "var(--container-grid)",
  footer: "var(--container-footer)",
  faq: "var(--container-faq)",
  article: "var(--container-article)",
  prose: "var(--container-prose)",
  nav: "var(--container-nav)",
};

export interface ContainerProps {
  /**
   * A named width, or a literal px number for the 7 one-off section widths
   * (1140, 1100, 1056, 1016, 955, 878, 846). Default "default".
   */
  width?: ContainerWidth | number;
  as?:
    | "div"
    | "section"
    | "nav"
    | "header"
    | "footer"
    | "article"
    | "aside"
    | "ul"
    | "ol";
  className?: string;
  children: ReactNode;
}

/**
 * One mechanism, at every width:
 *
 *   width: min(<W>, 100% - 2 * var(--gutter));
 *   margin-inline: auto;
 *
 * `--gutter` steps 20/24/32/40/48/80 at base/xs/sm/md/lg/xl (responsive.md
 * S3.2). At 1440 that resolves `default` to exactly 1200 inside 120px gutters -
 * the design's own measurement - with no hard-coded number anywhere. Above
 * 1440 the width pins and the gutters absorb the surplus.
 *
 * layout.md owns W (the 1440 value); responsive.md owns the form. That is the
 * whole reconciliation.
 */
export function Container({
  width = "default",
  as: Tag = "div",
  className,
  children,
}: ContainerProps) {
  if (width === "bleed") {
    return (
      <Tag className={cn("azza-container-bleed", className)}>{children}</Tag>
    );
  }

  const resolved =
    typeof width === "number" ? `${width}px` : WIDTH_VAR[width];

  return (
    <Tag
      className={cn("azza-container", className)}
      style={{ "--azza-container-w": resolved } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
