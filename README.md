# AZZA Website

Marketing site for AZZA, built from the Figma source `OXDVihY7WvtPZ6uGuVFx5Y`.

|                 |                                         |
| --------------- | --------------------------------------- |
| Framework       | Next.js 15.5.22, App Router             |
| Language        | TypeScript 5.9.3, `strict: true`        |
| Styling         | Tailwind CSS v4.3.3, CSS-first `@theme` |
| Runtime         | React 19.2.8                            |
| Package manager | pnpm 11.18.0                            |
| Node            | >= 20.9                                 |

## Commands

```bash
pnpm install        # install dependencies
pnpm dev            # dev server on http://localhost:3000 (Turbopack)
pnpm build          # production build
pnpm start          # serve the production build (run pnpm build first)
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint
pnpm lint:fix       # eslint --fix
pnpm format         # prettier --write .
pnpm format:check   # prettier --check .
pnpm tokens         # regenerate design tokens from tokens.json
```

`pnpm dev` and `pnpm build` both run `pnpm tokens` first, so the generated stylesheet
is never stale.

pnpm comes from Corepack. If `pnpm` is not on your PATH:

```bash
corepack enable && corepack prepare pnpm@11.18.0 --activate
```

## Design tokens

`tokens.json` at the project root is the **single source of truth** for every design
value in this site. `pnpm tokens` compiles it to `src/app/tokens.generated.css`, which
`src/app/globals.css` imports as a Tailwind `@theme static` block.

Top-level keys in `tokens.json` are Tailwind v4 theme namespaces. Nested objects
flatten with `-`:

```json
{
  "color": { "brand": { "green": "#D3FEB6" } },
  "text": { "hero": "4.5rem" },
  "spacing": { "section": "6rem" },
  "radius": { "card": "24px" }
}
```

compiles to:

| token path          | CSS custom property   |
| ------------------- | --------------------- |
| `color.brand.green` | `--color-brand-green` |
| `text.hero`         | `--text-hero`         |
| `spacing.section`   | `--spacing-section`   |
| `radius.card`       | `--radius-card`       |

Each token is then reachable two ways:

```tsx
<div className="bg-brand-green" />                          // Tailwind utility
<div style={{ backgroundColor: "var(--color-brand-green)" }} />  // CSS variable
```

The block is emitted `static`, so every token lands on `:root` whether or not
Tailwind can see it referenced. A token used only from an inline style or a
hand-written stylesheet still resolves.

Rules:

- **Never hard-code a design value** — no raw hex, no magic px — in component source.
  Add it to `tokens.json` and use the token.
- **Never edit `src/app/tokens.generated.css`.** It is overwritten on every dev and build.
- The generator has no fallback. A missing or malformed `tokens.json` fails the build
  with a message naming the offending token, rather than silently reverting to defaults.

`tokens.json` also accepts the W3C design-token `{ "$value": ... }` wrapper, and
normalises keys that are not valid CSS identifiers (`"Background 03"` → `background-03`),
failing loudly if two keys normalise to the same variable name.

## Layout

```
tokens.json                  design tokens - the source of truth
scripts/generate-tokens.mjs  token compiler
src/app/                     App Router routes
  layout.tsx                 root shell
  globals.css                the only global stylesheet
  tokens.generated.css       GENERATED - do not edit
src/components/ui/           shared primitives
src/components/layout/       cross-page chrome (nav, footer)
src/components/sections/     page sections
src/lib/                     non-visual helpers and constants
public/                      static assets
```

Path alias: `@/*` → `src/*`.

## Conventions

- TypeScript strict. No `any`, no `@ts-ignore`.
- Prettier is authoritative for formatting; `prettier-plugin-tailwindcss` sorts class
  lists, so class order is decided by the tool, not by hand.
- `src/app/layout.tsx` and `src/app/globals.css` are shared surfaces. Changing either
  affects every route.
- Fonts are not yet wired. They are loaded in `src/app/layout.tsx` via `next/font` once
  the typeface set is settled, and exposed to `tokens.json` as CSS variables.
