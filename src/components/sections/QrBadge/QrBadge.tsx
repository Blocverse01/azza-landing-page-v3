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
 * self-positions `absolute right-[82px] top-[488px]` inside its hero's
 * positioning context, which is the contract in components.md S6; the four hero
 * owners supply the `relative` ancestor and pass nothing.
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
        // Placement - components.md S6. The hero owns the positioning context.
        "absolute top-[488px] right-[82px]",
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
