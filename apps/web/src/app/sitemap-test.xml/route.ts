export const dynamic = "force-static";

/**
 * TEMPORARY test sitemap — delete this folder when the test is over.
 *
 * Deliberately separate from `sitemap.ts`: it is not listed in robots.txt and changes no
 * other SEO configuration. The URL is a literal on purpose, so the file says exactly what
 * was asked for whatever `NEXT_PUBLIC_SITE_URL` a build carries.
 */
const XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.traiv.fit/</loc>
  </url>
</urlset>
`;

export function GET() {
  return new Response(XML, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
