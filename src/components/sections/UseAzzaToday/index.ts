/**
 * Barrel for the `/` closing call to action (Figma `412:1233`).
 *
 * components.md S6 declares every section a default-exported component taking
 * `{}`. Both forms are re-exported so a route may import it either way:
 *
 *   import UseAzzaToday from "@/components/sections/UseAzzaToday";
 *   import { UseAzzaToday } from "@/components/sections/UseAzzaToday";
 */

export { default, default as UseAzzaToday } from "./UseAzzaToday";
