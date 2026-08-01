# components.md — AZZA Website

**Owner:** `component-architect` (Phase 1, wave 1B)
**Authority:** the component tree, every props contract, the site-wide motion contract, and **the file plan
from which Phase 2 file ownership is derived**.
**Source:** Figma `OXDVihY7WvtPZ6uGuVFx5Y`, section `672:246` "FOR BUILD" (8 frames) + component set `507:498`.
**Stack:** Next.js 15 App Router / TypeScript strict / Tailwind CSS v4.3.3.
**Reconciles:** `typography.md` · `layout.md` · `tokens.json` + `color.md` · `icons.md` · `assets.md` ·
`responsive.md` · `PLAN.md` · `DECISIONS.md` + the scaffold at `projects/azza-website/`.

---

## 0. Read this first — seven things that change what gets dispatched

1. **The type/layout/breakpoint theme layer does not exist and nobody owns it.** `tokens.generated.css`
   contains colour, radius, shadow and three blur values — **no `--font-*`, no `--text-*`, no `--breakpoint-*`,
   no `--container-*`, no section-rhythm spacing**. Those live only as proposals in `typography.md` §9,
   `layout.md` §10.1 and `responsive.md` §1.3. **Every Phase 2 agent would be writing against tokens that do
   not compile.** §12 assigns an owner. This is the single blocking item.
2. **The token pipeline physically cannot emit the type scale.** `scripts/generate-tokens.mjs` normalises every
   key with `replace(/[^a-z0-9]+/g, "-")`, so `display-hero--line-height` collapses to
   `display-hero-line-height`, and `*` normalises to the empty string and **hard-fails the build**. Tailwind v4
   requires the literal `--text-x--line-height` double dash and `--text-*: initial` for the reset. `tokens.json`
   is therefore the wrong home for the type scale. A hand-written `src/app/theme.css` is required (§12.1).
3. **`responsive.md` §4.2's worked clamp is built on a misread font size.** It treats `412:788` as a **135px**
   headline. `135` is that node's **line-height**; the font size is **164px** — verified by me directly against
   the file (§11 C-1). Nineteen implementers copying that worked example would ship the landing `<h1>` 29px too
   small and fail gate 7 on the hero of the primary route. §10.4 gives the corrected clamp for every display and
   accent step.
4. **Two agents exported the same nodes to different paths.** `design-system/icons/map-pin.svg` and
   `design-system/assets/illustration/location-pin-{1,2,3}.svg` are the same three Figma nodes; so are
   `design-system/icons/logo-azza-wordmark.svg` and `design-system/assets/brand/logo-azza-wordmark.svg`.
   Adjudicated in §11 C-2 and C-3. `map-pin` is **removed from the icon set** — the three pins are three
   different shapes, not one glyph placed three times (measured: 84.6×93.6, 87.7×92.4, 75.3×93.8).
5. **Only four sections are genuinely shared.** Top Nav, Footer, FAQ and the QR badge. `UseAzzaToday`,
   `CardDeck`, and all three "Why Azza?" bodies appear on exactly one route each. Wave 2B is a *dependency*
   wave, not a *shared* wave — do not let its membership imply reuse.
6. **`impl-blog-article` must move out of wave 2C.** It consumes `src/content/blog.ts`, which
   `impl-blog-index` owns, in the same wave. §13.2.
7. **All motion is invented. §10 is the whole of it.** No implementer invents a duration, an easing, an
   entrance, or a hover. Two things `responsive.md` §9 Tier 1 lists as existing — **parallax** and **ambient
   coin float** — are ruled out entirely rather than gated behind reduced motion (§10.9).

---

## 1. Component inventory — the tree

```
src/app/layout.tsx  (fonts, <html>, SiteChrome)
└── SiteChrome
    ├── SkipLink                                   [ui]
    ├── TopNav                                     [layout]  · all 7 routes
    │   ├── Logo                                   [ui]
    │   ├── NavDropdown ×2                         [layout]
    │   │   └── Disclosure                         [ui]
    │   ├── Button (nav CTA)                       [ui]
    │   └── MobileNavPanel                         [layout]  <lg only
    │       └── Disclosure ×2                      [ui]
    ├── <main id="main">  ← route children
    └── Footer                                     [layout]  · all 7 routes
        ├── Logo                                   [ui]
        └── FooterWatermark                        [layout]

/  ·  412:759
├── HeroLanding                412:761      ├── HeroHeadline · HeroOrnaments · Button · QrBadge
├── WhyAzzaLanding             570:434      ├── FeatureList · PhoneMockup
├── CardDeck                   412:2196     ├── DeckCard ×3 · DeckCarousel · PhoneMockup
├── Testimonials               412:1065     ├── TestimonialCard ×3 · Media · Icon(play-circle)
├── Faq                        412:1554     ├── FaqQuestionList · FaqAnswerPanel   [SHARED]
├── AzzaWrapped                412:1154     ├── WrappedBand · WrappedControls · Media
└── UseAzzaToday               412:1233     └── Pill · DisplayHeading · Button

/products/crypto-wallet  ·  412:1586
├── HeroCryptoWallet           412:1587     ├── BuyCryptoWidget · SelectPill ×2 · QrBadge
└── Faq                        412:1759                                             [SHARED]

/products/cross-border-payments  ·  412:1829
├── HeroCrossBorder            412:1854     ├── ExchangeWidget · SelectPill ×2 · QrBadge
├── WhyAzzaCrossBorder         553:287      ├── FeatureCard ×2 · PhoneMockup ×2
└── Faq                        412:1996                                             [SHARED]

/products/for-business  ·  412:2412
├── HeroBusiness               412:2436     ├── BusinessHeroArt · QrBadge
├── WhyAzzaNarrative           412:2516     ├── Pill · Prose
├── WhyAzzaSteps               458:261      ├── PhoneMockup (business screen — quarantined default)
└── Faq                        412:2633                                             [SHARED]

/blog  ·  281:56
├── BlogHero                   352:3582     ├── DisplayHeading · ArticleCard(featured)
└── AllArticles                500:2197     └── SearchField · ArticleFilters · ArticleCard ×9 · Button

/blog/[slug]  ·  282:803
└── BlogArticle                352:3681     ├── ArticleHeader · ShareRow · Media · ArticleBody(Prose)
                                            └── RelatedArticles · ArticleCard ×3

/help  ·  498:209 (closed) + 500:2281 (open)
└── HelpSupport                500:1736 / 500:2305
    ├── HelpSidebar   · SearchField · Disclosure ×n
    ├── HelpBreadcrumb                        open state only · 501:217
    ├── HelpResourceGrid · Card ×4 · Icon
    └── HelpArticle   · Prose
```

**Counts:** 22 shared primitives (`src/components/ui/`), 2 layout surfaces, 4 shared sections, 13 local
sections, 7 route files, 5 content modules.

---

## 2. Shared vs local — the rigorous list

A component is **shared** if two or more Phase 2 agents consume it. Shared components are built in an earlier
wave and imported; nobody rebuilds one.

### 2.1 Shared — `src/components/ui/**` (wave 2A)

| Component | Consumed by (agents) | Routes |
|---|---|---|
| `Section` | 15 section agents | all 7 |
| `Container` | 15 section agents | all 7 |
| `Button` | topnav, hero-landing, hero-crypto, hero-crossborder, hero-business, cta, blog-index, help-support, azza-wrapped, card-deck | all 7 |
| `Pill` | hero-crypto, hero-crossborder, hero-business, why-azza-business, cta, blog-index, blog-article | 6 |
| `Icon` | 14 agents | all 7 |
| `Logo` | topnav, footer, faq | all 7 |
| `Media` | 9 agents | 6 |
| `PhoneMockup` | why-azza-landing, why-azza-crossborder, why-azza-business, card-deck | `/`, `/products/cross-border-payments`, `/products/for-business` |
| `Card` | blog-index, blog-article, help-support, why-azza-crossborder, testimonials | 5 |
| `ArticleCard` | blog-index, blog-article | `/blog`, `/blog/[slug]` |
| `SearchField` | blog-index, help-support | `/blog`, `/help` |
| `SelectPill` | hero-crypto, hero-crossborder | 2 `/products/*` |
| `DisplayHeading` | hero-landing, hero-crypto, hero-crossborder, hero-business, faq, testimonials, cta, blog-index, card-deck | 6 |
| `Prose` | blog-article, help-support, why-azza-business | 3 |
| `Disclosure` | topnav, faq, help-support | 6 |
| `Reveal` | every section agent | all 7 |
| `StretchedLink` | blog-index, blog-article, help-support | 3 |
| `Grain` | hero-landing, azza-wrapped | `/` |
| `VisuallyHidden` | 8 agents | all 7 |
| `SkipLink` | routes-marketing (layout.tsx) | all 7 |
| `cn` (`src/lib/cn.ts`) | all | — |
| motion runtime (`src/lib/motion.ts`) | all | — |

### 2.2 Shared — sections (wave 2B)

| Component | Occurrences | Routes |
|---|---|---|
| `TopNav` | 8 frames | all 7 |
| `Footer` | 8 frames | all 7 |
| `Faq` | **4** — `412:1554`, `412:1759`, `412:1996`, `412:2633` | `/`, all 3 `/products/*` |
| `QrBadge` | **4** — `412:884`, `511:464`, `412:1990`, `412:2602` | `/`, all 3 `/products/*` |

`PLAN.md` §1 records 3 FAQs and 3 QR badges. Both are 4 (`layout.md` §5.3/§5.4; D-013 already corrected the QR
count, the FAQ count is still wrong in `PLAN.md` §1's repetition table). Neither changes the roster — one
component either way.

### 2.3 Local — one route, one owner

`HeroLanding` · `WhyAzzaLanding` · `CardDeck` · `Testimonials` · `AzzaWrapped` · `UseAzzaToday` ·
`HeroCryptoWallet` · `HeroCrossBorder` · `WhyAzzaCrossBorder` · `HeroBusiness` · `WhyAzzaNarrative` ·
`WhyAzzaSteps` · `BlogHero` + `AllArticles` · `BlogArticle` · `HelpSupport`.

**Do not abstract any of these.** `UseAzzaToday` and `CardDeck` sit in wave 2B for dependency reasons only
(the CTA is imported by one route; the deck is the longest single build). They are not shared.

---

## 3. Server vs client

Default is **server**. `"use client"` appears in **11 files** and nowhere else. Every one has a reason that is
state, an event handler, or a browser API.

| File | Reason for `"use client"` |
|---|---|
| `src/lib/motion.ts` | `useReducedMotion` subscribes to a `matchMedia` change event. |
| `ui/Disclosure.tsx` | Open/closed state, keyboard handlers, `aria-expanded`, focus return. |
| `ui/Reveal.tsx` | `IntersectionObserver`. |
| `layout/TopNav/TopNav.tsx` | Sticky-panel state, `matchMedia` breakpoint crossing, `usePathname` route-change close, scroll lock. |
| `sections/Faq/Faq.tsx` | Which question is open. |
| `sections/WhyAzzaLanding/WhyAzzaLanding.tsx` | Which feature row is expanded (`570:436` is a 7-row accordion). |
| `sections/CardDeck/CardDeck.tsx` | Scroll-linked active index, carousel scroller, reduced-motion branch. |
| `sections/Testimonials/TestimonialCard.tsx` | Play button state. |
| `sections/AzzaWrapped/WrappedControls.tsx` | Carousel prev/next + disabled ends. |
| `sections/HeroCryptoWallet/BuyCryptoWidget.tsx` | Buy/Sell tab state, amount inputs, currency selects. |
| `sections/HeroCrossBorder/ExchangeWidget.tsx` | Amount inputs, currency selects. |
| `sections/HelpSupport/HelpSupport.tsx` | Sidebar tree expansion, closed↔open article state, `<lg>` "Browse topics" disclosure. |
| `sections/BlogIndex/AllArticles.tsx` | Category filter state, 6-then-View-More state. |
| `sections/BlogArticle/ShareRow.tsx` | Copy-link + live-region announcement. |

That is 14 rows; three of them (`NavDropdown`, `MobileNavPanel`, `DeckCard`, `FaqQuestionList`,
`FaqAnswerPanel`, `ArticleFilters`, `HelpSidebar`) are **client-bundle by import**, not by directive — they are
imported from a client component and need no directive of their own. **Do not add `"use client"` to a file
that is only ever imported by a client component.** It is noise and it hides which files are real entry points.

Everything else — all four heroes' shells, `Footer`, `QrBadge`, `UseAzzaToday`, `WhyAzzaCrossBorder`,
`WhyAzzaNarrative`, `WhyAzzaSteps`, `BlogHero`, `RelatedArticles`, `ArticleBody`, every `ui` primitive not
listed above — is a **server component**. `Icon`, `Logo`, `Media`, `PhoneMockup`, `DisplayHeading`, `Prose`,
`Card`, `ArticleCard`, `Section`, `Container`, `Button`, `Pill` render no state and must stay on the server.

---

## 4. Props contracts — `src/components/ui/**`

Every signature below is a contract. Write it exactly; do not add props, do not rename, do not widen a union.

### 4.1 `Section`

```ts
// src/components/ui/Section.tsx — server
export type SectionRhythm = "standard" | "spotlight" | "final" | "flush";
//   standard  py-20  (80/80)   — 17 of 22 sections
//   spotlight py-25  (100/100) — 412:2196, 458:261
//   final     pt-0 pb-30       — 500:2197 (the blog hero's 80 supplies the seam)
//   flush     p-0              — nav, footer

export interface SectionProps {
  /** Vertical rhythm. Default "standard". */
  rhythm?: SectionRhythm;
  /** Content container. Passed straight to <Container>. Default "default" (1200). */
  container?: ContainerWidth | number;
  /** Cross-axis alignment of the container's children. Default "center". */
  align?: "center" | "start";
  /** Gap between the section heading and the section body. Default 48 (the one constant). */
  gap?: 0 | 48;
  /** Full-bleed background utility, e.g. "bg-surface-subtle". Applied to the outer <section>. */
  background?: string;
  /** overflow-hidden on the section box. Required wherever decorative art bleeds. Default false. */
  clip?: boolean;
  /** Rendered element. Default "section". */
  as?: "section" | "div";
  id?: string;
  "aria-labelledby"?: string;
  className?: string;
  children: React.ReactNode;
}
```

**Sections abut at 0px.** No `<section>` may carry `margin-block`. `layout.md` §10.3 assertion 1.

### 4.2 `Container` — the reconciliation of `layout.md` §3 and `responsive.md` §3.2

```ts
// src/components/ui/Container.tsx — server
export type ContainerWidth =
  | "bleed"    //  100%   — nav bar, footer bar, all section backgrounds
  | "deck"     //  1300   — 412:2196 → 511:364
  | "wide"     //  1280   — 412:2437, 352:3583, 500:1736, 500:2305
  | "default"  //  1200   — 553:288, 412:1854, 570:434            ← modal value
  | "grid"     //  1160   — 500:2198, 352:3584, 352:3741
  | "footer"   //  1002   — 498:600
  | "faq"      //   987   — 412:1556 and its 3 siblings
  | "article"  //   985   — 352:3682
  | "prose"    //   842   — 352:3684, 352:3707  ← reading measure, must never grow
  | "nav";     //   852   — 412:2067 + 412:2087, aligns to nothing else

export interface ContainerProps {
  /** A named width, or a literal px number for the 7 one-off section widths
   *  (1140, 1100, 1056, 1016, 955, 878, 846). Default "default". */
  width?: ContainerWidth | number;
  as?: "div" | "section" | "nav" | "header" | "footer" | "article" | "aside" | "ul" | "ol";
  className?: string;
  children: React.ReactNode;
}
```

**One mechanism, at every width:**

```css
width: min(<W>, 100% - 2 * var(--gutter));
margin-inline: auto;
```

`--gutter` steps `20 / 24 / 32 / 40 / 48 / 80` at base/`xs`/`sm`/`md`/`lg`/`xl` (`responsive.md` §3.2). At 1440
this resolves `default` to exactly 1200 inside 120px gutters — the design's own measurement — with no
hard-coded number. Above 1440 the width pins and the gutters absorb the surplus (`responsive.md` §3.3).

This is how the two artifacts are reconciled: **`layout.md` owns W (the 1440 value), `responsive.md` owns the
form.** `responsive.md` §3.2 pre-authorised exactly this ("its 1440 values win — take them and apply this
section's scaling curve"). Do not collapse the register to a single 1200 container; `layout.md` §3.1 measured
9 of 22 sections that are not 1200.

### 4.3 `Button`

```ts
// src/components/ui/Button.tsx — server
export interface ButtonProps {
  /** Colour role. Maps 1:1 onto the action.* token families in tokens.json. */
  variant?: "primary" | "brand" | "soft" | "quiet" | "chat" | "ghost"; // default "primary"
  /** Height + padding + type token.
   *  sm  → h-11 px-4  text-xs-btn   (QR badge CTA, 14px SemiBold)
   *  md  → h-12 px-5  text-sm-btn   (nav CTA 144×43 → 44, hero CTA 182×51)
   *  lg  → h-14 px-6  text-md       (253×56 "Get Started", 314×56 "Generate your Azza wrapped")
   */
  size?: "sm" | "md" | "lg";                                            // default "md"
  /** Renders <a> when href is present, <button> otherwise. Never both. */
  href?: string;
  type?: "button" | "submit";                                           // ignored when href is set
  /** Trailing glyph. arrow-right on 412:1290/1224/1228/1231/1624. gap is 8px. */
  iconRight?: IconName;
  iconLeft?: IconName;
  /** Stretch to the container. Required at <sm on every CTA per responsive.md. */
  fullWidth?: boolean;                                                  // default false
  disabled?: boolean;
  /** Required when the label is not descriptive on its own. */
  "aria-label"?: string;
  className?: string;
  children: React.ReactNode;
}
```

Radius is always `rounded-pill` (`radius.pill`, 100px — 33 nodes). Minimum target 44×44 at every breakpoint
(`responsive.md` §6.1); the nav CTA's designed 43px height is padded to 44 and that is not a fidelity defect.

### 4.4 `Pill` — eyebrow / tag / badge

```ts
// src/components/ui/Pill.tsx — server
export interface PillProps {
  /** eyebrow  → text-2xs uppercase, py-2.5 px-3, border line-emphasis   (412:1617, 412:1856,
   *             412:2439, 412:2518)
   *  tag      → text-xs, py-2 px-3, bg-surface-brand-subtle             (500:1838 blog tag chip)
   *  cta      → text-md, py-2.5 px-4, bg-action-quiet                   (412:1292 "START NOW", 146×48)
   */
  variant?: "eyebrow" | "tag" | "cta";   // default "eyebrow"
  as?: "span" | "div" | "a" | "li";      // default "span"
  href?: string;
  className?: string;
  children: React.ReactNode;
}
```

The 10px vertical padding on eyebrow pills is **deliberate and retained** (`layout.md` §1.3) — `py-2.5`.

### 4.5 `Icon` — the concrete API

Consolidates `icons.md` §7. **Implementable without re-reading `icons.md`.**

```ts
// src/components/ui/Icon/types.ts
export type IconName =
  | "arrow-right" | "bolt" | "bolt-outline" | "chevron-down" | "chevron-right"
  | "link" | "play-circle" | "receipt" | "search"
  | "share-instagram" | "share-tiktok" | "share-x"
  | "social-instagram" | "social-whatsapp" | "social-x"
  | "crypto-bnb" | "crypto-polygon" | "crypto-usdt"
  | "flag-ng" | "logo-azza-mark" | "logo-azza-wordmark";
//  21 names. `map-pin` is REMOVED — see §11 C-2.

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";  // 16 / 20 / 24 / 32 / 40
```

```ts
// src/components/ui/Icon/index.tsx — server
export interface IconProps {
  /** Required. No default — a typo must be a type error, not a blank box. */
  name: IconName;
  /** Scale step, or an explicit px number for the documented off-scale cases. Default "md" (24). */
  size?: IconSize | number;
  /** Presence of this prop is what makes the icon meaningful. Absent ⇒ decorative. */
  title?: string;
  /** Colour is set here, via a text-colour utility. There is deliberately NO `color` prop. */
  className?: string;
  /** Rotation in degrees. Only legitimate use: 180 on the Azza Wrapped "previous" arrow (F-4). */
  rotate?: 0 | 90 | 180 | 270;
}
```

**Behaviour, exactly:**

- Renders a box with **both** `width` and `height` set explicitly in px. Never `auto`.
- `display: inline-block; flex-shrink: 0; vertical-align: middle`.
- The glyph's own `viewBox` is preserved verbatim. **Never rewrite a `viewBox` to a common box** — it shifts
  the circular coin marks and the flag roundel off-centre.
- **Non-square glyphs honour their aspect ratio:** `logo-azza-wordmark` 95×32, `bolt-outline` 43×75. `size`
  sets the height and the width follows.
- **No `title`** → `aria-hidden="true" focusable="false"`, no `<title>` element. This is the default and covers
  16 of 21.
- **`title` given** → `role="img"`, `aria-labelledby` pointing at a `<title>` with a `useId()`-generated id, no
  `aria-hidden`. When the icon is the only content of a `<button>`/`<a>`, put `aria-label` on the **control**
  and leave the icon decorative. One accessible name, never two.
- **Colour model:** the 13 single-colour glyphs are authored `fill="currentColor"` and inherit from the text
  context. The 8 fixed-fill glyphs (`crypto-bnb`, `crypto-polygon`, `crypto-usdt`, `flag-ng`,
  `share-instagram`, `logo-azza-mark`, `logo-azza-wordmark`, plus the gradient in `share-instagram`) **must not
  be recoloured** — brand marks and a national flag. The component must not attempt to override them.

**Icons that need `title` by default** — `play-circle` ("Play testimonial from {name}"), `share-x`,
`share-tiktok`, `share-instagram`, `link` ("Copy link"), `logo-azza-wordmark` ("Azza — home").
Everything else is decorative.

**Delivery — no bundler change, no new dependency.**

```
src/components/ui/Icon/glyphs.tsx     one exported React element per name
```

The 21 glyphs are transcribed **verbatim** from `projects/azza-website/design-system/icons/*.svg` into JSX
(attribute names camel-cased; path `d` strings copied byte-for-byte, never re-drawn, never rounded). This is
mechanical. It is chosen over SVGR because the project builds with **webpack for `next build` and turbopack for
`next dev`** — an SVG loader would have to be configured twice in a `next.config.ts` that Phase 0 froze, and a
mismatch between the two would only surface at deploy. A typed module works identically in both, tree-shakes,
and preserves the id-namespacing `icons.md` §6 already did to make inlining safe.

**Not shipped through `Icon`:** the three location pins (they are illustration — `Media`, §4.9) and the four
Help hub-card glyphs, which do not exist in the design (`icons.md` F-2 — §11 C-6).

### 4.6 `Logo`

```ts
// src/components/ui/Logo.tsx — server
export interface LogoProps {
  /** wordmark → 95×32 (footer) / 59.4×20 (nav).  mark → 40×40 circular app mark (FAQ answer badge). */
  variant?: "wordmark" | "mark";        // default "wordmark"
  /** Rendered height in px; width follows the aspect ratio. Default 32 (wordmark) / 40 (mark). */
  height?: number;
  /** Wraps in a link to `/`. Accessible name "Azza — home". Default false. */
  asHomeLink?: boolean;
  className?: string;
}
```

Single source: `design-system/icons/logo-azza-wordmark.svg` and `logo-azza-mark.svg`, via the `Icon` glyph map.
`design-system/assets/brand/logo-azza-wordmark.svg` is the duplicate and **is not imported by anything** (§11
C-3).

### 4.7 `Media` — the concrete image API

Consolidates `assets.md` §9. **Implementable without re-reading `assets.md`.**

```ts
// src/components/ui/Media.tsx — server
import type { StaticImageData } from "next/image";

export interface MediaProps {
  /** A static import from design-system/assets/**. Never a string URL, never a Figma asset URL. */
  src: StaticImageData;
  /** "" for decorative. A real sentence for content. There is no third option. */
  alt: string;
  /** CSS aspect-ratio for the *slot*, e.g. "1160/348". Reserves layout; zero CLS is a hard requirement. */
  ratio: string;
  /** Art-directed crop change at a breakpoint. When given, renders <picture> with distinct sources
   *  rather than squashing one image with object-fit. responsive.md §10. */
  ratioMd?: string;
  ratioBase?: string;
  /** Solid placeholder behind the image while it loads. Use the sampled mean from the table below.
   *  Assets with alpha get NO placeholder — a fill behind them would show. */
  placeholderColor?: string;
  /** Above the fold at 1440×900 on this route. Everything else is lazy. Default false. */
  priority?: boolean;
  /** Required whenever the rendered width is not the intrinsic width. */
  sizes?: string;
  /** object-position. The one card that needs "top" is blog-card-naira-to-cedis. Default "center". */
  position?: "center" | "top" | "center 42%";
  /** Rounds the media box. Token name, e.g. "2xl". */
  radius?: "lg" | "xl" | "2xl" | "3xl" | "4xl" | "7xl";
  className?: string;
}
```

**Rules the component enforces so 19 agents cannot diverge:**

1. **SVG is never routed through `Media`.** Import it as a glyph (`Icon`) or an inline React component. The
   wordmark is on every route twice and must not cost a request.
2. Every raster goes through `next/image` with `fill` inside a wrapper carrying the explicit `ratio`.
3. **No `@2x` variants are hand-made.** The files in `design-system/assets/` are masters; `next/image`
   negotiates AVIF/WebP and derives the responsive set.
4. `placeholder="empty"` + a CSS background colour on the wrapper. **Never `placeholder="blur"`** — the blog
   cards are flat brand artwork and a blur-up reads as a loading artefact.
5. `pattern/texture-grain.webp` never goes through `Media`. Use `Grain` (§4.11).

**Placeholder colours** (sampled means — use verbatim):

| Asset | Colour |
|---|---|
| `blog-banner-trade-crypto-whatsapp` | `#5355E1` |
| `blog-card-ghanaian-suppliers` | `#B3ADD5` |
| `blog-card-naira-to-cedis` | `#AF6564` |
| `blog-card-naira-to-rands` | `#6364DB` |
| `blog-card-domiciliary-account` | `#534ED5` |
| `blog-card-nigerian-tax-laws` | `#4D47C5` |
| `phone-screen-whatsapp-transfer` | `#E4E3ED` |
| `testimonial-portrait-placeholder` | `#292120` |

Everything under `illustration/`, `pattern/` and `device-frame-*` has alpha → **no placeholder colour**.

**`sizes` values** (use verbatim): blog grid card `(max-width:767px) 100vw, (max-width:1023px) 50vw, 360px` ·
blog featured banner `(max-width:1279px) 100vw, 1160px` · article hero `(max-width:1023px) 100vw, 985px` ·
testimonial portrait `(max-width:767px) 80vw, 331px` · phone screen `(max-width:767px) 70vw, 363px` ·
azzaman character `(max-width:1023px) 50vw, 642px`.

**Ratios that change at a breakpoint** (require `ratioBase`/`ratioMd`, i.e. `<picture>`):

| Image | ≥`lg` | `md` | `<md` |
|---|---|---|---|
| Blog featured banner `412:2960` | `10/3` | `2/1` | `3/2` |
| Article hero `352:3706` | `985/600` | `16/9` | `3/2` |
| Article card image `500:2216` | `9/7` | `9/7` | `3/2` |

**`priority` per route** — exactly one raster is above the fold on any route, and on three of them it is the
2.3 KB QR code. `/`: `qr-whatsapp.png`. `/products/*`: `qr-whatsapp.png` (plus the three map SVGs on
`/products/for-business`, which are inline and need no preload). `/blog`:
`blog-banner-trade-crypto-whatsapp.webp`. `/blog/[slug]`: `blog-card-ghanaian-suppliers.webp` as the article
hero. `/help`: none. **Everything else is lazy.**

### 4.8 `PhoneMockup` — including the quarantine

```ts
// src/components/ui/PhoneMockup.tsx — server
export type PhoneScreen = "whatsapp-transfer" | "whatsapp-business" | "redacted";

export interface PhoneMockupProps {
  /** Which screenshot sits inside the device.
   *  DEFAULT IS "redacted". This is deliberate — see the quarantine note below. */
  screen?: PhoneScreen;
  /** Rendered device width in px. The frame is 1002×2048 intrinsic; height follows. */
  width: number;
  /** Render the separate 70%-opacity raster shadow layer. When false, a CSS drop-shadow is used.
   *  Prefer false; ship true only if the CSS does not match at 1440. Default false. */
  rasterShadow?: boolean;
  /** Alt text for the screen. Required when screen !== "redacted". */
  screenAlt?: string;
  priority?: boolean;
  className?: string;
}
```

**Geometry — measured off `507:761`, use verbatim:**

```
screen inset      left 4.99%  top 1.86%   of the device box
screen size       90.6% × 96.1% of the device box
screen radius     12.59% of the screen width
screen image fit  object-fit: cover; object-position: center 42%
```

The device body (`device-frame-phone.webp`) and the drop shadow (`device-frame-phone-shadow.webp`) are
**raster image fills, not CSS shapes**. Do not attempt to draw the device with `border-radius` and a border.

**The quarantine (D-019).** `product/phone-screen-whatsapp-business.webp` contains a legible real Nigerian
account number, account name and bank name. It is **not in the repository** and is `.gitignore`d by filename.
Therefore:

- `screen` **defaults to `"redacted"`**, which renders a flat `surface.placeholder` panel at the screen
  geometry with a `VisuallyHidden` note ("Screenshot pending — placeholder"). It ships without the asset.
- `screen="whatsapp-business"` **must not be passed by any Phase 2 agent.** It exists so that dropping a
  scrubbed screenshot at `design-system/assets/product/phone-screen-whatsapp-business.webp` and changing one
  prop is the entire fix.
- `impl-why-azza-business` builds `458:279` with `<PhoneMockup width={400} />` — no `screen` prop.
  The section is not blocked.
- `screen="whatsapp-transfer"` is the real, safe asset and serves **all four** other mockups
  (`507:764`, `570:465`, `553:298`, `553:304` — one file, md5-verified).

### 4.9 `Card`, `ArticleCard`, `StretchedLink`

```ts
// src/components/ui/Card.tsx — server
export interface CardProps {
  surface?: "page" | "raised" | "contrast" | "brand-subtle" | "accent-violet" | "accent-violet-subtle";
  radius?: "xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";   // default "3xl" (20px)
  bordered?: boolean;                                       // line-subtle. Default true when surface="raised".
  /** Adds position:relative so a StretchedLink child can cover the card, plus the hover-lift
   *  treatment and its :has(a:focus-visible) twin. Default false. */
  interactive?: boolean;
  as?: "div" | "article" | "li";
  className?: string;
  children: React.ReactNode;
}
```

```ts
// src/components/ui/StretchedLink.tsx — server
export interface StretchedLinkProps {
  href: string;
  /** The visible link text. The ::after covers the nearest positioned ancestor. */
  children: React.ReactNode;
  className?: string;
}
```

```ts
// src/components/ui/ArticleCard.tsx — server   [shared: blog-index + blog-article]
export interface ArticleCardProps {
  post: BlogPost;                       // see §7.1
  /** "featured" → 32px title (text-2xl-feature), banner ratio 10/3, full container width.
   *  "grid"     → 24px title (text-lg-card),     image ratio 9/7,   360px in a 3-up.      */
  variant?: "featured" | "grid";        // default "grid"
  priority?: boolean;
  className?: string;
}
```

`ArticleCard` is a `ui` primitive rather than a `BlogIndex` export precisely so that `impl-blog-article` never
imports from another section agent's directory.

### 4.10 `DisplayHeading` — the O-swap contract

```ts
// src/components/ui/DisplayHeading.tsx — server
export interface DisplayHeadingProps {
  /** The COMPLETE, verbatim source string, in its original case.
   *  e.g. "Your mONEY" — not "YOUR MONEY". Uppercasing happens in CSS and in the font.
   *  Screen readers and copy/paste must get the authored string. */
  children: string;
  /** Zero-based character indices in `children` whose glyph is replaced by the accent face.
   *  Data-driven and auditable. NEVER a regex over every "o" — that would corrupt the six
   *  headlines that deliberately do not carry the device. */
  swapIndices?: readonly number[];
  /** Weight of the swapped glyph, chosen to balance the display weight.
   *  Display Bold→"bold", Semi Bold→"medium", Regular→"light". */
  swapWeight?: "light" | "medium" | "bold";      // default "medium"
  /** Typography token, without the `text-` prefix. */
  step:
    | "display-hero" | "display-1" | "display-2" | "display-3" | "display-3-bold"
    | "display-4" | "display-4-tight" | "display-5" | "display-6";
  as?: "h1" | "h2" | "h3" | "p" | "span";        // default "h2"
  id?: string;
  className?: string;
}
```

The swapped `<span>` inherits `font-size`, `line-height` and `letter-spacing` unchanged. **Only
`font-family` and `font-weight` differ.**

**The nine headlines that carry the device, and nothing else:**

| Node | `children` | `step` | `swapIndices` | `swapWeight` |
|---|---|---|---|---|
| `412:788` | `Your mONEY` | `display-hero` | `[5]` | `bold` |
| `412:1066` | `what people say` | `display-1` | `[7]` | `medium` |
| `412:1286` | `use azza today!` | `display-1` | `[11]` | `medium` |
| `412:1572` | `QUESTIONS` | `display-6` | `[4]` | `medium` |
| `412:1777` | `QUESTIONS` | `display-6` | `[4]` | `medium` |
| `412:2014` | `QUESTIONS` | `display-6` | `[4]` | `medium` |
| `412:2651` | `QUESTIONS` | `display-6` | `[4]` | `medium` |
| `352:3586` | `THE AZZA BLOG` | `display-4` | `[10]` | `bold` |
| `412:2442` | `Your money should work anywhere.` | `display-2` | `[6, 12, 19]` | `light` |

**Headlines that contain an O and deliberately do NOT swap it** — verified single-segment nodes. Passing
`swapIndices` here is a defect: `412:787`, `412:1620`, `412:1859`, `374:574`/`374:629`/`374:643`,
`507:759`, `458:385`, `458:394`.

The `display-2` step keeps its **positive** `+0.03em` tracking and `Regular` weight. It is the one display step
an implementer is most likely to "correct". Do not.

**Bebas Neue is a 400-only family** (D-011). `--text-display-*--font-weight` values above 400 in
`typography.md` §9 must resolve to **400** in `theme.css` for the display ramp. Emitting `600`/`700` on a
single-weight family produces browser-synthesised faux-bold. Differentiate the roles with size and tracking,
which the ramp already varies.

### 4.11 The remaining primitives

```ts
// src/components/ui/Prose.tsx — server
export interface ProseProps {
  /** md-prose → 20/1.60 Regular, article + help body.  2xl-prose → 32/1.40 Medium, business narrative. */
  step?: "md-prose" | "2xl-prose";   // default "md-prose"
  /** Paragraph gap. 60px in the article body (352:3707), 20px in the business narrative (412:2520). */
  gap?: 20 | 60;                     // default 60
  /** Caps the reading measure at 842px. Never grows above it. Default true. */
  measure?: boolean;
  as?: "div" | "section";
  className?: string;
  children: React.ReactNode;
}
```
Run-in bold inside prose is `<strong>` at the same size/leading/tracking — **not a separate token**. Inline
prose links are underlined at Regular 400 (`link.inline`).

```ts
// src/components/ui/SearchField.tsx — server   [blog-index + help-support]
export interface SearchFieldProps {
  /** Visually hidden unless `labelVisible`. Required — the field is never label-less. */
  label: string;
  placeholder: string;
  name?: string;                      // default "q"
  defaultValue?: string;
  /** 360×58 on /blog (500:2202); 300×58 in the help sidebar (500:1739). */
  width?: number | "full";            // default "full"
  className?: string;
}
```
`surface.field` fill, `line.default` border, `radius.2xl` (16px), 16px inset padding, `search` icon at
`sm` (20). Placeholder is `field.placeholder` — it fails AA at 3.87:1 and **ships as designed** (§11 C-9).

```ts
// src/components/ui/SelectPill.tsx — server   [hero-crypto + hero-crossborder]
export interface SelectPillProps {
  /** Leading glyph — a currency flag or a coin mark. */
  icon?: IconName;
  /** The ticker or currency code, e.g. "NGN", "USDT". */
  code: string;
  /** Renders the trailing chevron-down. Default true. */
  chevron?: boolean;
  /** Accessible name for the control, e.g. "Select send currency". Required. */
  "aria-label": string;
  className?: string;
}
```
Designed heights are 42 / 44 / 24 (`412:1652`, `412:1664`, `412:1869`/`412:1883`). **All render at 44** —
`responsive.md` §6.2. `rounded-pill`.

```ts
// src/components/ui/Disclosure.tsx — client
export interface DisclosureProps {
  /** Uncontrolled default. */
  defaultOpen?: boolean;
  /** Controlled — used by Faq, where exactly one row is open at a time. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render prop so every consumer gets identical a11y wiring with its own visual. */
  children: (state: {
    open: boolean;
    toggle: () => void;
    triggerProps: React.ButtonHTMLAttributes<HTMLButtonElement>;  // id, aria-expanded, aria-controls, onClick, onKeyDown
    panelProps: React.HTMLAttributes<HTMLDivElement>;             // id, role="region", aria-labelledby, hidden
  }) => React.ReactNode;
}
```
The trigger is **always a `<button>`, never an `<a>`**, and responds to click, `Enter` and `Space`. Panel
height animates via `grid-template-rows: 0fr → 1fr` (§10.5), never `max-height` guesswork.

```ts
// src/components/ui/Reveal.tsx — client
export interface RevealProps {
  /** Stagger position. Multiplied by --motion-stagger, capped at 6. */
  index?: number;                     // default 0
  as?: "div" | "li" | "section" | "article";
  className?: string;
  children: React.ReactNode;
}
```

```ts
// src/components/ui/Grain.tsx — server
export interface GrainProps {
  /** Opacity of the multiply-blended noise field. Default 0.18. */
  opacity?: number;
  className?: string;
}
```
Absolutely-positioned `inset-0`, `pointer-events-none`, `aria-hidden`, `background-repeat: repeat`,
`mix-blend-mode: multiply`. One 359 KB asset serving six Figma layers — **load it once**.

```ts
// src/components/ui/VisuallyHidden.tsx — server
export interface VisuallyHiddenProps { as?: "span" | "div"; children: React.ReactNode }

// src/components/ui/SkipLink.tsx — server
export interface SkipLinkProps { href?: string }   // default "#main"
```

```ts
// src/lib/cn.ts
export function cn(...parts: Array<string | false | null | undefined>): string;
```
A plain join+dedupe. **Do not install `clsx` or `tailwind-merge`** — the project has three runtime dependencies
and this needs none.

```ts
// src/lib/motion.ts — client
export const MOTION: {
  instant: 80; fast: 160; base: 240; slow: 360; reveal: 520; deck: 640; stagger: 60;
};
export function useReducedMotion(): boolean;   // subscribes to matchMedia change, never reads once
export function scrollBehavior(reduced: boolean): ScrollBehavior;  // "auto" | "smooth"
```

---

## 5. Props contracts — layout surfaces

```ts
// src/components/layout/TopNav/TopNav.tsx — client
export interface TopNavProps {
  /** Marks the nav item for the current route with aria-current="page" + nav.fg-current. */
  currentPath: string;
}
```
123px tall at `lg`+; 72 at `md`/`sm`/`xs`; 64 at base. Inner island
`width: min(852px, 100% − 2×gutter); justify-content: space-between`. **Not aligned to any content
container** — do not "fix" it to 1200. Sticky, `z-50`, opaque. Below `lg` the mobile sheet replaces the
dropdowns entirely; the CTA stays in the bar (icon-only below `xs`, with the full-text CTA repeated as the
first row inside the panel).

```ts
// src/components/layout/Footer/Footer.tsx — server
export interface FooterProps { className?: string }
```
Fixed 1440×764 box, `padding 107 / 106`, inner block 1002 at x 219, `gap 89` to the wordmark band. The 89 and
the 107/106 asymmetry are **sanctioned off-scale values** (`layout.md` §1.4) — do not balance them. The
divider `498:633` reserves its zero-height flow slot and renders **no visible rule** (it is invisible against
the near-black background in the real render).

```ts
// src/components/layout/Footer/FooterWatermark.tsx — server
export interface FooterWatermarkProps { children?: string }   // default "USE AZZA"
```
`accent-watermark` (195px) inside a **162px-tall `overflow: hidden` box**, `aria-hidden="true"`. The clipping
is the design. Contrast is 1.18:1 and that is intentional and decorative (§11 C-9).

---

## 6. Props contracts — sections

Every section is a default-exported component taking the props below. Section shells consume `Section` +
`Container` and never hand-roll padding.

| Component | Props |
|---|---|
| `Faq` | `{ items: FaqItem[]; headingId?: string }` |
| `QrBadge` | `{ className?: string }` — self-positions `absolute right-[82px] top-[488px]` |
| `HeroLanding` | `{}` |
| `WhyAzzaLanding` | `{}` |
| `CardDeck` | `{}` |
| `Testimonials` | `{}` |
| `AzzaWrapped` | `{}` |
| `UseAzzaToday` | `{}` |
| `HeroCryptoWallet` | `{}` |
| `HeroCrossBorder` | `{}` |
| `WhyAzzaCrossBorder` | `{}` |
| `HeroBusiness` | `{}` |
| `WhyAzzaNarrative` | `{}` |
| `WhyAzzaSteps` | `{}` |
| `BlogHero` | `{ featured: BlogPost }` |
| `AllArticles` | `{ posts: BlogPost[] }` |
| `BlogArticle` | `{ post: BlogPost; related: BlogPost[] }` |
| `HelpSupport` | `{ topics: HelpTopic[]; article?: HelpArticle }` — `article` present ⇒ the open state |

**Sections carry their own copy.** Every string is transcribed verbatim from the Figma node by the section's
owner. Routes pass data, not text — with the four exceptions in §7, which have two consumers each.

**`QrBadge`, reconciled** (`layout.md` §5.4 resolved four disagreeing placements to one spec):

```
QR card          120 × 174     padding 12 top / 14 bottom, radius.xl, surface.contrast frame
└ column         120 × 148     V, gap 12
  ├ QR tile      120 × 102     (qr-whatsapp.png at 102 × 102, inset 9 left)
  └ caption       92 ×  34     "Text Azza on WhatsApp", text-xs-btn, centred
Placement        absolute; right: 82px; top: 488px  (relative to the hero's positioning context)
Below lg         display: none + aria-hidden  — a QR code cannot be scanned by the device rendering it
```

The whole badge is one `<a href="{wa.me link}">` whose accessible name is the caption. Never a bare `<img>`.
The landing instance's 528px offset and 105px inset are eyeballed placement drift and are **normalised to the
reconciled values**, as are the 78×36 caption box and the 119px parent width.

**`Faq`, reconciled** — one component, four instances, height driven by the question list:

```
Section          V, gap 48, py-20, align MIN|CENTER, container "faq" (987)
├ heading        "Frequently Asked Questions"  (text-2xl)
└ card           987 × auto, radius.6xl, surface.contrast
  ├ backdrop     pattern-lightning-bolt.webp, clipped         (flat fill below lg)
  ├ left panel   447 wide @ inset 28/28 — "QUESTIONS" (DisplayHeading display-6) + rows, V gap 12
  ├ answer panel 393 wide @ x 535, radius.bubble, shadow.card, surface.answer
  └ brand chip   102 × 40 @ top-right — Logo variant="mark" + "Azza" (text-lg, fg.on-contrast)
Card insets      28 top / 28 left / 24 bottom / 59 right   ← asymmetric, sanctioned
Answer padding   32 / 40                                    ← normalised from 38
```

**One DOM, two presentations, zero reordering** (`responsive.md` §7.2.5). Each question is immediately
followed *in source order* by its own answer panel. The desktop two-pane look is pure CSS Grid placement
(`447fr 393fr`, answers at `grid-column: 2; grid-row: 1 / -1`); below `lg` it becomes `1fr` and the panels fall
under their questions. No duplicated markup, no `order:`. Exactly one question open at a time; the first is
open at rest.

---

## 7. Content modules

Five files. Each has **exactly one writer**; every other consumer imports.

### 7.1 `src/content/blog.ts` — writer `impl-blog-index`

```ts
export interface BlogPost {
  slug: string;
  title: string;               // the card <h3> string — longer than the headline baked into the image
  standfirst?: string;
  category: "Finance" | "Education" | "Crypto" | "Technology";
  date: string;                // ISO 8601
  readingTime?: string;
  image: StaticImageData;      // one of the FIVE unique bitmaps — nine cards, five files
  imageAlt: string;
  placeholderColor: string;
  featured?: boolean;
}
export const BLOG_POSTS: readonly BlogPost[];
export function getPost(slug: string): BlogPost | undefined;
export function getRelated(slug: string, count?: number): BlogPost[];
```

**There are five blog images, not ten.** `image 4` appears four times, `image 3` and `image 5` three times
each (md5-verified). The `/blog/[slug]` article hero is byte-identical to the `/blog` featured card. Reference
the five files from the array; do not write ten import statements.

### 7.2 `src/content/faq.ts` — writer `impl-faq`

```ts
export interface FaqItem { id: string; question: string; answer: string }
export const FAQ_LANDING: readonly FaqItem[];        // 412:1562–412:1570  (5 rows)
export const FAQ_CRYPTO_WALLET: readonly FaqItem[];  // 412:1767–412:1775
export const FAQ_CROSS_BORDER: readonly FaqItem[];
export const FAQ_BUSINESS: readonly FaqItem[];       // 3 rows — card 561 tall, not 712
```

Transcribe verbatim, **including the defects**: `412:1566`, `412:1568` and `412:1570` are all "Supported Local
Currency?" on the landing FAQ, and `412:1565` reads "Why should i doo KYC?". Both are source-file defects
(`responsive.md` §14.3). Reproduce them and let the operator decide; do not silently correct copy.

### 7.3 `src/content/navigation.ts` — writer `impl-topnav`

```ts
export interface NavLink { label: string; href: string }
export interface NavDropdownItem extends NavLink { icon: IconName; description?: string }
export interface NavItem extends NavLink { items?: readonly NavDropdownItem[] }
export const PRIMARY_NAV: readonly NavItem[];   // Products▾ (94:850, 3 rows) · Socials▾ (63:350, 3 rows) · Blog · About Us
export const NAV_CTA: NavLink;                  // "Chat with Azza" → wa.me
```

### 7.4 `src/content/footer.ts` — writer `impl-footer`

```ts
export interface FooterColumn { heading: string; links: readonly NavLink[] }
export const FOOTER_COLUMNS: readonly FooterColumn[];  // Products 199 · Resources 128 · Company 116 · Contact 119
export const FOOTER_LEGAL: { rc: string; copyright: string; rights: string };
```
Columns are **unequal widths** — build with `flex gap-20`, not a grid, which would wrongly equalise them.

### 7.5 `src/content/help.ts` — writer `impl-help-support`

```ts
export interface HelpTopic { id: string; label: string; href: string; children?: readonly HelpTopic[] }
export interface HelpArticle { title: string; breadcrumb: readonly NavLink[]; body: string }
export const HELP_TOPICS: readonly HelpTopic[];
export const HELP_RESOURCES: readonly { title: string; body: string; icon: IconName; href: string }[];
export const HELP_COMMUNITY: readonly { label: string; icon: IconName; href: string }[];
```

**The `/help` open state is entirely lorem** (`500:2368`, `501:219`, `501:220`, `501:224`, `501:225`,
`501:233`, `501:234`). It cannot satisfy gate 10 without operator-supplied copy. `impl-help-support` builds
the structure and marks the body an explicit placeholder; it does not invent article copy.

---

## 8. Ownership map — the file plan

**Every path appears exactly once. No two agents in a wave write the same file or the same directory.**

### Wave 2A — `impl-primitives` (alone)

| Path | Component | Shared | Server/Client |
|---|---|---|---|
| `src/app/theme.css` | type / layout / breakpoint / motion `@theme` layer | — | — |
| `src/app/globals.css` | **+1 import line only** (see §12.2) | — | — |
| `tsconfig.json` | **+1 path alias only** — `"@design-system/*": ["./design-system/*"]` | — | — |
| `src/lib/cn.ts` | `cn` | shared | — |
| `src/lib/motion.ts` | `MOTION`, `useReducedMotion` | shared | client |
| `src/components/ui/Section.tsx` | `Section` | shared | server |
| `src/components/ui/Container.tsx` | `Container` | shared | server |
| `src/components/ui/Button.tsx` | `Button` | shared | server |
| `src/components/ui/Pill.tsx` | `Pill` | shared | server |
| `src/components/ui/Card.tsx` | `Card` | shared | server |
| `src/components/ui/ArticleCard.tsx` | `ArticleCard` | shared | server |
| `src/components/ui/StretchedLink.tsx` | `StretchedLink` | shared | server |
| `src/components/ui/DisplayHeading.tsx` | `DisplayHeading` | shared | server |
| `src/components/ui/Prose.tsx` | `Prose` | shared | server |
| `src/components/ui/Icon/index.tsx` | `Icon` | shared | server |
| `src/components/ui/Icon/glyphs.tsx` | 21 glyph elements | shared | server |
| `src/components/ui/Icon/types.ts` | `IconName`, `IconSize` | shared | — |
| `src/components/ui/Logo.tsx` | `Logo` | shared | server |
| `src/components/ui/Media.tsx` | `Media` | shared | server |
| `src/components/ui/PhoneMockup.tsx` | `PhoneMockup` | shared | server |
| `src/components/ui/SearchField.tsx` | `SearchField` | shared | server |
| `src/components/ui/SelectPill.tsx` | `SelectPill` | shared | server |
| `src/components/ui/Disclosure.tsx` | `Disclosure` | shared | **client** |
| `src/components/ui/Reveal.tsx` | `Reveal` | shared | **client** |
| `src/components/ui/Grain.tsx` | `Grain` | shared | server |
| `src/components/ui/VisuallyHidden.tsx` | `VisuallyHidden` | shared | server |
| `src/components/ui/SkipLink.tsx` | `SkipLink` | shared | server |
| `src/components/ui/index.ts` | barrel — **the single import path for all 18 consumers** | — | — |

### Wave 2B — 9 agents, disjoint directories

| Path | Owner | Component | Shared | S/C |
|---|---|---|---|---|
| `src/components/layout/TopNav/TopNav.tsx` | `impl-topnav` | `TopNav` | shared | **client** |
| `src/components/layout/TopNav/NavDropdown.tsx` | `impl-topnav` | `NavDropdown` | local | client-bundle |
| `src/components/layout/TopNav/MobileNavPanel.tsx` | `impl-topnav` | `MobileNavPanel` | local | client-bundle |
| `src/components/layout/TopNav/index.ts` | `impl-topnav` | barrel | — | — |
| `src/content/navigation.ts` | `impl-topnav` | nav data | shared | — |
| `src/components/layout/Footer/Footer.tsx` | `impl-footer` | `Footer` | shared | server |
| `src/components/layout/Footer/FooterWatermark.tsx` | `impl-footer` | `FooterWatermark` | local | server |
| `src/components/layout/Footer/index.ts` | `impl-footer` | barrel | — | — |
| `src/content/footer.ts` | `impl-footer` | footer data | shared | — |
| `src/components/sections/Faq/Faq.tsx` | `impl-faq` | `Faq` | shared | **client** |
| `src/components/sections/Faq/FaqQuestionList.tsx` | `impl-faq` | `FaqQuestionList` | local | client-bundle |
| `src/components/sections/Faq/FaqAnswerPanel.tsx` | `impl-faq` | `FaqAnswerPanel` | local | client-bundle |
| `src/components/sections/Faq/index.ts` | `impl-faq` | barrel | — | — |
| `src/content/faq.ts` | `impl-faq` | 4 question sets | shared | — |
| `src/components/sections/QrBadge/QrBadge.tsx` | `impl-qr-badge` | `QrBadge` | shared | server |
| `src/components/sections/QrBadge/index.ts` | `impl-qr-badge` | barrel | — | — |
| `src/components/sections/WhyAzzaLanding/WhyAzzaLanding.tsx` | `impl-why-azza-landing` | `WhyAzzaLanding` `570:434` | local | **client** |
| `src/components/sections/WhyAzzaLanding/FeatureList.tsx` | `impl-why-azza-landing` | `FeatureList` `570:436` | local | client-bundle |
| `src/components/sections/WhyAzzaLanding/index.ts` | `impl-why-azza-landing` | barrel | — | — |
| `src/components/sections/WhyAzzaCrossBorder/WhyAzzaCrossBorder.tsx` | `impl-why-azza-crossborder` | `553:287` | local | server |
| `src/components/sections/WhyAzzaCrossBorder/FeatureCard.tsx` | `impl-why-azza-crossborder` | `553:292` / `553:299` | local | server |
| `src/components/sections/WhyAzzaCrossBorder/index.ts` | `impl-why-azza-crossborder` | barrel | — | — |
| `src/components/sections/WhyAzzaBusiness/WhyAzzaNarrative.tsx` | `impl-why-azza-business` | `412:2516` | local | server |
| `src/components/sections/WhyAzzaBusiness/WhyAzzaSteps.tsx` | `impl-why-azza-business` | `458:261` | local | server |
| `src/components/sections/WhyAzzaBusiness/index.ts` | `impl-why-azza-business` | barrel | — | — |
| `src/components/sections/UseAzzaToday/UseAzzaToday.tsx` | `impl-cta` | `412:1233` | local | server |
| `src/components/sections/UseAzzaToday/index.ts` | `impl-cta` | barrel | — | — |
| `src/components/sections/CardDeck/CardDeck.tsx` | `impl-card-deck` | `CardDeck` | local | **client** |
| `src/components/sections/CardDeck/DeckCard.tsx` | `impl-card-deck` | `DeckCard` | local | client-bundle |
| `src/components/sections/CardDeck/DeckCarousel.tsx` | `impl-card-deck` | `<lg` carousel | local | client-bundle |
| `src/components/sections/CardDeck/deck-content.ts` | `impl-card-deck` | 3 card records | local | — |
| `src/components/sections/CardDeck/index.ts` | `impl-card-deck` | barrel | — | — |

### Wave 2C — 8 agents, disjoint directories

| Path | Owner | Component | S/C |
|---|---|---|---|
| `src/components/sections/HeroLanding/HeroLanding.tsx` | `impl-hero-landing` | `412:761` | server |
| `src/components/sections/HeroLanding/HeroHeadline.tsx` | `impl-hero-landing` | `412:786` + `412:860` | server |
| `src/components/sections/HeroLanding/HeroOrnaments.tsx` | `impl-hero-landing` | the four coin glyphs | server |
| `src/components/sections/HeroLanding/index.ts` | `impl-hero-landing` | barrel | — |
| `src/components/sections/Testimonials/Testimonials.tsx` | `impl-testimonials` | `412:1065` | server |
| `src/components/sections/Testimonials/TestimonialCard.tsx` | `impl-testimonials` | `412:1068` etc. | **client** |
| `src/components/sections/Testimonials/index.ts` | `impl-testimonials` | barrel | — |
| `src/components/sections/AzzaWrapped/AzzaWrapped.tsx` | `impl-azza-wrapped` | `412:1154` | server |
| `src/components/sections/AzzaWrapped/WrappedBand.tsx` | `impl-azza-wrapped` | `412:1155` | server |
| `src/components/sections/AzzaWrapped/WrappedControls.tsx` | `impl-azza-wrapped` | `412:1221` | **client** |
| `src/components/sections/AzzaWrapped/index.ts` | `impl-azza-wrapped` | barrel | — |
| `src/components/sections/HeroCryptoWallet/HeroCryptoWallet.tsx` | `impl-hero-crypto` | `412:1587` | server |
| `src/components/sections/HeroCryptoWallet/BuyCryptoWidget.tsx` | `impl-hero-crypto` | `412:1626` | **client** |
| `src/components/sections/HeroCryptoWallet/index.ts` | `impl-hero-crypto` | barrel | — |
| `src/components/sections/HeroCrossBorder/HeroCrossBorder.tsx` | `impl-hero-crossborder` | `412:1854` | server |
| `src/components/sections/HeroCrossBorder/ExchangeWidget.tsx` | `impl-hero-crossborder` | `412:1861` | **client** |
| `src/components/sections/HeroCrossBorder/index.ts` | `impl-hero-crossborder` | barrel | — |
| `src/components/sections/HeroBusiness/HeroBusiness.tsx` | `impl-hero-business` | `412:2436` | server |
| `src/components/sections/HeroBusiness/BusinessHeroArt.tsx` | `impl-hero-business` | `412:2444/2453/2465` + 3 pins | server |
| `src/components/sections/HeroBusiness/index.ts` | `impl-hero-business` | barrel | — |
| `src/components/sections/HelpSupport/HelpSupport.tsx` | `impl-help-support` | `500:1736` + `500:2305` | **client** |
| `src/components/sections/HelpSupport/HelpSidebar.tsx` | `impl-help-support` | `500:1738` / `500:2307` | client-bundle |
| `src/components/sections/HelpSupport/HelpResourceGrid.tsx` | `impl-help-support` | `500:1770` / `500:1783` | client-bundle |
| `src/components/sections/HelpSupport/HelpArticle.tsx` | `impl-help-support` | `500:2365` | client-bundle |
| `src/components/sections/HelpSupport/HelpBreadcrumb.tsx` | `impl-help-support` | `501:217` | client-bundle |
| `src/components/sections/HelpSupport/index.ts` | `impl-help-support` | barrel | — |
| `src/content/help.ts` | `impl-help-support` | help data | — |
| `src/components/sections/BlogIndex/BlogHero.tsx` | `impl-blog-index` | `352:3582` | server |
| `src/components/sections/BlogIndex/AllArticles.tsx` | `impl-blog-index` | `500:2197` | **client** |
| `src/components/sections/BlogIndex/ArticleFilters.tsx` | `impl-blog-index` | `500:2207` | client-bundle |
| `src/components/sections/BlogIndex/index.ts` | `impl-blog-index` | barrel | — |
| `src/content/blog.ts` | `impl-blog-index` | 9 posts / 5 images | — |

### Wave 2D — 3 agents (see §13.2), disjoint trees

| Path | Owner | Contents |
|---|---|---|
| `src/components/sections/BlogArticle/BlogArticle.tsx` | `impl-blog-article` | `352:3681` shell |
| `src/components/sections/BlogArticle/ArticleHeader.tsx` | `impl-blog-article` | `352:3684` |
| `src/components/sections/BlogArticle/ArticleBody.tsx` | `impl-blog-article` | `352:3707` |
| `src/components/sections/BlogArticle/ShareRow.tsx` | `impl-blog-article` | `352:3694` / `352:3724` — **client** |
| `src/components/sections/BlogArticle/RelatedArticles.tsx` | `impl-blog-article` | `352:3741` |
| `src/components/sections/BlogArticle/index.ts` | `impl-blog-article` | barrel |
| `src/app/layout.tsx` | `impl-routes-marketing` | fonts + `SiteChrome` + `<noscript>` reveal override |
| `src/components/layout/SiteChrome.tsx` | `impl-routes-marketing` | SkipLink + TopNav + `<main id="main">` + Footer |
| `src/app/page.tsx` | `impl-routes-marketing` | `/` |
| `src/app/products/crypto-wallet/page.tsx` | `impl-routes-marketing` | `/products/crypto-wallet` |
| `src/app/products/cross-border-payments/page.tsx` | `impl-routes-marketing` | `/products/cross-border-payments` |
| `src/app/products/for-business/page.tsx` | `impl-routes-marketing` | `/products/for-business` |
| `src/app/blog/page.tsx` | `impl-routes-content` | `/blog` |
| `src/app/blog/[slug]/page.tsx` | `impl-routes-content` | `/blog/[slug]` |
| `src/app/help/page.tsx` | `impl-routes-content` | `/help` |

**Collision check performed.** 96 paths, 96 distinct. The only files touched by more than one wave across the
whole run are `src/app/globals.css` and `tsconfig.json`, each written once (wave 2A) and never again;
`src/app/layout.tsx` is written once (wave 2D). `src/app/tokens.generated.css` and `tokens.json` are written by
**no Phase 2 agent** — they remain the token pipeline's output and `color-token-expert`'s artifact.

---

## 9. Build order — the dependency edges

```
theme.css ─┬─> every component            (tokens must compile first)
src/lib   ─┘

ui/*  ──────> layout/*  ──┐
      ──────> sections/* ─┤
                          ├──> app/*
content/navigation ───────┤
content/footer     ───────┤
content/faq        ───────┤
content/help       ───────┤
content/blog ──> BlogArticle, app/blog/*
QrBadge ──> HeroLanding, HeroCryptoWallet, HeroCrossBorder, HeroBusiness
ui/ArticleCard ──> BlogHero, AllArticles, RelatedArticles
ui/PhoneMockup ──> WhyAzzaLanding, WhyAzzaCrossBorder, WhyAzzaSteps, DeckCard
ui/Disclosure ──> TopNav, Faq, HelpSupport, MobileNavPanel
ui/DisplayHeading ──> 9 headline sites across 6 routes
TopNav, Footer ──> SiteChrome ──> app/layout.tsx
```

**Hard edges that set the waves:**

| Edge | Consequence |
|---|---|
| `theme.css` + `ui/**` → everything | 2A must complete and typecheck before 2B dispatches. |
| `QrBadge` → 4 heroes | `impl-qr-badge` in 2B, heroes in 2C. Already correct in `PLAN.md`. |
| `content/blog.ts` → `BlogArticle` | **Currently a same-wave edge.** §13.2 moves `impl-blog-article` to 2D. |
| `content/faq.ts` → routes | 2B → 2D. ✓ |
| `TopNav` + `Footer` → `SiteChrome` → `layout.tsx` | 2B → 2D. ✓ |
| `layout.tsx` (fonts) → visual correctness of everything | 2A/2B/2C build and typecheck without it; they render in the **fallback** stacks. Expected, not a defect. §12.3. |

**Non-edges, stated so nobody serialises on them:** no section imports another section. No section imports a
route. `impl-routes-content` does not depend on `impl-routes-marketing` at build time — Next composes
`layout.tsx` around the pages; it is not imported by them.

---

## 10. The motion contract — the whole of it

The Figma file contains **zero authored motion** (`get_motion_context` recursive → `{"nodes": []}`, D-008).
Everything below is invented, once, here. **No implementer defines a duration, an easing curve, an entrance,
or a hover treatment.** If a section needs motion this section does not describe, that is a gap — raise it in
`open_questions`; do not fill it locally.

### 10.1 The design rationale, in one paragraph

AZZA is a WhatsApp-first consumer money product with an ultra-condensed uppercase display face, pill geometry
everywhere, and one genuinely elaborate interaction (the card deck). The motion follows that: **quick,
decelerating, and almost entirely opacity-and-position.** There is exactly **one** overshoot curve and it is
spent in two places — the deck promotion and the pill press-release. Everything else is flat deceleration.
No scale-on-hover, no parallax, no ambient float, no blur transitions, no skeletons. The deck is the signature;
everything around it stays quiet. That is the whole point of §10.9.

### 10.2 Duration scale

Declared in `theme.css`. Reference as `duration-(--motion-base)` or `var(--motion-base)`.

| Token | Value | Used for |
|---|---|---|
| `--motion-instant` | `80ms` | Press states; focus box-shadow; icon colour change. |
| `--motion-fast` | `160ms` | Hover on small controls — links, nav items, chips, icon buttons. |
| `--motion-base` | `240ms` | **Default state change.** Accordion, dropdown open, tab switch, card hover-lift, chevron rotation, FAQ answer crossfade. |
| `--motion-slow` | `360ms` | Mobile nav sheet open; modal-scale surfaces. |
| `--motion-reveal` | `520ms` | Scroll entrance. |
| `--motion-deck` | `640ms` | Card-deck promotion. The longest thing on the site, and the only thing that earns it. |
| `--motion-stagger` | `60ms` | Per-child delay in a staggered group. |

**Nothing is longer than 640ms. Nothing outside the deck is longer than 520ms.**

### 10.3 Easing

| Token | Curve | Used for |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | **Default.** Every entrance, every open, every hover-in. |
| `--ease-in` | `cubic-bezier(0.64, 0, 0.78, 0)` | Every exit, every close, every hover-out. |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Position changes that travel in both directions — chevron rotation, disclosure height, carousel scroll. |
| `--ease-spring` | `cubic-bezier(0.34, 1.32, 0.64, 1)` | **Two uses only:** card-deck promotion, and the release phase of a pill press. Using it anywhere else is a defect. |

Asymmetry is deliberate: things open on `--ease-out` and close faster on `--ease-in`, because a slow dismissal
reads as lag.

### 10.4 Entrance — `Reveal`

One entrance verb site-wide: **fade up 16px.** No scale entrances, no blur entrances, no directional variety
per section.

```css
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity   var(--motion-reveal) var(--ease-out) var(--reveal-delay, 0ms),
      transform var(--motion-reveal) var(--ease-out) var(--reveal-delay, 0ms);
  }
  .reveal[data-in="true"] { opacity: 1; transform: none; }
}
```

- `IntersectionObserver`, `threshold: 0`, `rootMargin: "0px 0px -12% 0px"`. Fires **once**, then unobserves.
- Stagger: `--reveal-delay: calc(min(index, 6) * var(--motion-stagger))`. **Capped at 6** so a nine-card blog
  grid does not take 540ms to finish arriving.
- **`Reveal` is never applied to:** the `<h1>` of any route or anything else above the fold at 1440×900 (it is
  the LCP element and must paint immediately); `TopNav`; `Footer`; `FooterWatermark`; anything inside
  `CardDeck` (the deck owns its own scroll-driven motion and a reveal would fight it); `QrBadge`.
- **SSR and no-JS safety.** The hidden from-state lives only inside
  `@media (prefers-reduced-motion: no-preference)`, and `layout.tsx` ships
  `<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>`. A reduced-motion
  user, a no-JS user and a crawler all get the final state. **Never leave an element at `opacity: 0` when the
  animation does not run** — that is the single most common reduced-motion bug and it makes content invisible,
  which is worse than the animation was.

**Where entrances are used:** section headings, card grids (blog 3-up, help resource 2-up, testimonial 3-up,
feature 2-up), the Why-Azza feature list, the Azza Wrapped stat callouts, the footer link columns. **Not** on
body paragraphs, not on individual list items inside a card, not on icons.

### 10.5 Disclosure — accordion, dropdown, sheet

| Surface | Property | Duration | Easing |
|---|---|---|---|
| Panel height (all) | `grid-template-rows: 0fr → 1fr` | `--motion-base` | `--ease-in-out` |
| Panel content opacity | `0 → 1`, `40ms` delay on open, `0` on close | `--motion-fast` | `--ease-out` / `--ease-in` |
| Chevron | `rotate(0 → 180deg)` | `--motion-base` | `--ease-in-out` |
| Nav dropdown | `opacity 0→1` + `translateY(-6px → 0)` | open `--motion-base` / close `--motion-fast` | `--ease-out` / `--ease-in` |
| Mobile sheet | `translateY(-100% → 0)` | open `--motion-slow` / close `--motion-base` | `--ease-out` / `--ease-in` |
| Sheet backdrop | `opacity 0 → 1` | `--motion-base` | `--ease-out` |
| FAQ answer swap (≥`lg`) | **crossfade only** — `opacity` | `--motion-base` | `--ease-out` |

**Use `grid-template-rows: 0fr → 1fr`, never `max-height`.** A guessed `max-height` either clips long answers
or produces a visible delay before short ones start moving.

**Never animate the FAQ answer panel's height at `lg`+** — the two-pane grid holds a fixed column; only the
content crossfades. Below `lg` it is a normal accordion and the height rule above applies.

Desktop nav dropdowns also open on hover with a **150ms close delay**, so a diagonal mouse path to the panel
does not dismiss it. Hover-open is additive; click / `Enter` / `Space` / `ArrowDown` always work.

### 10.6 Hover and press

All hover rules live inside:

```css
@media (hover: hover) and (pointer: fine) { /* … */ }
```

Unguarded `:hover` sticks after a tap on iOS Safari. This is a reproducible bug, not a theoretical one.

| Element | Hover | Press | Duration |
|---|---|---|---|
| Button / pill | `background-color` → the `*-hover` token | `background-color` → `*-active` **and** `translateY(1px)` | `--motion-fast` in, `--motion-instant` on press, release on `--ease-spring` |
| Link / nav item | `color` → `link.hover` / `nav.fg-hover` | `color` → `link.active` | `--motion-fast` |
| Card (`interactive`) | `translateY(-4px)` + `shadow.hover-lift` | — | `--motion-base` |
| Dropdown row | `background-color` → `nav.dropdown-item-hover` | — | `--motion-fast` |
| FAQ question row | `background-color` → `accordion.row-hover` | — | `--motion-fast` |
| Icon-only control | `color` only | `translateY(1px)` | `--motion-instant` |

**No `transform: scale()` on hover, anywhere.** Scaling a text-bearing card resamples type and reads cheap on
a 164px display face. The card lift is `translateY` only.

**Every hover style has a `:focus-visible` twin.** No interactive state is communicated by hover alone. On a
card, the lift is mirrored with `:has(a:focus-visible)` on the card itself, so keyboard users get the same
affordance.

### 10.7 Focus

- `:focus-visible` → `outline: 2px solid var(--color-focus-ring); outline-offset: 2px`, switching to
  `--color-focus-ring-inverse` on any `surface.inverse*`.
- **The outline itself is never transitioned.** A 160ms focus ring reads as lag during keyboard navigation.
  A `box-shadow` focus ring may transition at `--motion-instant`.
- `outline: none` without a replacement is a defect, everywhere, always.

### 10.8 Scroll

```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
html { scroll-padding-top: var(--height-nav); }
```

- `scroll-padding-top` is unconditional — anchor targets must clear the sticky nav regardless of motion
  preference.
- Programmatic scrolling always goes through `scrollBehavior(reduced)` from `src/lib/motion.ts`. Never a
  hard-coded `behavior: "smooth"`.
- **Card deck, `xl`/`2xl`:** `position: sticky; top: var(--height-nav); height: 100dvh` inside a `~280vh`
  scroll track, three beats. Promotion animates on `--motion-deck` / `--ease-spring`. `z-index` steps at the
  midpoint of the transition — it is not a transitionable property. `will-change: transform` is applied **only
  while the section is intersecting** and removed on exit.
- **No scroll-jacking.** `position: sticky` plus a scroll-linked index, not `preventDefault` on wheel events.
  If JS fails the section degrades to a plain long section with three legible cards.
- **Card deck, `<lg`:** native `scroll-snap-type: x mandatory`. **No custom drag or pointer handler** — a
  hand-rolled gesture layer loses momentum, rubber-banding and accessibility, and reliably fights the browser.

### 10.9 What is deliberately not built

Stated explicitly so nineteen agents do not each decide for themselves, and so a Phase 3 auditor knows an
absence is intentional:

| Not built | Why |
|---|---|
| **Parallax** on `412:1155` (Azza Wrapped) or `412:1234` (CTA art) | Both are absolutely composed at fractional coordinates with negative offsets. Parallax tears them. `responsive.md` §9 Tier 1 lists parallax as something to *remove under reduced motion*, implying it exists; I am ruling it out at every setting. |
| **Ambient float** on the deck coin art `507:729` / `507:739` | Competes with the deck's own promotion, which is the site's signature motion. One bold thing, not two. |
| **The "AZZA BLOG" marquee** `374:574` / `374:629` / `374:643` | Those nodes sit inside hidden group `634:246` and are **not rendered in the design at all** (§11 C-4). |
| **Skeletons / blur-up placeholders** | `assets.md` §6.3: flat brand artwork with a solid placeholder colour. A shimmer would read as a loading artefact on artwork that is already flat. |
| **Page-transition animation** | Nothing in the design implies one, and it delays every navigation on a WhatsApp-first product. |
| **Back-to-top, reading-progress bar, scroll-spy** | None is in the design. Inventing chrome is a larger fidelity risk than a long scroll. |
| **Autoplay of anything** | The testimonial play controls (`412:1071`, `412:1079`, `412:1087`) are user-initiated only, at every motion setting. |
| **Counting-up stat numerals** in Azza Wrapped | The figures already contradict each other in the source (§11 C-8); animating them would draw the eye to the defect. |

### 10.10 `prefers-reduced-motion` — three tiers

Adopted from `responsive.md` §9 without change, because it is right. Restated here so it is enforceable from
one document.

**Tier 1 — decorative motion is *removed*, and the final state is *set*.** Scroll reveals, staggers, hover
lift/zoom, the footer wordmark treatment. See the `Reveal` rule in §10.4 — the from-state is never applied.

**Tier 2 — functional motion is *instant*, not absent.** Accordions, nav panel, chevron rotation, carousel
scroll, focus transitions. The state change still happens; it is simply immediate
(`transition-duration: 0.01ms`, `scroll-behavior: auto`, `scrollIntoView({ behavior: "auto" })`). Removing the
state change entirely would break the component.

**Tier 3 — structural change, the card deck only.** Under `prefers-reduced-motion: reduce`, at **every**
breakpoint: no sticky stage, no scroll track, no horizontal scroller, no fan. Three static full-width cards in
a vertical stack, DOM order 1, 2, 3, each fully legible, section height `auto`. It is the one component whose
meaning is carried by motion and the one place reduced motion changes layout.

**The global floor** (in `theme.css`, not a substitute for the tiers above):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**JS rule:** read `window.matchMedia("(prefers-reduced-motion: reduce)")` **and subscribe to `change`**.
Reading once at mount misses a user who changes the setting mid-session — a real scenario, because people
toggle it when they start feeling unwell. `useReducedMotion` in `src/lib/motion.ts` does this; nothing else
may read the query directly.

---

## 11. Conflicts found between peer artifacts, and how each was adjudicated

Ten conflicts. Each names the two sources and the evidence used. **The Figma file was the tiebreaker in C-1
and C-2**; I read both nodes directly.

### C-1 — `responsive.md`'s fluid-type worked example is built on a misread font size. **CRITICAL.**

- **`typography.md` §3.1** — `412:788` is `display-hero`: **164px**, line-height 135px (0.82), Bold.
- **`responsive.md` §4.2** — "the 135px display headline (`412:788`, `412:1066`, `412:1286`)", producing
  `--text-display-1: clamp(2.5rem, 0.8036rem + 8.4821vw, 8.4375rem)` — an 8.4375rem (135px) ceiling.
- **Adjudicated against the file.** `get_design_context` on `412:786` returns
  `text-[164px] … leading-[135px] tracking-[-1.64px]` on `412:787`, and `412:788` carries the same
  `text-[164px]`/`tracking-[-1.64px]` with `leading-[135px]` on its spans. `135` is the **leading**.
  `typography.md` read `fontSize` through the Plugin API; `responsive.md` inferred it from node geometry.
- **Ruling: `typography.md` wins on every value.** `responsive.md` §4.2's own protocol pre-authorises this
  ("typography.md's 1440 value wins and becomes the `S` term"). It owns the *method*, not the numbers.
- **Consequence if unfixed:** the landing `<h1>` renders 29px short at 1440 and gate 7 fails on the primary
  route's hero. `412:1066` and `412:1286` are `display-1` at **140px**, not 135 either.
- **Resolution — the corrected clamp for every role ≥32px.** Built with `responsive.md` §4.2's formula and
  `typography.md` §3's values. Each max term is the exact Figma value, and each preferred term carries a `rem`
  component so WCAG 1.4.4 holds.

| Token | S (px) | Floor F | `clamp(...)` |
|---|---:|---:|---|
| `display-hero` | 164 | 40 | `clamp(2.5rem, 0.2857rem + 11.0714vw, 10.25rem)` |
| `display-1` | 140 | 38 | `clamp(2.375rem, 0.5536rem + 9.1071vw, 8.75rem)` |
| `display-2` | 136 | 36 | `clamp(2.25rem, 0.4643rem + 8.9286vw, 8.5rem)` |
| `display-3`, `display-3-bold` | 128 | 36 | `clamp(2.25rem, 0.6071rem + 8.2143vw, 8rem)` |
| `display-4`, `display-4-tight` | 100 | 34 | `clamp(2.125rem, 0.9464rem + 5.8929vw, 6.25rem)` |
| `display-5` | 96 | 34 | `clamp(2.125rem, 1.0179rem + 5.5357vw, 6rem)` |
| `display-6` | 64 | 32 | `clamp(2rem, 1.4286rem + 2.8571vw, 4rem)` |
| `accent-watermark` | 195 | 48 | `clamp(3rem, 0.375rem + 13.125vw, 12.1875rem)` |
| `accent-1` | 86 | 32 | `clamp(2rem, 1.0357rem + 4.8214vw, 5.375rem)` |
| `accent-2` | 74 | 32 | `clamp(2rem, 1.25rem + 3.75vw, 4.625rem)` |
| `accent-3` | 56 | 30 | `clamp(1.875rem, 1.4107rem + 2.3214vw, 3.5rem)` |
| `accent-4` | 42 | 26 | `clamp(1.625rem, 1.3393rem + 1.4286vw, 2.625rem)` |
| `accent-num` | 40 | 28 | `clamp(1.75rem, 1.5357rem + 1.0714vw, 2.5rem)` |
| `text-5xl`, `text-5xl-tight` | 48 | 28 | `clamp(1.75rem, 1.3929rem + 1.7857vw, 3rem)` |
| `text-4xl` | 44 | 28 | `clamp(1.75rem, 1.4643rem + 1.4286vw, 2.75rem)` |
| `text-3xl`, `text-3xl-medium` | 36 | 26 | `clamp(1.625rem, 1.4464rem + 0.8929vw, 2.25rem)` |
| `text-2xl` and all `text-2xl-*` | 32 | 24 | `clamp(1.5rem, 1.3571rem + 0.7143vw, 2rem)` |

Every token **below 32px** — `text-2xs` through `text-xl` and `accent-step`, `accent-label`, `accent-caption`
— keeps `typography.md` §9's fixed value at every breakpoint. **Line-height, letter-spacing and weight are
never clamped**; only `font-size`. Clamping the size while leaving the leading unitless is what keeps a 0.82
leading from collapsing at small sizes.

### C-2 — Two agents exported the same three nodes as different assets. **MAJOR.**

- **`icons.md` §2** ships `map-pin.svg` (85×94) and claims node ids `412:2474`, `412:2488`, `412:2502` as
  "duplicate placements that map to the same file".
- **`assets.md` §4** ships `location-pin-1.svg` (85×94), `location-pin-2.svg` (88×93) and `location-pin-3.svg`
  (76×81) from the **same three nodes**.
- **Adjudicated against the file.** `get_metadata` on `412:2437` returns three `Location` frames at
  **84.62×93.57**, **87.72×92.43** and **75.35×93.77**. Three different sizes and three different aspect
  ratios. They are **not** one glyph placed three times.
- **Ruling: `assets.md` is correct.** `map-pin` is **removed from `IconName`** (21 names, not 22) and
  `design-system/icons/map-pin.svg` is not imported by anything. `impl-hero-business` uses the three
  `illustration/location-pin-*.svg` files.

### C-3 — The Azza wordmark exists twice in the project. **MINOR.**

`design-system/icons/logo-azza-wordmark.svg` and `design-system/assets/brand/logo-azza-wordmark.svg`, both
from `498:604`. **Ruling: the `icons/` copy is canonical** and is the one wired into `Logo`, because
`icons.md` §6 namespaced its internal ids specifically to make inlining safe alongside twenty other glyphs.
The `assets/brand/` copy is unreferenced. Same call for `logo-azza-mark`.

### C-4 — Is the "AZZA BLOG" marquee built? **MAJOR.**

- **`typography.md` §4.1** — "the three `display-5` 'AZZA BLOG' nodes are a repeating marquee strip … render
  them as decorative (`aria-hidden`) inside the marquee".
- **`icons.md` §8** — `374:489`–`374:655` are "inside hidden group `634:246` — not rendered at all".
- **`responsive.md` §7.4** — "Hidden decorative group `634:246` — do not build."
- **Ruling: do not build the marquee.** Two artifacts against one, and the deciding fact is that the group is
  `hidden` in Figma. A hidden node is not part of the design. `display-5` remains a legitimate token (it is
  used by `374:574`/`629`/`643`, which are inside the hidden group) but **no component consumes it**.
  `352:3586` "THE AZZA BLOG" is the `/blog` `<h1>` at `display-4`, which is what `typography.md` §4.1 also
  says. Flagged so a Phase 3 auditor does not report the missing token as a gap.

### C-5 — Is `570:459` a background plate or canvas debris? **MINOR.**

- **`responsive.md` §7.2.2** — background plates `570:458` / `570:459` drop below `lg` and "return" at `lg`.
- **`layout.md` §11 anomaly 5** — `570:459` is a 567×262 rect at y=922 inside a 968px section: **216px of it
  is outside the frame**, hidden only by clipping. "Do not build; if a bottom fade is wanted, mirror
  `570:458`."
- **Ruling: `layout.md` wins.** Build `570:458` (the top fade). Do **not** build `570:459`. If Phase 3 judges
  the section needs a bottom fade, mirror `570:458` — that is the careful move and it is reversible.

### C-6 — Four Help hub-card icons that do not exist. **MAJOR, unresolved in the design.**

`icons.md` F-2: `500:1773`, `500:1779`, `500:1786`, `500:1792` are 40×40 frames with **zero children**. They
render as blank grey squares and are misnamed `right_regular`. Nothing was exported for them and nothing can
be. **Ruling:** `impl-help-support` renders `surface.placeholder-alt` 40×40 squares with `aria-hidden`, and
the four `HELP_RESOURCES` records carry `icon: null`. I decline `icons.md`'s suggestion to substitute four
Fluent glyphs, because that installs a new icon dependency for four decorative squares on one route and
commits the operator to a library choice that is still an open question. Recorded in `open_questions`.

### C-7 — Does the nav chevron snap 18 → 20? **MINOR.**

- **`icons.md` §4** recommends snapping 17.4/17.5/18/19.2/22 to `sm` (20), collapsing five sizes into one.
- **`layout.md` §5.1** measures the nav link "Products" at **87 = text 67 + gap 2 + chevron 18**, feeding the
  exact cluster width **852.37** and the exact left inset **293.81** across all eight frames.
- **Ruling: the nav chevrons stay at 18.** Snapping them changes two link widths by 2px each, which changes the
  cluster width, which changes the centring arithmetic that `layout.md` §8.1 verifies as exact. The other four
  drifted sizes (17.4, 17.5, 19.2, 22) **do** snap to 20 — none of them feeds a measured centring. `icons.md`
  offered exactly this reversion.

### C-8 — Body copy at 17px does not exist. **MINOR.**

- **`responsive.md` §4.3** steps body copy `16 / 16 / 17 / 17 / 18 / design value`.
- **`typography.md` §8** lists `text-sm` (16) and `text-base` (18) as **"safe to hold constant at every
  breakpoint"**, and §9 clears the ramp with `--text-*: initial`, so 17px is unreachable without an arbitrary
  value — which gate 4 forbids.
- **Ruling: body copy does not step.** Each role holds its design value at every breakpoint. The 17px rung is
  dropped. `typography.md` owns the values; `responsive.md`'s own §4.2 protocol concedes this.

### C-9 — Contrast: build the design, or fix it? **Already adjudicated — restated so no implementer re-decides.**

D-018 stands: **build to the design.** `fg.body-muted` (3.51–3.64:1), `fg.muted` (3.70–3.79:1 across 111 text
nodes), `field.placeholder` (3.87:1), `fg.caption-soft` (3.65:1) and the six white-on-orchid exchange-widget
pairings (1.50–2.02:1) all ship as designed. They are **design defects, not implementation defects**, and no
implementer may "fix" one locally — a local fix is invisible drift and defeats the token layer, which is
precisely where the operator's eventual fix belongs. `fg.ghost` at 1.18:1 is intentional and decorative; the
watermark is `aria-hidden` and carries no meaning.

### C-10 — `layout.md` adds nine names to Tailwind's container-query namespace. **MINOR.**

- **`layout.md` §10.1** declares `--container-bleed`, `--container-wide`, `--container-default`,
  `--container-grid`, `--container-footer`, `--container-faq`, `--container-article`, `--container-prose`,
  `--container-nav`.
- **`responsive.md` §5** warns (verified against `tailwindcss@4.3.3/theme.css` lines 333–345) that
  `--container-*` is the **same namespace** container-query variants read from, so each addition also creates a
  `@wide/…`, `@default/…`, `@faq/…` variant, and advises preferring stock sizes or arbitrary values.
- **Ruling: keep `layout.md`'s names** — their primary job is generating `max-w-*` utilities and `Container`'s
  width map, which is the higher-value use. **And adopt `responsive.md`'s discipline:** the four container
  queries in `responsive.md` §5 use **arbitrary widths only** (`@min-[26rem]/card:`), never a named
  `--container-*` step. Both hold simultaneously. Named containers are always `/name`-scoped
  (`@container/card`), never anonymous.

---

## 12. The foundation gap — what blocks wave 2A

### 12.1 The type/layout/breakpoint theme layer has no owner and cannot come from `tokens.json`

`projects/azza-website/src/app/tokens.generated.css` currently declares **only** `--color-*`, `--radius-*`,
`--shadow-*` and three `--spacing-blur-*` values. Nothing else. Meanwhile:

- `typography.md` §9 specifies 4 `--font-*` and ~55 `--text-*` families with `--line-height`,
  `--letter-spacing` and `--font-weight` modifiers, plus `--font-*: initial` and `--text-*: initial` resets.
- `layout.md` §10.1 specifies 5 `--spacing-section*`, 3 sanctioned off-scale spacings, 9 `--container-*`,
  2 `--height-*`.
- `responsive.md` §1.3 specifies `--breakpoint-xs: 30rem` and `--breakpoint-2xl: 90rem`.
- §10 of this document specifies 7 `--motion-*` and 4 `--ease-*`.

**None of it exists, and `tokens.json` cannot express it.** Verified against
`scripts/generate-tokens.mjs`:

- `normaliseSegment()` runs `.replace(/[^a-z0-9]+/g, "-")`, so a key `display-hero--line-height` flattens to
  `--text-display-hero-line-height` — **the double dash Tailwind v4 requires is collapsed**, and the modifier
  silently stops working.
- A key of `*` normalises to the empty string, which the script treats as fatal:
  `token "…" produces an empty CSS identifier` → `process.exit(1)`. **`--text-*: initial` would break the
  build**, and without that reset an implementer can still reach Tailwind's stock `text-lg`, which gate 4
  forbids.

### 12.2 The fix, and why it is minimal

Add **one hand-written file** and **one import line**:

```css
/* src/app/globals.css — one line added, nothing else changed */
@import "tailwindcss";
@import "./tokens.generated.css";
@import "./theme.css";          /* ← the only change */
```

`src/app/theme.css` is a hand-authored `@theme` block containing: the four `--font-*` families, the reset
directives, the full `--text-*` scale with the §11 C-1 clamps applied to every role ≥32px, the `--spacing-*`
and `--container-*` and `--height-*` values from `layout.md` §10.1, the two `--breakpoint-*` overrides, the
`--gutter` step ladder, and the `--motion-*` / `--ease-*` tokens from §10. Colour stays in the generated file;
the two never overlap.

**This is assigned to `impl-primitives` in wave 2A**, which is a solo wave, so ownership is trivially disjoint.
`globals.css` and `tsconfig.json` are written **once, in 2A, and never again**. This requires the orchestrator
to lift `PLAN.md` §5's freeze on `globals.css` for exactly that one import line. The alternative — extending
`scripts/generate-tokens.mjs` with a modifier convention — is more machinery for the same result and leaves the
`*` reset unsolved.

### 12.3 Fonts, and the seam that keeps waves 2A–2C buildable

`src/app/layout.tsx` currently loads **no fonts at all** and says so in a comment. It must load Inter
(`next/font/google`), Bebas Neue (`next/font/google`, **weight 400 only**) and Poppins (`next/font/google`, as
the Subjectivity stand-in at 300/500/700/800/900). It is assigned to `impl-routes-marketing` in wave 2D,
because that agent also owns `SiteChrome`.

So that waves 2A–2C build and typecheck without it, `theme.css` declares the families with a `var()` fallback:

```css
--font-display: var(--font-bebas-neue, "Bebas Neue"), "Oswald", "Arial Narrow", system-ui, sans-serif;
--font-sans:    var(--font-inter, "Inter"), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-accent:  var(--font-poppins, "Poppins"), "Century Gothic", system-ui, sans-serif;
--font-brand:   var(--font-cal-sans, "Cal Sans"), var(--font-inter, "Inter"), ui-sans-serif, system-ui, sans-serif;
```

Before 2D the custom properties are undefined and each stack falls through to its literal family name and then
its fallbacks. After 2D they resolve to `next/font`'s generated families. **No cross-wave build dependency, one
seam, reversible in one file.**

**Cal Sans is not obtainable in this project.** `typography.md` §2.5 requires a `.woff2` from `calcom/font`
self-hosted via `next/font/local`; no font file exists anywhere under `projects/azza-website/`. Until one is
committed, `brand-wordmark` (the inline "Azza" on four frames) renders in Inter. Recorded in
`open_questions`; it affects five text segments and blocks nothing.

---

## 13. Where I disagree with `PLAN.md` §4

Stated loudly, because these change what gets dispatched.

### 13.1 `impl-primitives`' allowlist is too narrow to produce a buildable wave. **CRITICAL.**

`PLAN.md` §4 gives it `src/components/ui/**` only. As shown in §12, that agent cannot deliver a compiling
primitive set without also owning `src/app/theme.css`, one line of `src/app/globals.css`, one line of
`tsconfig.json`, and `src/lib/{cn,motion}.ts`. **Recommended allowlist: exactly the wave-2A table in §8.**
If the orchestrator prefers to keep the freeze intact, split a `impl-foundation` agent into a new solo wave
2A-0 owning those four paths — but that adds a wave for no benefit, since 2A is already solo.

### 13.2 `impl-blog-article` must move from wave 2C to wave 2D. **MAJOR.**

`PLAN.md` §4 places `impl-blog-index` and `impl-blog-article` in the same wave. They are file-disjoint, so the
ledger passes — but `BlogArticle` **imports `src/content/blog.ts`, which `impl-blog-index` writes in that same
wave**. If `impl-blog-index` finishes second, deviates from the contract, or fails, `impl-blog-article` breaks
the wave build and gate 1 fails for both. Moving it to 2D makes the edge cross a wave boundary, costs nothing
(2D becomes 3 agents against a cap of 10, and 2C drops to 8), and its files
(`src/components/sections/BlogArticle/**`) collide with neither route agent. §7.1 publishes the `BlogPost`
contract regardless, as belt and braces.

### 13.3 `src/app/layout.tsx` must be unfrozen and assigned. **MAJOR.**

`PLAN.md` §5 freezes it after Phase 0 and routes any change to a Phase 4 refiner. But it is where `next/font`
must load and where `TopNav`/`Footer` must be composed — both are Phase 2 work, not refinement. Deferring it to
Phase 4 means every Phase 3 capture is taken in fallback fonts and without site chrome, which makes gates 4, 7
and 9 meaningless. **Assign it to `impl-routes-marketing` in wave 2D**, as one owner across the whole run.

### 13.4 `src/content/**` is unprovisioned. **MAJOR.**

`PLAN.md` §5's ledger covers `src/components/**` and `src/app/**` and nothing else. Five content modules are
required (§7) and four of them have two or more consumers. §8 assigns each to exactly one writer. Without this
the routes agents in 2D would have to author FAQ, nav, footer, help and blog copy for seven routes, having
never read those nodes.

### 13.5 `PLAN.md` §1's repetition table still under-counts the FAQ. **MINOR.**

It lists FAQs on 3 frames while the same row of the frame inventory lists "FAQs (807)" on For Business. It is
4 (`412:1554`, `412:1759`, `412:1996`, `412:2633`). The roster is unaffected — one component either way — but
`impl-faq` must be specced for four instances and two card heights (712 / 561, driven by question count, not
layout).

### 13.6 Two directory names are misnomers. **INFO — keep them.**

`src/components/sections/QrBadge/` is not a section (it is an absolutely-positioned badge inside a hero) and
`src/components/sections/UseAzzaToday/` is not shared (one route). I am **keeping both paths** because
ownership is already keyed to them and renaming buys nothing. Recording so a Phase 3 auditor does not read the
directory name as a claim.

---

## 14. Rules an auditor can check mechanically

1. Every file under `src/components/` appears exactly once in §8, and every §8 path exists.
2. `"use client"` appears in exactly the 11 files listed in §3, and in no others.
3. No component source contains a raw hex colour, a raw `font-size`, a raw `line-height`, or a raw
   `letter-spacing`. Every value resolves through a token.
4. No `transition-duration` or `animation-duration` literal appears in component source. Every one is a
   `--motion-*` token.
5. No `cubic-bezier(...)` literal appears in component source. Every easing is an `--ease-*` token.
6. `--ease-spring` appears in exactly two places: `CardDeck` and the `Button` press-release.
7. No `transform: scale()` inside a `:hover` rule, anywhere.
8. Every `:hover` rule is inside `@media (hover: hover) and (pointer: fine)`.
9. Every `:hover` rule that conveys state has a `:focus-visible` twin.
10. `.reveal`'s from-state exists only inside `@media (prefers-reduced-motion: no-preference)`, and
    `layout.tsx` ships the `<noscript>` override.
11. No element is left at `opacity: 0` when `prefers-reduced-motion: reduce` is active.
12. `PhoneMockup` is never rendered with `screen="whatsapp-business"`.
13. `IconName` has 21 members and does not include `map-pin`.
14. `design-system/assets/brand/logo-azza-wordmark.svg` and `design-system/icons/map-pin.svg` are imported by
    nothing.
15. Every `clamp()` in `theme.css` has the exact `typography.md` §3 value as its max term and a `rem` component
    in its preferred term.
16. No `<section>` carries `margin-block`.
17. Exactly one `<h1>` per route, using the token named for that route in `typography.md` §4.1.
18. `src/content/*.ts` files are written by exactly the agents named in §8 and imported by the rest.
