import { SITE } from "@/content/site";
import { toolAnswers } from "@/content/tools/markdown";
import { LIVE_TOOLS } from "@/content/tools/registry";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${SITE.name} free tool answers`,
    `> ${SITE.description}`,
    ...LIVE_TOOLS.map((tool) =>
      [
        `## ${tool.name}`,
        `[Canonical tool](${SITE.url}/tools/${tool.slug}) · [Markdown](${SITE.url}/tools/${tool.slug}.md)`,
        toolAnswers(tool, 3),
      ].join("\n\n"),
    ),
    `## Templates for coaches\n\n[Templates in Markdown](${SITE.url}/tools/templates.md)`,
  ].join("\n\n");
  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
