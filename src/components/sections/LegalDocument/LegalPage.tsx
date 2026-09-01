import { Pill, Prose, Section } from "@/components/ui";
import type { LegalDocument } from "@/content/legal";

import { LegalBody } from "./LegalBody";
import { LegalToc } from "./LegalToc";
import { LegalTocMobile } from "./LegalTocMobile";

/*
 * The shell both legal routes mount - `/privacy-policy` and `/terms-of-use`.
 *
 * ONE COMPONENT, TWO ROUTES. The documents differ only in their content: same
 * masthead, same two-column frame, same rail, same rhythm. A second component
 * would be the same file with two strings changed.
 *
 * THE FRAME. A `wide` (1280) container holding a two-column grid at `lg`+ -
 * prose on the left, an 18rem rail on the right, 64px between them. Below `lg`
 * it is one column with the rail collapsed into a disclosure above the copy.
 *
 * The prose column keeps `--container-prose` (842), the site's own reading
 * measure, rather than the 640 the teardown measured on interfere.com: 842 is
 * what `/blog` and `/help` already set, and one reading measure across every
 * long-form page beats matching a page we do not own. The teardown's actual
 * complaint - that 640px at 15px runs ~95 characters - does not carry over,
 * because 842 at our 20px `md-prose` step lands near 80.
 *
 * WHY THE TITLE IS NOT THE DISPLAY FACE. The study proposed Bebas Neue here.
 * `ArticleHeader` sets the site's other long-form title at `text-3xl` in the
 * body face, and a legal document is that kind of page, not a hero - so the
 * existing convention wins over the proposal. The display face stays on the
 * marketing routes, which is what makes it read as voice rather than as
 * decoration.
 */

export interface LegalPageProps {
  document: LegalDocument;
  /** Id of the route's single <h1>, so the section can name itself by it. */
  titleId: string;
}

export function LegalPage({ document: doc, titleId }: LegalPageProps) {
  const tocLabel = `${doc.title} contents`;

  return (
    <Section rhythm="standard" container="wide" align="start" gap={0} aria-labelledby={titleId}>
      <div className="flex w-full flex-col gap-10 lg:gap-14">
        {/* The masthead spans the full container, not just the prose column. */}
        <header className="flex w-full max-w-(--container-prose) flex-col gap-6">
          <Pill variant="eyebrow">LEGAL</Pill>

          <h1 id={titleId} className="text-fg-body text-3xl">
            {doc.title}
          </h1>

          <p className="text-lg-standfirst text-fg-caption">{doc.standfirst}</p>

          {/*
           * DEMOTED, DELIBERATELY. Interfere styles its "Last updated" line
           * exactly like body copy - same size, weight and colour - which
           * wastes the one piece of metadata a returning reader scans for. A
           * caption-weight <time> is both easier to find and machine-readable.
           */}
          <p className="text-sm-meta text-fg-caption-soft">
            Effective from <time dateTime={doc.effectiveDate}>{doc.effectiveDateLabel}</time>
          </p>
        </header>

        <LegalTocMobile sections={doc.sections} label={tocLabel} className="lg:hidden" />

        <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
          {/*
           * `Prose` carries the body ink, the measure and the inline-link
           * treatment; `LegalBody` supplies the structure inside it. Headings
           * are not `Prose`'s concern - it sets one step - so they take their
           * own from the scale.
           *
           * `gap` is passed as the contract's smallest value and spaces
           * nothing, because `Prose` gaps its DIRECT children and there is one.
           * The clause rhythm is composed inside `LegalBody` instead - the same
           * shape `ArticleBody` documents. It is NOT overridden to `gap-0` from
           * here: `cn` joins without merging, so `gap-5` and `gap-0` would both
           * survive into the class attribute and the cascade, not the call
           * site, would pick the winner.
           */}
          <Prose step="md-prose" gap={20} tone="prose" as="div">
            <LegalBody sections={doc.sections} />
          </Prose>

          {/*
           * The rail is `sticky` inside a grid item, which only works while
           * that item is not stretched to the row height - hence `self-start`.
           * Without it the column is as tall as the document and the rail has
           * nothing left to travel within, so it silently never sticks.
           *
           * `top` clears the sticky bar plus one 24px step of breathing room.
           */}
          <aside className="hidden self-start lg:sticky lg:top-[calc(var(--height-nav)+1.5rem)] lg:block">
            <LegalToc sections={doc.sections} label={tocLabel} />
          </aside>
        </div>
      </div>
    </Section>
  );
}

export default LegalPage;
