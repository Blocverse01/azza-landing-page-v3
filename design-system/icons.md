# Icons — AZZA Website

**Owner:** `iconography-expert` (Phase 1, wave 1A; revised wave 2C-prereq)
**Source:** Figma `OXDVihY7WvtPZ6uGuVFx5Y` — section `672:246` "FOR BUILD" (8 frames), component set `507:498`,
and **(added in r2)** the two canvas-level nav dropdown panels `94:850` (Products) and `63:350` (Socials),
which are direct children of page `1:3` and sit **outside** `672:246`.
**Artifacts:** 26 SVG files in `design/icons/`

Every file here was exported from the real Figma node through the MCP and written to disk. Nothing was
hand-drawn, redrawn, or traced from a screenshot. No file references a remote URL.

> ## Revision r2 — 2026-08-01
>
> **Additive only.** Four glyphs added: `wallet`, `money-bag`, `briefcase`, `social-youtube`. **No existing
> `.svg` was modified, renamed or deleted** — verified by SHA-256 over all 22 baseline files before and after
> (§12.4). The 21-name `IconName` union already shipped in `src/components/ui/Icon/types.ts` is a strict subset
> of the new one; nothing built in waves 2A–2C breaks.
>
> **§12 is the new material:** the full reference-graph sweep, the three-way reconciliation table, and the exact
> `IconName` strings to register so the orchestrator's code change is mechanical. **§13** records why r1 missed
> these and what the sweep now proves. Everything in §1–§11 is r1 text, amended in place where a count or a
> table row changed; amendments are marked **[r2]**.

---

## 1. Read this first — the icons are not custom

The single most consequential finding of this extraction: **AZZA has no bespoke icon set.** Twenty-two of the
twenty-six exported files come from four public icon libraries, and the Figma layer names still carry the
library prefixes that prove it.

| Library | Evidence in the file | Glyphs used |
|---|---|---|
| **Fluent UI System Icons** (Microsoft, MIT) | layer names end `_regular` — `down_regular`, `right_regular`, `arrow_right_regular`, `search_regular`, `lightning_regular`, `bill_regular`, `social_x_regular`, `instagram_regular`, `whatsapp_regular`, **[r2]** `wallet_4_regular`, `wallet_2_regular`, `suitcase_regular`, `youtube_regular` | **13** |
| **Material Symbols** (Google, Apache-2.0) | `play_circle_filled` — Material's exact glyph id | 1 |
| **Iconify sets** | `tabler:link` (Tabler, MIT), `streamline-flex:tiktok-solid` (Streamline), `skill-icons:instagram` | 3 |
| **Crypto Currency Icons** (Figma community lib) | instance name `Crypto Currency Icons`, variants `Binance Coin/color`, `Tether/color`, `Polygon/color` | 3 |
| **Custom / brand** | Azza wordmark, Azza app mark, the Azza-Wrapped bolt, the map pin, the Nigeria flag roundel | 5 (+1 flag) |

### The recommendation

**Install `@fluentui/react-icons` (or Iconify) for the 17 library glyphs; ship only the 5 brand files and the
3 crypto files from `design/icons/`.** Reasons, in order of weight:

1. **Correctness.** The Figma copies are frozen snapshots of a library that gets fixed upstream. The `link`
   icon in this design already renders at the wrong stroke weight (finding F-3) — a bug the designer
   introduced by scaling, which the library version does not have.
2. **Coverage.** The design uses one chevron and one arrow. A real site needs `chevron-left`, `chevron-up`,
   `close`, `menu`, `external-link`, `check`, `alert` — none of which exist in this Figma file. Nineteen
   implementers will otherwise each invent one. With the library installed, they take the matching Fluent
   glyph and stay visually consistent for free.
3. **Weight.** Tree-shaken library imports beat 26 hand-managed files.

**[r2] This recommendation was declined by the orchestrator (D-027 / open question 1) and the run is committed
to the local glyph module.** It is left here as the record of the trade-off, not as a live proposal. Note that
r2 is direct evidence for reason 2: four glyphs the design does reference were not in the first export, and
the four Help-hub glyphs (F-2) are still absent from the design entirely.

The exported SVGs in `design/icons/` remain the **authority for what the design actually shows**. §7 gives the
component contract for either delivery path.

---

## 2. Manifest

`intrinsic` is the SVG's own `viewBox`. `placed` is the size(s) the design actually renders it at.
Canonical node id is listed first, in **bold**; the remaining ids are the duplicate placements that map to
the same file.

### Single-colour — `fill="currentColor"`

| File | Semantic name | Figma layer | Node ids | Intrinsic | Placed | Frames |
|---|---|---|---|---|---|---|
| `arrow-right.svg` | arrow-right | `arrow_right_regular` | **412:1290**, 412:1224, 412:1228, 412:1231, 412:1624 | 24×24 | 24 | Landing, Crypto Wallet |
| `bolt.svg` | bolt (speed) | `lightning_regular` | **412:1896**, 412:1678 | 20×20 | 20, 17.5 | Cross-Border, Crypto Wallet |
| `bolt-outline.svg` | bolt outline (Wrapped lockup) | `Vector` | **412:1200** | 43×75 | 42×74 | Landing |
| **[r2]** `briefcase.svg` | briefcase / business | `suitcase_regular` | **507:840** | 24×24 | 24 | Products dropdown `94:850` |
| `chevron-down.svg` | chevron-down | `down_regular` | **412:2079**, +20 more (see §3) | 18×18 | 18, 20, 22 | all 8 |
| `chevron-right.svg` | chevron-right | `right_regular` | **500:1749**, 500:1753, 500:2322 | 20×20 | 20 | Help, Help-Opened |
| `link.svg` | copy link | `tabler:link` | **352:3738**, 352:3704 | 16×16 | 16 | Blog Article |
| **[r2]** `money-bag.svg` | money bag (cross-border) | `wallet_2_regular` | **507:835** | 24×24 | 24 | Products dropdown `94:850` |
| `play-circle.svg` | play | `play_circle_filled` | **412:1071**, 412:1079, 412:1087 | 32×32 | 32 | Landing |
| `receipt.svg` | fees / receipt | `bill_regular` | **412:1902** | 20×20 | 20 | Cross-Border |
| `search.svg` | search | `search_regular` | **500:1741**, 500:2204, 500:2310 | 20×20 | 20 | Help, Help-Opened, Blog |
| `share-tiktok.svg` | TikTok | `streamline-flex:tiktok-solid` | **352:3701**, 352:3735 | 24×24 | 24 | Blog Article |
| `share-x.svg` | X (filled tile) | unnamed `Vector` | **352:3695**, 352:3729 | 24×24 | 24 | Blog Article |
| `social-instagram.svg` | Instagram (outline) | `instagram_regular` | **518:530**, **[r2]** 507:869 | 22×22 | 22, **16** | Help, **Socials dropdown** |
| `social-whatsapp.svg` | WhatsApp | `whatsapp_regular` | **521:578** | 22×22 | 22 | Help |
| `social-x.svg` | X (outline) | `social_x_regular` | **519:540**, **[r2]** 519:543 | 22×22 | 22, **16** | Help, **Socials dropdown** |
| **[r2]** `social-youtube.svg` | YouTube | `youtube_regular` | **507:864** | 16×16 | 16 | Socials dropdown `63:350` |
| **[r2]** `wallet.svg` | wallet (crypto wallet) | `wallet_4_regular` | **507:820** | 24×24 | 24 | Products dropdown `94:850` |

**[r2] `social-instagram` and `social-x` gained a second placement, not a second file.** The Socials dropdown
draws them at 16px from `507:869` and `519:543`. Those are the *same glyphs uniformly scaled* — proven, not
assumed: the 22px ink boxes are 16.49×16.49 and 16.50×16.50, the 16px ones are 11.99×11.99 and 12.00×12.00
(ratio 0.7273 = 16/22 in both cases), and the leading path coordinates scale by the reciprocal 1.375 exactly.
One file serves both sizes; the `<Icon>` component sets the pixel size. No new file, no rename.

### Multi-colour — fills preserved exactly, **do not** recolour

| File | Semantic name | Figma layer | Node ids | Intrinsic | Placed | Fills | Frames |
|---|---|---|---|---|---|---|---|
| `crypto-bnb.svg` | BNB coin | `Binance Coin/color` | **412:1195**, 412:1191 | 141×141 | 140.1, 17.4 | `#E3BE61`, white | Landing |
| `crypto-polygon.svg` | Polygon chain badge | `Polygon/color` | **412:1657** | 10×10 | 9.6 | `#6F41D8`, white, gradient | Crypto Wallet |
| `crypto-usdt.svg` | Tether coin | `Tether/color` | **412:1656** | 20×20 | 19.2 | `#26A17B`, white | Crypto Wallet |
| `flag-ng.svg` | Nigeria flag roundel | `Flag_of_Nigeria (1)` | **412:1667**, 412:1871, 412:1885 | 24×24 | 24 | `#008751`, white | Crypto Wallet, Cross-Border |
| `logo-azza-mark.svg` | Azza app mark | `Frame 1618869178` | **412:1576**, 412:1781, 412:2018, 412:2655 | 40×40 | 40 | `#3430E9`, white | Landing, all 3 Products |
| `logo-azza-wordmark.svg` | Azza wordmark | `Group 33` | **498:604**, +15 more (see §3) | 95×32 | 95×32, 59.4×20 | `#3430E9`, white | all 8 |
| `map-pin.svg` | location pin | `Location` | **412:2474**, 412:2488, 412:2502 | 85×94 | 85×94 | `#F83333`, `#AA0D0D` | Business |
| `share-instagram.svg` | Instagram (brand) | `skill-icons:instagram` | **352:3696**, 352:3730 | 24×24 | 24 | 2 radial gradients | Blog Article |

**Why `share-x` and `social-x` are both kept:** they are different glyphs, not a duplicate. `social-x.svg` is
a bare X stroke-mark; `share-x.svg` is a filled rounded tile with the X knocked out. Verified by render, not
by name.

**[r2] `map-pin.svg` remains on disk but is NOT in the `IconName` union** — the orchestrator adjudicated it to
`Media` (components.md §11 C-2: the three `Location` nodes measure 84.62×93.57, 87.72×92.43 and 75.35×93.77,
so they are three different shapes, not one glyph placed three times). The file is left in place because this
spec forbids deleting existing SVGs and because it is the record of what `412:2474` contains.

### Full duplicate-placement lists

`chevron-down.svg` (21 placements): 412:2079, 412:2083, 412:1659, 412:1672, 412:1844, 412:1848, 412:1876,
412:1890, 412:2622, 412:2626, 412:2792, 412:2796, 498:223, 498:227, 500:2295, 500:2299,
501:204, 511:445, 511:449.

`logo-azza-wordmark.svg` (16 placements): 412:2068, 412:2611, 412:2670, 412:2781, 412:2805, 498:212, 498:604,
498:646, 498:688, 498:730, 498:772, 498:856, 500:2284, 500:2390, 511:434, 412:1833.

---

## 3. Geometry

**Grid.** Every library glyph is drawn on its library's own square grid — Fluent on 20, Material on 24,
Tabler on 24 — then placed in the design at whatever pixel size the layout wanted. Each file therefore keeps
its **own intrinsic `viewBox`**, and the `<Icon>` component normalises at render time by setting `width` and
`height`. Do not rewrite any `viewBox` to a common box: for the circular coin marks and the flag roundel that
would shift the geometry off-centre.

**[r2]** The four new glyphs keep their source boxes verbatim: `wallet`, `money-bag` and `briefcase` on
`0 0 24 24`; **`social-youtube` on `0 0 16 16`**. `social-youtube` is deliberately *not* re-projected onto 22
to match its `social-*` siblings — re-projecting would mean rewriting path coordinates, which is exactly the
fabrication this document forbids. The size difference is handled by the component, not by the file.

**Fill vs stroke.** 25 of 26 icons are **filled paths with no stroke**. Exactly one — `link.svg` — is a
stroked icon (`stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`). See finding F-3: its
weight is wrong and it will look heavier than everything beside it.

**[r2]** All four new glyphs are single filled paths with `fill-rule="evenodd"`, zero strokes, zero groups,
zero `<defs>`, zero clip paths. They read as outlined shapes but the outline is drawn as fill — same
construction as `search`, `receipt` and the `social-*` family, so they sit in the set without adjustment.

**There is no stroke-width system**, because there are almost no strokes. Any icon an implementer adds later
should be a **filled Fluent `_regular` glyph**, not a stroked one, or it will not match.

**Optical consistency, measured.** Ink-box inset as a percentage of the viewBox, for the Fluent family:

| Icon | L | R | T | B |
|---|---|---|---|---|
| `chevron-down` @18 | 22 | 22 | 35 | 33 |
| `chevron-down` @22 | 22 | 22 | 35 | 33 |
| `chevron-right` | 35 | 33 | 22 | 22 |
| `search` | 8 | 11 | 8 | 11 |
| `bolt` | 17 | 17 | 8 | 8 |
| `receipt` | 17 | 17 | 8 | 8 |
| `arrow-right` | 13 | 14 | 22 | 22 |
| `social-x` | 12 | 12 | 12 | 12 |
| **[r2]** `social-instagram` | 12 | 12 | 13 | 12 |
| **[r2]** `wallet` | 13 | 12 | 10 | 17 |
| **[r2]** `money-bag` | 13 | 13 | 8 | 8 |
| **[r2]** `briefcase` | 8 | 8 | 17 | 12 |
| **[r2]** `social-youtube` | 8 | 8 | 17 | 17 |

The 18px and 22px chevrons are **byte-for-byte the same glyph, uniformly scaled** — identical padding
percentages. That is the proof behind the dedupe: one file serves all three placed sizes.

`chevron-right` is `chevron-down` with the insets transposed, i.e. the same glyph rotated 90°. Both files
ship because both exist in the design, but an implementer may render one and rotate it.

**[r2] `wallet` and `briefcase` are optically off-centre in their own boxes** — `wallet` carries 10% top / 17%
bottom padding, `briefcase` 17% top / 12% bottom. That is how Fluent authored them (the wallet's card flap
occupies the top band, the briefcase's handle the top band) and it is correct for the glyph, but it means a
naive vertical centre-align against a text label will look 1px low for `wallet` and 1px high for `briefcase`
at 24px. In the Products dropdown they sit inside a 36×36 circle (`Group 1410085214`), which absorbs it.
`social-youtube` at 8/8/17/17 is the widest, flattest ink box in the set — expected, it is a landscape mark.

---

## 4. Sizing

### Observed sizes, all 12 of them

`9.6 · 16 · 17.4 · 17.5 · 18 · 19.2 · 20 · 22 · 24 · 32 · 40 · 140.1`

**[r2] The r2 sweep added no new size.** The four new glyphs are placed at 24 (Products dropdown) and 16
(Socials dropdown), both already on the list and both already on the scale below. This is the one genuinely
reassuring result of the sweep.

Twelve distinct sizes for twenty-two glyphs is drift, not a scale. Five of those values (9.6, 17.4, 17.5, 19.2,
140.1) are not integers — they are artefacts of proportional scaling inside a scaled group, not decisions.

### The scale to build against

| Token | px | Use |
|---|---|---|
| `xs` | 16 | inline with small text; icon inside a larger hit target. **[r2]** the whole Socials dropdown row |
| `sm` | 20 | inline with body text (form fields, list rows, sidebar links, chips) |
| `md` | **24** | **default.** Buttons, share rows, currency-flag chips, **[r2]** Products dropdown rows |
| `lg` | 32 | standalone controls (play button), icon-in-circle badges |
| `xl` | 40 | avatar-scale brand marks |

Brand marks are not on this scale — `logo-azza-wordmark` renders at its aspect ratio (95×32 in the footer,
59.4×20 in the nav), and `map-pin` / `bolt-outline` / `crypto-bnb@140` are placed decorations sized by their
layout, not by an icon step.

### Mapping the drift onto the scale

| Placed | Snap to | Note |
|---|---|---|
| 17.5, 17.4, 19.2 | `sm` (20) | scaling artefacts; no intent |
| 18 (nav chevrons, ×6) | `sm` (20) | consistent across all 8 frames, so it *is* intentional — but 2px off the scale. Flagged, not silently changed. |
| 22 (chip chevrons, social glyphs) | `sm` (20) or `md` (24) | 22 is 2px off in the other direction |
| **[r2]** 16 (Socials dropdown row) | `xs` (16) | already exact. Do not snap up — the dropdown row is 24px tall and a 20px glyph would crowd it |
| **[r2]** 24 (Products dropdown row) | `md` (24) | already exact |
| 9.6 (Polygon badge) | leave | a badge overlay on the USDT chip, ~48% of its host — not an icon slot |
| 140.1 (BNB) | leave | a hero-scale decoration in Azza Wrapped |

**Recommendation:** snap 17.4/17.5/18/19.2/22 to `sm` (20). This changes the nav chevron by 2px and the chip
chevron by 2px — visually negligible, and it collapses five sizes into one. If `visual-qa` scores this as a
regression against the Figma export, revert the nav chevron to 18 and record it as an exception.

**[r2] Caveat added by the sweep.** The 22 → 20 snap now has a second consequence the r1 table did not know
about: `social-x` and `social-instagram` are placed at 22 in Help & Support and at **16** in the Socials
dropdown. Snapping only the 22 leaves the same glyph at 20 and 16 in two adjacent nav surfaces. That is fine —
they are different contexts, an inline community row versus a compact dropdown — but do not "harmonise" the
16px dropdown up to 20 to match. Its container is 24px tall.

---

## 5. Colour

**The rule: single-colour icons inherit `currentColor`; multi-colour icons keep their fills.**

All 18 single-colour icons have had their hard-coded hex fills replaced with `currentColor`. The colours they
were exported with are recorded below purely so `color-token-expert`'s tokens can be cross-checked — an
implementer should never re-hardcode them.

| Icon | Exported as | Reads as |
|---|---|---|
| `arrow-right`, `bolt`, `receipt` | `#3430E9` | brand blue, on-light |
| `chevron-down`, `social-x`, `social-instagram`, `social-whatsapp` | `#353535` | body ink |
| **[r2]** `wallet`, `money-bag`, `briefcase`, `social-youtube` | `#353535` | body ink — same value as the nav chevron |
| `chevron-right` | `#4A4A4A` | secondary ink |
| `search` | `#787878` | placeholder / muted ink |
| `play-circle` | `#DCDBDB` | light-on-image overlay |
| `share-x`, `share-tiktok` | `#1E1E1E` | strong ink |
| `bolt-outline` | `#D3FEB6` | the `Green` Figma variable |
| `link` | stroke, no fill | inherits |

**[r2]** All four new glyphs are a single `#353535` solid fill on a single path — no gradient, no second
colour, no opacity. They are unambiguously `currentColor` glyphs under the §5 rule, and each file contains
exactly one `currentColor` occurrence and **zero** hex values (verified by regex over the written files).

**Note the inconsistency:** four different greys (`#353535`, `#4A4A4A`, `#787878`, `#DCDBDB`) for glyphs doing
comparable jobs, none of them variable-backed. Because they now inherit `currentColor`, this resolves itself
the moment the icons sit inside correctly-tokenised text — which is the main practical argument for
`currentColor` here, beyond theming.

**[r2] A fifth grey exists, and it is a new one.** The Socials dropdown's copy of `social_x_regular`
(`519:543`) is filled `#10161F`, not `#353535` — the Help & Support copy of the *same glyph* (`519:540`) is
`#353535`. Same mark, two inks, one design. Neutralised by `currentColor` like the rest, and recorded as
F-11.

**The 8 fixed-fill icons must not be recoloured.** `crypto-*` are exchange-recognised brand marks (Binance
gold, Tether green, Polygon purple), `flag-ng` is a national flag, `share-instagram` is a two-stop radial
gradient, and the two Azza logos are the brand. Recolouring any of them is a correctness bug, not a theming
choice. Every one of these files keeps its fills byte-identical to the Figma export.

---

## 6. What was cleaned, and what was deliberately left

Figma's SVG export wraps the target node in its entire ancestor chain — a `#1E1E1E` artboard backdrop, the
9804×8680 `FOR BUILD` section chrome as two enormous paths, and one `<rect>` per ancestor frame. A raw export
of an 18px chevron arrives at 2,528 bytes, of which ~1,400 is the section border.

Applied to every file:

- Extracted only the target icon group's own subtree; dropped the backdrop rect, the section chrome and every
  ancestor frame rect.
- Kept `viewBox`. Removed `width`/`height` attributes so the component controls size.
- Stripped Figma layer-name ids (`id="Vector"`, `id="Group"`, `id="Frame 1618869178"`). These are the classic
  inline-SVG collision: twenty icons on one page each declaring `id="Vector"` is invalid HTML and breaks
  `url(#…)` resolution.
- **Namespaced every surviving internal id** to its own file — `clip0_1_3` became `flag-ng-clip0_1_3`,
  `paint0_radial_1_3` became `share-instagram-paint0_radial_1_3`. Figma numbers these identically across every
  export, so inlining two un-namespaced icons makes the second one render with the first one's gradient.
- Dropped `<defs>` entries no longer referenced (e.g. `bolt.svg` shipped with the Exchange Widget's drop-shadow
  filter attached to an ancestor that is now gone). Kept every def still reachable from a `url(#…)`.
- Collapsed groups left attribute-less by the id strip.
- Added `aria-hidden="true"` and `focusable="false"` to the root, so a bare inline import is safe by default
  and `<Icon>` opts *in* to being announced (§7).

**[r2] What was applied to the four new files, exhaustively.** They were exported through the MCP with
`exportAsync({format:'SVG_STRING'})` **on the icon frame itself**, which returns only that subtree — so none
of the ancestor-chrome cleanup above was needed. The complete delta from the Figma export is three edits:

1. Dropped the root `width` / `height` attributes. `viewBox` untouched.
2. `fill="#353535"` → `fill="currentColor"` on the single path.
3. Added `aria-hidden="true"` and `focusable="false"` to the root.

**No path coordinate was touched.** The `d` string of each new file is byte-identical to the Figma export —
proven by length and FNV-1a checksum computed independently on both sides (§12.4). Nothing was rounded,
re-projected, merged or simplified.

Deliberately kept:

- **Clip paths that do work.** `flag-ng.svg` keeps two nested `clipPath`s — the outer one is the circular crop,
  the inner one bounds the flag. Removing them turns the roundel into a square.
- **The `#50AF95` backing rect in `flag-ng.svg`**, fully covered by the flag. It is dead paint, but it is also
  the source geometry for the circular clip; leaving it is 40 bytes and zero risk.
- **Fractional path coordinates.** No rounding was applied. Aggressive coordinate rounding at these viewBox
  scales (10×10 for the Polygon badge) visibly shifts shapes.
- **`fill-rule="evenodd"`** wherever present — it is what knocks the triangle out of `play-circle`, the note
  out of `share-tiktok`, and **[r2]** the play triangle out of `social-youtube`, the ¥ out of `money-bag` and
  the three compartments out of `briefcase`. Dropping it on any of the four new files hollows the glyph.

Nothing was flattened from stroke to path; `link.svg` is still a stroked icon.

### Verification

Every one of the 26 files was checked, and passed:

1. **Well-formed** — parsed with an XML parser; all 26 pass.
2. **Has a `viewBox`** — all 26.
3. **No remote URL** — all 26. No `http(s)` reference other than the SVG namespace.
4. **No editor metadata** — no `<metadata>`, `<title>`, `<desc>`, `sodipodi`, `inkscape`.
5. **No dangling or orphaned `url(#…)`** — every reference resolves; every def is referenced. The four new
   files contain no `url(#…)` at all.
6. **Renders correctly** — the 22 r1 files were rendered in headless Chromium at 56px and compared against a
   screenshot of each one's Figma node. **[r2]** the four new files were rendered the same way at 88px with
   `color: #3430E9`, and each was compared against a 14× render of its own Figma node taken in the same
   session. All four match: `wallet` shows the billfold with the card flap and clasp dot; `money-bag` the
   drawstring pouch with the ¥ mark; `briefcase` the three-compartment case with handle; `social-youtube` the
   rounded rectangle with the play triangle. `currentColor` inheritance was confirmed by the render picking up
   the brand blue from the page. This is the check that matters: a valid SVG that renders wrong is worse than
   an unoptimised one.

Byte reduction across the r1 set: 68,348 → 35,864 (−48%). The four r2 files add 8,383 bytes.

---

## 7. The component contract

An implementer built this in wave 2A (`impl-primitives`, `src/components/ui/`). **I define it; I do not
build it.**

### Props

```ts
type IconName =
  | 'arrow-right' | 'bolt' | 'bolt-outline' | 'chevron-down' | 'chevron-right'
  | 'link' | 'play-circle' | 'receipt' | 'search'
  | 'share-instagram' | 'share-tiktok' | 'share-x'
  | 'social-instagram' | 'social-whatsapp' | 'social-x'
  | 'crypto-bnb' | 'crypto-polygon' | 'crypto-usdt'
  | 'flag-ng' | 'logo-azza-mark' | 'logo-azza-wordmark'
  // [r2] — four names appended. Nothing above this line changes.
  | 'wallet' | 'money-bag' | 'briefcase' | 'social-youtube';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';   // 16 / 20 / 24 / 32 / 40

interface IconProps {
  /** Which glyph. Required — no default, so a typo is a type error, not a blank box. */
  name: IconName;
  /** Step on the scale, or an explicit px number for the documented off-scale cases. Default 'md'. */
  size?: IconSize | number;
  /** Accessible label. Presence of this prop is what makes the icon meaningful — see below. */
  title?: string;
  /** Extra classes. Colour is set here, via a text-colour utility. */
  className?: string;
  /** Rotation in degrees. Only legitimate use: 180 on the Azza Wrapped "previous" arrow (F-4). */
  rotate?: 0 | 90 | 180 | 270;
}
```

**[r2]** `map-pin` is absent from this union by orchestrator adjudication (components.md §11 C-2); it ships
through `Media`. The union is therefore **25 names**, not 26 files.

**No `color` prop.** Colour arrives through CSS inheritance: single-colour icons are `fill="currentColor"`,
so they take the colour of their text context. A `color` prop would invite implementers to pass a hex and
defeat gate 6 (zero raw hex in component source). Fixed-fill icons ignore colour entirely — the component
must not attempt to override them.

### Behaviour

- Renders a square box at the chosen size with **both** `width` and `height` set explicitly. Never `auto`.
- Sets `display: inline-block` and `flex-shrink: 0` — icons in a flex row must not compress.
- Sets `vertical-align: middle` for inline-with-text placements.
- Passes the size through to the `<svg>`; the `viewBox` in the file does the rest. Non-square icons
  (`logo-azza-wordmark` 95×32, `bolt-outline` 43×75) must honour their aspect ratio — the
  component should set height from the size step and let width follow, or accept an explicit `width`.
- **[r2]** all four new glyphs are square-boxed (24×24 or 16×16) and need no aspect-ratio handling. Rendering
  `social-youtube` at 24 is legal and safe — a 16 viewBox scales up cleanly because it is vector — but the
  design places it at 16 (`xs`), and at 24 it will read visually wider than the 22-grid `social-*` siblings
  because its ink box is 8/8/17/17 versus their 12/12/13/12. Prefer `xs` for the whole Socials dropdown row.

### Accessibility

Two states, decided by whether `title` is passed:

**Decorative — no `title`.** The icon sits beside a visible text label that already carries the meaning.
Render `aria-hidden="true"` and `focusable="false"`. Emit no `<title>`. This is the default and covers most of
the set.

**Meaningful — `title` given.** The icon is the only thing conveying the meaning. Render `role="img"` and an
accessible name, and drop `aria-hidden`. (D-029 settled this as `aria-label` rather than
`aria-labelledby` + `<title id>`, because `Icon` is a server component and `useId` is a client hook.)
When the icon is the sole content of a `<button>` or `<a>`, prefer putting `aria-label` on the control
and leaving the icon decorative — one label, not two.

Per-icon default, for implementers:

| Icon | Default | Why |
|---|---|---|
| `chevron-down`, `chevron-right` | decorative | always beside a label; state belongs on `aria-expanded` of the control |
| `arrow-right` | decorative | inside labelled buttons ("Get Started", "Buy Crypto Now") |
| `bolt`, `receipt` | decorative | beside "Arrives in seconds" / "Total fees included" |
| `search` | decorative | the field has placeholder text; label the `<input>` |
| `flag-ng` | decorative | beside the "NGN" / "GHS" currency code |
| `crypto-bnb`, `crypto-usdt`, `crypto-polygon` | decorative | beside "BNB" / "USDT" ticker text |
| `logo-azza-mark` | decorative | beside the "Azza" text in the FAQ answer label |
| `bolt-outline` | decorative | pure decoration |
| `social-x`, `social-instagram`, `social-whatsapp` | decorative | Help & Support pairs each with a visible name |
| **[r2]** `wallet`, `money-bag`, `briefcase` | **decorative** | each sits beside its own visible dropdown label — "Crypto Wallet" (`94:854`), "Cross-Border Payments" (`94:859`), "Azza Business" (`94:864`) — plus a description line. The link text carries the meaning; a second label would double-announce every dropdown row |
| **[r2]** `social-youtube` | **decorative** | same rule — `63:364` renders the visible text "YouTube" next to it. It becomes **meaningful** only if an implementer builds the dropdown row as an icon-only control, which the design does not |
| **`play-circle`** | **meaningful** | the only control on the testimonial card. Needs `"Play testimonial from {name}"` |
| **`share-x`, `share-tiktok`, `share-instagram`, `link`** | **meaningful** | icon-only share controls with no visible text. Need `"Share on X"`, `"Share on TikTok"`, `"Share on Instagram"`, `"Copy link"` |
| **`logo-azza-wordmark`** | **meaningful** | wraps the home link. Needs `"Azza — home"` |

`prefers-reduced-motion`: the icons carry no motion of their own. Any hover/press transition an implementer
adds must be wrapped per the motion contract in `design/components.md`.

### Delivery

The run ships **inline SVG via a typed glyph module** (`src/components/ui/Icon/glyphs.tsx`), transcribed
verbatim from the SVG files — chosen over SVGR because the project builds with webpack for `next build` and
turbopack for `next dev` (components.md §4.5, D-027). `currentColor` inheritance does not work through
`<img src>`, which would break the entire colour model in §5. The id-namespacing in §6 was done specifically
to make inlining safe.

**[r2]** The four new glyphs are trivial to transcribe: each is one `<path>` with `fill-rule`, `clip-rule`,
`d` and `fill="currentColor"`, no `<g>`, no `<defs>`, no ids. Camel-case the three hyphenated attributes
(`fillRule`, `clipRule`) and copy `d` byte-for-byte. §12.3 gives the exact `viewBox` for each.

---

## 8. Excluded — vector nodes that are not icons

These were examined and deliberately **not** exported here. Each is either decoration or belongs to
`imagery-asset-expert`. Nothing in this list was exported into `design/icons/`.

| Node(s) | What it is | Why excluded |
|---|---|---|
| `412:875`, `412:792`, `412:799`, `412:836`, `412:865` + their `Subtract` boolean ops (`412:877`, `412:880`, `412:801`, `412:804`, `412:838`, `412:867`, `412:870`) | organic blob shapes behind the hero headline | illustration — 130–190px, decorative, non-repeating |
| `412:1237`, `412:1244`–`412:1249`, `412:1262`, `412:1269`–`412:1274` | the "use Azza Today" ellipse cluster | illustration |
| `412:2445`–`412:2472` (Vector 2047–2056) | Azza-for-Business hero composition | illustration |
| `412:1156`, `412:1157` (Vector 669/670 Stroke), `412:1218` (Vector 671) | Azza Wrapped frame border and banner ribbon | decorative frame furniture; CSS border/shape |
| `374:489`–`374:655` (Vector 2133–2143, ×33) | the "AZZA BLOG" marquee | inside hidden group `634:246` — not rendered at all |
| `412:1202`, `412:1203` | 130×130 plain green circles | no glyph. Verified by render — a flat disc |
| `412:1251` "AZ ZA" | 238×120 tilted wordmark, near-white on white | decorative typographic element, not an icon |
| `412:846` "Nigeria" | 132×132 flag roundel with depth/shadow treatment | **boundary case** — same subject as `flag-ng.svg`, but a hero-scale object with a 3D edge. Belongs to imagery |
| `412:883`, `412:844`, `412:859`, `412:1220`, `412:1283` "Textures" | rounded-rect texture overlays | imagery |
| `507:729`–`507:757` (USDC / USDT tilted) | card-deck 3D coin renders, 350–427px | imagery. Distinct from `crypto-usdt.svg`, which is the flat 20px chip mark |
| `412:762`, `498:633`, `498:801`, `498:885`, `500:2419`, `412:2695`, `498:717`, `498:759`, `352:3725`, `352:3740` | `Line 1` / `Line 2` / `Line 6` / `Line 7`, 845×0 and 842×0 | zero-height rules — CSS `border-top`, not assets |
| `412:2452` `Star 17` | 241px star in the Business hero | illustration |
| `412:887`/`412:888` etc. "adobe-express-qr-code 2" | QR code | raster image — imagery |
| `570:462`, `458:279`, `553:295`, `507:761` "Currency 1/2" | phone mockups | imagery |
| `500:1773`, `500:1779`, `500:1786`, `500:1792` | 40×40 frames named `right_regular` in the Help hub cards | **empty** — zero children, render as blank grey squares. Nothing to export. See F-2 |
| **[r2]** `507:819`, `507:831`, `507:826`, `507:844`, `507:855`, `507:860` `Ellipse 1` | the plain circular backplates behind each dropdown glyph (36×36 in Products, 24×24 in Socials) | a filled circle, not a glyph. CSS `border-radius` + `background` on the icon slot. `Group 1410085214` is the wrapper, not an asset |
| **[r2]** `412:1159` `Group 1261153009` | a 0×0 degenerate group in the Landing frame | zero extent, renders nothing |

### Boundary cases I claimed, and the reasoning

Three nodes could defensibly have gone to `imagery-asset-expert`. I took them because each is a single-colour
or two-colour glyph at or near icon scale, with no photographic or gradient-illustration content:

- **`map-pin.svg`** (`412:2474`, 85×94) — a flat two-tone pin, repeated 3× across the Business hero. Repetition
  plus flat fills makes it an icon used decoratively, rather than an illustration.
  **[r2] Overturned by the orchestrator** (components.md §11 C-2): the three placements are three *different*
  shapes, so the repetition premise was wrong. It ships through `Media`. The file stays on disk; the name is
  not in the union.
- **`bolt-outline.svg`** (`412:1200`, 43×75) — a single-path outlined bolt in the "AZZA WRAPPED" lockup.
  One colour, icon-scale, clean geometry.
- **`logo-azza-wordmark.svg` / `logo-azza-mark.svg`** — logos sit on the icon/imagery line by convention. I took
  them because they are flat two-colour vectors that implementers need in the nav and footer of every one of the
  8 frames, and blocking on the imagery agent for them would stall wave 2B.

---

## 9. Census reconciliation

Acceptance criterion 8 asks the export count to be reconciled against the plan's census of **80 vectors,
8 boolean-operation nodes, 4 instances**.

**That census is wrong, and materially so.** It was produced by `get_metadata`, which stops descending below a
depth threshold and silently elides the contents of leaf icon frames — exactly the nodes this agent needs. A
full `findAllWithCriteria` traversal of section `672:246` via the Plugin API returns:

| Type | Visible | Hidden | Total |
|---|---|---|---|
| `VECTOR` | 238 | 47 | **285** |
| `BOOLEAN_OPERATION` | 24 | 1 | **25** |
| `LINE` | 2 | 0 | **2** |
| `STAR` | 1 | 0 | **1** |
| `INSTANCE` | 5 | 0 | **5** |
| | | | **318** |

The plan undercounted vectors by 3.6× and boolean ops by 3.1×. The instance count is the one figure that
holds — and it is 5, not 4: four `Crypto Currency Icons` **plus** `511:364`, the card-deck `Section` instance
(the card deck's own, owned by `impl-card-deck`).

### Where all 318 nodes go

| Bucket | Count | Disposition |
|---|---|---|
| Geometry inside an icon frame | **187** | → 22 of the exported files |
| Visible decoration (blobs, hero shapes, coin renders, star, borders) | 71 | → excluded, §8. Imagery's or nobody's |
| Hidden decoration (the `634:246` blog marquee, hidden hero blob copies) | 48 | → excluded, never rendered |
| Zero-height rules (`Line 1/2/6/7`) | 12 | → excluded, CSS borders |
| | **318** | |

187 glyph-geometry nodes collapse to **22 files** because of duplication: `chevron-down` alone accounts for 21
placements and `logo-azza-wordmark` for 16, and each multi-path glyph contributes several vectors. The
compression ratio (187 → 22, 8.5:1) is the concrete measure of how much repetition the design carries.

Distinct icon-frame names found: **18**. That maps to 22 files because `Crypto Currency Icons` (1 name)
supplies 3 different coin glyphs, `right_regular` (1 name) covers both a real chevron and 4 empty
placeholders, and `share-x` / `bolt-outline` come from unnamed `Vector` nodes with no icon-frame wrapper.

**[r2] This whole section is scoped to `672:246` and is correct only for that scope.** It counts nothing in
`94:850` or `63:350`. That is precisely the defect §13 diagnoses. The r2 sweep adds 4 files and 4 geometry
nodes from outside the section, bringing the set to **26 files from 22 distinct icon-frame names**.

---

## 10. Findings

Reported, not silently corrected. Each is a design-integrity issue an implementer would otherwise reproduce.

**F-1 — The Ghana currency chip shows the Nigerian flag.**
`412:1886` in the Cross-Border exchange widget (`412:1885`, labelled **GHS**) is a placement of
`Flag_of_Nigeria (1)` — the identical node used for the NGN chip at `412:1872`. There is no Ghana flag anywhere
in the file. An implementer building the widget from the design will ship Nigeria's flag next to "GHS".
*Needs a `flag-gh` asset that does not exist in Figma. Also affects the "NGN to ZAR / GHS / KES" copy on the
landing page, which implies at least 4 flags where the file has 1.*

**F-2 — The four Help & Support hub card icons are empty.**
`500:1773`, `500:1779`, `500:1786`, `500:1792` are 40×40 frames with **zero children**. They render as blank
grey squares. They are also misnamed `right_regular`, which is the chevron's name — as are their four 420×188
parent card frames (`500:1771`, `500:1777`, `500:1784`, `500:1790`). Nothing was exported for them.
*Settled as D-023: the card's `icon` prop is optional and the slot renders empty. Confirmed still empty by the
r2 sweep — the four frames have zero geometry.*

**F-3 — `link.svg` renders ~1.5× too heavy.**
`tabler:link` is authored at `stroke-width="2"` on a 24 grid. In this file the path coordinates were scaled to
a 16 grid but `stroke-width` was left at 2 — so the effective weight is 3 at 24-scale. It is the only stroked
icon in the set and it sits in a row with three filled 24px icons, where it reads noticeably heavier. Visible
in the contact-sheet render.
*Fix by setting `stroke-width="1.333"`, or by taking the icon from the Tabler package (§1).*

**F-4 — The Azza Wrapped carousel has two identical "next" arrows.**
`412:1228` (`Frame 29`, previous) and `412:1231` (`Frame 30`, next) are both `arrow_right_regular` at 24×24 with
`rotation: 0` and no flip — verified against `relativeTransform`. The previous control points the wrong way.
*Render the previous control with a 180° rotation (`Icon`'s `rotate` prop exists for this), or add a
`chevron-left`/`arrow-left` glyph.*

**F-5 — Twelve icon sizes where there should be five.**
`9.6 / 16 / 17.4 / 17.5 / 18 / 19.2 / 20 / 22 / 24 / 32 / 40 / 140.1`. Five are non-integer, from proportional
scaling inside scaled groups. The same `down_regular` glyph appears at 18, 20 and 22 in three different
contexts. See §4 for the snap table. *r2 adds no thirteenth size.*

**F-6 — Four unrelated greys for comparable glyphs.**
`#353535` (nav chevron), `#4A4A4A` (sidebar chevron), `#787878` (search), `#DCDBDB` (play). None is
variable-backed — consistent with the plan's finding that only 3 Figma variables exist. Neutralised by
`currentColor`, but `color-token-expert` should know these four values exist as icon-ink candidates.
*See F-11: r2 found a fifth.*

**F-7 — The design has no icon component and no icon page.**
22 distinct icon-frame names, zero of them a Figma component; only `Crypto Currency Icons` is an instance. The
same chevron is 21 independent copies. There is no icon library page in the file. This is why the same glyph
drifted to three sizes and why F-1 and F-4 (wrong-asset reuse) happened at all. **[r2]** it is also the root
cause of F-11 (one glyph, two inks) and of the r1 miss itself: with no component and no library page, there is
no structure in the file that would have led a container-scoped traversal to the dropdown glyphs.

**F-8 — Coverage gaps that will bite in Phase 2.**
The design contains no `close`/`X`, `menu`/`hamburger`, `chevron-left`, `chevron-up`, `check`, `external-link`,
`copy`, or `alert` glyph. The nav dropdowns, the FAQ accordion, the carousel, and any mobile menu
(`responsive-expert`'s territory — there are no mobile frames) all need at least one of these. Nineteen
implementers inventing them independently is the drift risk. **[r2] Re-verified against the full page after
the sweep: still true. None of these eight glyphs exists anywhere in the reference graph.** The Products and
Socials dropdown panels do not contain a close control either — they are hover/click-away surfaces with no
dismiss affordance drawn.

**F-9 — No social icons in the footer.**
`social-x`, `social-instagram` and `social-whatsapp` appear exactly once each, in the Help & Support community
row. The footer of all 8 frames has text links only. If the footer is meant to carry social icons, they are
not in the design. **[r2] amended and sharpened — see F-12: there are three different social sets in this
design, and the footer belongs to none of them.**

---

### [r2] New findings

**F-10 — The Products dropdown assigns a Yen (¥) money bag to an Africa cross-border product.**
`507:835` (`wallet_2_regular`, Fluent) is the glyph beside "Cross-Border Payments" / "Make payments across
borders." (`94:859`, `94:860`) in the Products dropdown `94:850`. Rendered at 14× it is unambiguously a
drawstring money bag carrying a **¥** — the Yen/Yuan sign. The product is NGN→ZAR/GHS/KES remittance. Nothing
in the design corroborates a Yen corridor.
*This is almost certainly the designer taking the first "money" glyph in the Fluent picker without noticing the
currency mark. The file has been exported verbatim as `money-bag.svg` because that is what the design shows and
fabricating a ₦/generic variant is exactly the kind of silent substitution that never gets caught. If the
orchestrator wants a currency-neutral mark, `money_regular` or `wallet_credit_card_regular` from the same
Fluent set are the drop-in replacements — that is a design decision, not mine.*

**F-11 — One glyph, two inks, in two adjacent nav surfaces.**
`social_x_regular` is filled `#353535` at `519:540` (Help & Support community row) and `#10161F` at `519:543`
(Socials dropdown). Same Fluent glyph, same design, two greys, neither variable-backed. `instagram_regular`
is `#353535` in both places, so the drift is confined to the X mark.
*Harmless here because both are `currentColor` in the exported files, but it is a fifth grey on top of F-6's
four, and it is the kind of thing that survives into hand-written CSS.*

**F-12 — Three different social sets, and the footer has a fourth (empty) one.**
The design carries three mutually inconsistent social line-ups, none of which is the site's canonical set:

| Surface | Node | Set |
|---|---|---|
| Socials dropdown (top nav) | `63:350` | X (`519:543`) · Instagram (`507:869`) · **YouTube** (`507:864`) |
| Help & Support community row | `498:209` | X (`519:540`) · Instagram (`518:530`) · **WhatsApp** (`521:578`) |
| Blog article share row | `352:3694` | X-tile (`352:3695`) · Instagram-brand (`352:3696`) · **TikTok** (`352:3701`) · copy-link (`352:3704`) |
| Footer, all 8 frames | — | text links only, no icons (F-9) |

Five distinct platforms across three surfaces, no two surfaces agreeing, and the surface that would normally
own the canonical set — the footer — has none. **`share-tiktok.svg` is therefore NOT surplus**: it is
referenced twice, at `352:3701` and `352:3735`, in the Blog Article share row. The spec asked whether TikTok is
referenced elsewhere before concluding it is redundant; it is, and the file stays exactly where it is.
*An implementer building a shared `SocialLinks` component from any one surface will contradict the other two.
This needs an operator decision on the canonical set, not an agent's guess.*

**F-13 — The nav dropdown panels are not wired to anything.**
`94:850` and `63:350` are loose top-level frames on page `1:3` at (6538, 23773) and (6957, 23773) — a metre of
canvas away from the `FOR BUILD` section at (7512, 23875). A full transitive walk of every `reactions[]`
destination and every `INSTANCE → mainComponent` edge starting from the 8 build frames reaches **six** external
nodes (§12.1) and **neither dropdown is among them**. Nothing in the prototype graph, the component graph, or
the section hierarchy connects a nav item to its dropdown.
*They are unmistakably the nav dropdowns — the Products panel's three rows name the three product pages that
exist as build frames, and the Socials panel's three rows are platform names — but that is inferred from
content, not asserted by the file. This is the mechanical reason r1 missed them (§13) and it is a real design-
file defect: any traversal-based tool, human or agent, will miss them the same way.*

---

## 11. Open questions

Answers route through the orchestrator. Assumption taken in each case, so nothing is blocked.

1. **Install the icon libraries, or ship the files?** (§1) — **Answered: ship the files** (D-027). Implementers
   consume a local typed glyph module. Closed.
2. **What should the four empty Help hub icons be?** (F-2) — **Answered: render nothing** (D-023). The `icon`
   prop is optional and the slot reserves its space. Closed.
3. **Is a Ghana flag needed, and how many others?** (F-1) — *Assumed:* the widget ships with `flag-ng` only and
   the GHS chip is flagged for the operator. Do not invent a flag; a hand-drawn national flag is exactly the
   kind of fabrication that will not be caught. Still open.
4. **Does `imagery-asset-expert` also own the 132px Nigeria roundel `412:846`?** (§8) — *Assumed:* yes, it is
   theirs. I did not export it, so there is no duplicate either way.
5. **Snap 18 → 20 for the nav chevron?** (§4) — *Assumed:* yes, snap. `visual-qa` at 1440 is the arbiter; if it
   scores a regression, revert to 18 and record the exception.
6. **[r2] Is the ¥ on `money-bag` intended?** (F-10) — *Assumed:* no, but exported verbatim anyway. The design
   is the authority for what to ship; changing a currency symbol is a product decision. Reversal is one file.
7. **[r2] Which social set is canonical?** (F-12) — *Assumed:* each surface renders exactly the set the design
   draws for it, and no shared `SocialLinks` component is built across surfaces. This is the conservative
   choice: it reproduces the design faithfully and defers the consolidation the operator has to make anyway.
8. **[r2] Should `social-youtube` be re-projected onto a 22 viewBox** to match its `social-*` siblings? —
   *Assumed:* no. Acceptance criterion 3 forbids re-projecting artwork, and rewriting path coordinates by hand
   is fabrication. The size difference is the component's problem, and §7 documents it.

---

## 12. [r2] The sweep, and the reconciliation

### 12.1 How the reference graph was walked

The r1 traversal was scoped to the container `672:246`. r2 is scoped to the **reference graph**, seeded from
the 8 build frames and closed transitively over two edge types:

- `reactions[].action.destinationId` — every prototype navigate / change-to on every node in every seed subtree
- `INSTANCE → getMainComponentAsync()` — every instance's main component, wherever it lives

The closure visited 14 nodes and produced 11 edges. Six nodes lie outside `672:246`:

| Reached node | Name | Reached via | Already covered by |
|---|---|---|---|
| `507:496` | `Property 1=Operate Locally` | `511:364` CHANGE_TO | card-deck imagery (not icons) |
| `507:497` | `Property 1=Move Money` | `507:496` CHANGE_TO | card-deck imagery |
| `507:684` | `Property 1=Variant4` | `511:364` instance | card-deck imagery |
| `395:587` | `Property 1=Binance Coin` | `412:1191`, `412:1195` instance | `crypto-bnb.svg` |
| `303:2597` | `Property 1=Tether` | `412:1656` instance | `crypto-usdt.svg` |
| `303:1604` | `Property 1=Polygon` | `412:1657` instance | `crypto-polygon.svg` |

**Neither dropdown is reachable this way** (F-13). They were added to the sweep scope on the orchestrator's
confirmation and then verified by content: `94:850`'s three rows are `Crypto Wallet` (`94:854`),
`Cross-Border Payments` (`94:859`), `Azza Business` (`94:864`) — the three Products build frames; `63:350`'s
three rows are `X (Twitter)` (`63:346`), `Instagram` (`63:359`), `YouTube` (`63:364`).

A name-and-geometry census was then run over all 16 scoped roots (8 build frames + 6 reached components +
2 dropdowns), matching every `FRAME`/`GROUP`/`INSTANCE`/`COMPONENT` whose name carries a library marker
(`_regular`, `_filled`, `_solid`, `tabler:`, `skill-icons:`, `streamline`, `Crypto Currency Icons`,
`Flag_of_`, `Location`, `Group 33`, `Frame 1618869178`) **plus** every ≤48px leaf container holding geometry
and no text. That returned **35 distinct names**, reduced below.

### 12.2 The reconciliation table

**A. Referenced and present** — the design points at it, a file already exists. 21 entries, unchanged.

| Figma layer | Node ids (canonical first) | File | Status |
|---|---|---|---|
| `arrow_right_regular` | 412:1290 +4 | `arrow-right.svg` | ✓ |
| `lightning_regular` | 412:1896, 412:1678 | `bolt.svg` | ✓ |
| unnamed `Vector` | 412:1200 | `bolt-outline.svg` | ✓ |
| `down_regular` | 412:2079 +20 | `chevron-down.svg` | ✓ |
| `right_regular` (real) | 500:1749, 500:1753, 500:2322 | `chevron-right.svg` | ✓ |
| `tabler:link` | 352:3738, 352:3704 | `link.svg` | ✓ |
| `play_circle_filled` | 412:1071 +2 | `play-circle.svg` | ✓ |
| `bill_regular` | 412:1902 | `receipt.svg` | ✓ |
| `search_regular` | 500:1741 +2 | `search.svg` | ✓ |
| `streamline-flex:tiktok-solid` | 352:3701, 352:3735 | `share-tiktok.svg` | ✓ **referenced — not surplus** |
| unnamed `Vector` (X tile) | 352:3695, 352:3729 | `share-x.svg` | ✓ |
| `skill-icons:instagram` | 352:3696, 352:3730 | `share-instagram.svg` | ✓ |
| `instagram_regular` | 518:530 **+ 507:869 (16px)** | `social-instagram.svg` | ✓ **+1 placement found** |
| `whatsapp_regular` | 521:578 | `social-whatsapp.svg` | ✓ |
| `social_x_regular` | 519:540 **+ 519:543 (16px)** | `social-x.svg` | ✓ **+1 placement found** |
| `Crypto Currency Icons` → `Binance Coin/color` | 412:1195, 412:1191 | `crypto-bnb.svg` | ✓ |
| `Crypto Currency Icons` → `Tether/color` | 412:1656 | `crypto-usdt.svg` | ✓ |
| `Crypto Currency Icons` → `Polygon/color` | 412:1657 | `crypto-polygon.svg` | ✓ |
| `Flag_of_Nigeria (1)` | 412:1667, 412:1871, 412:1885 | `flag-ng.svg` | ✓ |
| `Frame 1618869178` | 412:1576 +3 | `logo-azza-mark.svg` | ✓ |
| `Group 33` | 498:604 +15 | `logo-azza-wordmark.svg` | ✓ |

**B. Referenced and missing** — the design points at it, no file existed. **4 entries. All now closed.**

| Figma layer | Node id | Parent | Used by | New file | Status |
|---|---|---|---|---|---|
| `wallet_4_regular` | `507:820` | `94:850` Products dropdown | "Crypto Wallet" (`94:854`) | `wallet.svg` | **added** |
| `wallet_2_regular` | `507:835` | `94:850` Products dropdown | "Cross-Border Payments" (`94:859`) | `money-bag.svg` | **added** |
| `suitcase_regular` | `507:840` | `94:850` Products dropdown | "Azza Business" (`94:864`) | `briefcase.svg` | **added** |
| `youtube_regular` | `507:864` | `63:350` Socials dropdown | "YouTube" (`63:364`) | `social-youtube.svg` | **added** |

**C. Present and unreferenced** — a file exists, the reference graph does not point at it. **1 entry.**

| File | Why it exists | Verdict |
|---|---|---|
| `map-pin.svg` | exported in r1 from `412:2474` `Location` | **Referenced in Figma, but not as an icon.** `Location` appears 18 times across `412:2412` (Business) and `507:496`, but components.md §11 C-2 measured the three Business placements at 84.62×93.57 / 87.72×92.43 / 75.35×93.77 — three different shapes. Adjudicated to `Media` as illustration. File retained on disk (this spec forbids deletion), name excluded from `IconName`. |

**Everything else in the set is in category A. There is no second gap.**

**Explicitly checked and found NOT missing** — names the census returned that resolve to something already
handled, listed so the negative result is auditable:

| Census name | Resolution |
|---|---|
| `Group 1410085214` (×9) | circle backplate + glyph wrapper in Help and both dropdowns — §8, not an asset |
| `Ellipse 1` (×6) | the backplate circle itself — CSS |
| `Frame 1321314566` (×3), `Frame 1321314660` (×2) | wrappers around `Flag_of_Nigeria` and `tabler:link` |
| `Group 1410085192/3/4` | wrappers around the crypto chip, `lightning_regular`, `bill_regular` |
| `AZ ZA` (×4, 16.9×17.54), `Group 34` (×4) | sub-parts *inside* `logo-azza-mark` (`Frame 1618869178`) |
| `right_regular` @ 40×40 (`500:1773`, `500:1779`, `500:1786`, `500:1792`) | the four empty Help-hub frames — F-2, zero children, nothing to export |
| `right_regular` @ 420×188 (`500:1771` +3) | misnamed *card* frames, not icons — F-2 |
| `Location` (×18) | `map-pin`, adjudicated to `Media` — category C |
| `Polygon 15`, `Union`, `Subtract`, `Ellipse 661`, `Ellipse 527`, `Vector`, `Rectangle 554`, `c`, `Group` | hero blobs, the Business composition and card-deck internals — §8 illustration |
| `Group 1261153009` (0×0) | degenerate, renders nothing |

### 12.3 What the orchestrator must register — exact strings

Append these four to `IconName` in `src/components/ui/Icon/types.ts`, and add four `GLYPHS` entries in
`src/components/ui/Icon/glyphs.tsx`. **Append only — do not reorder or rename the existing 21.**

| `IconName` | File | `viewBox` (verbatim) | Paths | Colour | Default a11y | Default size |
|---|---|---|---|---|---|---|
| `"wallet"` | `design/icons/wallet.svg` | `0 0 24 24` | 1 | `currentColor` | decorative | `md` (24) |
| `"money-bag"` | `design/icons/money-bag.svg` | `0 0 24 24` | 1 | `currentColor` | decorative | `md` (24) |
| `"briefcase"` | `design/icons/briefcase.svg` | `0 0 24 24` | 1 | `currentColor` | decorative | `md` (24) |
| `"social-youtube"` | `design/icons/social-youtube.svg` | `0 0 16 16` | 1 | `currentColor` | decorative | `xs` (16) |

Every one has the identical shape in `glyphs.tsx`:

```tsx
"<name>": {
  viewBox: "<from the table above>",
  body: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="<copy byte-for-byte from the .svg>"
      fill="currentColor"
    />
  ),
},
```

No `<g>`, no `<defs>`, no `clipPath`, no ids to namespace, no second path, no gradient. The transcription is
purely mechanical.

**Naming rationale**, since the layer names are not usable as-is:

- `wallet_4_regular` → **`wallet`** — the glyph is a billfold with a card and a clasp dot. `_4` is a Fluent
  variant index, meaningless outside the library. Kebab-case by meaning, per §2.
- `wallet_2_regular` → **`money-bag`** — it is *not* a wallet. It is a drawstring pouch with a currency mark
  (F-10). Naming it `wallet-2` or `wallet-alt` would guarantee a wrong pick by the next implementer who reads
  only the name.
- `suitcase_regular` → **`briefcase`** — the render is a three-compartment briefcase with a handle, not a
  travel suitcase. Named for what it depicts and for the "Azza Business" meaning it carries.
- `youtube_regular` → **`social-youtube`** — takes the established `social-*` prefix used by the three
  outline platform marks (`social-x`, `social-instagram`, `social-whatsapp`), as distinct from the `share-*`
  prefix used by the blog share row's filled/brand marks.

### 12.4 Non-destruction and fidelity, verified

| Check | Method | Result |
|---|---|---|
| No existing `.svg` modified | SHA-256 of all 22 baseline files, captured before any write and recomputed after | **0 modified** |
| No existing `.svg` deleted or renamed | set difference over filenames | **0 deleted**, 4 added |
| New path data is verbatim Figma | length + FNV-1a of each `d`, computed independently in the Figma plugin runtime and over the written file | **4/4 exact match** — `wallet` 1259/`01d617b7`, `money-bag` 3520/`7bcb9d9d`, `briefcase` 1085/`74e2c039`, `social-youtube` 1966/`54f4373d` |
| `viewBox` preserved verbatim | compared against the export | **4/4** — `0 0 24 24` ×3, `0 0 16 16` ×1 |
| Single-colour → `currentColor` | regex over each written file | **4/4** — 1 `currentColor`, **0** hex literals each |
| No `width`/`height` on root | regex | **4/4 absent** |
| Well-formed XML | `xml.etree` parse of all 26 files | **26/26 pass** |
| Renders correctly | headless Chromium at 88px, `color:#3430E9`, compared against a 14× Figma render of each source node | **4/4 match** |

---

## 13. [r2] Why r1 missed these

Not a lookup failure, a **scoping** one, and worth stating plainly so it is not repeated.

r1 enumerated icons by walking the container `672:246` "FOR BUILD" — a defensible choice: the section is
named for the build, contains all 8 target frames, and a `findAllWithCriteria` over it returns 318 nodes,
which feels exhaustive. It is exhaustive *of the section*. It is not exhaustive of what the design references.

Page `1:3` has **96 top-level children**. `672:246` is one of them. The two nav dropdown panels are two others,
parked ~1000px west of the section with no prototype link, no component relationship and no containment
edge to anything inside it (F-13). No traversal rooted at the section can reach them. The r1 census in §9 is
internally consistent and still correct — it simply answers a narrower question than the one that mattered.

**What r2 changed methodologically:** the seed is still the 8 build frames, but the closure is over the
*reference* graph (prototype destinations + instance→main-component, transitively) rather than the containment
tree, and the result is cross-checked against a name-and-geometry census of every scoped root. The reference
closure alone still would not have found the dropdowns — nothing points at them — which is why F-13 is filed
as a design-file defect rather than a methodology note. What finds them is the census over the whole page plus
content-matching the row labels to the build frames.

**The generalisable lesson:** in a design file with no component library and no prototype wiring (F-7, F-13),
containment and reference are both incomplete indexes. The only complete index is the page, filtered by
content. The census in §12.2 is that filter, and it is what licenses the claim that category B is now empty.
