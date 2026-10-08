# 0019 — Client onboarding, and who is allowed to pick a calorie number
2026-10-07 · Status: accepted · Writes the columns ADR 0004 left empty

## Context

A client scanned their coach's link, verified a phone number, and landed on a screen
reading *"There is nothing to train with yet."* `joinByCode` wrote a name, a phone, an
email, and stopped. `client.goal` and `client.constraints` had existed since ADR 0004 and
no code path had ever written to either.

The coach, on the other side, got a roster row with a name and a number on it. Everything
needed to make a plan for that person — what they want, what they eat, what hurts, when
they can train — lived in a WhatsApp thread or in the coach's head.

Onboarding is not profile collection. It is the input stage of a loop: answers → calorie
target → diet and workout plans → the client trains and logs → the trend is read → an
adjustment is proposed → the coach approves. The bar for every question is therefore
narrow: **does a plan change if we don't ask it?** If not, it belongs in a later check-in.

## Decisions

### Three layers, and they do not bleed into each other

| Layer | Owns | Must never |
|---|---|---|
| Intake | What the client said | Interpret it |
| `@traiv/nutrition` | BMR → TDEE → kcal → macros | Guess, or call a model |
| AI (later) | Which meals, which exercises, how to progress | Compute a calorie number, or diagnose |

The AI receives `1,740 kcal / 136p / 190c / 48f` and composes food around it. It does not
pick the number. That boundary is the whole reason this is split: a prompt change can
alter which dal appears at lunch and cannot move anyone's intake by 300 calories without
a failing test and a migration.

### The calculator is deterministic and reproducible by hand

Mifflin-St Jeor, which lands within 10% of measured RMR for ~71% of adults against
Harris-Benedict's ~61%. TDEE from the standard activity multipliers. Goal adjustment as a
percentage of maintenance, so a 95 kg man and a 48 kg woman get proportionate deficits
rather than the same 500 kcal.

Every target stores its own derivation — formula version, BMR, TDEE, activity factor, the
adjustment applied, which floor bound it, BMI. When a coach asks "why 1,740?", the answer
is a stored record they can check on paper.

**Three floors, tested, and the highest wins:** never a deficit beyond 750 kcal/day; never
below resting metabolic rate; never below 1,200 kcal (female) or 1,500 kcal (male). The
middle one is not theoretical — a sedentary client's maintenance is only BMR × 1.2, so a
flat 20% cut lands *under* what their body burns lying still. Every sedentary fat-loss
client hits that floor.

### Where the software stops and a person starts

A flagged target is `proposed` and does not reach the client until a coach approves it:
pregnancy or postpartum, diabetes, blood pressure, thyroid, BMI under 18.5, a goal weight
implying under 18.5, age under 18 or over 70, or sex undisclosed (the BMR is then an
average, not a calculation).

Pregnancy additionally **overrides the goal outright**. Someone pregnant who taps "lose
fat" gets maintenance, not a smaller deficit.

One rail only showed up once real numbers were printed: a small, older, sedentary client
can have a maintenance *below* the 1,200 floor — 1,106 for a 63-year-old at 150 cm and
46 kg. The floor is right to hold, but the answer is then at or above maintenance, which is
not a deficit and must not be handed over as though it were. `deficit_not_possible` sends
that to the coach rather than quietly calling a surplus a diet.

Two things are deliberately *not* flagged. Knee, back and shoulder change which exercises
a plan holds, not how much food it holds, and reach the coach through the note regardless.
PCOS is common enough in this market that flagging it would fill the review queue with
clients who need nothing unusual, and a queue a coach learns to clear without reading is
worse than no queue.

### Six steps, and the app does not open until they are done

Goal · body · activity and training · nutrition · health note · availability. Roughly
twenty fields, which is past where the research says screens start costing completion
(~15% per screen beyond five; more than 3–4 options on one screen can cost up to 60%).

**Onboarding blocks the client's home.** Until `completedAt` is set, Today redirects into
the flow. There is no step-level skip: a flow you can skip six times in six taps is a gate
in name only, and the client arrives as a name and a phone number — the exact state this
feature exists to end. Continue stays disabled until the step holds what a plan needs from
it, the same pattern as every other submit in these apps.

Fields that genuinely do not change a plan stay optional *inside* their step: a goal
weight, allergies, dislikes, the free-text note. "None of these" is a real answer on the
health screen.

The cost is real and worth naming: this is the screen fitness apps lose people on, and the
persona has "low tolerance for a new app, a new login, or anything they must learn". What
pays for it is that each step saves as it is left — closing the tab at step four costs step
four and nothing else, and `lastStep` resumes, including on another phone.

**Select-then-Continue, not tap-to-advance.** Tap-to-advance is faster on a clean
single-choice screen and inconsistent the moment a step has a conditional field — which
step 1 does, since only three of six goals imply a target weight. Six extra taps costs less
than a flow whose buttons move.

### The answers belong to the person, not to the coaching relationship

`user_intake` is keyed on `user`. Age, sex, height, what somebody eats and what hurts are
facts about a person; asking again because they hired a second coach is the app admitting
it wasn't listening the first time. Someone who adds a dietitian alongside their lifting
coach answers nothing twice.

Both coaches therefore read the same row, including the same goal. That is accepted:
`client.goal` already exists per relationship (ADR 0004) for a coach tracking something
different in their own programme, and a coach editing their copy must not reach back and
rewrite what the client said about themselves.

The route stays mounted under a studio — `/c/:studioId/intake` — because being somebody's
active client is what grants the right to be there. The studio authorises the request; the
session decides whose row it touches, so there is no id in the body to swap.

*(This reverses the first draft of this ADR, which keyed intake on `client`. That design
re-asked a person their height per coach, which is indefensible.)*

### The client describes, the system decides

Intake asks what somebody's life is like. It does not ask them to make programming
decisions they are not equipped for, and the wording has to carry that difference.

*"Meals you'd like a day"* asked a client to design their plan. *"How many times you
usually eat in a day"* asks them to describe their day, with a line underneath saying the
coach decides what goes in each one. Same column, same number, completely different
question — and the second one is answerable by someone who has never thought about meal
frequency in their life.

The diet labels work the same way. Every option states what it rules out, because the
words genuinely do not travel: "vegetarian" includes eggs in most of the world and excludes
them here, and "non-vegetarian" in India means somebody who eats everything, not somebody
who eats only meat. A person picking between five labels cannot know which reading we
meant unless it is written down.

### Weight is a series, not a field

`body_metric` rows, not a column on the intake. "Has this person plateaued for three
weeks" is unanswerable from something that gets overwritten, and that question is what
decides whether their calories move. Onboarding writes measurement #1; check-ins append.

During onboarding there is exactly one such row, held by a partial unique index on
`source = 'intake'`, so stepping back to fix a typo corrects the measurement instead of
inventing a trend out of a mistake.

### Targets are append-only

An adjustment is a new row; the old one becomes `superseded` and is never edited. A coach
can see 2,200 → 2,000 → 1,900 across four months and what each change was based on. A
partial unique index allows one `active` target per client, because two would mean the app
and the coach reading different numbers for the same person on the same day.

### The end of onboarding is not an empty screen

The confirmation reads back the client's own answers under their coach's name. The
complaint every coached client has is *"this plan could have been sent to anyone"*
(`personas.md:35`); showing that we heard the specific things they said is the cheapest
possible answer to it.

**The calorie number is not shown there.** A number with no food around it invites somebody
to act on it before their coach has seen it. It arrives with the diet plan.

## Consequences

Blocking the home screen is the riskiest call here. Watch the drop-off between step 1 and
step 6 before anything else — if clients are dying at step 3, that is the evidence to
reopen this decision, and the per-step saves mean the data to measure it already exists.

A client can still reach `completedAt` without a usable target if they somehow arrive with
fields missing — through a coach-entered intake later, or a future partial path. They get
no target at all rather than an invented one, which is the correct failure and a visible
one.

Asking sex is unavoidable: the equation has different constants and there is no
sex-neutral version that is better than an average. "Prefer not to say" is offered and
routes to the midpoint with the client flagged, rather than silently guessing.

`@traiv/nutrition` is now the only thing in Traiv allowed to decide a calorie number. The
adaptation engine will read `body_metric` and write `nutrition_target`; it will not get its
own formula.

## Not built here

AI meal and workout generation, the adaptation engine, trend detection, and check-ins. Also
the coach's side — there is still no coach-facing roster endpoint, and the trainer dashboard
reads mock data. Intake nobody can read is pointless, so that is the next piece.
