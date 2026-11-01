# Nutrition handoff and acceptance

Updated 2026-11-01. Phases A–F are implemented. This is a manual acceptance checklist,
not a record of passing tests. The founder reserved UI testing; automated tests,
typechecks, builds and browser checks have not been run for this work.

## Configuration

- Use the existing API/client/trainer development commands and database configuration.
  No deployment, tunnel, HTTPS or LAN changes are part of this work.
- Apply repository migrations through the existing `@traiv/db` migration command on any
  other development database. The configured database has migrations through 0035 applied.
- Recipe covers, Photo Log and nutrition-label images use the existing signed Cloudinary
  upload configuration. See the API upload configuration and `.env.example`; keep secrets
  server-side.
- Label transcription needs server-only `FOOD_LABEL_API_KEY`; `FOOD_LABEL_MODEL` defaults
  to `gpt-4.1-mini`. Without that key, manual food entry remains available. Transcription
  needs review before save; it is not photo calorie estimation.
- Barcode cache misses need access to Open Food Facts. Camera scanning depends on browser
  camera support/permissions and a secure context; manual barcode entry remains available.
- Dataset sources and import commands are in `docs/nutrition-data.md`. Do not rerun seeds
  simply to verify UI behavior.

## Trainer library and templates

- [ ] Browse/search/filter ingredients, including salt; create and edit a coach ingredient.
- [ ] Create/edit a recipe; change units/quantities, preparation notes and servings. Confirm
      nutrition changes and Save is disabled until actual edits occur.
- [ ] Add/remove/reorder instructions and confirm persistence after reopening.
- [ ] Duplicate a System recipe; confirm private edits do not modify the System original.
- [ ] Create a template with calorie/macro targets, meal distribution and recipe options.
- [ ] Confirm horizontal option scrolling and macro summaries. Test locks while changing targets.
- [ ] Publish; edit again and confirm published versus local-change state remains distinct.

## Client assignment

- [ ] Create a client-only plan; confirm it does not appear in the reusable template library.
- [ ] Copy a template with existing targets, then with custom targets. Confirm the source
      template and another client's copy remain unchanged.
- [ ] Client cannot see an unpublished draft or later unpublished trainer changes.
- [ ] Publish and confirm the client sees the adjusted published ingredient amounts.
- [ ] Exercise existing unassign/delete/save-as-template actions where available.

## Diary and navigation

- [ ] Food is usable with no assigned plan. Empty meals do not offer copy-from-yesterday.
- [ ] Select a date, swipe complete Sunday–Saturday weeks and choose a date using the calendar.
- [ ] Quick add uses the selected diary date and selected meal; optional empty macros save as zero.
- [ ] Log food/Add item opens the full logging page; tapping a row/plus opens its quantity sheet.
- [ ] Log ingredients, recipes and published plan options using servings and grams (ml for liquids).
- [ ] Change quantities/date/meal and confirm daily totals and target-progress rings update.
- [ ] Ring colors remain protein reddish, carbs greenish, fat yellowish; at target the ring is full.
- [ ] Copy a meal/day, retry and confirm no duplicate entries; add yesterday only when data exists.
- [ ] Edit/delete a logged food, then edit/delete its library source; historical snapshots remain intact.
- [ ] My recipes opened from Food returns to Food; opened from Log food returns there.
- [ ] Assigned-plan cards open the full plan page with an active meal tab. Recipe details show
      ingredients/instructions and open a separate Log this meal sheet.
- [ ] Check header, fixed actions, glass navigation, labels, spacing and reduced-motion behavior.

## Private recipes and foods

- [ ] Create a recipe with/without a cover, select multiple ingredients, alter grams/servings,
      add steps and confirm per-serving nutrition and persistence.
- [ ] Recipe card opens details; Edit opens editor; Duplicate creates an independent copy;
      Delete removes only the intended recipe. Log and favorite the recipe.
- [ ] Create a food manually with brand, barcode, category and optional named serving.
- [ ] Enter values per 100 g/ml and per serving; confirm equivalent values after saving/reopening.
- [ ] Scan a label, correct its values and save. Check absent/unreadable values remain editable.
- [ ] Edit/delete private foods. A liquid food cannot be used as a gram-based recipe ingredient
      without density information. Changing a food's base unit is rejected if used in recipes.
- [ ] Recent/Favorites/My recipes/My foods show the correct relationship-owned entries.

## Tools and access

- [ ] Barcode first lookup caches; subsequent lookup uses cache. Try missing codes/manual entry.
- [ ] Add recipe ingredients to shopping, repeat the same action, adjust portions, check/uncheck,
      edit and delete items; verify aggregation and retry behavior.
- [ ] Photo Log upload/history/retry/image viewing and coach reply persist.
- [ ] Calorie calculator and daily/weekday/date target overrides work; test personal plans.
- [ ] Trainer permission switches deny restricted writes on the API as well as in the UI.
- [ ] A different client/studio cannot read or edit private foods, recipes, diaries or plans.
- [ ] Paused relationships retain intended reads and reject mutations.

## Boundaries and cleanup evidence

Cookbooks are excluded. Chat is only a navigation-preview placeholder. Provider-dependent
features are not verified by successful code edits or migrations.

Migration 0024 already dropped the legacy `food`, `food_request`, `diet_plan`, `meal`,
`meal_item`, `meal_log` tables and retired enums. Phase F's read-only database inspection
confirmed all those tables and `foods` absent, with current `ingredient`, `recipe`,
`meal_plan_template`, `food_log_entry` present. No legacy data transfer or additional drop
migration was needed. Historical migration files/snapshots remain intact.

Architectural decisions: ADR 0025 (replacement), 0029 (template snapshots), 0030 (client
assignment) and 0031 (frozen diary snapshots). Approval to run checks later should cover
API/client/trainer typechecks and the relevant nutrition scenario tests; until then,
acceptance stays pending.
