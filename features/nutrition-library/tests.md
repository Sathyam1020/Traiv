# Scenarios

1. Second attempt: same creation id retried; no duplicate. Repeat save preserves lines.
2. Two actors: another studio cannot read or modify Personal rows; System duplicate
   changes only the copy. Concurrent stale save returns conflict.
3. Out of order: edit deleted recipe, reference deleted/foreign ingredient; reject
   without replacing existing recipe contents.
4. After expiry: expired session cannot mutate ingredients or recipes.
5. Abandoned halfway: saved recipe reopens unchanged; browser draft resumes unsaved edits.
6. Nutrition: grams and serving conversion, multiple servings, micronutrients, invalid
   conversions and zero servings; displayed totals match the same computation on reads.

7. Import retry with same-name source variants preserves both IDs; named ingredients and ordered steps survive; allergen tags stay separate from dietary tags. Duplicate to Personal and change servings without touching the source. Incomplete names or mismatched snapshot totals fail before writes.
