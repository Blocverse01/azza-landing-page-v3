import { SITE } from "@/lib/site";

/*
 * Scaffold placeholder. Wave 2D replaces this with the real landing page.
 *
 * It exists to prove three seams work end to end, and nothing else:
 *   - the `@/*` path alias resolves         -> the SITE import above
 *   - Tailwind utilities compile and apply  -> `bg-background-03`, a utility
 *     Tailwind generates from the --color-background-03 token
 *   - tokens reach CSS as custom properties -> `var(--color-green)` below
 */
export default function Home() {
  return (
    <main className="bg-background-03 flex min-h-screen items-center justify-center">
      <div
        className="rounded px-6 py-4 font-mono text-sm"
        style={{ backgroundColor: "var(--color-green)" }}
      >
        {SITE.name} scaffold ready
      </div>
    </main>
  );
}
