import { TESTIMONIAL_TWEETS } from "@/content/testimonials";
import { cn } from "@/lib/cn";

import { TweetCard } from "./TweetCard";

/*
 * The white tweet rail - 861:343. 600x580 at 1440, right corners at
 * radius.6xl; below `lg` it takes the BOTTOM corners of the stacked band.
 *
 * The drawing is one moment of a MARQUEE: a 487px column of twelve cards
 * overflowing a 580px window, with `surface.subtle` fades at both edges
 * (861:691/692 - the file stacks each gradient twice, so the single gradient
 * here runs to 55% alpha at the edge to match the doubled strength). The
 * motion is the obvious completion: the column scrolls upward and loops.
 *
 * THE LOOP. The list renders twice; the track translates by exactly half its
 * own height (one list plus one inter-list gap), then repeats. Both copies are
 * inside one `gap-5` column, so "half the track plus half a gap" is the magic
 * translate - `calc(-50% - 10px)` - and the seam is invisible at any list
 * height, which matters because card heights are content-driven. The clone is
 * `aria-hidden`: it exists for the eye, and a screen reader should meet each
 * quote once.
 *
 * MOTION IS ADDITIVE (the azza-float contract): the animation binds only
 * under `prefers-reduced-motion: no-preference`, and the rest state is the
 * drawn stack. 90s per lap - a reading pace, not a ticker - and a hover
 * pauses it on fine pointers so a quote can actually be read; on touch the
 * marquee is ambient, and the full set is what the section is for, not a
 * control surface.
 */

export function TweetMarquee({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-surface-page relative isolate h-[480px] overflow-clip lg:h-[580px]",
        "testimonials-marquee",
        className,
      )}
    >
      <div className="testimonials-marquee-track flex w-full flex-col gap-5 px-5 sm:px-10 lg:ps-14 lg:pe-14">
        <ul className="m-0 flex list-none flex-col gap-5 p-0">
          {TESTIMONIAL_TWEETS.map((tweet) => (
            <li key={tweet.node} className="flex">
              <TweetCard tweet={tweet} />
            </li>
          ))}
        </ul>
        <ul aria-hidden="true" className="m-0 flex list-none flex-col gap-5 p-0">
          {TESTIMONIAL_TWEETS.map((tweet) => (
            <li key={tweet.node} className="flex">
              <TweetCard tweet={tweet} />
            </li>
          ))}
        </ul>
      </div>

      {/*
       * Edge fades - 861:692 (top) / 861:691 (bottom): surface.subtle over the
       * rail, doubled in the file so the single gradient here carries a 55%
       * mid-stop. The zero end is `rgba(250,250,250,0)` and NOT `transparent`:
       * Tailwind v4 interpolates gradients in oklab, where `transparent` is
       * black-at-zero-alpha, and fading a near-white to it drags every
       * midpoint through grey - the cards visibly darkened under the fade
       * until this was caught in a browser.
       */}
      <div
        aria-hidden="true"
        className="from-surface-subtle pointer-events-none absolute inset-x-0 top-0 z-10 h-[101px] bg-gradient-to-b via-[rgba(250,250,250,0.55)] via-45% to-[rgba(250,250,250,0)]"
      />
      <div
        aria-hidden="true"
        className="from-surface-subtle pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[101px] bg-gradient-to-t via-[rgba(250,250,250,0.55)] via-45% to-[rgba(250,250,250,0)]"
      />
    </div>
  );
}

export default TweetMarquee;
