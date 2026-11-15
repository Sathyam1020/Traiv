import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/content/site";
import { LIVE_TOOLS, type LiveSlug, liveTool } from "@/content/tools/registry";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "../_components/tool-page";
import { WIDGETS } from "./widgets";

/** Live tools only. Anything else under /tools/ is a 404, never an empty template. */
export const dynamicParams = false;

/** Shown as "Updated" on each page and as Article.dateModified. Bump with each copy review. */
const UPDATED = "2026-11-15";

export function generateStaticParams() {
  return LIVE_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = liveTool(slug);
  if (!tool) return {};
  return pageMetadata({
    title: { absolute: tool.copy.title },
    description: tool.copy.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    // The per-tool image rendered by ./opengraph-image.tsx, set explicitly because
    // pageMetadata otherwise fills in the site-wide card.
    openGraph: {
      images: [
        {
          url: `${SITE.url}/tools/${tool.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: { images: [`${SITE.url}/tools/${tool.slug}/opengraph-image`] },
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = liveTool(slug);
  if (!tool) notFound();
  return <ToolPage tool={tool} Widget={WIDGETS[tool.slug as LiveSlug]} updated={UPDATED} />;
}
