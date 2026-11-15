import { JsonLd } from "@/components/seo-schema";
import { SITE, TOOL_AUTHOR } from "@/content/site";
import type { LiveTool } from "@/content/tools/types";

/**
 * The structured data the research found on every tool page, minus BreadcrumbList,
 * which `Breadcrumbs` already emits beside the visible trail.
 *
 * - WebApplication: the tool itself, free.
 * - Article: the long-form explanation. `author` appears only once TOOL_AUTHOR is set,
 *   because a made-up or organisational author on an Article is worse than none.
 * - FAQPage: the FAQ exactly as rendered; schema text must match visible text.
 * - WebPage + speakable: points answer engines at the short answer.
 */
export function ToolSchema({ tool, updated }: { tool: LiveTool; updated: string }) {
  const url = `${SITE.url}/tools/${tool.slug}`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          url,
          description: tool.copy.description,
          applicationCategory:
            tool.group === "business" ? "BusinessApplication" : "HealthApplication",
          operatingSystem: "Any",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: tool.copy.h1,
          description: tool.copy.description,
          mainEntityOfPage: url,
          dateModified: updated,
          image: `${url}/opengraph-image`,
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          ...(TOOL_AUTHOR
            ? { author: { "@type": "Person", name: TOOL_AUTHOR.name, url: TOOL_AUTHOR.url } }
            : {}),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.copy.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          url,
          name: tool.copy.title,
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["#short-answer"] },
        }}
      />
    </>
  );
}
