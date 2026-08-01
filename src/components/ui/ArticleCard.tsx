import type { StaticImageData } from "next/image";

import { cn } from "@/lib/cn";

import { Card } from "./Card";
import { Media } from "./Media";
import { Pill } from "./Pill";
import { StretchedLink } from "./StretchedLink";

/**
 * The blog post record - design/components.md S7.1.
 *
 * Declared here rather than imported from `src/content/blog.ts` because that
 * module is written in a later wave, and this primitive must compile before it
 * exists. TypeScript is structural, so the two are interchangeable at every
 * call site as long as the shape below is honoured, which S7.1 publishes as a
 * contract precisely so it can be.
 */
export interface BlogPost {
  slug: string;
  /** The card <h3> string - longer than the headline baked into the image. */
  title: string;
  standfirst?: string;
  category: "Finance" | "Education" | "Crypto" | "Technology";
  /** ISO 8601. */
  date: string;
  readingTime?: string;
  /** One of the FIVE unique bitmaps - nine cards, five files. */
  image: StaticImageData;
  imageAlt: string;
  placeholderColor: string;
  featured?: boolean;
}

export interface ArticleCardProps {
  post: BlogPost;
  /**
   * "featured" -> 32px title (text-2xl-feature), banner ratio 10/3, full width.
   * "grid"     -> 24px title (text-lg-card),     image ratio 9/7, 360 in a 3-up.
   */
  variant?: "featured" | "grid";
  priority?: boolean;
  className?: string;
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
};

/**
 * The blog card.
 *
 * It lives in `ui/` rather than in the BlogIndex directory precisely so that
 * the article route never imports from another section agent's tree.
 *
 * The whole card is one link: `Card interactive` provides the positioning
 * context and the lift, and the title's `StretchedLink` covers it. The
 * accessible name is the title - the image alt repeats the headline baked into
 * the bitmap, which is different copy, and the date is inside the same link
 * only because it sits under the ::after, not because it is announced.
 */
export function ArticleCard({
  post,
  variant = "grid",
  priority = false,
  className,
}: ArticleCardProps) {
  const featured = variant === "featured";
  const published = new Date(post.date);

  return (
    <Card
      as="article"
      surface="page"
      radius="3xl"
      bordered={false}
      interactive
      className={cn("flex h-full flex-col gap-4", className)}
    >
      <Media
        src={post.image}
        alt={post.imageAlt}
        ratio={featured ? "10/3" : "9/7"}
        ratioMd={featured ? "2/1" : "9/7"}
        ratioBase="3/2"
        placeholderColor={post.placeholderColor}
        priority={priority}
        sizes={
          featured
            ? "(max-width:1279px) 100vw, 1160px"
            : "(max-width:767px) 100vw, (max-width:1023px) 50vw, 360px"
        }
        radius="3xl"
      />

      <div className="flex flex-col gap-4">
        <Pill variant="tag">{post.category}</Pill>

        <h3 className={featured ? "text-2xl-feature" : "text-lg-card"}>
          <StretchedLink href={`/blog/${post.slug}`}>
            {post.title}
          </StretchedLink>
        </h3>

        {post.standfirst ? (
          <p className="text-sm-body text-fg-body-strong">{post.standfirst}</p>
        ) : null}

        <p className="text-xs text-fg-muted">
          <time dateTime={post.date}>
            {published.toLocaleDateString("en-GB", DATE_FORMAT)}
          </time>
          {post.readingTime ? <> · {post.readingTime}</> : null}
        </p>
      </div>
    </Card>
  );
}
