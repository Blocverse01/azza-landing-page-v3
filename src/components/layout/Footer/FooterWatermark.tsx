export interface FooterWatermarkProps {
  children?: string;
}

/**
 * The oversized "USE AZZA" wordmark bled into the bottom of the footer -
 * Figma `891:1710` (band) / `891:1711` (text), the 2026-09-08 footer
 * (`891:1672`), which replaced `498:637` / `498:638` / `498:639`.
 *
 * IT IS TYPE, NOT AN ASSET. `891:1711` is a text node on the
 * `accent-watermark` role - now 250px Extra Bold at -0.05em in `fg.muted`
 * (#838383), where `498:638` was 195px Black in `fg.ghost` (#222) - and
 * `design-system/assets/brand/wordmark-azza-outline.svg` is a different node
 * entirely (`412:1251`, the `use Azza Today` CTA on `/`) and is not used here.
 * The orb (`498:639`, the blurred brand disc in `mix-blend-difference`) is
 * gone from the new frame and gone from here.
 *
 * THE BAND IS THE TEXT'S OWN HEIGHT, NOT THE FRAME'S 162. `891:1710` is a
 * 1002 x 162 band and `891:1711`, cap-trimmed (`text-box: trim-both cap
 * alphabetic`), measures 1256 x 179 with its caps flush to the band's top -
 * so the frame cuts 17px off every letter's foot. Built that way, the cut
 * read as a chop rather than a bleed on the substituted face, and the
 * operator ruled against it (2026-09-08, "text is getting cut off"). So the
 * band no longer fixes a height: the span sits in flow and the cap trim
 * makes its box exactly the cap height (179 at 250px), which is what the
 * band becomes - 17px taller than the frame at 1440, and the whole glyph
 * visible. Where `text-box` is unsupported (Firefox) the box is the full
 * 1.03 line, a little air above and below the caps - looser, never cut, the
 * ExchangeWidget precedent.
 *
 * The 1256 still overhangs the band by 127px each side, exactly centred (its
 * centre is the band's, 501). `text-center` keeps it so at every width, and
 * clips any width the viewport cannot hold evenly from both ends (operator
 * ruling, 2026-09-04).
 *
 * DECORATIVE, and deliberately so. It carries no meaning and contains nothing
 * focusable, so it is `aria-hidden` with no accessible name - the C-08 ruling
 * that covered the old 1.18:1 ghost ink holds for the same reason even though
 * the new grey reads at 4.6:1.
 *
 * THE BAND CLIPS NOTHING. The horizontal clip that stops the 127px overhang
 * becoming page-wide scroll sits on the <footer> itself, at the viewport
 * (`overflow-x-clip` in Footer.tsx); vertically there is nothing to clip any
 * more. The wordmark is `whitespace-nowrap` at a clamped size, so at every
 * width below the design's it is narrower than the band and the overhang
 * question does not arise.
 */
export function FooterWatermark({ children = "USE AZZA" }: FooterWatermarkProps) {
  return (
    <div aria-hidden="true" className="relative w-full select-none">
      <span className="font-accent text-accent-watermark text-fg-muted block text-center whitespace-nowrap [text-box:trim-both_cap_alphabetic]">
        {children}
      </span>
    </div>
  );
}
