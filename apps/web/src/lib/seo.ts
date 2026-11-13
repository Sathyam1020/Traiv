import type { Metadata } from "next";
import { SITE } from "@/content/site";

export const isPreview = process.env.VERCEL_ENV === "preview";

/** Next metadata objects are shallow merged: set complete social fields per route. */
export function pageMetadata(input: Metadata): Metadata {
  const title =
    typeof input.title === "string"
      ? input.title
      : input.title && "absolute" in input.title
        ? input.title.absolute
        : SITE.tagline;
  const description = input.description ?? SITE.description;
  const canonical = input.alternates?.canonical;
  const url = typeof canonical === "string" ? new URL(canonical, SITE.url).href : SITE.url;
  return {
    ...input,
    ...(isPreview ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_IN",
      title,
      description,
      url,
      images: [
        { url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: "Traiv coaching software" },
      ],
      ...input.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE.url}/og.png`],
      ...input.twitter,
    },
  };
}

export type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];
export type JsonLdObject = { [key: string]: JsonLdValue | undefined };

/** Escaping '<' prevents CMS text from terminating an HTML script element. */
export function serializeJsonLd(data: JsonLdObject): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
