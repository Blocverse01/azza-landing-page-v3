import type { StaticImageData } from "next/image";

import { cn } from "@/lib/cn";

import { Card } from "./Card";
import { Icon } from "./Icon";
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
   * "featured" -> banner ratio 10/3, 32px title, meta row with the "Read
   *               Article" affordance (802:853, the /blog masthead's card).
   * "grid"     -> image ratio 9/7, 24px title, 360 in a 3-up (802:643).
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
 * "May 4, 2026" - 802:649 / 802:843, en-US month-first. It was en-GB, which
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

/*
 * THE GRID TITLE'S HOVER UNDERLINE - operator request, 2026-08-23, modelled on
 * awwwards.com/blog (`.link-underlined`, read off the live site): a 2px rule
 * that SWEEPS IN under the text from the left when the card is hovered, and
 * sweeps back out when the pointer leaves.
 *
 * HOW THE SWEEP WORKS. The rule is a background gradient on the title link,
 * drawn at 220% of the text's width and only 2px tall, pinned to the bottom.
 * Its left 45% is ink, its right 45% is transparent, and the 10% between them
 * is the feathered leading edge. At rest it sits at `background-position-x:
 * 100%`, so only the transparent half is under the text and nothing shows; on
 * hover it slides to 0% and the ink half - soft edge first - travels across.
 * That is the awwwards construction exactly, with one change: their resting
 * half is the ink at 30% alpha (a permanent faint underline); ours is
 * transparent, because 802:648 draws no underline at rest. Swap `to-transparent`
 * for `to-fg-subtle/30` to get theirs. The ink is `fg.subtle`, the date
 * line's colour, rather than the title's - the rule reads as part of the
 * card's meta, not as heavier title decoration.
 *
 * `box-decoration-clone` matters: these titles wrap to two lines in a 360
 * column, and without it the gradient would be laid out once across the
 * unbroken inline and sliced per line - a different fragment of the sweep on
 * each line. Cloned, every line carries its own complete rule and they sweep
 * together. `pb-[0.06em]` drops the rule a hair below the descender line so
 * it clears the glyphs - a tiny amount, because with `clone` the padding
 * repeats on each line and the leading is only 1.3.
 *
 * The whole card is the hover target, not just the glyphs: the link's
 * stretched `::after` covers the card, and a pseudo-element hit counts as a
 * hover of its originating element. Awwwards only triggers on the text
 * itself, but their card is not one link; ours is.
 *
 * THE TIMING IS AWWWARDS' OWN - `0.3s` on the CSS `ease-out` KEYWORD
 * (cubic-bezier(0, 0, 0.58, 1)) - and NOT the house `--motion-base` /
 * `--ease-out` pair. Measured with the tokens first: the house curve is so
 * front-loaded that the rule was 88% of the way across at 60ms, and the
 * sweep read as "appear", not travel. The travel IS the interaction - a line
 * you can watch cross the title - so the authored curve wins here, for the
 * same reason theme.css lets Figma's `easeInOut` keyword beat the token on
 * the hero ornaments. Same curve both ways, as on awwwards: leaving retracts
 * the rule along the path it came in on. Position-only: there is still no
 * lift, no shadow and no title tint on these cards (operator, 2026-08-22).
 */
const TITLE_SWEEP = cn(
  // `fg.subtle` - the same ink as the card's date line (802:649), not the
  // title's own (operator request, 2026-08-23). `to-fg-subtle/30` is the
  // awwwards resting-line variant.
  "bg-linear-to-r from-fg-subtle from-45% to-transparent to-55%",
  "bg-size-[220%_2px] bg-position-[100%_100%] bg-no-repeat box-decoration-clone pb-[0.06em]",
  "transition-[background-position] duration-300 ease-[cubic-bezier(0,0,0.58,1)]",
  "hoverable:bg-position-[0%_100%]",
);

/**
 * The blog card - 802:643 (grid) / 802:853 (featured), the 2026-08 operator
 * revision of 500:2215 / 352:3588.
 *
 * WHAT THE REVISION CHANGED. Both variants now read image -> title -> meta ->
 * chip, where the original put the chip first: the category chip moved to the
 * card's FOOT on grid cards (802:645 is the last child, 24px below the date)
 * and into a meta ROW on the featured card (chip + date on the left, the
 * "Read Article" pill on the right - 802:849). Chips are outlined
 * `surface.page` now, not brand-subtle fills (see Pill.tsx). The featured
 * title tracks -4% (`text-2xl-feature`), and the featured meta line dropped to
 * 16px (`text-sm-meta`) while grid dates stay 20 (`text-md`).
 *
 * It lives in `ui/` rather than in the BlogIndex directory precisely so that
 * the article route never imports from another section agent's tree.
 *
 * The whole card is one link: the card box is the positioning context and the
 * title's `StretchedLink` covers it. The card deliberately does NOT take
 * `Card interactive` - the operator removed the blog cards' hover treatment
 * (2026-08-22): no lift, no shadow, no title colour shift. The one hover
 * signal since added is the grid title's underline sweep (`TITLE_SWEEP`,
 * 2026-08-23), which paints nothing but a 2px rule. `relative` is
 * supplied directly, because the stretched link still needs the positioned
 * ancestor that `interactive` used to bring along. Keyboard focus keeps the
 * global 2px `:focus-visible` ring on the link itself, which never depended
 * on the lift. The
 * accessible name is the title - the image alt repeats the headline baked into
 * the bitmap, which is different copy, and everything else sits inside the
 * same link only because it sits under the ::after, not because it is
 * announced. That includes the featured card's "Read Article" pill: it is a
 * `<span>`, a painted affordance for the link that already covers it, never a
 * second control - a nested interactive element inside a stretched link is
 * unreachable in the wrong order or announced twice, depending on the AT.
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
      className={cn("relative flex h-full flex-col gap-6", className)}
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
            ? "(max-width:1439px) 100vw, 1280px"
            : "(max-width:767px) 100vw, (max-width:1023px) 50vw, 360px"
        }
        radius="3xl"
      />

      {featured ? (
        <div className="flex flex-col gap-4">
          {/* 802:839 - 1160 inside the 1280 column, left-aligned. */}
          <h3 className="text-2xl-feature max-w-[1160px]">
            <StretchedLink href={`/blog/${post.slug}`}>{post.title}</StretchedLink>
          </h3>

          {/* 802:849 - chip + date left, the Read Article affordance right. */}
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <span className="flex items-center gap-4">
              <Pill variant="tag-md">{post.category}</Pill>
              <span className="text-sm-meta text-fg-subtle">
                <time dateTime={post.date}>
                  {published.toLocaleDateString("en-US", DATE_FORMAT)}
                </time>
                {post.readingTime ? <> · {post.readingTime}</> : null}
              </span>
            </span>

            {/*
             * 802:848 - 180 wide, pl 12 / pr 24, arrow leading the label. The
             * asymmetric padding is authored: with the fixed width it seats
             * the icon 24px in from the left edge, exactly where the frame
             * draws it.
             */}
            <span
              aria-hidden="true"
              className={cn(
                "rounded-pill flex w-45 items-center justify-center gap-2 py-2 pr-6 pl-3",
                "border-line-cta bg-surface-page border",
                "text-sm-meta text-fg-body",
              )}
            >
              <Icon name="arrow-right" size="md" />
              Read Article
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg-card">
              <StretchedLink href={`/blog/${post.slug}`} className={TITLE_SWEEP}>
                {post.title}
              </StretchedLink>
            </h3>

            {post.standfirst ? (
              <p className="text-sm-body text-fg-body-strong">{post.standfirst}</p>
            ) : null}

            {/* 802:649 - 20px Medium at -0.03em, `fg.subtle`. */}
            <p className="text-md text-fg-subtle">
              <time dateTime={post.date}>{published.toLocaleDateString("en-US", DATE_FORMAT)}</time>
              {post.readingTime ? <> · {post.readingTime}</> : null}
            </p>
          </div>

          {/* 802:645 - the chip closes the card, 24px under the meta line. */}
          <Pill variant="tag">{post.category}</Pill>
        </>
      )}
    </Card>
  );
}
