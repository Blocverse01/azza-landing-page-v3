import Image from "next/image";

import badgeVerified from "@design-system/assets/testimonials/badge-verified.png";

import { Icon } from "@/components/ui";
import type { Tweet } from "@/content/testimonials";

/*
 * One testimonial tweet - the repeated black card inside 861:343 (drawn twelve
 * times, 861:637 ... 861:569).
 *
 * THIS CARD IS A QUOTATION OF X'S INTERFACE, NOT AZZA UI, which decides three
 * things that would otherwise be wrong:
 *
 *   - The greys and the link blue are X's own (#71767b metadata, #269dee
 *     links), kept as literals with this note rather than mapped to Azza
 *     tokens. Mapping them would restyle someone else's product.
 *   - The type sizes are the drawn 18/24 body and 15px metadata rather than
 *     site steps, for the same reason - and they deliberately do NOT follow
 *     the mobile type tier, because a screenshot of a tweet does not resize
 *     its type when viewed on a phone. The drawn face is Geist (X's font); it
 *     is not loaded here and Inter, the site sans, is the stand-in - recorded
 *     as a finding rather than shipping a fourth webfont for a pastiche.
 *   - The verified badge stays the drawn bitmap. It is X's mark, not an Azza
 *     glyph, so it does not join the icon set.
 *
 * The X logo reuses the icon set's `social-x` at the drawn 36px - the design's
 * `ant-design:x-outlined` draws the same mark.
 *
 * The separator discs are styled spans, not the drawn 3px ellipse SVGs - the
 * `MetaDot` idiom `ArticleHeader` already established for exactly this.
 */

export interface TweetCardProps {
  tweet: Tweet;
}

function MetaDot() {
  return <span aria-hidden="true" className="size-[3px] shrink-0 rounded-full bg-[#71767b]" />;
}

export function TweetCard({ tweet }: TweetCardProps) {
  return (
    <figure className="relative m-0 flex w-full flex-col gap-3 overflow-clip rounded-[18px] bg-black px-6 py-[18px]">
      {/* header: avatar, name, badge, handle. Padded clear of the X logo. */}
      <div className="flex items-center gap-3 pe-12">
        <Image
          src={tweet.avatar}
          alt=""
          width={39}
          height={39}
          className="size-[39px] shrink-0 rounded-full bg-[#4642e2] object-cover"
        />
        <figcaption className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0 text-[18px] leading-6">
          <span className="flex min-w-0 items-center gap-1">
            <span className="truncate font-semibold text-white">{tweet.name}</span>
            {tweet.verified ? (
              <Image
                src={badgeVerified}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0"
              />
            ) : null}
          </span>
          <span className="shrink-0 text-[#71767b]">{tweet.handle}</span>
        </figcaption>
      </div>

      {/* the tweet; a \n inside a segment is a drawn line break */}
      <blockquote className="m-0 text-[18px] leading-6 whitespace-pre-line text-white">
        {tweet.body.map((segment, i) =>
          segment.mention ? (
            <span key={i} className="text-[#269dee]">
              {segment.text}
            </span>
          ) : (
            <span key={i}>{segment.text}</span>
          ),
        )}
      </blockquote>

      {/* metadata row */}
      <div className="flex flex-wrap items-center gap-1.5 text-[15px] leading-6 text-[#71767b]">
        <span>{tweet.time}</span>
        <MetaDot />
        <span>{tweet.date}</span>
        <MetaDot />
        <span>
          <span className="text-white">{tweet.views}</span> Views
        </span>
      </div>

      <Icon name="social-x" size={36} className="absolute top-[18px] right-6 text-white" />
    </figure>
  );
}

export default TweetCard;
