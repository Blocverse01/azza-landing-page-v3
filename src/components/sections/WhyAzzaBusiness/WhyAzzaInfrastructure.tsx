import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import infraCollectCoinsPhone from "@design-system/assets/illustration/infra-collect-coins-phone.svg";
import infraCollectCoins from "@design-system/assets/illustration/infra-collect-coins.svg";
import infraOtcNairaRollPhone from "@design-system/assets/illustration/infra-otc-naira-roll-phone.svg";
import infraOtcNairaRoll from "@design-system/assets/illustration/infra-otc-naira-roll.svg";
import infraRampFlagCoinsPhone from "@design-system/assets/illustration/infra-ramp-flag-coins-phone.svg";
import infraRampFlagCoins from "@design-system/assets/illustration/infra-ramp-flag-coins.svg";

import { Icon, type IconName, Media, Reveal, Section } from "@/components/ui";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * "Why Azza?" — the dark "One infrastructure" band on /products/for-business.
 *
 * Figma `888:1479` (desktop, 1440 - the 2026-09-08 re-authoring of `868:690`,
 * a new node under the same name) and `885:540` (phone, 430) - and only those
 * two. It is the second "Why Azza?" block on this route and, per DECISIONS
 * D-012, a different component from the narrative next door: different
 * palette, different child count, a card grid where it has a prose column.
 * Nothing is shared between the two.
 *
 * Structure (888:1479, measured 2026-09-08):
 *
 *   888:1479  section   1440 x 1932, pad 120 all round, V gap 80  -> Section rhythm="deep"
 *   888:1480  h2        1200 x 300, Lemon Medium 120 / 0.9 / +2%  -> text-display-8
 *   888:1481  grid      1200 wide, V gap 12
 *   888:1482  row       H gap 12 -> two 594 x 620 cards
 *   888:1483  card 1    "Collect Local Currency & Stablecoins"  + card-tray art  (888:1484)
 *   888:1536  card 2    "OTC Trading"                           + naira-rolls art (888:1537)
 *   888:1623  card 3    1200 x 680, "On-Ramp & Off-Ramp"        + AZZA-coin art  (888:1646)
 *
 * Every card: radius 32, fill `surface.brand-card`, pad 40 / 48, `flex-col
 * justify-between`, overflow clipped, a white "Contact the team" CTA at the
 * foot (300 x 56, pad 16, radius 56, `action.card` ink, 24px `right_regular`
 * chevron at a 10 gap). Card 3 pads 160 on the right so its copy measures
 * 1000. Every text node carries `text-box: trim-both cap alphabetic`, which
 * is reproduced because it is what makes the gaps land; where `text-box` is
 * unsupported (Firefox) each block reads a few px looser, never broken - the
 * same ExchangeWidget / WhyAzzaNarrative precedent.
 *
 * THE 2026-09-08 RE-AUTHORING. Each card now carries one idea and one
 * illustration that fills its foot:
 *
 *   card 1  eyebrow / title / the three chips (in the copy block, 32 under the
 *           title, on one row at gap 12 - no body paragraph any more)
 *   card 2  eyebrow / title / one sentence ("Built for businesses…")
 *   card 3  eyebrow / title / one line ("Your product, Our infrastructure."),
 *           then the raised panel, then the CTA, at the 76 / 76 that
 *           `justify-between` produces on its own
 *
 * THE PHONE FRAME (885:540, 430 wide, below `sm`)
 * -----------------------------------------------
 *   885:540  section   pad 94 top and bottom, 16 gutters -> Section rhythm="flush" + own ladder
 *   885:709  h2        398 x 219, Lemon 64 / 0.9 / +2%, four lines -> phone `display-8`
 *   885:710  stack     398 wide, V gap 12, 59 below the h2
 *   885:711  card 1    398 x 620, pad 24 / 48
 *   885:753  card 2    398 x 620
 *   885:782  card 3    398 x 680
 *
 * What the phone frame changes against the desktop one, all of it measured:
 * eyebrow 24 -> 18, title 48 -> 40, body / chip / panel eyebrow 20 -> 16
 * (theme.css's phone tier carries those), eyebrow -> title gap 48 -> 32, the
 * chip row's gap 12 -> 8 and its glyphs 20 -> 16 (the on-/off-ramp arrows
 * stay 20), the raised panel full-width at pad 16 with its two chips
 * stretched and centred and - the one structural change - sitting INSIDE
 * card 3's copy block, 32 under the line, rather than spread from it. The
 * CTA is unchanged. The card heights are the desktop ones and the art is
 * placed by its own coordinates - see THE ART. The corner radius is drawn 32
 * but resolves to 24 through the operator's 2026-09-05 phone radius rule, the
 * same way the deck card's drawn 16 resolves to 12 - recorded, not fixed.
 *
 * THE ART
 * -------
 * Each card's illustration is one composed group in the file, drawn past the
 * card's edges and clipped by it. The exports are that group as Figma's SVG
 * of the VISIBLE part only - its bounds intersected with the card - with the
 * page and card plates stripped and any glyphs already outlined. Every one of
 * the six is cut flush to the card's bottom edge and right edge, so each is
 * anchored there and sized as the fraction of the card width the frame drew
 * it at, capped at its own export size:
 *
 *   888:1484  desktop card 1  594 x 441  (the card's full width)
 *   888:1537  desktop card 2  594 x 275  (the card's full width)
 *   888:1646  desktop card 3  709 x 484  (of 1200)
 *   888:1328  phone card 1    398 x 472  (the card's full width)
 *   888:1360  phone card 2    398 x 280  (the card's full width)
 *   888:1438  phone card 3    398 x 231.275 (the card's full width)
 *
 * The cap is what the tablet band (`sm` to `lg`, which neither file draws)
 * runs on: a stacked 700-900px card keeps the desktop export at its 594 /
 * 709 and tucks it bottom-right instead of scaling a card-wide composition
 * past the card's own height. At both design widths the cap and the fraction
 * agree. The card's own `overflow-clip` plus radius cuts the corner (the
 * export's clip path was removed so the cut follows the responsive radius).
 *
 * Both layers are in the DOM and one is `display: none` per breakpoint; the
 * hidden one is lazy and never fetched.
 *
 * Z-ORDER. Both frames draw each illustration beneath the card's copy and
 * chips, and the CTA over it - card 1's tray runs under its chips and behind
 * its pill in both. That is the order here: art first, everything else
 * `relative` above it.
 *
 * Server component (components.md S3). Nothing here holds state.
 */

const HEADING_ID = "why-azza-business-infrastructure-heading";

interface Chip {
  icon?: IconName;
  label: string;
}

/** One export, anchored to the card's bottom-right corner. */
interface ArtPlacement {
  src: StaticImageData;
  /** The export's box, in card px. */
  width: number;
  height: number;
  /** The card width the frame drew it in. */
  stage: number;
  sizes: string;
}

interface InfraCard {
  /** Figma node id, so an auditor can go straight to the source. */
  id: string;
  eyebrow: string;
  title: string;
  /** Paragraphs, verbatim. Card 1 has none since the 2026-09-08 re-authoring. */
  body: readonly string[];
  art: {
    desktop: ArtPlacement;
    phone: ArtPlacement;
  };
}

/** 888:1483 / 885:711 - the copy, the three chips 888:1520 / 888:1524 / 888:1528. */
const CARD_COLLECT: InfraCard = {
  id: "888-1483",
  eyebrow: "Collect Local Currency & Stablecoins",
  title: "Accept payments in local currencies or stablecoins.",
  body: [],
  art: {
    desktop: {
      src: infraCollectCoins,
      width: 594,
      height: 441,
      stage: 594,
      sizes: "(min-width: 1024px) 594px, 100vw",
    },
    phone: {
      src: infraCollectCoinsPhone,
      width: 398,
      height: 472,
      stage: 398,
      sizes: "100vw",
    },
  },
};

const COLLECT_CHIPS: readonly Chip[] = [
  { icon: "archive", label: "Collect" },
  { icon: "transfer-horizontal", label: "Convert" },
  { icon: "send-plane", label: "Settle" },
];

/** 888:1536 / 885:753. */
const CARD_OTC: InfraCard = {
  id: "888-1536",
  eyebrow: "OTC Trading",
  title: "Move large volumes with dedicated OTC execution.",
  body: ["Built for businesses that need to move significant volume efficiently."],
  art: {
    desktop: {
      src: infraOtcNairaRoll,
      width: 594,
      height: 275,
      stage: 594,
      sizes: "(min-width: 1024px) 594px, 100vw",
    },
    phone: {
      src: infraOtcNairaRollPhone,
      width: 398,
      height: 280,
      stage: 398,
      sizes: "100vw",
    },
  },
};

/** 888:1623 / 885:782 - "Your product, Our infrastructure." with the comma and capital as authored. */
const CARD_RAMP: InfraCard = {
  id: "888-1623",
  eyebrow: "On-Ramp & Off-Ramp Infrastructure",
  title: "Let your users move between local currencies and stablecoins.",
  body: ["Your product, Our infrastructure."],
  art: {
    desktop: {
      src: infraRampFlagCoins,
      width: 709,
      height: 484,
      stage: 1200,
      sizes: "(min-width: 1440px) 709px, 59vw",
    },
    phone: {
      src: infraRampFlagCoinsPhone,
      width: 398,
      height: 231.275,
      stage: 398,
      sizes: "100vw",
    },
  },
};

/**
 * 888:1630 - transcribed verbatim, stray capital and all ("crYpto"); the node
 * is set uppercase, so the CSS `uppercase` on the panel eyebrow is what the
 * reader sees either way.
 */
const RAMP_PANEL_EYEBROW = "On & Off-ramp crYpto";

/** 888:1632 and 888:1637 - the two directions, as [from, to]. */
const RAMP_PAIRS: readonly (readonly [string, string])[] = [
  ["Local currency", "Stablecoins"],
  ["Stablecoins", "Local currency"],
];

/**
 * 888:1533 / 888:1620 / 888:1643 - the same label on all three cards. The
 * file draws no destination; "Contact the team" goes where every other
 * contact affordance on the site goes, the WhatsApp chat (`WHATSAPP_CHAT_URL`,
 * the nav CTA's own target), so the three CTAs are three routes to one
 * conversation.
 */
const CTA_LABEL = "Contact the team";

export default function WhyAzzaInfrastructure() {
  return (
    <Section
      rhythm="flush"
      container="default"
      gap={0}
      background="bg-surface-inverse-panel"
      aria-labelledby={HEADING_ID}
      /*
       * `flush` plus the `deep` ladder from `sm` up, because the phone frame
       * pads 94 top and bottom (885:709 sits 94 in; the last card ends 94
       * short of the frame) and no rhythm step is 94. From `sm` this IS
       * `rhythm="deep"`, written out.
       */
      className="py-[94px] sm:py-18 md:py-20 lg:py-24 xl:py-30"
    >
      {/*
       * `gap={0}` because Section only knows 0 and 48: 888:1479 draws 80
       * between the headline and the grid and 885:540 draws 59, so both live
       * here.
       */}
      <div className="flex w-full flex-col items-center gap-[59px] sm:gap-12 lg:gap-20">
        <Reveal className="w-full">
          {/*
           * 888:1480 / 885:709. `text-display-8` is the 120 / 0.9 / +2% step
           * (64 on a phone, from the phone tier); the three lime words are the
           * file's own colour spans, not a swap device - this headline carries
           * no Subjectivity "O" (it is one of the un-swapped set), so
           * `DisplayHeading` and its indices are not used. The trim is the
           * node's own `text-box` setting, which is what makes the block 300
           * tall rather than 324 (219 rather than 230 on the phone).
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
         * 888:1481 / 885:710. Three cards, one list: the row of two (888:1482)
         * and the full-width third are one 12px grid, `lg:grid-cols-2` with
         * the last spanning both. Below `lg` the 594 cards would fall under
         * 460 and the 48px title would wrap to four lines, so they stack - and
         * the phone frame draws exactly that stack at the same 12.
         *
         * `role="list"` for the reason WhyAzzaCrossBorder.tsx records: Tailwind's
         * preflight sets `list-style: none`, and Safari/VoiceOver drops list
         * semantics from an un-marked list.
         */}
        <ul className="grid w-full grid-cols-1 gap-3 lg:grid-cols-2" role="list">
          <InfraCardShell card={CARD_COLLECT} index={1}>
            <CardCopy card={CARD_COLLECT}>
              {/*
               * 888:1519 / 888:1314 - the chip row is part of the copy block
               * now, 32 under the title, full measure, one row (406 of 514 at
               * 1440, 346 of 350 at 430) at gap 12 / 8. `flex-wrap` is only
               * the safety net for a card narrower than the phone frame. The
               * glyphs are 20 at 1440 and 16 in the phone frame (888:1316).
               */}
              <ul className="flex w-full flex-wrap gap-2 sm:gap-3" role="list">
                {COLLECT_CHIPS.map((chip) => (
                  <li key={chip.label} className="flex">
                    <ChipPill>
                      {chip.icon ? (
                        <Icon
                          name={chip.icon}
                          size="sm"
                          className="text-fg-accent-lime max-sm:size-4"
                        />
                      ) : null}
                      <ChipLabel>{chip.label}</ChipLabel>
                    </ChipPill>
                  </li>
                ))}
              </ul>
            </CardCopy>
            <ContactCta />
          </InfraCardShell>

          <InfraCardShell card={CARD_OTC} index={2}>
            <CardCopy card={CARD_OTC} />
            <ContactCta />
          </InfraCardShell>

          <InfraCardShell card={CARD_RAMP} index={3} wide>
            {/*
             * The phone frame (885:783) draws the raised panel INSIDE the copy
             * block, 32 under "Your product, Our infrastructure."; the desktop
             * frame (888:1623) spreads copy / panel / CTA with `justify-
             * between` (76 / 76). One tree serves both: below `sm` this
             * wrapper is a 32-gap column holding copy and panel, so the card
             * sees two children and puts the CTA at the foot; from `sm` it is
             * `display: contents` and dissolves, so the card sees three.
             */}
            <div className="relative flex flex-col gap-8 sm:contents">
              <CardCopy card={CARD_RAMP} />

              {/*
               * 888:1629 / 888:1465 - the raised panel: radius 32, a 1px
               * `line.brand-card-raised` hairline, V gap 24. Hug-width at pad
               * 24 in the desktop frame (387 wide); the card's full width at
               * pad 16 in the phone frame, where its two chips (888:1632 /
               * 888:1637, stacked at 12, label / arrow / label at a 16 gap on
               * the deeper chip fill) stretch to the panel and centre their
               * content. The arrows stay 20 on the phone (888:1470).
               */}
              <div className="bg-surface-brand-card-raised border-line-brand-card-raised rounded-5xl relative flex w-full max-w-full min-w-0 flex-col gap-6 border p-4 sm:w-fit sm:p-6">
                <p className="text-md-eyebrow text-fg-accent-lime uppercase [text-box:trim-both_cap_alphabetic]">
                  {RAMP_PANEL_EYEBROW}
                </p>
                <ul className="flex flex-col gap-3" role="list">
                  {RAMP_PAIRS.map(([from, to]) => (
                    <li key={`${from}-${to}`} className="flex">
                      <ChipPill className="bg-surface-brand-card-chip-deep w-full justify-center gap-x-4 sm:w-auto sm:justify-start">
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
            </div>

            <ContactCta />
          </InfraCardShell>
        </ul>
      </div>
    </Section>
  );
}

/*
 * The card box. 620 / 680 tall in both frames with the copy at the top and
 * the CTA at the foot; `min-h` rather than `h` so a title that wraps one line
 * further (a 350 card at 390, or the 458 card at `lg`) grows the card instead
 * of spilling out of it. At the two design widths the content is inside the
 * minimum and the card resolves to the drawn height exactly. The `gap-12` is
 * the floor between the blocks wherever the minimum is not what sets the
 * height. Padding is the phone frame's 24 / 48 below `sm`, the desktop
 * frame's 40 / 48 from there.
 */
function InfraCardShell({
  card,
  index,
  wide = false,
  children,
}: {
  card: InfraCard;
  index: number;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <Reveal
      as="li"
      index={index}
      className={cn(
        "bg-surface-brand-card rounded-5xl relative flex min-w-0 flex-col justify-between gap-12 overflow-clip px-6 py-12 sm:px-10",
        wide ? "min-h-[680px] lg:col-span-2 lg:pr-40" : "min-h-[620px]",
      )}
    >
      <CardArt art={card.art.desktop} className="max-sm:hidden" />
      <CardArt art={card.art.phone} className="sm:hidden" />
      {children}
    </Reveal>
  );
}

/**
 * 888:1515 / 885:731 - eyebrow, then the title block. Eyebrow -> title is 48
 * in the desktop frame and 32 in the phone frame; everything inside the title
 * block (title -> body, title -> chips) is 32 in both. `children` is whatever
 * the frame puts under the title alongside or instead of the body - card 1's
 * chip row.
 */
function CardCopy({ card, children }: { card: InfraCard; children?: ReactNode }) {
  return (
    <div className="relative flex w-full flex-col gap-8 sm:gap-12">
      <p className="text-lg-eyebrow text-fg-accent-lime [text-box:trim-both_cap_alphabetic]">
        {card.eyebrow}
      </p>
      <div className="flex flex-col gap-8">
        <h3 className="text-5xl-card text-fg-on-brand [text-box:trim-both_cap_alphabetic]">
          {card.title}
        </h3>
        {card.body.length > 0 ? (
          <div className="text-md-card-body text-fg-on-brand flex flex-col gap-[1.7em]">
            {card.body.map((paragraph) => (
              <p key={paragraph} className="[text-box:trim-both_cap_alphabetic]">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/**
 * The illustration layer - decorative, inert, beneath everything. See THE
 * ART in the file header for the geometry: bottom-right anchored, sized as
 * the drawn fraction of the card width and capped at the export's own box.
 * `Media` reserves the box from the file's own aspect so nothing shifts as
 * the SVG arrives.
 */
function CardArt({ art, className }: { art: ArtPlacement; className?: string }) {
  const fraction = (art.width / art.stage) * 100;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute right-0 bottom-0", className)}
      style={{ width: `min(${fraction}%, ${art.width}px)` }}
    >
      <Media src={art.src} alt="" ratio={`${art.width}/${art.height}`} sizes={art.sizes} />
    </div>
  );
}

/*
 * 888:1520 and its siblings: 40 tall, pad 12 / 16, radius 40 (a pill at this
 * height), `surface.brand-card-chip`, H gap 8 - 16 on the on-/off-ramp pair,
 * which also sits on the deeper `surface.brand-card-chip-deep` (passed in by
 * the panel).
 *
 * `min-h-10` and `flex-wrap` rather than a fixed 40: on a card narrower than
 * the 430 phone frame the on-/off-ramp pair can outgrow the panel, and the
 * pill then keeps its labels whole and breaks between them instead of
 * pushing the whole card past the viewport. At both design widths nothing
 * wraps and the pill resolves to the drawn 40: the file's 12 / 12 padding
 * around the cap-trimmed label is centred inside the 40 minimum here exactly
 * as it was inside the fixed height.
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
 * 888:1532 / 888:1619 / 888:1642 (and 885:749 / 885:778 / 885:831, identical)
 * - the white CTA at the foot of every card: 300 x 56, pad 16, H gap 10,
 * radius 56 (a pill at this height, so `rounded-pill`), `action.card` ink,
 * 20px Medium label at leading 1.2, and the 24px `right_regular` chevron. The
 * phone frame keeps every one of those numbers.
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
