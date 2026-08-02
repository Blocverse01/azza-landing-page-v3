/**
 * "What People Say" - 412:1065.
 *
 * components.md S6 makes every section a default export; both spellings are
 * re-exported so a route may import it either way.
 */
export { default, default as Testimonials } from "./Testimonials";
export { TestimonialCard, type TestimonialCardProps } from "./TestimonialCard";
