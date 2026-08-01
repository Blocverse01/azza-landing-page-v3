#!/usr/bin/env node
/**
 * Design-token pipeline.
 *
 * Reads  : <project>/tokens.json
 * Writes : <project>/src/app/tokens.generated.css
 *
 * The generated stylesheet is a single `@theme` block. Tailwind v4 turns every
 * declaration in `@theme` into a real CSS custom property on `:root`, so each
 * token is reachable two ways:
 *
 *   1. as a Tailwind utility, when the top-level group is a Tailwind v4 theme
 *      namespace  -  `color.green`  ->  `--color-green`  ->  `bg-green`
 *   2. as a raw custom property, always  -  `var(--color-green)`
 *
 * Shape of tokens.json: top-level keys are Tailwind v4 theme namespaces
 * (color, font, text, spacing, radius, shadow, breakpoint, ease, ...). Nested
 * objects are flattened with `-`. Both plain values and the W3C design-token
 * `{ "$value": ... }` wrapper are accepted.
 *
 *   { "color": { "brand": { "500": "#D3FEB6" } } }  ->  --color-brand-500: #D3FEB6;
 *
 * Contract: this script never falls back to defaults. A missing or malformed
 * token file exits non-zero with a message naming the exact offending path, so
 * a bad token file cannot reach the rest of the build unnoticed.
 *
 * Idempotent: the output is a pure function of the input, carries no timestamp,
 * and is only written when the bytes actually change.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, "..");
const INPUT = resolve(PROJECT_ROOT, "tokens.json");
const OUTPUT = resolve(PROJECT_ROOT, "src/app/tokens.generated.css");

const rel = (p) => relative(PROJECT_ROOT, p).split("\\").join("/");

/** Abort with a message that says what is wrong and where. */
function fail(message, detail) {
  console.error(`\n[tokens] FAILED - ${message}`);
  if (detail) console.error(`[tokens] ${detail}`);
  console.error(`[tokens] input: ${rel(INPUT)}\n`);
  process.exit(1);
}

const isPlainObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Normalise one path segment into a CSS-identifier-safe fragment.
 * "Background color" -> "background-color", "Background 03" -> "background-03".
 */
function normaliseSegment(segment) {
  return String(segment)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Unwrap a W3C design-token leaf: { "$value": "#fff", "$type": "color" }.
 * Returns the primitive value, or undefined if this is not a wrapped leaf.
 */
function unwrapLeaf(node) {
  for (const key of ["$value", "value"]) {
    if (key in node) {
      const inner = node[key];
      if (typeof inner === "string" || typeof inner === "number") return inner;
    }
  }
  return undefined;
}

// ---------------------------------------------------------------- read + parse

if (!existsSync(INPUT)) {
  fail(
    `token file not found at ${rel(INPUT)}`,
    "This file is the single source of truth for the design system and has no default. " +
      "Restore it (Phase 1 `color-token-expert` produces it) and re-run `pnpm tokens`.",
  );
}

let raw;
try {
  raw = readFileSync(INPUT, "utf8");
} catch (error) {
  fail(`token file could not be read`, error.message);
}

if (raw.trim() === "") {
  fail("token file is empty", 'Expected a JSON object of token groups, e.g. { "color": { ... } }.');
}

let tokens;
try {
  tokens = JSON.parse(raw);
} catch (error) {
  fail("token file is not valid JSON", error.message);
}

if (!isPlainObject(tokens)) {
  fail(
    "token file must contain a JSON object at the root",
    `Found ${Array.isArray(tokens) ? "an array" : typeof tokens}. Expected { "color": { ... }, "spacing": { ... } }.`,
  );
}

const groups = Object.keys(tokens).filter((k) => !k.startsWith("$"));
if (groups.length === 0) {
  fail(
    "token file contains no token groups",
    'Expected at least one top-level group, e.g. { "color": { "green": "#D3FEB6" } }.',
  );
}

// ------------------------------------------------------------------- flatten

/** resolved css variable name -> { value, sourcePath } */
const declarations = new Map();
const renames = [];

function walk(node, path) {
  const jsonPath = path.join(".");

  if (typeof node === "string" || typeof node === "number") {
    const value = String(node).trim();
    if (value === "") {
      fail(
        `token "${jsonPath}" has an empty value`,
        "Every token must resolve to a usable CSS value.",
      );
    }

    const segments = path.map((segment, index) => {
      const normalised = normaliseSegment(segment);
      if (normalised === "") {
        fail(
          `token "${jsonPath}" produces an empty CSS identifier`,
          `Path segment ${index + 1} ("${segment}") contains no alphanumeric characters.`,
        );
      }
      if (normalised !== String(segment)) renames.push([segment, normalised]);
      return normalised;
    });

    const name = `--${segments.join("-")}`;

    const existing = declarations.get(name);
    if (existing && existing.sourcePath !== jsonPath) {
      fail(
        `two tokens collide on the CSS variable "${name}"`,
        `"${existing.sourcePath}" and "${jsonPath}" normalise to the same name. Rename one of them.`,
      );
    }

    declarations.set(name, { value, sourcePath: jsonPath });
    return;
  }

  if (isPlainObject(node)) {
    const unwrapped = unwrapLeaf(node);
    if (unwrapped !== undefined) {
      walk(unwrapped, path);
      return;
    }

    const childKeys = Object.keys(node).filter((k) => !k.startsWith("$"));
    if (childKeys.length === 0) {
      fail(
        `token group "${jsonPath}" is empty`,
        "Remove the empty group or give it at least one token.",
      );
    }
    for (const key of childKeys) walk(node[key], [...path, key]);
    return;
  }

  fail(
    `token "${jsonPath}" has an unsupported value type`,
    `Found ${node === null ? "null" : Array.isArray(node) ? "an array" : typeof node}. ` +
      "Tokens must be a string, a number, or an object of nested tokens.",
  );
}

for (const group of groups) walk(tokens[group], [group]);

if (declarations.size === 0) {
  fail("token file produced no CSS custom properties", "Every group resolved to nothing.");
}

// -------------------------------------------------------------------- emit

const body = [...declarations.entries()]
  .map(([name, { value }]) => `  ${name}: ${value};`)
  .join("\n");

const css = `/*
 * GENERATED FILE - DO NOT EDIT.
 *
 * Produced by scripts/generate-tokens.mjs from tokens.json.
 * Edit tokens.json and run \`pnpm tokens\` instead; any manual change here is
 * overwritten on the next dev or build.
 *
 * Every declaration below is available as \`var(<name>)\` anywhere in the app,
 * and as a Tailwind utility where the group is a Tailwind v4 theme namespace.
 *
 * \`static\` is deliberate. Without it Tailwind emits only the theme variables
 * it can see referenced in source, so a token used solely through an inline
 * style or a hand-written stylesheet would silently resolve to nothing.
 * \`static\` emits every token to :root unconditionally.
 */
@theme static {
${body}
}
`;

mkdirSync(dirname(OUTPUT), { recursive: true });

const unchanged = existsSync(OUTPUT) && readFileSync(OUTPUT, "utf8") === css;
if (!unchanged) writeFileSync(OUTPUT, css, "utf8");

const uniqueRenames = [...new Set(renames.map(([from, to]) => `${from} -> ${to}`))];
if (uniqueRenames.length > 0) {
  console.log(`[tokens] normalised ${uniqueRenames.length} key(s): ${uniqueRenames.join(", ")}`);
}
console.log(
  `[tokens] ${declarations.size} custom propert${declarations.size === 1 ? "y" : "ies"} from ` +
    `${groups.length} group(s) [${groups.join(", ")}] -> ${rel(OUTPUT)}${unchanged ? " (unchanged)" : ""}`,
);
