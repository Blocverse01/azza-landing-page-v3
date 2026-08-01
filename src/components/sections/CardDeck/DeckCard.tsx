import type { CSSProperties } from "react";

import { DisplayHeading, PhoneMockup } from "@/components/ui";
import { cn } from "@/lib/cn";

import coinUsdcAsset from "@design-system/assets/illustration/coin-usdc.svg";
import coinUsdtAsset from "@design-system/assets/illustration/coin-usdt-tilted.svg";

import { DECK_RECORDS, DECK_SCREEN_ALT, type DeckRecord } from "./deck-content";

/*
 * next/image-types declares `*.svg` as `any` so that an SVGR setup can override
 * it. Narrow it here rather than letting `any` leak into the component.
 */
const coinUsdc = coinUsdcAsset as { src: string };
const coinUsdtTilted = coinUsdtAsset as { src: string };

/* ---------------------------------------------------------------------------
 * Fan geometry - measured off the placed instance `507:684` and cross-checked
 * against responsive.md S7.0.1's table. Every value is a PERCENTAGE of the
 * 1300 x 700 stage, never a pixel, so the whole composition scales with the
 * container at every width in the range instead of breaking at 1280.
 *
 *   layer      node          x      y      w       h
 *   front      507:728     100     36.5   1200    625
 *   middle     507:725      50     64.5   (1200)  569
 *   back       507:724       0    104.5   (1200)  482
 *
 * The two rear cards are drawn in Figma only as wide as their visible sliver.
 * A deck that cycles has to give all three the same footprint, so they are
 * reconstructed as the front card under a uniform scale - 569/625 and 482/625
 * - which reproduces the measured height AND the measured left edge exactly,
 * provided the transform origin sits on the front card's left edge.
 * ------------------------------------------------------------------------- */

/** 100 / 1300 - the front card's left inset, and the transform origin. */
const FILL_LEFT = 7.6923;
/** 36.5 / 700 */
const FILL_TOP = 5.2143;
/** 1200 / 1300 */
const FILL_WIDTH = 92.3077;
/** 625 / 700 */
const FILL_HEIGHT = 89.2857;
/** 50 / 1300 - one fan step along X. D-014: the deck fans along X, not Y. */
const DEPTH_STEP = 3.8462;
/** 625 -> 569 -> 482. Not a geometric series; the designer eyeballed it. */
const DEPTH_SCALE = [1, 0.9104, 0.7712] as const;
/** Descending, per the owo.app mechanic. Three cards, so 10 / 8 / 6. */
const DEPTH_Z = [10, 8, 6] as const;

/* Phone mockup `507:761`, as percentages of the stage. It is a SIBLING of the
 * card fill, not a child, so it is not clipped - it bleeds above and below the
 * card, which is exactly what the design shows. */
const PHONE_LEFT = 70.5385; // 917 / 1300
const PHONE_TOP = -0.0214; // -0.15 / 700
const PHONE_WIDTH = 26.3794; // 342.932 / 1300
/** Intrinsic device width. `PhoneMockup` caps itself at its wrapper via
 *  max-width:100%, so this is only reached at >= 1440 where the stage is 1300. */
const PHONE_INTRINSIC = 343;

/* Card interior `507:758`, as percentages of the 1200-wide card fill. */
const TEXT_LEFT = 4; // 48 / 1200
const TEXT_WIDTH = 46.0833; // 553 / 1200

/*
 * The headline is `display-3` (128 / 1.0 / -0.01em / 400), but its SIZE is
 * re-based on the card rather than the viewport.
 *
 * responsive.md S6 ranks this the strongest container-query case in the whole
 * project, and it is right: the card lives inside a transformed, absolutely
 * positioned stack, so a viewport-derived clamp is not merely coarse, it is
 * actively wrong. At 1024 the theme's viewport clamp resolves display-3 to
 * 120px inside a 395px text column - roughly six lines in a card 446px tall.
 *
 * 10.6667cqw is 128/1200, the design's own ratio. Because the text column is
 * also a fixed 46.0833% of the card, the ratio of column width to font size is
 * constant at every stage width, so the headline breaks onto exactly three
 * lines everywhere - identical to Figma. The floor and ceiling are the
 * display-3 token's own (2rem .. 8rem, components.md S11 C-1).
 */
const HEADLINE_SIZE = "[font-size:clamp(2rem,10.6667cqw,8rem)]!";

/*
 * The subcopy and the gap are re-based on the card for the same reason, and it
 * is not cosmetic. Measured in a real browser in Bebas Neue: with the subcopy
 * pinned at the token's 20px, the text block is 462px tall inside a 446px card
 * at exactly 1024 - it overflowed by 8px top and bottom and the card's own
 * `overflow: hidden` clipped it. A card that silently eats the first and last
 * line of its own copy at the breakpoint where the fan begins is the kind of
 * defect that only shows up when you render it.
 *
 * 1.6667cqw is 20/1200 and 2cqw is 24/1200, so both are exactly the design
 * values at the design width and shrink with the card below it. The 1rem floor
 * is the readability limit - the card reaches it at roughly 1130px viewport,
 * and at 1024, the worst case, the block then measures ~421px in a 446px card.
 */
const BODY_SIZE = "[font-size:clamp(1rem,1.6667cqw,1.25rem)]!";
const BLOCK_GAP = "[gap:clamp(0.75rem,2cqw,1.5rem)]";

export type DeckPresentation = "fan" | "flow";

export interface DeckCardProps {
  record: DeckRecord;
  /** DOM position, 0-based. Fixed for the life of the component. */
  index: number;
  /** How this card is laid out. "fan" >= lg; "flow" below lg and under
   *  reduced motion, where it is a carousel item or a stacked block. */
  presentation: DeckPresentation;
  /** Fan only. 0 = front, 2 = back. Cycles as the deck advances. */
  depth?: number;
  /** Fan only. */
  active?: boolean;
  /** Fan only. Promotes this card to the front. */
  onPromote?: (index: number) => void;
  /** Fan only. Focus target after a promotion. */
  panelRef?: (node: HTMLDivElement | null) => void;
  /** Flow only. The carousel observes the item to track the active card. */
  itemRef?: (node: HTMLLIElement | null) => void;
  /** Fan only. `will-change` is applied only while the deck is on screen and
   *  removed on exit - components.md S10.8. */
  animating?: boolean;
  className?: string;
  /** Flow only. Read by the carousel's IntersectionObserver. */
  "data-deck-index"?: number;
}

export function DeckCard({
  record,
  index,
  presentation,
  depth = 0,
  active = false,
  onPromote,
  panelRef,
  itemRef,
  animating = false,
  className,
  ...rest
}: DeckCardProps) {
  const headingId = `deck-${presentation}-${record.id}`;
  const scale = DEPTH_SCALE[Math.min(depth, DEPTH_SCALE.length - 1)] ?? 1;
  const isFan = presentation === "fan";
  const isPeeking = isFan && depth > 0;

  /*
   * In Figma the two rear cards are flat colour - the designer drew them only
   * as wide as their sliver, so they have no interior at all. Reconstructing
   * them as full cards under a scale gives them one, and the headline starts
   * 4% in, which lands inside the 3.85% strip the fan leaves exposed: rendered,
   * each sliver showed a vertical slice of one enormous letterform. That reads
   * as an artefact, not as design.
   *
   * So the interior - text, art and phone - crossfades, and only the fill
   * colour peeks. The card's own background is untouched, which is exactly the
   * flat sliver the design shows, and promotion now reveals its card instead of
   * merely sliding it. Opacity crossfade at --motion-base / --ease-out is the
   * verb components.md S10.5 already defines; nothing new is invented here.
   *
   * The content stays in the DOM at opacity 0 rather than being unmounted, so
   * all three cards remain in the accessibility tree and in the page source.
   */
  const interiorClass = isFan
    ? cn(
        "transition-opacity duration-[var(--motion-base)] ease-[var(--ease-out)]",
        active
          ? "opacity-100"
          : "pointer-events-none opacity-0 select-none",
      )
    : undefined;

  /* The peeking card's visible sliver, in stage percentages. Computed rather
   * than tabulated so the button always lands exactly on the strip the fan
   * leaves exposed, at any depth. */
  const peekHeight = FILL_HEIGHT * scale;
  const peekStyle: CSSProperties = {
    left: `${FILL_LEFT - DEPTH_STEP * depth}%`,
    width: `${DEPTH_STEP}%`,
    top: `${50 - peekHeight / 2}%`,
    height: `${peekHeight}%`,
  };

  const layerStyle: CSSProperties = isFan
    ? {
        transformOrigin: `${FILL_LEFT}% 50%`,
        transform: `translateX(${-DEPTH_STEP * depth}%) scale(${scale})`,
        /*
         * z-index is not interpolatable, so it is switched with a zero-duration
         * transition delayed to the midpoint - components.md S10.8. Both the
         * outgoing and the incoming card swap on the same frame.
         */
        transition:
          "transform var(--motion-deck) var(--ease-spring)," +
          " z-index 0s linear calc(var(--motion-deck) / 2)",
        willChange: animating ? "transform" : undefined,
      }
    : {};

  const art =
    record.art === "crypto-coins" ? (
      <CryptoCoins className={interiorClass} />
    ) : null;

  const textBlock = (
    <div
        className={cn(
          "relative z-10 flex flex-col",
          BLOCK_GAP,
          interiorClass,
          isFan
            ? "absolute -translate-y-1/2"
            : "w-full @min-[52rem]/deck:w-[46.0833%] @min-[52rem]/deck:shrink-0",
        )}
        style={
          isFan
            ? { left: `${TEXT_LEFT}%`, top: "50%", width: `${TEXT_WIDTH}%` }
            : undefined
        }
      >
        <DisplayHeading
          as="h2"
          step="display-3"
          id={headingId}
          className={cn(HEADLINE_SIZE, record.titleClass)}
        >
          {record.title}
        </DisplayHeading>
        <p className={cn("text-md-card", BODY_SIZE, record.bodyClass)}>
          {record.body}
        </p>
    </div>
  );

  if (!isFan) {
    return (
      /*
       * THE CONTAINER IS THE <li>; THE LAYOUT IS THE <div> INSIDE IT.
       *
       * That split is not tidiness. A container query resolves against the
       * nearest ANCESTOR container - an element can never query itself. The
       * first version of this put `@container/deck` and
       * `@min-[52rem]/deck:flex-row` on the same <li>, so at 1440 under reduced
       * motion the card measured `flex-direction: column` on a 1280px box while
       * its children - which CAN query the <li> - had already taken their
       * side-by-side 46% / 28.6% widths. A 128px headline in a 560px column,
       * stacked above a 700px phone: the worst of both layouts, and it
       * typechecks, builds and lints clean.
       */
      <li
        {...rest}
        ref={itemRef}
        className={cn(
          "@container/deck relative overflow-hidden rounded-xl",
          record.surfaceClass,
          className,
        )}
      >
        {art}
        <div
          className={cn(
            "relative z-10 flex min-h-[520px] flex-col justify-center gap-6 p-6 xs:min-h-[560px] sm:min-h-[600px] sm:p-8",
            "@min-[52rem]/deck:flex-row @min-[52rem]/deck:items-center @min-[52rem]/deck:justify-between @min-[52rem]/deck:gap-10 @min-[52rem]/deck:p-12",
          )}
        >
          {textBlock}
          <div className="relative z-10 mx-auto w-[156px] shrink-0 @min-[52rem]/deck:mx-0 @min-[52rem]/deck:w-[28.583%]">
            <PhoneMockup
              screen="whatsapp-transfer"
              width={PHONE_INTRINSIC}
              screenAlt={DECK_SCREEN_ALT}
            />
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ zIndex: DEPTH_Z[Math.min(depth, DEPTH_Z.length - 1)] }}
    >
      {/*
       * The promote control comes FIRST in the DOM so a screen reader
       * announces "show this card" before reading the card it shows.
       *
       * It is sized to the sliver the fan actually leaves exposed rather than
       * to the whole card, so the focus ring lands somewhere visible instead of
       * being drawn behind the front card. Clicks on the occluded remainder
       * never reach it anyway - the front card sits above it in z-order.
       * min-w-11 keeps the target at 44px at 1024, where 3.85% of the stage is
       * only 36px.
       */}
      {isPeeking ? (
        <button
          type="button"
          className="pointer-events-auto absolute z-20 min-w-11 cursor-pointer rounded-l-xl"
          style={peekStyle}
          aria-label={`Show card ${index + 1} of ${DECK_RECORDS.length}: ${record.title}`}
          onClick={() => onPromote?.(index)}
        />
      ) : null}

      {/*
       * `pointer-events-none` on the layer is load-bearing, and its absence is
       * a total functional failure rather than a rough edge. The layer is
       * `inset-0`, so every card's layer spans the WHOLE stage even though the
       * only painted thing in it starts 7.69% in. A transparent box still takes
       * hit-tests, so the front card's layer sat over both peek slivers and
       * swallowed every click on them - the deck could not be advanced with a
       * mouse at all. It typechecked, built and looked perfect; only clicking
       * it in a browser found this.
       *
       * Hit-testing is handed back to the two boxes that are actually painted.
       */}
      <div className="pointer-events-none absolute inset-0" style={layerStyle}>
        {/* role="group" is what makes `aria-labelledby` meaningful: focus lands
         * here after a promotion and the card's own headline is announced. */}
        <div
          ref={panelRef}
          role="group"
          tabIndex={active ? -1 : undefined}
          aria-labelledby={headingId}
          className={cn(
            "@container/deck pointer-events-auto absolute overflow-hidden rounded-xl",
            record.surfaceClass,
          )}
          style={{
            left: `${FILL_LEFT}%`,
            top: `${FILL_TOP}%`,
            width: `${FILL_WIDTH}%`,
            height: `${FILL_HEIGHT}%`,
          }}
        >
          {art}
          {textBlock}
        </div>

        <div
          className={cn("pointer-events-auto absolute", interiorClass)}
          style={{
            left: `${PHONE_LEFT}%`,
            top: `${PHONE_TOP}%`,
            width: `${PHONE_WIDTH}%`,
          }}
        >
          <PhoneMockup
            screen="whatsapp-transfer"
            width={PHONE_INTRINSIC}
            screenAlt={DECK_SCREEN_ALT}
          />
        </div>
      </div>
    </li>
  );
}

/**
 * `507:729` (USDC) and `507:739` (USDT tilted), the only deck art that exists
 * in `design-system/assets/`.
 *
 * Both exports are cropped to the geometry that survives the card's clip - the
 * USDC export is 428x299 for a node rendered at 427x427, the missing 128px
 * being exactly what the card bottom cuts off. So both are anchored to the
 * card's bottom edge, and both are sized in `cqw` so they scale with the card
 * rather than with the viewport.
 *
 * They are painted as background images, not <img>: they are decoration, they
 * carry no meaning, and there is nothing for alt text to say.
 *
 * responsive.md S7.0.1: USDT is dropped below `md` (two coins at 360px is
 * noise) and USDC drops to 40% opacity below `sm`.
 */
function CryptoCoins({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
    >
      <span
        className="absolute hidden md:block"
        style={{
          left: 0,
          bottom: "-0.667cqw",
          width: "29.25cqw",
          aspectRatio: "351 / 268",
          backgroundImage: `url(${coinUsdtTilted.src})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom left",
        }}
      />
      <span
        className="absolute opacity-40 sm:opacity-100"
        style={{
          left: "22.3333cqw",
          bottom: 0,
          width: "35.6667cqw",
          aspectRatio: "428 / 299",
          backgroundImage: `url(${coinUsdc.src})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom left",
        }}
      />
    </div>
  );
}
