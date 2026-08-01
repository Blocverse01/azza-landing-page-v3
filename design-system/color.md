# Colour & Effect System — AZZA Website

**Source:** Figma `OXDVihY7WvtPZ6uGuVFx5Y` — page `1:3` "Website design", section `672:246` "FOR BUILD",
plus component set `507:498` "Section" (the card deck), which lives outside FOR BUILD.
**Method:** every fill, stroke, effect and corner radius on **1810 nodes** was enumerated programmatically via
the Plugin API, not read off screenshots. 130 distinct fill values, 23 distinct stroke values, 12 gradients,
21 distinct effects and 27 distinct radii were found.
**Companion file:** `design/tokens.json` — the machine-readable set. This document explains it.

**Two finding series run through this document.** `C-nn` = a contrast result (§6). `D-n` = a drift or gap in
the source design (§8). They are numbered independently.

---

## 0. How to consume this — read before writing a component

There are two layers and you use **exactly one of them**.

| Layer | Token prefix | Who uses it |
|---|---|---|
| **Primitives** — the raw palette, no meaning | `color.palette.*` → `--color-palette-neutral-700` | Nobody, in component source. It exists so the palette is recorded and so semantics have something to point at. |
| **Semantics** — role-named, this is the API | `color.surface.*`, `color.fg.*`, `color.line.*`, `color.action.*`, `color.link.*`, `color.nav.*`, `color.accordion.*`, `color.field.*`, `color.focus.*`, `color.overlay.*`, `color.gradient.*` | **You.** Every colour in a component resolves through one of these. |

If you find yourself reaching for `bg-palette-neutral-825`, the correct move is `bg-surface-inverse-row` —
and if no semantic token fits your case, that is a gap in this file. Raise it; do not hard-code a hex, and do
not fall back to a primitive.

**Tailwind v4 mapping.** Every top-level key in `tokens.json` is a Tailwind v4 theme namespace, so each token
produces both a CSS custom property and a utility class:

```
color.surface.page          → --color-surface-page          → bg-surface-page
color.fg.muted              → --color-fg-muted              → text-fg-muted
color.line.subtle           → --color-line-subtle           → border-line-subtle
color.action.brand-hover    → --color-action-brand-hover    → hover:bg-action-brand-hover
radius.pill                 → --radius-pill                 → rounded-pill
shadow.card                 → --shadow-card                 → shadow-card
```

Two namespaces need a recipe rather than a plain utility:

- **Gradients** are stored as their *stops*, not as `linear-gradient()` strings, because a `--color-*` variable
  feeds `background-color` and a gradient string there renders nothing. Use Tailwind's gradient utilities:
  `bg-linear-to-b from-gradient-cta-from to-gradient-cta-to`. Angles are in §7.
- **Blur radii** live under `spacing` (a Tailwind namespace; the generator's allowlist has no `blur` namespace).
  Use `blur-(--spacing-blur-glow)` / `backdrop-blur-(--spacing-blur-scrim)`.

---

## 1. Dark mode: this file does not have one

**There is no dark mode in this design, and none should be built.** Verified three ways:

1. `figma.variables.getLocalVariableCollectionsAsync()` returns `[]` — there are **zero local variable
   collections** in the file, so there is no mode structure to carry.
2. Only **2 nodes out of 1810** have any bound variable at all (`501:223`, `501:232`, both `fills`). They point
   at `Text/Brand/On Brand Secondary` in a **remote** library collection named `Color` with modes
   `SDS Light` / `SDS Dark`. That is Figma's stock *Simple Design System* community kit, aliased in by a
   copy-pasted component. It is incidental leakage, not an authored theme: it governs two text nodes on the
   Help & Support page and nothing else. See finding **D-7**.
3. The dark surfaces that *do* exist (`#121212` footer, `#1E1E1E` FAQ rows, `#262626` FAQ panel, `#2F2F2F`
   step rows) are **inverse sections inside a light page**, present simultaneously with light sections on the
   same frame. They are not a theme. That is why they are tokenised as `surface.inverse*` and
   `fg.on-inverse*`, not as a mode.

**Implementation consequence:** emit one set of custom properties. Do not add a `.dark` selector, do not add
`@media (prefers-color-scheme: dark)`, do not add `next-themes`. If the operator later wants dark mode, the
semantic layer is already shaped to take it — every role token would gain a second value and nothing in
component source would change.

---

## 2. The three published Figma variables

These are the entire variable coverage of the design (`get_variable_defs` over the whole Main Landing Page).
Their original Figma names are recorded here so the mapping back to the file stays legible.

| Figma variable name | Value | Primitive | Semantic token(s) | Where it appears |
|---|---|---|---|---|
| `Background color/Background 03` | `#F3F3F3` | `palette.neutral.150` | `surface.sunken` | Frame `570:461` — the logo-marquee band |
| `Green` | `#D3FEB6` | `palette.lime.150` | `surface.accent-lime`, `line.accent-lime` | Azza-for-Business hero band `412:2437`, 5 nodes total |
| `White` | `#FFFFFF` | `palette.neutral.0` | `surface.page`, `fg.on-inverse`, `fg.on-brand`, `nav.surface`, `accordion.row-fg`, `focus.ring-inverse` | 254 nodes — the dominant surface |

Note `White` maps to **six** semantic tokens. That is the point of the two-layer split: `fg.on-brand` and
`surface.page` happen to share a value today and must be free to diverge without a rename.

---

## 3. Primitive palette

Neutral ramp numbers encode darkness: `0` is white, `1000` is black, and the number is approximately
`(1 − channel/255) × 1000`. The ramp is uneven because the source design is uneven — 36 distinct greys were
found. That unevenness is a real property of the file, recorded rather than smoothed away.

### `palette.neutral`

| Token | Hex | Nodes | Notable use |
|---|---|---|---|
| `neutral.0` | `#FFFFFF` | 254 | page, nav, cards |
| `neutral.25` | `#FCFCFC` | 4 | Help & Support list cards `500:1771…` |
| `neutral.50` | `#FAFAFA` | 5 | FAQ section wrapper `412:1554` |
| `neutral.75` | `#F8F8F8` | 4 | FAQ inner panel `412:1559` |
| `neutral.100` | `#F5F5F5` | 2 + gradient stop | "use Azza Today" gradient end |
| `neutral.125` | `#F4F4F4` | 4 | Azza Wrapped artwork only |
| `neutral.150` | `#F3F3F3` | 1 | **Figma var** `Background color/Background 03` |
| `neutral.175` | `#F2F2F2` | 4 | Azza Wrapped artwork only |
| `neutral.200` | `#F1F1F1` | 2 | Azza Wrapped artwork only |
| `neutral.225` | `#F0F0F0` | 3 | search field `500:2308` |
| `neutral.250` | `#EFEFEF` | 4 (stroke) | card border |
| `neutral.275` | `#EBEBEB` | 15 | FAQ outer card `412:1556`, QR frame `412:884`, testimonial card |
| `neutral.300` | `#E0E0E0` | 3 (stroke) | search field border |
| `neutral.325` | `#D9D9D9` | 39 | image/avatar placeholders |
| `neutral.350` | `#D7D7D7` | 4 | Help card icon placeholder |
| `neutral.375` | `#CECECE` | 1 (stroke) | `412:1292` |
| `neutral.400` | `#BDBDBD` | 2 + 2 stroke | exchange-widget amount placeholder |
| `neutral.425` | `#B0B0B0` | 2 + 2 stroke | blog rules `352:3725`, `352:3740` |
| `neutral.450` | `#A9A9A9` | 1 | Azza Wrapped artwork only |
| `neutral.500` | `#838383` | 111 | **the most-used text grey** — footer links, meta, breadcrumbs |
| `neutral.525` | `#787878` | 6 | search placeholder |
| `neutral.550` | `#747474` | 16 | blog card meta |
| `neutral.600` | `#5C5C5C` | 4 (@80%) | QR caption |
| `neutral.625` | `#595959` | 1 | blog hero subhead on tint |
| `neutral.650` | `#4C4C4C` | 1 | blog hero subhead on white |
| `neutral.675` | `#4A4A4A` | 21 | Help sidebar links, FAQ answer body |
| `neutral.700` | `#353535` | 103 | **default body/nav text** |
| `neutral.725` | `#2F2F2F` | 3 | numbered step rows on inverse `458:267…` |
| `neutral.750` | `#292929` | 17 | Help article prose |
| `neutral.775` | `#262626` | 4 | FAQ dark panel `412:1560` |
| `neutral.800` | `#222222` | 8 | ghost "USE AZZA" wordmark in footer |
| `neutral.825` | `#1E1E1E` | 63 | headings; FAQ question rows |
| `neutral.850` | `#1A1A1A` | 8 | "Chat with Azza" floating CTA |
| `neutral.900` | `#121212` | 9 | footer, inverse "Why Azza?" section |
| `neutral.925` | `#111111` | 2 | "Get Started" / "Buy now" primary button |
| `neutral.1000` | `#000000` | 12 + 38 stroke | display headline `412:1859`; icon strokes |

### `palette.indigo` — the brand family

| Token | Hex | Where observed |
|---|---|---|
| `indigo.25` | `#FAFAFF` | Wrapped artwork vectors (8); reused as `surface.brand-faint` |
| `indigo.50` | `#F1F1FF` | blog hero `352:3583`, "View More" pill `500:2426` |
| `indigo.100` | `#EAEAFF` | soft brand pill `412:1222` |
| `indigo.150` | `#E4E4F2` | blog card `352:3703` |
| `indigo.200` | `#DFDFFF` | exchange-widget glow shadow `412:1861` |
| `indigo.300` | `#ACABEB` | Wrapped artwork; reused as `action.brand-disabled` / `action.soft-active` |
| `indigo.350` | `#A09EFF` | **brand glow orb** (@24% + 75px blur), 8 nodes |
| `indigo.400` | `#7976EA` | Azza logo mark |
| `indigo.450` | `#7774FD` | Wrapped artwork |
| `indigo.500` | `#504FB2` | Wrapped artwork; reused as `link.visited` |
| `indigo.550` | `#4642E2` | stroke on `412:1203` |
| `indigo.600` | `#3430E9` | **brand primary** — 37 nodes: logo, active nav item, "Send now" |
| `indigo.650` | `#312DDB` | Azza logo mark |
| `indigo.700` | `#2825BE` | Azza logo stroke; reused as `action.brand-hover` |
| `indigo.800` | `#1F1C9A` | Azza logo mark; reused as `action.brand-active` |
| `indigo.850` | `#15139B` | Wrapped artwork |

### `palette.lime`, `palette.violet`, `palette.blush`, `palette.ink`

| Token | Hex | Where observed |
|---|---|---|
| `lime.50` | `#E2F7D4` | deck card "Move Money" `507:724` |
| `lime.100` | `#D4FFB7` | `412:1214` — near-duplicate of `lime.150`, see finding **D-2** |
| `lime.150` | `#D3FEB6` | **Figma var** `Green` |
| `lime.300` | `#B6D79F` | gradient stroke `412:1204` |
| `lime.400` | `#9FCC7F` | Wrapped artwork |
| `lime.500` | `#7EB956` | Wrapped artwork |
| `lime.600` | `#61A807` | Wrapped artwork |
| `lime.800` | `#305306` | Wrapped stat text → `fg.stat-lime` |
| `violet.25` | `#FDF7FF` | FAQ answer bubble `412:1573` |
| `violet.50` | `#F9F6FB` | feature card `553:292` |
| `violet.100` | `#F4E7FF` | feature card `553:288` |
| `violet.200` | `#EAD3FC` | deck card "Operate Locally" `507:725` |
| `violet.300` | `#D9BDF0` | "Buy crypto" tab `412:1645` |
| `violet.350` | `#D6B7F0` | exchange-widget panel `412:1649` |
| `violet.400` | `#D2B0EE` | rate strip gradient `412:1641` |
| `violet.450` | `#CCA9E9` | "Sell Crypto" tab `412:1643` |
| `violet.500` | `#C0A4D6` | tile shadow colour `412:1645` |
| `violet.600` | `#AE92C5` | `412:1627` |
| `violet.700` | `#9583A5` | stroke @33% `412:1642` |
| `blush.50` | `#FFE8F1` | deck card "One wallet" `507:728` |
| `ink.warm` | `#171007` | headline on mint deck card `458:385` |
| `ink.plum` | `#25161A` | headline on lilac deck card `458:394` |
| `ink.cocoa` | `#2C2124` | "Azza" label on FAQ card `412:1584` |

---

## 4. Semantic tokens — what each one is for

### 4.1 `surface.*` — backgrounds

| Token | Value | Use it for | Do not use it for |
|---|---|---|---|
| `surface.page` | `#FFFFFF` | The default page background, nav bar, article body, most sections. | Cards that need to lift off the page — use `surface.raised`. |
| `surface.subtle` | `#FAFAFA` | Full-bleed section that needs to read as *slightly* set back from the page. FAQ section wrapper. | |
| `surface.faint` | `#F8F8F8` | An inner panel one level below `surface.subtle`. Only inside the FAQ block today. | |
| `surface.muted` | `#F5F5F5` | The settled end of the "use Azza Today" vertical wash; also derived hover for `action.ghost`. | |
| `surface.sunken` | `#F3F3F3` | The logo-marquee band. Figma's only `Background color/*` variable. | |
| `surface.raised` | `#FCFCFC` | A card that sits **above** the page: Help & Support link cards. Always pair with `line.subtle`. | Full sections. |
| `surface.contrast` | `#EBEBEB` | A heavyweight grey block that a dark panel sits inside: FAQ outer card, QR band frame, testimonial card. | Small muted captions — see **C-04**. |
| `surface.field` | `#F0F0F0` | Text input / search field resting fill. | Read-only chips — use `action.quiet`. |
| `surface.answer` | `#FDF7FF` | The FAQ answer speech bubble. Pair with `radius.bubble` and `shadow.card`. | |
| `surface.placeholder` | `#D9D9D9` | Image, avatar and chart placeholders before real assets land. | Anything shipping. |
| `surface.placeholder-alt` | `#D7D7D7` | Icon placeholder inside Help cards. | |
| `surface.inverse` | `#121212` | Footer; the dark "Why Azza?" section. Pair with `fg.on-inverse*`. | |
| `surface.inverse-panel` | `#262626` | A panel sitting on `surface.contrast` — the FAQ questions column. Also the derived hover for `accordion.row`. | |
| `surface.inverse-row` | `#1E1E1E` | An individual row inside `surface.inverse-panel` — the FAQ question. Pair with `line.hairline-inverse`. | |
| `surface.inverse-raised` | `#2F2F2F` | A row lifted off `surface.inverse` — the numbered "how to get started" steps. | |
| `surface.brand-faint` | `#FAFAFF` | Faintest indigo wash. | |
| `surface.brand-subtle` | `#F1F1FF` | A brand-tinted section: the blog hero. Also the resting fill of `action.quiet`. | |
| `surface.brand-muted` | `#EAEAFF` | A brand-tinted *chip* that carries brand-coloured text. Resting fill of `action.soft`. | |
| `surface.brand-tint` | `#E4E4F2` | Slightly greyed brand tint — blog card. Also `action.soft-hover`. | |
| `surface.brand-solid` | `#3430E9` | A saturated brand block. Rare; the primary use is `action.brand`. | Large fields of prose — 7.65:1 is fine, the block is not. |
| `surface.accent-lime` | `#D3FEB6` | The Azza-for-Business hero band. | |
| `surface.accent-lime-alt` | `#D4FFB7` | Exists only to record a one-node duplicate. **Do not use** — see **D-2**. | Anything. |
| `surface.accent-mint` | `#E2F7D4` | Card-deck card 2, "Move money globally". Pair with `fg.on-accent-mint`. | |
| `surface.accent-lilac` | `#EAD3FC` | Card-deck card 3, "Operate locally". Pair with `fg.on-accent-lilac`. | |
| `surface.accent-blush` | `#FFE8F1` | Card-deck card 1, "One wallet". Pair with `fg.on-accent-blush`. | |
| `surface.accent-violet` | `#F4E7FF` | Feature card `553:288`. | |
| `surface.accent-violet-subtle` | `#F9F6FB` | The two smaller feature cards `553:292`, `553:299`. | |
| `surface.accent-orchid` | `#D6B7F0` | Exchange-widget input panels. | Any surface carrying white text — **C-01**. |
| `surface.accent-orchid-soft` | `#D9BDF0` | Exchange-widget "Buy crypto" tab. | Same. |
| `surface.accent-orchid-deep` | `#CCA9E9` | Exchange-widget "Sell Crypto" tab. | Same. |
| `surface.accent-orchid-flat` | `#D2B0EE` | Exchange-widget rate strip. Figma authors it as a one-colour gradient; it is flat. | Same. |
| `surface.accent-orchid-dim` | `#AE92C5` | Widget chrome `412:1627`. | |

### 4.2 `fg.*` — text and icon foregrounds

| Token | Value | Use it for |
|---|---|---|
| `fg.primary` | `#1E1E1E` | Headings and display type on any light surface. The default heading colour. |
| `fg.body` | `#353535` | Default body copy, nav links, labels. The workhorse. |
| `fg.body-muted` | `#353535` @60% | Hero and section subcopy. **Fails AA at body size — see C-02.** |
| `fg.body-soft` | `#353535` @70% | Exchange-widget meta, deck-card subcopy. Marginal; 4.81:1 on white. |
| `fg.body-strong` | `#353535` @80% | Deck-card subcopy on mint/lilac. Passes AA. |
| `fg.prose` | `#292929` | Long-form article body on the Help pages. |
| `fg.secondary` | `#4A4A4A` | Sidebar links, FAQ answer body — the level below `fg.body`. |
| `fg.caption` | `#4C4C4C` | Blog hero subhead on white. |
| `fg.caption-alt` | `#595959` | Blog hero subhead on `surface.brand-subtle`. Near-duplicate of `fg.caption` — **D-3**. |
| `fg.caption-soft` | `#5C5C5C` @80% | QR-band caption on `surface.contrast`. **Fails AA — C-04.** |
| `fg.muted` | `#838383` | Metadata, breadcrumbs, footer nav links, card descriptions. **Fails AA on light — C-03.** |
| `fg.subtle` | `#747474` | Blog card meta. Scrapes AA on white (4.67), fails on brand tint (4.18, **C-06**). |
| `fg.placeholder` | `#787878` | Input placeholder text. **Fails AA on `surface.field` — C-05.** |
| `fg.disabled` | `#BDBDBD` | Disabled/empty numeric input display. 1.88:1 — decorative only, **C-07**. |
| `fg.display` | `#000000` | The two giant display headlines (`412:1859`, blog hero). |
| `fg.brand` | `#3430E9` | Current/active nav item, inline brand emphasis, brand icons. |
| `fg.stat-lime` | `#305306` | The dark-green stat numerals on the Azza Wrapped share card. |
| `fg.ghost` | `#222222` | The oversized "USE AZZA" wordmark bled into the footer at 1.18:1. **Decorative by intent** (**C-08**) — must be `aria-hidden` and must not carry meaning. |
| `fg.on-inverse` | `#FFFFFF` | Text on any `surface.inverse*`. |
| `fg.on-inverse-muted` | `#FFFFFF` @80% | Footer legal line. |
| `fg.on-inverse-soft` | `#FFFFFF` @70% | Labels inside the exchange widget. |
| `fg.on-inverse-subtle` | `#FFFFFF` @60% | Testimonial attribution over the photo scrim. |
| `fg.on-inverse-body` | `#EBEBEB` | Body copy on `surface.inverse` where pure white is too hard. |
| `fg.on-brand` | `#FFFFFF` | Text on `surface.brand-solid` / `action.brand`. |
| `fg.on-contrast` | `#2C2124` | The "Azza" chat label on `surface.contrast`. |
| `fg.on-accent-lime` | `#353535` | Text on `surface.accent-lime`. |
| `fg.on-accent-mint` | `#171007` | Headline on `surface.accent-mint`. |
| `fg.on-accent-lilac` | `#25161A` | Headline on `surface.accent-lilac`. |
| `fg.on-accent-blush` | `#1E1E1E` | Headline on `surface.accent-blush`. |

### 4.3 `line.*` — borders, strokes, dividers

| Token | Value | Use it for |
|---|---|---|
| `line.subtle` | `#EFEFEF` | Card borders on light. Pairs with `surface.raised`. |
| `line.default` | `#E0E0E0` | Form-field border at rest. |
| `line.strong` | `#CECECE` | Field border on hover (derived) and heavier dividers. |
| `line.muted` | `#BDBDBD` | Exchange-widget internal frames. |
| `line.divider` | `#B0B0B0` | Horizontal rules in the blog article. |
| `line.emphasis` | `#353535` | A deliberate dark 1px outline — hero card frames `412:1617`, `412:2439`. |
| `line.hairline` | `#353535` @8% | Barely-there separator on light. 9 nodes. |
| `line.hairline-inverse` | `#FFFFFF` @8% | The separator on FAQ question rows. 18 nodes. |
| `line.on-inverse` | `#FFFFFF` @60% | Outline on the numbered step rows over `surface.inverse`. |
| `line.brand` | `#3430E9` | Brand-outlined elements; also `field.border-focus`. |
| `line.brand-strong` | `#4642E2` | Heavier brand outline `412:1203`. |
| `line.accent-lime` | `#D3FEB6` | Lime outline `412:1157`. |
| `line.placeholder` | `#D9D9D9` | Placeholder outlines. |

### 4.4 Effects, radii and blurs

`radius` — 27 distinct radii were observed; these are the meaningful ones. Values above 100px only occur on
illustration masks and are not tokenised.

| Token | Value | Observed on |
|---|---|---|
| `radius.xs` `sm` `md` | 2 / 4 / 6px | small chips, icon frames |
| `radius.lg` | 8px | **most common (42 nodes)** — FAQ question rows |
| `radius.xl` | 12px | **23 nodes** — nav dropdown `94:850`, Help cards, QR frame |
| `radius.2xl` | 16px | search field |
| `radius.3xl` | 20px | 12 nodes |
| `radius.4xl` | 24px | 15 nodes |
| `radius.5xl` | 32px | FAQ dark panel |
| `radius.6xl` | 36px | FAQ outer card |
| `radius.7xl` | 48px | large cards |
| `radius.pill` | 100px | **33 nodes** — every button and pill. Figma authors it as a literal `100`, not a huge number; use `rounded-pill` to match the export exactly. |
| `radius.full` | 9999px | circles and avatars |
| `radius.bubble` | `40px 30px 40px 0px` | The FAQ answer bubble's asymmetric corners (Figma TL/TR/BR/BL = 40/30/40/0). |

A single 5px radius exists on one node; use `radius.sm`. The delta is inside the 2% visual gate.

`shadow` — observed values first, derived last.

| Token | Value | Source |
|---|---|---|
| `shadow.card` | `4px 4px 0 0 rgb(0 0 0 / 0.04)` | observed — FAQ answer bubble, 4 nodes |
| `shadow.deck` | `5px -4px 12px 0 rgb(0 0 0 / 0.25)` | observed — card-deck cards, 4 nodes |
| `shadow.deck-alt` | `5px -5px 12px 0 rgb(0 0 0 / 0.25)` | observed — 2 nodes. 1px off `shadow.deck`; see **D-4** |
| `shadow.chip` | `0 4px 4px 0 rgb(0 0 0 / 0.25)` | observed — deck chips, 4 nodes |
| `shadow.hard` | `0 4px 0 0 rgb(0 0 0 / 0.59)` | observed — blog hero blocks `374:506`, `374:628`, `374:642` |
| `shadow.widget` | `0 0 16px 0 #DFDFFF` | observed — exchange widget `412:1861` |
| `shadow.tile` | `0 4px 3px 0 rgb(192 164 214 / 0.59)` | observed — "Buy crypto" tile `412:1645` |
| `shadow.dropdown` | `0 12px 32px -8px rgb(0 0 0 / 0.12)` | **derived** — the nav dropdowns `63:350` / `94:850` have *no* shadow and *no* border in Figma, so they would float unanchored against `surface.page`. See **D-5**. |
| `shadow.hover-lift` | `0 8px 20px -6px rgb(0 0 0 / 0.12)` | **derived** — card hover |
| `shadow.focus-ring` | `0 0 0 3px rgb(52 48 233 / 0.35)` | **derived** — brand focus ring on light |
| `shadow.focus-ring-inverse` | `0 0 0 3px rgb(255 255 255 / 0.55)` | **derived** — focus ring on inverse surfaces |

Blurs (under `spacing`, see §0):

| Token | Value | Observed on |
|---|---|---|
| `spacing.blur-glow` | 75px | `LAYER_BLUR` on the brand glow orb, 8 nodes (`500:2425`, `498:891`, `498:639`, `498:681`, …). Always paired with `overlay.glow-brand`. |
| `spacing.blur-orb` | 21px | `LAYER_BLUR` on decorative ellipse `412:1205` |
| `spacing.blur-scrim` | 6px | `BACKGROUND_BLUR` on the testimonial image scrim, 3 nodes |

`overlay` tokens:

| Token | Value | Use |
|---|---|---|
| `overlay.scrim` | `#000000` @50% | Image dimming / modal scrim |
| `overlay.scrim-strong` | `#000000` @80% | **derived** — heavier scrim |
| `overlay.glass-inverse` | `#FFFFFF` @9% | Glass panels inside the exchange widget, 2 nodes |
| `overlay.glow-brand` | `#A09EFF` @24% | The ambient brand glow. Apply with `blur-(--spacing-blur-glow)`. |
| `overlay.ghost` | `#D9D9D9` @1% | Invisible spacer ellipses, 9 nodes. Layout artefacts — prefer real layout over reproducing these. |

---

## 5. Interaction states

**The design authors no interaction states at all.** A keyword sweep over every node name under `FOR BUILD`
for `hover|active|focus|press|disabl|default|state|selected|expanded|open|closed|error|success|warning`
returned **8 hits, none of which is an interaction state** — they are frame names ("Help & Support- Opened",
"Blog- Article Opened"), a QR filename, and two body-copy strings.

One state is genuinely observed: the Help & Support sidebar shows the **current** item in `#3430E9` while its
siblings are `#4A4A4A` (`500:2317` vs `501:208`/`501:212`). Everything else below is **derived**, using one
consistent rule so that nineteen implementers produce the same behaviour:

> **Derivation rule.** A dark solid surface *lightens* on hover to the next observed neutral step and returns
> past its base on press. A light tinted surface *darkens* one observed tint step on hover and one more on
> press. Foreground colours step one level toward `fg.primary` on hover. Disabled states use
> `neutral.325` on `neutral.500`. Focus is always a 3px `focus.ring` (`#3430E9`) offset by
> `focus.ring-offset`, never a colour change alone. **Every derived value is drawn from the observed palette —
> no new hexes were invented anywhere in this file.**

### Buttons

| Component | Token group | Default | Hover | Active | Disabled | Label |
|---|---|---|---|---|---|---|
| Primary dark pill ("Get Started", "Buy now") | `action.primary*` | `#111111` obs | `#2F2F2F` der | `#000000` der | `#D9D9D9` der | `#FFFFFF` obs / `#838383` der |
| Brand solid ("Send now") | `action.brand*` | `#3430E9` obs | `#2825BE` der\* | `#1F1C9A` der\* | `#ACABEB` der\* | `#FFFFFF` obs |
| Soft brand pill ("Generate your Azza wrapped", "Buy Crypto Now") | `action.soft*` | `#EAEAFF` obs | `#E4E4F2` der\* | `#ACABEB` der\* | — | `#3430E9` obs → `#1F1C9A` on press |
| Quiet pill ("View More") | `action.quiet*` | `#F1F1FF` obs | `#EAEAFF` der\* | `#E4E4F2` der\* | — | `#353535` obs |
| Floating chat CTA ("Chat with Azza") | `action.chat*` | `#1A1A1A` obs | `#2F2F2F` der | `#000000` der | — | `#FFFFFF` obs |
| Ghost / text button | `action.ghost*` | `transparent` der | `#F5F5F5` der | `#EBEBEB` der | — | `#353535` obs |

`der*` = derived, but the value itself is observed elsewhere in the file (the Azza logo / illustration
artwork), so the hue family is authentic rather than computed.

### Links

| State | Token | Value | Source |
|---|---|---|---|
| default | `link.default` | `#353535` | observed |
| hover | `link.hover` | `#1E1E1E` | derived |
| active/press | `link.active` | `#000000` | derived |
| **current page** | `link.current` | `#3430E9` | **observed** (`500:2317`) |
| visited | `link.visited` | `#504FB2` | derived |
| inline in prose | `link.inline` / `link.inline-hover` | `#3430E9` / `#2825BE` | observed / derived |
| on the dark footer | `link.on-inverse` / `-hover` | `#838383` / `#FFFFFF` | observed / derived |

### Nav items

| Element | Token | Value | Source |
|---|---|---|---|
| bar background | `nav.surface` | `#FFFFFF` | observed |
| bar bottom border | `nav.border` | `#EFEFEF` | derived — the Figma nav has no border (**D-6**) |
| item | `nav.fg` | `#353535` | observed |
| item hover | `nav.fg-hover` | `#1E1E1E` | derived |
| current section | `nav.fg-current` | `#3430E9` | observed |
| dropdown panel | `nav.dropdown-surface` + `radius.xl` + `shadow.dropdown` | `#FFFFFF`, 12px | fill & radius observed, shadow derived |
| dropdown item title / description | `nav.dropdown-fg` / `-fg-muted` | `#353535` / `#353535` @60% | observed |
| dropdown item hover | `nav.dropdown-item-hover` | `#F1F1FF` | derived |

### Accordion rows

Two distinct accordions exist and they do not share a look.

**FAQ accordion** (dark, on `surface.contrast`, frames `412:1556` / `412:1761` / …):

| State | Token | Value | Source |
|---|---|---|---|
| panel | `accordion.panel` + `radius.5xl` | `#262626`, 32px | observed |
| row rest | `accordion.row` + `radius.lg` + `accordion.row-border` | `#1E1E1E`, 8px, `#FFFFFF`@8% | observed |
| row hover | `accordion.row-hover` | `#262626` | derived |
| row open | `accordion.row-open` | `#2F2F2F` | derived |
| row label | `accordion.row-fg` | `#FFFFFF` | observed |
| answer bubble | `accordion.answer` + `radius.bubble` + `shadow.card` | `#FDF7FF` | observed |
| answer body | `accordion.answer-fg` | `#4A4A4A` | observed |

**Help & Support list** (light, frames `500:1771…`):

| State | Token | Value | Source |
|---|---|---|---|
| item rest | `accordion.item` + `accordion.item-border` + `radius.xl` | `#FCFCFC` / `#EFEFEF`, 12px | observed |
| item hover | `accordion.item-hover` | `#F5F5F5` | derived |
| item title | `accordion.item-title` | `#1E1E1E` | observed |
| item body | `accordion.item-body` | `#838383` | observed — **fails AA, see C-03b** |

### Form fields

| State | Token | Value | Source |
|---|---|---|---|
| rest | `field.surface` + `field.border` + `radius.2xl` | `#F0F0F0` / `#E0E0E0`, 16px | observed |
| hover | `field.border-hover` | `#CECECE` | derived |
| focus | `field.border-focus` + `shadow.focus-ring` | `#3430E9` | derived |
| placeholder | `field.placeholder` | `#787878` | observed — **fails AA, see C-05** |
| value | `field.fg` | `#353535` | derived |
| disabled | `field.surface-disabled` / `field.fg-disabled` | `#F5F5F5` / `#BDBDBD` | derived |

### Focus, globally

Nothing in the design shows a focus indicator. `focus.ring` = `#3430E9` at 3px with a 2px
`focus.ring-offset` (`#FFFFFF`), switching to `focus.ring-inverse` / `shadow.focus-ring-inverse` on any
`surface.inverse*`. This is required by acceptance gate 9 and is entirely derived.

---

## 6. Contrast — every pairing the design actually uses

Computed with the WCAG 2.x relative-luminance formula; translucent foregrounds are composited over their real
background first (the `effective` column). Threshold: 4.5:1 for body text, 3:1 where the design uses the pair
only at ≥24px, or ≥18.66px bold.

### Passes

| Foreground | Background | Effective | Ratio | Size(s) | AA | AAA | Where |
|---|---|---|---|---|---|---|---|
| `#000000` | `#FFFFFF` | — | **21.00** | 96/128 | pass | pass | display headlines |
| `#FFFFFF` | `#111111` | — | **18.88** | 16 | pass | pass | "Get Started" |
| `#FFFFFF` | `#121212` | — | **18.73** | 18/36 | pass | pass | footer headings |
| `#FFFFFF` | `#1A1A1A` | — | **17.40** | 16 | pass | pass | "Chat with Azza" |
| `#1E1E1E` | `#FFFFFF` | — | **16.67** | 16–164 | pass | pass | all headings |
| `#FFFFFF` | `#1E1E1E` | — | **16.67** | 24 | pass | pass | FAQ question rows |
| `#171007` | `#E2F7D4` | — | **16.60** | 128 | pass | pass | deck card mint headline |
| `#1E1E1E` | `#FCFCFC` | — | **16.25** | 20 | pass | pass | Help card titles |
| `#1E1E1E` | `#FAFAFA` | — | **15.97** | 140 | pass | pass | "what people say" |
| `#EBEBEB` | `#121212` | — | **15.71** | 16 | pass | pass | Why Azza? subcopy |
| `#1E1E1E` | `#F5F5F5` | — | **15.29** | 140 | pass | pass | "use azza today!" |
| `#FFFFFF` | `#262626` | — | **15.13** | 64 | pass | pass | "QUESTIONS" label |
| `#1E1E1E` | `#F1F1FF` | — | **14.90** | 100 | pass | pass | "THE AZZA BLOG" |
| `#292929` | `#FFFFFF` | — | **14.55** | 20 | pass | pass | Help article prose |
| `#1E1E1E` | `#FFE8F1` | — | **14.34** | 128 | pass | pass | deck card blush headline |
| `#1E1E1E` | `#F4E7FF` | — | **14.07** | 48 | pass | pass | feature card headline |
| `#FFFFFF` | `#2F2F2F` | — | **13.39** | 24 | pass | pass | numbered step labels |
| `#2C2124` | `#EBEBEB` | — | **13.05** | 24 | pass | pass | "Azza" chat label |
| `#25161A` | `#EAD3FC` | — | **12.60** | 128 | pass | pass | deck card lilac headline |
| `#353535` | `#FFFFFF` | — | **12.27** | 16/24/32 | pass | pass | nav links, body |
| `#FFFFFF`@80% | `#121212` | `#D0D0D0` | **12.15** | 18 | pass | pass | footer legal line |
| `#353535` | `#FAFAFA` | — | **11.75** | 32 | pass | pass | FAQ heading |
| `#353535` | `#F9F6FB` | — | **11.45** | 24 | pass | pass | feature card body |
| `#353535` | `#F1F1FF` | — | **10.96** | 14/20/32 | pass | pass | "View More" pill |
| `#353535` | `#D3FEB6` | — | **10.88** | 12 | pass | pass | "AZZA BUSINESS" eyebrow |
| `#FFFFFF`@80% | `#2F2F2F` | `#D5D5D5` | **9.12** | 24 | pass | pass | step numbers |
| `#4A4A4A` | `#FFFFFF` | — | **8.86** | 18 | pass | pass | Help sidebar links |
| `#4C4C4C` | `#FFFFFF` | — | **8.59** | 24 | pass | pass | blog hero subhead |
| `#4A4A4A` | `#FDF7FF` | — | **8.41** | 18 | pass | pass | FAQ answer body |
| `#3430E9` | `#FFFFFF` | — | **7.65** | 18 | pass | pass | active sidebar link |
| `#FFFFFF` | `#3430E9` | — | **7.65** | 16 | pass | pass | "Send now" |
| `#3430E9` | `#EAEAFF` | — | **6.45** | 16/18 | pass | fail | soft brand pill |
| `#595959` | `#F1F1FF` | — | **6.26** | 24 | pass | pass | blog hero subhead |
| `#353535`@80% | `#E2F7D4` | `#585C55` | **6.01** | 20 | pass | fail | deck mint subcopy |
| `#353535`@80% | `#EAD3FC` | `#59555D` | **5.28** | 20 | pass | fail | deck lilac subcopy |
| `#838383` | `#121212` | — | **4.94** | 18 | pass | fail | footer nav links |
| `#353535`@70% | `#FFFFFF` | `#727272` | **4.81** | 14/16 | pass | fail | exchange widget meta |
| `#747474` | `#FFFFFF` | — | **4.67** | 20 | pass | fail | blog card meta |

### Failures — report only, do not silently repaint

The design is authoritative: these values ship as designed unless the operator rules otherwise. The
remediation column is a *suggestion for the operator*, deliberately absent from `tokens.json` so that no
implementer can pick it up by accident.

| # | Foreground | Background | Effective | Ratio | Need | Size | Where | Suggested remediation |
|---|---|---|---|---|---|---|---|---|
| **C-01a** | `#FFFFFF` | `#D6B7F0` | — | **1.77** | 4.5 | 14/40 | exchange widget values `412:1651`, `412:1658` | switch to `fg.primary` (`#1E1E1E`, 10.5:1) |
| **C-01b** | `#FFFFFF`@70% | `#D6B7F0` | `#F3E9FB` | **1.50** | 4.5 | 16 | widget labels `412:1650`, `412:1662` | `fg.body` at 70% → 4.6:1 |
| **C-01c** | `#FFFFFF` | `#D2B0EE` | — | **1.88** | 4.5 | 16 | rate strip `412:1680` | as C-01a |
| **C-01d** | `#FFFFFF`@70% | `#D2B0EE` | `#F2E7FA` | **1.57** | 4.5 | 14 | rate value `412:1681` | as C-01b |
| **C-01e** | `#FFFFFF` | `#D9BDF0` | — | **1.68** | 4.5 | 18 | "Buy crypto" tab `412:1646` | as C-01a |
| **C-01f** | `#FFFFFF` | `#CCA9E9` | — | **2.02** | 4.5 | 18 | "Sell Crypto" tab `412:1648` | as C-01a |
| **C-02a** | `#353535`@60% | `#FFFFFF` | `#868686` | **3.64** | 4.5 | 16/20 | hero subcopy `412:789`, `412:1621`, `412:1860` | raise to 75% → 5.3:1 |
| **C-02b** | `#353535`@60% | `#F5F5F5` | `#828282` | **3.52** | 4.5 | 20 | "use Azza Today" subcopy `412:1287` | as C-02a |
| **C-02c** | `#353535`@60% | `#D3FEB6` | `#748569` | **3.51** | 4.5 | 20 | Business hero subcopy `412:2443` | as C-02a |
| **C-02d** | `#353535`@70% | `#FFE8F1` | `#726B6D` | **4.47** | 4.5 | 20 | deck blush subcopy `507:760` | 0.03 short; 72% clears it |
| **C-03a** | `#838383` | `#FFFFFF` | — | **3.79** | 4.5 | 16/20 | breadcrumbs and meta — `500:2337`, `501:216` | `fg.subtle` `#747474` at ≥18px, or `#6E6E6E` |
| **C-03b** | `#838383` | `#FCFCFC` | — | **3.70** | 4.5 | 16 | Help card body `500:1776` | as C-03a |
| **C-04** | `#5C5C5C`@80% | `#EBEBEB` | `#797979` | **3.65** | 4.5 | 14 | QR caption `412:889`, `511:469`, `412:1995`, `412:2607` | drop the 80% → 6.4:1 |
| **C-05** | `#787878` | `#F0F0F0` | — | **3.87** | 4.5 | 20 | search placeholder `500:2312`, `500:2206`, `500:1743` | `#6B6B6B` → 4.6:1 |
| **C-06** | `#747474` | `#F1F1FF` | — | **4.18** | 4.5 | 20 | blog hero date `352:3595` | `#6E6E6E` → 4.6:1 |
| **C-07** | `#BDBDBD` | `#FFFFFF` | — | **1.88** | 4.5 | 16 | widget amount `412:1868`, `412:1882` | placeholder only; if it renders a real value, use `fg.body` |
| **C-08** | `#222222` | `#121212` | — | **1.18** | 3.0 | 195 | "USE AZZA" ghost wordmark `500:2424`, `498:890`, `498:638` | **intentional.** Purely decorative — mark `aria-hidden="true"`, exclude from the accessible name tree. No colour change. |
| **C-09** | `#353535`@8% | `#FFFFFF` | `#EFEFEF` | **1.15** | 3.0 | — | hairline separators | non-text and purely decorative; WCAG 1.4.11 does not apply |
| **C-10** | `#FFFFFF`@8% | `#1E1E1E` | `#303030` | **1.26** | 3.0 | — | FAQ row hairlines | same |

### Two pairings that cannot be measured statically

| Where | Situation | Verdict |
|---|---|---|
| **Testimonial cards** `412:1068` / `412:1076` / `412:1084` | White quote (`#FFFFFF`, 18px SemiBold) and 60%-white attribution sit over a **photograph** with a `#000000` 0%→100% vertical scrim (16.7%→100%) and a 6px background blur. A naive ancestor walk reports "white on `#EBEBEB`" (1.19:1); that is wrong — the card fill is never the effective background. | Against the scrim's opaque floor (≈`#1A1A1A`) the quote is **17.4:1 pass** and the attribution **6.90:1 pass**. But the scrim is a gradient, and text sitting where it is only partly opaque measures lower. **Action for the implementer: keep the scrim reaching full opacity behind all text.** `visual-qa` / `a11y-auditor` should sample the rendered pixels. |
| **Azza Wrapped share card** `412:1155` | The "$500 / 100 / HUSTLER" numerals are white and `#305306` over a **raster illustration** (a green artwork under a 10%-opacity image layer). The frame fill is `#FFFFFF`, so a naive walk reports white-on-white (1.00:1). | Not statically measurable. This card is a *generated share image*, not interface chrome. Treat it as an image with a text alternative; the numerals should not be live DOM text carrying an accessibility obligation. Logged as an open question. |

---

## 7. Gradients

Twelve gradient paints were found. Four are design gradients, two are effectively flat, and six belong to
third-party social icons and are excluded (§9). Figma's `gradientTransform` `[[0,1,0],[-1,0,1]]` is the
canonical 90° rotation, i.e. **CSS `180deg`, top → bottom**, which is what all four design gradients use.

| Name | Tokens | CSS | Angle | Nodes |
|---|---|---|---|---|
| **CTA wash** | `gradient.cta-from` → `gradient.cta-to` | `linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)` | 180° | `412:1233` "use Azza Today", 1440×1128 |
| **Edge fade** | `gradient.fade-from` → `gradient.fade-to` | `linear-gradient(180deg, #FFFFFF 0%, rgb(255 255 255 / 0) 100%)` | 180° | `570:458`, `570:459` — marquee fade masks, 567×274 / 567×262 |
| **Media scrim** | `gradient.media-scrim-from` → `gradient.media-scrim-to` | `linear-gradient(180deg, rgb(0 0 0 / 0) 16.7%, rgb(0 0 0 / 1) 100%)` | 180° | `412:1070`, `412:1078`, `412:1086` — testimonial photos, 305×163. Also carries `BACKGROUND_BLUR 6px` (`spacing.blur-scrim`). Note the first stop sits at **16.7%**, not 0. |
| **Orchid strip** | `gradient.orchid-from` → `gradient.orchid-to` | both stops `#D2B0EE` (0% and 68%) | 180° | `412:1641`, 580×475 — **authored as a gradient but visually flat.** Render as `bg-surface-accent-orchid-flat`; do not build a gradient. |
| Lime ellipse stroke | — | single stop `#B6D79F` at 94.1% | — | `412:1204` — **flat.** Render as a solid stroke, `palette.lime.300`. |

Tailwind recipe for the three real gradients:

```
bg-linear-to-b from-gradient-cta-from to-gradient-cta-to
bg-linear-to-b from-gradient-fade-from to-gradient-fade-to
bg-linear-to-b from-gradient-media-scrim-from from-[16.7%] to-gradient-media-scrim-to
```

---

## 8. Where the design drifts — findings for the operator

| # | Finding | Evidence | Consequence |
|---|---|---|---|
| **D-1** | **Two near-identical primary-button darks.** `#111111` (2 nodes: "Get Started" `412:1367`, "Buy now" `456:204`) and `#1A1A1A` (8 nodes: "Chat with Azza"). | Both are pill CTAs with white labels; the difference is 9/255 per channel. | Tokenised separately as `action.primary` and `action.chat` so the export matches pixel-for-pixel. If the operator prefers one, collapse `action.chat` → `action.primary`; the shift is inside the 2% visual gate. |
| **D-2** | **Two near-identical limes.** `#D3FEB6` (the published `Green` variable, 5 nodes) and `#D4FFB7` (1 node, `412:1214`). | 1 unit per channel — almost certainly a paste error. | `surface.accent-lime-alt` exists only to record it and is **marked do-not-use**. Implementers should use `surface.accent-lime`. |
| **D-3** | **Two near-identical mid-greys for the same role.** `#4C4C4C` (blog hero subhead on white, `352:3686`) and `#595959` (blog hero subhead on `#F1F1FF`, `352:3587`). | Same component, two frames. | `fg.caption` / `fg.caption-alt`. Recommend consolidating on `fg.caption`. |
| **D-4** | **Two deck shadows 1px apart.** `5px -4px 12px` (4 nodes) and `5px -5px 12px` (2 nodes), identical colour and alpha. | | `shadow.deck` / `shadow.deck-alt`. Recommend `shadow.deck` everywhere. |
| **D-5** | **The nav dropdowns have no shadow and no border.** `63:350` and `94:850` are `#FFFFFF` at `radius.xl` with `strokes: []` and `effects: []`, floating over `#FFFFFF`. | They are invisible as overlays. | `shadow.dropdown` is derived to fix this and is flagged as an invention. |
| **D-6** | **The top nav has no bottom border.** | Nav and page are both `#FFFFFF`; the bar dissolves against content on scroll. | `nav.border` (`#EFEFEF`) is derived. |
| **D-7** | **A remote design-system library is aliased into 2 text nodes.** `Text/Brand/On Brand Secondary` from a remote `Color` collection with `SDS Light`/`SDS Dark` modes (Figma's stock Simple Design System). | 2 nodes out of 1810. | Incidental, not a theme. Do not build dark mode from it; do not import the SDS library. |
| **D-8** | **130 distinct fills, 36 distinct greys, 3 published variables.** | The whole file. | The reason this token set exists. Any raw hex appearing in Phase 2 component source is a gate-6 failure. |

---

## 9. Colours deliberately excluded from the token set

These appear in the file but must **not** become semantic tokens. They belong inside exported SVG/raster assets
owned by `iconography-expert` and `imagery-asset-expert`; tokenising them would invite an implementer to
recolour a third party's mark or an illustration's internals.

| Group | Values | Reason |
|---|---|---|
| **National flag colours** | `#008751` `#006B3F` `#FCD116` `#CE1126` `#006600` `#BB0000` `#FAD201` `#00A3E0` `#20603D` `#E5BE01` `#D11229` `#FCD517` `#FAD000` `#D22A01` `#12366B` `#0B5704` `#007030` `#006E41` `#F83333` `#AA0D0D` `#DF8106` `#DB7D04` `#F0CD34` `#FFF7D5` `#E1FFF7` `#24453C` `#22453B` `#031910` `#065636` `#02472B`, plus their `@50%` dimmed variants | Nigeria / Ghana / Kenya / Rwanda flags inside the hero display type and the country selector. Fixed by the flags themselves. |
| **Crypto & payment marks** | `#26A17B` (Tether) `#50AF95` `#6F41D8` `#A6C5F4` `#85A8D9` `#96CBC9` `#4D8C81` `#05513C` `#054D39` `#46B194` `#003168` | Third-party token logos in the "Supported chains" strip and card-deck art. |
| **Social icon gradients** | Instagram radials `#FFDD55 → #FF543E → #C837AB` and `#3771C8 → #6600FF` (`352:3698/3699/3732/3733`); X mark `#131314` | Brand-locked; live in the exported icon SVGs. |
| **Azza Wrapped artwork internals** | `#61A807` `#9FCC7F` `#7EB956` `#FDD518` `#FFF99F` `#FE0000`@15% `#1EA600` `#05955C` `#A9DEC9` `#E3BE61` `#F1F1F1` `#F2F2F2` `#F4F4F4` `#A9A9A9` `#15139B` `#7774FD` | `412:1155` is a generated **share image**, not interface chrome. Its palette is illustration. Kept as primitives for the record only; never promoted to a semantic token. |
| **Flag / coin shading layers** | `#FFFFFF`@50% (9 vectors), `#000000`@50% (6 vectors), inner shadows `#003168`@20%, `#054D39`@50%, `#02472B`@76%, `#0022CC`@18% | 3-D shading baked into illustration ellipses and the phone mockup. Reproduced by the asset, not by CSS. |
| **Icon chrome shadows** | `0 1px 1px rgb(0 0 0 / .08)`, `0 1px 3px rgb(0 0 0 / .12)`, `inset 0 1px 1px rgb(255 255 255 / .7)` on `458:397`, `458:398` | Internal to two icon vectors. |
| **Figma canvas chrome** | `#444444` (section `672:246` fill), `#FFFFFF`@10% (section stroke), `#8A38F5` (component-set `507:498` outline) | Figma editor UI, not design. |
| **Illustration-only radii** | 83, 377.8, 391.1, 491.1, 1520.8, 5275.9, 5614.7, 11256.5, 12160.9 px | Mask and vector geometry. |
| **`NOISE` effect** on `412:808` | — | A Figma noise effect on a hero illustration ellipse; baked into the exported asset. No CSS equivalent worth reproducing. |

Note: `#FAFAFF`, `#ACABEB` and `#504FB2` also originate in the Wrapped artwork but *are* promoted, because
they serve real system roles (`surface.brand-faint`, `action.brand-disabled` / `action.soft-active`,
`link.visited`). Every other observed value is represented in `tokens.json`. The `IMAGE` "fill" recorded on 72
nodes is a raster paint, not a colour, and is `imagery-asset-expert`'s territory.

---

## 10. Quick reference — the 12 tokens that cover most of the build

```
bg-surface-page          #FFFFFF     the page
bg-surface-inverse       #121212     footer + dark sections
bg-surface-contrast      #EBEBEB     grey blocks that hold dark panels
text-fg-primary          #1E1E1E     every heading
text-fg-body             #353535     every paragraph and nav link
text-fg-muted            #838383     metadata  (contrast warning: 3.79:1)
text-fg-on-inverse       #FFFFFF     text on dark
border-line-subtle       #EFEFEF     card borders
bg-action-primary        #111111     the dark pill CTA
bg-action-brand          #3430E9     the brand CTA
text-fg-brand            #3430E9     current nav item, brand accents
rounded-pill             100px       every button
```
