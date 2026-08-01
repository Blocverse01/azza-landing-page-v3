# Icons — AZZA Website

**Owner:** `iconography-expert` (Phase 1, wave 1A)
**Source:** Figma `OXDVihY7WvtPZ6uGuVFx5Y`, section `672:246` "FOR BUILD" (8 frames) + component set `507:498`
**Artifacts:** 22 SVG files in `design/icons/`

Every file here was exported from the real Figma node through the MCP and written to disk. Nothing was
hand-drawn, redrawn, or traced from a screenshot. No file references a remote URL.

---

## 1. Read this first — the icons are not custom

The single most consequential finding of this extraction: **AZZA has no bespoke icon set.** Eighteen of the
twenty-two exported files come from four public icon libraries, and the Figma layer names still carry the
library prefixes that prove it.

| Library | Evidence in the file | Glyphs used |
|---|---|---|
| **Fluent UI System Icons** (Microsoft, MIT) | layer names end `_regular` — `down_regular`, `right_regular`, `arrow_right_regular`, `search_regular`, `lightning_regular`, `bill_regular`, `social_x_regular`, `instagram_regular`, `whatsapp_regular` | 9 |
| **Material Symbols** (Google, Apache-2.0) | `play_circle_filled` — Material's exact glyph id | 1 |
| **Iconify sets** | `tabler:link` (Tabler, MIT), `streamline-flex:tiktok-solid` (Streamline), `skill-icons:instagram` | 3 |
| **Crypto Currency Icons** (Figma community lib) | instance name `Crypto Currency Icons`, variants `Binance Coin/color`, `Tether/color`, `Polygon/color` | 3 |
| **Custom / brand** | Azza wordmark, Azza app mark, the Azza-Wrapped bolt, the map pin, the Nigeria flag roundel | 5 (+1 flag) |

### The recommendation

**Install `@fluentui/react-icons` (or Iconify) for the 13 library glyphs; ship only the 5 brand files and the
3 crypto files from `design/icons/`.** Reasons, in order of weight:

1. **Correctness.** The Figma copies are frozen snapshots of a library that gets fixed upstream. The `link`
   icon in this design already renders at the wrong stroke weight (finding F-3) — a bug the designer
   introduced by scaling, which the library version does not have.
2. **Coverage.** The design uses one chevron and one arrow. A real site needs `chevron-left`, `chevron-up`,
   `close`, `menu`, `external-link`, `check`, `alert` — none of which exist in this Figma file. Nineteen
   implementers will otherwise each invent one. With the library installed, they take the matching Fluent
   glyph and stay visually consistent for free.
3. **Weight.** Tree-shaken library imports beat 22 hand-managed files.

The exported SVGs in `design/icons/` remain the **authority for what the design actually shows** and the
fallback if the orchestrator prefers zero new dependencies. Both paths are viable; §7 gives the component
contract for either.

> **Decision needed from the orchestrator.** Recorded in `open_questions[]`. My assumption for the rest of
> this document: implementers consume `design/icons/` directly via a local `<Icon>` component. Everything in
> §6–§8 holds unchanged if the library route is taken — only the `name` → glyph resolution changes.

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
| `chevron-down.svg` | chevron-down | `down_regular` | **412:2079**, +20 more (see §3) | 18×18 | 18, 20, 22 | all 8 |
| `chevron-right.svg` | chevron-right | `right_regular` | **500:1749**, 500:1753, 500:2322 | 20×20 | 20 | Help, Help-Opened |
| `link.svg` | copy link | `tabler:link` | **352:3738**, 352:3704 | 16×16 | 16 | Blog Article |
| `play-circle.svg` | play | `play_circle_filled` | **412:1071**, 412:1079, 412:1087 | 32×32 | 32 | Landing |
| `receipt.svg` | fees / receipt | `bill_regular` | **412:1902** | 20×20 | 20 | Cross-Border |
| `search.svg` | search | `search_regular` | **500:1741**, 500:2204, 500:2310 | 20×20 | 20 | Help, Help-Opened, Blog |
| `share-tiktok.svg` | TikTok | `streamline-flex:tiktok-solid` | **352:3701**, 352:3735 | 24×24 | 24 | Blog Article |
| `share-x.svg` | X (filled tile) | unnamed `Vector` | **352:3695**, 352:3729 | 24×24 | 24 | Blog Article |
| `social-instagram.svg` | Instagram (outline) | `instagram_regular` | **518:530** | 22×22 | 22 | Help |
| `social-whatsapp.svg` | WhatsApp | `whatsapp_regular` | **521:578** | 22×22 | 22 | Help |
| `social-x.svg` | X (outline) | `social_x_regular` | **519:540** | 22×22 | 22 | Help |

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

### Full duplicate-placement lists

`chevron-down.svg` (21 placements): 412:2079, 412:2083, 412:1659, 412:1672, 412:1844, 412:1848, 412:1876,
412:1890, 412:2622, 412:2626, 412:2792, 412:2796, 412:2816, 412:2820, 498:223, 498:227, 500:2295, 500:2299,
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

**Fill vs stroke.** 21 of 22 icons are **filled paths with no stroke**. Exactly one — `link.svg` — is a
stroked icon (`stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`). See finding F-3: its
weight is wrong and it will look heavier than everything beside it.

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

The 18px and 22px chevrons are **byte-for-byte the same glyph, uniformly scaled** — identical padding
percentages. That is the proof behind the dedupe: one file serves all three placed sizes.

`chevron-right` is `chevron-down` with the insets transposed, i.e. the same glyph rotated 90°. Both files
ship because both exist in the design, but an implementer may render one and rotate it.

---

## 4. Sizing

### Observed sizes, all 12 of them

`9.6 · 16 · 17.4 · 17.5 · 18 · 19.2 · 20 · 22 · 24 · 32 · 40 · 140.1`

Twelve distinct sizes for eighteen glyphs is drift, not a scale. Five of those values (9.6, 17.4, 17.5, 19.2,
140.1) are not integers — they are artefacts of proportional scaling inside a scaled group, not decisions.

### The scale to build against

| Token | px | Use |
|---|---|---|
| `xs` | 16 | inline with small text; icon inside a larger hit target |
| `sm` | 20 | inline with body text (form fields, list rows, sidebar links, chips) |
| `md` | **24** | **default.** Buttons, share rows, currency-flag chips |
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
| 9.6 (Polygon badge) | leave | a badge overlay on the USDT chip, ~48% of its host — not an icon slot |
| 140.1 (BNB) | leave | a hero-scale decoration in Azza Wrapped |

**Recommendation:** snap 17.4/17.5/18/19.2/22 to `sm` (20). This changes the nav chevron by 2px and the chip
chevron by 2px — visually negligible, and it collapses five sizes into one. If `visual-qa` scores this as a
regression against the Figma export, revert the nav chevron to 18 and record it as an exception.

---

## 5. Colour

**The rule: single-colour icons inherit `currentColor`; multi-colour icons keep their fills.**

All 14 single-colour icons have had their hard-coded hex fills replaced with `currentColor`. The colours they
were exported with are recorded below purely so `color-token-expert`'s tokens can be cross-checked — an
implementer should never re-hardcode them.

| Icon | Exported as | Reads as |
|---|---|---|
| `arrow-right`, `bolt`, `receipt` | `#3430E9` | brand blue, on-light |
| `chevron-down`, `social-x`, `social-instagram`, `social-whatsapp` | `#353535` | body ink |
| `chevron-right` | `#4A4A4A` | secondary ink |
| `search` | `#787878` | placeholder / muted ink |
| `play-circle` | `#DCDBDB` | light-on-image overlay |
| `share-x`, `share-tiktok` | `#1E1E1E` | strong ink |
| `bolt-outline` | `#D3FEB6` | the `Green` Figma variable |
| `link` | stroke, no fill | inherits |

**Note the inconsistency:** four different greys (`#353535`, `#4A4A4A`, `#787878`, `#DCDBDB`) for glyphs doing
comparable jobs, none of them variable-backed. Because they now inherit `currentColor`, this resolves itself
the moment the icons sit inside correctly-tokenised text — which is the main practical argument for
`currentColor` here, beyond theming.

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

Deliberately kept:

- **Clip paths that do work.** `flag-ng.svg` keeps two nested `clipPath`s — the outer one is the circular crop,
  the inner one bounds the flag. Removing them turns the roundel into a square.
- **The `#50AF95` backing rect in `flag-ng.svg`**, fully covered by the flag. It is dead paint, but it is also
  the source geometry for the circular clip; leaving it is 40 bytes and zero risk.
- **Fractional path coordinates.** No rounding was applied. Aggressive coordinate rounding at these viewBox
  scales (10×10 for the Polygon badge) visibly shifts shapes.
- **`fill-rule="evenodd"`** wherever present — it is what knocks the triangle out of `play-circle` and the note
  out of `share-tiktok`.

Nothing was flattened from stroke to path; `link.svg` is still a stroked icon.

### Verification

Every one of the 22 files was checked, and passed:

1. **Well-formed** — tag balance verified by parser; all 22 pass.
2. **Has a `viewBox`** — all 22.
3. **No remote URL** — all 22. No `http(s)` reference other than the SVG namespace.
4. **No editor metadata** — no `<metadata>`, `<title>`, `<desc>`, `sodipodi`, `inkscape`.
5. **No dangling or orphaned `url(#…)`** — every reference resolves; every def is referenced.
6. **Renders correctly** — all 22 rendered in headless Chromium at 56px on white with
   `color: #3430E9`, and each was compared against a screenshot of its own Figma node. All match. This is the
   check that matters: a valid SVG that renders wrong is worse than an unoptimised one.

Byte reduction across the set: 68,348 → 35,864 (−48%).

---

## 7. The component contract

An implementer builds this in wave 2A (`impl-primitives`, `src/components/ui/`). **I define it; I do not
build it.**

### Props

```ts
type IconName =
  | 'arrow-right' | 'bolt' | 'bolt-outline' | 'chevron-down' | 'chevron-right'
  | 'link' | 'play-circle' | 'receipt' | 'search'
  | 'share-instagram' | 'share-tiktok' | 'share-x'
  | 'social-instagram' | 'social-whatsapp' | 'social-x'
  | 'crypto-bnb' | 'crypto-polygon' | 'crypto-usdt'
  | 'flag-ng' | 'logo-azza-mark' | 'logo-azza-wordmark' | 'map-pin';

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
}
```

**No `color` prop.** Colour arrives through CSS inheritance: single-colour icons are `fill="currentColor"`,
so they take the colour of their text context. A `color` prop would invite implementers to pass a hex and
defeat gate 6 (zero raw hex in component source). Fixed-fill icons ignore colour entirely — the component
must not attempt to override them.

### Behaviour

- Renders a square box at the chosen size with **both** `width` and `height` set explicitly. Never `auto`.
- Sets `display: inline-block` and `flex-shrink: 0` — icons in a flex row must not compress.
- Sets `vertical-align: middle` for inline-with-text placements.
- Passes the size through to the `<svg>`; the `viewBox` in the file does the rest. Non-square icons
  (`logo-azza-wordmark` 95×32, `map-pin` 85×94, `bolt-outline` 43×75) must honour their aspect ratio — the
  component should set height from the size step and let width follow, or accept an explicit `width`.

### Accessibility

Two states, decided by whether `title` is passed:

**Decorative — no `title`.** The icon sits beside a visible text label that already carries the meaning.
Render `aria-hidden="true"` and `focusable="false"`. Emit no `<title>`. This is the default and covers most of
the set.

**Meaningful — `title` given.** The icon is the only thing conveying the meaning. Render
`role="img"`, `aria-labelledby` pointing at a `<title>` with a generated unique id, and drop `aria-hidden`.
When the icon is the sole content of a `<button>` or `<a>`, prefer putting `aria-label` on the control and
leaving the icon decorative — one label, not two.

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
| `bolt-outline`, `map-pin` | decorative | pure decoration |
| `social-x`, `social-instagram`, `social-whatsapp` | decorative | Help & Support pairs each with a visible name |
| **`play-circle`** | **meaningful** | the only control on the testimonial card. Needs `"Play testimonial from {name}"` |
| **`share-x`, `share-tiktok`, `share-instagram`, `link`** | **meaningful** | icon-only share controls with no visible text. Need `"Share on X"`, `"Share on TikTok"`, `"Share on Instagram"`, `"Copy link"` |
| **`logo-azza-wordmark`** | **meaningful** | wraps the home link. Needs `"Azza — home"` |

`prefers-reduced-motion`: the icons carry no motion of their own. Any hover/press transition an implementer
adds must be wrapped per the motion contract in `design/components.md`.

### Delivery

Prefer **inline SVG via a build-time import** (SVGR, or Next's `?react` / a `svg` loader) over `<img src>`.
`currentColor` inheritance does not work through `<img>`, which would break the entire colour model in §5.
The id-namespacing in §6 was done specifically to make inlining safe.

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

### Boundary cases I claimed, and the reasoning

Three nodes could defensibly have gone to `imagery-asset-expert`. I took them because each is a single-colour
or two-colour glyph at or near icon scale, with no photographic or gradient-illustration content:

- **`map-pin.svg`** (`412:2474`, 85×94) — a flat two-tone pin, repeated 3× across the Business hero. Repetition
  plus flat fills makes it an icon used decoratively, rather than an illustration.
- **`bolt-outline.svg`** (`412:1200`, 43×75) — a single-path outlined bolt in the "AZZA WRAPPED" lockup.
  One colour, icon-scale, clean geometry.
- **`logo-azza-wordmark.svg` / `logo-azza-mark.svg`** — logos sit on the icon/imagery line by convention. I took
  them because they are flat two-colour vectors that implementers need in the nav and footer of every one of the
  8 frames, and blocking on the imagery agent for them would stall wave 2B.

If `imagery-asset-expert` has also exported any of these, **`design/icons/` is not the duplicate to keep for
`412:846` (the 132px Nigeria roundel)** — that one is theirs. The other three are mine.

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
| Geometry inside an icon frame | **187** | → the 22 exported files |
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
*`impl-help-support` needs four icons that the design does not contain. Recommend Fluent `rocket_regular`,
`apps_regular`, `receipt_regular`, `question_circle_regular` for the four cards, logged as a decision.*

**F-3 — `link.svg` renders ~1.5× too heavy.**
`tabler:link` is authored at `stroke-width="2"` on a 24 grid. In this file the path coordinates were scaled to
a 16 grid but `stroke-width` was left at 2 — so the effective weight is 3 at 24-scale. It is the only stroked
icon in the set and it sits in a row with three filled 24px icons, where it reads noticeably heavier. Visible
in the contact-sheet render.
*Fix by setting `stroke-width="1.333"`, or by taking the icon from the Tabler package (§1).*

**F-4 — The Azza Wrapped carousel has two identical "next" arrows.**
`412:1228` (`Frame 29`, previous) and `412:1231` (`Frame 30`, next) are both `arrow_right_regular` at 24×24 with
`rotation: 0` and no flip — verified against `relativeTransform`. The previous control points the wrong way.
*Render the previous control with a 180° rotation, or add a `chevron-left`/`arrow-left` glyph.*

**F-5 — Twelve icon sizes where there should be five.**
`9.6 / 16 / 17.4 / 17.5 / 18 / 19.2 / 20 / 22 / 24 / 32 / 40 / 140.1`. Five are non-integer, from proportional
scaling inside scaled groups. The same `down_regular` glyph appears at 18, 20 and 22 in three different
contexts. See §4 for the snap table.

**F-6 — Four unrelated greys for comparable glyphs.**
`#353535` (nav chevron), `#4A4A4A` (sidebar chevron), `#787878` (search), `#DCDBDB` (play). None is
variable-backed — consistent with the plan's finding that only 3 Figma variables exist. Neutralised by
`currentColor`, but `color-token-expert` should know these four values exist as icon-ink candidates.

**F-7 — The design has no icon component and no icon page.**
18 distinct icon-frame names, zero of them a Figma component; only `Crypto Currency Icons` is an instance. The
same chevron is 21 independent copies. There is no icon library page in the file. This is why the same glyph
drifted to three sizes and why F-1 and F-4 (wrong-asset reuse) happened at all.

**F-8 — Coverage gaps that will bite in Phase 2.**
The design contains no `close`/`X`, `menu`/`hamburger`, `chevron-left`, `chevron-up`, `check`, `external-link`,
`copy`, or `alert` glyph. The nav dropdowns, the FAQ accordion, the carousel, and any mobile menu
(`responsive-expert`'s territory — there are no mobile frames) all need at least one of these. Nineteen
implementers inventing them independently is the drift risk. Strongest single argument for §1's recommendation.

**F-9 — No social icons in the footer.**
`social-x`, `social-instagram` and `social-whatsapp` appear exactly once each, in the Help & Support community
row. The footer of all 8 frames has text links only. If the footer is meant to carry social icons, they are
not in the design.

---

## 11. Open questions

Answers route through the orchestrator. Assumption taken in each case, so nothing is blocked.

1. **Install the icon libraries, or ship the 22 files?** (§1) — *Assumed:* ship the files; implementers consume
   `design/icons/` through a local `<Icon>`. Reversal is cheap and mechanical: keep the same `IconName` union,
   swap the resolver.
2. **What should the four empty Help hub icons be?** (F-2) — *Assumed:* implementers use the four Fluent glyphs
   named in F-2. Only affects `impl-help-support`.
3. **Is a Ghana flag needed, and how many others?** (F-1) — *Assumed:* the widget ships with `flag-ng` only and
   the GHS chip is flagged for the operator. Do not invent a flag; a hand-drawn national flag is exactly the
   kind of fabrication that will not be caught.
4. **Does `imagery-asset-expert` also own the 132px Nigeria roundel `412:846`?** (§8) — *Assumed:* yes, it is
   theirs. I did not export it, so there is no duplicate either way.
5. **Snap 18 → 20 for the nav chevron?** (§4) — *Assumed:* yes, snap. `visual-qa` at 1440 is the arbiter; if it
   scores a regression, revert to 18 and record the exception.
