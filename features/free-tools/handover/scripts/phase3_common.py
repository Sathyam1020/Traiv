"""Shared base for Phase 3 (body composition) copy. Original prose, written for Traiv (ADR 0036)."""
import sys

sys.path.insert(0, sys.argv[1] + "/scripts")
import copygen  # noqa: E402

OUT = sys.argv[2]

TARGET = {
    "bmi-calculator": 2102,
    "body-fat-calculator": 2251,
    "body-recomposition-calculator": 2673,
    "ffmi-calculator": 2438,
    "ideal-weight-calculator": 2119,
    "lean-body-mass-calculator": 2580,
    "muscle-mass-calculator": 3783,
    "navy-body-fat-calculator": 3406,
    "waist-to-height-ratio-calculator": 2152,
    "waist-to-hip-ratio-calculator": 2123,
    "weight-loss-percentage-calculator": 3554,
}

FAQ_COUNT = {
    "bmi-calculator": 6,
    "body-fat-calculator": 6,
    "body-recomposition-calculator": 6,
    "ffmi-calculator": 7,
    "ideal-weight-calculator": 6,
    "lean-body-mass-calculator": 7,
    "muscle-mass-calculator": 10,
    "navy-body-fat-calculator": 9,
    "waist-to-height-ratio-calculator": 6,
    "waist-to-hip-ratio-calculator": 6,
    "weight-loss-percentage-calculator": 8,
}

COACHES = [
    "A single body measurement tells you where a client is today. A series of them, taken the same way, tells you which direction they are moving. Agree on a measuring routine at the first check-in: same time of day, same tape or scale, same landmarks. Then repeat it every two to four weeks rather than every few days, so normal day-to-day swings in water and food volume don't crowd out the real trend.",
    "Talk about the number with care. Many clients carry years of history with the scale and with words like overweight. Explain what the measure can and cannot see, pair it with something the client can feel, such as energy, strength or how clothes fit, and keep the conversation on the next useful action rather than the label.",
]


def s(title, *blocks):
    return (title, list(blocks))


def base(slug, *, title, h1, description, intro, q, a, sections, faq, pitch_key="check-ins",
         pitch_h="Keep every measurement in one place",
         pitch="In Traiv, clients log weight, measurements and progress photos in their check-ins, and you see the trend beside their plan. No spreadsheets to chase, and no numbers lost in chat.",
         nxt=(), keep=None, close_h="Track every client's progress under your name", **extra):
    assert len(faq) == FAQ_COUNT[slug], (slug, len(faq))
    d = dict(
        title=title, description=description, eyebrow="Free tool · Body composition", h1=h1, intro=intro,
        short_q=q, short_a=a if isinstance(a, list) else [a], sections=sections, coaches_h="Use the result with your clients",
        coaches=COACHES, pitch_key=pitch_key, pitch_h=pitch_h, pitch=pitch, next=list(nxt),
        next_pitch="Use these tools to build a fuller picture, then review it with your coach.", faq=faq,
        keep=keep or [("Check-ins in Traiv", "/features/check-ins"), ("All free tools", "/tools")], close_h=close_h,
    )
    d.update(extra)
    return d


def emit(data):
    ok = True
    for slug, d in data.items():
        ok &= copygen.write_checked(f"{OUT}/{slug}.tsx", d, TARGET[slug])
    return ok
