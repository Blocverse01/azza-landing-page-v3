/**
 * "What People Say" - 861:312 (the 2026-09 revision of 412:1065).
 *
 * components.md S6 makes every section a default export; both spellings are
 * re-exported so a route may import it either way. `TestimonialCard` retired
 * with the portrait row it drew; the redesign's parts are exported for reuse.
 */
export { default, default as Testimonials } from "./Testimonials";
export { SuperPanel } from "./SuperPanel";
export { TweetMarquee } from "./TweetMarquee";
export { TweetCard, type TweetCardProps } from "./TweetCard";
