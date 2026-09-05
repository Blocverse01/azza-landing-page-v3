import { Prose } from "@/components/ui";

import { ShareRow } from "./ShareRow";

/*
 * THE ARTICLE BODY - real content at last (2026-09-05).
 *
 * The previous file carried one hand-transcribed body - 352:3708's copy,
 * rendered under every slug, with its own documented finding that "every slug
 * renders this body until real per-post copy exists". The Hashnode adapter
 * (lib/hashnode.ts) ends that era: each post arrives with its own sanitised
 * HTML, and this component's job shrinks to rendering it inside the design's
 * reading frame.
 *
 * WHO STYLES WHAT. `Prose` keeps what it always owned - the measure, the ink,
 * the 20px step (18 via the mobile tier) and the inline-link treatment via its
 * `[&_a]` rules. The elements a feed can contain that the old body never used
 * - h2/h3 out of Hashnode's h1-h6, lists, blockquotes, code, tables, images,
 * figures - are styled by the `azza-article` block in theme.css, on tokens,
 * scoped so nothing leaks into the rest of the site.
 *
 * `dangerouslySetInnerHTML` is the deliberate tool, not an accident: the
 * content is HTML by nature, produced by Hashnode's own editor, sanitised
 * again at the adapter (script/style/iframe subtrees, on* handlers and
 * javascript: URLs stripped) - see the sanitiser's note for the trust
 * reasoning. Rendering it any other way means writing an HTML-to-JSX parser,
 * which is the same risk with more code.
 *
 * The share footer survives from the old body: it is chrome, not content.
 */

export interface ArticleBodyProps {
  /** The article title, handed to the share footer for its share text. */
  title: string;
  /** The post's sanitised body from the adapter. */
  contentHtml: string;
}

export function ArticleBody({ title, contentHtml }: ArticleBodyProps) {
  return (
    <div className="flex w-full max-w-(--container-prose) flex-col gap-15">
      <Prose step="md-prose" gap={20} tone="prose" as="div">
        <div className="azza-article" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </Prose>

      <ShareRow title={title} variant="footer" />
    </div>
  );
}

export default ArticleBody;
