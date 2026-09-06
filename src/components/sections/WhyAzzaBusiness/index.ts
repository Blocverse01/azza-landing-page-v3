/**
 * The two "Why Azza?" blocks on /products/for-business.
 *
 * They are two components, not one parameterised component (DECISIONS
 * D-012). They live in one directory because they share a route, not because
 * they share structure - `412:2516` is a centred prose column on white and
 * `868:690` is a card grid on the dark panel surface.
 *
 * `WhyAzzaSteps` (`800:403`, the "How to get started" band with the phone
 * mockup) was retired on 2026-09-07 at the operator's request; nothing else
 * referenced it.
 */
export { default as WhyAzzaInfrastructure } from "./WhyAzzaInfrastructure";
export { default as WhyAzzaNarrative } from "./WhyAzzaNarrative";
