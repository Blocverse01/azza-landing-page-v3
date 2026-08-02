import type { BlogPost } from "@/content/blog";

import { ShareRow } from "./ShareRow";

/*
 * THE ARTICLE HEADER - 352:3684, an 842-wide column at `V, gap 28`
 * (layout.md S4.8): title 352:3685, standfirst 352:3686, meta row 352:3687.
 *
 * WHAT COMES FROM THE POST AND WHAT COMES FROM THE FIGMA NODE.
 * `BlogPost` (content/blog.ts S7.1) carries `title`, `date`, `standfirst?` and
 * `readingTime?`; it carries no author and none of the ten posts sets a
 * standfirst or a reading time. So the title and the date are data - one
 * component serves ten slugs and a pinned title would render the same headline
 * on every one of them - and the byline, the standfirst fallback and the
 * reading-time fallback are transcribed verbatim from the design's own nodes.
 * Adding fields to `BlogPost` was not an option: it is a published contract
 * that `ArticleCard` mirrors structurally, and a new required field would have
 * to land in both halves at once.
 */

/** 352:3689. The design names one author; `BlogPost` has no author field. */
const BYLINE = "Ngwube Precious";

/** 352:3693. */
const READING_TIME = "4 min read";

/** 352:3686, verbatim. Used when the post record carries no standfirst. */
const STANDFIRST =
  "Azza makes it easier for Nigerian business owners to send money to Ghana from WhatsApp. Instead of moving between different people, rate conversations, and bank apps.";

/*
 * "May 4, 2026" - 352:3691, en-US month-first, pinned so the server and the
 * client cannot disagree about the locale. Identical to `ArticleCard`'s.
 */
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};

export interface ArticleHeaderProps {
  post: BlogPost;
  /** Id of the route's single <h1>, so the surrounding section can name it. */
  titleId: string;
}

/** 352:3690 / 352:3692 - the 12px separator discs, decorative. */
function MetaDot() {
  return <span aria-hidden="true" className="rounded-pill bg-line-divider size-3 shrink-0" />;
}

export function ArticleHeader({ post, titleId }: ArticleHeaderProps) {
  const published = new Date(post.date);

  return (
    <header className="flex w-full max-w-(--container-prose) flex-col gap-7">
      {/* 352:3685 - text-3xl, the article <h1> (typography.md S4.1). */}
      <h1 id={titleId} className="text-fg-body text-3xl">
        {post.title}
      </h1>

      {/* 352:3686 - text-lg-standfirst on fg.caption. */}
      <p className="text-lg-standfirst text-fg-caption">{post.standfirst ?? STANDFIRST}</p>

      {/*
       * 352:3687 - SPACE_BETWEEN at 1440. Below `lg` the byline and the share
       * cluster wrap onto separate lines (responsive.md S7.5), which
       * `flex-wrap` plus the row gap does without a second DOM.
       */}
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-4">
        {/*
         * 352:3688 - H, gap 20.
         *
         * Each label is grouped with the dot that FOLLOWS it, not the one
         * before it. The pitch is identical either way - 20 inside the group,
         * 20 from the outer gap - but when the row wraps at `< lg` a trailing
         * dot ends the line instead of a leading dot orphaning at the start of
         * the next one.
         */}
        <div className="text-md text-fg-subtle flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="flex items-center gap-5">
            {BYLINE}
            <MetaDot />
          </span>
          <span className="flex items-center gap-5">
            <time dateTime={post.date}>{published.toLocaleDateString("en-US", DATE_FORMAT)}</time>
            <MetaDot />
          </span>
          <span>{post.readingTime ?? READING_TIME}</span>
        </div>

        {/* 352:3694 - X / Instagram / TikTok / copy-link. */}
        <ShareRow title={post.title} variant="inline" />
      </div>
    </header>
  );
}
