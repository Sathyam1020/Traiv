import { SITE } from "@/content/site";
import { toolMarkdown } from "@/content/tools/markdown";
import { LIVE_TOOLS } from "@/content/tools/registry";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [...LIVE_TOOLS.map(({ slug }) => ({ slug })), { slug: "templates" }];
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = toolMarkdown(slug);
  if (!body) return new Response(null, { status: 404 });
  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      Link: `<${SITE.url}/tools/${slug}>; rel="canonical"`,
    },
  });
}
