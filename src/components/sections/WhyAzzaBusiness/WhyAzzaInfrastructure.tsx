import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import infraCollectCoins from "@design-system/assets/illustration/infra-collect-coins.svg";
import infraOtcNairaRoll from "@design-system/assets/illustration/infra-otc-naira-roll.svg";
import infraRampFlagCoins from "@design-system/assets/illustration/infra-ramp-flag-coins.svg";

import { Icon, type IconName, Media, Reveal, Section } from "@/components/ui";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * "Why Azza?" — the dark "One infrastructure" band on /products/for-business.
 *
 * Figma `868:690` ONLY (added to `412:2412` in the 2026-09 revision, revised
 * again on 2026-09-07 - see THE 2026-09-07 REVISION below). It is the second
 * "Why Azza?" block on this route and, per DECISIONS D-012, a different
 * component from the narrative next door: different palette, different child
 * count, a card grid where it has a prose column. Nothing is shared between
 * the two files.
 *
 * Structure (868:690, re-measured 2026-09-07):
 *
 *   868:690  section   1440 x 1932, pad 120 all round, V gap 80  -> Section rhythm="deep"
 *   868:728  h2        1200 x 300, Lemon Medium 120 / 0.9 / +2%  -> text-display-8
 *   879:512  grid      1200 wide, V gap 12
 *   879:511  row       H gap 12 -> two 594 x 620 cards
 *   877:294  card 1    "Collect Local Currency & Stablecoins"  + coin stack art (877:453)
 *   877:321  card 2    "OTC Trading"                           + naira roll art  (877:433)
 *   877:341  card 3    1200 x 680, "On-Ramp & Off-Ramp"        + flag coins art  (877:380)
 *
 * Every card: radius 32, fill `surface.brand-card`, pad 40 / 48, `flex-col
 * justify-between`, overflow clipped. Card 3 pads 160 on the right so its copy
 * measures 1000. The eyebrow -> title gap is 48, title -> body 32, and every
 * text node carries `text-box: trim-both cap alphabetic`, which is reproduced
 * because it is what makes those gaps land; where `text-box` is unsupported
 * (Firefox) each block reads a few px looser, never broken - the same
 * ExchangeWidget / WhyAzzaNarrative precedent.
 *
 * THE 2026-09-07 REVISION
 * -----------------------
 * Every card grew (590 -> 620, 600 -> 680) to take a white "Contact the team"
 * CTA at its foot (880:525 / 880:528 / 880:533: 300 x 56, pad 16, radius 56,
 * `action.card` ink, 24px `right_regular` chevron at a 10 gap). The cards'
 * `justify-between` spreads copy / chips / CTA at exactly the drawn 30.5 and
 * 40 gaps, so nothing is hard-coded for it. Card 3 lost its "Your product.
 * Our infrastructure" chip - the line moved into the body copy as a second
 * paragraph - and its raised panel gained a `line.brand-card-raised` hairline,
 * a lighter fill (`surface.brand-card-raised`, #5551ED) and deeper chips
 * (`surface.brand-card-chip-deep`); its eyebrow reads "On & Off-ramp crYpto".
 * The art was re-exported because the taller cards reveal more of each group.
 *
 * THE ART
 * -------
 * Each card's illustration is one composed group in the file, drawn past the
 * card's edges and clipped by it. The three exports are that group as
 * Figma's SVG of the VISIBLE part only - its bounds intersected with the card
 * - with the page and card plates stripped and the ₦ glyphs already outlined
 * (Subjectivity is not in Figma's font service; the outline is what the file
 * renders). So each file's box is flush with the card's bottom edge, and for
 * cards 2 and 3 its right edge too, which is why the art is anchored to those
 * edges rather than placed by a top-left offset:
 *
 *   877:453  at (297, 357.14) in a 594 x 620 card, visible 278.856 x 262.855 -> left 50%, bottom 0
 *   877:433  at (56, 335)     in a 594 x 620 card, visible 538 x 285         -> right 0,  bottom 0
 *   877:380  at (253.92, 191.26) in a 1200 x 680 card, visible 946.076 x 488.739 -> right 0, bottom 0
 *
 * Widths are percentages of the card width, so the art scales with the card
 * and stays put at its corner at every width. The card's own `overflow-clip`
 * plus radius is what cuts the corner - the export's clip path was removed so
 * the cut follows the responsive radius (32 -> 24 below `md`) instead of a
 * baked 32.
 *
 * Z-ORDER. The file draws card 1's art beneath its copy and cards 2 and 3's
 * art above theirs. All three are drawn beneath here: in the file no ink
 * overlaps any text at the design width (the art groups' boxes do, their
 * pixels do not), so the render is identical, and at narrower widths, where
 * the copy wraps down into the art's box, the copy must win. The CTA is
 * likewise above the art: at the design width its right end (x 340) crosses
 * the coin stack's box (from x 297) over the flat disc base, exactly as drawn.
 *
 * Server component (components.md S3). Nothing here holds state.
 */

const HEADING_ID = "why-azza-business-infrastructure-heading";

interface Chip {
  icon?: IconName;
  label: string;
}

interface InfraCard {
  /** Figma node id, so an auditor can go straight to the source. */
  id: string;
  eyebrow: string;
  title: string;
  /** One or more paragraphs, verbatim. 877:325 and 877:346 are two-paragraph bodies. */
  body: readonly string[];
  art: {
    src: StaticImageData;
    /** Visible box, in card px, as exported. */
    width: number;
    height: number;
    /** Card width the box was measured against. */
    stage: number;
    /** Anchor. Card 1's art does not reach the right edge; it is placed from the left. */
    anchor: "left" | "right";
    /** The left offset in card px, for `anchor: "left"`. */
    left?: number;
    sizes: string;
  };
}

/** 877:294 - 877:298, 877:301, 877:302; the three chips 877:305 / 877:308 / 877:310. */
const CARD_COLLECT: InfraCard = {
  id: "877-294",
  eyebrow: "Collect Local Currency & Stablecoins",
  title: "Accept payments in local currencies or stablecoins.",
  body: [
    "Integrate Azza APIs to collect local currencies and stablecoins directly into your product; giving your customers more ways to pay while simplifying your settlement process.",
  ],
  art: {
    src: infraCollectCoins,
    width: 278.856,
    height: 262.855,
    stage: 594,
    anchor: "left",
    left: 297,
    sizes: "(min-width: 1024px) 279px, 47vw",
  },
};

const COLLECT_CHIPS: readonly Chip[] = [
  { icon: "archive", label: "Collect" },
  { icon: "transfer-horizontal", label: "Convert" },
  { icon: "send-plane", label: "Settle" },
];

/** 877:321 - 877:322, 877:324, 877:325 (two paragraphs separated by a blank line). */
const CARD_OTC: InfraCard = {
  id: "877-321",
  eyebrow: "OTC Trading",
  title: "Move large volumes with dedicated OTC execution.",
  body: [
    "Buy or sell stablecoins at scale with competitive pricing, deep liquidity, and reliable settlement through Azza's OTC desk.",
    "Built for businesses that need to move significant volume efficiently.",
  ],
  art: {
    src: infraOtcNairaRoll,
    width: 538,
    height: 285,
    stage: 594,
    anchor: "right",
    sizes: "(min-width: 1024px) 538px, 91vw",
  },
};

/**
 * 877:341 - 877:343, 877:345, 877:346. The body is two paragraphs separated by
 * a blank line, transcribed verbatim - "Stablecoins" capitalised and the
 * trailing space on the first paragraph trimmed, "Your product, Our
 * infrastructure." with the comma and capital as authored.
 */
const CARD_RAMP: InfraCard = {
  id: "877-341",
  eyebrow: "On-Ramp & Off-Ramp Infrastructure",
  title: "Let your users move between local currencies and stablecoins.",
  body: [
    "Integrate Azza's APIs into your platform and give your users a seamless way to move between local currency and Stablecoins.",
    "Your product, Our infrastructure.",
  ],
  art: {
    src: infraRampFlagCoins,
    width: 946.076,
    height: 488.739,
    stage: 1200,
    anchor: "right",
    sizes: "(min-width: 1440px) 946px, 79vw",
  },
};

/**
 * 877:495 - transcribed verbatim, stray capital and all ("crYpto"); the node
 * is set uppercase, so the CSS `uppercase` on the panel eyebrow is what the
 * reader sees either way.
 */
const RAMP_PANEL_EYEBROW = "On & Off-ramp crYpto";

/** 877:474 and 877:489 - the two directions, as [from, to]. */
const RAMP_PAIRS: readonly (readonly [string, string])[] = [
  ["Local currency", "Stablecoins"],
  ["Stablecoins", "Local currency"],
];

/**
 * 880:524 / 880:529 / 880:534 - the same label on all three cards. The file
 * draws no destination; "Contact the team" goes where every other contact
 * affordance on the site goes, the WhatsApp chat (`WHATSAPP_CHAT_URL`, the nav
 * CTA's own target), so the three CTAs are three routes to one conversation.
 */
const CTA_LABEL = "Contact the team";

/*
 * Below `lg` the cards are content-sized and stack, and the file draws no
 * layout for that. Every card's art sits under the foot of its copy once the
 * copy wraps, so each reserves the art's own height at the foot of the card -
 * as a percentage of the card width, which is exactly what the art's height
 * is (262.855 / 594, 285 / 594 and 488.739 / 1200) - plus the card's bottom
 * padding at that width (32 below `sm`, 48 from `sm`). Card 1 needs it too
 * now: the CTA spans the phone card's whole content box and would otherwise
 * sit across the coins, where the file has it crossing only the disc's edge.
 */
const ART_RESERVE_COLLECT = "max-sm:pb-[calc(44%+2rem)] sm:max-lg:pb-[calc(44%+3rem)]";
const ART_RESERVE_OTC = "max-sm:pb-[calc(48%+2rem)] sm:max-lg:pb-[calc(48%+3rem)]";
const ART_RESERVE_RAMP = "max-sm:pb-[calc(41%+2rem)] sm:max-lg:pb-[calc(41%+3rem)]";

export default function WhyAzzaInfrastructure() {
  return (
    <Section
      rhythm="deep"
      container="default"
      gap={0}
      background="bg-surface-inverse-panel"
      aria-labelledby={HEADING_ID}
    >
      {/*
       * `gap={0}` because Section only knows 0 and 48, and 868:690 draws 80
       * between the headline and the grid; the 80 lives here, stepped down
       * with the section's own rhythm below `lg`.
       */}
      <div className="flex w-full flex-col items-center gap-12 lg:gap-20">
        <Reveal className="w-full">
          {/*
           * 868:728. `text-display-8` is the 120 / 0.9 / +2% step; the three
           * lime words are the file's own colour spans, not a swap device -
           * this headline carries no Subjectivity "O" (it is one of the
           * un-swapped set), so `DisplayHeading` and its indices are not used.
           * The trim is 868:728's own `text-box` setting, which is what makes
           * the block 300 tall rather than 324.
           */}
          <h2
            id={HEADING_ID}
            className="font-display text-display-8 text-fg-on-inverse w-full text-center uppercase [text-box:trim-both_cap_alphabetic]"
          >
            One infrastructure for local <span className="text-fg-accent-lime">currencies</span>,{" "}
            <span className="text-fg-accent-lime">stablecoins</span> &amp; global{" "}
            <span className="text-fg-accent-lime">payments</span>.
          </h2>
        </Reveal>

        {/*
         * 879:512. Three cards, one list: the row of two (879:511) and the
         * full-width third are one 12px grid, `lg:grid-cols-2` with the last
         * spanning both. Below `lg` the 594 cards would fall under 460 and the
         * 48px title would wrap to four lines, so they stack.
         *
         * `role="list"` for the reason WhyAzzaCrossBorder.tsx records: Tailwind's
         * preflight sets `list-style: none`, and Safari/VoiceOver drops list
         * semantics from an un-marked list.
         */}
        <ul className="grid w-full grid-cols-1 gap-3 lg:grid-cols-2" role="list">
          <InfraCardShell card={CARD_COLLECT} index={1} className={ART_RESERVE_COLLECT}>
            <CardCopy card={CARD_COLLECT} />
            {/*
             * 877:312 - the chip row wraps at the design's own 277 measure,
             * which is what puts "Settle" on a second line under "Collect";
             * at the full 514 all three would sit on one line.
             */}
            <ul className="relative flex max-w-[277px] flex-wrap gap-3" role="list">
              {COLLECT_CHIPS.map((chip) => (
                <li key={chip.label} className="flex">
                  <ChipPill>
                    {chip.icon ? (
                      <Icon name={chip.icon} size="sm" className="text-fg-accent-lime" />
                    ) : null}
                    <ChipLabel>{chip.label}</ChipLabel>
                  </ChipPill>
                </li>
              ))}
            </ul>
            <ContactCta />
          </InfraCardShell>

          <InfraCardShell card={CARD_OTC} index={2} className={ART_RESERVE_OTC}>
            <CardCopy card={CARD_OTC} />
            <ContactCta />
          </InfraCardShell>

          <InfraCardShell card={CARD_RAMP} index={3} wide className={ART_RESERVE_RAMP}>
            <CardCopy card={CARD_RAMP} />

            {/*
             * 877:494 - the raised panel, hug-width (387 in the file), radius
             * 32, pad 24 inside a 1px `line.brand-card-raised` hairline, V gap
             * 24; its two chips 877:474 / 877:489 stack at 12 and run
             * label / arrow / label at a 16 gap on the deeper chip fill.
             */}
            <div className="bg-surface-brand-card-raised border-line-brand-card-raised rounded-5xl relative flex w-fit max-w-full min-w-0 flex-col gap-6 border p-6">
              <p className="text-md-eyebrow text-fg-accent-lime uppercase [text-box:trim-both_cap_alphabetic]">
                {RAMP_PANEL_EYEBROW}
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {RAMP_PAIRS.map(([from, to]) => (
                  <li key={`${from}-${to}`} className="flex">
                    <ChipPill className="bg-surface-brand-card-chip-deep gap-x-4">
                      <ChipLabel>{from}</ChipLabel>
                      <Icon
                        name="transfer-horizontal"
                        size="sm"
                        title="to"
                        className="text-fg-accent-lime"
                      />
                      <ChipLabel>{to}</ChipLabel>
                    </ChipPill>
                  </li>
                ))}
              </ul>
            </div>

            <ContactCta />
          </InfraCardShell>
        </ul>
      </div>
    </Section>
  );
}

/*
 * The card box. 620 / 680 tall in the file with the copy at the top and the
 * CTA at the foot; `min-h` rather than `h` so a title that wraps one line
 * further at `lg` (where the card is 458 wide) grows the card instead of
 * spilling out of it. At `xl`+ the content is well inside the minimum and the
 * card resolves to the drawn height exactly. The `gap-12` is the floor between
 * the blocks wherever the minimum is not what sets the height.
 */
function InfraCardShell({
  card,
  index,
  wide = false,
  className,
  children,
}: {
  card: InfraCard;
  index: number;
  wide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Reveal
      as="li"
      index={index}
      className={cn(
        "bg-surface-brand-card rounded-5xl relative flex min-w-0 flex-col justify-between gap-12 overflow-clip px-6 py-8 sm:px-10 sm:py-12",
        wide ? "lg:col-span-2 lg:min-h-[680px] lg:pr-40" : "lg:min-h-[620px]",
        className,
      )}
    >
      <CardArt art={card.art} />
      {children}
    </Reveal>
  );
}

/** 877:339 / 877:340 / 877:342 - eyebrow, then title + body at 48 / 32. */
function CardCopy({ card }: { card: InfraCard }) {
  return (
    <div className="relative flex w-full flex-col gap-12">
      <p className="text-lg-eyebrow text-fg-accent-lime [text-box:trim-both_cap_alphabetic]">
        {card.eyebrow}
      </p>
      <div className="flex flex-col gap-8">
        <h3 className="text-5xl-card text-fg-on-brand [text-box:trim-both_cap_alphabetic]">
          {card.title}
        </h3>
        {/*
         * 877:325 and 877:346 are each one text node with an empty paragraph
         * between two sentences - a blank 24px line. With each paragraph
         * cap-trimmed, the blank line plus the trimmed descent and cap gap
         * come to ~34px from one baseline to the next cap, which is `gap-8.5`.
         */}
        <div className="text-md-card-body text-fg-on-brand flex flex-col gap-8.5">
          {card.body.map((paragraph) => (
            <p key={paragraph} className="[text-box:trim-both_cap_alphabetic]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The illustration layer - decorative, inert, beneath the copy. See the file
 * header for the geometry. `Media` reserves the box from the file's own
 * aspect so nothing shifts as the SVG arrives.
 */
function CardArt({ art }: { art: InfraCard["art"] }) {
  const width = `${(art.width / art.stage) * 100}%`;
  const left = art.anchor === "left" ? `${((art.left ?? 0) / art.stage) * 100}%` : undefined;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-0",
        art.anchor === "right" ? "right-0" : undefined,
      )}
      style={{ width, left }}
    >
      <Media src={art.src} alt="" ratio={`${art.width}/${art.height}`} sizes={art.sizes} />
    </div>
  );
}

/*
 * 877:305 and its siblings: 40 tall, pad 12 / 16, radius 40 (a pill at this
 * height), `surface.brand-card-chip`, H gap 8 - 16 on the on-/off-ramp pair,
 * which also sits on the deeper `surface.brand-card-chip-deep` since the
 * 2026-09-07 revision (passed in by the panel).
 *
 * `min-h-10` and `flex-wrap` rather than a fixed 40: the on-/off-ramp pair
 * measures 337 in the file, wider than a phone card's content box, so below
 * `sm` the pill keeps its labels whole and breaks between them instead of
 * pushing the whole card past the viewport. At the design width nothing
 * wraps and the pill resolves to the drawn 40: the file's 12 / 12 padding
 * around a 15px cap-trimmed label is centred inside the 40 minimum here
 * exactly as it was inside the fixed height.
 */
function ChipPill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "bg-surface-brand-card-chip rounded-pill inline-flex min-h-10 max-w-full flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2.5",
        className,
      )}
    >
      {children}
    </span>
  );
}

function ChipLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-md-chip text-fg-on-brand whitespace-nowrap [text-box:trim-both_cap_alphabetic]">
      {children}
    </span>
  );
}

/*
 * 880:525 / 880:528 / 880:533 - the white CTA at the foot of every card:
 * 300 x 56, pad 16, H gap 10, radius 56 (a pill at this height, so
 * `rounded-pill`), `action.card` ink, 20px Medium label at leading 1.2, and
 * the 24px `right_regular` chevron.
 *
 * Not `Button`: its size ladder tops out at a 16px Semi Bold label with a 20px
 * icon at an 8 gap, and its variants map onto the `action.*` families it
 * already knows - this control is a 20px Medium label with a 24px glyph on a
 * family that exists only here. It borrows Button's interaction contract
 * verbatim instead (components.md S10.6): hover recolours the fill only, with
 * a `:focus-visible` twin; press adds `translateY(1px)` and the active fill;
 * the release rides `--ease-spring`. `action.card-hover` / `-active` are the
 * indigo-50 / indigo-100 tints the `soft` family steps through, which is what
 * a white pill on brand blue reads as when pressed.
 *
 * `w-full max-w-[300px]`: the drawn 300 at every width the card can hold it,
 * and the card's content box below that (a 320 phone leaves 232), so the pill
 * never overruns the card.
 */
function ContactCta() {
  return (
    <div className="relative flex">
      <a
        href={WHATSAPP_CHAT_URL}
        className={cn(
          "bg-action-card text-action-card-fg rounded-pill text-md-cta inline-flex w-full max-w-[300px] items-center justify-center gap-2.5 p-4 no-underline select-none",
          "ease-spring transition-[background-color,color,transform] duration-(--motion-fast)",
          "hoverable:bg-action-card-hover focus-visible:bg-action-card-hover",
          "active:bg-action-card-active active:translate-y-px active:duration-(--motion-instant) active:ease-out",
        )}
      >
        {CTA_LABEL}
        <Icon name="chevron-right-regular" size="md" />
      </a>
    </div>
  );
}
