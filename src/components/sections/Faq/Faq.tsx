"use client";

import { useId, useState } from "react";

import lightningPattern from "@design-system/assets/pattern/pattern-lightning-bolt.webp";

import { Logo, Reveal, Section } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/content/faq";

import { FaqQuestionList } from "./FaqQuestionList";

export interface FaqProps {
  /** One of the four sets in `src/content/faq.ts`. */
  items: readonly FaqItem[];
  /** Supply one to own the heading id; otherwise a unique one is generated. */
  headingId?: string;
}

/**
 * The FAQ section - `412:1554` and its three siblings `412:1759`, `412:1996`,
 * `412:2633`. One component, four question sets; only the height differs, and
 * it is driven by the list (layout.md S5.3).
 *
 * ON THE 712 IN layout.md S5.3 - IT IS A FIXED HEIGHT, NOT A RULE
 * ---------------------------------------------------------------
 * Three of the four dark panels (`412:1560`, `412:1765`, `412:2002`) are 660
 * tall. Their content needs 535, 593 and 651. Only `412:2639`, the one the
 * designer actually resized, is content-sized - and it is 505, which is exactly
 * `40 + 62 (QUESTIONS) + 40 + 323 (list) + 40`. So the authored rule is a 40px
 * bottom padding, matching the panel's 40 top and 40 left; the 660 is one fixed
 * height copied across three frames, and the 9 / 67 / 125px of slack it leaves
 * is residue, not breathing room. This component reproduces the 40 and lets the
 * list drive the rest, which is both what S5.3 asks for and what makes the card
 * survive a question count the design never drew.
 *
 * This is the only file in the section carrying `"use client"`
 * (components.md S3): it owns which row is open. `FaqQuestionList` and
 * `FaqAnswerPanel` reach the client bundle by import and must not repeat the
 * directive - a directive on a file that is never an entry point is noise that
 * hides where the client boundary actually is.
 *
 * Exactly one row is open at a time and the first is open at rest, matching the
 * design's single answer pane (responsive.md S7.2.5). Escape may close the last
 * open row, leaving none - dismissal that refuses to dismiss is worse than a
 * momentarily empty pane, and the next click or Enter restores one.
 */
export function Faq({ items, headingId }: FaqProps) {
  const generatedId = useId();
  const id = headingId ?? `${generatedId}faq-heading`;
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <Section
      rhythm="standard"
      container="faq"
      gap={48}
      background="bg-surface-subtle"
      aria-labelledby={id}
    >
      <Reveal>
        {/* 412:1555 */}
        <h2 id={id} className="text-2xl text-fg-body">
          Frequently Asked Questions
        </h2>
      </Reveal>

      <Reveal index={1} className="w-full">
        {/* 412:1556. Insets are 28 top / 28 left / 24 bottom / 59 right at the
         * design width - asymmetric on purpose, so the answer bubble reads as
         * optically centred against the off-centre backdrop (layout.md S1.4).
         *
         * The top inset is 68 rather than 28 because the dark panel's own 40px
         * top padding is applied as a bleed on the backdrop cell, not as padding
         * on a wrapper that cannot exist here. The BOTTOM stays 24: the panel's
         * matching 40px bottom padding is a trailing grid track inside
         * `FaqQuestionList`, so the panel's own bottom edge lands here, 24px
         * clear of the card border, instead of overrunning it and being clipped
         * by `overflow-hidden`. */}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-6xl bg-accordion-card",
            "p-5 sm:p-6",
            "lg:pt-[68px] lg:pr-[59px] lg:pb-6 lg:pl-7",
          )}
        >
          {/* 412:1557 / 412:1558 - the lightning mask. It renders near-invisibly
           * by design (assets.md S5.2): a surface-faint field showing through a
           * 1374px alpha mask at 64%. Dropped below `lg`, where a 1374px
           * decorative mask is pure payload against a card a fifth of its width
           * (responsive.md S7.2.5). */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -top-6 -left-60 hidden size-[1374px]",
              "bg-surface-faint opacity-64 lg:block",
            )}
            style={{
              maskImage: `url(${lightningPattern.src})`,
              WebkitMaskImage: `url(${lightningPattern.src})`,
              maskSize: "1374px 1374px",
              WebkitMaskSize: "1374px 1374px",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />

          {/* 412:1575 - the brand chip. Pinned to the card's top-right corner at
           * `lg`; above the list and left-aligned below it, where there is no
           * corner to spare. The mark is decorative and the word beside it is
           * the accessible name - one name, never two. */}
          <div className="relative mb-4 flex items-center gap-2 lg:absolute lg:top-7 lg:right-15 lg:mb-0">
            <Logo variant="mark" height={40} />
            <span className="font-brand text-brand-wordmark text-fg-on-contrast">
              Azza
            </span>
          </div>

          <FaqQuestionList
            items={items}
            openId={openId}
            onOpenChange={setOpenId}
          />
        </div>
      </Reveal>
    </Section>
  );
}

export default Faq;
