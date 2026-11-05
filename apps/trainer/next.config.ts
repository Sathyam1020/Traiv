import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Workspace UI and catalog rules ship TypeScript source; Next compiles both.
  transpilePackages: ["@traiv/ui", "@traiv/exercises"],
};

export default config;
