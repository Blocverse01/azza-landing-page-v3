import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Container, type ContainerWidth } from "./Container";

/**
 * Vertical rhythm - design/layout.md S4.1.
 *
 *   standard  py-20  (80/80)   - 17 of 22 sections
 *   spotlight py-25  (100/100) - 412:2196, 458:261
 *   deep      py-30  (120/120) - 800:393 (the business narrative)
 *   final     pt-20 pb-30 (80/120) - 802:627 (the blog grid; the 2026-08
 *             revision gave the section its own 80 top where the original
 *             500:2197 leaned on the hero's 80 for the seam)
 *   flush     p-0              - nav, footer
 */
export type SectionRhythm = "standard" | "spotlight" | "deep" | "final" | "flush";

/*
 * Sections abut at exactly 0px (layout.md S0.1). ALL vertical rhythm lives in
 * each section's own padding-block, and no <section> may ever carry
 * `margin-block` - layout.md S10.3 assertion 1.
 *
 * The stepped ramp is responsive.md S4.3: 56 / 64 / 72 / 80 / 96 / design value
 * at base / xs / sm / md / lg / xl. It is applied so that a section never
 * exceeds its own design value on the way up, which is why `standard` reaches
 * 80 at `md` and stops there while `spotlight` keeps climbing to 100.
 */
const RHYTHM_CLASS: Record<SectionRhythm, string> = {
  standard: "py-14 xs:py-16 sm:py-18 md:py-20",
  spotlight: "py-14 xs:py-16 sm:py-18 md:py-20 lg:py-24 xl:py-25",
  deep: "py-14 xs:py-16 sm:py-18 md:py-20 lg:py-24 xl:py-30",
  final: "py-14 xs:py-16 sm:py-18 md:py-20 lg:pb-24 xl:pb-30",
  flush: "p-0",
};

export interface SectionProps {
  /** Vertical rhythm. Default "standard". */
  rhythm?: SectionRhythm;
  /** Content container. Passed straight to <Container>. Default "default" (1200). */
  container?: ContainerWidth | number;
  /** Cross-axis alignment of the container's children. Default "center". */
  align?: "center" | "start";
  /** Gap between the section heading and the section body. Default 48 (the one constant). */
  gap?: 0 | 48;
  /** Full-bleed background utility, e.g. "bg-surface-subtle". Applied to the outer <section>. */
  background?: string;
  /**
   * Clips decorative bleed to the section box. Required wherever art overhangs.
   * Default false.
   *
   * Emits `overflow-clip`, NOT `overflow-hidden`. They clip identically, but
   * `hidden` makes the element a scroll container and a `position: sticky`
   * descendant of a non-scrolling scrollport is **silently inert** - it
   * typechecks, builds, and simply never sticks. The card deck lost a whole
   * scroll track to this before it was caught in a browser. `clip` does not
   * establish a scrollport, so sticky keeps working.
   */
  clip?: boolean;
  /** Rendered element. Default "section". */
  as?: "section" | "div";
  id?: string;
  "aria-labelledby"?: string;
  className?: string;
  children: ReactNode;
}

export function Section({
  rhythm = "standard",
  container = "default",
  align = "center",
  gap = 48,
  background,
  clip = false,
  as: Tag = "section",
  id,
  "aria-labelledby": ariaLabelledBy,
  className,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "w-full",
        RHYTHM_CLASS[rhythm],
        clip ? "overflow-clip" : undefined,
        background,
        className,
      )}
    >
      <Container
        width={container}
        className={cn(
          "flex flex-col",
          align === "start" ? "items-start" : "items-center",
          gap === 0 ? "gap-0" : "gap-12",
        )}
      >
        {children}
      </Container>
    </Tag>
  );
}
