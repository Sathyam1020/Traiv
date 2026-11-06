import Link from "next/link";
import { SITE } from "@/content/site";
import { type JsonLdObject, serializeJsonLd } from "@/lib/seo";

export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="traiv-content-wrap py-4 text-caption text-fg-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {trail.map((item, i) => (
            <li key={item.path}>
              {i > 0 ? <span aria-hidden="true"> / </span> : null}
              {i === trail.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link
                  className="inline-flex min-h-11 min-w-11 items-center underline underline-offset-4"
                  href={item.path}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: new URL(item.path, SITE.url).href,
          })),
        }}
      />
    </>
  );
}
