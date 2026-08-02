import { Section } from "@/components/ui";

import { WrappedBand } from "./WrappedBand";
import { WrappedControls } from "./WrappedControls";

/**
 * Azza Wrapped - Figma `412:1154`, the sixth section on `/`.
 *
 * GEOMETRY (layout.md S4.2, row y=4571)
 * ------------------------------------
 * The section is 924 tall and carries no auto-layout: the band `412:1155` is
 * full-bleed at y=0 with no padding above it, then 56.2 to the control row
 * `412:1221` at (150, 809), then 59 of trailing padding. That is why the
 * rhythm is `flush` rather than `standard` - an 80px top pad would push the
 * band off its measured seam with the FAQ section above.
 *
 * The 56 and the 60 below are the design's own 56.179 and 59, snapped to the
 * 4px spacing scale. They live on the controls rather than on `<Section>`
 * because `flush` emits the `p-0` shorthand and a competing `pb-*` on the same
 * element would depend on Tailwind's utility ordering to resolve.
 *
 * The band is full-bleed and the controls sit in the 1140 container, so the
 * section itself takes `container="bleed"` and each child brings its own
 * measure.
 */

/** The band's id, so the carousel arrows can point `aria-controls` at it. */
const BAND_ID = "azza-wrapped-card";

/** The "AZZA WRAPPED" lockup inside the band is the section's heading. */
const HEADING_ID = "azza-wrapped-title";

export function AzzaWrapped() {
  return (
    <Section rhythm="flush" container="bleed" gap={0} aria-labelledby={HEADING_ID}>
      <WrappedBand id={BAND_ID} headingId={HEADING_ID} />
      <WrappedControls bandId={BAND_ID} className="mt-14 mb-15" />
    </Section>
  );
}

export default AzzaWrapped;
