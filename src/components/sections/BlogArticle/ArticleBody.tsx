import type { ReactNode } from "react";

import { Prose, VisuallyHidden } from "@/components/ui";
import { WHATSAPP_CHAT_URL } from "@/content/navigation";

import { ShareRow } from "./ShareRow";

/*
 * THE ARTICLE BODY - 352:3707, `V, gap 60` (layout.md S4.8): the prose block
 * 352:3708 and the share footer 352:3724.
 *
 * WHY THE COPY IS A CONSTANT AND NOT DATA.
 * `BlogPost` (content/blog.ts S7.1) carries a title, a category, a date and an
 * image. It carries no body. The design authors exactly one article body -
 * 352:3709 through 352:3723 - and it is transcribed verbatim below, links and
 * all. Every slug therefore renders this body until real per-post copy exists.
 * Recorded in open_questions.
 *
 * THE PARAGRAPH RHYTHM IS NOT `Prose`'s.
 * components.md S4.11 gives `Prose` a two-value gap register, 20 or 60, and
 * documents 60 as "the article body (352:3707)". 60 is that frame's OWN gap -
 * the distance from the prose block to the share footer - not the distance
 * between paragraphs, which the design authors at 48 (352:3708, 352:3710,
 * 352:3711, 352:3712), 16 (352:3718) and 32 (352:3721). None of those is
 * reachable through the prop. The contract is passed as written and the
 * authored rhythm is composed inside a single child, where the gap has nothing
 * to space. Reported as a finding rather than resolved by widening the union.
 *
 * THE 2026-08 REVISION OF 282:803 (re-read 2026-08-23) opened the rhythm up:
 * the three nested 32s are 48 now - one paragraph pitch from the intro to the
 * disclaimer - and the sign-off block's 20 is 32. "Final Words" keeps its 16.
 */

/** The reading rhythm, straight off the Figma auto-layout frames. */
const RHYTHM = {
  block: "flex flex-col gap-12", // 48 - 352:3708 / 352:3710 / 352:3712
  sections: "flex flex-col gap-12", // 48 - 352:3711
  finalWords: "flex flex-col gap-4", // 16 - 352:3718
  disclaimer: "flex flex-col gap-8", // 32 - 352:3721
} as const;

/**
 * An inline prose link.
 *
 * Every link in this body leaves the site, and the design authors every one of
 * them `target="_blank"`. The visually-hidden note is the half of the label the
 * design leaves to context - a new tab that opens with no warning is the
 * classic unannounced context change.
 */
function ProseLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
    </a>
  );
}

export interface ArticleBodyProps {
  /** The article title, handed to the share footer for its share text. */
  title: string;
}

export function ArticleBody({ title }: ArticleBodyProps) {
  return (
    <div className="flex w-full max-w-(--container-prose) flex-col gap-15">
      {/*
       * `tone="prose"` is `fg.prose` #292929, which is exactly what 352:3708
       * paints. It is also `md-prose`'s default, and it is passed explicitly
       * because the colour belongs in the prop the component added for it -
       * never in a `className`, which `cn` cannot resolve against the pinned
       * class.
       */}
      <Prose step="md-prose" gap={60} tone="prose">
        {/* 352:3708 - V, gap 32, on fg.prose. */}
        <div className={RHYTHM.block}>
          {/* 352:3709 */}
          <p>
            {
              "In a world where your money should work for you, crypto is quickly becoming one of the smartest ways to earn passively. But let’s be real: the space is noisy, filled with buzzwords and hype. So we’re cutting through the noise with this beginner-friendly guide on how to actually earn passive income with crypto — safely and smartly. From staking and lending to NFTs and liquidity pools, these aren’t “get-rich” tips; they’re real strategies you can explore to put your assets to work. Let’s get into it."
            }
          </p>

          {/* 352:3710 - V, gap 32. */}
          <div className={RHYTHM.block}>
            {/* 352:3711 - V, gap 48. */}
            <div className={RHYTHM.sections}>
              {/*
               * 352:3712 - V, gap 32. Each of the five is ONE text node whose
               * leading clause is Inter Semi Bold at the same size, leading and
               * tracking as the body, followed by a line break. typography.md
               * S4.3 names these nodes and rules the treatment `<strong>`, "do
               * not create a separate token"; components.md S4.11 restates it.
               * responsive.md S7.5 asks for `<h2>` instead - two artifacts
               * against one, and the two that agree are the per-node type
               * authority. Reported as a finding.
               */}
              <div className={RHYTHM.block}>
                {/* 352:3713 */}
                <p>
                  <strong>1. Staking</strong>
                  <br />
                  {
                    "Staking is like earning interest on your crypto. You lock your coins in a blockchain network (like Ethereum or Solana), and you get rewarded for helping validate transactions. Think of it as a savings account, but for crypto. The catch? Your assets are locked for a certain period, and the reward rate varies depending on the blockchain. Some exchanges like "
                  }
                  <ProseLink href="https://lido.fi/">Lido</ProseLink>
                  {" and "}
                  <ProseLink href="https://www.binance.com/en/earn">Binance</ProseLink>
                  {
                    " offer flexible staking, while others require you to stake directly from a wallet."
                  }
                </p>

                {/* 352:3714 */}
                <p>
                  <strong>2. Yield Farming</strong>
                  <br />
                  {
                    "Yield farming is when you deposit crypto into a decentralized finance (DeFi) protocol to earn rewards, often in the form of new tokens. It’s high-risk, high-reward. Platforms like "
                  }
                  <ProseLink href="https://yearn.fi/">Yearn Finance</ProseLink>
                  {" and "}
                  <ProseLink href="https://aave.com/">Aave</ProseLink>
                  {
                    " are popular for this. Just know it’s not for the faint of heart — prices can be volatile, and smart contracts can be vulnerable to bugs or exploits."
                  }
                </p>

                {/* 352:3715 */}
                <p>
                  <strong>3. Lending Your Crypto</strong>
                  <br />
                  {"You can lend your crypto to others using platforms like "}
                  <ProseLink href="https://aave.com/">Aave</ProseLink>
                  {", "}
                  <ProseLink href="https://compound.finance/">Compound</ProseLink>
                  {", or even centralized ones like "}
                  <ProseLink href="https://nexo.io/">Nexo</ProseLink>
                  {
                    ". In return, you earn interest. It’s like being the bank — but you must trust the protocol or platform you’re lending through. Make sure to read the fine print on interest rates, collateral requirements, and default risks."
                  }
                </p>

                {/* 352:3716 */}
                <p>
                  <strong>4. Liquidity Providing</strong>
                  <br />
                  {"By adding your tokens to a liquidity pool on platforms like "}
                  <ProseLink href="https://uniswap.org/">Uniswap</ProseLink>
                  {" or "}
                  <ProseLink href="https://pancakeswap.finance/">PancakeSwap</ProseLink>
                  {
                    ", you help others trade tokens, and you get rewarded with trading fees. The major risk here is impermanent loss — when the value of your tokens changes during the time they’re locked in the pool. It sounds complex, but it’s doable once you get the hang of it."
                  }
                </p>

                {/*
                 * 352:3717. The source also carries a SECOND link here, to
                 * https://crypto.com/earn, whose entire link text is a single
                 * space. An anchor with no discernible name is an axe
                 * violation and renders as nothing, so it is dropped and the
                 * space kept. This is the one place the transcription departs
                 * from the node, and it is reported as a design defect rather
                 * than reproduced.
                 */}
                <p>
                  <strong>5. Crypto Savings Accounts</strong>
                  <br />
                  {
                    "These work like traditional savings accounts, except they offer much higher interest. You deposit your crypto with platforms like "
                  }
                  <ProseLink href="https://nexo.io/">Nexo</ProseLink>
                  {
                    ", and they lend it out on your behalf. In return, you earn a percentage yield. Just be cautious — if the platform goes down or gets hacked, your funds may be at risk."
                  }
                </p>
              </div>

              {/* 352:3718 - V, gap 16. */}
              <div className={RHYTHM.finalWords}>
                {/* 352:3719 - text-xl-h2, the article body heading. */}
                <h2 className="text-xl-h2">Final Words</h2>
                {/* 352:3720 */}
                <p>
                  {
                    "Crypto offers endless opportunities to grow your money — but passive income doesn’t mean passive thinking. Always vet platforms, understand the risks, and only invest what you can afford to lose. Want to go deeper into any of these strategies? We’ve got you."
                  }
                </p>
              </div>
            </div>

            {/*
             * 352:3721 - V, gap 20. responsive.md S7.5 rules this block the
             * article's <footer>: it is the disclaimer and the sign-off, not
             * body copy.
             */}
            <footer className={RHYTHM.disclaimer}>
              {/* 352:3722 */}
              <p>
                <strong>Disclaimer</strong>
                {
                  ": This content is for educational purposes only. None of the apps or services mentioned here are endorsements, ads, or financial advice. Always do your own research (DYOR)."
                }
              </p>

              {/*
               * 352:3723. The design authors the second link against phone
               * 13025016052; the run's confirmed WhatsApp destination is
               * 07041900011 in international form (D-034, D-041), published as
               * one constant so all seven routes agree. The constant wins - a
               * payments product with two different WhatsApp numbers on one
               * site is worse than a link that differs from the mock.
               * Reported as a finding.
               */}
              <p>
                {"Plus, be sure to "}
                <ProseLink href="https://chat.whatsapp.com/H9bim9SleizDktUA5iQprF">
                  join our community
                </ProseLink>
                {" for exclusive updates and insights. Message "}
                <ProseLink href={WHATSAPP_CHAT_URL}>Azza on WhatsApp</ProseLink>
                {" now to get started!"}
              </p>
            </footer>
          </div>
        </div>
      </Prose>

      {/* 352:3724 - rule, "Share this post" + cluster, rule. */}
      <ShareRow title={title} variant="footer" />
    </div>
  );
}
