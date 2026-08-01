# Imagery & Asset Contract — AZZA Website

- **Run:** `2026-08-01-azza-website`
- **Figma file:** `OXDVihY7WvtPZ6uGuVFx5Y` — section `672:246` "FOR BUILD", plus component set `507:498`
- **Asset root:** `runs/2026-08-01-azza-website/design/assets/`
- **Totals:** 36 files, **2,463,911 bytes (2.35 MB)** on disk
- **Design width:** 1440. All placed sizes below are at that width.

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

---

## 5. Manifest — patterns and textures

| File | Source node | Intrinsic | Placed | Scale | Format | Role |
|---|---|---|---|---|---|---|
| `pattern/texture-grain.webp` | `412:883` fill (= `412:844`, `412:832`, `412:859`, `412:1220`) | 1700×1134 (1:1 crop of 5000×2500) | 842×562.064 max | 2.02× | WebP | decorative |
| `pattern/pattern-lightning-bolt.webp` | `412:1558` fill (= `412:1213`, `412:1763`, `412:2000`, `412:2637`) | 1374×1374 (src 3240²) | 1374×1374 | 1.00× | WebP α | decorative |
| `pattern/pattern-guilloche-green.webp` | `412:1163` fill (= `412:1216`) | 626×417 | 1604.103×1068.548 | **0.39×** | WebP | decorative |

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
