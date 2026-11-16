"""Check generated Markdown and FAQ parity against a running web build."""
import concurrent.futures
from html import unescape
import json
import re
import sys
import urllib.error
import urllib.request

origin = sys.argv[1].rstrip("/")


def get(path):
    with urllib.request.urlopen(origin + path, timeout=30) as response:
        return response.headers, response.read().decode()


_, sitemap = get("/sitemap.xml")
paths = re.findall(r"<loc>https://www\.traiv\.fit(/tools/[^<]+)</loc>", sitemap)
assert len(set(paths)) == len(paths) == 110, len(paths)
assert all(not path.endswith(".md") for path in paths)
_, manifest = get("/llms.txt")
_, answers = get("/llms-full.txt")
_, robots = get("/robots.txt")
assert "/llms-full.txt" in manifest
assert "Content-Signal: search=yes, ai-input=yes, ai-train=yes" in robots


def words(value):
    return re.findall(r"\w+", unescape(value), flags=re.UNICODE)


def audit(path):
    headers, markdown = get(f"{path}.md")
    assert headers.get_content_type() == "text/markdown", path
    assert headers["X-Robots-Tag"] == "noindex", path
    assert headers["Link"] == f'<https://www.traiv.fit{path}>; rel="canonical"', path
    assert markdown.startswith("# "), path
    assert f"https://www.traiv.fit{path}.md" in answers, path
    _, html = get(path)
    if path.endswith("/templates"):
        assert all(title in markdown for title in ("Six client messages", "Weekly check-in", "Intake questions"))
        return 0
    assert f"https://www.traiv.fit{path}.md" in manifest, path
    short_html = html.split('<section id="short-answer"', 1)[1].split("</section>", 1)[0]
    short_html = short_html.split("</p>", 1)[1]
    expected = words(re.sub(r"<[^>]+>", " ", short_html))
    markdown_answer = markdown.split("## Frequently asked questions", 1)[0].split("\n## ", 1)[1]
    index_answer = answers.split(f"https://www.traiv.fit{path}.md)", 1)[1]
    index_answer = index_answer.split("### Frequently asked questions", 1)[0]
    assert words(markdown_answer) == expected, (path, "Markdown short answer")
    assert words(index_answer) == expected, (path, "Index short answer")
    schemas = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    faq = next(schema for raw in schemas if (schema := json.loads(raw)).get("@type") == "FAQPage")
    assert "## Frequently asked questions" in markdown, path
    for entry in faq["mainEntity"]:
        question = entry["name"]
        answer = entry["acceptedAnswer"]["text"]
        assert f"### {question}\n\n{answer}" in markdown, (path, question)
        assert f"#### {question}\n\n{answer}" in answers, (path, question)
    return len(faq["mainEntity"])


with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    questions = sum(pool.map(audit, paths))

try:
    get("/tools/nonexistent-phase8-test.md")
except urllib.error.HTTPError as error:
    assert error.code == 404, error.code
else:
    raise AssertionError("Unknown Markdown route returned successfully")

print(f"{len(paths)} Markdown routes checked, {questions} FAQ entries and all short answers match, unknown route returns 404.")
