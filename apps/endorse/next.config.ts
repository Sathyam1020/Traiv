import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // @traiv/ui ships TypeScript source rather than a build step, so Next compiles it.
  transpilePackages: ["@traiv/ui"],
};

export default config;
