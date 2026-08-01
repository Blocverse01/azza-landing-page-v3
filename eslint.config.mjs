import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/app/tokens.generated.css",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Build tooling runs in Node, not the browser, and is plain ESM rather than
  // part of the Next app graph.
  {
    files: ["scripts/**/*.mjs", "*.config.mjs", "*.config.ts"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  // Must stay last: turns off every rule that would fight Prettier.
  prettier,
];

export default eslintConfig;
