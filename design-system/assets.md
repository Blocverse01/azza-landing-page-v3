# Imagery & Asset Contract — AZZA Website

- **Run:** `2026-08-01-azza-website`
- **Figma file:** `OXDVihY7WvtPZ6uGuVFx5Y` — section `672:246` "FOR BUILD", plus component set `507:498`
- **Asset root:** `runs/2026-08-01-azza-website/design/assets/`
- **Totals:** **41 files, 2,623,321 bytes (2.50 MB)** on disk
- **Design width:** 1440. All placed sizes below are at that width.

> **Revision 2 (`imagery-asset-expert-r2`).** Five assets were added; **no existing file was
> modified or deleted** — all 36 originals verified byte-identical by md5 (§12.5). The additions
> came out of a full reference-graph sweep (§12) rather than a container-scoped traversal, which is
> why four of the five were found at all. New material: **§4.3**, **§4.4**, **§5.4**, **§12**,
> **§13**, **§14**. §14 is the mechanical import map for the mirror step.

Every file here came from a Figma export of the real node. Nothing was redrawn, traced, or
substituted. All bytes are on disk — no Figma asset URL is referenced anywhere in this document
as a source of truth, because those URLs expire in roughly seven days.

---

## 1. How to read this

**Intrinsic** = the pixel (or viewBox) dimensions of the file on disk.
**Placed** = the size the node occupies in the 1440-wide Figma frame.
**Scale** = intrinsic ÷ placed. Anything below 2.00 is called out in §7 as a resolution shortfall
that no amount of re-exporting can fix — the source bitmap in the Figma file is simply smaller.

`content` assets carry meaning and need real alt text. `decorative` assets get `alt=""` and
`aria-hidden`, and must never be announced.

---

## 2. Manifest — brand

| File | Source node | Intrinsic | Placed | Ratio | Format | Role | Used on |
|---|---|---|---|---|---|---|---|
| `brand/logo-azza-wordmark.svg` | `498:604` (also `412:2068`, `511:434`, `412:1833`, `412:2611`, `412:2781`, `412:2805`, `498:212`) | viewBox 95×32 | 94.996×32 (footer), 59.372×20 (nav) | 2.97 | SVG | content | all 7 routes |
| `brand/wordmark-azza-outline.svg` | `412:1251` | viewBox 238×120 | 237.598×119.945 | — | SVG | decorative | `/` |
| `brand/qr-whatsapp.png` | `412:888` (also `511:468`, `412:1994`, `412:2606`) | 500×500 | 102×102 | 4.90× | PNG | content | `/`, all 3 `/products/*` |

**Format reasoning.** The wordmark is vector in the file and is the single most-repeated element on
the site (nav + footer × 7 routes) — SVG, inlined, never an `<img>`. The QR code stays PNG: it is
lossless line art where a lossy codec would corrupt the modules, and at 2.3 KB there is nothing to
gain from WebP.

**Note on the logo SVG.** The extracted file is the `Group 33` subtree only. Figma's whole-node SVG
export nests the requested node under the page canvas plate, the "FOR BUILD" section plate and the
frame background — all four were stripped by anchoring on the node's own layer id. No path data was
altered. The same treatment was applied to every SVG in §4; each was re-rendered in a browser
afterwards to confirm it still draws correctly.

---

## 3. Manifest — product surfaces (phone mockups)

| File | Source node | Intrinsic | Placed | Scale | Format | Role |
|---|---|---|---|---|---|---|
| `product/device-frame-phone.webp` | `553:297` (`main`) | 1002×2048 | 400.787×819.174 max | 2.50× | WebP α | decorative |
| `product/device-frame-phone-shadow.webp` | `553:296` (`shadow`, 70% opacity) | 1002×2048 | 400.787×819.174 | 2.50× | WebP α | decorative |
| `product/phone-screen-whatsapp-transfer.webp` | `507:764`, `570:465`, `553:298`, `553:304` | 576×1280 | 363.175×787.302 max | **1.59×** | WebP | content |
| `product/phone-screen-whatsapp-business.webp` | `458:282` | 1170×2532 | 363.175×787.302 | 3.22× | WebP | content |

### 3.1 The device frame is separable — answered

**Yes, fully separable, and the frame is itself a raster.** This was the spec's explicit question, and
the answer is not what the layer names suggest.

Each mockup is a three-node stack (`Currency 1` / `Currency 2` groups):

```
Currency 2  (507:761)
├─ shadow   (507:762)  rounded-rect, image fill, opacity 70%   ← soft drop shadow, raster
├─ main     (507:763)  rounded-rect, image fill                ← black device body, raster
└─ image 7  (507:764)  rounded-rect, image fill, radius 39.115px ← screen content, raster
```

`shadow` and `main` are **image fills, not CSS shapes** — a plausible-looking assumption that would
have produced a wrong build. They are exported here once and are reused by all four mockups.

Consequences for Phase 2:

- Screen content can be swapped without re-exporting the device. Build the mockup as a container
  with `device-frame-phone.webp` on top (or behind, per z-order) and the screen inset.
- The screen inset, measured from `507:761`: `left 17.11px, top 13.04px` of a 342.932×700.923 frame
  = **4.99% left, 1.86% top**, screen size **90.6% × 96.1%** of the device box. Corner radius on the
  screen is `39.115px` at 310.749px wide = **12.59% of screen width**.
- The screen image is drawn slightly over-scaled inside that inset — `w 100.07%, h 102.58%,
  left −0.03%, top −0.81%`. In CSS that is `object-fit: cover; object-position: center 42%`.
- `shadow` is a near-black soft blur at 70% opacity. It costs 4 KB, but a CSS
  `filter: drop-shadow()` on the device frame is cheaper still and reflows better. Ship the asset;
  prefer the CSS if it matches at 1440.

### 3.2 One screenshot does the work of four

`phone-screen-whatsapp-transfer.webp` (md5 `8660fcf3` on the source PNG) is the **same image** used
at all four of `507:764`, `570:465`, `553:298` and `553:304` — the card deck, the landing "Why Azza?"
section, and both cross-border mockups. Import it once.

---

## 4. Manifest — illustration (vector unless stated)

| File | Source node | Intrinsic | Placed | Format | Role | Used on |
|---|---|---|---|---|---|---|
| `illustration/coin-flag-nigeria.svg` | `412:846` | viewBox 132×132 | 132×132 | SVG | decorative | `/` hero |
| `illustration/coin-flag-ghana.svg` | `412:798` | viewBox 161×186 | 160.682×185.049 | SVG | decorative | `/` hero |
| `illustration/coin-flag-kenya.svg` | `412:864` | viewBox 169×158 | 168.999×157.258 | SVG | decorative | `/` hero |
| `illustration/coin-dollar.svg` | `412:834` | viewBox 143.8×200.3 | 225.532×245.580 | SVG | decorative | `/` hero |
| `illustration/hero-flag-nigeria-textured.webp` | `412:845` @3× | 396×396 | 132×132 | WebP α | decorative | `/` hero |
| `illustration/coin-usdc.svg` | `507:729` | viewBox 428×299 | 427.205×427.205 | SVG | decorative | `/` card deck |
| `illustration/coin-usdt-tilted.svg` | `507:739` | viewBox 351×268 | 444.611×350 | SVG | decorative | `/` card deck |
| `illustration/azzaman-character.webp` | `412:1215` | 1600×1600 (src 2048²) | 642.476×642.476 | WebP α | content | `/` Azza Wrapped |
| `illustration/wrapped-baddiie-ribbon.webp` | `412:1218` @3× | 2061×373 | 686.725×156.222 | WebP α | decorative | `/` Azza Wrapped |
| `illustration/wrapped-pattern-disc.webp` | `412:1211` @2× | 1173×1173 | 586.154×586.154 | WebP α | decorative | `/` Azza Wrapped |
| `illustration/wrapped-badge-ring.svg` | `412:1203` | viewBox 123×123 | 122.399×122.399 | SVG | decorative | `/` Azza Wrapped |
| `illustration/map-ghana-flag.svg` | `412:2444` | viewBox 407.2×572.0 | 567.433×663.614 | SVG | decorative | `/products/for-business` |
| `illustration/map-south-africa-flag.svg` | `412:2453` | viewBox 597.0×533.6 | 675.900×624.671 | SVG | decorative | `/products/for-business` |
| `illustration/map-nigeria-flag.webp` | `412:2465` @2× | 1532×567 | 850.813×777.329 (clipped) | WebP α | decorative | `/products/for-business` |
| `illustration/map-nigeria-outline.svg` | `412:2465` mask path | viewBox 703.2×566.5 | — | SVG | decorative | fallback for the above |
| `illustration/location-pin-1.svg` | `412:2474` | viewBox 85×94 | 84.623×93.570 | SVG | decorative | `/products/for-business` |
| `illustration/location-pin-2.svg` | `412:2488` | viewBox 88×93 | 87.719×92.434 | SVG | decorative | `/products/for-business` |
| `illustration/location-pin-3.svg` | `412:2502` | viewBox 76×81 | 75.350×93.765 | SVG | decorative | `/products/for-business` |
| `illustration/cta-coins-composition.svg` | `412:1234` (15 nodes) | viewBox 1070×616 | 1069.892×615.403 | SVG + 2 embedded PNG | decorative | `/` CTA — **new, §4.3** |
| `illustration/deck-flag-roundel-ribbon.svg` | `458:333` | viewBox 1271.64×920.31 | 1271.64×920.31 (card-clipped) | SVG + 1 embedded PNG | decorative | `CardDeck` "Move Money" — **new, §4.4** |
| `illustration/deck-globe.svg` | `458:396` | viewBox 678×678 | 678×678 (163 visible) | SVG | decorative | `CardDeck` "Operate Locally" — **new, §4.4** |
| `illustration/banknote-naira.svg` | `412:1630` (= `412:1636`) | viewBox 524×418 | 524×417.6 and 559×480 | SVG | decorative | `/products/crypto-wallet` — **new, §4.4** |

### 4.1 What the "hero ornaments" actually are

The landing hero headline reads *"Your m**O**NEY sh**O**uld w**O**rk anywhere."* Three of those
letter-Os are **not type** — they are illustrated coins substituted into the headline as glyphs:

| Headline word | Node | Asset | Content |
|---|---|---|---|
| `Your mONEY` | `412:834` | `coin-dollar.svg` | dark-green dollar coin, three-quarter view |
| `sh_uld w_rk` | `412:864` | `coin-flag-kenya.svg` | **Kenya** flag coin |
| `anywhere.` | `412:798` | `coin-flag-ghana.svg` | **Ghana** flag coin |
| hero, standalone | `412:846` | `coin-flag-nigeria.svg` | **Nigeria** flag roundel |

This matters for accessibility and for responsive work. The headline text nodes in Figma are split
into fragments (`412:863` "sh", `412:862` "uld w", `412:861` "rk") with the coins wedged between
them. In code the `<h1>` must contain the **complete** string "Your money should work anywhere." and
the coins must be absolutely-positioned `aria-hidden` decorations layered over it — not inline
images inside the heading, which would give screen readers "sh uld w rk".

`hero-flag-nigeria-textured.webp` is the same Nigeria roundel with the grain texture (§5) already
composited by the mask group. Prefer the SVG plus a CSS grain overlay; the WebP is the escape hatch
if the masked look proves hard to match.

### 4.2 The business-page illustrations are country maps

`412:2444`, `412:2453` and `412:2465` are named `Group 1410085210 / 09` and `Group 1261153116` in
Figma, which says nothing. Rendered, they are **flag-filled maps of Ghana, South Africa and
Nigeria** — the three corridors the product copy names. Do not treat them as abstract shapes; their
identity is the point.

`412:2465` (Nigeria) sits at `y = −494` inside its parent and is mostly clipped off the top of the
hero. `map-nigeria-flag.webp` is the visible sliver as the designer composed it. If the section
reflows at a smaller breakpoint and more of the shape becomes visible, use
`map-nigeria-outline.svg` and fill it, because the raster has no data above the crop.


### 4.3 The CTA coin composition — `412:1234`, and why it ships flattened

This is the asset the first pass missed. `412:1233` "use Azza Today" reserves 1069.892 × 615.403 —
**55% of the section's height** — for a group of **15 nodes**: three tilted coin discs, three pale
ghost ellipses (one of them, `412:1242`, `hidden="true"` and therefore not built), and the outlined
AZZA wordmark. Exactly one of the fifteen shipped in revision 1, and it was the one that cannot
stand alone.

**Why the shipped piece was invisible.** `brand/wordmark-azza-outline.svg` (`412:1251`) fills every
path `#FAFAFF`. That is near-white by design: it sits on the `#15139B` indigo top face of the centre
disc (`412:1247`). On any lighter surface it renders as nothing at all. Verified by rendering it in
Chrome twice — over `#15139B` it reads cleanly, over `#FFFFFF` the render is blank. The asset was
never wrong; it was never a whole.

**What the composition actually is**, in the SVG's own 1070×616 coordinate space:

| Piece | Nodes | Fill |
|---|---|---|
| Kenya disc | `412:1237` wall, `412:1238` face, `412:1257` flag | `#FE0000`@15% · `#FDD518` · Kenya PNG, `mix-blend-mode: hard-light` |
| AZZA disc | `412:1244/1245/1246` walls, `412:1247` face, `412:1251` wordmark | `#F4F4F4` · `#ACABEB` · `#504FB2` · `#15139B` · `#FAFAFF` |
| Nigeria disc | `412:1249` wall, `412:1250` face, `412:1256` flag | `#A9DEC9` · `#05955C` · Nigeria PNG, `mix-blend-mode: hard-light` |
| Ghost ellipses | `412:1239`, `412:1240`, `412:1241` | `#F1F1F1`, `#F1F1F1`, `#F2F2F2` |

**Decision: one flattened SVG, `illustration/cta-coins-composition.svg`.** Not a layered set. Four
reasons, in descending weight:

1. **The design has no per-layer consumer.** `components.md` §10 "Not built" rules out parallax on
   `412:1234` by name — *"absolutely composed at fractional coordinates with negative offsets;
   parallax tears them"* — and D-008 records that the file contains **no authored motion at all**
   (`get_motion_context` returns `{"nodes": []}`). Layered delivery exists to let pieces move
   independently. Nothing is going to move them.
2. **Both flag faces are `hard-light` layers that sit at the top of the group's stacking order**,
   not inside their own disc groups. Their rendered colour is a function of what is beneath them.
   Splitting the composition asks an implementer to reproduce a blend stack across separate
   elements, and `mix-blend-mode` across sibling DOM nodes resolves against the page backdrop, not
   against the intended one. Flattening keeps the blend inside a single isolated SVG — the file
   carries `style="isolation:isolate"` on its root group precisely so the page background can never
   leak into the blend.
3. **The responsive behaviour is uniform scaling, at every breakpoint.** The composition is one
   decorative band with fixed internal geometry, 1069.892 wide inside a 1440 frame (left margin 170,
   right 200). There is no mobile frame anywhere in the file (D-004), so no reflow is authored, and
   the faithful reading is to scale it as a unit inside a slot of ratio `1070/616`. Concretely:
   `2xl 1440` → 1070×616 · `xl 1280` → 951×547 · `lg 1024` → 761×438 · `md 768` → 571×329 ·
   `sm 640` → 476×274 · `320` base → 238×137. Vector holds at every one of those; the AZZA wordmark
   is still crisp at the 320 stop, where it is roughly 53 CSS px wide. A raster export sized for
   1440 would be soft below `lg` on retina and oversized above it. **The slot the section already
   reserves (1069/615, `data-art-pending="true"`) is this ratio**, so dropping the file in is a
   `src` change with zero reflow.
4. **One request, one file, no reassembly.** Six absolutely-positioned pieces means six sets of
   percentage offsets an implementer has to re-derive from this document and get right. The
   revision-1 failure was a piece that could not stand alone; a flat export is the one delivery
   shape that cannot repeat it.

**What would reverse this.** If a designer later supplies a mobile frame that re-arranges the discs,
or authors motion on them, re-export the three discs from `412:1236`, `412:1243` and `412:1248` —
each is a self-contained group that renders correctly in isolation (unlike `412:1251`) — and drop
the ghost ellipses to CSS, since they are plain solid-fill ellipses.

**Verified, not asserted.** Rendered in headless Chrome at `device_scale_factor: 2` and diffed
against Figma's own isolated render of `412:1234`, composited on the same `#F4F4F4` backdrop:
**98.30% of pixels within 4/255, mean luma difference 0.23/255.**

**Weight.** 48,079 bytes, of which ~44 KB is the two embedded flag PNGs (`Flag_of_Nigeria.svg (2).png`
960×480, `Flag_of_Kenya.svg (1).png` resampled 1280×854 → 800×534). The flags are **raster in the
Figma file** — there is no vector flag data to recover. The Kenya bitmap was resampled because it
was embedded at 3.31 px per composition unit; at 800 px wide it is 2.07×, which meets the 2× floor
and saves 4 KB. Nigeria is left untouched at **1.86×** — see §7, it cannot be improved from source.

### 4.4 The card-deck and crypto-wallet illustrations — three more that were never exported

All three were found by the §12 sweep, not by looking at the CTA.

**`deck-flag-roundel-ribbon.svg` ← `458:333`.** A diagonal ribbon of **five semi-transparent flag
roundels** — Nigeria `458:334`, Ghana `458:340`, South Africa `458:348`, Kenya `458:352`, Rwanda
`458:374` — that is the entire background of the deck's **"Move Money"** card (`507:497`). Each
roundel is a flag bitmap at **50% fill opacity** masked into a circle with a 0.5 px `#000`@50% inner
stroke. Shipped **unclipped** at its true 1271.64 × 920.31: in the design it is clipped by the card
frame `458:332` (1200×625) at offset `(-25.97, -169)`, and that crop belongs in CSS
(`overflow:hidden` on the card) so a narrower card reveals more art instead of running out of
pixels. This is the same lesson `map-nigeria-flag.webp` records in §4.2, applied before it bites.

**`deck-globe.svg` ← `458:396`.** The globe behind the deck's **"Operate Locally"** card
(`507:496`) — 678×678, Africa-centred, `#2E2EE6` ocean and `#0A6B2E` landmass. In the design only
the **top 163 px** is visible; the rest is clipped by `458:392`. Shipped whole, for the same reason
as the ribbon. The three red pins over it (`458:399` 122.5×221, `458:414` 53.5×96.5, `458:429`
31×56) are **not** in this file — they are the existing `location-pin` shape at three scales, see
§12.3.

**`banknote-naira.svg` ← `412:1630`.** A tilted naira banknote on `/products/crypto-wallet`
(`412:1586`), placed **twice** — `412:1630` at 524×417.6 and `412:1636` at 559×480 — from identical
path data (5,483 characters, byte-for-byte the same on both). One file, two placements. The `₦`
glyph inside it is a Figma TEXT node; it ships as vector outline because it is artwork, not copy —
nothing announces it and nothing needs to select it.

**Why all three are SVG and not WebP.** Every one is pure vector in the file apart from the ribbon's
five flag bitmaps, they are all placed at more than one size or clipped differently from their
intrinsic size, and the globe carries a 1 px coastline that visibly softens under rasterisation. The
globe SVG was reduced from 83,128 to 58,947 bytes by rounding path coordinates to one decimal —
verified as a no-op: **99.77% of pixels within 2/255, mean 0.031/255** against the full-precision
render.

---

## 5. Manifest — patterns and textures

| File | Source node | Intrinsic | Placed | Scale | Format | Role |
|---|---|---|---|---|---|---|
| `pattern/texture-grain.webp` | `412:883` fill (= `412:844`, `412:832`, `412:859`, `412:1220`) | 1700×1134 (1:1 crop of 5000×2500) | 842×562.064 max | 2.02× | WebP | decorative |
| `pattern/pattern-lightning-bolt.webp` | `412:1558` fill (= `412:1213`, `412:1763`, `412:2000`, `412:2637`) | 1374×1374 (src 3240²) | 1374×1374 | 1.00× | WebP α | decorative |
| `pattern/pattern-guilloche-green.webp` | `412:1163` fill (= `412:1216`) | 626×417 | 1604.103×1068.548 | **0.39×** | WebP | decorative |
| `pattern/wrapped-plate-pattern.webp` | `412:1156` fill | 2880×1506 | 1441×752.8 | 2.00× | WebP | decorative — **new, §5.4** |

### 5.1 The grain texture is one asset, and it was 8 MB

Every layer named `Textures` in the file — `412:844`, `412:883`, `412:832`, `412:859`, `412:1220`,
and the hidden `412:1283` — carries **the same image fill**: a 5000×2500 JPEG weighing
**7,992 KB**. One 8 MB noise field, referenced six times.

Shipping that is not an option, so the asset here is a **1:1 centre crop** to 1700×1134 — the
largest footprint any of those layers occupies (842×562) at 2×. Cropping rather than downscaling is
deliberate: resampling a noise field averages the grain away and destroys the exact thing the asset
is for. The pixels in this file are the designer's pixels, unresampled.

At 359 KB it is still the single heaviest asset in the library. Recommended treatment:

```css
.grain::after {
  content: "";
  position: absolute; inset: 0;
  background-image: url("/assets/pattern/texture-grain.webp");
  background-repeat: repeat;          /* noise tiles acceptably at low opacity */
  opacity: .18; mix-blend-mode: multiply;
  pointer-events: none;
}
```

Load it once, from CSS, not through `next/image`, and never per-instance.

### 5.2 The lightning pattern renders near-invisibly

`412:1558` is the FAQ card's background pattern — a bold black chevron/lightning motif. Its Figma
render at native size is **149 bytes**, because it sits inside a mask group (`412:1557`) whose
sibling `Rectangle 447` masks essentially all of it away. It is shipped at 1× (1374²) rather than 2×
for that reason: paying 545 KB for 2× on something that barely renders is a bad trade. If Phase 3
visual QA finds the pattern is more visible than the Figma render implies, re-export at 2748² from
node `412:1558`.

### 5.3 The guilloche pattern cannot be delivered at spec

`pattern-guilloche-green.webp` is the pale banknote-engraving pattern behind the Azza Wrapped card.
Its source bitmap in Figma is **626×417** and it is placed at **1604×1068** — the designer stretched
it to 2.56× its own size, so what ships is **0.39×** of the 1× requirement and **0.20×** of the 2×
requirement. There is no export setting that recovers this. See §7.


### 5.4 The Azza Wrapped plate — one asset, one CSS rule

`412:1155` "Azzaman" (the Azza Wrapped card) has **two full-width background layers**, neither of
which was in revision 1. They are deliberately delivered differently:

| Node | What it is | Delivery | Why |
|---|---|---|---|
| `412:1156` `Vector 670 (Stroke)` | 1441 × 752.8 plate whose **fill is a 3240² bitmap** — a dark-green chevron/lightning tile, image hash `47c14362` | `pattern/wrapped-plate-pattern.webp`, 2880×1506, 23,798 B | The fill is a raster. There is no vector to preserve. |
| `412:1157` `Vector 669 (Stroke)` | 1391 × 670 inner plate, solid `#61A807`, 1.026 px `#D3FEB6` stroke | **CSS, no asset** | Rendered it: a plain rectangle with an inset border. 804 bytes of SVG to express `background:#61A807` + a 1 px inset border is not an asset, it is a rule. |

**`412:1156` is not the same bitmap as `pattern-lightning-bolt.webp`.** Same motif, different image:
hash `47c14362` (opaque, green `rgb(48,83,6)`) versus `27fda63b` (semi-transparent, near-black).
Confirmed by sampling both. Shipping one for the other would have tinted the whole Azza Wrapped band
the wrong colour.

Ship it as a CSS `background-image` on the band, exactly like `texture-grain.webp` (§5.1) — not
through `next/image`. It is a full-bleed decorative plate behind live text.

---

## 6. Manifest — editorial imagery

| File | Source node(s) | Intrinsic | Placed | Ratio (src → slot) | Fit | Role |
|---|---|---|---|---|---|---|
| `blog/blog-banner-trade-crypto-whatsapp.webp` | `412:2960` | 2320×696 (src 4096×1229) | 1160×348 | 3.33 → 3.33 | exact | content |
| `blog/blog-card-ghanaian-suppliers.webp` | `500:2216`, `352:3706`, `352:3745` | 1400×1120 | 360×280 card; **985×600** article hero | 1.25 → 1.29 / 1.64 | cover | content |
| `blog/blog-card-naira-to-cedis.webp` | `500:2223`, `500:2267`, `352:3752` | 1456×1817 | 360×280 | **0.80 → 1.29** | cover ⚠ | content |
| `blog/blog-card-naira-to-rands.webp` | `500:2230`, `500:2252`, `500:2260`, `352:3759` | 1400×1120 | 360×280 | 1.25 → 1.29 | cover | content |
| `blog/blog-card-domiciliary-account.webp` | `500:2238`, `500:2274` | 1400×1120 | 360×280 | 1.25 → 1.29 | cover | content |
| `blog/blog-card-nigerian-tax-laws.webp` | `500:2245` | 1280×1024 | 360×280 | 1.25 → 1.29 | cover | content |
| `product/testimonial-portrait-placeholder.webp` | `412:1069`, `412:1077`, `412:1085` | 433×577 | 331.084×349.563 | 0.75 → 0.95 | cover, top | content |

### 6.1 There are five blog images, not ten

The `/blog` grid shows nine cards and the article page shows three related cards, but the file
contains **five unique bitmaps**. `image 4` appears four times, `image 3` and `image 5` three times
each. Confirmed by md5 on the source PNGs. Build the blog index from a content array that
references these five files; do not create ten import statements.

The article hero on `/blog/[slug]` (`352:3706`, "image 1") is **byte-identical** to the `/blog`
featured card `500:2216` ("image 2") — md5 `4ddc586d`. One file, two placements, two very different
aspect ratios.

### 6.2 Art direction — the one real crop problem

`blog-card-naira-to-cedis.webp` is **portrait, 1456×1817 (0.80)**, placed in a **landscape 360×280
(1.29)** card slot. With `object-fit: cover` roughly 56% of the image height is cropped away. The
image is a designed social card whose headline ("PAY IN NAIRA. YOUR CHALE RECEIVES CEDIS INSTANTLY")
sits in the **top third** — a centred cover crop removes it entirely and leaves only the hands and
the phone.

Use `object-position: center top` on this one card so the headline survives. The other four cards
are 1.25 against a 1.29 slot and crop imperceptibly; centre is correct for them.

The article hero is the second art-direction case: a 1.25 source in a 1.64 slot (985×600). Centre
cover is acceptable there because that image's headline is horizontally centred, but verify it in
Phase 3.

### 6.3 Placeholder colours

Solid-colour placeholders, sampled as the true mean of each shipped file. The design does not imply
blur-up or skeletons anywhere — the blog cards are flat brand-coloured artwork, so a solid fill
matched to the card reads as intentional rather than as a loading artefact. Use `placeholder="empty"`
with a CSS background colour on the wrapper, not `placeholder="blur"`.

| Asset | Placeholder |
|---|---|
| `blog-banner-trade-crypto-whatsapp` | `#5355E1` |
| `blog-card-ghanaian-suppliers` | `#B3ADD5` |
| `blog-card-naira-to-cedis` | `#AF6564` |
| `blog-card-naira-to-rands` | `#6364DB` |
| `blog-card-domiciliary-account` | `#534ED5` |
| `blog-card-nigerian-tax-laws` | `#4D47C5` |
| `phone-screen-whatsapp-transfer` | `#E4E3ED` |
| `phone-screen-whatsapp-business` | `#ECEFE8` |
| `testimonial-portrait-placeholder` | `#292120` |

Assets with alpha (`device-frame-*`, all `illustration/*`, `pattern-lightning-bolt`) get **no**
placeholder colour — they composite over a background and a fill behind them would show.

### 6.4 Proposed alt text

| Asset | Alt |
|---|---|
| `logo-azza-wordmark` (nav) | `Azza` — or `alt=""` when the link already has an accessible name of "Azza home" |
| `logo-azza-wordmark` (footer) | `Azza` |
| `qr-whatsapp` | `QR code to start a chat with Azza on WhatsApp` |
| `blog-banner-trade-crypto-whatsapp` | `Getting started with the Azza AI agent: how to trade crypto on WhatsApp` |
| `blog-card-ghanaian-suppliers` | `How Nigerian importers can pay Ghanaian suppliers faster` |
| `blog-card-naira-to-cedis` | `Pay in naira, your chale receives cedis instantly` |
| `blog-card-naira-to-rands` | `How to convert Nigerian naira to South African rands instantly` |
| `blog-card-domiciliary-account` | `The easiest way to fund a domiciliary account in Nigeria` |
| `blog-card-nigerian-tax-laws` | `What the new Nigerian tax laws mean for freelancers, remote workers, crypto investors, startups and businesses` |
| `phone-screen-whatsapp-transfer` | `WhatsApp chat with Azza showing a completed withdrawal and a cross-border transfer confirmation` |
| `phone-screen-whatsapp-business` | `WhatsApp chat with Azza creating a business account and returning the account details` |
| `testimonial-portrait-placeholder` | the speaker's name, e.g. `Snow Olohijere` — **must** vary per card once real portraits land |
| `azzaman-character` | `Azzaman, the Azza mascot, holding a fan of banknotes` |
| everything in `illustration/` and `pattern/` | `alt=""` + `aria-hidden="true"` |

Alt text repeats the headline that is baked into each blog card image. That is correct here: the
headline is only in the bitmap, and the card's own `<h3>` carries a *different, longer* title
string. If Phase 2 finds the two are identical for a given card, drop the image alt to `""` rather
than announce it twice.

---

## 7. Resolution shortfalls — cannot be fixed by re-exporting

Three assets ship below the 2× floor because the bitmap **inside the Figma file** is smaller than
2× the size it is placed at. Re-exporting at a higher scale would upscale, adding bytes and no
detail. Each needs the operator to supply a higher-resolution original.

| Asset | Source bitmap | Placed | Actual scale | Needed for 2× | Impact |
|---|---|---|---|---|---|
| `pattern-guilloche-green` | 626×417 | 1604×1068 | **0.39×** | 3208×2136 | Visible softness across the whole Azza Wrapped background. Worst of the three. |
| `phone-screen-whatsapp-transfer` | 576×1280 | 363×787 | **1.59×** | 727×1575 | Chat text in the mockup will be soft on retina. Re-capture on the device at native resolution. |
| `testimonial-portrait-placeholder` | 433×577 | 331×350 | **1.31×** | 662×699 | Soft on retina; also a placeholder (§8). |
| Nigeria flag inside `cta-coins-composition.svg` | 960×480 | ≈518 composition units wide | **1.86×** | 1036×518 | Marginal. The flag is a raster inside an otherwise-vector composition; it is the only part of the CTA art that does not scale losslessly. Barely visible in practice — it sits under a `hard-light` blend at 258 px. |

The other four revision-2 assets clear the bar: `cta-coins-composition` (vector apart from the two
flags), `deck-flag-roundel-ribbon`, `deck-globe` and `banknote-naira` are vector and therefore
resolution-independent, and `wrapped-plate-pattern` ships at exactly 2.00× (2880×1506 for a
1441×752.8 placement).

At the smaller placements the transfer screenshot is fine — 576×1280 against the card-deck's
310.749×673.651 is 1.85×, and against `570:465` (314.300×681.350) it is 1.83×. It is only the
cross-border mockups at 363.175 wide that push it under 1.6×.

---

## 8. Provenance and gaps

**The testimonial portraits are a placeholder, and the file says so.** The layer is named
`Profile, for now 4`. All three testimonial cards (`412:1069`, `412:1077`, `412:1085`) use the
**same 433×577 photograph of the same person**, while the captions give two different quotes and
the name "Snow Olohijere" three times. The operator must supply three real portraits plus the
subjects' consent. Shipping one stranger's photograph three times under three testimonial slots is
a real problem, not a cosmetic one.

**`phone-screen-whatsapp-business.webp` appears to contain live personal data.** The screenshot
legibly shows an account number, an account name and a bank name returned by the Azza bot. If those
are real, publishing them is a data-protection incident. This asset must be redacted or re-captured
against a test account before it goes to production. It is flagged in the report as a finding, not
merely a note.

**`phone-screen-whatsapp-transfer.webp`** shows a completed withdrawal with a currency amount and a
transaction confirmation. Lower risk than the above, but check it for identifiers before shipping.

**Third-party photography inside the blog cards — licensing unverified.** Three of the five blog
cards embed photographs whose origin is not determinable from the Figma file:

- `blog-card-ghanaian-suppliers` — a flat-lay of documents, a watch and a passport
- `blog-card-naira-to-cedis` — a close-up of a person's hands and jewellery holding a phone
- `blog-card-nigerian-tax-laws` — a 3D gavel render

The Azza-branded typographic layer over each is plainly first-party. The photographic and 3D layers
are not, and could be licensed stock, AI-generated, or unlicensed. The operator should confirm
rights before publication.

**Content gap, observed while verifying `500:2281`.** The Help & Support open-state article body is
**lorem ipsum**, not real copy. This contradicts the plan's assumption that all copy in the file is
real. Outside my remit to resolve, but the implementer of `/help` will need real content or an
explicit placeholder decision. Logged in `open_questions`.

**Hidden nodes, not exported.** These carry image fills but are `hidden="true"` in Figma and are
therefore not part of the design: `412:1217` (`image 1101`), `412:1283` (`Textures`), `507:731`
(`za 1 1`), `412:1158` (`Asset 6`), `412:790`, `412:1242`, `412:1258`, `634:246`. If any of them
turns out to be needed, the node ids are here.

**`_reference/azza-wrapped-composite-2x.webp` is not a production asset.** It is a 2× flat render of
the whole Azza Wrapped card (`412:1155`) supplied for visual comparison only. The real section must
be composed from `azzaman-character`, `wrapped-pattern-disc`, `wrapped-baddiie-ribbon`,
`wrapped-badge-ring`, `pattern-guilloche-green` and **live text**, because it contains the figures
"$500 / $5000 / 100 / BNB" and a name label that need to be selectable, translatable and
screen-reader accessible. Do not ship the composite. One discrepancy worth knowing: the composite
renders the name label as `HUSTLER` while text node `412:1219` reads `BADDIIE` — treat the text
node as authoritative and the label as a variant.

---

## 9. `next/image` contract

### 9.1 General rules

- **SVGs are never `next/image`.** Import them as React components (`@svgr/webpack`) or inline
  them. The logo especially: it is on every route twice and must not cost a network request.
- **Rasters go through `next/image` with both dimensions set.** Every entry in §2–§6 has intrinsic
  dimensions recorded; pass them as `width`/`height`, or use `fill` inside a container that has an
  explicit `aspect-ratio`. Never ship a raster without reserved space — this is where CLS comes
  from, and the blog grid with nine cards is the highest-risk surface on the site.
- **Do not pre-generate a size matrix.** The files here are masters at the highest useful
  resolution; `next/image` derives the responsive set and negotiates AVIF/WebP per request. Adding
  hand-made `@2x` variants would duplicate work and drift.
- **`pattern/texture-grain.webp` is the exception** — it is a CSS background (§5.1), referenced from
  `globals.css`, and must not be routed through `next/image`.

### 9.2 Priority and loading, per route

`priority` means the asset is above the fold at 1440×900 and should be preloaded. Everything not
listed is `loading="lazy"`.

| Route | Frame | `priority` | Lazy |
|---|---|---|---|
| `/` | `412:759` | `coin-dollar.svg`, `coin-flag-kenya.svg`, `coin-flag-ghana.svg`, `coin-flag-nigeria.svg` (inline SVG, no preload needed), `qr-whatsapp.png` | phone screen + device frame (card deck & Why Azza, y≈1000+), 3× testimonial portrait, `pattern-lightning-bolt`, all Azza Wrapped assets, `wordmark-azza-outline` |
| `/products/crypto-wallet` | `412:1586` | `qr-whatsapp.png` (y≈742) | `pattern-lightning-bolt` |
| `/products/cross-border-payments` | `412:1829` | `qr-whatsapp.png` (y≈735) | 2× device frame + phone screen, `pattern-lightning-bolt` |
| `/products/for-business` | `412:2412` | `map-ghana-flag.svg`, `map-south-africa-flag.svg`, `map-nigeria-flag.webp`, `location-pin-1/2/3.svg`, `qr-whatsapp.png` | device frame + phone screen (y≈1817), `pattern-lightning-bolt` |
| `/blog` | `281:56` | `blog-banner-trade-crypto-whatsapp.webp` (y≈496) | all 9 grid cards (y≈1255+) |
| `/blog/[slug]` | `282:803` | `blog-card-ghanaian-suppliers.webp` **as the article hero** (y≈552) | 3 related-article cards |
| `/help` | `498:209`, `500:2281` | — (no imagery on this route) | — |

Only one raster is above the fold on any route, and on three routes it is just the 2.3 KB QR code.
That is a genuinely cheap first paint; protect it.

### 9.3 `sizes` values

```
blog grid card          sizes="(max-width:767px) 100vw, (max-width:1023px) 50vw, 360px"
blog featured banner    sizes="(max-width:1279px) 100vw, 1160px"
article hero            sizes="(max-width:1023px) 100vw, 985px"
testimonial portrait    sizes="(max-width:767px) 80vw, 331px"
phone screen            sizes="(max-width:767px) 70vw, 363px"
azzaman character       sizes="(max-width:1023px) 50vw, 642px"
```

### 9.4 Worked example

```tsx
import Image from "next/image";
import banner from "@/assets/blog/blog-banner-trade-crypto-whatsapp.webp";

<div className="relative aspect-[1160/348] overflow-hidden rounded-2xl bg-[#5355E1]">
  <Image
    src={banner}
    alt="Getting started with the Azza AI agent: how to trade crypto on WhatsApp"
    fill
    priority
    sizes="(max-width:1279px) 100vw, 1160px"
    className="object-cover"
  />
</div>
```

The `aspect-[1160/348]` wrapper and the background colour are both load-bearing: the first reserves
layout, the second is the placeholder. The one card that deviates is
`blog-card-naira-to-cedis`, which needs `className="object-cover object-top"` (§6.2).

---

## 10. Boundary with iconography — not exported here

These are glyph-scale, monochrome, or component-instance nodes. They belong to the iconography
agent and were deliberately **not** exported, to avoid shipping the same asset twice.

| Node(s) | Name | Placed | Why excluded |
|---|---|---|---|
| `412:1668`, `412:1872`, `412:1886` | `Flag_of_Nigeria (1)` | 32.94×32 | Icon-scale flag inside a currency picker. The 132×132 hero roundel (`412:846`) is mine; this is not. |
| `412:1071`, `412:1079`, `412:1087` | `play_circle_filled` | 32×32 | UI control glyph. |
| `412:1656`, `412:1657` | `Crypto Currency Icons` | 19.2×19.2, 9.6×9.6 | Component instances, icon scale. |
| `412:2079`, `412:2083`, `412:1624`, `412:1290`, `500:2204`, `500:1749`, `412:1678`, `412:1902`, `352:3696`, `352:3701`, `352:3704`, `519:540`, `518:530`, `521:578` | `down_regular`, `arrow_right_regular`, `search_regular`, `right_regular`, `lightning_regular`, `bill_regular`, social glyphs | 16–24 px | Standard UI icon set. |
| `518:523`, `518:528`, `518:533` | `Group 1410085214` | 32×32 | Circular social-icon chips. |

### 10.1 Ambiguous cases — flagged, judged, exported by neither or by me

| Node(s) | Name | Placed | Call |
|---|---|---|---|
| `412:1195` | `Crypto Currency Icons` (BNB) | **140.129×140.129** | **Left to iconography, but escalated.** It is an instance of the shared icon component, so exporting it here would duplicate. But at 140 px it is functioning as an illustration inside the Azza Wrapped card, and an icon-grade source will look wrong at that size. The icon set must supply it as scalable vector, not a 24 px raster. |
| `412:1576`, `412:1781`, `412:2018`, `412:2655` | `Frame 1618869178` | 40×40 | **Left to iconography.** Appears to be the Azza mark in a circular avatar beside the FAQ answer. If it turns out to be the wordmark rather than an icon, `brand/logo-azza-wordmark.svg` already covers it. |
| `412:845` | Nigeria flag + grain mask group | 132×132 | **Mine, exported both ways.** SVG (`coin-flag-nigeria.svg`) and the textured raster. Pick one in Phase 2. |
| `498:639`, `498:681`, `498:723` etc. | `Ellipse 703` | 135×135 | **Neither.** Solid-fill ellipse in the footer over the "USE AZZA" wordmark — CSS `border-radius: 50%`, not an asset. |
| `570:463/464`, `553:296/297` | `shadow`, `main` | up to 400.787×819.174 | **Mine.** Names imply CSS shapes; they are raster image fills (§3.1). |

---

## 11. Decisions taken

1. **Raw source bitmaps over node renders.** Where a node is a plain image-fill rectangle, the
   asset is Figma's original uploaded bitmap, not the node export. The node exports for
   `553:298` and `553:304` are clipped by their parent frame (364×394 and 364×371 for a
   363×787 node) and would have shipped truncated screenshots. The raw fills are complete.
2. **WebP masters, no size matrix.** `next/image` derives responsive sizes and AVIF at request
   time; pre-generating variants would drift from the master.
3. **Grain texture cropped 1:1, not downscaled** (§5.1). Resampling destroys grain.
4. **Lightning pattern shipped at 1×** (§5.2) because the node renders to 149 bytes behind its mask.
5. **SVGs rebuilt by subtree extraction, then browser-verified.** Figma's whole-node SVG export
   embeds the page canvas plate and frame backgrounds; a first attempt at removing them by
   coordinate heuristics silently destroyed two illustrations, which browser rendering caught. The
   shipped method anchors on each node's own layer id. All 15 SVGs were re-rendered and confirmed.
6. **Assets named by verified content, not by Figma layer name.** `Group 1410085209` is a South
   Africa map; `Group 1261153173` is a Kenya flag coin. Layer names in this file are
   auto-generated and actively misleading.

---

## 12. Reconciliation sweep — the reference graph, not the container

Revision 1 traversed the `672:246` **FOR BUILD** section. This revision enumerated every non-icon
visual node reachable from **the eight build frames and the components they reference**, through the
Plugin API, and reconciled it against what is on disk.

### 12.1 Why the container scoping was structurally wrong

Measured, not inferred. Every `INSTANCE` inside the eight build frames was resolved to its main
component:

| Metric | Result |
|---|---|
| Distinct main components reached from the 8 frames | **4** |
| Of those, living **inside** `672:246` | **0** |
| Of those, living **outside** `672:246` | **4** — `507:684` (deck card, set `507:498`, 1300×700), `395:587` (Binance Coin 32×32, set `395:238`), `303:2597` (Tether), `303:1604` (Polygon) |

A traversal bounded by `672:246` reaches **none** of the component definitions the frames depend on.
The deck's other two variants — `507:496` "Operate Locally" and `507:497` "Move Money", both built
per `components.md` (`DeckCard ×3`) — are only reachable through the component set, and between them
they carry the globe, the five-roundel ribbon and the pins. That is three of this revision's five
findings from one scoping error.

### 12.2 Method, and its two blind spots — stated so the next pass can trust the null

Four passes were run over the eight frames plus `507:498`:

1. **Image-fill census** — every node with an `IMAGE` paint, grouped by `imageHash`. Result: **25
   unique bitmaps across 74 nodes.** This pass is exhaustive for rasters.
2. **Pure vector clusters** — maximal text-free containers, ≥2 vector leaves, ≥56 px. 57 clusters.
3. **Relaxed clusters** — ≥3 graphic leaves, ≥120 px. 24 clusters.
4. **No-floor pass** — ≥1 graphic leaf, ≥150 px, plus standalone graphic leaves. 58 items.

**Passes 2 and 3 both missed `458:396` (the 678×678 globe)** because it is a *two-node* illustration
— one ellipse, one landmass path — and both passes had a leaf-count floor. **All three cluster
passes missed `412:1630` (the banknote)** because the group contains a `₦` TEXT node and every pass
excluded text-bearing containers. Both were caught by rendering each deck variant and each route and
looking at them.

The honest conclusion: **leaf-count and text-free heuristics are not sufficient on their own.** The
combination that produced a complete answer is the exhaustive image-fill census (which cannot miss a
raster) plus pass 4 (no leaf-count floor) plus visual inspection of every component-set variant.

### 12.3 The reconciliation table

**A — referenced and present** (on disk, correct, unchanged). 36 files covering: the wordmark on all
7 routes (`498:604` + 7 siblings, `412:2068` + 7); `qr-whatsapp` ×4 (`412:888`, `511:468`,
`412:1994`, `412:2606`); the device stack ×8 (`553:296/297`, `553:302/303`, `458:280/281`,
`458:388/389`, `458:445/446`, `570:463/464`, `507:762/763`, `I511:364;507:762/763`); the transfer
screen ×7 (`507:764`, `570:465`, `553:298`, `553:304`, `458:390`, `458:447`, `I511:364;507:764`);
the five blog bitmaps ×15 placements; `412:2960`; `412:1069/1077/1085`; the four hero coins
(`412:834`, `412:846`, `412:864`, `412:798`); `507:729`, `507:739`; the three maps (`412:2444`,
`412:2453`, `412:2465`); the three pins (`412:2474`, `412:2488`, `412:2502`); `412:1215`, `412:1218`,
`412:1211`, `412:1203`; and the three pattern fills (`412:883` et al., `412:1558` et al., `412:1163`).

**B — referenced and missing** (the gap this revision closes):

| Node | What | Referenced by | Shipped as | Bytes |
|---|---|---|---|---|
| `412:1234` | 3 coin discs + 3 ghost ellipses + wordmark, 1069.9×615.4 | `/` `UseAzzaToday` `412:1233` | `illustration/cta-coins-composition.svg` | 48,079 |
| `458:333` | 5 flag roundels, 1271.6×920.3 | `CardDeck` card 2, `507:497` via set `507:498` | `illustration/deck-flag-roundel-ribbon.svg` | 25,033 |
| `458:396` | Globe, 678×678 | `CardDeck` card 1, `507:496` via set `507:498` | `illustration/deck-globe.svg` | 58,947 |
| `412:1630` (= `412:1636`) | Naira banknote, 524×417.6 and 559×480 | `/products/crypto-wallet` `412:1586` | `illustration/banknote-naira.svg` | 3,553 |
| `412:1156` | Green chevron plate, 1441×752.8, raster fill `47c14362` | `/` `AzzaWrapped` `412:1155` | `pattern/wrapped-plate-pattern.webp` | 23,798 |

**C — referenced but correctly not an asset** (checked, ruled CSS or icon — no file, by decision):

| Node(s) | What | Ruling |
|---|---|---|
| `412:1157` | Azza Wrapped inner plate | CSS: `#61A807` + 1.026 px `#D3FEB6` inset border. Rendered to confirm it is a plain rectangle (§5.4). |
| `412:1194` | 185.6² dark-green ring behind the BNB badge | CSS circle. Its child `412:1195` is an instance of icon component `395:587` — iconography's, already escalated in §10.1. |
| `412:1226` | 124×52 pair of circular arrow buttons, Azza Wrapped | UI control + icon glyphs, not imagery. |
| `412:1070`, `412:1078`, `412:1086` | 305×163 "Rectangle 492" over each testimonial | `linear-gradient` `#000000`→`#000000` (alpha ramp) — the video scrim. CSS. |
| `570:458`, `570:459` | 567×274 / 567×262 in Why Azza landing | `linear-gradient` `#ffffff`→`#ffffff` — edge fade masks. CSS. |
| `412:1239`, `412:1240`, `412:1241` | CTA ghost ellipses | Solid `#F1F1F1`/`#F2F2F2`. Inside the flat SVG; would be CSS if the composition is ever split. |
| `412:833`, `412:873`, `412:807` | Grain-masked hero coin siblings (dollar, Kenya, Ghana) | Same construct as `412:845`: the shared grain fill clipped to a coin silhouette. Covered by coin SVG + the §5.1 CSS grain overlay — the treatment §4.1 already recommends. No new files. |
| `458:399`, `458:414`, `458:429` | Deck globe pins, 122.5×221 / 53.5×96.5 / 31×56 | The existing pin shape at three scales — see §12.4. |

**D — present and unreferenced** (on disk, nothing points at it): **one file.**

`_reference/azza-wrapped-composite-2x.webp` — declared non-production in §8 and correctly so. Every
other file in `design/assets/` resolves to at least one visible node in the eight build frames or in
`507:498`. There is no dead weight to remove.

### 12.4 One pin does the work of five, and the ruling that removed it rests on a measurement artefact

`components.md` §11 C-2 removed `map-pin` from the icon set on the grounds that *"the three pins are
three different shapes, not one glyph placed three times (measured: 84.6×93.6, 87.7×92.4,
75.3×93.8)"*.

Those are **axis-aligned bounding boxes of rotated nodes**. The underlying geometry:

| Node | Own size | Rotation | Leaves |
|---|---|---|---|
| `412:2474` | 45.6×82.3 | **−35.07°** | `VECTOR 44.2×50.8` · `ELLIPSE 45.6 #F83333` · `ELLIPSE 28.4` ×2 |
| `412:2488` | 45.6×82.3 | **+39.78°** | identical |
| `412:2502` | 45.6×82.3 | **+24.20°** | identical |
| `458:399` | 122.5×221 | 0° | identical, scaled |
| `458:414` | 53.5×96.5 | 0° | identical, scaled |

Same six leaves, same fills, same 0.554 aspect ratio, five times. `location-pin-1/2/3.svg` are three
copies of one shape at three rotations, and the two deck pins are the same shape again.

**No file changed** — that is out of this revision's remit and the three SVGs are imported by built
components. Recorded so the operator can collapse it cheaply: one `location-pin.svg` plus a
`rotate()` and a width, saving 2 files and reversing C-2 on evidence rather than on bounding boxes.

### 12.5 Integrity check

Every one of the 36 pre-existing files was md5-hashed before and after this revision.
**Modified: 0. Deleted: 0.** Five files added. 41 files, 2,623,321 bytes.

---

## 13. `device-frame-phone.webp` — the aperture is correct. Do not re-export.

**The question:** the frame carries an alpha channel but its screen aperture is opaque black, so it
cannot overlay a screenshot the way a device mockup normally does. Is the asset wrong?

**Answer: no. The opaque screen is what the source contains, and it is what the design intends.**
The exported file is faithful and must not be changed.

**Evidence — the original uploaded bitmap, not the export.** `553:297` was pulled back from Figma at
source resolution and measured directly:

| Measurement | Source bitmap (1002×2048, the image Figma holds) | Shipped `device-frame-phone.webp` |
|---|---|---|
| Pixel at screen centre | `(0, 0, 0, 255)` | `(0, 0, 0, 255)` |
| Fully transparent pixels | **2.24%** | **2.24%** |
| Fully opaque pixels | 97.39% | 97.39% |

The 2.24% of transparency is the **rounded corners outside the device silhouette** — that is the
whole reason the alpha channel exists. It was never a screen cut-out. The export reproduces the
source exactly; re-exporting cannot produce a different result, because the hole is not in the file.

**Why the design does not need one.** The mockup is a three-node stack and the screen is a *sibling
painted above* the body, not a layer showing through a hole. `507:761` `Currency 2` in document
order — first child is bottom:

```
507:762  shadow    ← rounded-rect, image fill, 70% opacity
507:763  main      ← rounded-rect, image fill   (the opaque black body)
507:764  image 7   ← rounded-rect, image fill, radius 39.115  (the screen, TOPMOST)
```

Same order in all eight mockup instances. `main` is a **device body slab**, and an opaque screen area
behind an opaque screen image is correct — it also means the mockup never flashes a transparent hole
while the screen image is still loading.

**Consequence for the component fix.** The orchestrator's change — screen paints above body — is
what the source specifies, so it stands, and it is now the *reason* the asset needs no alpha
aperture rather than a workaround for a bad one. `components.md` §4.8's geometry is unaffected.

**The one thing this does constrain:** `PhoneMockup` must never be used as a frame overlaid on
arbitrary content, because there is nothing to see through. Every screen goes in as `image 7` does —
inset, beneath the frame's outer edge, above the body.

---

## 14. Import map for the five new assets

Everything the mirror step needs, so it is mechanical. Project asset root is
`design-system/assets/`; the path alias in use across the built components is `@/assets/…`.

| # | Source node | File (relative to `design/assets/`) | Project path | Import in | Consumer |
|---|---|---|---|---|---|
| 1 | `412:1234` | `illustration/cta-coins-composition.svg` | `design-system/assets/illustration/cta-coins-composition.svg` | `src/components/sections/UseAzzaToday/UseAzzaToday.tsx` | `UseAzzaToday` (`412:1233`, `/`) |
| 2 | `458:333` | `illustration/deck-flag-roundel-ribbon.svg` | `design-system/assets/illustration/deck-flag-roundel-ribbon.svg` | `src/components/sections/CardDeck/DeckCard.tsx` | `DeckCard` card 2 "Move Money" (`507:497`) |
| 3 | `458:396` | `illustration/deck-globe.svg` | `design-system/assets/illustration/deck-globe.svg` | `src/components/sections/CardDeck/DeckCard.tsx` | `DeckCard` card 1 "Operate Locally" (`507:496`) |
| 4 | `412:1630` | `illustration/banknote-naira.svg` | `design-system/assets/illustration/banknote-naira.svg` | `src/components/sections/HeroCryptoWallet/…` | `HeroCryptoWallet` (`412:1587`), **two instances** |
| 5 | `412:1156` | `pattern/wrapped-plate-pattern.webp` | `design-system/assets/pattern/wrapped-plate-pattern.webp` | `src/app/globals.css` **or** the `AzzaWrapped` section | `AzzaWrapped` (`412:1154`) band background |

**Rules that apply, from §9.1 — restated so nothing is looked up twice:**

- **1–4 are SVG, so they never go through `Media` / `next/image`.** Inline them, or import as React
  components. They are decorative: `alt=""` is not applicable — give the wrapper
  `aria-hidden="true"` and, for an inlined `<svg>`, `role="presentation"`. All four files already
  carry `role="presentation" aria-hidden="true"` on the root element.
- **5 is a CSS `background-image`,** like `texture-grain.webp` (§5.1). Not `Media`, not
  `next/image`, referenced once from CSS.
- **None of the five gets a placeholder colour.** 1–4 are vector; 5 is a full-bleed opaque plate that
  is itself the background. A placeholder behind any of them would show.
- **All five are `loading="lazy"` / below the fold on every route they appear on.** None is above the
  fold at 1440×900: the CTA art sits at y≈5960 on `/`, the Azza Wrapped plate at y≈4100, the deck at
  y≈1000+, and the banknote at y≈900+ on `/products/crypto-wallet`. §9.2's `priority` table is
  unchanged — it still lists exactly one raster above the fold per route.

**Slot geometry — reserve these ratios so nothing shifts:**

| Asset | `aspect-ratio` | Fit |
|---|---|---|
| `cta-coins-composition` | `1070 / 616` | contain — scales as a unit, §4.3 |
| `deck-flag-roundel-ribbon` | `1271.64 / 920.31` | positioned at `(-25.97, -169)` inside a card that clips; do **not** scale to fit the card |
| `deck-globe` | `1 / 1` | positioned at `(416, 462)` inside the 1200×625 card; card clips, 163 px visible at rest |
| `banknote-naira` | `524 / 418` | contain, two instances at 524×417.6 and 559×480 |
| `wrapped-plate-pattern` | `1441 / 752.8` | `background-size: cover` |
