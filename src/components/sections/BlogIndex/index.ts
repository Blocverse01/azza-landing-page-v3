/**
 * `/blog` sections - Figma 352:3582 (hero) and 500:2197 (article grid).
 *
 * `BlogHero` is a server component and `AllArticles` is a client one. Both are
 * safe to re-export from one barrel: neither imports anything server-only, so a
 * server route gets `BlogHero` inline and `AllArticles` as a client reference,
 * which is exactly what the route needs.
 *
 * `ArticleFilters` is deliberately not exported. It is an implementation detail
 * of `AllArticles` and has no other consumer.
 */
export { AllArticles, type AllArticlesProps } from "./AllArticles";
export { BlogHero, type BlogHeroProps } from "./BlogHero";
