# Nutrition library data

- USDA FDC: SR Legacy 2018-04 and Foundation 2025-04-24 bulk CSVs. Per 100 g,
  energy 1008 with 2048/2047 Atwater fallbacks, no invented zero nutrients.
- IFCT: immutable `@ifct2017/compositions@2.0.8` (2022) npm archive. Runtime verifies
  version, MIT license metadata and the archive's LICENSE text before import.
  The distribution notice is retained in `docs/licenses/ifct2017-MIT.txt`. Actual archive contains 542 rows,
  540 unique new names on the first import; two names overlap existing imports.
- Makhana, popped: NIFTEM PMFME Makhana handbook table 1.1, popped column,
  https://niftem.ac.in/newsite/pmfme/wp-content/uploads/2022/08/makhanawriteup.pdf
  (358 kcal, protein 8.7 g, carbs 79.8 g, fat 0.5 g / 100 g).
- Dry Nutrela soya chunks: labelled composition transcribed by retailer, recorded
  2026-10-30, https://www.zepto.com/pn/nutrela-soya-chunks/pvid/539c4597-aef4-4a48-8781-a3f4698d0a51
  (354.14 kcal, protein 53.19 g, carbs 33.5 g, fat 0.82 g / 100 g). Database
  stores kcal as rounded integer, consistently with the other imports. This is a
  named branded ingredient, not a claim that every soy chunk brand has that profile.

Indian recipe formulations and instructions are original, with explicit batch weights,
not copied Coachway content. They implement all 136 dish names in the supplied Indian
reference, in the ordinary Recipes library. Some use home-prepared variants, described
in their instructions. Nutrition represents listed ingredients divided by servings,
not a laboratory analysis of the finished dish; water evaporation, retained frying oil
and serving yield vary. System recipes have no third-party recipe images.

Run `pnpm --filter @traiv/api setup:nutrition` to migrate + seed ingredients, then
`pnpm --filter @traiv/api seed:recipes`. Add `--test` when invoking either script
directly with `pnpm exec tsx` from apps/api to use TEST_DATABASE_URL. Seeds report
added/updated/skipped counts; recipe seed reruns preserve existing seed rows.

## Coachway catalogue (founder-requested import)

The founder clarified that `recipes-api-full.json` is also import data, not just a UI
reference. It contains 1,099 recipe IDs with 6,849 weighed ingredient lines. The
authenticated detail export `recipes-api-details.json` resolves all 664 ingredient IDs
to actual names and provides instructions and tags. No token or request headers are
retained in that export. Twenty-three recipes genuinely have no preparation steps.

Run `pnpm --filter @traiv/api seed:coachway-recipes` after migrations. Every source
recipe uses `seed_key = coachway:<source-id>`; identical titles remain separate records
when their source IDs differ. Repeated imports update metadata, preserve IDs and do
not duplicate ingredient lines. All batch macros are validated against original
ingredient snapshots, then displayed per serving. Source weights are normalised to
grams. Source ingredient profiles are stored independently of FDC/IFCT by data source,
with the extended micronutrient data retained. Original recipe image URLs are used.

The combined System catalogue is 1,235 recipes (1,099 + 136).
