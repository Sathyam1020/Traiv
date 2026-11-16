"""Shared base for Phase 5 (coaching business) copy. Original prose, written for Traiv (ADR 0036)."""
import json
import os
import sys

sys.path.insert(0, sys.argv[1] + "/scripts")
import copygen  # noqa: E402

OUT = sys.argv[2]
_SPEC = {r["slug"]: r for r in json.load(open(os.path.join(sys.argv[1], "..", "research", "coachway-tool-specs.json")))}


def gate(slug):
    return _SPEC[slug]["words"] - 150


def faqs(slug):
    return _SPEC[slug]["faq_count"]


COACHES = [
    "Run the numbers with your own figures, not industry averages. Pull the last three months from your payment records and client list: how many clients started, how many left, what each paid and what you spent to find them. Real figures make the result specific to your business, and they often show that one lever matters far more than the rest.",
    "Then change one thing and measure it. Pick the lever the calculator says is worth most, set a target for the next month or quarter, and re-run the numbers at the end. A business improves the same way a client does: one deliberate change at a time, checked against what actually happened.",
]


def s(title, *blocks):
    return (title, list(blocks))


def base(slug, *, title, h1, description, intro, q, a, sections, faq, nxt,
         pitch_key="check-ins",
         pitch_h="Keep clients coming back each week",
         pitch="In Traiv, clients get their plans, check-ins and messages in an app under your name, and you see who has gone quiet before they cancel. Retention is where most of these numbers are won or lost.",
         keep=None, close_h="Run your coaching business on one platform", eyebrow="Free tool · For your coaching business", **extra):
    assert len(faq) == faqs(slug), (slug, len(faq), faqs(slug))
    d = dict(
        title=title, description=description, eyebrow=eyebrow, h1=h1, intro=intro,
        short_q=q, short_a=a if isinstance(a, list) else [a], sections=sections,
        coaches_h="Put the result to work", coaches=COACHES, pitch_key=pitch_key, pitch_h=pitch_h,
        pitch=pitch, next=list(nxt), next_pitch="These tools work best together: run them on the same month of real numbers.",
        faq=faq, keep=keep or [("Check-ins in Traiv", "/features/check-ins"), ("All free tools", "/tools")],
        close_h=close_h,
    )
    d.update(extra)
    return d


def emit(data, extra=None):
    ok = True
    for slug, d in data.items():
        if extra and slug in extra:
            d = dict(d, sections=d["sections"] + extra[slug])
        ok &= copygen.write_checked(f"{OUT}/{slug}.tsx", d, gate(slug))
    return ok
