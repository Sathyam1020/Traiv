import type { MetadataRoute } from "next";
import { COMPETITORS } from "@/content/competitors";
import { FEATURES } from "@/content/features";
import { GUIDES } from "@/content/guides";
import { SITE } from "@/content/site";
import { TOOLS } from "@/content/tools";
import { getPosts } from "@/lib/api";

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
  const at = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    priority,
  });

  // Posts live in the database, so the sitemap has to ask for them rather than read a
  // folder. `getPosts` already swallows a failure and returns nothing, which is right
  // here too — a sitemap missing the blog beats a build that fails.
  const posts = await getPosts();

  return [
    at("/", 1),
    at("/pricing", 0.9),
    at("/features", 0.8),
    ...FEATURES.map((f) => at(`/features/${f.slug}`, 0.7)),
    at("/compare", 0.8),
    ...COMPETITORS.map((c) => at(`/compare/${c.slug}`, 0.8)),
    at("/tools", 0.6),
    // Tool hrefs include the two guides routes, which are listed separately below.
    ...TOOLS.filter((t) => t.href.startsWith("/tools/")).map((t) => at(t.href, 0.7)),
    at("/guides", 0.6),
    ...GUIDES.map((g) => at(`/guides/${g.slug}`, 0.6)),
    at("/guides/templates", 0.6),
    at("/blog", 0.7),
    ...posts.map((p) => at(`/blog/${p.slug}`, 0.6)),
    at("/coaches", 0.7),
    at("/about", 0.5),
    at("/partnership", 0.4),
    at("/affiliate", 0.4),
    at("/demo", 0.5),
  ];
}
