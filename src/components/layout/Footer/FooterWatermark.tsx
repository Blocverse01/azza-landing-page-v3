import { cn } from "@/lib/cn";

export interface FooterWatermarkProps {
  children?: string;
}

/**
 * The oversized "USE AZZA" wordmark bled into the bottom of the footer -
 * Figma `498:637` (band) / `498:638` (text) / `498:639` (glow orb).
 *
 * IT IS TYPE, NOT AN ASSET. design/typography.md S4.2 records `498:638` as a
 * text node on the `accent-watermark` role (195px / 1.03 / -0.05em / weight 900)
 * and design/assets.md S10 records the orb as "Neither - CSS border-radius: 50%,
 * not an asset". `design-system/assets/brand/wordmark-azza-outline.svg` is a
 * different node entirely (`412:1251`, the `use Azza Today` CTA on `/`) and is
 * not used here.
 *
 * THE CLIPPING IS THE DESIGN. The node is 1002 x 162 with `textAutoResize: NONE`
 * while its own line box is 195 x 1.03 = 201px, so the glyphs are deliberately
 * cut off top and bottom. Reproduced with a shorter `overflow: hidden` box.
 *
 * The box height is expressed as a ratio of the type token rather than a fixed
 * 162px so that it tracks the clamp: design/responsive.md S7.1.1 requires the
 * band height to clamp with the wordmark at every stop, while typography.md S4.2
 * requires exactly 162px at the design width. `162 / 195` satisfies both - it
 * resolves to 162px when the clamp is at its 195px ceiling and shrinks in
 * proportion below it. The two numerals are the artifacts' own.
 *
 * DECORATIVE, and deliberately so. Contrast is 1.18:1 (`fg.ghost` on
 * `surface.inverse`) - design/color.md C-08 rules this intentional and
 * requires `aria-hidden="true"` with no accessible name. It carries no meaning
 * and contains nothing focusable.
 *
 * `overflow-hidden` is also what guarantees no horizontal overflow: the wordmark
 * is `whitespace-nowrap` at a clamped size, and any width it cannot fit is
 * clipped by this box rather than escaping into the page.
 *
 * CENTRED, BY OPERATOR RULING (2026-09-04). The first build set the glyphs
 * flush left, which left a visibly larger gap on the right of the band at
 * every width; the operator called it and the wordmark now centres in the
 * band. `text-center` composes with the clipping rather than fighting it:
 * any width the box cannot fit now clips evenly from BOTH ends instead of
 * amputating only the trailing "A"s. The glow orb keeps its band-relative
 * 47.3% - it is a 75px-blurred ambient glow a few percent off band centre,
 * and re-deriving its offset against the centred glyph run would trade a
 * font-metrics dependency for a shift the blur makes invisible.
 */
export function FooterWatermark({ children = "USE AZZA" }: FooterWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden select-none"
      style={{ height: "calc(var(--text-accent-watermark) * 162 / 195)" }}
    >
      <span className="font-accent text-accent-watermark text-fg-ghost absolute inset-x-0 top-0 block text-center whitespace-nowrap">
        {children}
      </span>

      {/*
       * `498:639` - a 135 x 135 disc at x 474, y 13 inside the 1002 x 162 band,
       * carrying a 75px LAYER_BLUR (`spacing.blur-glow`) and `overlay.glow-brand`.
       * Placed in percentages so it holds its position as the band clamps:
       * 474/1002 = 47.3%, 135/1002 = 13.47%, 13/162 = 8%.
       *
       * The blur scales with the band for the same reason. `spacing.blur-glow` is
       * 75px against a 135px disc; holding it at 75px while the disc shrinks with
       * the container turns a soft halo into a diffuse block that reads as a
       * rendering fault at `md` and below. `* 75 / 195` reproduces the token
       * exactly where the type clamp tops out and keeps the ratio below it.
       */}
      <span
        className={cn(
          "pointer-events-none absolute top-[8%] left-[47.3%] block aspect-square w-[13.47%]",
          "bg-overlay-glow-brand rounded-full mix-blend-difference",
        )}
        style={{ filter: "blur(calc(var(--text-accent-watermark) * 75 / 195))" }}
      />
    </div>
  );
}
