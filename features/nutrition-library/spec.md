# Ingredients and recipes

Approved 2026-10-30. Implements A + B of `.ai/features/nutrition/spec.md`.
One Recipes library includes Indian and other recipes. System recipes are read-only,
shared across studios; duplicate creates an independent Personal copy. Personal
ingredients and recipes are scoped to studio membership. Nutrition is computed from
explicit ingredient grams and divided by servings; no guessed conversions.
Ingredient and recipe deletion is soft so references retain their meaning.
Recipe edits are transactional and reject stale revisions. Forms retain unsaved work
locally, scoped by studio and recipe; media uses existing signed uploads.

Scope clarification 2026-10-30: include all 1,099 recipes from the supplied Coachway
export alongside the 136 Indian recipes, in one library. Fetch named ingredients and
steps with the founder-provided API access. Preserve original source IDs, distinguish
same-name variants, validate batch nutrition, divide by servings, and retain source
images. Missing source steps remain visibly absent. Credentials stay out of the repo.
