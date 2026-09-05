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

  /*
   * Blog covers come from the Hashnode CDN since 2026-09-05 (lib/hashnode.ts).
   * next/image refuses remote hosts it has not been told about, so the one
   * host the feed serves from is allow-listed here - and only that one.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
    ],
  },
};

export default nextConfig;
