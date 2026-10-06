"""Builds the Traiv explainer PDF.

Plain language on purpose: this is the document Sathyam hands to a coach, an
investor or a new engineer, so every sentence has to survive being read once.
Styling follows the product's own direction (ADR 0015) — near-black on white,
hairline rules, no decorative colour.
"""

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    NextPageTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

OUT = "Traiv-explained.pdf"

INK = colors.HexColor("#111111")
BODY = colors.HexColor("#374151")
MUTED = colors.HexColor("#6B7280")
LINE = colors.HexColor("#E5E7EB")
WELL = colors.HexColor("#F8F9FA")

MARGIN = 20 * mm
PAGE_W, PAGE_H = A4

ss = getSampleStyleSheet()


def style(name, **kw):
    base = dict(
        name=name,
        fontName="Helvetica",
        fontSize=10,
        leading=15,
        textColor=BODY,
        alignment=TA_LEFT,
        spaceAfter=0,
    )
    base.update(kw)
    return ParagraphStyle(**base)


S = {
    "hero": style("hero", fontName="Helvetica-Bold", fontSize=30, leading=34, textColor=INK),
    "sub": style("sub", fontSize=12, leading=18, textColor=MUTED),
    "h1": style("h1", fontName="Helvetica-Bold", fontSize=17, leading=21, textColor=INK),
    "h2": style("h2", fontName="Helvetica-Bold", fontSize=11.5, leading=15, textColor=INK),
    "eyebrow": style("eyebrow", fontName="Helvetica-Bold", fontSize=8, leading=11,
                     textColor=MUTED),
    "body": style("body"),
    "lead": style("lead", fontSize=11.5, leading=18, textColor=INK),
    "small": style("small", fontSize=9, leading=13, textColor=MUTED),
    "quote": style("quote", fontSize=12, leading=18, textColor=INK,
                   fontName="Helvetica-Oblique"),
    "cell": style("cell", fontSize=9.5, leading=13.5),
    "cellb": style("cellb", fontSize=9.5, leading=13.5, fontName="Helvetica-Bold",
                   textColor=INK),
}


def para(text, s="body"):
    return Paragraph(text, S[s])


def rule(space_before=5, space_after=9):
    return [Spacer(1, space_before),
            HRFlowable(width="100%", thickness=0.6, color=LINE),
            Spacer(1, space_after)]


def heading(text, eyebrow=None):
    out = [Spacer(1, 4)]
    if eyebrow:
        out.append(para(eyebrow.upper(), "eyebrow"))
        out.append(Spacer(1, 3))
    out.append(para(text, "h1"))
    out.append(Spacer(1, 8))
    return out


def bullets(items, s="body"):
    """A bullet list laid out as a table, so wrapped lines stay indented."""
    rows = [[para("&bull;", s), para(t, s)] for t in items]
    t = Table(rows, colWidths=[6 * mm, None])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return t


def pain_table(rows):
    """Problem on the left, what Traiv does on the right."""
    data = [[para("The problem", "eyebrow"), para("What Traiv does", "eyebrow")]]
    for problem, fix in rows:
        data.append([para(problem, "cellb"), para(fix, "cell")])
    t = Table(data, colWidths=[72 * mm, None])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LINEBELOW", (0, 0), (-1, -2), 0.6, LINE),
    ]))
    return t


def feature_block(title, items):
    inner = [para(title, "h2"), Spacer(1, 4), bullets(items, "cell")]
    t = Table([[inner]], colWidths=[None])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WELL),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LINEBEFORE", (0, 0), (0, -1), 2, INK),
    ]))
    return KeepTogether([t, Spacer(1, 8)])


def price_table():
    data = [
        [para("Plan", "eyebrow"), para("Price", "eyebrow"), para("Clients", "eyebrow")],
        [para("Free", "cellb"), para("Rs 0", "cell"), para("2, forever", "cell")],
        [para("Starter", "cellb"), para("Rs 499 / month", "cell"), para("8", "cell")],
        [para("Pro", "cellb"), para("Rs 999 / month", "cell"),
         para("Unlimited &mdash; the main plan", "cell")],
        [para("Studio", "cellb"), para("Rs 2,499 / month", "cell"),
         para("Unlimited, 5 coach logins", "cell")],
    ]
    t = Table(data, colWidths=[30 * mm, 42 * mm, None])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -2), 0.6, LINE),
    ]))
    return t


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 12 * mm, "Traiv")
    canvas.drawRightString(PAGE_W - MARGIN, 12 * mm, str(doc.page))
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN, 16 * mm, PAGE_W - MARGIN, 16 * mm)
    canvas.restoreState()


def on_cover(canvas, doc):
    """The mark, drawn from the same geometry as the app's SVG."""
    canvas.saveState()
    x, y, size = MARGIN, PAGE_H - MARGIN - 16 * mm, 16 * mm
    u = size / 24.0
    canvas.setFillColor(INK)
    canvas.roundRect(x, y, size, size, 5.4 * u, stroke=0, fill=1)
    canvas.setFillColor(colors.white)

    def glyph(gx, gy, gw, gh, r):
        # SVG y runs downward, PDF upward.
        canvas.roundRect(x + gx * u, y + size - (gy + gh) * u, gw * u, gh * u,
                         r * u, stroke=0, fill=1)

    glyph(5.6, 7.0, 12.8, 2.8, 1.4)
    glyph(5.6, 7.0, 2.8, 5.4, 1.4)
    glyph(15.6, 7.0, 2.8, 5.4, 1.4)
    glyph(10.6, 7.0, 2.8, 10.0, 1.4)
    canvas.restoreState()
    on_page(canvas, doc)


doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN, bottomMargin=24 * mm,
    title="Traiv, explained", author="Traiv",
    subject="What Traiv is, who it is for, and what it does",
)
frame = Frame(MARGIN, 24 * mm, PAGE_W - 2 * MARGIN, PAGE_H - MARGIN - 24 * mm, id="main")
cover_frame = Frame(MARGIN, 24 * mm, PAGE_W - 2 * MARGIN, PAGE_H - MARGIN - 24 * mm - 22 * mm,
                    id="cover")
doc.addPageTemplates([
    PageTemplate(id="cover", frames=[cover_frame], onPage=on_cover),
    PageTemplate(id="main", frames=[frame], onPage=on_page),
])

F = []

# ---------------------------------------------------------------- cover
# Switches every page after this one to the full-height frame, and drops the mark.
F += [
    NextPageTemplate("main"),
    Spacer(1, 6 * mm),
    para("Traiv, explained", "hero"),
    Spacer(1, 5),
    para("Software that lets an independent fitness coach in India run their whole "
         "business from their phone &mdash; and gives their clients an app with the "
         "<b>coach's</b> name on it, not ours.", "sub"),
    Spacer(1, 10 * mm),
    HRFlowable(width="100%", thickness=0.6, color=LINE),
    Spacer(1, 7 * mm),
    para("Say it in one line", "eyebrow"),
    Spacer(1, 4),
    para("&ldquo;Coach fifty people like you coach ten.&rdquo;", "quote"),
    Spacer(1, 7 * mm),
]

F += heading("Who pays, and who uses it")
F += [
    para("Two different people, and getting this the wrong way round is the mistake "
         "most apps make.", "body"),
    Spacer(1, 7),
    bullets([
        "<b>The coach pays us.</b> Rs 999 a month. A personal trainer, dietitian, "
        "nutritionist, yoga teacher or physiotherapist, usually with 5 to 50 clients.",
        "<b>Their clients use it free.</b> They never see our name. They see their "
        "coach's name, logo and colours.",
    ]),
    Spacer(1, 8),
    para("So the thing we are really judged on is simple: <b>do the clients open the "
         "app each week?</b> Coaches do not cancel because they dislike a button. They "
         "cancel because their clients stopped showing up.", "body"),
]

F += rule(8, 8)
F += [
    para("The market", "eyebrow"),
    Spacer(1, 4),
    para("India's digital fitness coaching market was about <b>USD 427 million in 2025</b>, "
         "growing steadily. India is the <b>second fastest growing country</b> in the world "
         "for personal trainers. Nearly half of all coaches now work in a hybrid "
         "online-plus-in-person way &mdash; which is exactly the coach who needs this.",
         "small"),
]

F += [PageBreak()]

# ------------------------------------------------------- the coach's problems
F += heading("What a coach struggles with today", "Problem 1 of 2")
F += [
    para("This is the list a coach would give you, in the order they would say it.",
         "body"),
    Spacer(1, 10),
    pain_table([
        ("Sunday disappears into spreadsheets",
         "Build a plan once, reuse it, and change only the parts that differ for each "
         "person. What took a whole Sunday takes an hour."),
        ("WhatsApp never stops",
         "Everything arrives in one organised inbox instead of forty separate chats. "
         "Nothing gets lost at 11pm."),
        ("Clients quietly disappear",
         "You get told when someone stops logging &mdash; in week two, while you can "
         "still save it, not after they cancel."),
        ("Chasing money every month",
         "Payment links and automatic UPI collection, so you stop asking people for "
         "money you also have to motivate."),
        ("Cannot grow past about 30 clients",
         "Everything repetitive is handled for you, so the limit becomes your time with "
         "people, not your admin."),
        ("Existing apps punish growth",
         "Every other app charges per client. Add a client, pay more. We never do that."),
    ]),
]

F += [PageBreak()]

# ------------------------------------------------------ the client's problems
F += heading("What their client struggles with today", "Problem 2 of 2")
F += [
    para("The client does not pay us and never sees our name. But they decide whether "
         "the coach stays.", "body"),
    Spacer(1, 10),
    pain_table([
        ("&ldquo;This plan could have been sent to anyone&rdquo;",
         "The coach is nudged to personalise before sending. The plan arrives with your "
         "name, your injuries and your goal on it."),
        ("Silence after paying",
         "Regular check-ins and replies, so paying does not feel like being forgotten."),
        ("Cannot tell if it is working",
         "Progress you can actually see &mdash; last week's numbers next to today's, "
         "photos, measurements &mdash; not just a scale that moves randomly."),
        ("Fell behind, now too embarrassed to open it",
         "A gentle way back in. Missing a week does not wipe your streak or your history."),
        ("The app ate my workout",
         "Logging works with no signal, in a basement gym, on a cheap phone. It syncs "
         "when you come back up."),
        ("Another app, another password",
         "No password at all. Scan the coach's QR code, type your phone number, done."),
    ]),
]

F += [PageBreak()]

# ---------------------------------------------------------------- features
F += heading("Everything Traiv will do")
F += [
    para("Grouped by what it is for. Some is built, some is coming &mdash; the last page "
         "says which.", "body"),
    Spacer(1, 10),
]

F += [
    feature_block("Getting clients in", [
        "A QR code and a link that connect a client to you in one scan",
        "Client signs up with just a phone number, no password, no app store",
        "Your branding on their app: name, logo, colour",
        "Free for your first two clients, forever",
    ]),
    feature_block("Training", [
        "Programme builder with your own exercise library",
        "Templates you can assign to many people at once",
        "A prompt to personalise before anything is sent",
        "Video demonstrations on every exercise",
        "Supersets, rest timers, and last session's numbers on the screen while logging",
    ]),
    feature_block("Food and nutrition", [
        "Indian food database in home measures &mdash; katori, roti, idli, not just grams",
        "Meal plans, with vegetarian, Jain and egg options",
        "Smart swaps when a client does not like something",
        "Food logging, and a vegetarian protein helper",
        "Fasting days handled properly",
    ]),
    feature_block("Staying in touch", [
        "Everything delivered over WhatsApp, the app clients already use",
        "One inbox for every client conversation",
        "Check-in forms you design, on your schedule",
        "Progress photos, measurements and weight tracking",
        "Automatic nudges when someone goes quiet",
    ]),
    feature_block("Keeping clients", [
        "A board showing who is at risk of quitting, before they quit",
        "A guided first 72 hours for every new client",
        "A monthly progress card they can share",
        "A way back for anyone who fell off",
        "Habit tracking",
    ]),
    feature_block("Money", [
        "Packages and payment links",
        "Automatic monthly collection over UPI",
        "GST invoices",
        "No commission on what you earn &mdash; you keep all of it",
    ]),
    feature_block("Running the business", [
        "Several coaches under one studio, with proper permissions",
        "Modes for dietitians, yoga teachers and physios, not just gym training",
        "Cancel in one click, no phone call",
        "Export everything, any time &mdash; it is your data",
    ]),
]

F += [PageBreak()]

# ---------------------------------------------------------------- pricing
F += heading("What it costs")
F += [
    price_table(),
    Spacer(1, 9),
    para("All prices include GST, because Indian buyers expect the price on the screen "
         "to be the price they pay.", "small"),
    Spacer(1, 12),
    para("Four promises we do not break", "h2"),
    Spacer(1, 6),
    bullets([
        "<b>Unlimited clients on every paid plan.</b> Charging per client is the loudest "
        "complaint against every competitor.",
        "<b>No add-ons.</b> Nutrition, payments, branding and automation are included. "
        "Others charge separately for each.",
        "<b>No cut of your revenue.</b> TrueCoach takes 5%. We take nothing beyond the "
        "payment gateway's own fee.",
        "<b>Leave whenever.</b> One click to cancel, one click to export everything.",
    ]),
]

F += rule(12, 10)
F += [
    para("Why we are cheaper", "h2"),
    Spacer(1, 5),
    para("Trainerize, TrueCoach and Everfit bill Indian coaches in dollars &mdash; "
         "roughly Rs 5,000 to 12,000 a month once you add the parts you need. They also "
         "charge per client, and their food databases are full of food Indians do not "
         "eat. Nobody has built this for how coaching actually works here.", "body"),
]

F += [PageBreak()]

# ---------------------------------------------------------------- competition
F += heading("How this is different from HealthifyMe and Cult")
F += [
    para("This question comes up every time, and the answer is simpler than it sounds: "
         "<b>they are the opposite business.</b>", "lead"),
    Spacer(1, 10),
    Table(
        [[para("", "eyebrow"), para("HealthifyMe / Cult", "eyebrow"), para("Traiv", "eyebrow")],
         [para("Sells to", "cellb"), para("The person exercising", "cell"),
          para("The coach", "cell")],
         [para("Who owns the client", "cellb"), para("They do", "cell"),
          para("The coach does", "cell")],
         [para("The coach is", "cellb"), para("Their employee", "cell"),
          para("Our customer", "cell")],
         [para("Whose name is on it", "cellb"), para("Theirs", "cell"),
          para("The coach's", "cell")]],
        colWidths=[42 * mm, 55 * mm, None],
        style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LINEBELOW", (0, 0), (-1, -2), 0.6, LINE),
        ])),
    Spacer(1, 12),
    para("HealthifyMe competes <i>with</i> independent coaches for the same client. "
         "We arm those coaches.", "body"),
    Spacer(1, 8),
    para("And they cannot simply copy us. If HealthifyMe gave independent coaches the "
         "tools to own their clients directly, their own coaches would leave and take "
         "those clients with them. They would be paying to destroy their own business. "
         "Cult cannot either &mdash; they run physical gyms, which is a completely "
         "different company.", "body"),
]

F += rule(12, 10)
F += [
    para("What actually protects us long term", "h2"),
    Spacer(1, 6),
    bullets([
        "<b>Money flowing through us.</b> Once a coach collects payments here and their "
        "clients have standing UPI instructions, leaving means asking forty people to "
        "set it all up again. That is the strongest hold, and we have not built it yet.",
        "<b>Clients already having the app.</b> Someone who joins one coach on Traiv "
        "already has it when they hire a second. This grows on its own.",
        "<b>Knowing what actually works.</b> With enough coaches we can tell a new one "
        "&ldquo;clients like this quit in week three unless you do X.&rdquo; Nobody "
        "starting tomorrow has that.",
    ]),
    Spacer(1, 9),
    para("<b>Being honest about the rest:</b> features, design and the Indian food "
         "database are a head start, not protection. Anyone can copy them given time. "
         "The list above is what cannot be copied quickly.", "small"),
]

F += [PageBreak()]

# ---------------------------------------------------------------- status
F += heading("Where we are right now")
F += [
    para("Working today", "h2"),
    Spacer(1, 5),
    bullets([
        "Coaches sign up with a phone number. No passwords anywhere.",
        "A coach gets a QR code and link; a client scans it and is connected.",
        "Studios, so one coach can work across several, and several coaches can share one.",
        "One login can be a coach in one place and someone else's client in another &mdash; "
        "a trainer who hires a dietitian is a real person, not an edge case.",
        "Client limits per plan, enforced properly even when several people sign up at once.",
        "Both apps, the design system, and 114 automated tests.",
    ]),
    Spacer(1, 12),
    para("Being built next", "h2"),
    Spacer(1, 5),
    bullets([
        "The coach's client list and client detail screens",
        "Programme builder, exercise library and workout logging",
        "Check-ins and progress tracking",
        "Payments",
        "The Indian food database and meal plans",
    ]),
    Spacer(1, 12),
    para("Waiting on paperwork, not code", "h2"),
    Spacer(1, 5),
    bullets([
        "Text message delivery needs DLT registration, which needs a registered company",
        "WhatsApp delivery needs Meta business verification",
        "Google sign-in needs Google Cloud credentials",
    ]),
]

F += rule(14, 10)
F += [
    para("How to explain Traiv in thirty seconds", "h2"),
    Spacer(1, 6),
    para("&ldquo;Personal trainers in India run their business on WhatsApp and Google "
         "Sheets. The proper software is American, costs five to twelve thousand rupees a "
         "month, charges extra for every client you add, and does not know what a katori "
         "of dal is.<br/><br/>Traiv is nine hundred and ninety nine rupees a month for "
         "unlimited clients. The coach's clients get an app with the coach's name on it, "
         "and everything reaches them on WhatsApp, so there is nothing new to "
         "learn.&rdquo;", "quote"),
]

doc.build(F)
print("wrote", OUT)
