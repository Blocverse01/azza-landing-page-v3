import type { Metadata } from "next";

import { Faq } from "@/components/sections/Faq";
import { HeroBusiness } from "@/components/sections/HeroBusiness";
import { WhyAzzaNarrative, WhyAzzaSteps } from "@/components/sections/WhyAzzaBusiness";
import { FAQ_BUSINESS } from "@/content/faq";

/** Copy is the hero standfirst (`800:320`), verbatim. */
export const metadata: Metadata = {
  title: "Azza for Business",
  description: "Receive payments, move money across borders, and access USD with ease.",
};

/**
 * `/products/for-business` - Figma `800:312` (the 2026-08 operator revision
 * of `412:2412`; the hero and FAQ carried over unchanged, the narrative and
 * steps band were re-authored - see each component's header for the diff).
 *
 * Four sections in the frame's own order: the hero with its flag collage
 * (`800:314`), the centred narrative (`800:393`), the dark "How to get
 * started with Azza Business" steps band (`800:403`), then the shared FAQ
 * (`800:425`).
 *
 * `WhyAzzaNarrative` and `WhyAzzaSteps` are two components, not one
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
      <WhyAzzaSteps />
      <Faq items={FAQ_BUSINESS} />
    </>
  );
}
