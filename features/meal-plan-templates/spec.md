# Meal plan templates — Phase C

Approved flow: Mealplans → Create settings sheet → automatically populated Draft builder
→ refine / same Edit sheet → Publish → Mealplans list (Live).

Fixed list/builder headers, rounded two-column settings sheet, 2000 kcal, four options
per meal, 30/40/30 macros, breakfast/lunch/dinner 25/35/40 with snacks disabled.
Percent/gram input conversion, presets, preference/allergen chips, reordered/custom meals
and distribution slider; source and matching settings. Builder has actual choice ranges,
meal targets, cards, recipe selector, quantities, compare, lock, save Personal recipe.
Edit configuration preserves choices and fills/rescales unlocked options. Shortages are
visible. Published version stays separate from saved draft. Studio isolation, repeat-safe
creation and stale-save protection. No client assignment, logging or invented DV scores.

Recipe cards open a right-hand meal sheet with a scrollable list of collapsible recipe
editors and fixed Previous/Done/Next footer. Each editor supports ingredient add/remove,
quantity/unit updates, compare, lock, Personal save, nutrient disclosure and Show/Hide
Steps. Steps are editable, reorderable, removable and addable using RecipeSteps. Changes
flow to the device draft immediately and persist through the plan's Save changes action.
