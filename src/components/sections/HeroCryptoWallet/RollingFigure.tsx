import { VisuallyHidden } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * The converter's animated figure - an odometer (operator request,
 * 2026-08-11: animate the numbers as they receive new input).
 *
 * WHY AN ODOMETER AND NOT A CROSSFADE OR A COUNT-UP. The figure changes on
 * EVERY KEYSTROKE, which by the frequency rule means the motion must be
 * subtle, fast and interruptible - and a mechanical counter is the one number
 * animation that gets cheaper as changes get smaller: each digit is a
 * vertical strip of 0-9 translated to the current digit, so a keystroke that
 * changes two digits rolls two columns and leaves the rest at rest. Rolling
 * 3 -> 7 passes through 4, 5, 6 - the motion IS the arithmetic, which is what
 * makes it read as natural rather than decorative. A count-up would flicker
 * every digit on every keystroke; a crossfade would swap two unrelated
 * pictures.
 *
 * MECHANICS
 * ---------
 *   - Everything is em-sized, so the same component serves any type step.
 *     Each cell is a 1em-tall clipped box; strip rows are 1em with
 *     `leading-none`, so every glyph carries identical font metrics and the
 *     baselines agree across cells to the pixel.
 *   - The strip moves on the standalone `translate` property (what Tailwind
 *     v4 emits) over `--motion-base` / `--ease-out` - a CSS TRANSITION, so a
 *     fast typist retargets half-finished rolls smoothly instead of
 *     restarting them.
 *   - Cells are keyed FROM THE RIGHT, because money grows at the left: typing
 *     another digit shifts the magnitude, and right-keys let every existing
 *     column keep its identity (and its in-flight roll) while one new column
 *     mounts at the left.
 *   - A mounting cell fades in via `@starting-style` (`starting:opacity-0`) -
 *     it appears AT its digit, it does not roll from zero. Symbols and
 *     separators are single-row cells: a currency switch remounts them (the
 *     char is in the key), so ₦ -> KSh is a quiet fade, not a false roll.
 *   - 9 -> 0 rolls back down the strip rather than wrapping like a physical
 *     drum. A wrap needs a duplicated glyph run and a settle-jump; at 240ms
 *     over a 10-glyph strip the difference is not worth the machinery.
 *
 * REDUCED MOTION pins the strips (`motion-reduce:transition-none`) - digits
 * snap - and keeps only the entry fade, which is an opacity change, the kind
 * reduced-motion guidance says to keep.
 *
 * ACCESSIBILITY - the cells would read as one character per line to a screen
 * reader, so the visual layer is `aria-hidden` and a visually hidden span
 * carries the plain string. The parent `<output>`'s implicit `role="status"`
 * announces that span's changes exactly as it announced the plain text
 * before.
 */

const STRIP_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const CELL_CLASS = cn(
  "inline-flex h-[1em] overflow-hidden leading-none",
  // The entry fade for cells that mount mid-life (a new magnitude, a changed
  // currency symbol). `transition-opacity` here never fights the strip's own
  // `translate` transition - they live on different elements.
  "transition-opacity duration-(--motion-base) ease-out starting:opacity-0",
);

function DigitCell({ digit }: { digit: number }) {
  return (
    <span className={CELL_CLASS}>
      <span
        className={cn(
          "flex flex-col transition-[translate] duration-(--motion-base) ease-out",
          "motion-reduce:transition-none",
        )}
        style={{ translate: `0 ${-digit}em` }}
      >
        {STRIP_DIGITS.map((d) => (
          <span key={d} className="flex h-[1em] items-center justify-center">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export interface RollingFigureProps {
  /** The formatted figure, e.g. `"₦138,700"`. */
  value: string;
  className?: string;
}

export function RollingFigure({ value, className }: RollingFigureProps) {
  const chars = [...value];

  return (
    <span className={className}>
      <span aria-hidden="true" className="inline-flex items-center">
        {chars.map((char, index) => {
          // Keyed by distance from the right end - see the docblock.
          const key = chars.length - index;

          return /\d/.test(char) ? (
            <DigitCell key={`digit-${key}`} digit={Number(char)} />
          ) : (
            <span key={`char-${key}-${char}`} className={CELL_CLASS}>
              <span className="flex h-[1em] items-center">{char}</span>
            </span>
          );
        })}
      </span>
      <VisuallyHidden>{value}</VisuallyHidden>
    </span>
  );
}
