# AZZA — Typography Specification

- **Run:** `2026-08-01-azza-website`
- **Figma file:** `OXDVihY7WvtPZ6uGuVFx5Y` — AZZA Website, page `1:3` "Website design"
- **Scope:** section `672:246` "FOR BUILD" (8 frames) + component set `507:498` "Section" (3 variants)
- **Design width:** 1440 px. **This document defines the 1440 scale only.**
- **Author:** `typography-expert`, Phase 1 wave 1A
- **Method:** every value below was read directly off the node via the Figma Plugin API
  (`fontName`, `fontSize`, `lineHeight`, `letterSpacing`, `textCase`, `textDecoration`,
  `getStyledTextSegments`). **Nothing here was measured from a screenshot.**

---

## 0. Read this first — five facts that change how you build

1. **There are zero published text styles in this file.** `getLocalTextStylesAsync()` returns `[]`.
   Every one of the 465 text nodes carries loose, node-level type. The scale in §3 is **derived**, not
   exported. Where I inferred, I say so.
2. **Two of the five font families are missing fonts in the Figma file itself.** Every `Lemon` and
   `Subjectivity` node returns `hasMissingFont: true`. Both are designer-local files. See §2 — this is a
   procurement problem, not a code problem, and it needs an answer before Phase 2 finishes.
3. **Display headlines are set in UPPERCASE via `textCase: UPPER`, not via the characters.** The Figma
   string for the landing hero is literally `Your mONEY`. If you transcribe the characters without
   `text-transform: uppercase` you will ship `Your mONEY`. This affects 39 nodes.
4. **Nine display headlines swap the letter "O" into a second typeface mid-word.** This is the AZZA brand
   device, it is deliberate, it is not automatic, and it is specified exactly in §5. Do not apply it to
   headlines not listed there.
5. **Inter carries 391 of 465 text segments (84%).** `Google Sans Flex` (18 segments) and `Cal Sans`
   (5 segments) are strays confined to four places. Treat Inter as the system and the other two as
   exceptions that need a ruling (§2.3, §2.4).

---

## 1. Census

| Metric | Value |
|---|---|
| Text nodes under `672:246` | 459 |
| Text nodes in component set `507:498` | 6 (2 per variant × 3 variants) |
| **Total in scope** | **465** |
| Distinct type signatures (family/weight/size/leading/tracking/case/decoration) | **69** |
| Published text styles | **0** |
| Typographic Figma variables | **0** |
| Font families | 5 |
| Family/weight pairs in use | 16 |

### Segment share by family

| Family | Segments | Share | Status |
|---|---:|---:|---|
| Inter | 391 | 84.1% | available, Google Fonts |
| Lemon | 33 | 7.1% | **missing font — procurement blocker** |
| Subjectivity | 46 | 9.9% | **missing font — procurement blocker** |
| Google Sans Flex | 18 | 3.9% | **licensing blocker** |
| Cal Sans | 5 | 1.1% | open licence, self-host |

(Segments sum above 465 because 9 nodes contain more than one family.)

---

## 2. Families

### 2.1 `Lemon` — display face (PRIMARY DISPLAY)

- **Family name as authored in Figma:** `Lemon`
- **Weights used:** `Regular` (4 segments), `Semi Bold` (20), `Bold` (9)
- **Character:** ultra-condensed, very heavy grotesque. Flat-sided round forms, near-closed apertures,
  square counters. Always set uppercase. Always set with negative tracking except one node (§6, O-6).
- **Availability:** `listAvailableFontsAsync()` reports `Lemon` with **only a `Regular` style**.
  `Lemon Semi Bold` and `Lemon Bold` do **not** exist in Figma's font service. Every Lemon node is
  flagged `hasMissingFont: true`.
- **This is NOT the Google Fonts family "Lemon".** Google's `Lemon` is a single-weight decorative
  *serif*. The rendered glyphs in this file (verified by node render of `352:3586`, `412:2442`,
  `412:1572`) are an ultra-condensed heavy sans. The name collision is coincidental and it is the reason
  `Lemon Regular` shows as "available" while the other two weights do not.
- **How to obtain:** **must be self-hosted from a licensed file supplied by the designer.**
  Not on Google Fonts. No npm/Fontsource package. `next/font/google` will silently give you the wrong
  face — do not use it.
- **DISPLAY FACE — OPERATOR DIRECTIVE (2026-08-01): use `Bebas Neue`, not `Lemon`.**
  The operator has instructed that `Bebas Neue` replaces `Lemon` as the headline face. This supersedes
  the `Anton` stand-in this document originally proposed. It is a decision, not a stopgap — implementers
  build against Bebas Neue and there is no pending procurement for the display face.

  - Obtainable via `next/font/google` (SIL OFL). No licensing action needed.
  - **Single weight only.** Verified against the Google Fonts CSS API on 2026-08-01: the family serves
    `font-weight: 400` and nothing else. The design uses Lemon at three weights — `Regular` (4 segments),
    `Semi Bold` (20), `Bold` (9) — so **the three-weight display hierarchy collapses to one.**
    Do not fake the missing weights with `font-weight: 600/700` on a 400-only family; browsers will
    synthesise a smeared faux-bold. Differentiate those roles with size and tracking, which §3.1 already
    varies, and leave weight at 400 throughout the display ramp.
  - **Metrics differ from Lemon**, so every display headline will reflow. The §3.1 line-break notes were
    derived from Lemon renders and must be re-checked once the site renders in Bebas Neue.
  - Bebas Neue is an **uppercase-only** face — lowercase codepoints render as capitals. This is
    compatible with the design, which sets every Lemon node uppercase (§0), but it means the
    `textCase: UPPER` trap in §0 is now doubly load-bearing: the *source string* must still be preserved
    verbatim for accessibility and copy/paste, because the visual uppercasing is now happening in the
    font as well as in CSS.
  - Interacts with the O-swap device (§5): Bebas Neue's `O` is a flat-sided rounded rectangle, whereas
    Lemon's was closer to Subjectivity's circular `O`. The swap will read as a stronger contrast than the
    designer intended. Keep the device; flag the visual difference at Phase 3 rather than dropping it.

```css
/* target */
font-family: "Bebas Neue", "Oswald", "Arial Narrow", system-ui, sans-serif;
```

### 2.2 `Subjectivity` — accent / numeric face

- **Family name as authored:** `Subjectivity`
- **Weights used:** `Light` (3), `Medium` (6), `Bold` (12), `Extra Bold` (8), `Super` (17)
- **Character:** geometric sans. Perfectly circular `O` — this is why it was chosen for the O-swap
  device in §5. Used for large numerals, statistics, the footer watermark, and step numbers.
- **Availability:** **absent entirely** from `listAvailableFontsAsync()`. Every Subjectivity node is
  flagged `hasMissingFont: true`.
- **Identification:** the weight name `Super` is distinctive and matches the *Subjectivity* family by
  **Zeune Ink Foundry** (weight ladder Thin → ExtraLight → Light → Regular → Medium → Bold → ExtraBold →
  Super → Black). That family is free for personal use only; commercial web use requires a purchased
  licence.
- **How to obtain:** **self-host from a licensed file.** Not on Google Fonts, not on npm.
  A web licence must be purchased before launch.
- **Interim stand-in:** `Poppins` (Google Fonts, geometric, circular `O`) at 300 / 500 / 700 / 800 / 900
  for Light / Medium / Bold / Extra Bold / Super respectively. The circular `O` is the load-bearing
  property for §5, and Poppins preserves it.

```css
/* target */
font-family: "Subjectivity", "Poppins", "Century Gothic", system-ui, sans-serif;
```

Weight-number mapping for the CSS `font-weight` you must emit:

| Figma style | `font-weight` |
|---|---:|
| Light | 300 |
| Medium | 500 |
| Bold | 700 |
| Extra Bold | 800 |
| Super | 900 |

### 2.3 `Inter` — the text face (SYSTEM DEFAULT)

- **Weights used:** `Regular` (400, 40 segments), `Medium` (500, 274), `Semi Bold` (600, 39), `Bold` (700, 38)
- **Availability:** fully available. **Obtain via `next/font/google`.** Use the variable font.
- **AUTO line height resolves to `1.21`** — confirmed by measurement, not assumption:
  18 px → 22 px, 16 px → 19 px, 14 px → 17 px, 20 px → 24 px, all exactly `round(size × 1.21)`.
  Emit `line-height: 1.21` explicitly rather than `normal`, so the value survives fallback fonts.

```css
font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```

```ts
// src/app/layout.tsx (owned by scaffolder — reference only)
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
```

### 2.4 `Google Sans Flex` — LICENSING BLOCKER, substitute it

- **Weights used:** `Regular` (2), `Medium` (13), `SemiBold` (3)
- **Variable axes observed on every node:** `"GRAD" 0, "ROND" 0, "wdth" 100` — i.e. all axes at default.
  No axis is actually being varied, so nothing is lost by substituting a static face.
- **Availability:** present in Figma's font list, but **Google Sans Flex is Google's proprietary brand
  typeface (Material 3 Expressive / Android). It is not published on Google Fonts and is not licensable
  for third-party web use.** It cannot ship.
- **AUTO line height resolves to `1.25`** (16 → 20, 14 → 18).
- **Ruling — substitute with Inter.** It appears in exactly four places and its role in each is already
  covered by an Inter step. Apply this mapping:

| Figma (Google Sans Flex) | Nodes | Substitute with |
|---|---|---|
| Regular 20 / 28px / 0em | `412:1287`, `412:1293` | Inter Medium 20 / 1.40 / −0.02em (`text-md-hero`) |
| SemiBold 18 / 22px / −0.02em | `412:1074`, `412:1082`, `412:1090` | Inter Semi Bold 18 / 1.22 / −0.02em (`text-base-quote`) |
| Medium 16 / 1.25 / −0.02em | 12 nodes, testimonial attributions | Inter Medium 16 / 1.21 / −0.02em (`text-sm`) |
| Medium 14 / 1.25 / −0.02em | `412:1878` | Inter Medium 14 / 1.21 / −0.02em (`text-xs-tabular`) |

If the operator instead wants a distinct second voice here, **`Google Sans Code`** *is* open source and
available, but it is a monospace-flavoured face and will read differently. Default is Inter.

### 2.5 `Cal Sans` — wordmark accent

- **Weight used:** `Regular` only (5 segments)
- **Role:** the word "Azza" rendered as a wordmark inside the FAQ CTA strip, on 4 frames.
- **Availability:** open source, released by Cal.com. **Not on Google Fonts.** Obtain the `.woff2` from
  the `calcom/font` repository and self-host via `next/font/local`. Commit the file — do not hot-link.
- **AUTO line height measured at ≈ `1.29`.**

```css
font-family: "Cal Sans", "Inter", ui-sans-serif, system-ui, sans-serif;
```

### 2.6 Summary — obtainability

| Family | `next/font/google` | npm / Fontsource | Self-host from licensed file | Blocker? |
|---|:--:|:--:|:--:|---|
| Inter | **yes** | yes | — | no |
| Cal Sans | no | no | **yes** (open licence, `calcom/font`) | no |
| Lemon | no | no | **yes — file required from designer** | **YES — critical** |
| Subjectivity | no | no | **yes — commercial licence required** | **YES — critical** |
| Google Sans Flex | no | no | **not licensable at all** | **YES — substitute per §2.4** |

---

## 3. The type scale

Three ramps, because three families do three different jobs. Every row is a complete definition:
size, line height, letter spacing, weight, case.

Line heights are **unitless** wherever the design allowed it. Where Figma authored an absolute px
leading I give the unitless equivalent (rounded to 2 dp) and the authored px in the source column.

Letter spacing: Figma percent → CSS `em` is a direct conversion (`−2%` → `−0.02em`).

### 3.1 Display ramp — `Lemon`

All display steps are `text-transform: uppercase`.

| Token | Size | Line height | Tracking | Weight | Figma source |
|---|---:|---:|---:|---|---|
| `display-hero` | **164 px** | **0.82** | −0.01em | Bold (700) | `412:787`, `412:788`, `412:861-863` — 135 px leading |
| `display-1` | **140 px** | **0.96** | −0.01em | Semi Bold (600) | `412:1066`, `412:1286` — 135 px leading |
| `display-2` | **136 px** | **0.91** | **+0.03em** | Regular (400) | `412:2442` — 136.04 px / 124 px leading *(normalised, §7)* |
| `display-3` | **128 px** | **1.00** | −0.01em | Semi Bold (600) | `507:759`, `507:496/497/684`, `I511:364;507:759` |
| `display-3-bold` | **128 px** | **1.00** | −0.01em | Bold (700) | `412:1859` |
| `display-4` | **100 px** | **1.10** | −0.01em | Bold (700) | `352:3586` |
| `display-4-tight` | **100 px** | **0.95** | −0.01em | Semi Bold (600) | `412:1620` |
| `display-5` | **96 px** | **1.20** | −0.02em | Semi Bold (600) | `374:574`, `374:629`, `374:643` |
| `display-6` | **64 px** | **0.97** | **0em** | Semi Bold (600) | `412:1572`, `412:1777`, `412:2014`, `412:2651` — 64.13 px / 61.84 px *(normalised, §7)* |

### 3.2 Accent ramp — `Subjectivity`

All accent steps except `accent-num` and `accent-step` are `text-transform: uppercase`.

| Token | Size | Line height | Tracking | Weight | Figma source |
|---|---:|---:|---:|---|---|
| `accent-watermark` | **195 px** | **1.03** | −0.05em | Super (900) | `412:1305`, `498:638`, `498:680`, `498:890`, `500:2424`, +3 — 195.05 px, AUTO *(normalised)* |
| `accent-1` | **86 px** | **0.98** | −0.06em | Bold (700) | `412:1634`, `412:1640` — 85.88 px / 83.94 px *(normalised)* |
| `accent-2` | **74 px** | **1.22** | −0.08em | Super (900) | `412:1169/1170/1173/1174/1177/1178` — 73.85 px / 90.26 px *(normalised)* |
| `accent-3` | **56 px** | **1.22** | −0.08em | Super (900) | `412:1219` — 56.01 px / 68.46 px *(normalised)* |
| `accent-4` | **42 px** | **1.00** | −0.08em | Super (900) | `412:1198`, `412:1199` — 41.54 px *(normalised)* |
| `accent-num` | **40 px** | **1.03** | −0.08em | Bold (700) | `412:1651` (−9%), `412:1663` (−7%) *(normalised, §6 O-3)* |
| `accent-step` | **24 px** | **0.80** | 0em | Bold (700) | `458:269`, `458:273`, `458:277` |
| `accent-label` | **16 px** | **1.30** | −0.03em | Extra Bold (800) | `412:1182-1185`, `412:1187-1189`, `412:1192` — 16.41 px / 20.72 px *(normalised)* |
| `accent-caption` | **16 px** | **1.30** | **+0.01em** | Bold (700) | `412:1171`, `412:1175`, `412:1179` — 16.41 px / 20.72 px *(normalised)* |

### 3.3 Text ramp — `Inter`

The canonical row for each size is the variant that appears most often. Documented variants follow
each canonical row and are real, authored styles — not inventions.

| Token | Size | Line height | Tracking | Weight | Occurrences | Figma source |
|---|---:|---:|---:|---|---:|---|
| `text-2xs` | **12 px** | 1.20 | −0.03em | Medium (500) | 3 | `412:1618`, `412:1857`, `412:2440` |
| `text-xs` | **14 px** | 1.30 | −0.02em | Medium (500) | 13 | `352:3747`, `352:3754`, `500:1839`, … |
| `text-xs-tabular` | 14 px | 1.21 | −0.02em | Medium (500) | 3 | `412:1658`, `412:1671`, `412:1681` |
| `text-xs-btn` | 14 px | 1.21 | −0.01em | Semi Bold (600) | 3 | `511:469`, `412:1995`, `412:2607` |
| `text-sm` | **16 px** | 1.21 | −0.02em | Medium (500) | 52 | `500:2294`, `498:612`, … |
| `text-sm-regular` | 16 px | 1.21 | −0.02em | Regular (400) | 7 | `412:1650`, `412:1662`, `412:1680`, `458:265` |
| `text-sm-bold` | 16 px | 1.21 | −0.02em | Bold (700) | 6 | `500:2313`, `500:2315`, `500:2329` |
| `text-sm-btn` | 16 px | 1.21 | −0.02em | Semi Bold (600) | 2 | `412:1289`, `412:1623` |
| `text-sm-body` | 16 px | 1.30 | −0.03em | Regular (400) | 4 | `500:1776`, `500:1782`, `500:1789`, `500:1795` |
| `text-sm-crumb` | 16 px | 1.30 | −0.03em | Medium (500) | 3 | `500:2337`, `501:216`, `501:218` |
| `text-base` | **18 px** | 1.21 | −0.02em | Medium (500) | **122** | `498:616`, `500:2317`, … *(most-used style in the file)* |
| `text-base-bold` | 18 px | 1.21 | −0.02em | Bold (700) | 32 | `498:615`, `498:620`, `498:625`, `498:630` |
| `text-base-tab` | 18 px | 1.20 | −0.02em | Medium (500) | 2 | `412:1646`, `412:1648` |
| `text-base-answer` | 18 px | **1.44** | −0.01em | Regular (400) | 4 | `412:1574`, `412:1779`, `412:2016`, `412:2653` |
| `text-base-quote` | 18 px | 1.22 | −0.02em | Semi Bold (600) | 3 | `412:1074`, `412:1082`, `412:1090` *(substituted, §2.4)* |
| `text-md` | **20 px** | 1.30 | −0.03em | Medium (500) | 30 | `352:3689`, `352:3691`, `500:2312`, `500:2427`, … |
| `text-md-semibold` | 20 px | 1.30 | −0.03em | Semi Bold (600) | 4 | `500:1775`, `500:1781`, `500:1788`, `500:1794` |
| `text-md-link` | 20 px | 1.30 | −0.03em | Medium (500) + `underline` | 1 | `500:2208` |
| `text-md-prose` | 20 px | **1.60** | −0.03em | Regular (400) | 16 | `500:2368`, `501:219`, `352:3713-3716`, … — 32 px leading |
| `text-md-feature` | 20 px | 1.28 | −0.03em | Regular (400) | 7 | `570:439`, `570:442`, `570:445`, … |
| `text-md-hero` | 20 px | **1.40** | −0.02em | Medium (500) | 3 | `412:789`; + `412:1287`, `412:1293` *(substituted, §2.4)* |
| `text-md-card` | 20 px | 1.20 | −0.02em | Medium (500) | 4 | `507:760`, `458:386`, `458:395`, `I511:364;507:760` |
| `text-md-auto` | 20 px | 1.21 | −0.02em | Medium (500) | 1 | `412:2443` |
| `text-lg` | **24 px** | 1.20 | −0.03em | Medium (500) | 21 | `412:1563-1571`, `412:1768-…`, `412:2005-…`, `412:2642-…` |
| `text-lg-card` | 24 px | 1.30 | −0.03em | Semi Bold (600) | 12 | `352:3749`, `352:3756`, `352:3763`, `500:2220`, … |
| `text-lg-standfirst` | 24 px | 1.30 | −0.03em | Medium (500) | 2 | `352:3686`, `352:3587` |
| `text-lg-h3` | 24 px | **1.33** | −0.03em | Semi Bold (600) | 2 | `501:223`, `501:232` — 32 px leading |
| `text-lg-caption` | 24 px | 1.20 | −0.03em | Regular (400) | 2 | `553:294`, `553:305` *(see §6 O-5)* |
| `text-xl` | **28 px** | 1.13 | −0.03em | Semi Bold (600) | 7 | `570:438`, `570:441`, `570:444`, `570:447`, `570:450`, `570:453`, `570:456` |
| `text-xl-h2` | 28 px | **1.14** | −0.03em | Medium (500) | 1 | `352:3719` — 32 px leading |
| `text-2xl` | **32 px** | 1.20 | −0.03em | Medium (500) | 4 | `412:1555`, `412:1760`, `412:1997`, `412:2634` |
| `text-2xl-related` | 32 px | 1.10 | −0.03em | Semi Bold (600) | 1 | `352:3742` |
| `text-2xl-section` | 32 px | 1.30 | −0.03em | Medium (500) | 1 | `500:1798` |
| `text-2xl-feature` | 32 px | 1.30 | −0.03em | Semi Bold (600) | 1 | `500:1840` *(normalised from −4%, §6 O-2)* |
| `text-2xl-prose` | 32 px | **1.40** | −0.03em | Medium (500) | 5 | `412:2521-2525` |
| `text-3xl` | **36 px** | 1.30 | −0.03em | Semi Bold (600) | 1 | `352:3685` |
| `text-3xl-medium` | 36 px | 1.20 | −0.03em | Medium (500) | 1 | `458:264` |
| `text-4xl` | **44 px** | 1.30 | −0.03em | Medium (500) | 1 | `500:1768` |
| `text-5xl` | **48 px** | 1.13 | −0.03em | Medium (500) | 1 | `570:435` |
| `text-5xl-tight` | 48 px | 1.10 | −0.03em | Medium (500) | 1 | `553:290` |

### 3.4 Brand ramp — `Cal Sans`

| Token | Size | Line height | Tracking | Weight | Figma source |
|---|---:|---:|---:|---|---|
| `brand-wordmark` | **24 px** | 1.20 | 0em | Regular (400) | `412:1584`, `412:1789`, `412:2026`, `412:2663` |

`412:889` (Cal Sans Regular 14) is an outlier — see §6 O-4. Do not build it as Cal Sans.

---

## 4. Semantic role mapping

Look up the role, get the token. This table is the contract; §3 is the definition.

### 4.1 Page-level headings

| Role | Token | Concrete value | Frames |
|---|---|---|---|
| **h1** — landing hero | `display-hero` | Lemon Bold 164 / 0.82 / −0.01em / uppercase | F1 `412:759` |
| **h1** — crypto wallet hero | `display-4-tight` | Lemon Semi Bold 100 / 0.95 / −0.01em / uppercase | F2 `412:1586` |
| **h1** — cross-border hero | `display-3-bold` | Lemon Bold 128 / 1.00 / −0.01em / uppercase | F3 `412:1829` |
| **h1** — business hero | `display-2` | Lemon Regular 136 / 0.91 / **+0.03em** / uppercase | F4 `412:2412` |
| **h1** — blog index hero | `display-4` | Lemon Bold 100 / 1.10 / −0.01em / uppercase | F5 `281:56` |
| **h1** — article title | `text-3xl` | Inter Semi Bold 36 / 1.30 / −0.03em | F6 `282:803` |
| **h1** — help page title | `text-4xl` | Inter Medium 44 / 1.30 / −0.03em | F7 `498:209`, F8 `500:2281` |

**One `<h1>` per route.** On F5 the three `display-5` "AZZA BLOG" nodes (`374:574`, `374:629`,
`374:643`) are a repeating marquee strip, **not** headings — render them as decorative (`aria-hidden`)
inside the marquee, and let `352:3586` "THE AZZA BLOG" be the `<h1>`.

### 4.2 Section and block headings

| Role | Token | Concrete value | Frames |
|---|---|---|---|
| **h2** — display section title | `display-1` | Lemon Semi Bold 140 / 0.96 / −0.01em / uppercase | F1 (`412:1066` "WHAT PEOPLE SAY", `412:1286` "USE AZZA TODAY!") |
| **h2** — text section title (landing) | `text-5xl` | Inter Medium 48 / 1.13 / −0.03em | F1 (`570:435`) |
| **h2** — text section title (cross-border) | `text-5xl-tight` | Inter Medium 48 / 1.10 / −0.03em | F3 (`553:290`) |
| **h2** — FAQ section title | `text-2xl` | Inter Medium 32 / 1.20 / −0.03em | F1, F2, F3, F4 |
| **h2** — "How to get started" | `text-3xl-medium` | Inter Medium 36 / 1.20 / −0.03em | F4 (`458:264`) |
| **h2** — article body heading | `text-xl-h2` | Inter Medium 28 / 1.14 / −0.03em | F6 (`352:3719`) |
| **h2** — "Related Articles" | `text-2xl-related` | Inter Semi Bold 32 / 1.10 / −0.03em | F6 (`352:3742`) |
| **h2** — help category ("Community") | `text-2xl-section` | Inter Medium 32 / 1.30 / −0.03em | F7 (`500:1798`) |
| **h3** — feature / benefit heading | `text-xl` | Inter Semi Bold 28 / 1.13 / −0.03em | F1 (`Why Azza?`, 7×) |
| **h3** — card deck headline | `display-3` | Lemon Semi Bold 128 / 1.00 / −0.01em / uppercase | F1 via `511:364`; CS `507:496/497/684` |
| **h3** — blog card title | `text-lg-card` | Inter Semi Bold 24 / 1.30 / −0.03em | F5, F6 |
| **h3** — featured blog card title | `text-2xl-feature` | Inter Semi Bold 32 / 1.30 / −0.03em | F5 (`500:1840`) |
| **h3** — help article sub-head | `text-lg-h3` | Inter Semi Bold 24 / 1.33 / −0.03em | F8 (`501:223`, `501:232`) |
| **h3** — help sidebar card title | `text-md-semibold` | Inter Semi Bold 20 / 1.30 / −0.03em | F7 (4×) |
| **h4** — FAQ question | `text-lg` | Inter Medium 24 / 1.20 / −0.03em | F1, F2, F3, F4 |
| **h4** — footer column heading | `text-base-bold` | Inter Bold 18 / 1.21 / −0.02em | F1–F8 (4 per frame) |
| **h4** — help TOC group heading | `text-sm-bold` | Inter Bold 16 / 1.21 / −0.02em | F7, F8 |
| **h5 / h6** | *not present in the design* | — | — |

**h5 / h6 are not used anywhere in this design.** If markup depth forces one, use `text-sm-bold`
(Inter Bold 16 / 1.21 / −0.02em) for `h5` and `text-xs` (Inter Medium 14 / 1.30 / −0.02em) for `h6`.
This is my proposal, not a design value — flagged in the report.

### 4.3 Body, lead and prose

| Role | Token | Concrete value | Frames |
|---|---|---|---|
| **lead** — hero subcopy (landing) | `text-md-hero` | Inter Medium 20 / 1.40 / −0.02em | F1 (`412:789`) |
| **lead** — hero subcopy (business) | `text-md-auto` | Inter Medium 20 / 1.21 / −0.02em | F4 (`412:2443`) |
| **lead** — card deck subcopy | `text-md-card` | Inter Medium 20 / 1.20 / −0.02em | F1, CS |
| **lead** — article standfirst | `text-lg-standfirst` | Inter Medium 24 / 1.30 / −0.03em | F5, F6 |
| **lead** — business narrative | `text-2xl-prose` | Inter Medium 32 / 1.40 / −0.03em | F4 (5 paragraphs) |
| **body** — long-form article prose | `text-md-prose` | Inter Regular 20 / 1.60 / −0.03em | F6, F8 |
| **body** — feature description | `text-md-feature` | Inter Regular 20 / 1.28 / −0.03em | F1 (`Why Azza?`) |
| **body** — FAQ answer | `text-base-answer` | Inter Regular 18 / 1.44 / −0.01em | F1, F2, F3, F4 |
| **body** — help card description | `text-sm-body` | Inter Regular 16 / 1.30 / −0.03em | F7 |
| **body** — form field label | `text-sm-regular` | Inter Regular 16 / 1.21 / −0.02em | F2, F4, F7 |
| **small** — supporting caption | `text-lg-caption` | Inter Regular 24 / 1.20 / −0.03em | F3 (`553:294`, `553:305`) |
| **caption** — exchange rate line | `text-xs-tabular` | Inter Medium 14 / 1.21 / −0.02em | F2 (`412:1658`, `412:1671`, `412:1681`) |

**Prose run-in bold.** Inside `text-md-prose` paragraphs, the leading clause is set in **Inter Semi Bold
600** at the same size / leading / tracking, followed by Regular. Nodes: `352:3713`, `352:3714`,
`352:3715`, `352:3716`, `352:3722`. Implement as `<strong>` — do not create a separate token.

**Prose inline links.** `text-md-prose` also carries `text-decoration: underline` on inline link spans
at the same weight (Regular 400). Nodes: `352:3713`, `352:3714`, `352:3716`, `352:3723`.

### 4.4 Interface roles

| Role | Token | Concrete value | Frames |
|---|---|---|---|
| **nav link** — top nav | `text-sm` | Inter Medium 16 / 1.21 / −0.02em | F1–F8 (5 items per frame) |
| **nav link** — footer link | `text-base` | Inter Medium 18 / 1.21 / −0.02em | F1–F8 |
| **nav link** — help sidebar / TOC | `text-base` | Inter Medium 18 / 1.21 / −0.02em | F7, F8 |
| **breadcrumb** | `text-sm-crumb` | Inter Medium 16 / 1.30 / −0.03em | F8 (`500:2337`, `501:216`, `501:218`) |
| **button** — primary (WhatsApp CTA) | `text-sm-btn` | Inter Semi Bold 16 / 1.21 / −0.02em | F1, F2 |
| **button** — QR band CTA | `text-xs-btn` | Inter Semi Bold 14 / 1.21 / −0.01em | F2, F3, F4 *(and F1 after §6 O-4)* |
| **button** — "View More" / search | `text-md` | Inter Medium 20 / 1.30 / −0.03em | F5, F7, F8 |
| **button** — "START NOW" | `text-md-hero` | Inter Medium 20 / 1.40 / −0.02em | F1 (`412:1293`, substituted §2.4) |
| **tab / toggle label** | `text-base-tab` | Inter Medium 18 / 1.20 / −0.02em | F2 (`412:1646`, `412:1648`) |
| **filter chip — inactive** | `text-xs` | Inter Medium 14 / 1.30 / −0.02em | F5, F6 |
| **filter chip — active** | `text-md-link` | Inter Medium 20 / 1.30 / −0.03em, `underline` | F5 (`500:2208`) |
| **label** — legal / RC line | `text-sm` | Inter Medium 16 / 1.21 / −0.02em | F1–F8 |
| **overline / eyebrow** — product badge | `text-2xs` | Inter Medium 12 / 1.20 / −0.03em, uppercase | F2, F3, F4 |
| **overline / eyebrow** — "WHY AZZA BUSINESS" | `text-2xs` | Inter Medium 12 / 1.20 / −0.03em, uppercase | F4 (`412:2519`, normalised §6 O-1) |
| **quote** — testimonial | `text-base-quote` | Inter Semi Bold 18 / 1.22 / −0.02em | F1 (substituted §2.4) |
| **quote attribution** | `text-sm` | Inter Medium 16 / 1.21 / −0.02em | F1, F3 (substituted §2.4) |
| **wordmark** — inline "Azza" | `brand-wordmark` | Cal Sans Regular 24 / 1.20 / 0em | F1, F2, F3, F4 |

### 4.5 Numeric / statistical roles (`Subjectivity`)

| Role | Token | Concrete value | Frames |
|---|---|---|---|
| **stat figure** — Azza Wrapped | `accent-2` | Subjectivity Super 74 / 1.22 / −0.08em / uppercase | F1 (6 nodes) |
| **stat caption** — Azza Wrapped | `accent-caption` | Subjectivity Bold 16 / 1.30 / +0.01em / uppercase | F1 (3 nodes) |
| **stat label** — Azza Wrapped list | `accent-label` | Subjectivity Extra Bold 16 / 1.30 / −0.03em / uppercase | F1 (8 nodes) |
| **persona label** — "HUSTLER" | `accent-3` | Subjectivity Super 56 / 1.22 / −0.08em / uppercase | F1 (`412:1219`) |
| **ticker** — "AZZA WRAPPED" | `accent-4` | Subjectivity Super 42 / 1.00 / −0.08em / uppercase | F1 (`412:1198`, `412:1199`) |
| **currency glyph** — big ₦ | `accent-1` | Subjectivity Bold 86 / 0.98 / −0.06em / uppercase | F2 (`412:1634`, `412:1640`) |
| **exchange amount** | `accent-num` | Subjectivity Bold 40 / 1.03 / −0.08em | F2 (`412:1651`, `412:1663`) |
| **step numeral** — 01 / 02 / 03 | `accent-step` | Subjectivity Bold 24 / 0.80 / 0em | F4 (`458:269/273/277`) |
| **footer watermark** — "USE AZZA" | `accent-watermark` | Subjectivity Super 195 / 1.03 / −0.05em | F1–F8 (1 per frame) |

The watermark node is 1002 × **162 px** with `textAutoResize: NONE` — the design deliberately clips the
glyphs. Render inside a 162 px-tall `overflow: hidden` box and mark it `aria-hidden="true"`.

---

## 5. The O-swap — brand device contract

Nine display headlines replace the letter **O** with a `Subjectivity` glyph at the same size, line
height and tracking. The Subjectivity weight is chosen to visually balance the Lemon weight:

| Lemon weight on the headline | Subjectivity weight on the O |
|---|---|
| Bold | Bold |
| Semi Bold | Medium |
| Regular | Light |

**This is not automatic.** Only these nodes carry it:

| Node | Text | Base | Swapped span(s) |
|---|---|---|---|
| `412:788` | `Your mONEY` | Lemon Bold 164 | the 1st `o` → Subjectivity Bold |
| `412:1066` | `what people say` | Lemon Semi Bold 140 | the `o` in "people" → Subjectivity Medium |
| `412:1286` | `use azza today!` | Lemon Semi Bold 140 | the `o` in "today" → Subjectivity Medium |
| `412:1572` | `QUESTIONS` | Lemon Semi Bold 64 | the `O` → Subjectivity Medium |
| `412:1777` | `QUESTIONS` | Lemon Semi Bold 64 | as above |
| `412:2014` | `QUESTIONS` | Lemon Semi Bold 64 | as above |
| `412:2651` | `QUESTIONS` | Lemon Semi Bold 64 | as above |
| `352:3586` | `THE AZZA BLOG` | Lemon Bold 100 | the `O` in "BLOG" → Subjectivity Bold |
| `412:2442` | `Your money should work anywhere.` | Lemon Regular 136 | **all three** `o` glyphs → Subjectivity Light |

**Headlines that contain an O and deliberately do NOT swap it** — verified as single-segment nodes.
Do not add the device here:

`412:787` (no O), `412:1620` "Your all-in-one wallet…", `412:1859` "Your financial passport.",
`374:574` / `374:629` / `374:643` "AZZA BLOG", `507:759` / `458:385` / `458:394` (card deck headlines).

**Implementation.** Ship a small server component that takes the headline string plus an explicit list
of character indices to swap, so the swap is data-driven and auditable rather than a regex over every
`o`. A regex would corrupt the six headlines listed immediately above.

```html
<!-- shape of the output; classes are illustrative -->
<h1 class="font-display uppercase">Y<span class="font-accent">o</span>ur mONEY</h1>
```

The swapped span inherits `font-size`, `line-height` and `letter-spacing` from the parent unchanged.
Only `font-family` and `font-weight` differ.

---

## 6. Outliers — nodes that do not fit the derived scale

Six. Every one is listed with a judgement; nothing was silently rounded.

**O-1 · `412:2519` — "WHY AZZA BUSINESS", Inter Medium 12 / 1.20 / −0.04em**
The three sibling eyebrows (`412:1618`, `412:1857`, `412:2440`) are identical except they use −0.03em.
**Judgement: design inconsistency, one node against three.** Normalised to `text-2xs` (−0.03em).

**O-2 · `500:1840` — featured blog card title, Inter Semi Bold 32 / 1.30 / −0.04em**
Every other Inter step at ≥ 20 px uses −0.03em. This is the only −0.04em in the Inter ramp.
**Judgement: design inconsistency.** Normalised to −0.03em as `text-2xl-feature`.

**O-3 · `412:1651` / `412:1663` — exchange amounts, Subjectivity Bold 40, −0.09em and −0.07em**
Two nodes, same widget, same role, two different trackings. Neither matches the −0.08em used by every
other large Subjectivity node. **Judgement: design inconsistency.** Both normalised to −0.08em
(`accent-num`).

**O-4 · `412:889` — landing QR band CTA, Cal Sans Regular 14 / 1.29 / 0em**
The identical QR band on F2, F3 and F4 uses Inter Semi Bold 14 / 1.21 / −0.01em (`511:469`, `412:1995`,
`412:2607`). The landing copy is the odd one out, and Cal Sans appears nowhere else at 14 px.
**Judgement: design inconsistency — a stale node in a component that was later standardised.**
Build the landing QR band with `text-xs-btn` like its three siblings. `brand-wordmark` (Cal Sans 24)
remains legitimate and unchanged.

**O-5 · `553:294` / `553:305` — cross-border feature captions, Inter Regular 24 / 1.20 / −0.03em**
All 21 other nodes at 24 / 1.20 / −0.03em are Medium 500. These two are Regular 400.
**Judgement: deliberate.** They are captions under illustrations, not FAQ questions — a lighter weight
is a sensible distinction. Kept as `text-lg-caption`. Flagged so an auditor does not "fix" it.

**O-6 · `412:2442` — business hero, Lemon Regular 136 / 0.91 / +0.03em**
The only display headline in the file with (a) `Regular` weight and (b) **positive** tracking. Every
other display step is −0.01em or −0.02em at Semi Bold or Bold.
**Judgement: deliberate.** It is a full-page B2B hero paired with Subjectivity **Light** O-swaps — a
consistent, lighter treatment for the business audience. Kept verbatim as `display-2`. This is the one
display step an implementer is most likely to "correct" by accident; do not.

**Also noted, not outliers:**
- `412:1171/1175/1179` (Bold, +0.01em) sit directly beside `412:1182-1185` (Extra Bold, −0.03em) at the
  same size. Different weight *and* different tracking in one block is unusual, but the two sets play
  different roles (headline caption vs. list label) and both repeat consistently. Kept as two tokens.
- `412:1293` "START NOW" is a button label sharing a style with body copy `412:1287`. Both resolve to
  `text-md-hero` after the §2.4 substitution. Correct but worth knowing.

---

## 7. Normalisations — every value I moved, and to what

Eight fractional sizes exist in the file. They are **scaled-group artifacts**, not design intent: the
"Azza Wrapped" group was scaled by exactly **40 ⁄ 39** (16 × 40/39 = 16.4103, 72 × 40/39 = 73.8462 — both
exact). Fractional font sizes are unimplementable and unauditable, so all are rounded to the nearest
integer px, with the line height re-derived to preserve the **absolute** rendered leading.

| Figma authored | Normalised to | Δ size | Δ leading | Token |
|---|---|---:|---:|---|
| 195.048 px / AUTO | **195 px / 1.03** | −0.02% | +0.0% | `accent-watermark` |
| 136.036 px / 124 px | **136 px / 0.91** | −0.03% | −0.19% | `display-2` |
| 85.882 px / 83.94 px | **86 px / 0.98** | +0.14% | +0.4% | `accent-1` |
| 73.846 px / 90.26 px | **74 px / 1.22** | +0.21% | +0.02% | `accent-2` |
| 64.127 px / 61.84 px | **64 px / 0.97** | −0.20% | +0.39% | `display-6` |
| 56.015 px / 68.46 px | **56 px / 1.22** | −0.03% | −0.20% | `accent-3` |
| 41.537 px / 41.54 px | **42 px / 1.00** | +1.11% | +1.11% | `accent-4` |
| 16.410 px / 20.72 px | **16 px / 1.30** | −2.50% | +0.39% | `accent-label`, `accent-caption` |

Other normalisations:

| Authored | Normalised to | Why |
|---|---|---|
| `−4%` tracking on `412:2519` | `−0.03em` | O-1, one node against three |
| `−4%` tracking on `500:1840` | `−0.03em` | O-2, only −4% in the Inter ramp |
| `−9%` / `−7%` on `412:1651` / `412:1663` | `−0.08em` both | O-3, family norm is −8% |
| Cal Sans 14 on `412:889` | Inter Semi Bold 14 / −0.01em | O-4, matches its three siblings |
| Google Sans Flex, all 18 nodes | Inter per §2.4 mapping | not licensable |
| Line height `AUTO` (Inter) | `1.21` | measured; deterministic across fallbacks |
| Line height `AUTO` (Subjectivity) | `1.03` | measured 40 px → 41 px |
| Line height `AUTO` (Google Sans Flex) | `1.25` → becomes Inter `1.21` | measured 16 → 20, 14 → 18 |
| Line height `AUTO` (Cal Sans) | `1.29` | measured |
| `120%` on `412:1646` / `412:1648` | kept at `1.20` | 0.01 from `text-base` (1.21) but authored deliberately on a tab pair; kept as `text-base-tab` |

**Nothing else was changed.** Every other size, leading, tracking and weight in §3 is the authored value.

---

## 8. Responsive behaviour

**The design contains no responsive information whatsoever.** All eight frames are exactly 1440 px
wide. There are no mobile frames, no tablet frames, and no layout-grid breakpoints anywhere in the
file. Everything below 1440 is invention.

`design/responsive.md` is the sole authority for sub-1440 behaviour. What follows is **intent, not a
specification** — a hand-off note so the responsive owner knows which steps are structurally unable to
survive a narrow viewport.

**Must shrink — these will overflow a 390 px viewport at their desktop size:**

| Token | 1440 | Ratio at which it stops fitting | Note |
|---|---:|---|---|
| `display-hero` | 164 px | below ~1100 px | "YOUR MONEY" is 631 px wide at 164 px |
| `display-1` | 140 px | below ~900 px | "WHAT PEOPLE SAY" is 662 px wide |
| `display-2` | 136 px | below ~900 px | wraps to 3 lines at 718 px already |
| `display-3` | 128 px | below ~800 px | card headline, wraps at 553 px |
| `display-4` / `-4-tight` | 100 px | below ~700 px | |
| `accent-watermark` | 195 px | below ~1100 px | decorative; can be clipped further or dropped |
| `text-5xl` / `text-4xl` | 48 / 44 px | below ~768 px | |

**Safe to hold constant at every breakpoint** — these are already at interface scale and shrinking them
costs legibility for nothing: `text-2xs` (12), `text-xs` (14), `text-sm` (16), `text-base` (18),
`accent-label`, `accent-caption`, `accent-step`.

**Proposed approach, for the responsive owner to accept or reject:** clamp the display and accent ramps
fluidly between a 390 px and a 1440 px viewport, and leave the Inter ramp on discrete breakpoint steps.
Display type at 164 px has a 0.82 line height — a fluid clamp must clamp the *size* while keeping the
line height unitless, or the leading will collapse. Do not convert any of the unitless leadings in §3 to
px for the fluid steps.

Every display step in §3 is tuned to a specific line break at 1440. Re-checking those breaks after any
size change is part of the responsive owner's job, not mine.

---

## 9. Implementation — Tailwind CSS v4

Paste-ready. Goes in the project's `@theme` block. `--text-*: initial` and `--font-*: initial` clear
Tailwind's stock ramps so an implementer physically cannot reach an off-scale size — which is what
acceptance gate 4 requires.

```css
@theme {
  /* ---- families ------------------------------------------------------- */
  --font-*: initial;

  --font-sans:    "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-display: "Bebas Neue", "Oswald", "Arial Narrow", system-ui, sans-serif;
  --font-accent:  "Subjectivity", "Poppins", "Century Gothic", system-ui, sans-serif;
  --font-brand:   "Cal Sans", "Inter", ui-sans-serif, system-ui, sans-serif;

  /* ---- scale ---------------------------------------------------------- */
  --text-*: initial;

  /* Display ramp — Lemon. Always paired with `uppercase`. */
  --text-display-hero: 10.25rem;              /* 164px */
  --text-display-hero--line-height: 0.82;
  --text-display-hero--letter-spacing: -0.01em;
  --text-display-hero--font-weight: 700;

  --text-display-1: 8.75rem;                  /* 140px */
  --text-display-1--line-height: 0.96;
  --text-display-1--letter-spacing: -0.01em;
  --text-display-1--font-weight: 600;

  --text-display-2: 8.5rem;                   /* 136px */
  --text-display-2--line-height: 0.91;
  --text-display-2--letter-spacing: 0.03em;
  --text-display-2--font-weight: 400;

  --text-display-3: 8rem;                     /* 128px */
  --text-display-3--line-height: 1;
  --text-display-3--letter-spacing: -0.01em;
  --text-display-3--font-weight: 600;

  --text-display-3-bold: 8rem;                /* 128px */
  --text-display-3-bold--line-height: 1;
  --text-display-3-bold--letter-spacing: -0.01em;
  --text-display-3-bold--font-weight: 700;

  --text-display-4: 6.25rem;                  /* 100px */
  --text-display-4--line-height: 1.1;
  --text-display-4--letter-spacing: -0.01em;
  --text-display-4--font-weight: 700;

  --text-display-4-tight: 6.25rem;            /* 100px */
  --text-display-4-tight--line-height: 0.95;
  --text-display-4-tight--letter-spacing: -0.01em;
  --text-display-4-tight--font-weight: 600;

  --text-display-5: 6rem;                     /* 96px */
  --text-display-5--line-height: 1.2;
  --text-display-5--letter-spacing: -0.02em;
  --text-display-5--font-weight: 600;

  --text-display-6: 4rem;                     /* 64px */
  --text-display-6--line-height: 0.97;
  --text-display-6--letter-spacing: 0em;
  --text-display-6--font-weight: 600;

  /* Accent ramp — Subjectivity */
  --text-accent-watermark: 12.1875rem;        /* 195px */
  --text-accent-watermark--line-height: 1.03;
  --text-accent-watermark--letter-spacing: -0.05em;
  --text-accent-watermark--font-weight: 900;

  --text-accent-1: 5.375rem;                  /* 86px */
  --text-accent-1--line-height: 0.98;
  --text-accent-1--letter-spacing: -0.06em;
  --text-accent-1--font-weight: 700;

  --text-accent-2: 4.625rem;                  /* 74px */
  --text-accent-2--line-height: 1.22;
  --text-accent-2--letter-spacing: -0.08em;
  --text-accent-2--font-weight: 900;

  --text-accent-3: 3.5rem;                    /* 56px */
  --text-accent-3--line-height: 1.22;
  --text-accent-3--letter-spacing: -0.08em;
  --text-accent-3--font-weight: 900;

  --text-accent-4: 2.625rem;                  /* 42px */
  --text-accent-4--line-height: 1;
  --text-accent-4--letter-spacing: -0.08em;
  --text-accent-4--font-weight: 900;

  --text-accent-num: 2.5rem;                  /* 40px */
  --text-accent-num--line-height: 1.03;
  --text-accent-num--letter-spacing: -0.08em;
  --text-accent-num--font-weight: 700;

  --text-accent-step: 1.5rem;                 /* 24px */
  --text-accent-step--line-height: 0.8;
  --text-accent-step--letter-spacing: 0em;
  --text-accent-step--font-weight: 700;

  --text-accent-label: 1rem;                  /* 16px */
  --text-accent-label--line-height: 1.3;
  --text-accent-label--letter-spacing: -0.03em;
  --text-accent-label--font-weight: 800;

  --text-accent-caption: 1rem;                /* 16px */
  --text-accent-caption--line-height: 1.3;
  --text-accent-caption--letter-spacing: 0.01em;
  --text-accent-caption--font-weight: 700;

  /* Text ramp — Inter */
  --text-2xs: 0.75rem;                        /* 12px */
  --text-2xs--line-height: 1.2;
  --text-2xs--letter-spacing: -0.03em;
  --text-2xs--font-weight: 500;

  --text-xs: 0.875rem;                        /* 14px */
  --text-xs--line-height: 1.3;
  --text-xs--letter-spacing: -0.02em;
  --text-xs--font-weight: 500;

  --text-xs-tabular: 0.875rem;                /* 14px */
  --text-xs-tabular--line-height: 1.21;
  --text-xs-tabular--letter-spacing: -0.02em;
  --text-xs-tabular--font-weight: 500;

  --text-xs-btn: 0.875rem;                    /* 14px */
  --text-xs-btn--line-height: 1.21;
  --text-xs-btn--letter-spacing: -0.01em;
  --text-xs-btn--font-weight: 600;

  --text-sm: 1rem;                            /* 16px */
  --text-sm--line-height: 1.21;
  --text-sm--letter-spacing: -0.02em;
  --text-sm--font-weight: 500;

  --text-sm-regular: 1rem;
  --text-sm-regular--line-height: 1.21;
  --text-sm-regular--letter-spacing: -0.02em;
  --text-sm-regular--font-weight: 400;

  --text-sm-bold: 1rem;
  --text-sm-bold--line-height: 1.21;
  --text-sm-bold--letter-spacing: -0.02em;
  --text-sm-bold--font-weight: 700;

  --text-sm-btn: 1rem;
  --text-sm-btn--line-height: 1.21;
  --text-sm-btn--letter-spacing: -0.02em;
  --text-sm-btn--font-weight: 600;

  --text-sm-body: 1rem;
  --text-sm-body--line-height: 1.3;
  --text-sm-body--letter-spacing: -0.03em;
  --text-sm-body--font-weight: 400;

  --text-sm-crumb: 1rem;
  --text-sm-crumb--line-height: 1.3;
  --text-sm-crumb--letter-spacing: -0.03em;
  --text-sm-crumb--font-weight: 500;

  --text-base: 1.125rem;                      /* 18px */
  --text-base--line-height: 1.21;
  --text-base--letter-spacing: -0.02em;
  --text-base--font-weight: 500;

  --text-base-bold: 1.125rem;
  --text-base-bold--line-height: 1.21;
  --text-base-bold--letter-spacing: -0.02em;
  --text-base-bold--font-weight: 700;

  --text-base-tab: 1.125rem;
  --text-base-tab--line-height: 1.2;
  --text-base-tab--letter-spacing: -0.02em;
  --text-base-tab--font-weight: 500;

  --text-base-answer: 1.125rem;
  --text-base-answer--line-height: 1.44;
  --text-base-answer--letter-spacing: -0.01em;
  --text-base-answer--font-weight: 400;

  --text-base-quote: 1.125rem;
  --text-base-quote--line-height: 1.22;
  --text-base-quote--letter-spacing: -0.02em;
  --text-base-quote--font-weight: 600;

  --text-md: 1.25rem;                         /* 20px */
  --text-md--line-height: 1.3;
  --text-md--letter-spacing: -0.03em;
  --text-md--font-weight: 500;

  --text-md-semibold: 1.25rem;
  --text-md-semibold--line-height: 1.3;
  --text-md-semibold--letter-spacing: -0.03em;
  --text-md-semibold--font-weight: 600;

  --text-md-prose: 1.25rem;
  --text-md-prose--line-height: 1.6;
  --text-md-prose--letter-spacing: -0.03em;
  --text-md-prose--font-weight: 400;

  --text-md-feature: 1.25rem;
  --text-md-feature--line-height: 1.28;
  --text-md-feature--letter-spacing: -0.03em;
  --text-md-feature--font-weight: 400;

  --text-md-hero: 1.25rem;
  --text-md-hero--line-height: 1.4;
  --text-md-hero--letter-spacing: -0.02em;
  --text-md-hero--font-weight: 500;

  --text-md-card: 1.25rem;
  --text-md-card--line-height: 1.2;
  --text-md-card--letter-spacing: -0.02em;
  --text-md-card--font-weight: 500;

  --text-md-auto: 1.25rem;
  --text-md-auto--line-height: 1.21;
  --text-md-auto--letter-spacing: -0.02em;
  --text-md-auto--font-weight: 500;

  --text-lg: 1.5rem;                          /* 24px */
  --text-lg--line-height: 1.2;
  --text-lg--letter-spacing: -0.03em;
  --text-lg--font-weight: 500;

  --text-lg-card: 1.5rem;
  --text-lg-card--line-height: 1.3;
  --text-lg-card--letter-spacing: -0.03em;
  --text-lg-card--font-weight: 600;

  --text-lg-standfirst: 1.5rem;
  --text-lg-standfirst--line-height: 1.3;
  --text-lg-standfirst--letter-spacing: -0.03em;
  --text-lg-standfirst--font-weight: 500;

  --text-lg-h3: 1.5rem;
  --text-lg-h3--line-height: 1.33;
  --text-lg-h3--letter-spacing: -0.03em;
  --text-lg-h3--font-weight: 600;

  --text-lg-caption: 1.5rem;
  --text-lg-caption--line-height: 1.2;
  --text-lg-caption--letter-spacing: -0.03em;
  --text-lg-caption--font-weight: 400;

  --text-xl: 1.75rem;                         /* 28px */
  --text-xl--line-height: 1.13;
  --text-xl--letter-spacing: -0.03em;
  --text-xl--font-weight: 600;

  --text-xl-h2: 1.75rem;
  --text-xl-h2--line-height: 1.14;
  --text-xl-h2--letter-spacing: -0.03em;
  --text-xl-h2--font-weight: 500;

  --text-2xl: 2rem;                           /* 32px */
  --text-2xl--line-height: 1.2;
  --text-2xl--letter-spacing: -0.03em;
  --text-2xl--font-weight: 500;

  --text-2xl-related: 2rem;
  --text-2xl-related--line-height: 1.1;
  --text-2xl-related--letter-spacing: -0.03em;
  --text-2xl-related--font-weight: 600;

  --text-2xl-section: 2rem;
  --text-2xl-section--line-height: 1.3;
  --text-2xl-section--letter-spacing: -0.03em;
  --text-2xl-section--font-weight: 500;

  --text-2xl-feature: 2rem;
  --text-2xl-feature--line-height: 1.3;
  --text-2xl-feature--letter-spacing: -0.03em;
  --text-2xl-feature--font-weight: 600;

  --text-2xl-prose: 2rem;
  --text-2xl-prose--line-height: 1.4;
  --text-2xl-prose--letter-spacing: -0.03em;
  --text-2xl-prose--font-weight: 500;

  --text-3xl: 2.25rem;                        /* 36px */
  --text-3xl--line-height: 1.3;
  --text-3xl--letter-spacing: -0.03em;
  --text-3xl--font-weight: 600;

  --text-3xl-medium: 2.25rem;
  --text-3xl-medium--line-height: 1.2;
  --text-3xl-medium--letter-spacing: -0.03em;
  --text-3xl-medium--font-weight: 500;

  --text-4xl: 2.75rem;                        /* 44px */
  --text-4xl--line-height: 1.3;
  --text-4xl--letter-spacing: -0.03em;
  --text-4xl--font-weight: 500;

  --text-5xl: 3rem;                           /* 48px */
  --text-5xl--line-height: 1.13;
  --text-5xl--letter-spacing: -0.03em;
  --text-5xl--font-weight: 500;

  --text-5xl-tight: 3rem;
  --text-5xl-tight--line-height: 1.1;
  --text-5xl-tight--letter-spacing: -0.03em;
  --text-5xl-tight--font-weight: 500;

  /* Brand ramp — Cal Sans */
  --text-brand-wordmark: 1.5rem;              /* 24px */
  --text-brand-wordmark--line-height: 1.2;
  --text-brand-wordmark--letter-spacing: 0em;
  --text-brand-wordmark--font-weight: 400;
}
```

### Usage

```tsx
<h1 className="font-display text-display-hero uppercase">…</h1>
<p  className="font-sans text-md-prose">…</p>
<span className="font-accent text-accent-2 uppercase">$500</span>
<span className="font-brand text-brand-wordmark">Azza</span>
```

`--text-*--font-weight` is applied by the `text-*` utility in Tailwind v4, so a separate `font-medium`
is redundant and, if added, will silently override the token. **Do not pair a `text-*` token with a
`font-<weight>` utility.** If a one-off weight is genuinely needed, that is a missing token — raise it
rather than patching it locally.

### Font loading

```ts
// reference only — src/app/layout.tsx is owned by scaffolder
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-inter", display: "swap" });

const lemon = localFont({
  variable: "--font-lemon",
  display: "swap",
  src: [
    { path: "../fonts/Lemon-Regular.woff2",  weight: "400", style: "normal" },
    { path: "../fonts/Lemon-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Lemon-Bold.woff2",     weight: "700", style: "normal" },
  ],
});

const subjectivity = localFont({
  variable: "--font-subjectivity",
  display: "swap",
  src: [
    { path: "../fonts/Subjectivity-Light.woff2",     weight: "300", style: "normal" },
    { path: "../fonts/Subjectivity-Medium.woff2",    weight: "500", style: "normal" },
    { path: "../fonts/Subjectivity-Bold.woff2",      weight: "700", style: "normal" },
    { path: "../fonts/Subjectivity-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../fonts/Subjectivity-Super.woff2",     weight: "900", style: "normal" },
  ],
});

const calSans = localFont({
  variable: "--font-cal-sans",
  display: "swap",
  src: [{ path: "../fonts/CalSans-Regular.woff2", weight: "400", style: "normal" }],
});
```

Use `display: "swap"` on all four. The display ramp runs to 164 px — a FOIT at that size is a visible
blank hero, and the fallback stacks in §2 were chosen so the swap is not catastrophic.

---

## 10. Rules an auditor can check mechanically

1. No `font-size`, `line-height` or `letter-spacing` literal appears in component source. Every value
   comes from a `text-*` token in §9.
2. Every `font-family` resolves to one of `--font-sans`, `--font-display`, `--font-accent`,
   `--font-brand`. No fifth family.
3. `Google Sans Flex` appears nowhere in the codebase.
4. Every element using a `text-display-*` or `text-accent-*` token (except `accent-num` and
   `accent-step`) also carries `uppercase`.
5. No element pairs a `text-*` token with a `font-<weight>` utility.
6. Exactly one `<h1>` per route, using the token named for that route in §4.1.
7. The O-swap appears on exactly the nine headlines in §5 and nowhere else.
8. `accent-watermark` is inside a 162 px-tall clipping box and is `aria-hidden`.
9. All prose run-in bold is `<strong>`, not a separate size token.
10. Body copy is never below 16 px. The only 12 px and 14 px tokens are eyebrows, chips, labels and
    button text.
