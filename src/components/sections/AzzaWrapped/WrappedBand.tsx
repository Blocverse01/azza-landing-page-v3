import Image from "next/image";
import { Fragment } from "react";

import azzaman from "@design-system/assets/illustration/azzaman-character.webp";
import badgeRing from "@design-system/assets/illustration/wrapped-badge-ring.svg";
import ribbon from "@design-system/assets/illustration/wrapped-baddiie-ribbon.webp";
import patternDisc from "@design-system/assets/illustration/wrapped-pattern-disc.webp";
import guilloche from "@design-system/assets/pattern/pattern-guilloche-green.webp";
import plate from "@design-system/assets/pattern/wrapped-plate-pattern.webp";

import { Grain, Icon, Media, Reveal } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * The Azza Wrapped share card - Figma `412:1155`, 1440 x 752.821, and the one
 * frame in the file that is composed entirely by hand-placed coordinate, several
 * of them negative. layout.md S8.2 classifies it with `412:1234` as
 * "decorative-artwork: illustration, not layout", and responsive.md S3.3 pins it
 * at `min(1440px, 100%)` because fluid scaling tears the composition.
 *
 * HOW IT SCALES (responsive.md S7.2.6)
 * -----------------------------------
 * At `lg`+ every child is absolutely positioned in **percentages of the band**,
 * never px, so the whole card scales as one unit from 1440 down to 1024 without
 * any element drifting relative to another. The percentages below are each
 * `figmaValue / 1440` or `figmaValue / 752.821`; they are illustration
 * coordinates, which is the one category layout.md exempts from the spacing
 * scale. Type is NOT positioned that way - every text role resolves to an
 * `--text-accent-*` token whose clamp already carries it down the viewport.
 *
 * Below `lg` the card is recomposed vertically: character art, wordmark, the
 * three large callouts, the chain badge. The flow wrapper is `lg:contents`, so
 * at `lg`+ its box disappears and its children position against the band
 * directly - one DOM, two presentations, zero duplicated markup.
 *
 * THE FIGURES CONTRADICT EACH OTHER AND THAT IS DELIBERATE (D-027 item 3)
 * ----------------------------------------------------------------------
 * `412:1169` says Transactions Volume **$500**; `412:1182`/`412:1187` say
 * **$20K**. `412:1177` says Highest Single Trade **$5000**;
 * `412:1183`/`412:1188` say **$5K**. Same card, same labels, different numbers.
 * Both sets ship exactly as designed. Silently reconciling them would hide a
 * real content defect from the operator, which is the one thing this run is not
 * allowed to do. Trades agree at 100.
 */

/**
 * The three large stat callouts - `412:1168`, `412:1176`, `412:1172`.
 *
 * Each is a two-tone lockup: a `fg.stat-lime` copy offset down-right behind a
 * white copy. The offset is authored in Figma as +4.1 / +6.15 px at 73.846 px,
 * expressed here in `em` so it tracks the clamped font size instead of breaking
 * away from the glyphs at small viewports.
 *
 * A and B are left-aligned on the group's left edge; C is right-aligned - that
 * is what the design's render shows, and it is why no centring transform is
 * needed here (a transform on a `Reveal` element would be overwritten by the
 * entrance animation's own `transform`).
 */
const CALLOUTS = [
  {
    /** 412:1169 / 412:1170 - contradicts the $20K in the summary list. */
    figure: "$500",
    /** 412:1171 */
    caption: "Transactions VOLUME",
    /** left 82.05 / top 94.36 */
    place: "lg:left-[5.698%] lg:top-[12.534%] lg:text-left",
  },
  {
    /** 412:1177 / 412:1178 - contradicts the $5K in the summary list. */
    figure: "$5000",
    /** 412:1179 */
    caption: "HIGHEST SINGLE TRADE",
    /** left 77.96 / top 555.9 */
    place: "lg:left-[5.414%] lg:top-[73.842%] lg:text-left",
  },
  {
    /** 412:1173 / 412:1174 - the one figure both sets agree on. */
    figure: "100",
    /** 412:1175 */
    caption: "TRADES",
    /** right edge 1314 / top 555.9 */
    place: "lg:right-[8.75%] lg:top-[73.842%] lg:text-right",
  },
] as const;

/** The summary list - `412:1180`. Transcribed verbatim, colons included. */
const SUMMARY = [
  { label: "Transactions VOLUME:", value: "$20K", chain: false },
  { label: "HIGHEST SINGLE TRADE:", value: "$5K", chain: false },
  { label: "NUMBER OF TRADES:", value: "100", chain: false },
  { label: "MOST USED CHAIN:", value: "BNB", chain: true },
] as const;

/** `412:1164`-`412:1167`. Solid `palette.lime.800` discs, three of the four
 *  hanging off the band's edge - verified by rendering the nodes in isolation.
 *  They exist only at `lg`+; responsive.md S7.2.6 drops them below it. */
const CORNERS = [
  "lg:left-[-3.134%] lg:top-[-3.815%]",
  "lg:left-[92.308%] lg:top-[-5.041%]",
  "lg:left-[93.447%] lg:top-[85.423%]",
  "lg:left-[-3.134%] lg:top-[85.423%]",
];

export interface WrappedBandProps {
  /** Referenced by the carousel controls' `aria-controls`. */
  id: string;
  /** The id the section's `aria-labelledby` points at. */
  headingId: string;
}

export function WrappedBand({ id, headingId }: WrappedBandProps) {
  return (
    <div
      id={id}
      // `isolate` keeps the two mix-blend layers below from compositing against
      // the page behind the band. The aspect ratio is the band's own
      // 1440 x 752.821 and must stay a literal - a template-built class name is
      // invisible to Tailwind's scanner and would emit no CSS at all.
      className="relative isolate w-full max-w-(--breakpoint-2xl) overflow-clip lg:aspect-[1440/752.821]"
    >
      {/* 412:1156 - the chevron plate. assets.md S5.4: the node's fill is a
          raster, not a vector, so there is nothing to preserve as SVG. */}
      <div aria-hidden="true" className="absolute inset-0">
        <Media
          src={plate}
          alt=""
          ratio="1441/752.821"
          sizes="(max-width: 1439px) 100vw, 1440px"
          className="h-full"
        />
      </div>

      {/* 412:1157 - the inner plate. assets.md S5.4 ruled this CSS rather than
          an asset: it is a plain rectangle with a 1px inset stroke. */}
      <div
        aria-hidden="true"
        className="border-line-accent-lime bg-palette-lime-600 pointer-events-none absolute inset-x-4 inset-y-4 border lg:inset-x-[1.745%] lg:inset-y-[5.518%]"
      />

      {/* 412:1163 - the banknote guilloche, deliberately overflowing the band at
          lg+ and contained below it (responsive.md S7.2.6). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-12 mix-blend-difference lg:top-[-15.94%] lg:right-auto lg:bottom-auto lg:left-[-1.567%] lg:h-[141.94%] lg:w-[111.396%]"
      >
        <Media
          src={guilloche}
          alt=""
          ratio="626/417"
          sizes="(max-width: 1023px) 100vw, 1605px"
          className="h-full"
        />
      </div>

      {CORNERS.map((place) => (
        <span
          key={place}
          aria-hidden="true"
          className={cn(
            "bg-palette-lime-800 pointer-events-none absolute hidden aspect-square w-[9.615%] rounded-full lg:block",
            place,
          )}
        />
      ))}

      {/* 412:1201 - the small badge disc. Unreferenced by the responsive
          recomposition, so it keeps company with the corner ellipses and is
          shown at lg+ only. */}
      <div
        aria-hidden="true"
        className="bg-surface-accent-lime pointer-events-none absolute hidden aspect-square w-[9.046%] items-center justify-center rounded-full lg:top-[31.841%] lg:left-[6.481%] lg:flex"
      >
        <Image src={badgeRing} alt="" unoptimized className="h-auto w-[93.97%]" />
      </div>

      {/* 412:1211 - the dark textured disc behind the character.
          `rounded-full overflow-clip` is load-bearing, not decoration: the
          shipped bitmap is a circle matted on OPAQUE WHITE, not the alpha
          assets.md S2 records, so without the clip its four corners paint a
          white square across the middle of the card. The disc is inscribed in
          its own square, so the radius removes the matte exactly. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden w-[40.705%] -translate-x-1/2 overflow-clip rounded-full lg:top-[11.717%] lg:left-[52.831%] lg:block"
      >
        <Media src={patternDisc} alt="" ratio="1/1" sizes="587px" />
      </div>

      {/*
       * The flow wrapper. Below `lg` it is the vertical recomposition; at `lg`+
       * `display: contents` removes its box entirely so each child positions
       * against the band. That is what makes one DOM serve both presentations.
       */}
      <div className="relative flex flex-col items-center gap-8 px-5 py-12 sm:px-8 lg:contents">
        <div className="max-w-narrow flex w-full flex-col items-center lg:contents">
          {/* 412:1214 - the lime disc holding the character. A circle at lg+,
              a 16:9 crop below it (responsive.md S10's art-direction table). */}
          <div className="bg-surface-accent-lime relative aspect-video w-full overflow-clip rounded-3xl lg:absolute lg:top-[14.032%] lg:left-[34.01%] lg:aspect-square lg:w-[37.678%] lg:rounded-full">
            {/* 412:1215. Below `lg` the square character is anchored to the top
                of the 16:9 crop at 125% of its height, so it reads at roughly
                70% of the card's width instead of the 56% a contained square
                would give; the overflow is at the feet, which carry nothing. */}
            <div className="absolute top-0 left-1/2 aspect-square h-[125%] w-auto -translate-x-1/2 lg:top-[-15.69%] lg:h-auto lg:w-[118.42%]">
              <Media
                src={azzaman}
                alt="Azzaman, the Azza mascot, holding a fan of banknotes"
                ratio="1/1"
                sizes="(max-width: 1023px) 70vw, 642px"
                className="h-full lg:h-auto"
              />
            </div>
            {/* 412:1216 - the same guilloche again, luminosity-blended inside
                the disc. One file, so it costs one request either way. At lg+
                it keeps the design's own 834.71 x 556.029 box (153.84% of the
                disc, overflowing it and clipped by the circle) rather than
                being cover-cropped into a square, which would zoom the
                engraving to roughly 2.5x its intended scale. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-12 mix-blend-luminosity lg:top-[-2.7%] lg:right-auto lg:bottom-auto lg:left-[-26.69%] lg:h-auto lg:w-[153.84%]"
            >
              <Media
                src={guilloche}
                alt=""
                ratio="626/417"
                sizes="(max-width: 1023px) 60vw, 835px"
                className="h-full lg:h-auto"
              />
            </div>
          </div>

          {/* 412:1218 + 412:1219 - the ribbon and the persona label it carries.
              The shipped bitmap is 2061x373; the Figma node box is 32px taller
              at 1x because its lower band is empty, so the slot uses the asset's
              own ratio and anchors on the node's top edge.

              `mix-blend-darken` is the same white-matte problem as the pattern
              disc above, minus the escape hatch: the ribbon is a notched banner,
              so no border-radius can cut its matte away. Darken keeps whichever
              of ribbon and backdrop is darker per channel, which drops pure
              white to nothing and leaves the banner's own greens intact against
              the lime plate. The label is a sibling, so it does not blend.

              The centring is done as a plain `left` (52.833% - 47.689%/2) and
              NOT as `left-1/2 -translate-x-1/2`: a transform creates a stacking
              context, which isolates the blend inside this box and hands the
              matte straight back. */}
          <div className="relative -mt-6 w-full lg:absolute lg:top-[83.514%] lg:left-[28.9885%] lg:mt-0 lg:w-[47.689%]">
            <Media
              src={ribbon}
              alt=""
              ratio="2061/373"
              sizes="(max-width: 1023px) 90vw, 687px"
              className="mix-blend-darken"
            />
            <p className="font-accent text-accent-3 text-fg-on-inverse absolute top-[46.72%] left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap uppercase">
              HUSTLER
            </p>
          </div>
        </div>

        {/* 412:1196 - the "AZZA WRAPPED" lockup, and the section's accessible
            name. Two-tone like the callouts, offset +3.46 / +5.19 px at
            41.537px = 0.083em / 0.125em. */}
        <h2
          id={headingId}
          className="font-accent text-accent-4 text-fg-on-inverse relative text-center uppercase lg:absolute lg:top-[13.413%] lg:right-[11.232%] lg:text-right"
        >
          <span
            aria-hidden="true"
            className="text-fg-stat-lime absolute inset-0 translate-x-[0.083em] translate-y-[0.125em]"
          >
            <span className="block">AZZA</span>
            <span className="block">WRAPPED</span>
          </span>
          {/* The explicit space between the two lines is deliberate. Whitespace
              between block-level siblings is discarded in layout, so it costs
              nothing visually, but it guarantees the accessible name computes as
              "AZZA WRAPPED" rather than depending on each engine's handling of
              block boundaries in name computation. */}
          <span className="relative block">AZZA</span>{" "}
          <span className="relative block">WRAPPED</span>
        </h2>

        {/* 412:1200 - the outlined bolt closing the lockup. Sized in percent of
            the band so it scales with the composition rather than pinning to
            42x74 while everything around it shrinks. */}
        <span
          aria-hidden="true"
          className="text-surface-accent-lime pointer-events-none absolute hidden lg:top-[13.93%] lg:left-[89.22%] lg:block lg:h-[9.85%] lg:w-[2.94%]"
        >
          <Icon name="bolt-outline" size={74} className="h-full w-full" />
        </span>

        {/* 412:1168 / 412:1176 / 412:1172 - one column at base, two-plus-one at
            `xs`, three-up at `md`, scattered around the card at `lg`+. */}
        <div className="xs:grid-cols-2 grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:contents">
          {CALLOUTS.map((callout, index) => (
            <Reveal
              key={callout.caption}
              index={index}
              className={cn(
                // Centred in the stacked recomposition, where the wordmark and
                // the chain badge are centred too; back to the design's own
                // left / right alignment once the card is laid out at `lg`.
                "relative text-center lg:absolute",
                callout.place,
              )}
            >
              <p className="font-accent text-accent-2 text-fg-on-inverse relative uppercase">
                <span
                  aria-hidden="true"
                  className="text-fg-stat-lime absolute inset-0 translate-x-[0.055em] translate-y-[0.083em]"
                >
                  {callout.figure}
                </span>
                <span className="relative">{callout.figure}</span>
              </p>
              <p className="font-accent text-accent-caption text-fg-stat-lime uppercase">
                {callout.caption}
              </p>
            </Reveal>
          ))}
        </div>

        {/* 412:1180 - the summary list. responsive.md S7.2.6 drops it below
            `lg` as a duplicate of the callouts; it is also the half of the
            contradiction that disagrees with them.

            This is the one block anchored by its BOTTOM rather than its top.
            Everything else on the card scales with the band, but `accent-label`
            holds 16px at every breakpoint (components.md S11 C-8 drops the
            stepped body ramp), so this list keeps its 107px height while the
            band loses 29% between 1440 and 1024 - and a top anchor walks it
            straight into the "$5000" callout below. Anchoring the bottom at
            29.47% puts it at the design's own y=423.6 at 1440 and lets it grow
            upward into the empty space instead. Verified at 1024 in a browser;
            that collision is invisible to typecheck, lint and build. */}
        <dl className="hidden lg:absolute lg:bottom-[29.47%] lg:left-[6.481%] lg:grid lg:grid-cols-[auto_auto] lg:gap-x-8 lg:gap-y-2">
          {SUMMARY.map((row) => (
            <Fragment key={row.label}>
              <dt className="font-accent text-accent-label text-fg-on-inverse uppercase">
                {row.label}
              </dt>
              <dd className="font-accent text-accent-label text-fg-on-inverse flex items-center gap-1 uppercase">
                {row.chain ? <Icon name="crypto-bnb" size="sm" /> : null}
                {row.value}
              </dd>
            </Fragment>
          ))}
        </dl>

        {/* 412:1193 - the chain badge. The 140px coin is labelled here because
            below `lg` the summary list is gone and this mark is the only thing
            carrying the chain; icons.md leaves it decorative only when it sits
            beside the ticker text, which is the 20px instance above. */}
        <div className="bg-palette-lime-800 flex aspect-square h-24 w-24 items-center justify-center rounded-full lg:absolute lg:top-[37.603%] lg:left-[78.846%] lg:h-auto lg:w-[12.892%]">
          <Icon name="crypto-bnb" size={140} title="BNB" className="h-[75.48%] w-[75.48%]" />
        </div>
      </div>

      {/* 412:1220 - the grain field. */}
      <Grain opacity={0.1} />
    </div>
  );
}
