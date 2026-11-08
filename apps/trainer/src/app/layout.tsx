import { Providers } from "@/app/providers";
import "@traiv/ui/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";

/**
 * Self-hosted by Next at build time, so there is no request to Google at runtime and no
 * swap flash. `globals.css` reads it as `--font-app-sans` at the front of the sans stack.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-app-sans",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Traiv",
  description: "Run your coaching practice in one place.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Traiv Coach" },
  // Explicit here, same reasoning as the client app's layout: an explicit `icons`
  // replaces Next's auto-detected `icon.svg` entirely rather than merging with it, so
  // both keys have to be set or the plain favicon link never gets emitted at all.
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2457b8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `overscroll-none` stops the rubber band at the top and bottom of the document.
    // This is an application, not a page: pulling the whole thing down to reveal the
    // body behind it reads as the layout coming loose, and on a phone it also disables
    // pull-to-refresh, which would throw away unsaved work in a form. The marketing
    // site deliberately does not do this — there, both behaviours are what a reader
    // expects from a web page.
    <html lang="en" className={`${dmSans.variable} overscroll-none`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
