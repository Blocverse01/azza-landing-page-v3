import type { StaticImageData } from "next/image";

import { cn } from "@/lib/cn";

import { Card } from "./Card";
import { Media, type MediaProps } from "./Media";
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
  /**
   * Overrides the crop anchor derived from the source's orientation below.
   * Only pass it when a landscape source also needs an off-centre crop.
   */
  imagePosition?: MediaProps["position"];
  className?: string;
}

/*
 * "May 4, 2026" - 500:2221 / 352:3595, en-US month-first. It was en-GB, which
 * renders "4 May 2026": a different string from the one the design authors.
 * The locale is pinned rather than left to the runtime so the server and the
 * client cannot disagree about it.
 */
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};

/*
 * THE CROP ANCHOR, DERIVED RATHER THAN CONFIGURED.
 *
 * assets.md S6.2 predicted this in advance: `blog-card-naira-to-cedis.webp` is
 * portrait (1456x1817) in a landscape 360x280 slot, so a centred `cover` crop
 * removes roughly 56% of the height - including the headline baked into the top
 * third. The card cropped away its own subject.
 *
 * The anchor is read off the source's own dimensions rather than added to the
 * post record, because `BlogPost` is a published contract (S7.1) that
 * `src/content/blog.ts` implements structurally, and a new field would have to
 * land in both halves at once. Orientation is the actual rule: a portrait
 * source in a landscape slot always loses its top, and a designed social card
 * always puts the headline there. The five landscape bitmaps are ~1.25 against
 * a 1.29 slot and crop imperceptibly, so they stay centred - which is what
 * S6.2 asks for. `imagePosition` overrides it.
 */
function cropAnchor(image: StaticImageData): NonNullable<MediaProps["position"]> {
  return image.height > image.width ? "top" : "center";
}

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
  imagePosition,
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
        position={imagePosition ?? cropAnchor(post.image)}
        priority={priority}
        sizes={
          featured
            ? "(max-width:1279px) 100vw, 1160px"
            : "(max-width:767px) 100vw, (max-width:1023px) 50vw, 360px"
        }
        radius="3xl"
      />

      <div className="flex flex-col gap-4">
        {/*
         * The featured card sits on the `surface.brand-subtle` hero panel and
         * paints no fill of its own, so a `brand-subtle` chip on it is exactly
         * invisible. The design draws the two chips differently for that
         * reason: 500:1838 (featured) is `surface.page`, 500:2217 (grid) is
         * `surface.brand-subtle`.
         */}
        <Pill variant="tag" tone={featured ? "page" : "brand-subtle"}>
          {post.category}
        </Pill>

        <h3 className={featured ? "text-2xl-feature" : "text-lg-card"}>
          <StretchedLink href={`/blog/${post.slug}`}>
            {post.title}
          </StretchedLink>
        </h3>

        {post.standfirst ? (
          <p className="text-sm-body text-fg-body-strong">{post.standfirst}</p>
        ) : null}

        {/*
         * 500:2221 / 352:3595 - 20px Medium at -0.03em, `fg.subtle`.
         * It shipped at 14px `fg.muted`, which is two type steps and a shade
         * away from the authored meta line.
         */}
        <p className="text-md text-fg-subtle">
          <time dateTime={post.date}>
            {published.toLocaleDateString("en-US", DATE_FORMAT)}
          </time>
          {post.readingTime ? <> · {post.readingTime}</> : null}
        </p>
      </div>
    </Card>
  );
}
