import type { CSSProperties } from "react";

import grain from "@design-system/assets/pattern/texture-grain.webp";
import { cn } from "@/lib/cn";

export interface GrainProps {
  /** Opacity of the multiply-blended noise field. Default 0.18. */
  opacity?: number;
  className?: string;
}

/**
 * The film-grain overlay.
 *
 * One 359 KB asset serves six separate Figma layers, so it is loaded exactly
 * once, as a CSS background rather than through `Media` - six `next/image`
 * instances of the same tile would be six layout boxes and six decode passes
 * for a texture that repeats.
 *
 * Purely decorative: `aria-hidden`, `pointer-events-none`, and it never
 * animates, so there is nothing here for reduced motion to switch off.
 */
export function Grain({ opacity = 0.18, className }: GrainProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-repeat mix-blend-multiply",
        className,
      )}
      style={
        {
          backgroundImage: `url(${grain.src})`,
          opacity,
        } as CSSProperties
      }
    />
  );
}
