# 0029 — Meal plan templates, snapshots and publishing
2026-10-30 · Accepted by founder after screenshot review

Phase C creates reusable studio templates, not client assignments or food logging.
One settings sheet serves Create and Edit. Creation fills each enabled meal with the
requested number of eligible recipe alternatives, then opens a Draft builder. Publish
returns to the list. A meal's alternatives are mutually exclusive choices.

Extend meal_plan_template with draft_document/published_document JSON snapshots, while
mirroring draft slots and candidate nutrition into the existing normalised child tables.
Snapshot ingredients/instructions/nutrition freeze plan contents against later library
edits. These versioned, heterogeneous documents are not queried by nested fields.
A saved Live edit leaves the published document intact and shows Local changes.
Updates require the last updatedAt and lock the template row. All routes scope studio
and exclude client-owned plans. Add studio-scoped saved macro presets with a 100% check.

Allergens are exclusions. Dietary preferences are ranking preferences. Standard meal
types restrict automatic candidates; custom meals may select across meal types.
Insufficient matches remain visible shortages, not duplicated/allergen-conflicting fills.
Ingredient-level bounded deterministic fitting respects serving conversions and minimum
unit amounts; actual rounded composition is reported, with no fabricated exact-fit claim.
Locked options survive target changes and show conflicts that block publishing.

No tests/typechecks/browser checks are run at the founder's request. No new branch or
dependency. Client assignment and Food logging remain later phases.
