/**
 * The two "Why Azza?" blocks on /products/for-business.
 *
 * They are two components, not one parameterised component (DECISIONS D-012).
 * They live in one directory because they share a route, not because they share
 * structure - `412:2516` is a centred prose column on white, `458:261` is a
 * horizontal split on near-black with an ordered list and a phone mockup.
 */
export { default as WhyAzzaNarrative } from "./WhyAzzaNarrative";
export { default as WhyAzzaSteps } from "./WhyAzzaSteps";
