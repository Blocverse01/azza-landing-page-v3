import type { Metadata } from "next";

import { Faq } from "@/components/sections/Faq";
import { HeroBusiness } from "@/components/sections/HeroBusiness";
import { WhyAzzaInfrastructure, WhyAzzaNarrative } from "@/components/sections/WhyAzzaBusiness";
import { FAQ_BUSINESS } from "@/content/faq";

/** Copy is the hero standfirst (`800:320`), verbatim. */
export const metadata: Metadata = {
  title: "Azza for Business",
  description: "Receive payments, move money across borders, and access USD with ease.",
};

/**
 * `/products/for-business` - Figma `800:312` (the 2026-08 operator revision
 * of `412:2412`; the hero and FAQ carried over unchanged, the narrative was
 * re-authored - see its header for the diff).
 *
 * Four sections: the hero with its flag collage (`800:314`), the centred
 * narrative (`800:393`), the dark "One infrastructure" card grid (`868:690` -
 * added to `412:2412` in the 2026-09 revision, where it follows the narrative
 * directly), then the shared FAQ (`800:425`). The "How to get started" steps
 * band (`800:403`) sat between the grid and the FAQ until 2026-09-07, when the
 * operator retired it.
 *
 * `WhyAzzaNarrative` and `WhyAzzaInfrastructure` are two components, not one
 * parameterised block (D-012); they share a directory because they share a
 * route, not a structure.
 *
 * The `<h1>` ("Your money should work anywhere.") lives in `HeroBusiness`, at
 * `display-2` carrying the O-swap on three glyphs.
 */
export default function ForBusinessPage() {
  return (
    <>
      <HeroBusiness />
      <WhyAzzaNarrative />
      <WhyAzzaInfrastructure />
      <Faq items={FAQ_BUSINESS} />
    </>
  );
}
