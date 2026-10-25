# 0023 — Workouts are templates you assign, not plans you generate
2026-10-25 · Status: accepted · Supersedes the workout half of ADR 0004

## Context

ADR 0004 modelled training as `workout_plan → workout_day → workout_item`: one plan per
client, eight weeks of dated days, each day a flat list of exercises with `sets: int` and
`reps: text`. Nothing ever wrote to it. The first code that did — a client-side workout
feature built in October — exposed why that shape is wrong, and it is wrong in three
separate ways.

**A coach writes the same workout many times.** "Upper push" for forty clients is forty
rows under a per-client plan. There is no way to express "everyone on the beginner block
gets this", no way to fix a typo once, and no library to build on. That is the difference
between a tool a coach uses twice and one they run their business on.

**A flat list of exercises is not a workout.** Real programming has sections — a warm-up,
a main lift, a finisher — and supersets, which are two exercises that must be read and
logged as one unit.

**`reps: text` cannot be read back.** "8-10", "AMRAP", "40m carry" and "10 min row" all
go in the same column, so nothing downstream can chart a rep count, total a distance, or
tell a timed set from a rep-counted one. The adaptation loop that ADR 0019 sets up needs
numbers, and this column only ever produces prose.

Coachway — reconnoitred from their shipped Android client, written up in
`research/coachway/client-app.md` — solves all three the same way, and the whole field
has converged on it.

## Decisions

### The unit is a template, and assignment is a join table

`workout_template` belongs to a **studio**, not a client. `template_assignment` attaches
it to clients. A coach writes a workout once and gives it to as many people as they like;
unassigning does not touch the sessions already logged against it, which a per-client
plan could not avoid.

**[V]** This is Coachway's model exactly: `POST /workout/templates`,
`PATCH /workout/templates/:id/assign` · `/unassign` · `/duplicate` · `/status`.

### A client-authored workout is the same row

`workout_template.client_id` is null for the coach's library and set when a client wrote
it themselves, or pulled one out of a pack into their own list. One nullable column
rather than two tables, because their `createClientWorkoutTemplateFromCollection` proves
the two are the same shape — a session logger must not be able to tell them apart.

A check constraint ties `source` and `client_id` together, so a library row cannot claim
to belong to one client and a personal one cannot be ownerless.

### Sections, then items, then sets — three levels, not one

`workout_section` (with optional `rounds`, which is what makes it a circuit) holds
`section_item` (an exercise, with an optional `superset_group`), which holds `item_set`
— **one row per prescribed set**.

A row per set rather than `sets: int` is the part that looks like overkill and is not: a
coach types set 1 as a warm-up at 40kg and sets 2-4 as working sets at 60, and a count
cannot say that. The client's logger shows one row per set either way.

### Every set has a type

```
weight_reps · rep_range_weight · amrap_weight · time_distance · time_weight · calories
```

**[V]** Coachway's `ESetType`. The type decides which target columns mean anything, which
is why they are all nullable with a check constraint per type rather than a single text
field. This is what makes the analytics possible at all — total weight lifted, total
distance, total time are each a sum over one type.

### Session metrics are stored, not derived

`training_session` keeps `total_weight_lifted_kg`, `total_reps`, `total_sets`,
`total_completed_sets`, `total_distance_m`, `total_seconds`, `total_calories`, computed
at completion and then frozen. An exercise removed from the library later must not
silently change what somebody lifted in March, and the coach's trend has to be readable
without re-summing every set in a client's history.

`time_periods` is start/end pairs rather than one span, because **[V]** their
`calculateActiveTime` sums periods — pausing mid-session is a real thing, and wall-clock
counts twenty minutes queueing for a rack as training.

`quality` and `intensity` (1-5) and a note come from **[V]** their `RatingSection` on the
finish screen. They are the client's own read on the session, and the only subjective
input the loop gets between weekly check-ins.

### What `set_log` points at

`item_set_id`, not an item plus an ordinal. The prescription already has a row per set,
so "set 2 of this exercise" stays meaningful after the coach reorders the workout.
Nullable, because a client may add a set nobody planned.

`completed` is separate from the values being present: **[V]** their `toggleSet` is a
distinct action from typing numbers, and a half-finished exercise has to survive the app
closing.

## Consequences

- `workout_plan`, `workout_day` and `workout_item` are **dropped** (migrations 0019 and
  0020). Nothing read them but a development seed written the same week.
- `training_session` and `set_log` survive and are extended, so the roster's
  "last session" query is untouched.
- The coach app needs a workout builder — it had no training screens at all. That is the
  larger half of the work this decision creates, and it is the half that makes the
  feature worth anything to the person who pays us.

## What we did not take

- **PDF export** of a template. A server-side renderer and a dependency decision of its
  own; their `/workout/templates/:id/pdf` can wait.
- **Scheduled local notifications** for the rest timer. A backgrounded browser tab cannot
  reliably fire one, and a timer that silently does not go off is worse than none.
- **A custom numeric keypad.** `inputMode="decimal"` is the web's answer and it brings the
  OS's own accessibility with it.
