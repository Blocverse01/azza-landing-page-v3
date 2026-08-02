"use client";

import type { StaticImageData } from "next/image";

import { Card, Icon, Media } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface TestimonialCardProps {
  /**
   * The caption string, transcribed verbatim from the Figma node - including
   * its curly quotation marks where the source has them. Two of the three cards
   * are quotations; the third (412:1090) is a title with no quote marks at all.
   */
  quote: string;
  /**
   * True when `quote` is an actual quotation, which selects <blockquote>.
   * 412:1090 reads "My Amazing Experience using Azza" - a video title, not
   * something the speaker said - so it renders as a plain <p> inside the
   * <figure>. Explicit rather than sniffed from the punctuation.
   */
  isQuotation?: boolean;
  /** The speaker, e.g. "Snow Olohijere". Rendered in the <figcaption>. */
  name: string;
  /**
   * The speaker's portrait.
   *
   * D-020: all three cards currently receive the SAME photograph - the Figma
   * layer is literally named "Profile, for now 4". It is a placeholder and the
   * designer says so. The portrait arrives as a prop precisely so that dropping
   * in three real portraits is a change to the content array and nothing else.
   */
  portrait: StaticImageData;
  /**
   * Alt text for the portrait. Defaults to "" (decorative), which is correct
   * today for two independent reasons:
   *   1. The <figcaption> already announces the speaker's name, so a name-alt
   *      would announce it twice.
   *   2. D-020 - one placeholder photograph is used for three customers.
   *      Describing it three times as three different people in the
   *      accessibility tree is exactly the misrepresentation D-020 forbids.
   * When real portraits land, pass a real sentence per portrait.
   */
  portraitAlt?: string;
  /**
   * Wired when a testimonial video exists. The Figma file ships no media source
   * and defines no behaviour for the control, so today nothing passes this and
   * the button is marked `aria-disabled` - present, focusable and announced,
   * but honestly reported as not currently operable. See the report's
   * open_questions.
   */
  onPlay?: () => void;
}

/*
 * Geometry, measured off 412:1068 / 412:1084 / 412:1076 and expressed as
 * percentages of the card so it survives every breakpoint.
 *
 *   card              305 x 319, radius 16, overflow-clip
 *   portrait frame    331.084 x 349.563 at (calc(50% + 13.04px), -31)
 *   portrait bitmap   433 x 577 source, scaled to the frame width (441.2 tall)
 *                     and shifted up a further 68.27px inside that frame
 *   scrim             305 x 163 at y 160, gradient + 6px Figma background blur
 *   play glyph        32 x 32 at (253, 20)  -> 20px inset on both edges
 *   caption block     265 wide at (20, 212), column gap 16
 *
 * The bitmap's own box is what is positioned here, not the Figma frame: at the
 * source's true 433/577 ratio `object-fit: cover` has nothing left to crop, so
 * the whole crop is expressed as geometry instead of an object-position the
 * Media contract cannot express (its union is center | top | center 42%; the
 * measured value is center 74%).
 *
 *   width  331.084 / 305 = 108.5521%
 *   left   50% + 13.04 / 305 = 50% + 4.2754%   (with -translate-x-1/2)
 *   top    -(31 + 68.27) / 319 = -31.1191%
 */
const PORTRAIT_WIDTH = "w-[108.5521%]";
const PORTRAIT_LEFT = "left-[calc(50%_+_4.2754%)]";
const PORTRAIT_TOP = "top-[-31.1191%]";

/** 160 / 319 and 163 / 319. */
const SCRIM_TOP = "top-[50.1567%]";
const SCRIM_HEIGHT = "h-[51.0972%]";

/**
 * One testimonial tile: a portrait under a bottom scrim, a play affordance, and
 * an attributed caption.
 *
 * Client because the play control binds an event handler. components.md S3
 * lists this file as one of the eleven `"use client"` entry points.
 */
export function TestimonialCard({
  quote,
  isQuotation = false,
  name,
  portrait,
  portraitAlt = "",
  onPlay,
}: TestimonialCardProps) {
  const playable = typeof onPlay === "function";

  return (
    <Card
      as="div"
      surface="contrast"
      /*
       * The measured radius is 16px (--radius-2xl). `CardProps.radius` has no
       * 16px step - its union jumps 12 (xl) -> 20 (3xl) - so the nearest
       * documented value is passed and the real one is applied on top.
       *
       * The `!` is load-bearing and is not decoration. `cn` deliberately does
       * not merge conflicting classes, so both `rounded-xl` and `rounded-2xl`
       * reach the element and the winner is decided by emission order. Measured
       * in a browser: plain `rounded-2xl` LOSES and the card renders at 12px.
       * The important flag makes it deterministic instead of dependent on how
       * Tailwind happens to sort the radius scale.
       */
      radius="xl"
      className={cn(
        "relative w-full overflow-clip rounded-2xl!",
        // 305 x 319. The tile is a fixed-ratio media card at every width, which
        // is what lets the portrait and scrim be positioned in percentages.
        "aspect-[305/319]",
      )}
    >
      {/*
       * The portrait sits behind everything and must never intercept a pointer:
       * a full-bleed layer over a control is how a card ends up looking
       * interactive and swallowing every click.
       */}
      <div
        className={cn(
          "pointer-events-none absolute -translate-x-1/2",
          PORTRAIT_WIDTH,
          PORTRAIT_LEFT,
          PORTRAIT_TOP,
        )}
      >
        <Media
          src={portrait}
          alt={portraitAlt}
          ratio="433/577"
          sizes="(max-width:767px) 80vw, 331px"
        />
      </div>

      {/*
       * gradient.media-scrim, 180deg, first stop at 16.7% - not 0 (color.md S7).
       * It reaches full opacity at the card's lower edge, which is what keeps
       * the caption legible over an arbitrary photograph (color.md S6: 17.4:1
       * for the quote, 6.90:1 for the attribution against the opaque floor).
       *
       * Figma's BACKGROUND_BLUR radius is 6px; CSS backdrop-filter takes the
       * standard deviation, which is half of it.
       */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 backdrop-blur-[3px]",
          "from-gradient-media-scrim-from to-gradient-media-scrim-to bg-linear-to-b from-[16.7%]",
          SCRIM_TOP,
          SCRIM_HEIGHT,
        )}
      />

      {/*
       * The play affordance. Visible at rest at every breakpoint - never
       * hover-revealed (responsive.md S6.4 #4) - and a real <button> rather
       * than a decorated <div>, so Enter and Space work for free.
       *
       * The glyph stays 32 as designed; the control is 44 x 44 so the touch
       * target clears the minimum (responsive.md S6.2). Insets are 14px, which
       * puts the 32px glyph back at the designed 20px from each edge.
       */}
      <button
        type="button"
        aria-label={`Play testimonial from ${name}`}
        aria-disabled={playable ? undefined : true}
        onClick={playable ? onPlay : undefined}
        className={cn(
          "absolute top-[14px] right-[14px] grid size-11 place-items-center rounded-full",
          // icons.md S5 assigns play-circle a "light-on-image overlay" grey
          // that no token in tokens.json carries. neutral.325 is the nearest
          // value on the palette - three points of grey apart. Recorded as a
          // finding so the role gets a real token rather than staying a raw
          // palette reference.
          "text-palette-neutral-325",
          // components.md S10.6, icon-only control: hover recolours, press
          // nudges 1px, both at --motion-instant. No scale, ever.
          "transition-[color,transform] duration-(--motion-instant) ease-out",
          "hoverable:text-fg-on-inverse",
          "active:translate-y-px",
          "cursor-pointer aria-disabled:cursor-default",
          // Tier 1: the press nudge is decorative, so under reduced motion it
          // is removed outright rather than merely made instant.
          "motion-reduce:transition-none motion-reduce:active:translate-y-0",
        )}
      >
        <Icon name="play-circle" size="lg" />
      </button>

      {/*
       * Caption block. Bottom-anchored rather than pinned to the designed
       * `top: 212`: at 305 x 319 with a two-line quote the two are identical,
       * and on a narrower card the block grows upward into the scrim instead of
       * out through the bottom edge.
       */}
      <figure className="absolute inset-x-5 bottom-7 flex flex-col items-start gap-4">
        {isQuotation ? (
          <blockquote className="text-base-quote text-fg-on-inverse lg:max-w-[89%]">
            <p>{quote}</p>
          </blockquote>
        ) : (
          <p className="text-base-quote text-fg-on-inverse lg:max-w-[89%]">{quote}</p>
        )}
        <figcaption className="text-fg-on-inverse-subtle text-sm">{name}</figcaption>
      </figure>
    </Card>
  );
}
