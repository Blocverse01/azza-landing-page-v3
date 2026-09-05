import Image from "next/image";
import type { StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import { DisplayHeading, Media, PhoneMockup } from "@/components/ui";
import { cn } from "@/lib/cn";

import coinUsdcAsset from "@design-system/assets/illustration/coin-usdc.svg";
import coinUsdtAsset from "@design-system/assets/illustration/coin-usdt-tilted.svg";
import deckFlagRibbonAsset from "@design-system/assets/illustration/deck-flag-roundel-ribbon.svg";
import deckGlobeAsset from "@design-system/assets/illustration/deck-globe.svg";
import deckPinAsset from "@design-system/assets/illustration/deck-pin.svg";
import deckPinBackAsset from "@design-system/assets/illustration/deck-pin-back.svg";

import { DECK_RECORDS, DECK_SCREEN_ALT, type DeckArt, type DeckRecord } from "./deck-content";

/*
 * next/image-types declares `*.svg` as `any` so that an SVGR setup can override
 * it. Narrow it here rather than letting `any` leak into the component.
 *
 * The two coins are painted as CSS backgrounds and only ever need `.src`; the
 * globe and the ribbon go through `Media`, which wants the whole descriptor.
 */
const coinUsdc = coinUsdcAsset as { src: string };
const coinUsdtTilted = coinUsdtAsset as { src: string };
const deckGlobe = deckGlobeAsset as StaticImageData;
const deckPin = deckPinAsset as StaticImageData;
const deckPinBack = deckPinBackAsset as StaticImageData;
const deckFlagRibbon = deckFlagRibbonAsset as StaticImageData;

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

/*
 * The FLOW steps - Figma 862:785, the 2026-09 mobile redesign of the card.
 * Same cqw idiom, re-based on the drawn 380px card instead of the fan's 1200:
 * 18.9474cqw is 72/380 and 4.7368cqw is 18/380, so each is exactly the drawn
 * value at the drawn width and ratio-scales below it. The caps ARE the drawn
 * values - under reduced motion the flow card can be 1200px wide, and a 72px
 * mobile headline must not become a 227px one there. The drawn leading is 0.9
 * against display-3's 1, hence the second important term.
 */
const FLOW_HEADLINE_SIZE = "[font-size:clamp(2rem,18.9474cqw,4.5rem)]! [line-height:0.9]!";
const FLOW_BODY_SIZE = "[font-size:clamp(1rem,4.7368cqw,1.125rem)]!";

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
  /**
   * A ref to the card's own root <li>.
   *
   * The carousel uses it to observe the item and track the active card. `DeckFold`
   * uses it to drive the fold: that mechanic positions the cards itself, writing
   * `transform`, `height`, `left`, `width` and `z-index` straight to this element
   * every frame, so it needs the root rather than the panel `panelRef` returns.
   */
  itemRef?: (node: HTMLLIElement | null) => void;
  /**
   * Suppress the card's own phone.
   *
   * The fan gives every card a phone, because in the fan only one card's interior
   * is ever visible. The fold shows all three at once and scrolls them past a
   * SINGLE phone that belongs to the stage - owo's behaviour, where the mockup
   * holds still and the cards travel behind it. Three phones travelling with
   * their cards is the one thing that cannot survive that change, so the fold
   * turns them off and paints its own.
   */
  hidePhone?: boolean;
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
  hidePhone = false,
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
        active ? "opacity-100" : "pointer-events-none opacity-0 select-none",
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

  const art = renderDeckArt(record.art, interiorClass, isFan);

  const textBlock = (
    <div
      className={cn(
        "z-10 flex flex-col",
        interiorClass,
        /*
         * The fan keeps its exact historical class set (`relative` included -
         * it ships and is not relitigated here). The flow block is the drawn
         * 862:1017 geometry: inset 30/380 each side, block CENTRE pinned at
         * 189/380ths of the card width from the top - the drawn
         * `top: calc(50% - 118.5px)` restated in the card-relative unit the
         * deck already uses, so it holds at any carousel width under the
         * locked 380:615 aspect. At `52rem`+ (the reduced-motion desktop
         * stack) it returns to the static side-by-side flow.
         */
        isFan
          ? cn("absolute relative -translate-y-1/2", BLOCK_GAP)
          : cn(
              "absolute inset-x-[7.8947cqw] top-[49.7368cqw] -translate-y-1/2 gap-4",
              "@min-[52rem]/deck:static @min-[52rem]/deck:translate-y-0",
              "@min-[52rem]/deck:w-[46.0833%] @min-[52rem]/deck:shrink-0",
            ),
      )}
      style={isFan ? { left: `${TEXT_LEFT}%`, top: "50%", width: `${TEXT_WIDTH}%` } : undefined}
    >
      <DisplayHeading
        as="h2"
        step="display-3"
        id={headingId}
        className={cn(isFan ? HEADLINE_SIZE : FLOW_HEADLINE_SIZE, record.titleClass)}
      >
        {record.title}
      </DisplayHeading>
      <p className={cn("text-md-card", isFan ? BODY_SIZE : FLOW_BODY_SIZE, record.bodyClass)}>
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
      /*
       * 862:785 (2026-09): the flow card is the drawn 380x615 at radius 16
       * (rounded-2xl - the fan keeps its own 12), its proportion locked with
       * `aspect` rather than the old min-height ladder so the composition
       * scales as one object at any carousel width. The text block positions
       * itself absolutely inside (see above), and the PHONE MOCKUP IS GONE -
       * the redesign draws none, on any card. At `52rem`+ the aspect unlocks
       * and the reduced-motion desktop stack lays text out in its old centred
       * row, minus that phone.
       */
      <li
        {...rest}
        ref={itemRef}
        className={cn(
          "@container/deck relative overflow-hidden rounded-2xl",
          record.surfaceClass,
          className,
        )}
      >
        {art}
        <div
          className={cn(
            "relative z-10 aspect-[380/615]",
            "@min-[52rem]/deck:flex @min-[52rem]/deck:aspect-auto @min-[52rem]/deck:min-h-[520px] @min-[52rem]/deck:flex-row @min-[52rem]/deck:items-center @min-[52rem]/deck:justify-between @min-[52rem]/deck:gap-10 @min-[52rem]/deck:p-12",
          )}
        >
          {textBlock}
        </div>
      </li>
    );
  }

  return (
    <li
      ref={itemRef}
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
        {/*
         * role="group" is what makes `aria-labelledby` meaningful: focus lands
         * here after a promotion and the card's own headline is announced.
         *
         * `tabindex="-1"` is PERMANENT, not conditional on `active`. Under the
         * sticky track a promotion is a scroll, so the card is still at depth 1
         * or 2 at the moment `promote()` moves focus to it - gating the
         * attribute on `active` made `focus()` a silent no-op in exactly that
         * case and dropped focus to <body>. -1 never enters the tab order, so
         * the tab sequence is unchanged; it only makes the panel a legal
         * programmatic target before it arrives at the front.
         */}
        <div
          ref={panelRef}
          role="group"
          tabIndex={-1}
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

        {hidePhone ? null : (
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
        )}
      </div>
    </li>
  );
}

/**
 * ONE BACKGROUND PER CARD.
 *
 * All three cards carry a full-card decorative composition in the design, and
 * all three are now exported. They were not always: `deck-globe.svg` and
 * `deck-flag-roundel-ribbon.svg` landed in a later asset sweep, after this
 * section had been built against `art: null` slots, and nothing wired them in -
 * so two of three cards rendered as flat colour. Both are wired here.
 *
 * A switch rather than a lookup object so an unhandled member of `DeckArt` is a
 * type error at the call site rather than `undefined` at runtime.
 */
function renderDeckArt(art: DeckArt, className: string | undefined, fan: boolean) {
  switch (art) {
    case "crypto-coins":
      return <CryptoCoins className={className} fan={fan} />;
    case "globe":
      return <DeckGlobe className={className} fan={fan} />;
    case "flag-ribbon":
      return <FlagRoundelRibbon className={className} fan={fan} />;
    default:
      return null;
  }
}

/* ---------------------------------------------------------------------------
 * ART GEOMETRY - why every value below is `cqw` and not `%`.
 *
 * The card is 1200 x 625 in the design, so `1cqw` of the `@container/deck` on
 * the card is exactly 12 design pixels, on BOTH axes, at every stage width.
 * A percentage would not be: `top: 40%` resolves against the card's HEIGHT, and
 * the card is 1200x625 in the fan but roughly 420x520 in the carousel, so the
 * same percentage lands in two completely different places. `cqw` resolves
 * against the inline size in both, which is what keeps a composition rigid.
 *
 * Each piece is therefore anchored to the edge the design clips it against, and
 * offsets are `<design px> / 12` cqw. The card's own `overflow: hidden` does
 * the clipping, exactly as the frame does in Figma - so a narrower card reveals
 * LESS art rather than squashing it (assets.md S4.2 / S4.4).
 * ------------------------------------------------------------------------- */

/**
 * `458:396`, the globe behind "Operate Locally" (`507:496`).
 *
 * 678 x 678, placed at (416, 462) inside the 1200 x 625 card frame `458:392`,
 * which clips it: only the top **163px** is ever visible and the remaining 515
 * sit below the card. assets.md S14 ships it whole for that reason - the crop
 * belongs in CSS, not in the file.
 *
 * BOTTOM-anchored, which is what makes that true at any card height. The
 * globe's box is pushed 515/12 cqw past the bottom edge, so 163/12 cqw of it
 * rises above the edge and the rest is clipped. Anchoring it from the top would
 * put the whole 678 inside a short carousel card and show a full circle the
 * design never shows.
 *
 * The three red pins over it (`458:399` / `458:414` / `458:429`) are NOT here -
 * see the note in `deck-content.ts`. Nothing was invented to stand in for them.
 *
 * `rounded-full overflow-hidden` IS LOAD-BEARING, and it is compensating for a
 * defect in the export rather than styling anything.
 * ------------------------------------------------------------------------
 * In Figma the landmass `458:397` is a BOOLEAN OPERATION intersected with the
 * ocean disc, so it stops at the coastline: rendering `458:396` on its own
 * returns 678x163 with everything outside the arc transparent. The exporter
 * flattened that boolean to its raw `map` path - `deck-globe.svg` contains no
 * `clipPath` at all and its `Map` group is 1386.5 wide against a 678 viewBox -
 * so the continents spill out of the disc and the square viewBox crops them
 * into a rectangle. Rendered without this clip the card shows a green slab with
 * a hard right edge, not a globe. Confirmed by rendering the file standalone.
 *
 * The disc is `rx=339` in a 678 box, i.e. exactly half - so a 50% radius on a
 * square wrapper reproduces Figma's own boundary precisely; it is a measured
 * value, not a nudge. It is also the placement's crop rather than a change of
 * meaning, which is where assets.md S4.4 puts crops in the first place ("that
 * crop belongs in CSS ... so a narrower card reveals more art").
 *
 * The durable fix is re-exporting the SVG with the boolean applied. That file
 * is outside this agent's allowlist; raised as a finding.
 */
function DeckGlobe({ className, fan }: { className?: string; fan: boolean }) {
  if (fan) {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
      >
        <div
          className="absolute overflow-hidden rounded-full"
          style={{
            left: "34.6667cqw", // 416 / 12
            bottom: "-42.9167cqw", // -(678 - 163) / 12
            width: "56.5cqw", // 678 / 12
          }}
        >
          <Media src={deckGlobe} alt="" ratio="1 / 1" />
        </div>
      </div>
    );
  }

  /*
   * FLOW - 862:909, the drawn mobile composition. Offsets are <drawn px>/3.8
   * cqw against the 380 card - the same idiom, re-based at the flow width.
   * The globe rises 166/380ths of the card width above the bottom edge, and
   * THE THREE RED PINS EXIST HERE: 862:785 finally draws them (the fan's
   * variant never did - deck-content.ts's "nothing was invented to stand in
   * for them" note describes the fan, not this presentation), and both pin
   * layers are committed exports of 862:866/872.
   */
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
    >
      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          left: "-9.7368cqw", // -37 / 3.8
          bottom: "-96.5789cqw", // -(532.93 - 165.75) / 3.8
          width: "140.2456cqw", // 532.93 / 3.8
        }}
      >
        <Media src={deckGlobe} alt="" ratio="1 / 1" />
      </div>
      {/* 862:865 / 878 / 893 - large, mid, small. The drawn front pin sits
       * 6.6/167.1ths of the height below its shadow layer in all three, so
       * one composite serves every size. */}
      <DeckPin leftCqw={33.0789} bottomCqw={25.4973} widthCqw={25.3438} />
      <DeckPin leftCqw={60.3868} bottomCqw={13.2357} widthCqw={11.0708} />
      <DeckPin leftCqw={34.7368} bottomCqw={14.2684} widthCqw={6.4218} />
    </div>
  );
}

/**
 * One drawn map pin - the back layer filling the box, the pin itself offset
 * 6.6/167.1ths of the height below it (the drawn relationship at all three
 * sizes - the ratio is identical in each, so one composite serves them all).
 *
 * Plain `next/image`, NOT `Media`: `Media` is a ratio SLOT whose className
 * lands on its own frame, so an `absolute` passed in resolves against the
 * card rather than this span - the first cut scattered pin layers a hundred
 * pixels from their boxes. Two fixed-geometry svg layers need no slot.
 */
function DeckPin({
  leftCqw,
  bottomCqw,
  widthCqw,
}: {
  leftCqw: number;
  bottomCqw: number;
  widthCqw: number;
}) {
  return (
    <span
      className="absolute"
      style={{
        left: `${leftCqw}cqw`,
        bottom: `${bottomCqw}cqw`,
        width: `${widthCqw}cqw`,
        aspectRatio: "96.3066 / 167.126",
      }}
    >
      <Image src={deckPinBack} alt="" className="absolute inset-0 size-full" />
      <Image src={deckPin} alt="" className="absolute top-[3.95%] left-0 size-full" />
    </span>
  );
}

/**
 * `458:333`, the diagonal ribbon of five flag roundels - Nigeria, Ghana, South
 * Africa, Kenya, Rwanda - that is the whole background of "Move Money"
 * (`507:497`).
 *
 * 1271.64 x 920.31, placed at (-25.97, -169) inside the 1200 x 625 card frame
 * `458:332`, which clips it on all four sides. The export's own viewBox is
 * `-25.97 -169 1271.64 920.31`, i.e. its internal coordinates ARE card
 * coordinates, so placing the element at that offset at that size lands every
 * roundel exactly where Figma has it. Verified against the 1:1 Figma render of
 * `507:497`: the Ghana roundel's box is x 252.7..504.7, y 21.8..273.8 in card
 * space in both.
 *
 * TOP-anchored, because the ribbon enters through the card's top-left corner.
 * `overflow: hidden` on the card removes the 169 above and the 126 below.
 */
function FlagRoundelRibbon({ className, fan }: { className?: string; fan: boolean }) {
  /*
   * FLOW - 862:1020 re-lays the five roundels as one 20-degree row of 162px
   * coins sweeping the card bottom. That node cannot be exported: its rotated
   * auto-layout renders a 36px sliver, a Figma exporter defect reproduced
   * twice. So the flow places THE SAME committed ribbon export much larger
   * and bottom-anchored to match the drawn sweep - the same five roundels
   * through the same corner at the drawn coin scale, the export's own
   * diagonal standing in for the drawn 20 degrees. Values tuned against the
   * 862:785 render.
   */
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
    >
      <div
        className="absolute"
        style={
          fan
            ? {
                left: "-2.1642cqw", // -25.97 / 12
                top: "-14.0833cqw", // -169 / 12
                width: "105.97cqw", // 1271.64 / 12
              }
            : {
                left: "-42cqw",
                bottom: "-58cqw",
                width: "210cqw",
              }
        }
      >
        <Media src={deckFlagRibbon} alt="" ratio="1271.64 / 920.31" />
      </div>
    </div>
  );
}

/**
 * `507:729` (USDC) and `507:739` (USDT tilted), the art on the placed variant
 * `507:684`.
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
function CryptoCoins({ className, fan }: { className?: string; fan: boolean }) {
  /*
   * FLOW - 862:1072/1082: both coins present at the drawn 70%, each nearly a
   * card-width across, USDT breaking the left edge and USDC the bottom right.
   * The fan-era mobile rules (USDT dropped below `md`, USDC dimmed to 40% -
   * responsive.md S7.0.1) were about coins a third this size and now apply
   * only to the fan's own art.
   *
   * NO opacity is set here for the flow, and that is measured, not missed:
   * both exports carry the wash BAKED IN (opacity="0.7" on their own groups -
   * the fan design's value, which is also the drawn mobile 70%). Setting 0.7
   * again multiplied to 49% and rendered the coins visibly paler than the
   * 862:785 frame.
   */
  const usdt: CSSProperties = fan
    ? { left: 0, bottom: "-0.667cqw", width: "29.25cqw" }
    : { left: "-23.1579cqw", bottom: "1.1842cqw", width: "86.7466cqw" };
  const usdc: CSSProperties = fan
    ? { left: "22.3333cqw", bottom: 0, width: "35.6667cqw" }
    : { left: "42.2342cqw", bottom: 0, width: "83.0611cqw" };

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
    >
      <span
        className={cn("absolute", fan && "hidden md:block")}
        style={{
          ...usdt,
          aspectRatio: "351 / 268",
          backgroundImage: `url(${coinUsdtTilted.src})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom left",
        }}
      />
      <span
        className={cn("absolute", fan && "opacity-40 sm:opacity-100")}
        style={{
          ...usdc,
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
