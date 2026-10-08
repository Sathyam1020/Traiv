import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Both ship TypeScript source rather than a build step, so Next compiles them.
  transpilePackages: ["@traiv/ui", "@traiv/nutrition"],

  /**
   * `/guides` and `/blog` were two names for one thing — a reader could not tell which
   * held what, and the author had to decide every time they wrote something. The guides
   * are now ordinary posts in the database; these keep every link that ever pointed at
   * the old section working, permanently, which is the only honest way to delete a URL.
   */
  async redirects() {
    return [
      { source: "/guides/templates", destination: "/tools/templates", permanent: true },
      { source: "/guides/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/guides", destination: "/blog", permanent: true },
    ];
  },
};

export default config;
