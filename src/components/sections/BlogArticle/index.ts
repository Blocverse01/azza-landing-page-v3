/**
 * The /blog/[slug] article section - design/components.md S6.
 *
 *   import { BlogArticle } from "@/components/sections/BlogArticle";
 *
 *   <BlogArticle post={post} related={related} />
 *
 * `post` and `related` are `BlogPost` records from `@/content/blog`; the route
 * gets them from `getPost(slug)` and `getRelated(slug)`. The section supplies
 * the route's single <h1> and its own <section> landmark, so the route mounts
 * it directly with nothing wrapped around it.
 */

export { BlogArticle, type BlogArticleProps } from "./BlogArticle";
export { ArticleHeader, type ArticleHeaderProps } from "./ArticleHeader";
export { ArticleBody, type ArticleBodyProps } from "./ArticleBody";
export { RelatedArticles, type RelatedArticlesProps } from "./RelatedArticles";
export { ShareRow, type ShareRowProps } from "./ShareRow";
