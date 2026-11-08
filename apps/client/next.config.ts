import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // @traiv/ui ships TypeScript source rather than a build step, so Next compiles it.
  transpilePackages: ["@traiv/ui"],
  images: {
    remotePatterns: [
      // The exercise library's images (apps/api/src/library/exercise-db.ts) — same host
      // apps/web already allowlists for the same dataset.
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/yuhonas/free-exercise-db/main/exercises/**",
      },
      // Every uploaded image (recipes, ingredients, meal plan covers, vault previews,
      // photos) goes through Cloudinary (apps/api/src/features/studio/uploads.ts). The
      // cloud name is account-specific and only known at runtime via CLOUDINARY_CLOUD_NAME,
      // so the pathname can't be scoped tighter than the host without hardcoding it.
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Recipes imported from Coachway's own library (apps/api/src/library/coachway-import.ts)
      // keep their original image URL rather than being re-uploaded — the path shape isn't
      // ours to depend on, so only the host is scoped.
      { protocol: "https", hostname: "r2-cdn.coachway.io" },
    ],
  },
};

export default config;
