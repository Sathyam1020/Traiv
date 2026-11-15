# Phase 2 verification — 15 November 2026

Implemented all 19 strength/programming tools. There are now 49 live calculator/tool
routes plus templates. Nothing staged, committed or pushed.

## Checks performed

- All 109 Coachway pages downloaded successfully; 109 nonempty files. Manifest:
  `reference-manifest.json`. Reference HTML remains in `/tmp/traiv-phase2/pages/`.
- All 19 production-rendered pages meet or exceed their current reference word counts.
- All 19 match researched FAQ counts and demo/prompt/AI-research/source flags.
- Calculator suite: 67 passing scenarios, including plate-input rejection and low
  female-bodyweight IPF GL handling. Web TypeScript check passes.
- Production build passes with `pnpm --filter @traiv/web exec next build --webpack`.
  Default Turbopack build was attempted twice; this environment denies its CSS worker
  port binding, including the escalated attempt. This is recorded rather than claiming
  the default command passed.
- 360px browser audit: clean across all audited routes, including every Phase 2 page.
  Replaced the small native plate checkbox with Traiv's shared Checkbox control.
- Keyboard audit: every Phase 2 page has zero unnamed or invisible-focus tab stops.
- Production browser interaction scenarios pass: switch units twice, clear and restore
  a calculation, sum individual IPF lifts, handle a bodyweight below 40 kg, reject a
  below-bar target then calculate again, withhold loaded injury options then return
  to informational alternatives. Runner: `scripts/phase2-scenarios.mjs`.
- Worked RPE/RIR, warm-up and plate examples checked against the engine. RPE 6 reps
  at 8.5 with 80 kg gives approximately 100.2 kg; RIR 10 reps with 3 left at 70 kg
  gives approximately 105.4 kg.

## Approved formula changes and boundaries

- Wilks is now Wilks 2020 (Wilks-2), including the 600 normalisation constant.
- Strength bands use Strength Level published aggregate bodyweight ratios, dated
  15 November 2026, with explicit community/age/population limitations.
- IPF GL includes the optional squat, bench and deadlift inputs; their values update
  the total. The 40 kg bodyweight floor is disclosed in the result.
- Painful loading does not produce a rehabilitation schedule or loaded alternative.
  Empty equipment matches stay empty rather than falling back to gym equipment.
- Calculator results follow input and unit changes immediately, avoiding stale values
  displayed with a new unit label.

## Visual capture limitation

The screenshot-capture command was declined. No screenshot inspection is claimed.
The actual 360px geometry/touch-target audit and keyboard/interaction runs completed.
Founder supplied screenshots subsequently identified a shared content-width issue;
the narrow article Containers were changed to match the hero/calculator wide Container.

## Scope kept separate

The previously recorded Phase 1 cycling-floor issues, attribution bridge, keyword
research and phases 3–8 have not been silently included in Phase 2.
