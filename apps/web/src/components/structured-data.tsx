import { SITE, TIERS } from "@/content/site";

/**
 * JSON-LD for the organisation and the product.
 *
 * Only facts that are also on the page. Marking up an aggregate rating we do not have, or
 * a review count of zero, is exactly the kind of thing Google penalises and is also just
 * untrue — so there is no `aggregateRating` here, and there will not be one until there
 * are real reviews to point at.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        publisher: { "@id": `${SITE.url}/#organization` },
        inLanguage: "en-IN",
      },
      {
        "@type": "SoftwareApplication",
        name: SITE.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: SITE.description,
        offers: TIERS.map((t) => ({
          "@type": "Offer",
          name: t.name,
          price: t.monthly,
          priceCurrency: "INR",
          description: `${t.limit}. ${t.summary}`,
          url: `${SITE.url}/pricing`,
        })),
      },
    ],
  };

  // JSON-LD has to be a raw script body. The content is our own constant object, never
  // anything a user supplied, so there is nothing here to escape.
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
