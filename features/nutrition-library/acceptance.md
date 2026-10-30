# Acceptance

- Browse/search/filter/sort/paginate System and Personal ingredients and recipes.
- Create/edit ingredients, serving conversions, tags and micronutrients.
- Create recipes, edit ingredients and ordered steps, see computed per-serving nutrition.
- System items open in editable forms; save creates a private Personal version and leaves the shared source unchanged. Personal items update in place.
- Indian recipes appear in the same library. No separate dishes destination.
- Preparation notes, minimum-unit choices and ingredient type persist; duplication preserves recipe-line settings.
- No cross-studio reads/writes; no arbitrary external ingredient references.
- Loading/empty/error states, keyboard operation and 360px layout verified.

- Combined System library contains all 1,099 source recipe IDs and 136 Indian recipes.
- Source recipes have named ingredients, available preparation steps, images and correct per-serving nutrition.
- A source import retry preserves IDs and creates no additional recipe or ingredient lines.

Verified 2026-10-30: 1,235 active development recipes confirmed in the API and browser; 360 API scenarios pass; all workspace typechecks and changed-file lint pass. Recipe import rerun adds zero duplicates.

Latest interaction/header refinements were code-only at the founder’s request; no tests, typechecks or browser checks were run after those edits. Founder UI acceptance remains pending. Phase C is not started.
