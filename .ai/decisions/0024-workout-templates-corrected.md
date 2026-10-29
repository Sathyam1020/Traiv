# 0024 — Workout templates, corrected against the real trainer app

2026-10-26 · Status: accepted · Supersedes 0023's section/item model

*Written retroactively during the Nutrition phase (2026-10-27): this decision was made
and implemented the same week as 0023, but never committed to `.ai/decisions/` — a
casualty of a context compaction mid-session. `.ai/decisions/README.md`'s index already
listed it; this file brings the record in line with what actually shipped, in
`packages/db/src/schema/workout.ts`.*

## Context

ADR 0023 modelled training as `workout_section → section_item → item_set`, with
assignment to a client via a separate `template_assignment` join table, and a per-set
`type` enum (`weight_reps · rep_range_weight · amrap_weight · time_distance · time_weight
· calories`) deciding which target columns meant anything. That model was inferred from
the decompiled Coachway mobile client bundle, not checked against the real trainer web
app. Building the client-facing workout UI against it exposed the gap: the real trainer
app, walked through live, has no "sections" concept at all, no assignment join table, and
no per-set type enum.

## Decision

### Template → Session → Exercise → Set — four levels, not three, and no sections

Their builder shows sessions as tabs across the top ("1 session" on the templates list,
session tabs with a gear and a `+` in the editor) — a *session* is one workout within a
template, and an exercise cannot exist outside one: "Create a new session to get started,
or copy from another template." There is no section/circuit grouping above it; a
`superset_group` integer on the exercise row is the only grouping Coachway's builder
actually has, and 0023's `section_item.superset_group` already covered that without
needing a `workout_section` table around it.

### A client's programme is a copy, made by duplicating — not a join-table assignment

**[V]** Their flow is "Duplicate from template" → "Customize Template" → a row on the
client's Workouts tab with `Source: By coach`. `workout_template.client_id` — null for
the studio's reusable template, set for one client's own copy — replaces 0023's
`template_assignment` table entirely. Unassigning was never a real operation to replicate
because there is no assignment: a coach removes a client's copy, or doesn't; there is
nothing joining a shared row to many clients to begin with.

### `fields`, not a per-set type enum

Their "Default fields" picker — "the fields a set starts with when you add this exercise
to a workout, in this order" — is an **ordered list of columns** (`["weight",
"rep_range", "rest"]`) copied onto `session_exercise` from the exercise's own
`default_fields` and editable per workout. A set is weight **and** rep range **and** rest
at once, which 0023's single `type` enum per set could not express — their own builder
shows `sets · weight · rep range · rest` for one exercise and `sets · duration ·
distance` for another, varying which columns render, not which single numeric field is
active.

### The rest is unchanged from 0023

`exercise_set` stays one row per prescribed set, for the same reason 0023 gave: a coach
can make set 1 a warm-up at 40kg and sets 2-4 working sets at 60, and a count cannot say
that. `training_session`'s frozen total columns, `time_periods` summing active time,
`quality`/`intensity`/note from the finish screen, and `set_log` pointing at a specific
prescribed set all carry over exactly as 0023 wrote them.

## Consequences

- `workout_section`, `section_item`, `item_set`, `template_assignment`, and the per-set
  `type` enum never shipped — this correction landed before any client code was built
  against them, so there was nothing to migrate away from in production, only in the
  in-progress branch.
- The real schema is `workout_template → workout_session → session_exercise →
  exercise_set`, exactly as it exists today in `packages/db/src/schema/workout.ts`.
- This is the precedent the Nutrition phase's own schema correction (ADR 0025) follows
  directly: Template → Slot → candidate Recipes mirrors Template → Session → Exercise,
  and a meal plan reaches a client by the same duplicate-not-assign copy.

## What we did not take

Unchanged from 0023 — no PDF export, no scheduled local rest-timer notifications, no
custom numeric keypad.
