import "@traiv/ui/styles/globals.css";
import "./marketing.css";
import { Toaster } from "@traiv/ui/components/sonner";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { StructuredData } from "@/components/structured-data";
import { SITE } from "@/content/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Headlines only.
 *
 * Inter carries the product and carries it well, but Inter alone is the single most
 * common tell of a generated page — it is the face you pick when you have not picked one.
 * Bricolage is the same grotesque register, so the site still reads as the same product,
 * with enough character in the terminals and the tighter widths that a headline is not
 * just body copy at 48px.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${bricolage.variable}`}>
      <body className="bg-canvas">
        <Nav />
        {/* The capsule header floats over the page, so content starts below it. */}
        <main className="pt-20 sm:pt-24">{children}</main>
        <Footer />
        <Toaster theme="light" />
        <StructuredData />
        {/* Our own, cookieless. See src/lib/analytics.ts for why there is no banner. */}
        <Analytics />
      </body>
    </html>
  );
}
