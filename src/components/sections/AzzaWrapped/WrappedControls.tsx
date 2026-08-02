"use client";

import { useState } from "react";

import { Button, Container, Icon } from "@/components/ui";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * The control strip under the share card - Figma `412:1221`, 1139.5 x 56,
 * `justify-between` across the 1140 container (layout.md S3.2, S8.4).
 *
 * WHY THIS FILE IS THE CLIENT BOUNDARY
 * ------------------------------------
 * components.md S3 names exactly eleven `"use client"` files and this is one of
 * them, with the reason recorded as "Carousel prev/next + disabled ends". S8
 * maps the same file to `412:1221` - the whole strip, CTA included - so the
 * directive stays here rather than being pushed one level further down onto the
 * arrow pair alone. `Button` renders identically inside a client component; the
 * only cost is a few hundred bytes of bundle.
 *
 * HOW MANY CARDS THERE ARE
 * ------------------------
 * One. The design draws a single wrapped card and no second state, so the
 * carousel's index is pinned to a one-item set and both arrows sit at an end.
 * They are marked `aria-disabled` rather than `disabled`: a `disabled` button
 * leaves the focus order entirely, which would fail the keyboard-reachability
 * gate and hide the control from anyone navigating by tab. `aria-disabled`
 * keeps it reachable and announced as unavailable, which is the honest report
 * of what the design specifies. The index state is real, so adding cards is a
 * data change rather than a rewrite.
 */

/** The design draws exactly one wrapped card (`412:1155`). */
const CARD_COUNT = 1;

interface ArrowButtonProps {
  label: string;
  /** `true` renders the `arrow-right` glyph rotated 180 - icons.md F-4: the
   *  design ships two identical right-pointing arrows, so the "previous"
   *  control points the wrong way in Figma. Corrected here, not in the glyph. */
  previous?: boolean;
  disabled: boolean;
  controls: string;
  onActivate: () => void;
}

function ArrowButton({
  label,
  previous = false,
  disabled,
  controls,
  onActivate,
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={controls}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onActivate}
      className={cn(
        // 56 x 52 in the design; responsive.md S6.1 raises every target to a
        // 44px floor and this pair specifically to 56 x 56.
        "bg-surface-muted flex size-14 items-center justify-center rounded-2xl",
        // components.md S10.6, icon-only control: hover changes colour only,
        // press adds translateY(1px). Every hover rule has a :focus-visible
        // twin, and `hoverable:` is the project's (hover: hover) guard.
        "transition-[color,transform] duration-(--motion-instant) ease-out",
        disabled
          ? "text-fg-disabled cursor-not-allowed"
          : "text-fg-primary hoverable:text-fg-display focus-visible:text-fg-display active:translate-y-px",
      )}
    >
      <Icon name="arrow-right" rotate={previous ? 180 : 0} />
    </button>
  );
}

export interface WrappedControlsProps {
  /** The band's element id, for `aria-controls` on the two arrows. */
  bandId: string;
  className?: string;
}

export function WrappedControls({ bandId, className }: WrappedControlsProps) {
  const [index, setIndex] = useState(0);

  const atStart = index === 0;
  const atEnd = index >= CARD_COUNT - 1;

  return (
    <Container width={1140} className={className}>
      <div className="xs:flex-row xs:items-center xs:justify-between flex flex-col gap-4">
        {/* 412:1222 - "Generate your Azza wrapped", 314 x 56. components.md
            S4.3 assigns this exact node the `lg` size, and the node's indigo
            fill and brand-blue label are exactly the `action.soft` pair, so the
            `soft` variant carries both without naming a colour here.
            Full width at base per responsive.md S7.2.6; the label wraps to two
            lines at 320 rather than pushing the page sideways. */}
        <Button
          variant="soft"
          size="lg"
          href={WHATSAPP_CHAT_URL}
          iconRight="arrow-right"
          fullWidth
          className="xs:w-auto text-center"
        >
          Generate your Azza wrapped
        </Button>

        {/* 412:1226 - the arrow pair. gap 12 (layout.md S1.2, `space-3`). */}
        <div className="xs:self-auto flex items-center gap-3 self-end">
          <ArrowButton
            label="Previous wrapped card"
            previous
            disabled={atStart}
            controls={bandId}
            onActivate={() => setIndex((current) => Math.max(0, current - 1))}
          />
          <ArrowButton
            label="Next wrapped card"
            disabled={atEnd}
            controls={bandId}
            onActivate={() => setIndex((current) => Math.min(CARD_COUNT - 1, current + 1))}
          />
        </div>
      </div>
    </Container>
  );
}
