import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Traiv",
    short_name: "Traiv",
    description: "Your coaching, workouts and progress",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f5f6f4",
    theme_color: "#2457b8",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
