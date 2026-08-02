import type { Metadata } from "next";

import { AzzaWrapped } from "@/components/sections/AzzaWrapped";
import { CardDeck } from "@/components/sections/CardDeck";
import { Faq } from "@/components/sections/Faq";
import { HeroLanding } from "@/components/sections/HeroLanding";
import { Testimonials } from "@/components/sections/Testimonials";
import { UseAzzaToday } from "@/components/sections/UseAzzaToday";
import { WhyAzzaLanding } from "@/components/sections/WhyAzzaLanding";
import { FAQ_LANDING } from "@/content/faq";

/**
 * Copy is the landing hero's own standfirst (`412:789`), verbatim. `absolute`
 * because the root layout's template appends the brand to every child title and
 * the home page is the one route that should not read "… · AZZA · AZZA".
 */
export const metadata: Metadata = {
  title: { absolute: "AZZA — your money should work anywhere" },
  description:
    "Send, receive, and spend money across borders, instantly on WhatsApp. " +
    "Crypto or local currency, without the usual stress.",
};

/**
 * `/` - Figma `412:759` "Main Landing Page", seven sections between the nav and
 * the footer.
 *
 * The order below is the frame's own draw order, read off the node tree by y:
 * Hero 121 · Why Azza? 971 · Cards 1939 · What People Say 2838 · FAQs 3609 ·
 * Azza Wrapped 4570 · use Azza Today 5493. It matches components.md S1.
 *
 * There is no wrapper element and no padding here. Every section owns its own
 * `Section` rhythm and full-bleed background, and sections abut at 0px
 * (layout.md S10.3, assertion 1) - a wrapper with a gap would break that for the
 * whole route at once.
 *
 * The `<h1>` lives in `HeroLanding` (`412:786`), which is why this file renders
 * no heading of its own.
 */
export default function HomePage() {
  return (
    <>
      <HeroLanding />
      <WhyAzzaLanding />
      <CardDeck />
      <Testimonials />
      <Faq items={FAQ_LANDING} />
      <AzzaWrapped />
      <UseAzzaToday />
    </>
  );
}
