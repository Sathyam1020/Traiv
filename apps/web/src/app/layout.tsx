import "@traiv/ui/styles/globals.css";
import "./marketing.css";
import { Toaster } from "@traiv/ui/components/sonner";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { StructuredData } from "@/components/structured-data";
import { SITE } from "@/content/site";

const font = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app-sans",
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
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Traiv — connected coaching for trainers and gyms",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${font.variable} traiv-marketing`}>
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
