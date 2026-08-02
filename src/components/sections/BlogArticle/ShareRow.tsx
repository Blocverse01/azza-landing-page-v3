"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";

import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

/*
 * THE SHARE ROW - 352:3694 (article header) and 352:3728 (article footer).
 *
 * The set is X / Instagram / TikTok / copy-link, exactly as 352:3694 draws it.
 * It is deliberately NOT reconciled against the nav's Socials menu (X /
 * Instagram / YouTube) or Help & Support's community row (X / Instagram /
 * WhatsApp). D-037 rules that each surface ships its own set: you share *to*
 * TikTok and you follow *on* YouTube, so a share row and a follow menu
 * legitimately differ. Do not "fix" one to match another.
 *
 * WHY TWO OF THE FOUR ARE BUTTONS AND NOT LINKS.
 * X publishes a documented web share intent, so its control is a real <a> to a
 * real URL. Instagram and TikTok publish none - there is no web endpoint that
 * accepts a URL to share, only native app sheets. Rather than ship two dead
 * links, those two are <button>s that hand the page to the platform-agnostic
 * Web Share API (which puts Instagram and TikTok in the OS share sheet on the
 * phone this product is built for) and fall back to the clipboard with an
 * announcement naming the platform. Recorded in open_questions.
 */

const CONTROL_LABEL = "Share this post";

/*
 * 44x44 targets at a 52px pitch below `lg`; the designed 24px glyph at a 36px
 * pitch from `lg` up - responsive.md S6.2, which scopes the 44 floor for this
 * one element to `< lg` precisely because 4 x 44 + 3 x 8 = 200 still fits at
 * 320 while the design's 132-wide cluster does not carry a 44 target.
 *
 * At `lg` the control box is 36 with no gap, which reproduces the design's 36
 * pitch exactly. `-me-1.5` pulls the row 6px right so the last glyph's edge
 * still lands on the container edge - the box grew around the glyph, so
 * without it every glyph sits 6px inboard of where the design draws it.
 */
const CONTROL =
  "grid size-11 place-items-center rounded-pill lg:size-9 " +
  "transition-[color,translate] duration-(--motion-fast) ease-out " +
  "active:translate-y-px active:duration-(--motion-instant)";

/*
 * Hover on an icon-only control changes colour and nothing else
 * (components.md S10.6). `link.hover` is #1E1E1E, which is also these glyphs'
 * rest ink, so it would be a hover that does not happen; `fg.brand` is the
 * copy-link glyph's own authored colour (352:3704 strokes #3430E9) and is
 * therefore already part of this row's palette. Every hover has its
 * :focus-visible twin. Recorded in open_questions.
 */
const INK = "text-fg-primary hoverable:text-fg-brand focus-visible:text-fg-brand";

export interface ShareRowProps {
  /** The article title, used as the share text. */
  title: string;
  /**
   * inline -> the bare 4-icon cluster in the article header meta row
   *           (352:3694).
   * footer -> the full 352:3724 block: rule, "Share this post" + cluster,
   *           rule.
   */
  variant?: "inline" | "footer";
  className?: string;
}

export function ShareRow({ title, variant = "inline", className }: ShareRowProps) {
  const pathname = usePathname();
  const labelId = useId();

  /*
   * The absolute URL is only knowable in the browser, so the X intent renders
   * without its `url` parameter on the server and gains it at hydration. The
   * link is valid either way. `pathname` is the dependency because App Router
   * navigations keep this component mounted across slugs.
   */
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => {
    setPageUrl(window.location.href);
  }, [pathname]);

  /*
   * The live region. `nonce` remounts the inner node so an identical message
   * announces again on a second press - a polite region ignores a set to the
   * text it already holds.
   */
  const [status, setStatus] = useState("");
  const [nonce, setNonce] = useState(0);

  const announce = useCallback((message: string) => {
    setStatus(message);
    setNonce((value) => value + 1);
  }, []);

  const copyLink = useCallback(
    async (successMessage: string) => {
      const url = window.location.href;

      try {
        await navigator.clipboard.writeText(url);
        announce(successMessage);
      } catch {
        announce("The link could not be copied. Copy it from your browser's address bar instead.");
      }
    },
    [announce],
  );

  const shareTo = useCallback(
    async (platform: string) => {
      const url = window.location.href;

      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title, url });
          return;
        } catch {
          // A dismissed share sheet is not an error worth announcing; fall
          // through to the clipboard so the press still does something.
        }
      }

      await copyLink(`Link copied. Paste it into ${platform} to share.`);
    },
    [copyLink, title],
  );

  const xHref = `https://x.com/intent/post?text=${encodeURIComponent(title)}${
    pageUrl ? `&url=${encodeURIComponent(pageUrl)}` : ""
  }`;

  const cluster = (
    <ul
      aria-label={variant === "inline" ? CONTROL_LABEL : undefined}
      aria-labelledby={variant === "footer" ? labelId : undefined}
      className="flex list-none items-center gap-2 lg:-me-1.5 lg:gap-0"
    >
      <li>
        {/* 352:3695 / 352:3729 - the filled X tile. */}
        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className={cn(CONTROL, INK, "no-underline")}
        >
          <Icon name="share-x" size="md" />
        </a>
      </li>

      <li>
        {/*
         * 352:3696 / 352:3730 - the Instagram brand mark is a two-stop radial
         * gradient and is one of the eight fixed-fill glyphs that must never be
         * recoloured (components.md S4.5). It therefore takes the press
         * feedback and the focus ring but no colour change.
         */}
        <button
          type="button"
          onClick={() => void shareTo("Instagram")}
          aria-label="Share on Instagram"
          className={CONTROL}
        >
          <Icon name="share-instagram" size="md" />
        </button>
      </li>

      <li>
        {/* 352:3701 / 352:3735 - TikTok. */}
        <button
          type="button"
          onClick={() => void shareTo("TikTok")}
          aria-label="Share on TikTok"
          className={cn(CONTROL, INK)}
        >
          <Icon name="share-tiktok" size="md" />
        </button>
      </li>

      <li>
        {/*
         * 352:3703 / 352:3737 - a 16px link glyph centred in a 24px
         * `surface.brand-tint` disc. Success is announced through the live
         * region below, never a tooltip, an alert() or a dialog
         * (responsive.md S6.4 #10).
         */}
        <button
          type="button"
          onClick={() => void copyLink("Link copied to clipboard")}
          aria-label="Copy link"
          className={cn(
            CONTROL,
            "text-fg-brand hoverable:text-fg-primary focus-visible:text-fg-primary",
          )}
        >
          <span className="rounded-pill bg-surface-brand-tint grid size-6 place-items-center">
            <Icon name="link" size="xs" />
          </span>
        </button>
      </li>
    </ul>
  );

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center", className)}>
        {cluster}
        <span role="status" aria-live="polite" className="sr-only">
          <span key={nonce}>{status}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-5", className)}>
      {/* 352:3725 - Line 6. A zero-height rule, not an asset (icons.md S12). */}
      <hr className="border-line-divider w-full border-t" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p id={labelId} className="text-md text-fg-body">
          {CONTROL_LABEL}
        </p>
        {cluster}
      </div>

      {/* 352:3740 - Line 7. */}
      <hr className="border-line-divider w-full border-t" />

      <span role="status" aria-live="polite" className="sr-only">
        <span key={nonce}>{status}</span>
      </span>
    </div>
  );
}
