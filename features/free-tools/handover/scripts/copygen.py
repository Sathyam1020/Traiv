"""Emit a ToolCopy .tsx file from plain Python data. The text is passed in; this only
handles the JSX shape. Usage: import copygen; copygen.write(path, data)."""
import html


def esc(t: str) -> str:
    # JSX text: escape braces and angle brackets; keep apostrophes as-is (JSX allows them).
    return html.escape(t, quote=False).replace("{", "&#123;").replace("}", "&#125;")


def js(t: str) -> str:
    return '"' + t.replace("\\", "\\\\").replace('"', '\\"') + '"'


def node(block, indent=10):
    """block: str (paragraph) | ("ul", [..]) | ("ol", [..]) | ("table", [header], [[row]...])."""
    pad = " " * indent
    if isinstance(block, str):
        return f"{pad}<p>{esc(block)}</p>"
    kind = block[0]
    if kind in ("ul", "ol"):
        items = "\n".join(f"{pad}  <li>{li(i)}</li>" for i in block[1])
        return f"{pad}<{kind}>\n{items}\n{pad}</{kind}>"
    if kind == "table":
        head = "".join(f'<th scope="col">{esc(h)}</th>' for h in block[1])
        rows = "\n".join(
            f"{pad}        <tr>" + "".join(f"<td>{esc(c)}</td>" for c in r) + "</tr>" for r in block[2]
        )
        return (
            f'{pad}<div className="table-scroll">\n{pad}  <table>\n{pad}    <thead>\n{pad}      <tr>{head}</tr>\n'
            f"{pad}    </thead>\n{pad}    <tbody>\n{rows}\n{pad}    </tbody>\n{pad}  </table>\n{pad}</div>"
        )
    raise ValueError(kind)


def li(item):
    # "**Bold.** rest" -> <strong>Bold.</strong> rest
    if item.startswith("**") and "**" in item[2:]:
        end = item.index("**", 2)
        return f"<strong>{esc(item[2:end])}</strong>{esc(item[end + 2:])}"
    return esc(item)


def frag(blocks, indent=8):
    pad = " " * indent
    inner = "\n".join(node(b, indent + 2) for b in blocks)
    return f"(\n{pad}<>\n{inner}\n{pad}</>\n{pad[:-2]})"


def write(path, d):
    secs = ",\n".join(
        f"    {{\n      heading: {js(h)},\n      body: {frag(b)},\n    }}" for h, b in d["sections"]
    )
    faq = ",\n".join(f"    {{ q: {js(q)}, a: {js(a)} }}" for q, a in d["faq"])
    links = lambda xs: ",\n".join(f"    {{ label: {js(l)}, href: {js(h)} }}" for l, h in xs)
    opt = ""
    if d.get("method"):
        opt += f"  method: {js(d['method'])},\n"
    if d.get("sources"):
        opt += "  sources: [\n" + ",\n".join(
            f"    {{ label: {js(l)}, href: {js(h)} }}" for l, h in d["sources"]
        ) + ",\n  ],\n"
    prompt = ""
    if d.get("prompt"):
        p = d["prompt"]
        prompt = (
            f"  prompt: {{\n    heading: {js(p['heading'])},\n    whenToUse: {js(p['when'])},\n"
            f"    pasteIn: {js(p['paste'])},\n    text: `{p['text'].replace('`', '')}`,\n  }},\n"
        )
    disclaimer = (
        f"  disclaimer: {frag([d['disclaimer']], 4)},\n" if d.get("disclaimer") else ""
    )
    out = f'''import type {{ ToolCopy }} from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {{
  title: {js(d["title"])},
  description: {js(d["description"])},
  eyebrow: {js(d["eyebrow"])},
  h1: {js(d["h1"])},
  intro: {frag([d["intro"]], 4)},
{opt}  shortAnswer: {{
    question: {js(d["short_q"])},
    answer: {frag(d["short_a"], 6)},
  }},
  sections: [
{secs},
  ],
{prompt}  forCoaches: {{
    heading: {js(d["coaches_h"])},
    body: {frag(d["coaches"], 6)},
  }},
  pitch: {{
    key: {js(d["pitch_key"])},
    heading: {js(d["pitch_h"])},
    body: {frag([d["pitch"]], 6)},
  }},
  next: [
{links(d["next"])},
  ],
  nextPitch: {js(d["next_pitch"])},
  faq: [
{faq},
  ],
{disclaimer}  keepGoing: [
{links(d["keep"])},
  ],
  close: {{
    heading: {js(d["close_h"])},
    body: {js(d.get("close", "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name."))},
  }},
}};
'''
    open(path, "w").write(out)


SKIP_KEYS = {"pitch_key", "eyebrow"}


def count(d):
    """Words a reader sees from this copy data (hrefs and keys excluded)."""
    n = 0

    def walk(v):
        nonlocal n
        if isinstance(v, str):
            if not (v.startswith("/") or v.startswith("http")):
                n += len(v.replace("**", "").split())
        elif isinstance(v, (list, tuple)):
            for x in v:
                walk(x)
        elif isinstance(v, dict):
            for k, x in v.items():
                if k not in SKIP_KEYS:
                    walk(x)

    walk(d)
    return n


def write_checked(path, d, target):
    n = count(d)
    status = "OK" if n >= target else "SHORT"
    print(f"{path.rsplit('/', 1)[-1]:44} words {n:5} target {target:5} {status}")
    if n < target:
        return False
    write(path, d)
    return True
