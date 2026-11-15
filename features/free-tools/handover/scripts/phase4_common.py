"""Shared base for Phase 4 (heart rate and cardio) copy. Original prose, written for Traiv (ADR 0036)."""
import sys

sys.path.insert(0, sys.argv[1] + "/scripts")
import copygen  # noqa: E402

OUT = sys.argv[2]

SPEC = {  # slug: (gate = researched words - 150, faq count)
    "beep-test-calculator": (4294, 10),
    "cooper-test-calculator": (3643, 9),
    "heart-rate-zone-calculator": (2186, 6),
    "interval-walking-calculator": (2125, 6),
    "max-heart-rate-calculator": (2995, 8),
    "race-time-predictor": (3012, 7),
    "rucking-calorie-calculator": (2130, 6),
    "running-pace-calculator": (2150, 6),
    "vo2-max-calculator": (3562, 12),
    "workout-timer": (2574, 4),
    "zone-2-heart-rate-calculator": (2256, 6),
}

COACHES = [
    "Cardio numbers are most useful when they turn into a session a client can actually follow. Translate the result into something concrete: a heart rate range for this week's easy runs, a pace for the long run, a retest date for the field test. Put it in the plan, not only in a message, so the client sees it at the moment they train.",
    "Then review what came back. Ask clients to log the session with the numbers that matter, such as average heart rate, distance, time or how hard it felt, and compare them with the target. A pattern across three or four sessions tells you far more than one workout, and it gives you an honest basis for changing the plan.",
]


def s(title, *blocks):
    return (title, list(blocks))


def base(slug, *, title, h1, description, intro, q, a, sections, faq, nxt,
         pitch_key="workouts",
         pitch_h="Put the numbers into the plan",
         pitch="In Traiv you write each client's cardio and strength sessions with the targets that matter, and see what they logged in the app beside it. The plan and the evidence stay in one place.",
         keep=None, close_h="Programme every client's training under your name", **extra):
    gate, faqs = SPEC[slug]
    assert len(faq) == faqs, (slug, len(faq), faqs)
    d = dict(
        title=title, description=description, eyebrow="Free tool · Heart rate & cardio", h1=h1, intro=intro,
        short_q=q, short_a=a if isinstance(a, list) else [a], sections=sections,
        coaches_h="Use the result with your clients", coaches=COACHES, pitch_key=pitch_key, pitch_h=pitch_h,
        pitch=pitch, next=list(nxt), next_pitch="Use these tools together, then turn the numbers into sessions with your coach.",
        faq=faq, keep=keep or [("Workout plans in Traiv", "/features/plan-builder"), ("All free tools", "/tools")],
        close_h=close_h,
    )
    d.update(extra)
    return d


def emit(data, extra=None):
    ok = True
    for slug, d in data.items():
        if extra and slug in extra:
            d = dict(d, sections=d["sections"] + extra[slug])
        ok &= copygen.write_checked(f"{OUT}/{slug}.tsx", d, SPEC[slug][0])
    return ok
