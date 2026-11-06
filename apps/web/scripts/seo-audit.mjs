/** Rendered production SEO crawl. No framework mocks or additional dependencies. */
import assert from "node:assert/strict";

const base = process.env.WEB_ORIGIN ?? "http://localhost:3104";
const origin = process.env.SEO_CANONICAL_ORIGIN ?? "https://www.traiv.fit";
const get = (path) =>
  fetch(new URL(path, base), {
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
const sitemap = await (await get("/sitemap.xml")).text();
const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
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
assert.equal((await get("/missing-seo-audit-page")).status, 404);
const robots = await (await get("/robots.txt")).text();
assert(!robots.includes("Disallow: /legal/"), "Legal noindex must be crawlable");
assert(robots.includes(`${origin}/sitemap.xml`));
if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
}
console.log(`${seen.size} rendered routes checked; ${problems.length} failures.`);
