# design/layout.md — AZZA Website

**Authority:** grid, spacing scale, container widths, section rhythm, alignment, auto-layout translation.
**Scope:** the 1440px desktop layout only. Everything below 1440 belongs to `design/responsive.md`.
**Stack target:** Next.js 15 App Router / TypeScript strict / Tailwind CSS v4.
**Source:** Figma `OXDVihY7WvtPZ6uGuVFx5Y`, section `672:246` "FOR BUILD", 8 frames.

Every number below was read from the Figma Plugin API (`layoutMode`, `itemSpacing`, `padding*`,
`primaryAxisAlignItems`, `counterAxisAlignItems`, `*AxisSizingMode`, `layoutSizing*`, `layoutPositioning`,
`layoutWrap`) — not inferred from screenshots and not derived from absolute pixel positions except where a
frame has no auto-layout, which is called out every time it happens.

---

## 0. Read this first — the six things implementers get wrong

1. **Sections do not have gaps between them. They abut at exactly 0px.** All vertical rhythm lives in each
   section's own top/bottom padding. The visible seam between two standard sections is `80 + 80 = 160px`.
   See §4.
2. **There is no single content container.** The design uses a *family* of widths — 1280 / 1200 / 1160 / 1002 /
   985 / 842 — chosen per section. Use the per-section table in §3.2. Do not wrap everything in one `max-w`.
3. **The Top Nav does not align to any content container.** It is an 852.37px cluster centred in the viewport
   (left inset 293.81px). This is deliberate and consistent across all 8 frames. See §5.1.
4. **The four "Why Azza?" frames are four different components, not one component with variants.** See §6.
5. **Gap `10` is not a spacing token.** 69 of the 71 frames carrying it have a single child, so the gap never
   renders. It is Figma's default `itemSpacing`. Never emit `gap-2.5` because a Figma frame said 10. See §1.3.
6. **`SPACE_BETWEEN` frames report a huge fake `itemSpacing`** (258, 283, 355, 711). Those are computed slack,
   not designed gaps. They become `justify-between`. See §7.4.

---

## 1. The spacing scale

### 1.1 Base unit and verdict

**Base unit: 4px.** Half-step 2px permitted. The design is natively compatible with Tailwind v4's default
`--spacing: 0.25rem` — **no custom spacing scale is required**, only semantic aliases (§10.1).

I tested 4px and 8px as candidate bases against every *effective* gap in the section (302 gaps; "effective"
means the auto-layout frame has ≥2 in-flow, visible children, so the gap actually renders):

| Candidate base | Coverage of the 284 layout-flow gaps | Verdict |
|---|---|---|
| 8px | 186 / 284 = **65.5%** | Rejected. Misrepresents 12, 20, 28, 60, 100 — 98 real instances. |
| 4px | 245 / 284 = **86.3%** | Accepted. |
| 4px + 2px half-step | 261 / 284 = **91.9%** | Accepted — this is the scale. |

Padding tells the same story: of 367 non-zero padding values, 319 (87%) are multiples of 4.

**Honest overall fit: ~88% of all non-zero spacing in the design is a multiple of 4px.** The remaining ~12% is
enumerated in §1.4 — it is not hidden, and I did not round it away silently.

### 1.2 The scale

Numbers in the Tailwind column are literal Tailwind v4 utility numbers (`gap-6` = 24px). Counts are combined
gap + padding instances across `672:246`.

| Token | px | Tailwind | Instances | What it is used for in this design |
|---|---|---|---|---|
| `space-0` | 0 | `0` | 2 gaps | Heading↔subcopy in the landing CTA block (`412:1285`) — deliberately flush, line-height carries the gap |
| `space-px` | 2 | `0.5` | 16 | Icon↔label micro-gap. Nav "Products ⌄" / "Socials ⌄" chevrons (`412:2077`, `412:2081`) |
| `space-1` | 4 | `1` | 8 | Breadcrumb separators (`501:217`), inline metadata rows |
| `space-2` | 8 | `2` | 53 | Label↔value; logo↔legal line (`498:603`); button label↔icon (`412:1288`, `412:1222`) |
| `space-3` | 12 | `3` | 92 | Accordion row pitch (`412:1561`); QR tile↔caption (`412:885`); paired controls (`412:1226`) |
| `space-4` | 16 | `4` | 137 | **Title↔body inside a content block.** The most-used intra-block gap. Small-card padding |
| `space-5` | 20 | `5` | 31 | Prose paragraph gap (`412:2520`); form-field gap (`412:1863`); card grid inner gap |
| `space-6` | 24 | `6` | 92 | **The single most common gap (48 effective).** Stacked list items, sub-block separation |
| `space-7` | 28 | `7` | 3 | Article header block (`352:3684`); help-centre link groups |
| `space-8` | 32 | `8` | 43 | Nav link pitch (`412:2076` = 32); hero eyebrow↔headline; block↔block |
| `space-10` | 40 | `10` | 35 | **Column gutter for 2-up card rows** (`553:291`, `500:2214`); major block gap |
| `space-12` | 48 | `12` | 16 eff. | **Section heading → section body.** The section-internal rhythm constant |
| `space-14` | 56 | `14` | 1 | Blog card-grid row gap (`500:2213`) |
| `space-15` | 60 | `15` | 1 | Article prose block gap (`352:3707`) |
| `space-16` | 64 | `16` | 1 | Help & Support right-column block gap, closed state (`500:1765`) |
| `space-18` | 72 | `18` | 2 | Help & Support sidebar↔content gutter (`500:1736`, `500:2305`); FAQ card inner padding |
| `space-20` | 80 | `20` | 35 | **Standard section top/bottom padding.** Also footer link-column gutter (`498:613`) |
| `space-25` | 100 | `25` | 12 | **Spotlight section padding** (card deck, Why-Azza-steps). Footer logo↔links gutter (`498:602`) |
| `space-28` | 112 | `28` | 1 | Exchange widget internal split (`412:1861`) |
| `space-30` | 120 | `30` | 2 | Article body↔related-posts gap (`352:3682`); final-section bottom padding (`500:2197`) |
| `space-50` | 200 | `50` | 1 | Why-Azza-steps column gutter (`458:261`) |

### 1.3 Consolidations applied — every value I moved, and where

I normalised 8 distinct raw values. Nothing else was touched.

| Raw | → | Instances | Node ids | Why |
|---|---|---|---|---|
| `10` (gap) | **discard** | 71 gaps, of which **69 are inert** | e.g. `500:2308`, `500:2426`, `500:2303`, `412:1575` | Figma's default `itemSpacing`. 69/71 frames have exactly one in-flow child, so the value never renders. The 2 effective cases (`412:1867`, `412:1881`, cross-border exchange widget rows) → **12**. |
| `10` (padding) | **keep** | 26 (padT/padB) | `412:2518`, `412:1617`, `412:1856`, `412:2439`, `412:1292`, `507:477` | This one *is* deliberate — it is the eyebrow-pill / small-button vertical padding (`10px 12px` and `10px 16px`). Retained as `py-2.5`. |
| `7` | → **8** | 1 effective | `412:1622` (Crypto Wallet "Buy Crypto Now" label↔arrow) | 1px drift from the `8` used by the three other identical buttons (`412:1288`, `412:1222`, `498:...`). |
| `9` | → **8** | 1 | `412:1675` | Same button family. |
| `8.2051` | → **8** | 2 | `412:1181`, `412:1186` (Azza Wrapped stat rows) | Sub-pixel residue of a scaled group. |
| `4.1026` | → **4** | 1 | `412:1190` | Same group. |
| `34.8719` | → **32** | 1 | `412:1180` (Azza Wrapped stat label↔value columns) | Same scaled group. 32 is the nearest step and matches the sibling label column width. |
| `18` | → **16** | 3 | `458:267`, `458:271`, `458:275` (Why-Azza step rows, icon↔text) | The three rows are identical; 18 is a single authored value 2px off the 16 used everywhere else for icon↔label. |
| `50` | → **48** | 3 | `374:507`, `374:630`, `374:644` (blog hero decorative card stack) | Purely decorative offsets behind the blog hero. |
| `38` (padding) | → **40** | 8 (padL/padR) | `412:1573`, `412:1998`, `412:1761`, `412:2635` (FAQ answer panel) | Consistent across all 4 FAQ instances, but 2px off the `40` step and paired with a `32` on the cross axis. |
| `14` (padding) | → **16** | 14 (padT/padB) | `458:267`, `458:271`, `458:275` | Same three step rows as the `18` above. `14/12` → `16/12`. |

### 1.4 Off-scale values retained deliberately — do NOT "fix" these

These are **sanctioned exceptions**. The Phase 3 layout auditor must treat them as correct.

| Value | Node ids | Why it stays |
|---|---|---|
| **89px** (vertical gap) | `498:600`, `498:642`, `498:684`, `498:726`, `498:768`, `498:852`, `412:2666`, `500:2386` | Footer content block → giant "USE AZZA" wordmark. Present in **8 of 8** footers, byte-identical. Not drift — a single authored value. Rounding it to 88 changes the footer's fixed 764px height. Keep `89px`. |
| **107 / 106px** (footer padding) | `498:599` and its 7 siblings | Footer is a fixed 764px box with a 551px content block at y=107. The 1px top/bottom asymmetry is a centring remainder. Keep both literals; do not "balance" them. |
| **2px** | `412:2077`, `412:2081` and 14 more | Optical icon↔label kerning on chevrons. `gap-0.5`. Correct as-is. |
| **63px** (vertical offset) | `412:1084` vs `412:1068`/`412:1076` | Testimonial card stagger — the middle card is raised 63px on purpose. §8.3. |
| **46px** | landing Why-Azza marker column → text column (`570:460` → `570:436`) | The active-item marker sits at x=120 (container edge) while the list text starts at x=188. Optical, and the marker is only 22px wide. Keep. |
| **53px** | `412:2517` eyebrow (`412:2518`) → prose column (`412:2520`) | Single occurrence, absolute-positioned group, no auto-layout to normalise against. |
| **59px** | FAQ card right inset (`412:1556`) | The FAQ card's four insets are 28 top / 28 left / 24 bottom / 59 right — asymmetric by design so the answer panel sits optically centred against the decorative background. §5.3. |

### 1.5 Corner radii (secondary, included because it is spatial)

| px | Instances | Use |
|---|---|---|
| 4 | 4 | Micro chips |
| 8 | 38 | **Default.** Inputs, small cards, list rows |
| 12 | 18 | Buttons, accordion rows |
| 16 | 7 | Media tiles |
| 20 | 11 | Cards |
| 24 | 2 | Large cards |
| 32 | 4 | Feature cards |
| 36 | 4 | Panels |
| 48 | 2 | Hero panels |
| 100 | 28 | **Pill** — treat as `rounded-full` |
| ≥1520 | 6 | Circles / pills expressed as huge radii — `rounded-full` |
| 70.24 (×3), 83 (×1) | 4 | **Off-scale.** Nodes in the blog hero decorative stack. Round to 72 and 80. |

---

## 2. What the design does and does not use

| Property | Finding |
|---|---|
| Auto-layout frames | **394** |
| Non-auto-layout (absolute) frames | **147** (27%) |
| `layoutWrap: WRAP` | **0 frames.** There is no wrapping layout anywhere in the design. Do not emit `flex-wrap`. |
| Figma layout grids | none published as variables; no column-grid guides usable via MCP |
| Spacing variables | **zero.** The file has 3 variables, all colours. The scale in §1 is synthesised, not exported. |
| `layoutPositioning: ABSOLUTE` children | 3 — `412:1990` (QR, cross-border), `507:477` (blog "View More"), and the FAQ decorative mask |

**Consequence:** there is no designer-authored grid. §3 is derived from measured content widths, and I say so
wherever the derivation is weak.

---

## 3. Containers and gutters

### 3.1 The finding

**The design has no single content container.** I measured the outer content width and side inset of every
section in all 8 frames. The result is a family of 13 distinct widths. This is the most significant risk in
this document: an implementer who assumes one `max-w-[1200px]` will get 9 of 22 sections wrong.

### 3.2 Container register — authoritative, per section

Every page section is **full-bleed 1440px** (backgrounds run edge to edge). The numbers below are the
*content* width inside that full-bleed section and the resulting side inset at 1440.

| Container token | Width | Side inset | Used by (node id) |
|---|---|---|---|
| `container-bleed` | 1440 | 0 | Top Nav bar, Footer bar, all section backgrounds, `412:1155` Azza Wrapped banner |
| `container-deck` | 1300 | 70 | `412:2196` card deck → `511:364` |
| `container-wide` | 1280 | 80 | `412:2437` (Biz hero), `352:3583` (Blog hero outer), `500:1736` / `500:2305` (Help & Support, declared padding) |
| `container` **(default)** | 1200 | 120 | `553:288` (Why Azza, cross-border), `412:1854` hero columns (`412:1855` @120 → `412:1861` right edge 1320), `570:434` (Why Azza, landing — heading @120, media panel right edge 1320) |
| `container-grid` | 1160 | 140 | `500:2198` (All Articles), `352:3584` (Blog hero inner), `352:3741` (article related posts) |
| `container-crypto` | 1140 | 150 | `412:1587` (Crypto Wallet hero: text @150 w429, media right edge 1290), `412:1221` (Azza Wrapped control row @150) |
| `container-steps` | 1100 | 170 | `458:261` (Why Azza steps: 500 + 200 + 400) |
| `container-cardinner` | 1056 | 192 | `553:289` — the 1200 card's inner content (card padding 72) |
| `container-footer` | 1016 | 212 | `498:601` footer link block (note: it is 14px *wider* than its own 1002 parent, centred → −7) |
| `container-footerbox` | 1002 | 219 | `498:600` footer content block, `498:637` wordmark |
| `container-faq` | 987 | 226.5 | `412:1556`, `412:1761`, `412:1998`, `412:2635` — the FAQ card |
| `container-article` | 985 | 227.5 | `352:3682` article column |
| `container-testimonial` | 955 | 242 | `412:1067` testimonial group (absolute) |
| `container-prose` | 842 | 299 | `352:3684`, `352:3707` — the article **reading measure** |
| `container-hero-landing` | 878 | 281 | `412:1370` landing hero text block (centred) |
| `container-nav` | 852.37 | 293.81 | `412:2067` + `412:2087` nav cluster — **all 8 frames**. §5.1 |
| `container-why-biz` | 846 | 297 | `412:2517` |

### 3.3 Recommended consolidation for implementation

Ship **five** container utilities and map every section to one of them (§4 tables carry the mapping):

```
container-bleed    100%          (no max-width)
container-wide     1280px        gutter 80
container          1200px        gutter 120   ← default
container-grid     1160px        gutter 140
container-prose     842px        gutter 299   ← article reading measure only
```

The remaining widths (1300, 1140, 1100, 1056, 1016, 1002, 987, 985, 955, 878, 852.37, 846) are **fixed
per-section values**, not containers. Set them as explicit widths on that section's content block. They are
listed per section in §4 so no implementer has to guess.

### 3.4 Full-bleed exceptions (content deliberately breaks the container)

| Node | What breaks out | To |
|---|---|---|
| `412:1155` | Azza Wrapped banner artwork | full 1440, edge to edge, 752.82px tall |
| `412:2196` → `511:364` | Card deck | 1300 (wider than the 1200 default), 70px inset |
| `498:601` | Footer link block | 1016, i.e. 7px past its own 1002 parent on each side |
| `352:3741` | Article related-posts row | 1160, i.e. 87.5px past its 985 article column on each side |
| `412:1626` / `412:2444` / `412:2453` / `412:2465` | Hero decorative artwork on Crypto Wallet and For Business | overflows the section box; sections clip (`clipsContent: true`) |
| `570:459` | Landing Why-Azza lower gradient rect | starts at y=922 in a 968-tall section — 216px of it is outside. §11 |

### 3.5 Behaviour above 1440

The design gives one viewport. My rule for wider viewports:

- Section **backgrounds** stay `100vw` full-bleed.
- Section **content containers cap at their px max and centre**; the gutters absorb all extra width.
- Nothing scales up. No `vw`-based type or spacing above 1440.

PLAN §9.6 says "1440 is the design width, laid out as a max-width container that scales up rather than
pinning." Capping is the safer reading — scaling a 1440 design to 1920 by 1.33× would give a 64px body
line-height and a 213px section padding. Logged in `open_questions`.

---

## 4. Section rhythm — the highest-value section of this document

### 4.1 The governing rule

**Sections abut at 0px.** Frame `412:1829` (Cross Border Payments) is the only page-level frame that is itself
an auto-layout, and it is `VERTICAL, itemSpacing: 0, padding: 0` — five sections summing to exactly 3547px.
That frame is the design's own statement of the page model, and every other frame's absolute section positions
match it to within ±3px.

```
Standard section:   padding-block: 80px      → seam between two sections = 160px
Spotlight section:  padding-block: 100px     → seam against a standard neighbour = 180px
Final content section before footer: padding-bottom 120px
Top Nav:            padding-block: 40px      (height 123 = 40 + 43 + 40)
Footer:             padding-top 107 / padding-bottom 106 (fixed 764px box)
Section heading → section body: 48px         (this is the one constant across every section type)
```

### 4.2 Boundary drift — measured, and resolved to zero

Absolute section positions carry 1–3px slop from manual placement. **All of it snaps to 0.**

| Frame | Boundary | Raw | Resolution |
|---|---|---|---|
| `412:759` | Nav → Hero | −2 (overlap) | 0 |
| `412:759` | Cards → Testimonials | −1 | 0 |
| `412:759` | Testimonials → FAQs | −1 | 0 |
| `412:759` | FAQs → Azza Wrapped | +3 (gap) | 0 |
| `412:759` | Wrapped → CTA | −1 | 0 |
| `412:759` | CTA → Footer | −1 | 0 |
| `412:759` | Footer → frame bottom | +6 trailing | 0 |
| `282:803` | Article → Footer | **−11 (overlap)** | 0 — see §11, this one is large enough to be a real defect |

Frames `412:1586`, `412:1829`, `412:2412`, `281:56`, `498:209`, `500:2281` have **zero** drift — their sections
sum exactly to the frame height.

### 4.3 Frame 1 — Main Landing Page `412:759` (1440 × 7390)

| y | h | Node | Section | Auto-layout | Container | Internal rhythm |
|---|---|---|---|---|---|---|
| 0 | 123 | `412:2066` | Top Nav | `H, gap 258, pad 40/0/40/0, center/center` | `container-nav` 852.37 | §5.1 |
| 123 | 850 | `412:761` | Hero | **none (absolute)** | 878 @281 (centred) | pad-top 173, pad-bottom 97. Text block `412:1370` `V, gap 32`; CTA button 182×51 centred. QR floater `412:884` @ (1216, 528) |
| 973 | 968 | `570:434` | Why Azza? (accordion) | **none (absolute)** | 1200 @120 | Heading @ (120,131) 661×108. List `570:436` 560×581 @ (188,319), `V, gap 40`. Media panel `570:461` 518×653 @ (802,312), right edge 1320 |
| 1941 | 900 | `412:2196` | Card deck | `V, gap 48, pad 100/0/100/0, center/center` | `container-deck` 1300 @70 | Single child `511:364` 1300×700. gap 48 is inert (1 child) |
| 2841 | 772 | `412:1065` | What People Say | **none (absolute)** | 955 @242 | pad-top 80. Heading @ (389,80) 662×135. Heading→cards 64. Cards 305×319, pitch 325 → **gap 20**. Middle card raised 63px. pad-bottom 111 |
| 3613 | 958 | `412:1554` | FAQs | `V, gap 48, pad 80/0/80/0, min/center` | `container-faq` 987 @226.5 | Heading 408×38 → gap 48 → card 987×712. §5.3 |
| 4571 | 924 | `412:1154` | Azza Wrapped | **none (absolute)** | bleed 1440 / 1140 @150 | Banner `412:1155` 1440×752.82 full-bleed @ y0. Gap 56.2 → control row `412:1221` 1139.5×56 @ (150,809) `H, SPACE_BETWEEN`. pad-bottom 59 |
| 5495 | 1128 | `412:1233` | use Azza Today | **none (absolute)** | 635 @403 (centred) | pad-top 112 → "START NOW" pill 146×48 → gap 20 → text block `412:1284` 635×271 `V, gap 24` → CTA 253×56. Decorative arc art `412:1234` @ (170,467) 1069.9×615.4. pad-bottom 45.6 |
| 6623 | 764 | `498:599` | Footer | **none (absolute)** | `container-footerbox` 1002 @219 | §5.2 |

Corrected total: **7387px** (frame is 7390; the 3px is trailing slack).

### 4.4 Frame 2 — Products, Crypto Wallet `412:1586` (1440 × 2817)

| y | h | Node | Section | Auto-layout | Container | Internal rhythm |
|---|---|---|---|---|---|---|
| 0 | 123 | `511:432` | Top Nav | as §5.1 | 852.37 | |
| 123 | 972 | `412:1587` | Hero ("Home Landing") | **none (absolute)** | `container-crypto` 1140 @150 | Two absolute columns. Text `412:1615` 429×596 @ (150,197) `V, gap 40` → eyebrow pill 120×34 (`pad 10/12`) + `V, gap 32` + heading block `412:1619` `V, gap 16` → CTA `412:1622` 193×56 (`pad 16/20`, gap **8**). Media `412:1626` 580×650 @ (710,127), right edge 1290. Column gap 131 (absolute, not authored) |
| 1095 | 958 | `412:1759` | FAQs | `V, gap 48, pad 80/0/80/0` | 987 @226.5 | Identical to `412:1554` |
| 2053 | 764 | `498:641` | Footer | none | 1002 @219 | |
| — | 174 | `511:464` | QR floater | absolute @ (1259, 619) | 119×174 | §5.4 |

Sums to 2817 exactly.

### 4.5 Frame 3 — Products, Cross Border Payments `412:1829` (1440 × 3547)

**This frame is itself `VERTICAL, itemSpacing: 0, padding: 0`** — the page model in its purest form.

| y | h | Node | Section | Auto-layout | Container | Internal rhythm |
|---|---|---|---|---|---|---|
| 0 | 123 | `412:1831` | Top Nav | as §5.1 | 852.37 | |
| 123 | 734 | `412:1854` | Hero | **none (absolute)** | `container` 1200 @120 | Text `412:1855` 580×357 @ (120,188.5) `V, gap 32` → eyebrow 181×34 + `V, gap 16` block. Widget `412:1861` 580×574 @ (740,80), `V, gap 112, pad 32`. **Column gap 40.** Right edge 1320 |
| 857 | 968 | `553:287` | Why Azza? (feature duo) | `V, gap 48, pad 80/0/80/0, center/center` | `container` 1200 @120 | Card `553:288` 1200×808 → inner `553:289` 1056×664 @ padding **72** all round, `V, gap 40` → heading 661×106 → row `553:291` `H, gap 40` → two cards 508×518 |
| 1825 | 958 | `412:1996` | FAQs | `V, gap 48, pad 80/0/80/0` | 987 @226.5 | Identical to `412:1554` |
| 2783 | 764 | `498:683` | Footer | none | 1002 @219 | |
| — | 174 | `412:1990` | QR floater | `layoutPositioning: ABSOLUTE` @ (1239, 612) | 119×174 | §5.4 |

Sums to 3547 exactly.

### 4.6 Frame 4 — Products, Azza For Business `412:2412` (1440 × 3990)

| y | h | Node | Section | Auto-layout | Container | Internal rhythm |
|---|---|---|---|---|---|---|
| 0 | 123 | `412:2609` | Top Nav | as §5.1 | 852.37 | |
| 123 | 769 | `412:2436` | Hero | `H, gap 40, pad 80/0/80/0, center/center` | `container-wide` 1280 @80 | Single child `412:2437` 1280×609 (absolute inside). Content `412:2438` 718×505 @ x 361, `V, gap 40` → eyebrow 115×34 → `412:2441` `V, gap 16`. gap 40 is inert (1 child) |
| 892 | 825 | `412:2516` | Why Azza? (narrative) | `V, gap 48, pad 80/0/80/0, center/center` | 846 @297 | Group `412:2517` 846×665. Eyebrow `412:2518` 143×34 @ x297 (`pad 10/12`). Prose column `412:2520` 650×665 @ x493, `V, gap 20`, five paragraphs. Eyebrow→prose gap 53 (§1.4) |
| 1717 | 702 | `458:261` | Why Azza? (steps) | `H, gap 200, pad 100/0/100/0, center/center` | `container-steps` 1100 @170 | Left `458:262` 500×430 `V, gap 48` → header `458:263` 411×121 `V, gap 16` → steps `458:266` 500×261 `V, gap 24` → three rows 500×71 `H, gap 18→16, pad 14/12→16/12`. Right `458:279` 400×502 @ x870 |
| 2419 | 807 | `412:2633` | FAQs (short) | `V, gap 48, pad 80/0/80/0` | 987 @226.5 | Same component, card 987×**561** — fewer question rows. §5.3 |
| 3226 | 764 | `412:2665` | Footer | none | 1002 @219 | |
| — | 174 | `412:2602` | QR floater | absolute @ (1239, 609) | 119×174 | §5.4 |

Sums to 3990 exactly.

### 4.7 Frame 5 — Blog `281:56` (1440 × 3649)

| y | h | Node | Section | Auto-layout | Container | Internal rhythm |
|---|---|---|---|---|---|---|
| 0 | 123 | `412:2779` | Top Nav | as §5.1 | 852.37 | |
| 123 | 1026 | `352:3582` | Blog hero | `V, gap 48, pad 80/0/80/0, center/center` | `container-wide` 1280 @80 → inner `container-grid` 1160 @140 | `352:3583` 1280×866. Inner `352:3584` 1160×734 @ (60, 65.5) — vertically centred, remainder 66/66.5. `V, gap 40` → `352:3585` 1160×188 `V, gap 16` → `352:3588` 1160×506 `V, gap 24`. Decorative card stack `374:506/628/642`, 743×822, offsets 50 (→48) |
| 1149 | 1736 | `500:2197` | All Articles | `V, gap 48, pad 0/0/120/0, center/center` | `container-grid` 1160 @140 | **pad-top 0 is deliberate** — the blog hero's 80 bottom supplies the seam. `500:2198` 1160×1616 `V, gap 48` → filter row `500:2201` 1160×58 `H, SPACE_BETWEEN` (search 360×58 `pad 16`, categories 483×26 `H, gap 32`) → grid `500:2213` 1160×1510 `V, gap 56` → 3 rows of 1160×466 `H, gap 40` → **card 360×466**. "View More" `507:477` 129×46 is `ABSOLUTE` @ (655.5, 1664) |
| 2885 | 764 | `498:725` | Footer | none | 1002 @219 | |

Sums to 3649 exactly.

### 4.8 Frame 6 — Blog, Article Opened `282:803` (1440 × 4514)

| y | h | Node | Section | Auto-layout | Container | Internal rhythm |
|---|---|---|---|---|---|---|
| 0 | 123 | `412:2803` | Top Nav | as §5.1 | 852.37 | |
| 123 | 3638 | `352:3681` | Article | `V, gap 48, pad 80/0/80/0, center/center` | `container-article` 985 @227.5 | `352:3682` 985×3478, `V, gap 120` → body `352:3683` 985×2775 + related `352:3741` 1160×583 |
| | | `352:3683` | ↳ Article body | `V, gap 80, center` | `container-prose` 842 @299 | Header `352:3684` 842×269 `V, gap 28` → hero image 985×600 → prose `352:3707` 842×1746 `V, gap 60` |
| | | `352:3741` | ↳ Related posts | `V, gap 40` | `container-grid` 1160 (bleeds ±87.5 past the article column) | Header row `521:575` 1160×46 `H, SPACE_BETWEEN` → `352:3743` 1160×497 `H, gap 40` → 3 cards 360×497 |
| **3761** | 764 | `498:851` | Footer | none | 1002 @219 | Figma places it at y=**3750** — an 11px overlap. Resolve to 3761. §11 |

Corrected total: **4525px** (frame reports 4514).

### 4.9 Frame 7 — Help & Support `498:209` (1440 × 1858)

| y | h | Node | Section | Auto-layout | Container | Internal rhythm |
|---|---|---|---|---|---|---|
| 0 | 123 | `498:210` | Top Nav | as §5.1 | 852.37 | |
| 123 | 971 | `500:1736` | Help & Support | `H, gap 72, pad 80/80/80/80, min/min` | `container-wide` 1280 @80 (declared) | Sidebar `500:1738` 300×487 `V, gap 40` → search field 300×58 (`pad 16`) → "Introduction" label → groups `500:1745` 300×187 `V, gap 20`, `500:1759` 300×103 `V, gap 20`. Content `500:1765` 868×811 @ x452, `V, gap 64` → `500:1766` 868×555 `V, gap 40` → `500:1796` 868×192 `V, gap 40` |
| 1094 | 764 | `498:767` | Footer | none | 1002 @219 | |

Sums to 1858 exactly.

**Asymmetry to preserve:** declared padding is 80 on all four sides, but `80 + 300 + 72 + 868 = 1320`, leaving
**120px** of slack on the right because `primaryAxisAlignItems: MIN`. The right inset is 120, not 80. Reproduce
with `justify-start`, not `justify-between`.

### 4.10 Frame 8 — Help & Support, Opened `500:2281` (1440 × 2124)

Structurally identical to Frame 7. This is a **state**, not a route (PLAN D-001 confirmed by measurement).

| y | h | Node | Section | Δ vs closed |
|---|---|---|---|---|
| 0 | 123 | `500:2282` | Top Nav | identical |
| 123 | **1237** | `500:2305` | Help & Support (open) | **+266** |
| 1360 | 764 | `500:2385` | Footer | identical |

Where the +266 comes from:

| Node | Closed | Open | Δ |
|---|---|---|---|
| Sidebar `500:1738` → `500:2307` | 300×487 | 300×571 | +84 (active-item group grows 187 → 271) |
| Content `500:1765` → `500:2334` | 868×811, `V, gap 64` | 868×1077, `V, gap 48` | +266 |
| ↳ breadcrumb `501:217` | — | 309×21, `H, gap 4` | new |
| ↳ body `500:1796` → `500:2365` | 868×192 | 868×1008 | +816 |

**The content column's gap changes from 64 (closed) to 48 (open).** That is authored, not drift — reproduce it.
Section height hugs the content column: `80 + 1077 + 80 = 1237`.

**Note on PLAN §1's "breadcrumb (46)":** there is no 46px breadcrumb section in either frame. The only 46px
nodes are `498:402` and `500:2426` — 129×46 "View More" buttons parked at **y=2954**, far outside both frames
and hidden by `clipsContent: true`. They are abandoned artifacts. **Do not build them.** The real breadcrumb is
`501:217`, 309×21, and it exists only in the opened state.

---

## 5. The repeated surfaces — reconciled

### 5.1 Top Nav — 8 occurrences, **zero disagreement**

`412:2066` · `511:432` · `412:1831` · `412:2609` · `412:2779` · `412:2803` · `498:210` · `500:2282`

| Property | Value |
|---|---|
| Frame | 1440 × **123** |
| Auto-layout | `HORIZONTAL`, `itemSpacing 258`, `padding 40/0/40/0`, `primaryAxisAlignItems CENTER`, `counterAxisAlignItems CENTER` |
| Content height | 43 (tallest child). `40 + 43 + 40 = 123` ✓ |
| Cluster width | **852.37** = 450.37 + 258 + 144 |
| Left inset | **293.81** = (1440 − 852.37) / 2 |
| Left group `Frame 14` | 450.37 × 20 @ (293.81, 51.5), `H, gap 32, counterAxisAlignItems MAX` |
| ↳ logo `Group 33` | 59.37 × 20 |
| ↳ links `Frame 13` | 359 × 19 @ x 91.37 (logo→links gap **32**), `H, gap 32` |
| ↳ link widths | Products 87 (text 67 + `gap 2` + chevron 18) · Socials 73 · Blog 34 · About Us 69 |
| Right CTA `Frame 15` | 144 × 43 @ (1002.19, 40), `H, gap 10 (inert), padding 12/16/12/16` |

Only variance across the 8: `counterAxisSizingMode` is `FIXED` on 5 and `AUTO` on 3, and
`layoutSizingHorizontal` is `FIXED` on 7 and `FILL` on 1 (`412:1831`, whose parent is auto-layout). **All eight
render identically at 1440 × 123.** No reconciliation needed.

**Implementation:** the `258` is computed slack, not a designed gap. Build as a centred fixed-width cluster:

```
<header class="h-[123px] py-10">
  <nav class="mx-auto flex w-[852px] items-center justify-between"> … </nav>
</header>
```

Flag for the orchestrator: this nav is **not** aligned to any content container. Do not "fix" it to 1200.

### 5.2 Footer — 8 occurrences, **zero disagreement**

`498:599` · `498:641` · `498:683` · `412:2665` · `498:725` · `498:851` · `498:767` · `500:2385`

All eight are byte-identical: 1440 × 764, no auto-layout on the outer box, inner block 1002 × 551 at (219, 107).

```
Footer box          1440 × 764        padding 107 top / 106 bottom
└ 498:600           1002 × 551  @219  V, gap 89, align MIN|CENTER
  ├ 498:601         1016 × 300  @-7   V, gap 48          ← 14px wider than parent, centred
  │ ├ 498:602       1016 × 160        H, gap 100, align MIN|MIN
  │ │ ├ 498:603      114 ×  60        V, gap 8     (logo 95×32, "RC: 7810789" 114×20)
  │ │ └ 498:613      802 × 160  @214  H, gap 80    ← four link columns
  │ │   ├ Products   199 × 160        heading @0, links @46 / 92 / 138  → row pitch 46
  │ │   ├ Resources  128 × 160        (x 279)
  │ │   ├ Company    116 × 160        (x 487)
  │ │   └ Contact    119 × 114        (x 683)
  │ ├ 498:633  "Line 2"  845 × 0  @(171, 208)      ← see below
  │ └ 498:634       1016 ×  44  @y256  H, SPACE_BETWEEN
  └ 498:637         1002 × 162  @y389  "USE AZZA" wordmark + 135×135 ellipse @x474
```

Page-absolute horizontal extent of the footer link block: **212 → 1228**.

**Adjudication — the divider `498:633`.** It reports x=171, w=845 inside a 1016-wide parent whose
`counterAxisAlignItems` is `MIN`, which is self-inconsistent (a MIN-aligned child would sit at x=0). I rendered
the footer to settle it: **the divider is not visible** — it has no contrasting stroke against the near-black
background. Verdict: **do not build a visible rule.** Reserve its 0-height slot in the flow (the two `gap: 48`
values around it are what produce the 160 → 208 → 256 positions) and give it no border. If a visible divider is
ever wanted, it should span the full 1016.

### 5.3 FAQs — **4** occurrences (PLAN lists 3), one component

| Node | Frame | Section h | Card h |
|---|---|---|---|
| `412:1554` | Main Landing | 958 | 712 |
| `412:1759` | Crypto Wallet | 958 | 712 |
| `412:1996` | Cross Border | 958 | 712 |
| **`412:2633`** | **For Business** | **807** | **561** |

**PLAN §1 omits `412:2633` from the FAQ repetition table** while listing "FAQs (807)" in the For Business row.
It is the same component. Four occurrences, not three.

Reconciled spec — identical in all four:

```
Section          1440 × auto     V, gap 48, padding 80/0/80/0, align MIN|CENTER
├ heading        408 × 38  @x516  "Frequently Asked Questions"
└ card           987 × auto @x226.5
```

Card internals (`412:1556`; absolutely positioned inside — implement as a 2-column grid):

| Part | Node | Geometry |
|---|---|---|
| Decorative background | `412:1557` | 1374 × 1374 mask, overflows the card, clipped |
| Left panel | `412:1560` | 447 × 660 @ (28, 28) |
| ↳ "QUESTIONS" label | `412:1572` | 207 × 62 @ (40, 40) |
| ↳ question list | `412:1561` | 391 × 353 @ (40, 142), `V, gap 12` |
| ↳ each row | `412:1562` … `412:1570` | 368 × 61, `H, padding 16/24/16/24` → row pitch 73 |
| Answer panel | `412:1573` | 393 × 194 @ (535, 150), `H, padding 32/38→40/32/38→40` |
| Brand chip | `412:1575` | 102 × 40 @ (825, 28), `H, gap 8` (icon 40 + label) |

Card insets: **28 top / 28 left / 24 bottom / 59 right** — asymmetric, sanctioned (§1.4).
Column gap left→right panel: 535 − (28 + 447) = **60**.

The 958 → 807 delta is **content, not layout**: card 712 → 561 = −151 ≈ two fewer 73px question rows (−146).
Build one component; drive height from the question list.

### 5.4 QR floater — **4** occurrences (PLAN lists 3), one component

Not a "band". It is a small 119 × 174 floating card, absolutely placed near the right edge of the hero.

| Node | Frame | Position | Right inset | Offset below hero top | Inner block |
|---|---|---|---|---|---|
| `412:884` | Main Landing | (1216, 528) rel. Hero | **105** | 528 | `412:885` 120 × **150** @y12, `V, gap 12`; caption 78 × 36 @x21 |
| `511:464` | Crypto Wallet | (1259, 619) | **62** | 496 | `511:465` 120 × **148** @y13, `V, gap 12`; caption 92 × 34 @x14 |
| `412:1990` | Cross Border | (1239, 612) `ABSOLUTE` | **82** | 489 | 120 × 148 @y13, `V, gap 12` |
| `412:2602` | For Business | (1239, 609) | **82** | 486 | 120 × 148 @y13, `V, gap 12` |

**Disagreements and my resolution:**

| Disagreement | Values | Pick | Reasoning |
|---|---|---|---|
| Right inset | 105 / 62 / 82 / 82 | **82** | 2 of 4, and the two that agree are the two most recently laid-out product pages. 62 and 105 are eyeballed placement drift. |
| Offset below hero top | 528 / 496 / 489 / 486 | **488** | Three cluster at 486–496; the landing outlier (528) sits on a taller, differently composed hero. |
| Inner block height | 150 / 148 / 148 / 148 | **148** | 3 of 4. |
| Caption box | 78 × 36 / 92 × 34 | **92 × 34** | 3 of 4. The 78 × 36 forces a 2-line wrap the others don't have. |
| Parent vs child width | parent 119, child 120 | **120** | The child overflows the parent by 1px in all four. Set both to 120. |

Reconciled spec:

```
QR card          120 × 174     padding 12 top / 14 bottom
└ column         120 × 148     V, gap 12
  ├ QR tile      120 × 102     (image 102 × 102, inset 9 left)
  └ caption       92 ×  34     "Text Azza on WhatsApp", centred
Placement: absolute, right: 82px, top: heroTop + 488px
```

### 5.5 Cross-surface summary

| Surface | Occurrences | Disagreement | Verdict |
|---|---|---|---|
| Top Nav | 8 | none (2 sizing-mode differences, both render identically) | 1 component |
| Footer | 8 | none | 1 component |
| FAQs | **4** (PLAN says 3) | height only, content-driven | 1 component |
| QR floater | **4** (PLAN says 3) | position + 3 minor dimensions | 1 component, values reconciled above |
| Why Azza? | 4 | **structural** | **4 components** — §6 |

---

## 6. "Why Azza?" — four frames, four components

**Verdict: four separate components. Not one component with variants.**

| Node | Frame | Size | Layout model | Content | Interactive |
|---|---|---|---|---|---|
| `570:434` | Main Landing | 1440 × 968 | **absolute**, no auto-layout | Heading + 7-item selectable list + 518×653 phone panel | **yes** |
| `553:287` | Cross Border | 1440 × 968 | `V, gap 48, pad 80/0/80/0` → 1200 card, padding 72 → `V, gap 40` → `H, gap 40` | Heading + two 508×518 feature cards | no |
| `412:2516` | For Business | 1440 × 825 | `V, gap 48, pad 80/0/80/0` → absolute group 846 | Eyebrow pill + 5-paragraph prose column, 650 wide | no |
| `458:261` | For Business | 1440 × 702 | **`HORIZONTAL`**, `gap 200, pad 100/0/100/0` | 500px text+steps column (3 rows of 500×71) + 400×502 image | no |

### Why the heights differ

The four heights (968 / 968 / 825 / 702) are **not** one layout with different content lengths. They are four
different structures:

- `458:261` is the only **horizontal** section of the four. Its height is `100 + 502 + 100` — driven by the
  *image*, which the other three do not have in that position.
- `412:2516` contains **no image at all**. Its 825 is `80 + 665 + 80`, driven by a prose column.
- `553:287`'s 968 is `80 + 808 + 80`, driven by a card that has 72px of its own padding — a structure absent
  from all three others.
- `570:434` has **no auto-layout whatsoever** and is the only one with interactive state. Its 968 is a hand-set
  frame height.

Two of them coincidentally land on 968; that is the only thing they share besides the layer name.

### What they do share

Only the **section shell**: full-bleed 1440, vertical padding of 80 or 100, a centred content container, and
(for 3 of 4) the 48px heading→body gap. That belongs in the shared `Section` primitive, not in a Why-Azza
component.

### Recommendation to Phase 2

Split `impl-why-azza` into four bodies over one shell. Rename them, because "Why Azza?" appears four times in
the layer tree and name-based lookup will mis-assign work:

| Suggested name | Node | Notes |
|---|---|---|
| `WhyAzzaAccordion` | `570:434` | The only interactive one. §6.1 |
| `WhyAzzaFeatureDuo` | `553:287` | Card with 72px padding, 2-up 508px cards, gap 40 |
| `WhyAzzaNarrative` | `412:2516` | Eyebrow + 650px prose column, `V, gap 20` |
| `WhyAzzaSteps` | `458:261` | Horizontal split, gap 200, three 500×71 step rows |

This contradicts PLAN §4's single `impl-why-azza` "shared with variants". Raised in the report.

### 6.1 `570:434` — the list is an accordion, and the Figma frame is clipping

The list `570:436` (560 × 581, `V, gap 40`, `clipsContent: true`) has seven rows. **Six rows are fixed at 32px
tall but contain 100px of content** (title 32 + `gap 16` + description 52). Only row four,
`570:446` "Create Your Azza Name", hugs to its full 100px.

I rendered the section to resolve it. The intent is unambiguous:

- Rows are **collapsed by default**: title only, 32px tall, in a muted colour.
- **One row is active**: title in full contrast + description visible, 100px tall, with a 22 × 23 marker
  (`570:460`) at x=120 — i.e. flush with the 1200 container's left edge, while the list text sits at x=188.
- Row gap is **40** in both states.
- Collapsed rows do *not* render their descriptions. The Figma overflow is an artifact of authoring all seven
  descriptions inside 32px boxes; it is not a visual the user ever sees.

Geometry check: `32 × 6 + 100 + 40 × 6 = 532`; centred in 581 → first row at y 24.5 ✓ (matches the file).

Expanding a different row changes the list's intrinsic height by 0 (all rows have equal-length titles and the
container is `primaryAxisAlignItems: CENTER`, so it re-centres). Hold the list box at **560 × 581** and let
rows swap state inside it.

---

## 7. Auto-layout → CSS translation

### 7.1 Property mapping

| Figma | CSS / Tailwind |
|---|---|
| `layoutMode: HORIZONTAL` | `flex flex-row` |
| `layoutMode: VERTICAL` | `flex flex-col` |
| `layoutMode: NONE` | `relative` + absolutely-positioned children (147 frames — §7.5) |
| `itemSpacing: N` | `gap-[N/4]` |
| `paddingTop/Right/Bottom/Left` | `pt-/pr-/pb-/pl-` |
| `primaryAxisAlignItems: MIN / CENTER / MAX / SPACE_BETWEEN` | `justify-start / center / end / between` |
| `counterAxisAlignItems: MIN / CENTER / MAX` | `items-start / center / end` |
| `primaryAxisSizingMode: AUTO` | main axis hugs — omit a fixed size |
| `primaryAxisSizingMode: FIXED` | explicit `w-` (horizontal) or `h-` (vertical) |
| `counterAxisSizingMode: AUTO` | cross axis hugs |
| `layoutSizingHorizontal: FILL` | `flex-1` / `w-full` |
| `layoutSizingHorizontal: HUG` | `w-fit` |
| `layoutSizingHorizontal: FIXED` | explicit `w-[Npx]` |
| `layoutPositioning: ABSOLUTE` | `absolute` inside a `relative` parent — takes no part in flow |
| `layoutWrap: WRAP` | **never occurs** — 0 frames |
| `clipsContent: true` | `overflow-hidden` |

### 7.2 Major frames — direct translation

| Node | Figma | CSS |
|---|---|---|
| `412:1829` (page root) | `V, gap 0, pad 0, MIN\|MIN, AUTO/FIXED` | `flex flex-col w-[1440px]` — no gap |
| `412:2066` (Top Nav) | `H, gap 258, pad 40/0/40/0, CENTER\|CENTER, FIXED/FIXED` | `flex h-[123px] items-center justify-center py-10` + inner `w-[852px] justify-between` |
| `412:1554` (FAQs) | `V, gap 48, pad 80/0/80/0, MIN\|CENTER, AUTO/FIXED` | `flex flex-col items-center gap-12 py-20 w-full` |
| `412:2196` (Card deck) | `V, gap 48, pad 100/0/100/0, CENTER\|CENTER, AUTO/FIXED` | `flex flex-col items-center justify-center py-25 w-full` (gap inert) |
| `553:287` (Why Azza duo) | `V, gap 48, pad 80/0/80/0, CENTER\|CENTER, AUTO/FIXED` | `flex flex-col items-center justify-center gap-12 py-20 w-full` |
| `458:261` (Why Azza steps) | `H, gap 200, pad 100/0/100/0, CENTER\|CENTER, FIXED/AUTO` | `flex w-full items-center justify-center gap-50 py-25` |
| `412:2436` (Biz hero) | `H, gap 40, pad 80/0/80/0, CENTER\|CENTER, FIXED/FIXED` | `flex h-[769px] items-center justify-center gap-10 py-20` |
| `500:1736` (Help & Support) | `H, gap 72, pad 80/80/80/80, MIN\|MIN, FIXED/AUTO` | `flex items-start justify-start gap-18 p-20` |
| `352:3582` (Blog hero) | `V, gap 48, pad 80/0/80/0, CENTER\|CENTER, AUTO/FIXED` | `flex flex-col items-center justify-center gap-12 py-20 w-full` |
| `500:2197` (All Articles) | `V, gap 48, pad 0/0/120/0, CENTER\|CENTER, AUTO/FIXED` | `flex flex-col items-center justify-center gap-12 pb-30 w-full` |
| `352:3681` (Article) | `V, gap 48, pad 80/0/80/0, CENTER\|CENTER, AUTO/FIXED` | `flex flex-col items-center justify-center gap-12 py-20 w-full` |
| `498:600` (Footer inner) | `V, gap 89, pad 0, MIN\|CENTER, AUTO/FIXED` | `flex w-[1002px] flex-col items-center gap-[89px]` |

### 7.3 Card rows → prefer CSS Grid

Four rows in the design are `HORIZONTAL, gap 40` containing equal-width children. Build these as `grid`, not
`flex`, so the columns stay equal under content variation:

| Node | Figma | Build as |
|---|---|---|
| `500:2214` / `500:2236` / `500:2258` | `H, gap 40`, 1160 wide, 3 × 360 | `grid grid-cols-3 gap-10 w-[1160px]` |
| `352:3743` | `H, gap 40`, 1160 wide, 3 × 360 | `grid grid-cols-3 gap-10 w-[1160px]` |
| `553:291` | `H, gap 40`, 1056 wide, 2 × 508 | `grid grid-cols-2 gap-10 w-[1056px]` |
| `498:613` | `H, gap 80`, 802 wide, 4 unequal (199/128/116/119) | `flex gap-20` — columns are *not* equal; grid would wrongly equalise them |

**Card width derivation:** `(1160 − 2 × 40) / 3 = 360`. `(1056 − 40) / 2 = 508`. Both confirmed against the
measured children.

### 7.4 SPACE_BETWEEN — the fake gaps

Five frames report a large `itemSpacing` that is computed slack, not a designed value. **Never emit these as
`gap`.**

| Node | Reported gap | Real intent |
|---|---|---|
| `412:2066` and 7 nav siblings | 258 | `justify-between` in an 852px cluster |
| `498:634` and 7 footer siblings | 355 | `justify-between` across 1016 |
| `412:1221` (Azza Wrapped controls) | 711 | `justify-between` across 1139.5 |
| `412:1674` (Crypto Wallet chat row) | 283 | `justify-between` across 485 |
| `500:2201`, `521:575` | 40 (declared) but `SPACE_BETWEEN` | `justify-between` across 1160 — the 40 never applies |

### 7.5 The 147 absolute frames

27% of frames have no auto-layout. Where they carry real layout (as opposed to decorative artwork), reconstruct
them as flex/grid using the measured values in §4. The five that matter:

| Node | Reconstruct as |
|---|---|
| `412:761` (landing hero) | `relative` section; centred 878px column `flex flex-col gap-8`; QR `absolute` |
| `570:434` (Why Azza landing) | `relative` section; heading at container edge; list 560px `flex flex-col gap-10`; media panel `absolute right-[120px]` |
| `412:1587` (Crypto Wallet hero) | `relative`; text column `w-[429px]` at left 150; media `absolute left-[710px] top-[127px] w-[580px]` |
| `412:1065` (testimonials) | `relative`; three 305×319 cards at x 242/567/892, middle raised 63 |
| `412:1556` (FAQ card) | `relative` card; left panel and answer panel absolutely placed (see §5.3 insets) |

Decorative-artwork frames (`412:1234`, `412:1155`, `412:2444`, `412:2453`, `412:2465`, `634:246`) stay
absolutely positioned — they are illustration, not layout.

---

## 8. Alignment rules

### 8.1 Mathematical centring (the default)

These are exactly centred and must stay so:

| What | Evidence |
|---|---|
| All 8 Top Nav clusters | `(1440 − 852.37) / 2 = 293.81` = measured x ✓ |
| Footer content block | `(1440 − 1002) / 2 = 219` ✓ |
| Footer link block within it | `(1002 − 1016) / 2 = −7` ✓ |
| FAQ heading and card | `(1440 − 987) / 2 = 226.5` ✓ |
| Landing hero text column | `(1440 − 878) / 2 = 281` ✓ |
| Landing hero CTA in its column | `(878 − 182) / 2 = 348` ✓ |
| Landing CTA block + START pill | `(1440 − 635) / 2 = 402.5 → 403`; `(1440 − 146) / 2 = 647` ✓ |
| Why-Azza-steps row | `(1440 − (500 + 200 + 400)) / 2 = 170` ✓ |
| Why-Azza-narrative group | `(1440 − 846) / 2 = 297` ✓ |
| Article prose within its column | `(985 − 842) / 2 = 71.5` ✓ |
| Related-posts bleed | `(985 − 1160) / 2 = −87.5` ✓ |
| Blog hero inner block, vertically | `(866 − 734) / 2 = 66` ✓ |

### 8.2 Left-edge alignment

- **Container left edge** is the alignment spine within a section. On the landing Why-Azza the heading
  (`570:435`) and the active-item marker (`570:460`) both sit at **x = 120** — the 1200 container edge — while
  the list text is inset a further 68. Keep the marker on the container edge.
- Help & Support: sidebar and content both `items-start`; the section is `justify-start`, which is what
  produces the 120px right slack (§4.9).
- Footer link columns: all four are top-aligned (`MIN|MIN`) with a **46px** row pitch inside each column
  (heading at 0, links at 46 / 92 / 138).

### 8.3 Optical corrections — intentional, do not normalise

| What | Node | Correction |
|---|---|---|
| Testimonial middle card raised **63px** | `412:1084` (y 279) vs `412:1068` / `412:1076` (y 342) | Deliberate stagger. The group bbox (`412:1067`, 955 × 382) is the union, and the section's bottom padding (111) is measured from the *lower* cards. |
| Why-Azza marker offset **46px** | `570:460` → `570:436` | Marker on the container edge, text inset — reads as a left rail. |
| Nav links bottom-aligned | `412:2067` `counterAxisAlignItems: MAX` | The 20px logo and the 19px link row are baseline-matched, not centre-matched, within their 20px row. |
| FAQ card right inset 59 vs left 28 | `412:1556` | Balances the decorative background, which is off-centre. |
| QR tile image inset 9px left | `412:888` etc. | The 102×102 QR image is inset 9 in a 120-wide tile — optically centred against the tile's own padding, not mathematically (`(120−102)/2 = 9` ✓ actually mathematical; the `y: −3` is the optical part). |

### 8.4 Vertical alignment inside sections

- Every auto-layout section uses `counterAxisAlignItems: CENTER` — content is horizontally centred in the
  1440 band. Only `500:1736` / `500:2305` (Help & Support) use `MIN`.
- `primaryAxisAlignItems` is `CENTER` on sections whose height is fixed (`412:2436`, `458:261`, `553:287`,
  `412:2516`, `352:3582`, `500:2197`, `352:3681`) and `MIN` on sections that hug (`412:1554` family).
  Where the section hugs, `justify-*` has no visible effect — do not over-specify it.

---

## 9. Fixed vs fluid

| Dimension | Fixed or fluid | Rule |
|---|---|---|
| Section width | **fluid** | Always `100%` / `100vw`. Never `1440px`. |
| Section background | **fluid** | Full-bleed at every viewport. |
| Section vertical padding | **fixed** | 80 / 100 / 120 px. Do not scale with viewport at ≥1440. |
| Content container width | **fixed max, fluid below** | `max-width: <token>; margin-inline: auto`. Caps above 1440 (§3.5). |
| Section heading → body gap | **fixed** | 48px, all breakpoints ≥1440. |
| Top Nav height | **fixed** | 123px. |
| Footer height | **fixed** | 764px at 1440. Becomes fluid below, per `design/responsive.md`. |
| Card widths (360 / 508 / 305) | **fluid within grid** | Derived from `(container − gaps) / columns`. Express as grid tracks, not literal px, so they survive container changes. |
| Grid gutters (40) | **fixed** | 40px. |
| Media panels (518×653, 580×650, 400×502, 346×585) | **fixed aspect** | Fixed px at 1440; preserve aspect ratio when scaling. |
| QR floater | **fixed** | 120 × 174, `right: 82px`. |
| Article prose measure (842) | **fixed max** | A reading measure — must not grow with the viewport. |
| Card deck (1300 × 700) | **fixed** | Per DECISIONS D-007, normalised to 1300. |
| Decorative artwork | **fixed, clipped** | Absolute px inside `overflow-hidden` sections. |

---

## 10. Implementation form — Tailwind v4

### 10.1 `@theme` additions

Tailwind v4's default `--spacing: 0.25rem` already produces the entire scale in §1.2. **Do not override it.**
Add only semantic aliases and the container widths.

```css
@theme {
  /* --spacing defaults to 0.25rem (4px). The AZZA scale is native:
     gap-0.5=2  gap-1=4   gap-2=8   gap-3=12  gap-4=16  gap-5=20  gap-6=24
     gap-7=28   gap-8=32  gap-10=40 gap-12=48 gap-14=56 gap-15=60 gap-16=64
     gap-18=72  gap-20=80 gap-25=100 gap-28=112 gap-30=120 gap-50=200        */

  /* Section rhythm */
  --spacing-section:           5rem;    /*  80px — standard section padding-block   */
  --spacing-section-spotlight: 6.25rem; /* 100px — card deck, why-azza-steps         */
  --spacing-section-final:     7.5rem;  /* 120px — last content section before footer */
  --spacing-section-header:    3rem;    /*  48px — section heading -> section body    */
  --spacing-gutter:            2.5rem;  /*  40px — column gutter in card rows         */

  /* Sanctioned off-scale exceptions (§1.4) */
  --spacing-footer-split:     89px;
  --spacing-footer-top:      107px;
  --spacing-footer-bottom:   106px;

  /* Containers */
  --container-bleed:      100%;
  --container-wide:       80rem;    /* 1280 */
  --container-default:    75rem;    /* 1200 */
  --container-grid:      72.5rem;   /* 1160 */
  --container-footer:   62.625rem;  /* 1002 */
  --container-faq:      61.6875rem; /*  987 */
  --container-article:  61.5625rem; /*  985 */
  --container-prose:    52.625rem;  /*  842 */
  --container-nav:        852px;

  /* Fixed chrome */
  --height-nav:    123px;
  --height-footer: 764px;

  /* Radii */
  --radius-xs:   4px;
  --radius-sm:   8px;   /* default */
  --radius-md:  12px;
  --radius-lg:  16px;
  --radius-xl:  20px;
  --radius-2xl: 32px;
  --radius-3xl: 48px;
  --radius-full: 9999px;
}
```

### 10.2 The section shell primitive

Every one of the 22 page sections is one of three shells. Build this once in `src/components/ui/`.

```tsx
type SectionProps = {
  rhythm?: 'standard' | 'spotlight' | 'final' | 'none';  // 80 | 100 | 0/120 | 0
  container?: 'bleed' | 'wide' | 'default' | 'grid' | 'prose';
  align?: 'center' | 'start';
};

// standard  -> py-20            (80/80)   17 of 22 sections
// spotlight -> py-25            (100/100)  2 sections: 412:2196, 458:261
// final     -> pt-0 pb-30       (0/120)    1 section:  500:2197
// none      -> p-0                         2 sections: footer, nav (own chrome)
```

```tsx
<section className="w-full py-20">
  <div className="mx-auto flex w-full max-w-(--container-default) flex-col items-center gap-12">
    {children}
  </div>
</section>
```

### 10.3 Sanity assertions for the layout auditor

Machine-checkable statements that must hold in the built site at 1440:

1. No `margin-top` or `margin-bottom` on any `<section>`. Sections abut; rhythm is padding only.
2. Every `<section>` `padding-block` ∈ {80px, 100px, 0/120px, 40px (nav), 107/106px (footer)}.
3. Every `gap` value ∈ {2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 60, 64, 72, 80, 89, 100, 112, 120, 200} px.
4. No `gap: 10px` anywhere. No `gap: 258px / 283px / 355px / 711px` anywhere.
5. No `flex-wrap` on any layout container.
6. Header height exactly 123px; footer height exactly 764px; both on all 7 routes.
7. Nav inner cluster width 852px, centred — **not** matching any content container.
8. Blog card grid: `grid-template-columns: repeat(3, 1fr)`, `gap: 40px`, container 1160px → computed card 360px.
9. Article prose column `max-width: 842px`.
10. The 7 sanctioned exceptions in §1.4 are present and are **not** flagged as violations.

---

## 11. Anomaly register — by node id

Reported rather than silently corrected. Each has a resolution.

| # | Severity | Node(s) | Anomaly | Resolution |
|---|---|---|---|---|
| 1 | **major** | `352:3681` vs `498:851` | Article body ends at y=3761; footer starts at y=3750 — an **11px overlap** in frame `282:803` | Place footer at 3761. Page height becomes 4525, not the frame's 4514. |
| 2 | **major** | `570:436` rows `570:437/440/443/449/452/455` | Six list rows are 32px tall containing 100px of content; parent clips | Not a defect — it is a collapsed-accordion state. Build collapsed rows title-only. §6.1 |
| 3 | **major** | `498:402`, `500:2426` | 129×46 "View More" buttons parked at **y=2954**, ~1100px outside their frames, hidden by clipping | Abandoned artifacts. Do not build. Likely the source of PLAN's phantom "breadcrumb (46)". |
| 4 | major | `412:762` | 845×0 "Line 1" at y=2155 inside an 850px-tall clipped hero | Stray. Do not build. |
| 5 | major | `570:459` | 567×262 rect at y=922 in a 968px section — 216px sits outside | Stray or misplaced lower gradient. Do not build; if a bottom fade is wanted, mirror `570:458`. |
| 6 | minor | `498:633` | Footer divider: x=171 w=845 inside a 1016-wide `MIN`-aligned parent — geometrically inconsistent, and invisible in render | Reserve the flow slot, render no visible rule. §5.2 |
| 7 | minor | `412:884/885`, `511:464/465`, `412:1990`, `412:2602` | Inner block (120) is 1px wider than its parent (119) in all four QR cards | Set both to 120. |
| 8 | minor | `500:1736`, `500:2305` | Declared `padding-right: 80` but content stops at x=1320, leaving 120 | Faithful: `justify-start`, right slack 120. |
| 9 | minor | `412:1180/1181/1186/1190` | Sub-pixel spacing (34.87, 8.205, 4.103) from a scaled group | → 32, 8, 4. |
| 10 | minor | `458:267/271/275` | `padding 14/12`, `gap 18` — off-scale on three identical rows | → `padding 16/12`, `gap 16`. |
| 11 | minor | `412:1573/1998/1761/2635` | FAQ answer panel `padding 32/38` | → `32/40`. |
| 12 | minor | `374:507/630/644` | Decorative offsets of 50 | → 48. |
| 13 | minor | `412:1622`, `412:1675` | Button icon gaps of 7 and 9 where siblings use 8 | → 8. |
| 14 | minor | 69 frames | `itemSpacing: 10` on single-child frames | Inert. Discard. §1.3 |
| 15 | minor | `412:2517` | Eyebrow→prose gap of 53 in an absolute group | Keep — no auto-layout to normalise against. |
| 16 | info | `412:1226` | Two 56×52 arrow buttons report x=56 and x=68 inside a 124-wide `gap 12` parent (implies overlap) | Trust the parent: 56 + 12 + 56 = 124. Place at x=0 and x=68. |
| 17 | info | PLAN §1 | FAQs listed as 3 occurrences, QR band as 3 | Both are **4**. §5.3, §5.4 |
| 18 | info | PLAN §4 | `impl-why-azza` planned as one component with variants | Should be four. §6 |

---

## 12. Quick reference card

```
PAGE MODEL
  sections stack, gap 0, full-bleed 1440
  rhythm lives in section padding-block

SECTION PADDING          80 standard · 100 spotlight · 0/120 final · 40 nav · 107/106 footer
SEAM BETWEEN SECTIONS    160 (standard↔standard) · 180 (standard↔spotlight)
HEADING → BODY           48
COLUMN GUTTER            40
CHROME                   nav 123 · footer 764

CONTAINERS               1280/80 · 1200/120 (default) · 1160/140 · 1002/219 · 987/226.5 · 985/227.5 · 842/299
NAV CLUSTER              852.37 centred @293.81 — aligns to nothing else
CARD DECK                1300 @70 (breaks the container)

SPACING SCALE (4px base) 2 4 8 12 16 20 24 28 32 40 48 56 60 64 72 80 100 112 120 200
NEVER EMIT               gap 10 · gap 258/283/355/711 · flex-wrap
```
