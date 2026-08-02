/**
 * The section's only public surface.
 *
 * `WrappedBand` and `WrappedControls` are deliberately NOT re-exported.
 * `WrappedControls` is a `"use client"` module, and a barrel that hands both
 * out invites a client component to import it and drag the server half of the
 * section into the browser bundle. One route consumes this directory and it
 * only ever needs `AzzaWrapped`.
 */
export { AzzaWrapped } from "./AzzaWrapped";
export { default } from "./AzzaWrapped";
