/**
 * The FAQ section - one component, four question sets, four routes.
 *
 *   import { Faq } from "@/components/sections/Faq";
 *   import { FAQ_LANDING } from "@/content/faq";
 *
 * `FaqQuestionList` and `FaqAnswerPanel` are deliberately not exported. They
 * are the two halves of this section's internals and nothing outside the
 * directory should compose them directly.
 */

export { Faq, default, type FaqProps } from "./Faq";
