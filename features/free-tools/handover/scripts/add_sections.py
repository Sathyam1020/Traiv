"""Insert extra sections (original copy) at the end of a tool copy file's `sections` array.
Usage: python3 -I add_sections.py <copy.tsx> <sections.tsx-fragment>"""
import re
import sys

path, frag_path = sys.argv[1], sys.argv[2]
s = open(path).read()
frag = open(frag_path).read().rstrip() + "\n"
m = re.search(r"\n  \],\n  (prompt|forCoaches):", s)
if not m:
    raise SystemExit(f"anchor not found in {path}")
s = s[: m.start() + 1] + frag + s[m.start() + 1 :]
open(path, "w").write(s)
print("inserted into", path)
