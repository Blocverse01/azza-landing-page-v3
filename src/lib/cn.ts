/**
 * Join class name parts, dropping falsy values and duplicate tokens.
 *
 * Deliberately three lines of nothing. `clsx` and `tailwind-merge` are NOT
 * installed and must not be: the project has three runtime dependencies and
 * this needs none. Last-wins conflict resolution is not provided either - if
 * two classes fight, that is a bug in the caller, not something a 6 kB
 * dependency should paper over.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS DOES NOT DO, AND THE ONE TRAP IT SETS
 * ---------------------------------------------------------------------------
 * It joins. It does not MERGE. If two arguments carry conflicting Tailwind
 * utilities for the same CSS property, BOTH survive into the class attribute
 * and the CASCADE decides the winner - the order you passed them in has no
 * effect whatsoever, because a class attribute is an unordered set to CSS.
 *
 * That is invisible at the call site and it bites hardest on `display`, because
 * several components set a display utility in their own base string:
 *
 *   <Button className="hidden xs:inline-flex" />   // Button's base: inline-flex
 *
 * reads as "hidden below 480". It is not. Tailwind v4 emits the display group
 * alphabetically - `.contents .flex .grid .hidden .inline .inline-block
 * .inline-flex .table` - so `.inline-flex` is written AFTER `.hidden`, matches
 * with equal specificity, and wins at every width. The element never hides.
 * This shipped once, in TopNav, and put two identical "Chat with Azza" controls
 * in the header below 480 (two tab stops, one accessible name).
 *
 * THE SAFE PATTERN: put the display utility on a WRAPPER that has no display of
 * its own, rather than passing it to a component whose base sets one.
 *
 *   <span className="hidden xs:contents">
 *     <Button ... />
 *   </span>
 *
 * `contents` leaves no box, so the child keeps its place in the parent's flex
 * or grid flow, and the wrapper's own `hidden` -> `xs:contents` switch is safe
 * because Tailwind guarantees variant rules are emitted after unprefixed ones.
 *
 * FOR NON-DISPLAY PROPERTIES a trailing `!` on the caller's utility is enough
 * (`px-0!` beating a size preset's `px-4`), since `!important` outranks a
 * normal declaration whatever the source order. Reach for `!` only when you
 * genuinely mean "the caller overrules the component"; if you find yourself
 * fighting a component's base on more than a property or two, the component
 * wants a prop, not an override.
 *
 * Teaching this function to resolve conflicts would change class resolution in
 * every component at once. Fix the call site.
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
