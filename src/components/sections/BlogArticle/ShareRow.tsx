"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";

import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

/*
 * THE SHARE ROW - 352:3694 (article header) and 809:308 (article footer).
 *
 * THE 2026-08 REVISION OF 282:803 (re-read 2026-08-23) REPLACED THE GLYPHS.
 * The four controls are the same four controls, but every mark was swapped:
 * 809:299 the streamline X block, 809:301 basil's solid Instagram in flat
 * #FF0069, 809:304 a filled TikTok, 809:306 a filled link glyph - all 24px at
 * a 12px gap, with no tile, no gradient badge and no brand-tint disc any more.
 * They ship as `share-x-block` / `share-instagram-solid` /
 * `share-tiktok-filled` / `share-link-filled` (Icon/types.ts); the old
 * `share-*` and `link` glyphs are untouched and now orphaned. Nothing below
 * the glyph changed: the same anchors and buttons, the same 44 -> 36 pitch,
 * the same hover ink.
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
 * rest ink, so it would be a hover that does not happen; `fg.brand` was the
 * old copy-link glyph's own authored colour (352:3704 stroked #3430E9), is
 * the site's link accent, and is kept as the hover ink for the revised set.
 * Every hover has its :focus-visible twin. Recorded in open_questions.
 *
 * THE REST INK IS `fg.primary` FOR ALL THREE MONOCHROME GLYPHS. The exports
 * carry their source packs' own defaults - the X is `#000`, the TikTok and the
 * link are `#10161F` - neither of which is a token, and at 24px against white
 * they are indistinguishable from #1E1E1E. The glyphs are `currentColor` so
 * the row inks them, as it always has; one ink, one hover, as components.md
 * S4.5 asks of every recolourable glyph.
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

  const cluster =
    (
      /*
       * `role="list"` IS LOAD-BEARING HERE, not a nicety. Tailwind's preflight
       * sets `list-style: none` - which the `list-none` below re-declares - and
       * that makes WebKit drop the implicit `list` role. A <ul> stripped of that
       * role maps to `generic`, which PROHIBITS an accessible name, so BOTH
       * naming attributes below would be inert and an axe `aria-prohibited-attr`
       * violation, exactly as Disclosure.tsx records for a bare `aria-labelledby`
       * on a <div>. In the inline variant that `aria-label` is the only thing
       * identifying this cluster as the share controls. The role and the name
       * ship together or not at all. `display: flex` is a second, independent
       * trigger for the same loss.
       */
      <ul
        role="list"
        aria-label={variant === "inline" ? CONTROL_LABEL : undefined}
        aria-labelledby={variant === "footer" ? labelId : undefined}
        className="flex list-none items-center gap-2 lg:-me-1.5 lg:gap-0"
      >
        <li>
          {/*
           * 809:299 / 809:309 - the X block.
           *
           * THE ONLY CONTROL IN THIS CLUSTER THAT OPENS A NEW TAB. The warning
           * `ArticleBody.tsx`'s `ProseLink` already ships is folded into the
           * `aria-label` rather than appended as a second `<VisuallyHidden>`
           * node, because this control's whole name IS the label - appending
           * would leave the label winning and the note unread. Its three siblings
           * are <button>s that open the OS share sheet or write the clipboard;
           * they change no browsing context and must not claim to.
           */}
          <a
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X (opens in a new tab)"
            className={cn(CONTROL, INK, "no-underline")}
          >
            <Icon name="share-x-block" size="md" />
          </a>
        </li>

        <li>
          {/*
           * 809:301 / 809:311 - the Instagram mark is painted in Instagram's own
           * #FF0069 and is a fixed-fill glyph that must never be recoloured
           * (components.md S4.5). It therefore takes the press feedback and the
           * focus ring but no colour change.
           */}
          <button
            type="button"
            onClick={() => void shareTo("Instagram")}
            aria-label="Share on Instagram"
            className={CONTROL}
          >
            <Icon name="share-instagram-solid" size="md" />
          </button>
        </li>

        <li>
          {/* 809:304 / 809:314 - TikTok. */}
          <button
            type="button"
            onClick={() => void shareTo("TikTok")}
            aria-label="Share on TikTok"
            className={cn(CONTROL, INK)}
          >
            <Icon name="share-tiktok-filled" size="md" />
          </button>
        </li>

        <li>
          {/*
           * 809:306 / 809:316 - the filled link glyph, same ink and hover as its
           * two monochrome siblings (the brand-tint disc it used to sit in is
           * gone with the revision). Success is announced through the live
           * region below, never a tooltip, an alert() or a dialog
           * (responsive.md S6.4 #10).
           */}
          <button
            type="button"
            onClick={() => void copyLink("Link copied to clipboard")}
            aria-label="Copy link"
            className={cn(CONTROL, INK)}
          >
            <Icon name="share-link-filled" size="md" />
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
      {/* 352:3725 - Line 6. A zero-height rule, not an asset (icons.md S12).
          352:3724 is `V, gap 20`, which `gap-5` above is. */}
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
