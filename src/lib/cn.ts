/**
 * Join class name parts, dropping falsy values and duplicate tokens.
 *
 * Deliberately three lines of nothing. `clsx` and `tailwind-merge` are NOT
 * installed and must not be: the project has three runtime dependencies and
 * this needs none. Last-wins conflict resolution is not provided either - if
 * two classes fight, that is a bug in the caller, not something a 6 kB
 * dependency should paper over.
 */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  const seen = new Set<string>();

  for (const part of parts) {
    if (!part) continue;
    for (const token of part.split(/\s+/)) {
      if (token) seen.add(token);
    }
  }

  return Array.from(seen).join(" ");
}
