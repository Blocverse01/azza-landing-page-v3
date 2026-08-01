/**
 * The section's public surface is `CardDeck` and its data - nothing else.
 *
 * `DeckCard` and `DeckCarousel` are deliberately NOT re-exported. They use
 * hooks and carry no `"use client"` of their own, because components.md S3 is
 * explicit that a file imported only by a client component must not have one.
 * Re-exporting them here would put them one `import` away from a server
 * component and break that build with "useState only works in a Client
 * Component" - which is precisely what happened the first time this barrel
 * exported all three.
 *
 * `deck-content` is pure data and is safe on either side of the boundary.
 */
export { CardDeck } from "./CardDeck";
export {
  DECK_RECORDS,
  DECK_SCREEN_ALT,
  type DeckArt,
  type DeckRecord,
} from "./deck-content";
