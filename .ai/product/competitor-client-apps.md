# What's in a competitor's client app

Researched 2026-10-07. Scope is deliberately narrow: **the app the client holds**, not the
coach's console. Sources are the platforms' own help docs, App Store listings and public
reviews.

## The tab set everybody converged on

Five platforms, essentially one navigation. This is settled design — a client arriving at
Traiv from any of these expects it.

| | Trainerize | Everfit | TrueCoach | My PT Hub | FitBudd |
|---|---|---|---|---|---|
| Home / Today | ✅ | ✅ | ✅ | ✅ | ✅ |
| Workouts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Nutrition | ✅ | ✅ | — | ✅ | ✅ |
| Progress | ✅ | ✅ (`You`) | ✅ (profile) | ✅ | ✅ |
| Chat | ✅ | ✅ | ✅ | ✅ | ✅ |
| Habits | ✅ | ✅ (`Tasks`) | ✅ | ✅ | — |
| Calendar | ✅ | — | ✅ | — | ✅ |
| Booking | ✅ | — | — | ✅ | ✅ |

TrueCoach is the outlier with no nutrition tab at all — it is a workout-logging tool with a
chat attached, and sells on being simple. Everyone else is a suite.

## What's actually inside each one

**Workouts** — the only tab with real depth everywhere. Today's session; per-set logging
of reps, weight and RPE; a demo video per exercise; **exercise history inline** so the
client sees what they lifted last time on that movement; a rest timer; past/upcoming
split; comments on a specific workout. TrueCoach and Everfit both treat per-exercise
history as essential, and it is the single feature that makes logging feel worth doing.

**Nutrition** — meal plan with recipes; a food log with a searchable database; macro
targets with progress rings; barcode scanning (FitBudd claims 1M+ foods); photo food
journals that the coach comments on.

**Progress** — weight, body-fat, waist and custom metrics charted over months; progress
photos organised by date into a timeline; personal bests per exercise; workout-completion
streaks. Everfit's `You` tab leads on **personal bests** rather than weight, which is a
better answer to "is this working" than a scale that moves randomly.

**Chat** — real-time, with images, video and PDFs. Clients request a video demo, comment on
a workout, and get voice notes back. This is where the relationship lives on every platform.

**Habits / Tasks** — water, sleep, steps, meditation, custom. Checkboxes the client ticks;
completion rates the coach sees. Cheap to build, and it's what gives a client a reason to
open the app on a day they aren't training.

## The check-in is the backbone, and it isn't a tab

Every platform has it and none of them put it in the navigation. It's a recurring form the
coach schedules — typically weekly — collecting weight, measurements, photos, adherence,
energy and hunger, plus a short written reflection. The coach reads it and responds with an
adjustment: calories up or down, a programme tweak, a habit to focus on.

Two things make it more than a form. The numbers **auto-chart into the progress trend** 
rather than sitting in a text box, and the photos **file themselves into the dated
gallery**. That is the mechanism the whole adaptive loop runs on — it is exactly the loop
described in ADR 0019, and the industry has already standardised the input format.

## The one idea worth stealing outright

**Trainerize hides tabs until they're relevant.** Goals, Habits and Nutrition are not shown
unless the coach has actually assigned a goal, a habit or a meal plan. The client only ever
sees what applies to them.

That is a direct answer to the problem Traiv has right now — a client who finishes
onboarding and lands in an app with nothing in it. Rather than five empty tabs, the app
grows a tab the day its content exists.

## What India adds on top

HealthifyMe and Fittr aren't competitors for the coach's money, but they set what a client
here already expects an app to do:

- **Photo food logging.** HealthifyMe's Snap recognises a plate from a photo. Manual search
  through 100,000+ Indian foods is the fallback, not the primary path.
- **An AI coach in the client's own language.** Ria 2.0 does live voice in 14 Indian
  languages. This is now table stakes in-market, and it is not table stakes in any of the
  five Western platforms above.
- **Steps, free, always on.** Google Fit sync with no setup.
- **Community.** Fittr leans hard on public transformation stories and regional
  sub-communities — the accountability comes from peers, not only the coach.

## Where they're weak

The consistent complaint about Trainerize from coaches is that **their clients find it
confusing** — "slow and clunky", "bad interface", and specifically that older or
non-technical clients needed extra hand-holding to get started. Coaches migrate to Everfit
citing UI alone.

Against `personas.md`, that is the opening. Traiv's client is on a budget Android with
patchy basement signal and "low tolerance for a new app, a new login, or anything they must
learn". A suite with six tabs and 40 screens is not built for them; it's built for an
American client who already uses MyFitnessPal.

## What this implies for Traiv

Nothing here is a decision — these are the options the field has already validated.

**The four that earn a tab immediately:** Today (what do I do right now), Plan (the week),
Progress (is it working), Chat (my coach). Nutrition can live inside Today as *today's
meals* long before it needs its own tab, which keeps the first version to four.

**Build the check-in early, not late.** It is the only feature that both gives the client a
weekly reason to open the app and feeds the adaptation loop its inputs. It is also the
thing `body_metric` and `nutrition_target` were already shaped for.

**Copy the progressive tab reveal.** Traiv has fewer features than any of these platforms
and will for a while; showing a client only what their coach has actually given them turns
that from a gap into restraint.

**Per-exercise history is not optional.** It's the detail that makes logging feel like it
pays the client back rather than being homework for the coach.

**The India-specific gap is language and food.** None of the five Western platforms do
Indian food databases or Indian languages. HealthifyMe does both and does not sell to
independent coaches.
