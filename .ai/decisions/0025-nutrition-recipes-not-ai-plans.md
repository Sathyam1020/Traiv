# 0025 — Nutrition is recipes and meal-plan templates, not AI-generated diet plans

2026-10-27 · Status: accepted · Supersedes the food/nutrition half of ADR 0004

## Context

ADR 0004 modelled nutrition as `food → nutrition_plan → food_log_entry` (named `food`,
`diet_plan`/`meal`/`meal_item`/`meal_log` once implemented, migration 0014): a hand-keyed
~70-row Indian food list, macros per home measure ("1 katori"), and **the AI generates one
7-day plan per client** (`plan_source: "ai" | "coach"`, `status: generating | proposed |
active | superseded | failed`), which a coach then approves. The file's own doc comment
already flagged it as provisional: *"Treat this as the mechanism proven with plausible
data, not as a food database. The real one is a v2 roadmap item."*

Nothing had been built against it beyond a single existence check
(`apps/api/src/features/client/today.ts`'s `reveal.food = dietPlan.length > 0`, for nav
gating). The founder then walked through 59 reference screenshots of Coachway's real
trainer and client nutrition flow — Recipes, Ingredients, Meal Plans, and the client Food
tab — and it describes a different product entirely: a coach-curated **Recipe** library
built from a global, per-100g **Ingredient** database, assembled into **Meal Plan
Templates** (calorie target, macro split, per-slot candidate recipes, a "scale to
targets" recipe-scaling setting), reaching a client by duplication exactly the way ADR
0024 already established for workouts. No AI generation step appears anywhere in the
flow.

This is the same shape of correction ADR 0023 → 0024 already made for workouts — an
earlier, less-verified schema turning out wrong once checked against the real app — and
gets resolved the same way.

## Decision

### Drop the AI diet-plan model entirely

`diet_plan`, `meal`, `meal_item`, `meal_log`, and the `plan_status`/`plan_source`/
`meal_slot` enums are dropped (migration 0024). No AI-generated plan, no per-client
single-active-plan model, no coach-approval-of-a-generation workflow. The founder
confirmed this explicitly: *"no issues, remove that for now, do this first, this is the
main priority, no ai shit is required for now."*

### Drop `food`/`food_request`, replaced by `ingredient`

The hand-keyed home-measure food list is replaced by a per-100g `ingredient` table
(migration 0023), seeded from two external sources instead of hand-keying:

- **USDA FoodData Central** (Foundation Foods + SR Legacy) — CC0/public domain, bulk
  download, no live dependency. The generic/global layer.
- **IFCT 2017** (Indian Food Composition Tables, NIN/ICMR), via the
  [`nodef/ifct2017`](https://github.com/nodef/ifct2017) digitisation — 542 Indian foods,
  151 nutrient fields. That repository relicensed MIT → AGPL-3.0 on 2025-04-18; the seed
  import is pinned to the last commit before that date, confirmed MIT at that commit,
  specifically to avoid AGPL's network-use clause entangling a closed-source backend.
  The founder confirmed using this dataset over a smaller hand-keyed alternative.

A barcode scan in the client app resolves live against **Open Food Facts** on a cache
miss, writing the result into the same `ingredient` table (`dataSource: "openfoodfacts"`)
so a second scan of the same product, by anyone, is a local lookup.

### Recipes, Meal Plan Templates: new tables, modelled directly on ADR 0024's shape

`recipe` / `recipe_ingredient` / `recipe_step` and `meal_plan_template` /
`meal_plan_slot` / `meal_plan_recipe` — see `packages/db/src/schema/nutrition.ts` and
`.ai/features/nutrition/spec.md` for the full schema and every screen built against it.
The pattern is deliberately identical to workouts: `studioId` + nullable `clientId` on
the template marks shared-library-vs-one-client's-copy, exactly as `workout_template`
already does; a meal plan reaches a client by duplication, never by a join-table
assignment or an AI generation step.

### `nutrition_target` is untouched

`packages/db/src/schema/intake.ts`'s `nutrition_target` (ADR 0019, computed by
`@traiv/nutrition`) already stores per-client kcal/protein/carbs/fat independent of how a
plan is built. It feeds the "N kcal recommended for this client" auto-suggest on a meal
plan's creation form and needed no change.

### `reveal.food`

Changed from `dietPlan.length > 0` to the `mealPlanTemplates` equivalent of the workout
check already in `today.ts` — same shape, new source table, behaviour-neutral.

## Consequences

- `foods.ts`'s ~70 hand-written Indian foods are gone, superseded by the IFCT import —
  nothing of that file's content needed preserving once a verified 542-row structured
  dataset replaced it.
- ADR 0004's still-open question — *"Can a coach's custom exercise or food be promoted to
  the global library?"* — is answered for nutrition the same way it already is for
  exercises: it isn't promoted. A coach's own ingredient or recipe is a row with
  `studioId` set, visible only to them, same table as the System rows.
- Any future AI-generation feature (meal-plan first-drafts, named in
  `.ai/product/roadmap.md`'s v3) starts from a coach- or client-authored Recipe/Ingredient
  base rather than inventing numbers, if and when it's built — nothing here forecloses
  that, it just isn't what v1 ships.

## What we did not take

Recipe-video hosting for seeded/System recipes — moot, there are no seeded recipes;
unlike exercises, a recipe is always coach- or client-authored, so there's no equivalent
of the `free-exercise-db` video-URL deferral to track.
