import { Providers } from "@/app/providers";
import "@traiv/ui/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traiv",
  description: "Run your coaching practice in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
