import { COMPETITORS, comparisonIsIndexable } from "@/content/competitors";
import { FEATURES, featureIsIndexable } from "@/content/features";
import { SITE, TIERS } from "@/content/site";
import { TOOLS } from "@/content/tools";

export const dynamic = "force-static";

/**
 * A plain-Markdown map of the site for answer engines (llmstxt.org).
 *
 * Built from the same content files and indexability predicates as the sitemap, so a page
 * that is noindex here is absent here too, and nothing in this file is written twice.
 */
export function GET() {
  const link = (name: string, path: string, note?: string) =>
    `- [${name}](${SITE.url}${path})${note ? `: ${note}` : ""}`;

  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "## Pricing",
    "",
    link("Pricing", "/pricing"),
    ...TIERS.map((t) => `- ${t.name}: ₹${t.monthly.toLocaleString("en-IN")}/month. ${t.limit}.`),
    "",
    "## Features",
    "",
    ...FEATURES.filter(featureIsIndexable).map((f) => link(f.name, `/features/${f.slug}`, f.blurb)),
    "",
    "## Comparisons",
    "",
    ...COMPETITORS.filter(comparisonIsIndexable).map((c) =>
      link(`Traiv vs ${c.name}`, `/compare/${c.slug}`),
    ),
    "",
    "## Free tools",
    "",
    ...TOOLS.filter((t) => t.href.startsWith("/tools/")).map((t) => link(t.name, t.href, t.blurb)),
    "",
    "## Optional",
    "",
    link("For gyms", "/gyms"),
    link("About", "/about"),
    link("Book a demo", "/demo"),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
