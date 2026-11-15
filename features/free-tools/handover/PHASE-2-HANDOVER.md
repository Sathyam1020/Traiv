# Free tools: Phase 2 handover (for Codex or the next agent)

2026-11-15 · Branch `feat/free-tools-expansion` (not pushed) · Read `CLAUDE.md`, `features/free-tools/plan.md`
and ADR `.ai/decisions/0036-free-tools-parity.md` first.

## Where things stand

| Phase | Status |
|---|---|
| 0 Foundation | Done, committed (`d6d54c9`) |
| 1 Nutrition (28) + income/rate calculators | Done, committed (`d6d54c9`), 30 tools live |
| Light-layout revert | Committed (`515bf0c`). **Keep the light layout. The founder rejected the dark hero/result panels.** |
| **2 Strength (19 tools)** | **In progress, uncommitted (details below)** |
| 3–8 | Not started (see plan.md §5) |

## Phase 2: done (uncommitted)

- `packages/calculators/src/strength.ts`: 1RM (Epley/Brzycki), percent table, Wilks (original 1994 coefficients),
  DOTS, IPF GL (2020, classic/equipped), Sinclair (2021 coefficients), RPE chart, warm-up ramp, plate loading,
  tempo, volume bands, strength standards.
- `packages/calculators/src/programs.ts`: workout plan builder and injury exercise swap (rule-based).
- Tests: `test/strength.test.ts`, `test/programs.test.ts`. **63 pass** (`cd packages/calculators && pnpm test`).
- `package.json` exports `./strength` and `./programs` (modified, uncommitted).
- Widgets (typecheck clean): `apps/web/src/app/tools/_components/widgets/strength.tsx` (1RM family, Wilks, DOTS,
  Wilks+DOTS, IPF GL, Sinclair, RPE, RIR, tempo, warm-up, plates, standards, volume) and `.../widgets/programs.tsx`
  (plan builder, injury swap).
- **Copy written and passing the length gate (10 of 19):** one-rep-max, bench-press, squat, deadlift,
  overhead-press, wilks, dots, wilks-dots, ipf-gl-points, sinclair (in `apps/web/src/content/tools/copy/`).

## Phase 2: remaining

1. **Copy for 9 tools.** Generate with the scripts in `handover/scripts/` (see "How copy is produced").
   - Drafted, not yet passing (in `copy_d3.py` + `d3_extra.py`): `rpe-calculator`, `rir-calculator`, `tempo-calculator`,
     `warm-up-set-calculator`, `plate-loading-calculator`. Last dry-run counts vs gate (gate = researched words − 150):
     rpe 1959/2753, rir 2135/3205, tempo 1657/2820, warm-up 1518/2306, plates 2012/3443. Add more **original**
     sections to `d3_extra.py` until all pass, then run the script with the real copy dir as `OUT`.
   - Not started: `strength-standards-calculator` (researched 2887 words, 8 FAQs, prompt + AI links + demo + sources),
     `weekly-training-volume-calculator` (2878, 6 FAQs, demo), `workout-plan-builder` (2954, 5 FAQs, demo),
     `injury-exercise-swap` (1998, 4 FAQs, demo). Write a `copy_d4.py` modelled on `copy_d3.py`.
   - FAQ counts and section flags must match `features/free-tools/research/coachway-tool-specs.json`
     (`faq_count`, `has_copy_prompt`, `has_ai_research`, `has_demo`, `has_sources`).
2. **Register all 19** in `apps/web/src/content/tools/registry.ts` (`COPY` map + imports) and
   `apps/web/src/app/tools/[slug]/widgets.ts` (`WIDGETS` map). Widget export names: `OneRepMaxWidget`, `BenchWidget`,
   `SquatWidget`, `DeadliftWidget`, `OhpWidget`, `WilksWidget`, `DotsWidget`, `WilksDotsWidget`, `IpfGlWidget`,
   `SinclairWidget`, `RpeWidget`, `RirWidget`, `TempoWidget`, `WarmupWidget`, `PlateLoadingWidget`,
   `StandardsWidget`, `VolumeWidget` (strength.tsx); `PlanBuilderWidget`, `InjurySwapWidget` (programs.tsx).
   The typecheck fails if a slug has copy without a widget.
3. Verify (all must pass):
   - `cd apps/web && pnpm typecheck && pnpm build` (build works without the API).
   - `pnpm start --port 3004`, then `python3 -I handover/scripts/compare.py <scratch-with-pages> <slugs…>`. The
     Coachway page HTML used for comparison was in a temp dir; re-download with
     `curl -sL https://coachway.io/tools/<slug>/` into a folder named `pages/` if you need to recompare. Each
     tool page must have **≥ the researched word count** on the rendered page.
   - `pnpm audit:responsive` (add the 19 routes to `scripts/responsive-audit.mjs`), must print `clean`.
   - Keyboard: `node handover/scripts/keyboard.mjs http://localhost:3004/tools/<slug> 60`, expecting
     "without visible focus: 0; without accessible name: 0".
4. Update `.ai/state/current.md` and the plan status, then commit Phase 2 (stage only free-tools paths; the repo
   has unrelated untracked files: lead-intelligence, reports, research_notes, AGENTS.md, ADR 0033, docs/seo-autopilot,
   outputs. **Do not stage those.**). Restore `apps/web/next-env.d.ts` with `git checkout` before committing (dev server
   rewrites it).

## How copy is produced

- `copygen.py`: turns Python data into a `ToolCopy` `.tsx` file. `write_checked(path, data, target)` refuses to
  write if word count < target. Blocks: string = paragraph; `("ul", [...])`, `("ol", [...])`, `("table", head, rows)`.
  `"**Bold.** rest"` in list items becomes bold.
- `copy_dN.py <scratchpad> <OUT>`: page drafts; `dN_extra.py`: extra sections merged in. Use a dry-run `OUT`
  first, then `apps/web/src/content/tools/copy` once all print OK. Scripts import from `sys.argv[1]/scripts`,
  so pass the `handover` folder as the first arg (it contains `scripts/`) or adjust the paths.
- The page itself adds ~200 words around the copy, so the gate is researched count − 150.

## Rules and lessons (the founder cares about these)

- **Never copy Coachway's text.** Match tools, inputs, defaults, options, result layout, section order, FAQ counts and
  page length; write all prose ourselves. ADR 0036.
- **Length must be ≥ Coachway per page.** Drafts consistently come out at about half the intended words, so always
  check with the counter rather than guessing.
- **Verify every worked example against the engine** before writing it. Several examples were wrong and had to be
  corrected (e.g. DOTS, IPF, Sinclair). Use a temporary `test/zz.test.ts` that console.logs values, then delete it.
- No placeholder phrases (an earlier draft leaked "wait," into copy). Proofread new sections.
- Voice: `.ai/design/voice.md`: sentence case, no exclamation marks, no banned words.
- Defaults match Coachway (imperial-first where they are). No India-specific tools or defaults (founder decision).
- Light layout only. No dark hero/result panels.
- Phases 3–8 follow the same pattern; Phase 8 (AI discoverability) is in plan.md §5.2.

---

## Update 2026-11-16: Phase 2 committed, Phase 3 started

- Phase 2 committed as `9b25612` (49 tools live). Review fixes applied before commit: FAQ questions reworded away
  from competitor phrasing, plate checkboxes bound to labels by id, ADR 0036 no longer points at `/tmp`.
- **Phase 3 (body composition, 11 tools), in progress and uncommitted:**
  - Done: `packages/calculators/src/body.ts` (BMI, US Navy body fat, ACE bands, FFMI + normalised, ideal weight
    Devine/Robinson/Miller/Hamwi, lean body mass by %BF or Boer, Lee 2000 skeletal muscle, waist-to-height,
    waist-to-hip with WHO limits, weight-loss percent, recomp via Katch-McArdle), export `./body`,
    `test/body.test.ts`. **77 tests pass.**
  - Remaining: 11 widgets (new `widgets/body.tsx`), 11 copy files at or above researched length with matching FAQ
    counts and flags (see specs JSON), registration, build, compare, 360px audit, keyboard, commit.
  - Research defaults: BMI metric-first (kg/cm); body fat and Navy imperial-first with a sex dropdown and hip only for
    women; recomp 180 lb / 22% → 15%, moderate activity; FFMI imperial; ideal weight 5 ft 11 in / 180 cm, male;
    lean body mass 185 lb, 5 ft 10 in, 18%, with a %BF or Boer switch; muscle mass age 30, 185 lb, 5 ft 10 in;
    waist-to-height 80 / 180 cm; waist-to-hip 90 / 100 cm; weight-loss % 90 → 84 kg, optional goal and timeframe.
  - Medical-adjacent copy (BMI, body fat, ratios) needs disclaimers; Lee 2000 omits the ethnicity term (say so).

## Update 2026-11-16: Phase 3 done

All 11 body composition tools are live (60 in total), with copy generated by `scripts/phase3_a.py`, `phase3_b.py`
and `phase3_c.py` (plus `*_extra.py`) and passing every gate: length, FAQ counts, flags, 360px and keyboard. Next is
Phase 4 (cardio), following the same pattern.

## Update 2026-11-16: Phase 4 done

All 11 cardio tools are live (71 in total). Copy is in `scripts/phase4_*.py`, and browser scenarios are in
`scripts/phase4-scenarios.mjs`. `NumberField` now accepts decimals (`step="any"`); it used to block submits silently.
Next is Phase 5 (business).
