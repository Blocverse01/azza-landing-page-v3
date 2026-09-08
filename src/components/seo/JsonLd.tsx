export interface JsonLdProps {
  /** One schema.org object, from `lib/seo.ts`. */
  data: Record<string, unknown>;
}

/**
 * One `<script type="application/ld+json">` per structured-data object.
 *
 * `<` is escaped to `<` in the serialised JSON so that content which
 * arrives from outside the repo - a Hashnode post title, say - can never
 * contain a `</script>` that ends the tag early. JSON parsers read the escape
 * back as a plain `<`, so the data is unchanged for the crawler.
 *
 * A server component: it renders a string and holds nothing.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
