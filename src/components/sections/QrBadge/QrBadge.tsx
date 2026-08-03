import qrWhatsapp from "@design-system/assets/brand/qr-whatsapp.png";

import { Media, VisuallyHidden } from "@/components/ui";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";
import { cn } from "@/lib/cn";

export interface QrBadgeProps {
  className?: string;
}

/**
 * The WhatsApp QR badge - `412:884`, `511:464`, `412:1990`, `412:2602`.
 *
 * A 120x174 floating card, not a full-width band (DECISIONS D-013). It
 * self-positions `absolute top-[488px]` at a right inset of 82 measured from
 * the 1440 design frame inside its hero's positioning context, which is the
 * contract in components.md S6; the four hero owners supply the `relative`
 * ancestor and pass nothing. See the note on the placement classes for why the
 * inset is anchored to the frame rather than to the viewport.
 *
 * Geometry is layout.md S5.4's reconciliation of the four disagreeing
 * placements, restated in components.md S6:
 *
 *   card    120 x 174   padding 12 top / 14 bottom, radius.xl, surface.contrast
 *   column  120 x 148   V, gap 12
 *   tile    120 x 102   qr-whatsapp.png at 102 x 102, inset 9 each side
 *   caption  92 x  34   "Text Azza on WhatsApp", text-xs-btn, centred
 *
 * ACCESSIBILITY - the whole badge is ONE `<a>`, never a bare `<img>`.
 * A QR code is an actionable control, so the control carries the accessible
 * name and the bitmap is decorative (`alt=""`). One accessible name, never two
 * (components.md S4.5). The visually hidden sentence is the text alternative to
 * scanning: nobody can scan a code with the device already displaying it, and a
 * screen-reader user cannot scan it at all - both activate the same link and
 * land in the same chat.
 *
 * Below `lg` the badge is `display: none`, which removes it from the
 * accessibility tree outright (responsive.md S7.1.2). The action survives as the
 * nav's "Chat with Azza" CTA, which is the modality-appropriate form on a phone.
 */
export default function QrBadge({ className }: QrBadgeProps) {
  return (
    <a
      href={WHATSAPP_CHAT_URL}
      className={cn(
        /*
         * Placement - components.md S6. The hero owns the positioning context,
         * and that context is the FULL-WIDTH hero box on all four call sites.
         *
         * WHAT THE 82 IS MEASURED FROM. layout.md S5.4 and S9 both prescribe the
         * literal `right: 82px` and neither says from which edge, because at
         * 1440 the viewport and the design frame coincide and the question could
         * not arise during extraction. Taken literally against a full-width
         * containing block it means "82 from the VIEWPORT", which made this the
         * one element in the build that does not obey responsive.md S3.3 - "the
         * container pins at 1200 (reached at 1360) and gutters grow. Nothing
         * scales fluidly above 1440. Applied without exception." Measured in a
         * browser before this change: at 1440 the badge sat at x 1238 and
         * overlapped every hero composition as designed; at 1920 it sat at x
         * 1718 and cleared the content by 319 / 188 / 158 / 118px on
         * `/`, crypto-wallet, cross-border and for-business respectively - it
         * floated alone in the empty right gutter.
         *
         * RESOLUTION, decided against the Figma file. What the design fixes is
         * the badge's position RELATIVE TO THE HERO COMPOSITION, not its
         * distance from the browser edge: `511:464` sits at x 1259 and
         * `412:1990` / `412:2602` at x 1239 inside a 1440 frame, each a fixed
         * inset from that frame - and layout.md S9 classifies the floater as
         * `fixed`, never fluid. So the 82 is measured from the right edge of the
         * 1440 DESIGN FRAME, and above 1440 that frame centres and the surplus
         * goes to the gutters, exactly as `.azza-container` does for content:
         *
         *     min(100%, 90rem)          the design frame, clamped to the viewport
         *     (100% - that) / 2         one gutter's share of the surplus
         *     + 82px                    the design's own inset
         *
         * At and below 1440 the first term is 0 and this is byte-for-byte the
         * previous `right: 82px`, so nothing at or under the design width moves
         * - including the `xl` collision gates the two product heroes carry.
         * Above 1440 the badge keeps its exact designed relationship to the
         * content: it still overlaps the crypto-wallet container by 52px, the
         * cross-border container by 82px and the for-business card by 122px, and
         * still clears the landing column by 79px, at every width.
         */
        "absolute top-[488px] right-[calc((100%_-_min(100%,90rem))_/_2_+_82px)]",
        // Hidden below lg: a QR code cannot be scanned by the device rendering
        // it. `display: none` also takes it out of the a11y tree, so a static
        // aria-hidden would be redundant below lg and wrong at lg and above.
        "hidden w-30 flex-col items-center gap-3 pt-3 pb-3.5 lg:flex",
        "bg-surface-contrast rounded-xl",
        // The Card `interactive` treatment, applied to the anchor itself:
        // translateY only, its focus-visible twin, no scale (components.md
        // S10.6).
        // `translate`, not `transform`: Tailwind v4 emits `-translate-y-1` as the
        // standalone `translate` property, so the old transform list animated
        // nothing and the lift jumped while the shadow faded.
        "transition-[translate,box-shadow] duration-(--motion-base) ease-out",
        "hoverable:-translate-y-1 hoverable:shadow-hover-lift",
        "focus-visible:shadow-hover-lift focus-visible:-translate-y-1",
        className,
      )}
    >
      {/* 102 x 102 inside the 120 column - `items-center` is the 9px inset. */}
      <span className="w-[102px]">
        <Media src={qrWhatsapp} alt="" ratio="1/1" sizes="102px" priority className="rounded-md" />
      </span>

      <span className="text-xs-btn text-fg-caption-soft w-23 text-center">
        Text Azza on WhatsApp
      </span>

      <VisuallyHidden>
        Scan the code with your phone, or open this link to start the chat.
      </VisuallyHidden>
    </a>
  );
}
