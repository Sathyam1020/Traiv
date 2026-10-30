# 0028 — Edit nutrition library items without a manual duplication step
2026-10-30 · Status: accepted by founder

## Context
The founder supplied Coachway screenshots and requested editable ingredients and
recipes, the matching ingredient table/edit sheet, and cleaner dropdowns before Phase C.
The previous System read-only UI was obstructing that workflow (ADR 0026).

## Decision
System records open in editable forms. Saving creates a private Personal version with
an ID retained across retries; the shared source remains unchanged. Personal records
continue updating in place. This removes the manual Duplicate prerequisite while
preserving tenant isolation. Recipe saves open the resulting Personal record.
Existing PATCH authorization on shared source records remains enforced server-side.
The UI explains where System changes are saved. Personal and System entries remain
separately visible/filterable; this is not an invisible global override mechanism.

Migration 0029 adds nullable ingredient nutrient_type, nullable recipe-line
preparation_note, and minimum_unit_amount defaulting to all. Valid choices are whole,
halves, quarters, all. This stores scaling granularity for future meal planning; it does
not round a coach's manually typed recipe quantity or implement Phase C.
Source ingredient types are synced from the existing source export. Existing weights,
macros, recipes and studio records are preserved.

Dropdowns use anchored Radix poppers with neutral selection fills, consistent padding,
and rounded surfaces. Ingredient rows use distinct protein/carbs/fat icon colours, a
separate category column, country indicator, and System/Personal badge, following the
founder's supplied reference. Shared macro semantic tokens support both themes.

## Consequences
No dependency, no new branch, no Phase C. Shared Select styling also improves other
Select usages. A second save starts from the Personal record; creating another version
from the original remains an explicit independent creation and preserves uniqueness rules.

## Founder interaction corrections

The founder subsequently requested: no ingredient ordering arrows; pointer/touch and
keyboard drag handles for instruction ordering; a settings sheet for Edit recipe;
Save enabled only when the saved recipe differs; collapsible micronutrients; rounded
sheet entry corners; compact recipe filters; solid silhouettes only for desktop sidebar
navigation, theme and account icons. These explicit instructions override the earlier outline-only
sidebar convention. The existing motion dependency handles ingredient expansion.
The founder explicitly requested no further testing for this correction and will test
it personally. Phase C remains on hold.
