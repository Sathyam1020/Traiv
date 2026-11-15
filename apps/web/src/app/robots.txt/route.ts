import { SITE } from "@/content/site";
import { isPreview } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * A route handler rather than `robots.ts`, because Next's robots metadata has no field for
 * `Content-Signal` (contentsignals.org). Every crawler is allowed, AI assistants included,
 * for search, answers and training (ADR 0036, decision 8).
 */
export function GET() {
  const lines = [
    "User-agent: *",
    "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
    "Allow: /",
    ...(isPreview ? [] : ["", `Sitemap: ${SITE.url}/sitemap.xml`]),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
