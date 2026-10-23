import { Providers } from "@/app/providers";
import "@traiv/ui/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

/**
 * Self-hosted by Next at build time, so there is no request to Google at runtime and no
 * swap flash. `globals.css` reads it as `--font-inter` at the front of the sans stack.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Traiv",
  description: "Run your coaching practice in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `overscroll-none` stops the rubber band at the top and bottom of the document.
    // This is an application, not a page: pulling the whole thing down to reveal the
    // body behind it reads as the layout coming loose, and on a phone it also disables
    // pull-to-refresh, which would throw away unsaved work in a form. The marketing
    // site deliberately does not do this — there, both behaviours are what a reader
    // expects from a web page.
    <html lang="en" className={`${inter.variable} overscroll-none`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
