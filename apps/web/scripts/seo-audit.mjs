/** Rendered production SEO crawl. No framework mocks or additional dependencies. */
import assert from "node:assert/strict";

const base = process.env.WEB_ORIGIN ?? "http://localhost:3104";
const origin = process.env.SEO_CANONICAL_ORIGIN ?? "https://www.traiv.fit";
const get = (path, method = "GET") =>
  fetch(new URL(path, base), {
    method,
    redirect: "manual",
    headers: { "User-Agent": "Googlebot" },
    signal: AbortSignal.timeout(15000),
  });
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
const attr = (tag, key) => decode(tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1] ?? "");
const meta = (html, key) => {
  const tags = html.match(/<meta\b[^>]*>/g) ?? [];
  return attr(
    tags.find((t) => attr(t, "name") === key || attr(t, "property") === key) ?? "",
    "content",
  );
};
// Delivery before content: Search Console calls anything other than a plain XML document at
// this exact URL "Couldn't fetch" (a redirect, an HTML or challenge page, a failing HEAD).
for (const method of ["GET", "HEAD"]) {
  const r = await get("/sitemap.xml", method);
  assert.equal(r.status, 200, `sitemap ${method}: expected 200, no redirect`);
  assert.match(r.headers.get("content-type") ?? "", /^(application|text)\/xml\b/, "sitemap type");
}
const sitemap = await (await get("/sitemap.xml")).text();
// Google's sitemap rules (developers.google.com/search/docs/crawling-indexing/sitemaps):
// UTF-8, the sitemaps.org namespace, absolute URLs, at most 50,000 URLs and 50 MB.
assert(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), "sitemap declaration/BOM");
assert(
  sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'),
  "sitemap namespace",
);
assert(!/<html|<script/i.test(sitemap), "sitemap body is HTML, not XML");
assert(Buffer.byteLength(sitemap) <= 50 * 1024 * 1024, "sitemap over 50 MB");
const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
assert.equal((sitemap.match(/<url>/g) ?? []).length, entries.length, "<url> without one <loc>");
assert(entries.length <= 50_000, "sitemap over 50,000 URLs");
for (const url of entries) assert(url.length <= 2048, `sitemap URL too long: ${url}`);
assert.equal(entries.length, new Set(entries).size, "Duplicate sitemap URLs");
assert(entries.length > 10, "Missing sitemap routes");
const queue = entries.map((url) => {
  assert.equal(new URL(url).origin, origin);
  return new URL(url).pathname;
});
queue.push(
  "/legal/terms",
  "/legal/privacy",
  "/legal/refund",
  "/compare/trainerize",
  "/features/payments",
  "/features/messaging",
);
const seen = new Set(),
  titles = new Map(),
  descriptions = new Map();
const problems = [];
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  try {
    const response = await get(path);
    assert.equal(response.status, 200, `${path}: unexpected response`);
    const html = await response.text();
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert(title && title.length > 5, "Missing title");
    const description = meta(html, "description");
    assert(description, "Missing description");
    assert(!titles.has(title), `Duplicate title with ${titles.get(title)}`);
    assert(
      !descriptions.has(description),
      `Duplicate description with ${descriptions.get(description)}`,
    );
    titles.set(title, path);
    descriptions.set(description, path);
    const canonical = (html.match(/<link\b[^>]*>/g) ?? []).find(
      (t) => attr(t, "rel") === "canonical",
    );
    const expected = new URL(path, origin).href;
    assert.equal(new URL(attr(canonical ?? "", "href")).href, expected, "Wrong canonical");
    assert.equal(new URL(meta(html, "og:url")).href, expected, "Wrong social URL");
    assert(meta(html, "og:title") && meta(html, "twitter:title"), "Missing social title");
    assert(meta(html, "og:image") && meta(html, "twitter:image"), "Missing social image");
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, "Expected one h1");
    const noindex = meta(html, "robots").includes("noindex");
    const listed = entries.some((entry) => new URL(entry).href === expected);
    if (listed) assert(!noindex, "noindex URL in sitemap");
    else assert(noindex, "Indexable page missing from sitemap");
    for (const script of html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    )) {
      const data = JSON.parse(script[1]);
      assert.equal(data["@context"], "https://schema.org");
      assert(data["@graph"] || data["@type"], "Missing schema type");
    }
    for (const image of html.match(/<img\b[^>]*>/g) ?? [])
      assert(/\balt=/.test(image), "Image missing alt");
    for (const link of html.match(/<a\b[^>]*>/g) ?? []) {
      const href = attr(link, "href");
      if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/_next/")) continue;
      const target = new URL(href, base);
      if (!target.pathname.match(/\.[a-z0-9]+$/i)) queue.push(target.pathname);
    }
    console.log(`PASS ${path}${noindex ? " (noindex)" : ""}`);
  } catch (error) {
    problems.push(`${path}: ${error.message}`);
  }
}
for (const [from, to] of [
  ["/features/clients", "/features/check-ins"],
  ["/guides", "/blog"],
]) {
  const r = await get(from);
  assert([301, 308].includes(r.status));
  assert.equal(new URL(r.headers.get("location"), base).pathname, to);
}
// /demo is a temporary redirect to the booking page, never a page of its own, so it must
// not be linked internally (the crawl above would fail on it) or listed in the sitemap.
const demo = await get("/demo");
assert.equal(demo.status, 307, "/demo should redirect to the booking page");
assert(/^https:\/\//.test(demo.headers.get("location") ?? ""), "/demo must leave the site");
assert(!entries.some((entry) => new URL(entry).pathname === "/demo"), "/demo in sitemap");
for (const entry of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  const date = Date.parse(entry[1]);
  assert(!Number.isNaN(date), `Invalid lastmod ${entry[1]}`);
  assert(date <= Date.now() + 86_400_000, `Future lastmod ${entry[1]}`);
}
assert(!sitemap.includes("<priority>"), "priority is ignored by Google; leave it out");
assert.equal((await get("/missing-seo-audit-page")).status, 404);
const robotsResponse = await get("/robots.txt");
assert.equal(robotsResponse.status, 200, "robots.txt status");
assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/, "robots type");
const robots = await robotsResponse.text();
assert(!robots.includes("Disallow: /legal/"), "Legal noindex must be crawlable");
assert(robots.includes(`${origin}/sitemap.xml`));
if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
}
console.log(`${seen.size} rendered routes checked; ${problems.length} failures.`);
