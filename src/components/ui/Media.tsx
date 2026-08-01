import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

const RADIUS_CLASS: Record<NonNullable<MediaProps["radius"]>, string> = {
  lg: "rounded-lg", // 8
  xl: "rounded-xl", // 12
  "2xl": "rounded-2xl", // 16
  "3xl": "rounded-3xl", // 20
  "4xl": "rounded-4xl", // 24
  "7xl": "rounded-7xl", // 48
};

const POSITION_CLASS: Record<NonNullable<MediaProps["position"]>, string> = {
  center: "object-center",
  top: "object-top",
  "center 42%": "object-[center_42%]",
};

export interface MediaProps {
  /** A static import from design-system/assets/**. Never a string URL, never a Figma asset URL. */
  src: StaticImageData;
  /** "" for decorative. A real sentence for content. There is no third option. */
  alt: string;
  /** CSS aspect-ratio for the *slot*, e.g. "1160/348". Reserves layout; zero CLS is a hard requirement. */
  ratio: string;
  /**
   * Art-directed crop change at a breakpoint. `ratio` applies from `lg` up,
   * `ratioMd` from `md`, `ratioBase` below that. responsive.md S10.
   */
  ratioMd?: string;
  ratioBase?: string;
  /**
   * Solid placeholder behind the image while it loads. Use the sampled mean
   * from assets.md S6.3. Assets with alpha get NO placeholder - a fill behind
   * them would show.
   */
  placeholderColor?: string;
  /** Above the fold at 1440x900 on this route. Everything else is lazy. */
  priority?: boolean;
  /** Required whenever the rendered width is not the intrinsic width. */
  sizes?: string;
  /** object-position. The one card that needs "top" is blog-card-naira-to-cedis. */
  position?: "center" | "top" | "center 42%";
  /** Rounds the media box. Token name, e.g. "2xl". */
  radius?: "lg" | "xl" | "2xl" | "3xl" | "4xl" | "7xl";
  className?: string;
}

/**
 * Every raster on the site. The rules it enforces so nineteen agents cannot
 * diverge (components.md S4.7):
 *
 * 1. SVG is NEVER routed through Media. Import it as a glyph (`Icon`) or an
 *    inline React component - the wordmark is on every route twice and must not
 *    cost a request.
 * 2. Every raster goes through next/image with `fill`, inside a wrapper that
 *    carries the explicit ratio. That wrapper is what reserves layout.
 * 3. No hand-made @2x variants. The files in design-system/assets are masters;
 *    next/image negotiates AVIF/WebP and derives the responsive set.
 * 4. `placeholder="empty"` plus a CSS background colour. NEVER
 *    `placeholder="blur"` - the blog cards are flat brand artwork and a blur-up
 *    reads as a loading artefact.
 * 5. pattern/texture-grain.webp never comes through here. Use `Grain`.
 */
export function Media({
  src,
  alt,
  ratio,
  ratioMd,
  ratioBase,
  placeholderColor,
  priority = false,
  sizes,
  position = "center",
  radius,
  className,
}: MediaProps) {
  const style = {
    "--azza-media-ratio": ratioBase ?? ratio,
    "--azza-media-ratio-md": ratioMd ?? ratioBase ?? ratio,
    "--azza-media-ratio-lg": ratio,
    backgroundColor: placeholderColor,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "azza-media relative w-full overflow-hidden",
        radius ? RADIUS_CLASS[radius] : undefined,
        className,
      )}
      style={style}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        placeholder="empty"
        className={cn("object-cover", POSITION_CLASS[position])}
      />
    </div>
  );
}
