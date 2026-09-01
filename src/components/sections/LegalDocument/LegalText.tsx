import type { ReactNode } from "react";

import { VisuallyHidden } from "@/components/ui";

/*
 * Inline links inside legal copy.
 *
 * WHY THE COPY CARRIES NO MARKUP. `content/legal.ts` transcribes two
 * operator-supplied documents verbatim, and the value of that transcription is
 * that a clause in the file is byte-comparable with the clause in the source.
 * Embedding <a> tags, or a bespoke `[text](href)` mini-language, breaks that
 * comparison on exactly the clauses most likely to be audited - the ones
 * naming the DPO address. So the copy stays plain and the two link shapes the
 * documents actually contain are detected here instead:
 *
 *   email   DPO@blocverse.com                       -> mailto:
 *   host    www.allaboutcookies.org, www.google...  -> https://
 *
 * Both are matched conservatively: a bare word with no scheme is only linked
 * when it starts `www.`, so no ordinary sentence can become a link by accident.
 *
 * TRAILING PUNCTUATION IS NOT PART OF THE URL. Privacy 5.4 ends
 * "...technologies/cookies/." and 13 reads "...address: DPO@blocverse.com .";
 * in both the final stop belongs to the sentence. The match therefore runs to
 * the next whitespace and any trailing `.`/`,`/`;`/`:`/`)` is handed back to
 * the text run - otherwise every one of these links 404s on a full stop.
 */

/**
 * One alternation, two shapes. Email is ordered first so `DPO@blocverse.com`
 * can never be partially matched as a host.
 */
const LINK_PATTERN = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(www\.\S+)/g;

/** Punctuation that ends the sentence, not the address. */
const TRAILING = /[.,;:)]+$/;

export interface LegalTextProps {
  children: string;
}

/**
 * Renders a clause, linking the email addresses and `www.` hosts inside it.
 *
 * The anchor takes no local colour or underline. `Prose` already styles `[&_a]`
 * with `link.inline`, its hover and its focus-visible twin, and this component
 * only ever renders inside one - restyling here would fork the link treatment
 * for the legal pages alone.
 *
 * External hosts open in a new tab and say so, matching `ArticleBody`'s
 * `ProseLink`: an unannounced new tab is the classic context change. A
 * `mailto:` is not a new tab and carries no such note.
 */
export function LegalText({ children }: LegalTextProps) {
  const out: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  for (const match of children.matchAll(LINK_PATTERN)) {
    const start = match.index;
    const trimmed = match[0].replace(TRAILING, "");
    if (!trimmed) continue;

    if (start > cursor) out.push(children.slice(cursor, start));

    const isEmail = Boolean(match[1]);

    out.push(
      isEmail ? (
        <a key={`l${key++}`} href={`mailto:${trimmed}`}>
          {trimmed}
        </a>
      ) : (
        <a key={`l${key++}`} href={`https://${trimmed}`} target="_blank" rel="noopener noreferrer">
          {trimmed}
          <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
        </a>
      ),
    );

    cursor = start + trimmed.length;
  }

  if (cursor < children.length) out.push(children.slice(cursor));

  return <>{out}</>;
}

export default LegalText;
