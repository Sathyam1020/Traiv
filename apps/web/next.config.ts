import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/yuhonas/free-exercise-db/main/exercises/**",
      },
      { protocol: "https", hostname: "r2-cdn.coachway.io", pathname: "/assets/recipes/**" },
      { protocol: "https", hostname: "r2-cdn.coachway.io", pathname: "/uploads/**" },
    ],
  },
  /**
   * Baseline hardening for a static marketing site. No CSP yet: Next's inline bootstrap
   * scripts and the JSON-LD blocks need nonces or hashes, which is its own piece of work.
   * Nothing here embeds the site in a frame or asks for camera, microphone or location.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
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
      { source: "/features/clients", destination: "/features/check-ins", permanent: true },
      { source: "/features/progress", destination: "/features/check-ins", permanent: true },
      { source: "/features/branding", destination: "/features/client-app", permanent: true },
      { source: "/features/inbox", destination: "/features/messaging", permanent: true },
      { source: "/features/whatsapp", destination: "/features/messaging", permanent: true },
      { source: "/features/automations", destination: "/features", permanent: true },
      { source: "/guides/templates", destination: "/tools/templates", permanent: true },
      { source: "/guides/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/guides", destination: "/blog", permanent: true },
    ];
  },
};

export default config;
