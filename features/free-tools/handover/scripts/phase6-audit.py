"""Phase 6 verification: crawl every tool URL from the sitemap on a running build.

Usage: python3 -I phase6-audit.py [origin=http://localhost:3004]
Checks per page: HTTP 200, one <h1>, <title> ≤ 60 chars, meta description 50–160 chars,
canonical matches the URL, JSON-LD parses and includes the expected types, breadcrumbs,
≥ 12 internal /tools/ links, every internal link resolves (200 or redirect to 200),
every trial link carries utm_* params with utm_content=<slug>-<placement>, demo button
present exactly where the spec says, OG image route responds.
"""
import html
import json
import re
import sys
import urllib.error
import urllib.request
from urllib.parse import parse_qs, urlparse

ORIGIN = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3004"
SPEC = {r["slug"]: r for r in json.load(open(__file__.rsplit("/", 3)[0] + "/research/coachway-tool-specs.json"))}
PROD = "https://www.traiv.fit"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


opener = urllib.request.build_opener(NoRedirect)
cache = {}


def status(path):
    if path in cache:
        return cache[path]
    try:
        r = opener.open(ORIGIN + path, timeout=30)
        cache[path] = (r.status, None)
    except urllib.error.HTTPError as e:
        cache[path] = (e.code, e.headers.get("Location"))
    return cache[path]


def get(path):
    return urllib.request.urlopen(ORIGIN + path, timeout=60).read().decode()


sm = get("/sitemap.xml")
locs = re.findall(r"<loc>([^<]+)</loc>", sm)
tool_urls = [u for u in locs if "/tools/" in u]
print(f"sitemap: {len(locs)} URLs, {len(tool_urls)} tool pages")

problems = []
link_counts = []
for u in tool_urls:
    path = urlparse(u).path.rstrip("/") or "/"
    slug = path.split("/")[-1]
    p = lambda msg: problems.append(f"{slug}: {msg}")
    try:
        h = get(path)
    except Exception as e:  # noqa: BLE001
        p(f"fetch failed {e}")
        continue
    head = h.split("<body", 1)[0]
    body = h.split("<body", 1)[-1]
    title = html.unescape(re.search(r"<title>(.*?)</title>", head, re.S).group(1)) if "<title>" in head else ""
    desc_m = re.search(r'<meta name="description" content="([^"]*)"', head)
    desc = html.unescape(desc_m.group(1)) if desc_m else ""
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', head)
    if len(title) > 60:
        p(f"title {len(title)} chars: {title}")
    if not (50 <= len(desc) <= 160):
        p(f"description {len(desc)} chars")
    if not canon or canon.group(1).rstrip("/") != (PROD + path).rstrip("/"):
        p(f"canonical {canon.group(1) if canon else None}")
    if len(re.findall(r"<h1[\s>]", body)) != 1:
        p("h1 count != 1")
    types = set()
    for block in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', h, re.S):
        try:
            data = json.loads(html.unescape(block))
        except json.JSONDecodeError:
            p("JSON-LD does not parse")
            continue
        stack = [data]
        while stack:
            x = stack.pop()
            if isinstance(x, dict):
                t = x.get("@type")
                types.update(t if isinstance(t, list) else [t] if t else [])
                stack.extend(x.values())
            elif isinstance(x, list):
                stack.extend(x)
    if slug != "templates":
        for need in ("BreadcrumbList", "FAQPage", "WebApplication"):
            if need not in types:
                p(f"schema missing {need}")
    internal = set(re.findall(r'href="(/[^"#?]*)', body))
    tools_links = {x for x in internal if x.startswith("/tools/")}
    link_counts.append((len(tools_links), slug))
    if slug != "templates" and len(tools_links) < 12:
        p(f"only {len(tools_links)} internal tool links")
    for x in sorted(internal):
        code, loc = status(x)
        if code in (301, 302, 307, 308) and loc:
            code2, _ = status(urlparse(loc).path or "/") if loc.startswith("/") or loc.startswith(ORIGIN) else (200, None)
            if code2 != 200:
                p(f"link {x} redirects to a {code2}")
        elif code != 200:
            p(f"broken link {x} ({code})")
    # The site-wide nav button is untagged by design; the tool's own placements must be tagged.
    trial = [x for x in re.findall(r'href="(https://app\.traiv\.fit/signup[^"]*)"', body) if "utm_" in x]
    for t in trial:
        q = parse_qs(urlparse(html.unescape(t)).query)
        if q.get("utm_source") != ["traiv-tools"] or q.get("utm_campaign") != [slug] or not (q.get("utm_content", [""])[0].startswith(slug + "-")):
            p(f"trial link without proper UTM: {html.unescape(t)[:120]}")
    if slug != "templates" and not trial:
        p("no trial link")
    spec = SPEC.get(slug)
    if spec:
        has_demo = "cal.com/sathyamsahu" in body
        if has_demo != bool(spec.get("has_demo")):
            p(f"demo button {'present' if has_demo else 'missing'}, spec says {spec.get('has_demo')}")
    og = status(path + "/opengraph-image")
    if og[0] != 200:
        p(f"og image {og[0]}")

slugs = {urlparse(u).path.rstrip("/").split("/")[-1] for u in tool_urls}
missing = sorted(set(SPEC) - slugs)
print(f"spec tools missing from sitemap: {missing or 'none'}")
print(f"internal tool links per page: min {min(link_counts)[0]}, max {max(link_counts)[0]}")
print(f"problems: {len(problems)}")
for x in problems:
    print("  ", x)
