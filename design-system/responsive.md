# responsive.md — AZZA Website

**Owner:** `responsive-expert` (Phase 1, wave 1A)
**Authority:** this document is the sole authority for all sub-1440 and super-1440 behaviour.
**Source design:** `OXDVihY7WvtPZ6uGuVFx5Y`, section `672:246` "FOR BUILD".
**Stack target:** Next.js 15 App Router / TypeScript strict / **Tailwind CSS v4.3.3**.

---

## 0. How to read this document

Every rule carries a provenance tag. There are exactly two.

| Tag | Meaning |
|---|---|
| **`[D]`** | **Derived from design.** Traceable to a measured node in the Figma file. The node id and the measurement are given. A Phase 3 auditor may treat a `[D]` rule as a fidelity requirement. |
| **`[I]`** | **Inferred.** My judgement. Nothing in the Figma file states or implies it. A Phase 3 auditor must **not** treat a deviation from an `[I]` rule as a design-fidelity failure — it is a spec-conformance question only, and the operator may overrule any of it without the design having changed. |

**The honest headline: the design is 1440-only.** All eight frames are 1440 wide. There are no mobile frames, no tablet frames, no responsive annotations, no auto-layout constraints that imply reflow, and no prototype breakpoints. Every `[D]` tag in this document therefore describes **a measurement taken at 1440**, and every statement about *what happens at any other width* is `[I]`.

That is not a hedge. Below, every section has a specified behaviour at every breakpoint. "The design does not say" appears nowhere as a conclusion. §14 enumerates, bluntly and at length, exactly what I invented.

---

## 1. Breakpoints

### 1.1 The set

`PLAN.md` §9.5 proposed 320 / 768 / 1024 / 1440 / 1920. I am revising it. The revision and its justification are `[I]`.

| Name | Value | rem | Role |
|---|---|---|---|
| *(base)* | **320px** | — | **Minimum supported viewport. Not a media query.** All unprefixed styles target 320–479. |
| `xs` | **480px** | 30rem | Large phone. First point at which a 2-up is legible. |
| `sm` | **640px** | 40rem | Large phone landscape / small tablet portrait. *(Tailwind v4 stock value, unchanged.)* |
| `md` | **768px** | 48rem | Tablet portrait. *(Tailwind v4 stock value, unchanged.)* |
| `lg` | **1024px** | 64rem | **The desktop line.** Nav switches, two-column splits restore, card deck fan returns. *(stock)* |
| `xl` | **1280px** | 80rem | Full desktop composition. Decorative art restored. *(stock)* |
| `2xl` | **1440px** | 90rem | **The design width.** Wide surfaces pin here. *(Changed from Tailwind's stock 96rem/1536.)* |

### 1.2 What changed from the plan, and why

**Added `xs` at 480.** `[I]` Without it, everything from 430px (iPhone 17 Pro Max) to 768px renders single-column. On `/blog` that is nine article cards (`500:2213`) at ~480px each — a 4,300px scroll on a device where a 2-up fits comfortably. 480 is the narrowest width at which two 360-wide design cards can sit side by side at a legible 216px each with a 24px gutter. This is the addition I would defend hardest.

**Added `xl` at 1280.** `[I]` The design contains three compositions materially wider than the 1200 content column: the card deck stage at 1300 (`511:364` `[D]`), the Business hero at 1280 (`412:2437` `[D]`), and the Help two-pane at 1240 (`500:1738` + `500:1765` `[D]`). Without a 1280 stop, the jump from "tablet landscape" (1024) to "design width" (1440) is a single 416px leap, and every viewport in between renders as a squeezed desktop. 1280 is where the widest honest desktop composition first fits.

**Reclassified 1440.** `[I]` It is not a reflow breakpoint — *nothing stacks, unstacks, or changes column count at 1440*. It is the pin point. It is named `2xl` and used only by the three surfaces that are wider than the 1200 container (§3.3).

**Dropped 1920 as a breakpoint, kept it as a mandatory test width.** `[I]` Nothing changes at 1920 under the container model in §3. A breakpoint that fires no rules is dead weight in `@theme` and a false signal to implementers that something should differ there. **1920 remains a required Phase 3 capture width** — it is precisely where the "pin, don't scale" decision is verified, and a regression there would be invisible at every other width. Phase 3 should also capture **2560**.

### 1.3 Tailwind v4 declaration — verified syntax

Verified against the installed package (`tailwindcss@4.3.3`, `theme.css` lines 327–345), **not** from recall. Tailwind v4 declares breakpoints as `--breakpoint-*` custom properties inside `@theme`, in `rem`, and sorts the generated variants numerically — so a new name inserted into the namespace lands in the correct order automatically.

Stock v4.3.3 values confirmed present: `sm 40rem`, `md 48rem`, `lg 64rem`, `xl 80rem`, `2xl 96rem`.

```css
/* src/app/globals.css — owned by scaffolder, changed only by a Phase 4 refiner */
@import "tailwindcss";

@theme {
  /* Two deltas from stock v4: xs is new, 2xl moves 96rem -> 90rem.
     sm/md/lg/xl keep their stock values deliberately, so that an
     implementer's Tailwind muscle memory is correct for four of six. */
  --breakpoint-xs: 30rem;   /*  480px — new  */
  --breakpoint-2xl: 90rem;  /* 1440px — was 96rem/1536px in stock v4 */
}
```

> **⚠ Implementer warning, and it will bite someone.** `2xl:` in this project means **1440**, not Tailwind's stock 1536. If you reach for `2xl:` expecting 1536, you are wrong. There are only three legitimate uses of `2xl:` in this codebase and they are listed in §3.3. If you are writing `2xl:` anywhere else, you almost certainly want `xl:`.

**Do not** clear the namespace with `--breakpoint-*: initial`. We are keeping four stock values; clearing and redeclaring all six invites a typo that silently shifts a stop.

Breakpoints are in `rem` by v4 design. They therefore respond to the user's root font size — a user at 200% browser text gets the mobile layout on a desktop monitor. **That is correct and intended; do not "fix" it with `px` breakpoints.** It is a WCAG 1.4.4 benefit.

**Variant vocabulary available** (v4 core, no plugin):
- `md:` — min-width, mobile-first. **Default to this.**
- `max-lg:` — max-width. Use only where mobile-first would need more overrides than max-width (the nav panel is the main legitimate case).
- `md:max-xl:` — range.
- `@container`, `@md:`, `@max-md:`, `@min-[36rem]:` — container queries, **core in v4**, verified present in `dist/lib.js` (`@container`, `container-type: inline-size`). The `@tailwindcss/container-queries` plugin from v3 **must not** be installed; it is obsolete and will conflict.

---

## 2. Frame coverage matrix

Blunt, and the uniformity is the point.

| Frame | Node | 320 | 480 | 768 | 1024 | 1280 | **1440** | 1920 |
|---|---|---|---|---|---|---|---|---|
| Main Landing Page | `412:759` | derived | derived | derived | derived | derived | **designed** | derived |
| Products — Crypto Wallet | `412:1586` | derived | derived | derived | derived | derived | **designed** | derived |
| Products — Cross Border | `412:1829` | derived | derived | derived | derived | derived | **designed** | derived |
| Products — For Business | `412:2412` | derived | derived | derived | derived | derived | **designed** | derived |
| Blog | `281:56` | derived | derived | derived | derived | derived | **designed** | derived |
| Blog — Article Opened | `282:803` | derived | derived | derived | derived | derived | **designed** | derived |
| Help & Support | `498:209` | derived | derived | derived | derived | derived | **designed** | derived |
| Help & Support — Opened | `500:2281` | derived | derived | derived | derived | derived | **designed** | derived |

**Coverage: 8 of 56 cells designed (14.3%). 48 of 56 derived (85.7%).**

Consequence for Phase 3: `visual-qa` has a Figma export to diff against **only at 1440**. At every other width there is no ground truth and no meaningful pixel comparison is possible. At 320/480/768/1024/1280/1920 the correct audit is against *this document's stated rules* plus the objective checks in `PLAN.md` gate 8 (no horizontal overflow, no overlap, no clipping, no illegible type). Any auditor treating a non-1440 capture as a design-fidelity comparison is measuring against nothing.

---

## 3. The container model

### 3.1 Observed container widths at 1440 `[D]`

There is no single container in this design. Measured:

| Section | Node | x | width | implied gutters |
|---|---|---|---|---|
| Business hero inner | `412:2437` | 80 | 1280 | 80 / 80 |
| Help two-pane | `500:1738`→`500:1765` | 80 | 1240 | 80 / 120 |
| Card deck stage | `511:364` | 70 | 1300 | 70 / 70 |
| Why Azza (cross-border) | `553:288` | 120 | 1200 | 120 / 120 |
| Why Azza (landing) | `570:435`→`570:461` | 120 | 1200 | 120 / 120 |
| Cross-border hero | `412:1855`→`412:1861` | 120 | 1200 | 120 / 120 |
| Blog grid | `500:2198` | 140 | 1160 | 140 / 140 |
| Crypto-wallet hero | `412:1615`→`412:1626` | 150 | 1140 | 150 / 150 |
| Footer content | `498:600` | 219 | 1002 | 219 / 219 |
| FAQ card | `412:1556` | 226.5 | 987 | 226.5 / 226.5 |
| Article column | `352:3682` | 227.5 | 985 | 227.5 / 227.5 |
| Testimonial row | `412:1067` | 242 | 955 | 242 / 242 |
| Landing hero content | `412:1370` | 281 | 878 | 281 / 281 |
| Article body measure | `352:3684` | 299 | 842 | 299 / 299 |
| Top Nav island | `412:2067`→`412:2087` | 293.8 | 852.4 | 293.8 / 293.8 |
| CTA text block | `412:1284` | 403 | 635 | 403 / 403 |

**1200 recurs three times and is the modal value.** `[D]`

### 3.2 The rule `[I]`

One page container. Everything narrower than 1200 is a **measure constraint inside** that container, not a different container.

```
content-width = min(1200px, 100% - 2 × gutter)
```

| Stop | Gutter | Resulting content width |
|---|---|---|
| base (320–479) | 20px | 280 → 440 |
| `xs` (480–639) | 24px | 432 → 592 |
| `sm` (640–767) | 32px | 576 → 704 |
| `md` (768–1023) | 40px | 688 → 944 |
| `lg` (1024–1279) | 48px | 928 → 1184 |
| `xl` (1280+) | 80px | 1120 → **1200 at 1360, pinned from there** |

The gutter steps are chosen so the container reaches 1200 at **1360**, not at 1440 — which removes any jump at the 1440 boundary. At 1440 the arithmetic lands on the design's own 120px gutters (1440 − 1200 = 240 = 2 × 120), so the modal `[D]` measurement is reproduced exactly without being hard-coded. `[I]`

**Gutters are stepped, not fluid.** `[I]` A fluid gutter buys nothing visually and makes every horizontal measurement in a Phase 3 capture a function of viewport width, which is unauditable. See §6.

Narrower design measures become **inner max-widths**, not containers:

| Role | Max-width | Evidence |
|---|---|---|
| `--measure-prose` | 842px | `352:3684` `[D]` |
| `--measure-narrow` | 661px | `570:435`, `553:290` `[D]` |
| `--measure-centered` | 635px | `412:1284` `[D]` |

> **Conflict protocol with `layout.md`.** `layout-spacing-expert` is working blind in this same wave and owns the spacing scale and container tokens. If `design/layout.md` states a different content width or gutter scale at 1440, **its 1440 values win** — take them and apply *this* section's scaling curve (the `min(W, 100% − 2×gutter)` form and the stepped-gutter shape) to them. I own how it changes across widths; layout.md owns what it is at 1440. Logged in `open_questions`.

### 3.3 Above 1440 — pin, do not scale `[I]`

**Decision: the container pins at 1200 (reached at 1360) and gutters grow. Nothing scales fluidly above 1440. Applied without exception.**

Four reasons, in order of weight:

1. **The design is absolutely composed.** `Azza Wrapped` (`412:1155`) is a 1440×752 canvas with eight hand-placed groups at fractional coordinates and four corner ellipses at negative offsets (`412:1164` at x = −45.13). `use Azza Today` (`412:1234`) is a 1069×615 cluster of overlapping ellipses forming a wordmark. Fluid scaling means scaling that art — raster assets soften, and vector alignment drifts because the coordinates are not on any grid.
2. **The type is already at its ceiling.** Display headlines measure 135px (`412:788`, `412:1066`, `412:1286`) `[D]`. Fluid to 1920 gives 180px. There is no reading benefit and considerable ugliness.
3. **Auditability.** `PLAN.md` gate 7 requires a 2% pixel match at 1440. Under a fluid model, 1440 is an arbitrary point on a continuum and every other capture is un-diffable against anything. Under a pinned model, ≥1440 is *one* invariant layout — one rule to verify, at any width.
4. **Line length.** The article body is 842px at 1440 (`352:3684`) `[D]`. Fluid to 1920 gives 1123px — roughly 140 characters. That is well past the readable maximum and would be a regression caused by a larger screen.

**What this means concretely at ≥1440:**
- Content column: `1200px`, centred. Gutters grow symmetrically and are empty.
- Page background colour: full-bleed, edge to edge, at any width.
- Section background *bands* (FAQ card `412:1556`, footer band `498:637`, `use Azza Today` `412:1233`): background full-bleed; inner content pinned at 1200.
- The three surfaces wider than 1200 pin at their own design widths and centre. **These are the only legitimate uses of `2xl:`:**
  - Card deck stage — `min(1300px, 100% − 140px)` `[D]` from `511:364` at x = 70.
  - `Azza Wrapped` band `412:1155` — `min(1440px, 100%)`. **Does not stretch past 1440**; its internal composition is absolute and would tear.
  - Top Nav island — `min(852px, 100% − 2 × gutter)` `[D]` from `412:2067`…`412:2087`.
- Test at **1920 and 2560**. Expected: identical to 1440 apart from gutter width.

### 3.4 Below 320 `[I]`

320 is the supported floor. At 280–319 (Galaxy Fold folded, and legacy) the layout must **degrade, not break**:
- No element may set a `min-width` that forces page-level horizontal scroll. The single permitted overflow scrollers are named in §5 (deck carousel, blog filter chips, article code/table blocks).
- Every flex and grid child carries `min-width: 0` (or `min-w-0`). This is the single most common cause of unexpected overflow and it must be a default habit, not a fix applied after a bug report.
- Long unbroken tokens — `hq@azza.com` (`498:632`), `07041900011` (`498:631`), `1 USDC ~ NGN 1,387` (`412:1878`), any wallet address — carry `overflow-wrap: anywhere`.
- Below 280 no guarantee is made.

---

## 4. Fluid vs. stepped — the policy

### 4.1 The rule `[I]`

> **`clamp()` is used for exactly one thing: display type with a design value ≥ 32px at 1440. Everything else steps at a breakpoint.**

Not gutters. Not section padding. Not component padding. Not body copy. Not radii. Not icon sizes. Not gaps.

**Why so narrow.** Fluid values make every measurement in a rendered capture a function of viewport width, so an auditor cannot compare anything to a fixed number without recomputing the curve. That cost is worth paying in exactly one place: large display type, where a stepped 135px → 40px transition produces a violent, visible jump mid-scroll on a resizing window, and where the intermediate values genuinely need to be continuous. Everywhere else, stepping is both invisible to the user and trivially auditable. This is a deliberate departure from the common practice of fluid-scaling the whole spacing scale.

### 4.2 The formula, so nineteen implementers produce identical numbers `[I]`

For a role with design value `S` (px, at 1440) and chosen floor `F` (px, at 320):

```
slopeVW   = (S − F) / (1440 − 320) × 100
interceptPX = F − (S − F) / (1440 − 320) × 320
font-size: clamp(F/16 rem, interceptPX/16 rem + slopeVW vw, S/16 rem)
```

Worked example — the 135px display headline (`412:788`, `412:1066`, `412:1286` `[D]`), floor chosen at 40px `[I]`:

```
slopeVW     = (135 − 40)/1120 × 100 = 8.4821vw
interceptPX = 40 − 0.0848214 × 320  = 12.857px = 0.8036rem
```
```css
--text-display-1: clamp(2.5rem, 0.8036rem + 8.4821vw, 8.4375rem);
```
Check: at 320px → 27.14 + 12.86 = **40.0px** ✓ · at 1440px → 122.14 + 12.86 = **135.0px** ✓

**Two properties this construction guarantees, and both are load-bearing:**

1. **The max term is the exact Figma value.** At ≥1440 the clamp resolves to precisely the design value, so the 1440 capture is pixel-exact and gate 7 is achievable. Never write a clamp whose upper bound is not the measured design value.
2. **The preferred term contains a `rem` component.** A pure-`vw` preferred value fails WCAG 1.4.4 (text must scale to 200%) because it ignores root font size entirely. The `interceptPX/16 rem` term is what makes it pass. If your intercept computes negative, raise the floor `F` until it does not, rather than shipping a negative rem term.

> **Conflict protocol with `typography.md`.** `typography-expert` owns the scale *values*. I own the fluid *method*. Where the two disagree on a number, typography.md's 1440 value wins and becomes the `S` term in the formula above. Every role that typography.md sets at ≥32px gets a clamp built with this formula; every role below 32px steps. Logged in `open_questions`.

### 4.3 The stepped values `[I]`

| Property | base | `xs` | `sm` | `md` | `lg` | `xl` |
|---|---|---|---|---|---|---|
| Gutter | 20 | 24 | 32 | 40 | 48 | 80 |
| Section block padding (y) | 56 | 64 | 72 | 80 | 96 | design value |
| Card padding | 20 | 20 | 24 | 24 | 28 | design value |
| Grid gap (cards) | 20 | 24 | 28 | 32 | 40 | 40 `[D]` (`500:2214`: 400 − 360) |
| Body copy | 16 | 16 | 17 | 17 | 18 | design value |
| Radius | constant at the design value `[D]` — never scales |

Display roles below 32px at 1440 (eyebrows `412:1618` 14px, labels `412:1171` 21px, UI text `412:2078` 19px) **do not clamp**. They step, or stay constant.

---

## 5. Container queries — three, and only three

> **Was "four, and only four". Container #4 (Why-Azza feature column) was withdrawn by the orchestrator on
> 2026-08-01 as unimplementable — see the correction in the table below. Containers 1–3 are unaffected.**

Container queries are core in Tailwind v4.3.3 (verified). They are not free: a `container-type: inline-size` element cannot be sized by its own content in the inline axis, and a nested container silently shadows an outer one. They are used here **only where the viewport is genuinely the wrong signal** — meaning the same component renders at materially different widths at the *same* viewport width.

| # | Component | Node(s) | Why the viewport is the wrong signal |
|---|---|---|---|
| **1** | **Card deck card** | `507:684` internals | The card is inside a `transform`ed, absolutely-positioned stack. A transform changes rendered size while the viewport says nothing changed — a viewport query would be **actively wrong**, not merely coarse. Strongest case in the project. |
| **2** | **Article card** | `500:2215`, `352:3744` | The identical card renders at 360 in the `/blog` 3-up (`500:2213`), at 360 in the `/blog/[slug]` related 3-up (`352:3743`), and at full width when stacked. The two routes reach a 3-up at *different* viewport widths (`/blog` has a wider grid container than the article page's 985 column `[D]`), so one viewport rule cannot serve both. |
| **3** | **Help resource card** | `500:1771`, `500:1777`, `500:1784`, `500:1790` | 420 wide in the 2-up (`500:1770`) `[D]`, but sits inside the 868 content column which itself competes with a 300 sidebar (`500:1738`). Whether the 40px icon (`500:1773`) sits above or inline with the title follows the card's width, not the page's. |
| **4** | ~~**Why-Azza feature column**~~ **WITHDRAWN** | `553:292`, `553:299` | ~~508 wide in the 2-up `[D]`, full-width when stacked…~~ **See the correction directly below. This one is unimplementable; there are three container queries, not four.** |

> **CORRECTION — container #4 is withdrawn by the orchestrator, 2026-08-01.**
>
> Reported by `impl-why-azza-crossborder` while building `553:287`, then verified by the orchestrator. A
> container query on the feature column **cannot** distinguish the stacked state from the two-up state,
> because the two width ranges **overlap**:
>
> | State | Narrowest | Widest |
> |---|---|---|
> | Two-up column | **372** — at `lg`, `(784 − 40) / 2` | **508** — at 1440 `[D]` |
> | Stacked column | ~240 — at `base`, 280 container − 40 card padding | **608** — at `md`, 688 container − 80 |
>
> The stacked range (~240–608) **contains** the two-up range (372–508). No width threshold separates them, so
> any container query that correctly reorders the stacked layout also fires on the desktop two-up and destroys
> the designed alternation — precisely the outcome §7.3.2's reorder rule exists to prevent.
>
> The reporting agent framed this as "the stacked column is *wider* than the two-up column". That is true at
> the `md`/`lg` crossover it measured, but it is not the whole reason and a later reader could refute it with a
> narrow viewport. The correct statement is the overlap above. Moving the container up to the row does not help
> either: at a 1023px viewport the row is 863px — over any plausible threshold — while `lg:grid-cols-2` has not
> yet fired.
>
> **Ruling:** implement §7.3.2's **outcome** (at `< lg`, normalise both columns to label-then-phone) by any
> mechanism that works. `lg:flex-col-reverse` on the second column is the accepted implementation and is what
> ships in `WhyAzzaCrossBorder`. The "never with `order:` at page level" prohibition is retained — it exists to
> stop DOM order and visual order diverging for keyboard and screen-reader users, and a per-column flex
> reversal does not have that effect at the page level.
>
> **§7.3.2's reorder rule is unchanged.** Only its prescribed mechanism is.

**Declaration pattern (v4):**

```tsx
{/* the container — v4's `@container` utility sets container-type: inline-size */}
<article className="@container/card ...">
  <img className="aspect-[9/7] @md/card:aspect-[16/9]" />
  <h3 className="text-base @sm/card:text-lg @md/card:text-xl">…</h3>
</article>
```

Always **name** the container (`@container/card`). Anonymous containers are shadowed by any nested container and the failure is silent.

> **v4 gotcha, state it once so nobody rediscovers it.** Container-query variant sizes (`@sm`, `@md`, …) read from the `--container-*` theme namespace — the *same* namespace that generates `max-w-*` utilities. Adding `--container-card: 30rem` for a query also creates a `max-w-card` utility. Verified in `theme.css` lines 333–345 (`--container-3xs: 16rem` … `--container-7xl: 80rem`). Prefer the stock sizes or arbitrary values (`@min-[26rem]/card:`) over adding names to that namespace.

**Explicitly NOT container queries** — the viewport is the correct signal and using `@container` here would be cargo-culting: Top Nav (page chrome; the decision is about the *device*, not the element), Footer (one context only), QR badge (one context, and the rule is modality-based), all hero layouts, all section padding, the FAQ two-pane (one context per route, uniformly 987 wide `[D]` in all four instances).

---

## 6. Touch, pointer, and hover

### 6.1 Minimum target size `[I]`

**Floor: 44 × 44 CSS px for every interactive element, at every breakpoint.**

WCAG 2.2 SC 2.5.8 (AA) requires 24 × 24. We adopt 44 (SC 2.5.5, AAA / platform HIG) as the project floor because this is a WhatsApp-first consumer product whose primary device is a phone. One exemption, and it is the standard one: **inline links inside a run of prose** (article body `352:3713`–`352:3717`) are exempt per SC 2.5.8's inline exception.

**Enlarge the hit area, never the glyph.** Where the design's visual is smaller than 44, the target grows by pseudo-element or padding while the icon keeps its `[D]` size:

```css
.hit-44 { position: relative; }
.hit-44::after {
  content: ""; position: absolute; inset: 50%;
  width: 44px; height: 44px; transform: translate(-50%, -50%);
}
```

**Minimum 8px clear space between adjacent targets.** `[I]`

### 6.2 Every element in the design that fails the floor `[D]` measurements, `[I]` remedies

| Element | Node | Designed size | Remedy |
|---|---|---|---|
| Nav dropdown chevrons | `412:2079`, `412:2083` | 18 × 18 | Target is the whole trigger row, ≥44 tall |
| Nav CTA pill | `412:2087` | 144 × **43** | Height → 44 min, 48 at `< lg` |
| Socials dropdown rows | `63:353`, `63:356`, `63:361` | 200 × **24** | Row → 48 tall; icon stays 24 |
| Products dropdown rows | `94:851`, `94:856`, `94:861` | 317 × **44** | Passes. Keep. |
| Help sidebar links | `500:1748`, `500:1752`, `500:1756`, `500:1758` | 300 × **22** | Row → 44; pitch 42 → 48 at `< lg` |
| Help sidebar chevrons | `500:1749`, `500:1753` | 20 × 20 | Part of the 44 row |
| Blog category filters | `500:2208`–`500:2212` | ~23–106 × **26** | Chips → 44 tall, 16px h-padding |
| Article share icons | `352:3695`, `352:3696`, `352:3701`, `352:3703` | 24 × 24 @ **36px pitch** | 44 targets @ **52px pitch** at `< lg` (4 × 52 = 208, fits at 320) |
| Footer links | `498:616`–`498:632` etc. | ~113 × **22** @ 46 pitch | 44-tall target inside the existing 46 pitch — **zero visual change** |
| Azza Wrapped arrows | `412:1227`, `412:1230` | 56 × **52** | Height → 56 |
| Testimonial play button | `412:1071`, `412:1079`, `412:1087` | 32 × 32 | 44 target, glyph stays 32 |
| Help card chevrons | `500:1773`, `500:1779`, `500:1786`, `500:1792` | 40 × 40 | Whole card is the target (§6.4) |
| FAQ question rows | `412:1562`–`412:1570` | 368 × **61** | Passes. Keep. |
| Crypto-wallet currency selects | `412:1652`, `412:1664` | 124 × **42/44** | Height → 44 |
| Exchange widget selects | `412:1869`, `412:1883` | 94 × **24** | Height → 44 |

### 6.3 The hover rule `[I]`

> **No interactive state may be communicated by hover alone.** Every hover style is paired with a `:focus-visible` twin, and any hover style that conveys *state* (selected / current / expanded) also has a persistent, pointer-independent indicator.

All hover-only styling is guarded:

```css
@media (hover: hover) and (pointer: fine) { /* hover styles only here */ }
```

Unguarded `:hover` sticks on touch after a tap and is a real, reproducible bug on iOS Safari — not a theoretical one.

### 6.4 Hover-dependent affordances and their non-hover equivalents

| # | Affordance | Node | Non-hover equivalent `[I]` |
|---|---|---|---|
| 1 | Nav dropdown open | `412:2077`, `412:2081` | Trigger is a `<button>` (never `<a>`). Opens on click, `Enter`, `Space`, `ArrowDown`. On desktop, hover-open additionally, with a **150ms close delay** so a diagonal mouse path to the panel does not dismiss it. At `< lg` the mechanism is replaced entirely (§8). |
| 2 | FAQ question selection | `412:1562`–`412:1570` | Selection is click/`Enter`/`Space` only. Hover may add a subtle background but **must not** change the answer pane. Selected state carries `aria-expanded="true"` + persistent fill. |
| 3 | Article card | `500:2215`, `352:3744` | Title is the `<a>`; the card is a stretched-link target (`::after { inset: 0 }`). Hover effect (lift/zoom) mirrored on `:focus-visible` **on the card**, via `:has(a:focus-visible)`. |
| 4 | Testimonial play | `412:1071` etc. | A real `<button>`, **visible at rest** — never hover-revealed. `aria-label="Play testimonial from Snow Olohijere"`. |
| 5 | Help resource card | `500:1771` etc. | Same stretched-link pattern as #3. |
| 6 | Card deck promotion | `511:364` | Desktop: scroll position + click/`Enter` on a peeking card. `< lg`: native scroll-snap (§7.1). No hover dependency at any width. |
| 7 | Azza Wrapped arrows | `412:1227`, `412:1230` | Already always-visible buttons. Add `aria-label`, `:disabled` at the ends. |
| 8 | Blog filters | `500:2208`–`500:2212` | Selected chip carries `aria-current="true"` + filled background — never underline-on-hover alone. |
| 9 | Footer / nav links | `498:616` etc., `412:2085` | `:focus-visible` twin for every hover style. Current route carries `aria-current="page"`. |
| 10 | Share icons | `352:3694`, `352:3728` | Always-visible buttons with `aria-label`; the "copy link" (`352:3704`) announces success via a live region, not a hover tooltip. |

**Global focus ring** `[I]`: `:focus-visible` gets a 2px outline at 2px offset in a token that clears 3:1 against every background it can land on. Never `outline: none` without a replacement. The nav CTA pill and the FAQ card sit on coloured fills — check both.

---

## 7. Per-section reflow

Format for each section: `[D]` evidence (measured at 1440), then the specified behaviour per stop. Every rule below the 1440 row is `[I]` unless it repeats a measurement.

### 7.0 The two hard cases

#### 7.0.1 The card deck — `412:2196` / `511:364` / `507:498`

**`[D]` — what the design actually contains.** Component set `507:498` has three variants: `507:496` "Operate Locally" (1200 × 700), `507:497` "Move Money" (1200 × 700), `507:684` "Variant4" (1300 × 700). Only `507:684` is placed, as instance `511:364` at x = 70 inside frame `412:2196` (1440 × 900). D-007 normalises all three to 1300 × 700.

Inside `507:684`, the resting fan geometry is:

| Layer | Node | x | y | w | h | z |
|---|---|---|---|---|---|---|
| back | `507:724` | 0 | 104.5 | 539 | 482 | lowest |
| middle | `507:725` | 50 | 64.5 | 539 | 569 | mid |
| **front** | `507:726` | 100 | −0.5 | 1200 | 700 | top |

Front card interior: text block `507:758` at x = 48, w = 553 (headline `507:759` + subcopy `507:760`); phone mockup `507:761` at x = 917, w = 342, full-bleed height; decorative coin art `507:729` (USDC) and `507:739` (USDT).

**Therefore the resting fan is a LEFT-EDGE fan with vertical inset**, not a downward stack:
- middle = front `translateX(−50px)`, inset 64.5 top / 66 bottom → visible as a 50px sliver on the left
- back = front `translateX(−100px)`, inset 104.5 top / 113.5 bottom → visible as a 100px sliver on the left

As ratios of the 1300 stage: **−3.85% / −7.69% on X; 9.2% / 14.9% vertical inset.** These ratios are the scaling mechanism below 1440 — they come out of the design, not out of me.

> **🚩 FINDING for the operator — the fan axis contradicts the reference.** `DECISIONS.md` D-006 assigns *behaviour* to owo.app, whose observed mechanic is **downward Y translation** with descending z-index. Azza's Figma resting state is an **X-left fan**. Applying owo's Y-axis motion produces a resting state the designer did not draw. **My call:** take from owo the *mechanic* (absolute stack, descending z-index, scroll-driven index advance, active card promoted to `size-full`, headline word-cycling) and apply it along **Azza's X-left axis**, so the resting state matches Figma exactly. This preserves D-006's intent (owo owns behaviour) while not overwriting a `[D]` measurement with a third-party one. Reversible in `src/components/sections/CardDeck/` alone. Flagged in `findings` for personal review.

**Behaviour by stop:**

**`xl` and `2xl` (≥ 1280)** — the designed fan. `[D]` geometry, `[I]` motion.
- Stage: `min(1300px, 100% − 140px)`, `aspect-ratio: 13 / 7`, `position: relative`. Cards `position: absolute; inset: 0`.
- Transforms use the **ratios above**, not the pixels, so the fan is correct at every width in the range.
- Advance: section is `position: sticky; top: var(--nav-h); height: 100dvh` inside a scroll track of `~280vh` (3 beats × ~90vh). Each beat promotes the next card: outgoing card animates to the back of the fan, incoming to front.
- **`position: sticky`, not JS scroll-jacking.** owo uses JS transforms; sticky + a scroll-linked index is the same effect with none of the scroll-hijacking pathology, and it degrades to a plain long section if JS fails.
- Peeking cards are `<button>`s: click / `Enter` promotes directly. Card content in DOM order 1, 2, 3 always.

**`lg` (1024–1279)** — same fan, ratio-scaled.
- Stage becomes `width: 100%; aspect-ratio: 13 / 7` (at 1024 → 928 × 500). All offsets already ratios, so nothing else changes.
- Card interior stays side-by-side (text | phone) — driven by container query #1 at `@min-[52rem]/deck`.

**`md` and below (< 1024)** — **the fan is abandoned. It becomes a horizontal snap carousel.**

Four reasons the fan cannot survive:
1. At a 13:7 aspect and 768px width the card is 413px tall, and the headline block alone is 383px tall at design scale (`507:759`) `[D]`. It does not fit.
2. The fan's affordance is a 3.85% sliver — 27px at 704px. Invisible.
3. Scroll-pinned sections fight the mobile URL bar and are a well-documented cause of scroll jank and motion discomfort.
4. Absolute positioning does not reflow. There is no partial rescue.

**The carousel, specified completely:**

```
Structure     ul[role=list] > li × 3, DOM order 1,2,3 — identical to desktop, never reordered.
Scroller      overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain;
              scroll-padding-inline: var(--gutter); -webkit-overflow-scrolling: touch
Item          scroll-snap-align: center; flex: 0 0 auto; width: min(88vw, 420px)
Peek          12vw of the next card visible at the right edge — the affordance, no instructional text
Card shape    aspect-ratio: auto; min-height: 520px (base) / 560px (xs) / 600px (sm)
Card interior text block on top (headline clamped to the fluid display curve, then subcopy),
              phone mockup 507:761 below at max-height 320px, centred
Decoration    507:729 (USDC) kept at 40% opacity pinned bottom-right below sm;
              507:739 (USDT) dropped entirely below md — two coins at 360px is noise
Controls      3 dot indicators + prev/next buttons, both ≥44×44.
              Reuse the arrow pattern already in the design at 412:1227 / 412:1230 [D].
              Dots are <button aria-label="Go to card 2 of 3"> with aria-current on the active one.
Scrollbar     visually hidden (scrollbar-width: none) but the element keeps tabindex="0"
              and role="group" aria-label="Feature cards" so it is keyboard-scrollable
Keyboard      Arrow keys scroll natively via tabindex=0; prev/next buttons call
              scrollIntoView({ inline: 'center', behavior: <motion-dependent> })
```

**Touch interaction** `[I]`: swipe is native scroll-snap. **No custom drag/pointer handler** — a hand-rolled gesture layer loses momentum, rubber-banding, and accessibility, and reliably fights the browser. Tapping a partially visible card scrolls it to centre. There is no tap-to-cycle mechanic, because it would conflict with the swipe.

**Reduced motion** `[I]`: the deck is the one component where reduced motion changes *layout*, and it must. See §9, Tier 3 — the fan/carousel is replaced by a plain vertical stack of three static, full-width cards in DOM order. No sticky, no scroll track, no horizontal scroller.

#### 7.0.2 The Top Nav — `412:2066` (+ `511:432`, `412:1831`, `412:2609`, `412:2779`, `412:2803`, `498:210`, `500:2282`)

**`[D]` — 123px tall in all eight frames.** It is **not** edge-to-edge. Contents span x = 293.8 → 1146.2, i.e. an **852.4px island centred on x = 720** (exactly: (293.8 + 1146.2) / 2 = 720).

| Element | Node | x | w |
|---|---|---|---|
| Logo | `412:2068` | 293.8 | 59.4 |
| Link group | `412:2076` | 385.2 | 359 |
| — Products ▾ | `412:2077` | 385.2 | 87 |
| — Socials ▾ | `412:2081` | 504.2 | 73 |
| — Blog | `412:2085` | 609.2 | 34 |
| — About Us | `412:2086` | 675.2 | 69 |
| CTA "Chat with Azza" | `412:2087` | 1002.2 | 144 |

**The island is `justify-content: space-between`.** `[D]` — logo+links cluster = 59.4 + 32 + 359 = 450.4; CTA = 144; 852.4 − 594.4 = **258**, and the measured gap `1002.2 − 744.2` is **258**. Exact. So the nav needs no magic numbers:

```
nav inner: width: min(852px, 100% − 2 × gutter); margin-inline: auto;
           display: flex; justify-content: space-between; align-items: center;
```

At 1440 this reproduces the design exactly. Above 1440 it pins at 852 (§3.3).

**Dropdown panels** `[D]`:
- Products `94:850` — 349 × 204; three rows `94:851`/`94:856`/`94:861` at 317 × 44, pitch 64, padding 16. Each row: 36px circle icon + title (19px) + description (17px).
- Socials `63:350` — 232 × 144; three rows `63:353`/`63:356`/`63:361` at 200 × 24, pitch 44, padding 16. Each row: 24px circle icon + label.

**The switch point** `[I]`: **the mobile nav takes over below `lg` (1024)** — i.e. `max-lg:`.

Note this is *not* where the nav geometrically breaks. The 852 island still fits at 768 (768 − 80 = 688 < 852, so the island compresses to 688; cluster 450.4 + CTA 144 = 594.4 still fits with 93.6 spare). The switch is at 1024 for two reasons that are not about width: (a) 1024 is where every other two-column split in the site stacks, so the whole page reads as "touch layout" at one coherent line; (b) **hover-opened dropdowns have no acceptable touch equivalent at any width**, and both nav dropdowns are hover-primary in the design.

**Mobile nav — complete specification `[I]`**

**Bar**
- Height: 123 (`lg`+) `[D]` → 72 (`md`, `sm`, `xs`) → 64 (base). 123px is 17% of a 720px-tall phone viewport, and it exists at 1440 to give the centred island air that does not exist at 360.
- `position: sticky; top: 0; z-index: 50`, opaque background. (The design shows no scroll state `[D]`; sticky is inferred and justified by 7,390px pages.)
- Contents left → right: **logo** · *(spacer)* · **CTA** · **menu trigger**.
- The CTA stays **in the bar, not in the menu** — it is the product's entire conversion action (WhatsApp-first) and burying it behind a hamburger would be a conversion regression.
- Below `xs` (< 480) the CTA collapses to a 44 × 44 icon-only WhatsApp button with `aria-label="Chat with Azza"`, and **the full-text CTA reappears as the first item inside the panel**, so the label is never lost.

**Trigger**
- `<button>`, 44 × 44, `aria-expanded`, `aria-controls="site-menu"`, `aria-label` toggling `"Open menu"` / `"Close menu"`. Hamburger ⇄ X.
- Never a CSS checkbox/`:target` hack — neither is announceable or Escape-dismissible.

**Panel**
- Full-screen **top sheet**: `position: fixed; inset: var(--nav-h) 0 0 0`. Not a side drawer — the design's nav is centred and symmetric, and a side drawer imports a directional metaphor the design does not have.
- Height `100dvh − var(--nav-h)`, with a `100vh` fallback for old engines. **Never bare `100vh`** — iOS URL-bar collapse makes it overflow.
- Rendered **in the DOM adjacent to the trigger**, not portalled to `<body>`, so focus order is natural without manual repair.
- Panel content scrolls internally with `overscroll-behavior: contain`.
- Rows: 56px tall, full width, 24px inline padding, 20px label. (Padded up from the design's 44px `94:851` row `[D]`.)

**Nested dropdowns — inline accordions, not flyouts**
- The `Products` and `Socials` rows become `<button aria-expanded aria-controls>` that **disclose children in place**, pushing the rest of the list down.
- **Why not a flyout / second-level slide-in:** it needs a second focus trap, a "back" affordance, its own dismissal rules, and a mental model of "where am I". An in-place accordion needs none of that and keeps a single linear focus order. With only two menus of three items each, the depth is not worth the machinery.
- Multiple accordions may be open simultaneously — there are two, both short. No auto-collapse.
- Products children keep icon + title + description from `94:850` `[D]`. Below `xs` the description line drops to keep the row at 56px; it stays at `xs`+.
- Socials children keep the 24px circle icons from `63:350` `[D]`; row height padded 24 → 48.
- Chevron rotates 0° → 180°; rotation is motion and obeys §9 Tier 2.

**Focus**
- On open: move focus to the **first focusable element inside the panel** (the CTA row). Do **not** focus the panel container.
- Trap focus across `{ trigger, panel }` while open. `Tab` from the last wraps to the first; `Shift+Tab` from the first wraps to the last.
- On close: **always** return focus to the trigger — including Escape-close, backdrop-close, and route-change close.
- While open, apply **`inert`** to `<main>` and `<footer>` (with `aria-hidden="true"` alongside for older engines). `inert` is the correct modern mechanism and removes the need to manually manage `tabindex` on page content.

**Dismissal — all five paths**
1. `Escape` from anywhere in the panel. **One Escape closes the panel**, even with an accordion open — a sheet is one layer to the user and staged dismissal is surprising.
2. Tapping the trigger again.
3. Tapping the backdrop / outside the panel content.
4. Route change (Next.js `usePathname` effect).
5. **Viewport crossing to ≥ 1024.** Non-negotiable: the desktop nav appears, the panel becomes invisible, and if it stayed "open" the `inert` on `<main>` would silently trap the entire page. Subscribe to a `matchMedia` change listener; do not poll `resize`.

**Scroll locking**
- `overflow: hidden` on `<html>` **is not sufficient on iOS Safari.** Required sequence:
  ```
  open  → const y = window.scrollY
          body.style.position = 'fixed'; body.style.top = `-${y}px`;
          body.style.width = '100%'; body.style.overflow = 'hidden'
  close → clear all four; window.scrollTo(0, y)
  ```
- Panel scroller carries `overscroll-behavior: contain` so a flick at its end does not chain to the page.
- Preserve scroll position across open/close. Losing it 4,000px into the landing page is a severe regression.

**Semantics**
- `<header><nav aria-label="Primary">` at every breakpoint.
- Panel is **not** `role="dialog"` — it is navigation, and `dialog` semantics would suppress the landmark. `<nav id="site-menu">` with `inert` on the rest of the page achieves the same isolation without lying about the content type.
- Skip link (`Skip to content`) is the first focusable element on the page at every breakpoint, visible on focus.

---

### 7.1 Global chrome

#### 7.1.1 Footer
`498:599` · `498:641` · `498:683` · `412:2665` · `498:725` · `498:851` · `498:767` · `500:2385`

**`[D]`** 764 tall. Content `498:600` 1002 wide at x = 219. Logo column `498:603` (114 × 60). Link block `498:613` at x = 214, 802 wide: Products `498:614` (199), Resources `498:619` (128 @ x 279), Company `498:624` (116 @ x 487), Contact `498:629` (119 @ x 683). Rule `498:633` at y = 208. Legal row `498:634`: copyright left, "All rights reserved." right. Wordmark band `498:637` — "USE AZZA" 1002 × 162 with ellipse `498:639` at x = 474 (47.3% of width), 135 × 135.

| Stop | Behaviour `[I]` |
|---|---|
| base | Logo full width. Link columns **1-col** stacked, each a plain visible list (no accordion — 3–4 items each). Legal row stacks, left-aligned. Wordmark scales to container, ellipse positioned at **47.3%** (percentage, not px). Band height clamps with the wordmark. |
| `xs` | Link columns **2 × 2**. |
| `sm` | Link columns **2 × 2**, wider gap. |
| `md` | Link columns **4-up** in one row. Logo above. Legal row goes horizontal (copyright ↔ rights). |
| `lg` | Logo left, 4-up links right — the designed arrangement, container-scaled. |
| `xl`/`2xl` | As designed `[D]`, content 1002 centred. |

Link targets 44-tall inside the existing 46px pitch `[D]` — **no visual change at any width**.

#### 7.1.2 QR badge
`412:884` (landing) · `511:464` · `412:1990` · `412:2602`

**`[D]`** 119 × 174, absolutely placed at the right of the hero (x = 1216 / 1259 / 1239 / 1239). Contains a 102 × 102 QR image `412:888` and the caption "Text Azza on WhatsApp" `412:889`.

> **🚩 FINDING — this is not a band.** `PLAN.md` §1 lists a "QR band (174)" as a shared full-width section on three frames, and the roster assigns `impl-qr-band` to `src/components/sections/QrBand/**`. It is **not** a band. It is a 119 × 174 badge floated at the right edge of the hero, inside the hero, on four frames (including the landing hero, which the plan does not list). An implementer building a full-width band from the plan's description will build the wrong component. Node ids above.

| Stop | Behaviour `[I]` |
|---|---|
| `< lg` | **`display: none` + `aria-hidden`.** A QR code cannot be scanned by the device rendering it. This is not content loss: the exact same action is already present, in the modality-appropriate form, as the "Chat with Azza" CTA (`412:2087`) which is a `wa.me` deep link. |
| `≥ lg` | As designed `[D]`, absolutely positioned at the hero's right edge. The whole badge is one `<a>` whose accessible name is the caption `[D]` "Text Azza on WhatsApp" — never a bare `<img>` with no name. |

---

### 7.2 Frame 1 — Main Landing Page `412:759` (1440 × 7390)

#### 7.2.1 Hero — `412:761` (850)
**`[D]`** Content `412:1370` 878 × 580 at x = 281. Headline is two absolutely-composed lines with inline art: `412:786` (878 × 497) holds "Your mONEY" `412:788` (631 × 135) and "anywhere." `412:787` (491 × 135) plus masked decorations `412:833`, `412:845` (Nigeria flag disc, 132 × 132), `412:807`; `412:860` (739 × 157) holds "sh"/"uld w"/"rk" `412:863`/`412:862`/`412:861` interleaved with the ellipse group `412:864`. Subcopy `412:789` (586 × 56). CTA `412:1367` (182 × 51). QR `412:884`.

The headline is a **word-level collage**: display glyphs and circular graphics occupy alternating inline positions. It is not a text block with a background.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | Headline reflows to **plain text lines** — "Your money should work anywhere." as a single wrapping `<h1>` on the fluid display curve, floor 40px. **All inline collage graphics (`412:864`, `412:833`, `412:873`, `412:807`) are dropped** except the Nigeria disc `412:845`, which moves to a 56px inline-block before the word "anywhere". Attempting to preserve a 5-piece inline collage at 320px produces overlap at every wrap point. Subcopy full width. CTA full width, 48 tall. QR hidden. Section min-height `auto`; padding per §4.3. |
| `md` | Headline centred, max 640. Reintroduce `412:864` (the ellipse pair) as an inline graphic after "work". Others stay dropped. CTA auto-width, centred. |
| `lg` | Full collage restored at ratio-scaled positions; content max 878 `[D]`, centred. QR appears. |
| `xl`/`2xl` | As designed `[D]`. |

DOM order at every stop: `h1` → subcopy → CTA → QR. Never reordered.

#### 7.2.2 Why Azza? — `570:434` (968)
**`[D]`** Heading `570:435` (661 × 108) at x = 120. Feature list `570:436` (560 × 581) at x = 188 — **seven** items (`570:437`, `570:440`, `570:443`, `570:446`, `570:449`, `570:452`, `570:455`), each a 32px title + 52–78px body, pitch 72. Phone mockup `570:461` (518 × 653) at x = 802. Background plates `570:458` (567 × 274), `570:459` (567 × 262), marker `570:460` (22 × 23).

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | **1 column.** Heading, then all **seven** features stacked (title 20px + body 16px, pitch ~104 → ≈ 730px total), then the phone at max-width 280 centred. **All seven remain visible — no truncation, no "show more".** Hiding four of a product's seven capabilities on the device most customers use is a content decision, not a layout one, and it is not mine to make. Background plates `570:458`/`570:459` drop (they are desktop-composition scaffolding). |
| `md` | Features in **2 columns** (4 + 3), phone below, centred, max 360. |
| `lg` | **2 columns:** features left (7 stacked, 1-col), phone right — the designed arrangement. Ratio-scaled. Background plates return. |
| `xl`/`2xl` | As designed `[D]`. |

#### 7.2.3 Cards — `412:2196` (900) / `511:364`
See **§7.0.1** in full.

Section height: 900 `[D]` at `xl`+ → `100dvh` sticky stage while pinned → `auto` (carousel, ~640) at `< lg` → `auto` (vertical stack) under reduced motion.

#### 7.2.4 What People Say — `412:1065` (772)
**`[D]`** Heading `412:1066` (662 × 135). Group `412:1067` (955 × 382) at x = 242 containing three cards at 305 × 319:

| DOM position | Node | x | y |
|---|---|---|---|
| 1st | `412:1068` | 242 | 342 |
| 2nd | `412:1076` | 892 | 342 |
| **3rd** | `412:1084` | **567** | **279** |

> **🚩 REORDER — the design's own DOM order already diverges from its visual order.** Visually the cards read left → right as 242, **567**, 892. In the Figma layer order they are 242, 892, **567**. Naively transcribing the layer order gives a mobile stack of 1, 3, 2 — a silent reading-order bug that would look fine on desktop and be wrong on every phone.
>
> **Rule `[I]`: DOM order is visual left-to-right — `412:1068`, `412:1084`, `412:1076`.** The desktop stagger (the middle card sits 63px higher `[D]`) is produced with `margin-block-start: -63px` (or `translate-y`) on the **second DOM child**. Never with `order:`, `row-reverse`, or grid placement that moves a card past a sibling.

| Stop | Behaviour `[I]` |
|---|---|
| base–`xs` | **1 column**, cards full width, max 360, no stagger. |
| `sm` | 1 column, max 420. |
| `md` | **2 columns**, no stagger (a stagger in a 2-up reads as misalignment, not rhythm). |
| `lg` | **3 columns**, stagger returns on the 2nd child (−63px, ratio-scaled). |
| `xl`/`2xl` | As designed `[D]`, group 955 centred. |

Play button (`412:1071` etc.) is a real, always-visible 44px `<button>` at every stop (§6.4 #4).

#### 7.2.5 FAQs — `412:1554` (958)
**`[D]`** Heading `412:1555` (408 × 38). Card `412:1556` (987 × 712) at x = 226.5. Inside: question column `412:1560` (447) with five rows `412:1562`–`412:1570` (368 × 61, pitch 73), section label "QUESTIONS" `412:1572`; answer pane `412:1573` (393 × 194) at x = 535; badge `412:1575` (102 × 40) at top-right. Backdrop `412:1557`. **The FAQ card is 987 wide in all four instances** (`412:1556`, `412:1761`, `412:1998`, `412:2635`) — only the height varies (712 / 712 / 712 / 561).

> **The structural rule that makes this work `[I]` — one DOM, two presentations, zero reordering.**
>
> Build the FAQ as a **true accordion in the DOM at every breakpoint**: each question is immediately followed in source order by its own answer panel. Produce the desktop two-pane look purely with CSS Grid placement:
>
> ```css
> .faq { display: grid; grid-template-columns: 447fr 393fr; }
> .faq > .q { grid-column: 1; }                       /* questions flow down col 1 */
> .faq > .a { grid-column: 2; grid-row: 1 / -1; }     /* the open answer fills col 2 */
> ```
>
> Only the open answer is rendered/displayed. Below `lg`, drop to `grid-template-columns: 1fr` and the panels fall into place directly under their questions — a normal accordion, with **no DOM change, no duplicated markup, and no reorder**. This is the correct engineering answer and it should not be re-derived by four separate implementers.

| Stop | Behaviour `[I]` |
|---|---|
| `< lg` | Single-column accordion. Question rows 61 `[D]` → 56 min, full width. Answer expands inline beneath its question. Badge `412:1575` moves above the list, left-aligned. Card padding 20 → 24. Backdrop `412:1557` simplifies to a flat fill (a 1374px decorative mask at 360 is pure payload). |
| `lg`+ | Two-pane grid as above; card `min(987px, 100%)`. |
| `xl`/`2xl` | As designed `[D]`. |

Semantics at every stop: `<h3><button aria-expanded aria-controls>` + `<div role="region" aria-labelledby>`. Exactly one open at a time, matching the design's single-answer pane `[D]`. First question open by default `[D]` (`412:1574` shows an answer at rest).

#### 7.2.6 Azza Wrapped — `412:1154` (924)
**`[D]`** Band `412:1155` — **1440 × 752, fully absolutely composed.** Frame border `412:1156`/`412:1157`; background image `412:1163` (1604 × 1068, deliberately overflowing); four corner ellipses `412:1164`–`412:1167` (138.5 each, at negative offsets); centre character art `412:1214`/`412:1215`; "BADDIIE" `412:1219`; wordmark group `412:1196` "AZZA WRAPPED"; three large stat callouts — `412:1168` ($500 / Transactions Volume, top-left), `412:1176` ($5000 / Highest Single Trade, bottom-left), `412:1172` (100 / Trades, bottom-right); small summary list `412:1180` (Transactions Volume $20K · Highest Single Trade $5K · Number of Trades 100 · Most Used Chain BNB); chain badge `412:1193`. Controls `412:1221` (1139.5 × 56): CTA `412:1222` "Generate your Azza wrapped" (314 × 56) and arrow pair `412:1226` (`412:1227`, `412:1230`, 56 × 52 each).

> **🚩 CONTENT FINDING — the stats contradict each other.** `412:1169` says Transactions Volume **$500**, `412:1182`/`412:1187` say **$20K**. `412:1177` says Highest Single Trade **$5000**, `412:1183`/`412:1188` say **$5K**. Same card, same labels, different numbers. Trades agree at 100. This is a design bug, not a responsive one, but it forces a decision at narrow widths where both cannot be shown. Raised in `findings`.

**This is the second-most consequential call in the document.** The band cannot reflow — every element is at a hand-placed coordinate, several negative.

| Stop | Behaviour `[I]` |
|---|---|
| `lg`+ | Band as designed, `min(1440px, 100%)`, `aspect-ratio: 1440 / 752`, all children positioned in **percentages** of the band (not px), so it scales as a unit down to 1024 without tearing. **Does not exceed 1440** (§3.3). Corner ellipses keep their negative offsets under `overflow: hidden`. |
| `md` | Band recomposed **vertically** as a card: character art `412:1214` on top cropped to 16:9 → "AZZA WRAPPED" wordmark → the **three large callouts** as a 3-up row → chain badge. Corner ellipses drop. Summary list `412:1180` **drops as a duplicate** of the callouts (and it is the pair that disagrees). "BADDIIE" `412:1219` retained under the art. |
| base–`sm` | Same vertical recomposition; the three callouts stack **1-col** at base and **2-col + 1** at `xs`. Background image `412:1163` becomes a contained cover rather than an overflowing bleed. |
| all | Controls `412:1221` stack below the band: CTA full width at base, auto from `xs`; arrows right-aligned, 56 × 56, `disabled` at the ends, `aria-label`ed. |

Every part of the `md`-and-below recomposition is `[I]`. It is a reconstruction, not a reflow, and the operator should look at it.

#### 7.2.7 use Azza Today — `412:1233` (1128)
**`[D]`** Badge `412:1292` "START NOW" (146 × 48) at y = 112. Text block `412:1284` (635 × 271) at x = 403, y = 180: heading `412:1286` (635 × 135), subcopy `412:1287` (529 × 56), CTA `412:1288` (253 × 56). Art `412:1234` (1069 × 615) at y = 467 — a cluster of overlapping ellipses/vectors forming an "AZ ZA" mark (`412:1251`).

Vertical order is already badge → text → art `[D]`, so stacking is trivial.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | Badge, heading (fluid curve), subcopy, CTA full width. Art `412:1234` scales to container width at its native 1069:615 ratio, `overflow: hidden`, positioned to keep the "AZ ZA" mark `412:1251` centred (it sits at 51.2% / 33.2% of the art group `[D]`). |
| `md`/`lg` | Text max 635 `[D]` centred; art at container width. |
| `xl`/`2xl` | As designed `[D]`. |

---

### 7.3 Frames 2–4 — Products

#### 7.3.1 Crypto Wallet — `412:1586` (2817)

**Home Landing `412:1587` (972)** — **`[D]`** Copy column `412:1615` (429 × 596) at x = 150: eyebrow `412:1617` (120 × 34), heading `412:1620` (436 × 380), subcopy `412:1621` (429 × 38), CTA `412:1622` (193 × 56). Widget `412:1626` (580 × 650) at x = 710: tab pair `412:1643` (540 × 56, two 257-wide tabs `412:1645`/`412:1647`), "You want to buy" row `412:1649` (533 × 102) with amount `412:1651` + asset select `412:1652` (124 × 42), "You'll pay" row `412:1661` (533 × 102) with `412:1663` + currency select `412:1664` (121 × 44), rate row `412:1674` (485 × 28), submit `456:204` (533 × 51). Decorative currency vectors `412:1629`, `412:1635`. QR `511:464`.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | **1 column:** copy, then widget. Widget full width, internal padding 32 `[D]` → 16. Tabs stay side-by-side (2 × 50%) — they are a binary and must not stack. Amount rows: label above, value and asset-select on one line with the select right-aligned; select height → 44. Rate row `412:1674` wraps to two lines at base. Submit full width, 48. Decorative vectors `412:1629`/`412:1635` **drop below `md`** — they are 523/559-wide background art. QR hidden. |
| `md` | Still 1 column but widget max 580 `[D]`, centred; copy max 560. Decorative vectors return at 50% opacity. |
| `lg` | **2 columns:** copy left / widget right, `minmax(0, 429fr) 40px minmax(0, 580fr)`. |
| `xl`/`2xl` | As designed `[D]`; QR appears. |

**FAQ `412:1759`** — per §7.2.5. Question set differs (`412:1771`, `412:1767`, `412:1769`, `412:1773`, `412:1775`); layout identical.
**Footer `498:641`** — per §7.1.1.

#### 7.3.2 Cross Border Payments — `412:1829` (3547)

**Hero `412:1854` (734)** — **`[D]`** Copy `412:1855` (580 × 357) at x = 120: eyebrow `412:1856` (181 × 34), heading `412:1859` (580 × 256), subcopy `412:1860`. Exchange widget `412:1861` (580 × 574) at x = 740: "You send" `412:1864` (516 × 122) with amount `412:1868` + NGN select `412:1869` (94 × 24) and rate line `412:1878`; "Receiver gets" `412:1879` (516 × 88) with `412:1882` + GHS select `412:1883`; meta rows `412:1892` ("Arrives in seconds" `412:1898`, "Total fees included" `412:1904`); submit `412:1905` (516 × 52).

Symmetric 580 | 40 | 580 = 1200 `[D]` — the clearest confirmation of the 1200 container.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | 1 column: copy, then widget full width, padding 32 `[D]` → 16. Currency selects 24 `[D]` → 44 tall. Meta rows stack, icons stay 32. Submit full width, 48. |
| `md` | 1 column, widget max 580 `[D]` centred. |
| `lg`+ | 2 columns, `1fr 40px 1fr`. |

**Why Azza? `553:287` (968)** — **`[D]`** Card `553:288` (1200 × 808) at x = 120, inner `553:289` (1056 × 664) at padding 72. Heading `553:290` (661 × 106). Two columns `553:292` and `553:299` at 508 wide, gap 40. **The two columns have opposite internal orders:** `553:293` = label `553:294` **above** phone `553:295`; `553:300` = phone `553:301` **above** label `553:305`.

> **🚩 REORDER `[I]`.** Stacking the two columns while preserving each one's internal order produces the sequence label → phone → phone → label: two phone mockups adjacent with no intervening text. **Rule: at `< lg`, normalise both columns to label-then-phone.** This is a deliberate deviation from the desktop composition — the alternation is a two-column visual device with no meaning in a single column. Achieved with a container query on the column (container #4), never with `order:` at page level.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | 1 column. Both columns normalised to label → phone. Phone max-width 280. Card padding 72 `[D]` → 24. |
| `md` | 1 column, phone max 360, card padding → 40. |
| `lg`+ | 2 columns, alternation restored `[D]`. |

**FAQ `412:1996`** · **Footer `498:683`** · **QR `412:1990`** — per their sections.

#### 7.3.3 Azza For Business — `412:2412` (3990)

**Hero `412:2436` (769)** — **`[D]`** Inner `412:2437` (1280 × 609) at x = 80 — the widest content block in the site. Centred text `412:2438` (718 × 505): eyebrow `412:2439` (115 × 34), heading `412:2442` (718 × 367), subcopy `412:2443` (511 × 48). Three large decorative groups: `412:2444` (567 × 664, right), `412:2453` (676 × 625, left), `412:2465` (851 × 777, top). Three "Location" pins: `412:2474` (x 1205), `412:2488` (x 40), `412:2502` (x 73).

The decorations are **large, overlapping, and placed relative to the 1280 frame** — including one at x = −110.7 `[D]` (`412:2453`), i.e. deliberately bleeding off the left edge.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | **All three decorative groups and all three Location pins drop.** They total ~2,100px of overlapping vector width against a 320px viewport; there is no scale at which they read as anything but noise, and they carry no information. Text centred, full width, heading on the fluid curve. |
| `md` | Reintroduce **one** decoration — `412:2444` (right) — at 40% opacity behind the text, clipped. Pins stay off. |
| `lg` | All three decorations return at percentage positions of the 1280 stage, `overflow: hidden` on the section so `412:2453`'s negative offset still bleeds. Pins return. |
| `xl`/`2xl` | As designed `[D]`, inner pinned at 1280. |

**Why Azza? (prose) `412:2516` (825)** — **`[D]`** Group `412:2517` (846 × 665) at x = 297. Eyebrow `412:2518` (143 × 34) at x = 297; prose column `412:2520` (650 × 665) at x = 493 with five paragraphs `412:2521`–`412:2525`.

| Stop | Behaviour `[I]` |
|---|---|
| base–`md` | Eyebrow above, prose below, full width, max 650 `[D]`. |
| `lg`+ | Eyebrow left, prose right — as designed. Prose max 650 `[D]`. |

**Why Azza? (steps) `458:261` (702)** — **`[D]`** Left `458:262` (500 × 430) at x = 170: heading `458:264` (411 × 86), subcopy `458:265`, three numbered steps `458:267`/`458:271`/`458:275` (500 × 71, pitch 95) each with a numeral chip `458:268` (58 × 43) and label. Right: phone `458:279` (400 × 502) at x = 870.

The `01 / 02 / 03` numbering is a genuine sequence `[D]` — it is an ordered setup process. It must be marked up as `<ol>`, and the numerals must survive at every width.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | 1 column: heading, steps (`<ol>`, numeral chip inline-start, row min-height 64), then phone max 280. |
| `md` | 1 column, phone max 360. |
| `lg`+ | 2 columns: steps left / phone right. **"as designed" is unreachable at `lg` — see below.** |

> **CORRECTION — the `lg` row was arithmetically unsatisfiable. Orchestrator, 2026-08-01.**
>
> Reported by `impl-why-azza-business`, verified: the designed composition is left column 500 at x = 170 and
> phone 400 at x = 870, so the gap is 870 − 670 = **200**, and the whole thing spans **500 + 200 + 400 =
> 1100**. At `lg` the content box is **928** (1024 viewport − 2 × 48 gutter). 1100 does not fit in 928, so
> "as designed" cannot be honoured at `lg` no matter how it is implemented.
>
> **Ruling:** the 200px gap is the only elastic term — the two columns carry content at measured sizes, the
> gutter is fixed by §4. Step the gap and let it reach the design value where there is room for it:
> `lg:gap-16` (64) → `xl:gap-50` (200 `[D]`). At `xl` the composition is exactly as designed.
>
> **The 64px rung at `lg` is invented** — it is not in the design and no artifact specifies it. It is the
> largest gap that leaves both columns above their content minimums at 928. Recorded here rather than left in
> one agent's `open_questions`, so that any other section hitting the same squeeze uses the same rung instead
> of inventing a different one.
>
> **This is the second unsatisfiable rule found in this artifact** (cf. §5 container #4). Both were caught by
> implementers doing arithmetic the artifact did not. Treat `< xl` prescriptions here as *intent to be
> honoured*, not as literal geometry — the design has no sub-1440 frames, so every number below `xl` is
> derived rather than measured.

**FAQ `412:2633`** (3 questions, card 561 tall `[D]`) · **Footer `412:2665`** · **QR `412:2602`** — per their sections.

---

### 7.4 Frame 5 — Blog `281:56` (3649)

**Blog hero `352:3582` (1026)** — **`[D]`** `352:3583` (1280 × 866) at x = 80 → `352:3584` (1160 × 734). Title block `352:3585`: "THE AZZA BLOG" `352:3586` (1160 × 110), subcopy `352:3587` (627 × 62). Featured card `352:3588` (1160 × 506): banner `412:2960` (1160 × 348, ratio ≈ 10:3), meta `352:3590` — title `500:1840` (1160 × 42), tag chip `500:1838` (89 × 34), date `352:3595`. Hidden decorative group `634:246` — do not build.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | Title on the fluid curve. Featured banner ratio **10:3 → 3:2** (a 10:3 crop at 320px is 96px tall and unreadable). Title wraps freely; tag and date on one line. Whole card is one stretched link. |
| `md` | Banner ratio 2:1. |
| `lg`+ | Banner ratio 10:3 `[D]`; content 1160 → container. |

**All Articles `500:2197` (1736)** — **`[D]`** `500:2198` (1160) at x = 140. Toolbar `500:2201`: search `500:2202` (360 × 58), filters `500:2207` (483 × 26) — All / Finance / Education / Crypto / Technology `500:2208`–`500:2212`. Grid `500:2213`: **3 × 3 of 360-wide cards, column pitch 400 (gap 40), row pitch 522 (gap 56)** `[D]`. Card = image (360 × 280, ratio 9:7) + tag chip (34 tall) + title (62) + date (26). "View More" `507:477` (129 × 46).

| Stop | Columns `[I]` | Notes |
|---|---|---|
| base (320–479) | **1** | Cards full width. **Show 6, then "View More"** — 9 cards × ~470px is a 4,200px scroll. The affordance already exists in the design `[D]` (`507:477`); the initial count of 6 is `[I]`. Filters become a horizontally scrollable chip row (`scroll-snap-type: x proximity`, chips 44 tall, edge fade); the 483px row `[D]` does not fit at 320. Search full width above filters. |
| `xs` (480–639) | **2** | Show all 9 (≈ 2,400px — acceptable). Filters still a scroller. |
| `sm` (640–767) | **2** | Filters fit; wrap to two lines rather than scroll. |
| `md` (768–1023) | **2** | Search and filters on one row. |
| `lg` (1024–1279) | **3** | Gap 32 → 40. |
| `xl`/`2xl` | **3** `[D]` | Gap 40 `[D]`; grid 1160 `[D]`. |

Card internals driven by **container query #2**, not the viewport — the same card also appears in the article page's narrower related grid (§7.5).

**Footer `498:725`** — per §7.1.1.

---

### 7.5 Frame 6 — Blog Article Opened `282:803` (4514)

**`[D]`** Article `352:3681` (3638) → `352:3682` (985 × 3478) at x = 227.5.
- Header `352:3684` (842) at x = 299 (relative 71.5): title `352:3685` (842 × 94), standfirst `352:3686` (842 × 93), meta row `352:3687` — byline/date/read-time `352:3688` (474 wide, with 12px dot separators `352:3690`/`352:3692`) and share cluster `352:3694` (132 wide, 4 × 24px icons at 36px pitch) at x = 710.
- Hero image `352:3706` — **985 × 600, full column width, ratio ≈ 1.64:1.**
- Body `352:3707` (842) — intro `352:3709`, five numbered sections `352:3713`–`352:3717` (820 wide), "Final Words" `352:3718`, disclaimer `352:3721`.
- Share footer `352:3724` (842 × 66) between two rules `352:3725`/`352:3740`.
- Related `352:3741` — **1160 wide at x = −87.5 relative**, i.e. it deliberately **breaks out wider than the 985 article column** `[D]`. Header `521:575` with "View More" `521:572`; grid `352:3743`, 3 × 360 cards, gap 40.

**Measure is the whole story here.** Body is 842 at 1440 `[D]` — near the top of the comfortable range. It must never grow (§3.3 reason 4) and must shrink cleanly.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | Single column at container width. Hero image ratio **1.64:1 → 3:2** at base. Meta row wraps: byline/date/read-time on one line (dot separators become wrapping-safe), share cluster on the next line at **44px targets, 52px pitch**. Body measure = container. Related grid **1 column**; its 1160 breakout collapses to the container (there is no width to break out of). |
| `md` | Body measure `min(842px, 100%)`; hero 16:9. Related grid **2 columns**. |
| `lg` | Article column `min(985px, 100%)`, body 842 `[D]`. Related **3 columns**, breakout `min(1160px, 100%)`. |
| `xl`/`2xl` | As designed `[D]` — article 985, body 842, related 1160 breaking out symmetrically (−87.5 each side `[D]`). |

Semantics: `<article>` with a single `<h1>` (`352:3685`); the five numbered sections are `<h2>`; "Final Words" is `<h2>`; the disclaimer is a `<footer>` inside the article. Related is `<aside aria-labelledby>` **outside** the `<article>`.

**Footer `498:851`** — per §7.1.1.

---

### 7.6 Frames 7 & 8 — Help & Support `498:209` / `500:2281`

These are **one route in two states** (D-001). One component, one responsive spec.

**`[D]` — closed state `500:1736` (971):** sidebar `500:1738` (300 × 487) at x = 80 — search `500:1739` (300 × 58), "Introduction" label `500:1744`, tree `500:1745` (Azza `500:1746` → "Getting started with Azza" `500:1747` with chevron `500:1749`, "Products" `500:1751` with chevron `500:1753`, "Fee structure" `500:1755`, "FAQs" `500:1757`), "Support" group `500:1759`. Content `500:1765` (868 × 811) at x = 452 — header `500:1767` (586), 2 × 2 resource cards `500:1770`/`500:1783` at **420 × 188, gap 28** `[D]`, Community block `500:1796` with three links `500:1801`/`500:1806`/`500:1811` at **264 wide, pitch 302** `[D]`.

**`[D]` — opened state `500:2305` (1237):** sidebar grows 487 → 571 (tree `500:2314` expands 187 → 271, revealing "Create account" `501:207` and "Complete your KYC" `501:212`). Content `500:2334` gains a **breadcrumb** `501:217` (309 × 21: "Help & Support / Getting started with Azza") and swaps the card grid for article body `500:2365` (868 × 1008).

> **Note against the plan.** `PLAN.md` lists "breadcrumb (46)" on **both** frames 7 and 8. It exists only on frame 8 (`501:217`). Frame 7 has no breadcrumb. Also, both frames contain an orphan "View More" node (`498:402`, `500:2426`) at y = 2954 — **outside** the 1858/2124 frame bounds. Do not build these; they are canvas debris.

| Stop | Behaviour `[I]` |
|---|---|
| base–`sm` | **1 column.** The sidebar keeps its DOM position (**before** the content — preserving reading order and skip-link semantics) but renders as a **collapsed disclosure**: a full-width 56px `<button aria-expanded="false">` labelled "Browse topics", directly under the page title, containing the whole tree. Search `500:1739` stays **always visible above it** — it is the primary entry point and must not be hidden behind a toggle. Resource cards **1-up**, full width. Community links **1-up**. Breadcrumb (open state) wraps; if it exceeds two lines, truncate the middle segment with a `title`, never the last. |
| `xs` | Resource cards 1-up; Community links **2-up**. |
| `md` | Resource cards **2-up** `[D]` arrangement, gap 28 → 24. Community **3-up**. Sidebar still a disclosure. |
| `lg` | **Two-pane restored:** sidebar `300px` `[D]` fixed + content `1fr`, gap 72 `[D]`. Sidebar becomes `position: sticky; top: calc(var(--nav-h) + 24px); max-height: calc(100dvh − var(--nav-h) − 48px); overflow-y: auto` — inferred, and justified by the 1,237px content column in the open state `[D]`. Sidebar links 22 `[D]` → 44 targets within the 42 pitch. |
| `xl`/`2xl` | As designed `[D]` — 300 + 72 + 868 = 1240 at x = 80. |

Card internals driven by **container query #3**.
Semantics: sidebar is `<nav aria-label="Help topics">`; the expandable tree items are `<button aria-expanded>` + nested `<ul>`; the current topic carries `aria-current="page"`. Breadcrumb is `<nav aria-label="Breadcrumb"><ol>`.

**Footers `498:767` / `500:2385`** — per §7.1.1.

---

## 8. Long-page behaviour

Landing is 7,390px at 1440 `[D]`. Stacked at 360 it lands near **7,000px** — no worse than desktop, because the display type shrinks by ~70% and reclaims most of what stacking costs. Estimates `[I]`, ±15%:

| Route | 1440 `[D]` | ≈ 360 `[I]` | Verdict |
|---|---|---|---|
| `/` | 7,390 | ~7,000 | Acceptable |
| `/products/crypto-wallet` | 2,817 | ~3,400 | Acceptable |
| `/products/cross-border-payments` | 3,547 | ~4,100 | Acceptable |
| `/products/for-business` | 3,990 | ~4,300 | Acceptable |
| `/blog` | 3,649 | **~5,600 → ~3,900** | **Needs the 6-card initial limit** (§7.4) |
| `/blog/[slug]` | 4,514 | ~9,500 | Acceptable — it is an article |
| `/help` | 1,858 | ~2,600 | Acceptable |
| `/help` (open) | 2,124 | ~3,800 | Acceptable |

**`/blog` is the only route that needs intervention**, and the intervention uses an affordance the design already provides (`507:477`).

**Not added `[I]`:** back-to-top button, reading-progress bar, sticky in-page nav, section scroll-spy. None is in the design and none is necessary. Inventing chrome is a larger fidelity risk than a long scroll.

---

## 9. `prefers-reduced-motion` — global policy

All motion in this build is invented (D-008: `get_motion_context` over the whole `FOR BUILD` section returns `{"nodes": []}`). **Every rule in this section is therefore `[I]`.**

A blanket `* { animation: none }` is wrong: it strands elements that a reveal animation was supposed to bring from `opacity: 0`, and it removes transitions that make state changes comprehensible. Three tiers instead.

### Tier 1 — Decorative motion: removed
Scroll reveals, staggered entrances, parallax on `412:1155` / `412:1234`, ambient float on the deck's coin art (`507:729`, `507:739`), marquee treatments, the `498:637` wordmark treatment, hover lift/zoom.

**Removed, not skipped.** The reveal utility must set the **final** state when reduced motion is on — never leave `opacity: 0` behind. This is the single most common reduced-motion bug and it makes content invisible, which is worse than the animation was.

```css
.reveal { opacity: 0; transform: translateY(16px); transition: … }
.reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

### Tier 2 — Functional motion: instant, not absent
Accordion open/close (FAQ `412:1556`, Help tree `500:2314`, nav panel accordions), nav panel open/close, carousel scroll, chevron rotation, focus-ring transitions.

The state change **still happens** — it is simply immediate. `duration → 0.01ms`, `scroll-behavior: auto`, `scrollIntoView({ behavior: 'auto' })`. Removing the state change entirely would break the component.

### Tier 3 — Structural change: the card deck only
`412:2196` / `511:364` is the one component whose *meaning* is carried by motion, and the only place reduced motion changes layout.

Under `prefers-reduced-motion: reduce`, at **every** breakpoint: no sticky stage, no scroll track, no horizontal scroller, no fan. Three static full-width cards in a vertical stack, DOM order 1, 2, 3, each fully legible. Section height `auto`.

### The global base rule

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

This is the **floor**, not the policy. Tier 1 elements need their own final-state rule (above); Tier 3 needs a different component tree.

### JS rules
- Read `window.matchMedia('(prefers-reduced-motion: reduce)')` **and subscribe to `change`.** Reading once at mount misses a user who changes the setting mid-session — a real scenario, since people toggle it when they start feeling unwell.
- Every scroll-driven effect checks the query before attaching listeners, and detaches on change.
- **Nothing autoplays, at any setting.** The testimonial video (`412:1071`, `412:1079`, `412:1087`) is user-initiated only.
- Honour `prefers-reduced-transparency` by dropping `backdrop-filter` (optional, low priority).

---

## 10. Images, aspect ratios, and layout stability

`[I]` throughout; ratios are `[D]`.

- Every image carries an explicit `width`/`height` or `aspect-ratio`. Zero CLS is a hard requirement — on a 7,390px page a late-loading hero shifts everything below it.
- Ratios that **change** at a breakpoint (and must, because a wide crop is unreadable narrow):

| Image | Node | ≥ `lg` `[D]` | `md` | < `md` |
|---|---|---|---|---|
| Blog featured banner | `412:2960` | 10:3 | 2:1 | 3:2 |
| Article hero | `352:3706` | 1.64:1 | 16:9 | 3:2 |
| Article card image | `500:2216` etc. | 9:7 `[D]` | 9:7 | 3:2 |
| Azza Wrapped character | `412:1215` | in-band | 16:9 | 16:9 |

  A crop change means the **art direction changes**, so these need `<picture>` with distinct sources, not one image squashed by `object-fit`. Flagged to `imagery-asset-expert` via `open_questions`.
- Below-fold images: `loading="lazy"` + `decoding="async"`. Hero images on each route: `priority` / `fetchpriority="high"`, never lazy.
- Decorative art dropped at a breakpoint is dropped in the **markup** (conditional render), not merely `display: none` — otherwise a 1,604px background image (`412:1163`) is still fetched on a phone.

---

## 11. Text overflow and wrapping `[I]`

- Display headings: `text-wrap: balance` (`≤ 4` lines) — prevents a one-word last line on the 135px headings at intermediate widths.
- Body paragraphs: `text-wrap: pretty` where supported.
- Card titles clamped by container query, not viewport: article card titles `line-clamp-2` at `@max-[20rem]/card`, `line-clamp-3` above `[D]` — design shows 62px (2 lines) and 93px (3 lines) variants (`500:2220` vs `352:3756`).
- Long tokens (`hq@azza.com`, `07041900011`, rate strings, wallet addresses): `overflow-wrap: anywhere`.
- **Never `hyphens: auto` on display type** — hyphenated 135px headlines look like a bug.
- No text is truncated with an ellipsis at any breakpoint **except** card titles (above) and the Help breadcrumb middle segment (§7.6). Truncation is content loss and needs a reason.

---

## 12. What Phase 3 should actually check

Capture set: **320, 360, 390, 480, 768, 1024, 1280, 1440, 1920, 2560.** (360 and 390 are the real-world phone modes and catch things 320 does not; they fire no unique rules.)

At **1440 only**: pixel diff against the Figma export, 2% threshold (gate 7).

At **every other width**, no ground truth exists. Check these instead:
1. No horizontal overflow at page level (`document.scrollWidth <= window.innerWidth + 1`) — at every width.
2. No overlapping interactive elements.
3. No clipped text.
4. Every interactive element ≥ 44 × 44 (§6.2), inline prose links exempt.
5. Nav panel: opens, traps focus, closes on all five paths (§7.0.2), restores scroll position, `inert` correctly applied and removed.
6. Card deck: fan ≥ 1024; carousel < 1024; **vertical stack under reduced motion at all widths**.
7. DOM order matches visual order in the two flagged sections — testimonials (§7.2.4) and cross-border Why Azza (§7.3.2).
8. QR badge absent < 1024 (§7.1.2).
9. At 1920 and 2560: layout identical to 1440 apart from gutter width.
10. At 200% browser zoom on a 1280 viewport: the `md`-or-narrower layout appears and nothing overflows (this is the rem-breakpoint payoff — verify it works rather than assuming).

---

## 13. Summary of the load-bearing decisions

| # | Decision | Tag | Confidence | Review? |
|---|---|---|---|---|
| 1 | Breakpoints 320/480/640/768/1024/1280/1440 | `[I]` | High | — |
| 2 | `2xl` = 1440, not Tailwind's 1536 | `[I]` | High | — |
| 3 | Container `min(1200, 100% − 2×gutter)`, gutters stepped | `[I]` | High | — |
| 4 | **Pin above 1440; never fluid-scale** | `[I]` | High | — |
| 5 | `clamp()` for display type ≥ 32px **only** | `[I]` | High | — |
| 6 | Clamp max term = exact Figma value | `[I]` | High | — |
| 7 | Container queries in exactly 4 places | `[I]` | Medium-high | — |
| 8 | **Card deck → snap carousel below 1024** | `[I]` | **Medium** | **Yes** |
| 9 | **Deck fan axis is X-left (Figma), not owo's Y** | `[D]` geom, `[I]` call | **Medium** | **Yes** |
| 10 | Deck → vertical stack under reduced motion | `[I]` | High | — |
| 11 | **Mobile nav switches at 1024, not at geometric break** | `[I]` | Medium-high | **Yes** |
| 12 | Nav dropdowns → inline accordions, not flyouts | `[I]` | High | — |
| 13 | CTA stays in the bar, never in the menu | `[I]` | Medium-high | — |
| 14 | **QR badge hidden below 1024** | `[I]` | High | **Yes** |
| 15 | FAQ = one accordion DOM, two CSS presentations | `[I]` | High | — |
| 16 | **Azza Wrapped recomposed vertically below 1024** | `[I]` | **Low-medium** | **Yes** |
| 17 | Testimonial DOM order = visual order, stagger via margin | `[D]` finding, `[I]` fix | High | — |
| 18 | Cross-border Why-Azza alternation normalised < 1024 | `[I]` | Medium | — |
| 19 | All 7 Why-Azza features kept on mobile (no truncation) | `[I]` | High | — |
| 20 | `/blog` shows 6 then "View More" below 480 | `[I]` | Medium | — |
| 21 | Business hero decorations dropped below 768 | `[I]` | Medium | — |
| 22 | 44px touch floor, hit area not glyph | `[I]` | High | — |
| 23 | Art-directed crop changes need `<picture>` | `[I]` | Medium | — |

---

## 14. What the design does not specify

**This is the most important section in this document.** Everything below was invented by me. Nothing in the Figma file states, implies, or constrains any of it.

### 14.1 Everything about every viewport that is not 1440

The file contains **eight frames, all 1440 wide**. There are no mobile frames, no tablet frames, no wide frames, no responsive annotations, no auto-layout constraints implying reflow, no prototype breakpoints, no designer notes about narrow behaviour. **48 of 56 cells in §2 are derived.** Everything in §7 below each section's `[D]` evidence line is my judgement.

### 14.2 The complete inventory of inventions

**Breakpoints and container**
1. The entire breakpoint set. 480 and 1280 have no basis in the file at all.
2. `2xl` = 1440 rather than Tailwind's 1536.
3. The stepped gutter scale (20/24/32/40/48/80). Only 120 at 1440 is `[D]`.
4. Pin-above-1440. Fluid scaling is equally defensible; I chose pinning for the four reasons in §3.3 and the operator can reverse it.
5. The 320 floor and the 280–319 degradation policy.
6. That a single 1200 container governs, when the file shows sixteen distinct content widths (§3.1).

**Type and spacing**
7. The clamp-for-display-only policy. Fluid-everything and stepped-everything are both defensible.
8. Every floor value in every clamp (the 40px display floor is mine; the 135px ceiling is `[D]`).
9. Every stepped value in §4.3 except the 40px grid gap.
10. Section vertical padding at every width below 1440.

**The card deck — the largest single invention**
11. That it becomes a carousel below 1024 rather than a stack, a list, or a scaled fan.
12. The 1024 switch point.
13. `min(88vw, 420px)` card width and 12vw peek.
14. Portrait card composition (text over phone).
15. Dropping the USDT art below `md` and dimming USDC below `sm`.
16. Dot indicators and prev/next buttons (the arrow *pattern* is `[D]` from `412:1227`; using it here is mine).
17. The vertical-stack reduced-motion variant.
18. `position: sticky` rather than owo's JS transforms.
19. The ~280vh scroll track and 3-beat advance.
20. **Reconciling the axis conflict in favour of Figma's X-left fan over owo's Y translate.** D-006 arguably assigns this to owo; I ruled for the measured resting state. Reversible in one directory.

**The Top Nav — the second-largest**
21. The 1024 switch point (chosen for coherence and touch, not geometry — the island still fits at 640).
22. Bar heights 72 and 64.
23. Sticky positioning. The design shows no scroll state whatsoever.
24. Top sheet rather than side drawer.
25. Keeping the CTA in the bar; collapsing it to an icon below 480; repeating it inside the panel.
26. Inline accordions rather than flyouts for the two dropdowns.
27. Dropping the Products description line below 480.
28. All focus, `inert`, dismissal, and scroll-lock behaviour. None is designed.
29. 56px row height (padded from the `[D]` 44).

**Section reflow**
30. Dissolving the hero headline collage into plain text below `md`, and which pieces survive at which width.
31. Keeping all seven Why-Azza features on mobile (a defensible alternative is a disclosure at 4).
32. Every column-count transition on every grid.
33. Removing the testimonial stagger below `lg`, and the −63px margin technique.
34. **Normalising the cross-border Why-Azza alternation below `lg`** — a deliberate deviation from the desktop composition.
35. **The entire Azza Wrapped mobile recomposition (§7.2.6).** This is a reconstruction of an absolutely-composed 1440 × 752 canvas into a vertical card. It is the least-supported call in the document and it is the one I would most want the operator to look at.
36. Dropping the duplicate summary list `412:1180` below `md` (and which of the two contradicting figures survives).
37. Dropping Business hero decorations below `md`, and reintroducing exactly one at `md`.
38. Every aspect-ratio change in §10. The design has one crop per image.
39. The blog 6-card initial limit and the filter-chip scroller.
40. Sticky Help sidebar at `lg`+, and the "Browse topics" disclosure below it.
41. Keeping Help search always visible while collapsing the tree.
42. Help breadcrumb truncation policy.

**Interaction and accessibility**
43. The 44px floor (WCAG AA requires 24).
44. Every remedy in §6.2 — the design specifies no touch behaviour anywhere.
45. Every non-hover equivalent in §6.4 — the design shows no hover states, so their existence is also inferred.
46. The 150ms dropdown close delay.
47. The `(hover: hover) and (pointer: fine)` guard.
48. All focus-ring behaviour.
49. **The entire reduced-motion policy (§9)**, since all motion is invented in the first place.
50. All semantic markup choices: `<ol>` for the Business steps, `<aside>` for Related, `<nav aria-label>` values, `aria-current` usage, heading levels.

### 14.3 Where the design is internally inconsistent

`[D]` observations, not inventions — these are real problems that only become visible when you try to build them.

1. **Azza Wrapped stats contradict.** `412:1169` $500 vs `412:1182`/`412:1187` $20K; `412:1177` $5000 vs `412:1183`/`412:1188` $5K. Same card, same labels.
2. **Card variant widths differ.** 1200 / 1200 / 1300 (D-007 normalises to 1300).
3. **Duplicate FAQ questions.** `412:1566`, `412:1568`, `412:1570` are all "Supported Local Currency?" on the landing FAQ.
4. **Typo in shipped copy.** `412:1565` "Why should i doo KYC?" — lowercase `i`, "doo".
5. **Sixteen distinct content widths** across seventeen sections (§3.1). Only three sections agree on 1200.
6. **Orphan nodes outside frame bounds.** `498:402` and `500:2426` ("View More") sit at y = 2954, outside the 1858 / 2124 frames. Canvas debris — do not build.
7. **Lorem ipsum in the Help open state.** `500:2368`, `501:219`, `501:220`, `501:224`, `501:225`, `501:233`, `501:234` are all placeholder Latin. `PLAN.md` gate 10 forbids lorem. `/help` open state has no real copy to transcribe.
8. **Nav CTA is 43px tall** (`412:2087`) — 1px under the touch floor at the design width.
9. **`PLAN.md` mislabels the QR badge as a full-width band** and omits its landing-page instance (§7.1.2).
10. **`PLAN.md` lists a breadcrumb on frame 7**; only frame 8 has one (§7.6).
11. **Testimonial layer order ≠ visual order** (§7.2.4).

### 14.4 What I could not verify

- **Context7 MCP was unreachable from this agent's toolset** (no `resolve-library-id` / `query-docs` tool was exposed). The spec required verifying Tailwind v4 guidance through it. **Substitute used:** I read the **installed package's own source** — `tailwindcss@4.3.3/theme.css` lines 327–345 for the `--breakpoint-*` and `--container-*` namespaces, and `dist/lib.js` for container-query support (`@container`, `container-type: inline-size`). That is Tailwind's shipped definition of record rather than documentation *about* it, so §1.3 and §5 are verified against the exact version this project builds with — arguably a stronger check. Disclosed in `open_questions` as a deviation from the Inputs allowlist.
- I did **not** read any peer artifact. Conflicts with `typography.md` and `layout.md` are handled by the resolution protocols in §3.2 and §4.2.
