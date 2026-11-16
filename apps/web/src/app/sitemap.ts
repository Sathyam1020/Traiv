import type { MetadataRoute } from "next";
import { COMPETITORS, comparisonIsIndexable } from "@/content/competitors";
import { FEATURES, featureIsIndexable } from "@/content/features";
import { SITE } from "@/content/site";
import { LIVE_TOOLS, STANDING_LEGACY, TOOLS_UPDATED } from "@/content/tools/registry";
import { getPosts } from "@/lib/api";
import { isPreview } from "@/lib/seo";

/**
 * Every page, derived from the same content files the pages are.
 *
 * Built from the data rather than typed out, so a feature added to `features.ts` is in the
 * sitemap the same minute. A hand-maintained sitemap is wrong within a week.
 *
 * The legal drafts are deliberately absent — they carry `robots: noindex` until they have
 * been through a lawyer, and a sitemap entry for a noindex page is a contradiction.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreview) return [];
  // No `priority` or `changefreq`: Google ignores both. `lastModified` only where the date
  // is real (a tool's copy review, a post's publication); a guessed date teaches crawlers to
  // ignore the field everywhere.
  const at = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    ...(lastModified ? { lastModified } : {}),
  });

  // Posts live in the database, so the sitemap has to ask for them rather than read a
  // folder. `getPosts` already swallows a failure and returns nothing, which is right
  // here too — a sitemap missing the blog beats a build that fails.
  const posts = await getPosts();

  const entries = [
    at("/"),
    at("/pricing"),
    at("/gyms"),
    at("/features"),
    ...FEATURES.filter(featureIsIndexable).map((f) => at(`/features/${f.slug}`)),
    at("/compare"),
    ...COMPETITORS.filter(comparisonIsIndexable).map((c) => at(`/compare/${c.slug}`)),
    at("/tools", TOOLS_UPDATED),
    // Live tools from the registry, plus the older tool pages not yet replaced by one.
    ...LIVE_TOOLS.map((t) => at(`/tools/${t.slug}`, TOOLS_UPDATED)),
    ...STANDING_LEGACY.map((t) => at(`/tools/${t.slug}`)),
    // Same condition as the blog index's noindex: listing a noindex page is a contradiction.
    ...(posts.length > 0 ? [at("/blog")] : []),
    ...posts.map((p) => at(`/blog/${p.slug}`, p.publishedAt)),
    at("/coaches"),
    at("/about"),
    at("/partnership"),
    at("/affiliate"),
  ];
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
