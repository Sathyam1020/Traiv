# 0026 — One shared Recipes library, including Indian recipes

2026-10-30 · Accepted by founder in this chat. Extends ADR 0025.

The approved scope combines nutrition phases A and B. Indian recipes live inside
the ordinary Recipes library. No separate dish destination or import product flow.

System recipes have nullable studio_id and source=system. They are readable by every
studio, immutable through coach routes, and duplicable into independent Personal recipes.
The database checks ownership and gives seeds a stable unique seed_key.
The supplied Coachway export was initially treated as a behavioural reference. The founder
clarified on 2026-10-30 that **both files must populate the same library**, and supplied
authenticated API access to resolve the list export's missing ingredient names and steps.
That clarification supersedes the earlier reference-only interpretation.
All 136 Indian reference names have original weighed formulations and instructions.
Nutrition is calculated from ingredient composition and serving counts, through one
shared module used by the API and trainer editor. Sources and limitations live in
`docs/nutrition-data.md`. No recipe has invented stored macro totals.

IFCT is pinned to the immutable npm archive @ifct2017/compositions@2.0.8 rather than
a Git commit: the existing groundwork already chose this archive. The seed checks both
its package metadata and actual MIT LICENSE text before writing any rows, and the
notice is retained in the repository. The archive contains 542 rows.

System ingredient name + data source have a partial unique index, making batch seed upserts safe
against concurrent reruns. Recipes use transactional edits, expectedUpdatedAt conflicts,
and device-local drafts scoped by studio and recipe. A serving conversion referenced
by an existing recipe cannot be edited until that recipe uses grams.

Recipe ingredient and meal-plan recipe FKs use NO ACTION rather than RESTRICT, so
whole-studio cascade deletion can complete. Test cleanup removes recipes before
membership SET NULL cascades: PostgreSQL data-modifying CTEs cannot safely update
and delete the same child in one statement.

Meal-plan templates, client assignment and client food logging remain later phases.

The expanded catalogue imports 1,099 source recipes plus 136 Indian recipes, preserving
distinct source IDs even when titles match. A detail export supplies 664 named ingredient
profiles and preparation steps. Twenty-three source records have no steps; they remain
empty rather than receiving fabricated instructions. Macro totals are checked against
all original ingredient snapshots before any write, and servings divide the batch totals.
Ingredients are unique per name + source so imports do not overwrite FDC/IFCT profiles.
Source images remain their original URLs. The bearer token was temporary and removed;
no credentials are stored in the repository or evidence exports.
