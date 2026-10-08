import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Both ship TypeScript source rather than a build step, so Next compiles them.
  transpilePackages: ["@traiv/ui", "@traiv/nutrition"],
};

export default config;
