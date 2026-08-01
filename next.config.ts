import path from "node:path";

import type { NextConfig } from "next";

/*
 * `root` / `outputFileTracingRoot` are pinned to this directory on purpose.
 *
 * This project lives under a parent tree that contains other lockfiles, so
 * Next's workspace-root inference walks up and picks the wrong directory,
 * warning on every build. Pinning both silences that and guarantees module
 * resolution and build tracing stay scoped to this project.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
