import type { Metadata } from "next";

import { Faq } from "@/components/sections/Faq";
import { HeroBusiness } from "@/components/sections/HeroBusiness";
import {
  WhyAzzaNarrative,
  WhyAzzaSteps,
} from "@/components/sections/WhyAzzaBusiness";
import { FAQ_BUSINESS } from "@/content/faq";

/** Copy is the hero standfirst (`412:2521`), verbatim. */
export const metadata: Metadata = {
  title: "Azza for Business",
  description:
    "Receive payments, move money across borders, and access USD with ease.",
};

/**
 * `/products/for-business` - Figma `412:2412`.
 *
 * Four sections in the frame's own order: the hero with its flag collage
 * (`412:2436`), the centred narrative (`412:2516`), the dark "How to get
 * started with Azza Business" steps band (`458:261`), then the shared FAQ
 * (`412:2633`).
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
