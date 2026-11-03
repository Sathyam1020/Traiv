# Client interaction polish — 2026-11-01

## Scope and audit

The existing light sapphire theme, navigation destinations, food flows, API contracts,
coach branding, and intake/check-in rules are retained. The pass uses existing Motion,
React Query, icons, and Wensity primitives. No dependency was added.

| Area inspected | Finding | Implemented response |
| --- | --- | --- |
| Shared design, client layout, mobile navigation | Shared primitives also serve trainer/admin; generic changes would spill over | Client stylesheet imported only by client root, scoped with `data-traiv-client` |
| Typography and responsive controls | Oversized display headings, small icon controls, inconsistent focus/press feedback | Responsive title scale, consistent tracking, coarse-pointer 44px targets, visible keyboard focus, restrained press feedback |
| Today/profile | Secondary data arrived as separate visual fragments; some errors could mask content | Fuller dashboard loading footprint, restrained page widths, explicit profile recovery |
| Workouts/program/session preview | Errors appeared as empty plans or missing workouts; predictable navigation fetched only after arrival | Contextual retry states, intent-driven prefetch, coherent workout header treatment |
| Start workout | Navigation awaited a second GET after a successful start | Seed authoritative start response into session cache |
| Active sets | Immediate UI completion already existed, but failure was unhandled; blur/completion writes could race | Serialize writes; ignore stale rollback effects; retain typed values; show retry; update session cache; block finish during outstanding/failed saves |
| Active loading | A failed initial request left `sets === null` and could show skeleton forever | Error branch precedes local-set loading branch |
| Set deletion | Pointer movement without active gesture; failed delete had no feedback; next set number could collide after middle deletion | Guard drag movement, respect reduced motion, retain row on failure, use max existing set number + 1 |
| Progress | Segment keys included fraction, remounting instead of animating | Stable keys, transform-based fills, accessible progress value |
| Rest timer | Nested bordered cards, decorative mute state, no explicit pause control | Compact single surface, pause/resume, edit/skip, visible completion state, progress transform, 180ms entrance/exit |
| Workout summary | Claimed completion before server save and could miss freshly saved sets | Truthful summary/save copy, cache continuity, failure recovery, success toast only after confirmation, clear completed live session from cache |
| Food/logging/libraries | Text-only loading caused jumps; raw request messages; weak retry/empty distinction | Matching skeletons, contextual recovery, sanitized nutrition messages, successful-empty states distinct from errors |
| Check-ins/onboarding | Failed reads could show empty history or endless onboarding loading | Contextual retry states while preserving existing drafts and validation |
| Exercise detail tabs | Roving tab focus lacked arrow/Home/End handling | Keyboard navigation, matching panel relationships, shorter reduced-motion-safe indicator transition |

## Client interaction contract

`apps/client/src/app/client-polish.css` defines 100ms press, 180ms state, 240ms panel
reference, a consistent easing curve, 44px touch targets, and a 48rem content reference.
It reuses the existing typography, semantic colors, control/surface radii, spacing
utilities, and Wensity shadows rather than introducing a second color system.
The accepted glass tab bar and shared sheet animations remain intact.
Only actionable rows use subtle press scaling. No general page entrance animation,
new decorative gradient, blanket blur, or card-hover lift was introduced.

## Data behavior

`use-workout-prefetch.ts` uses existing studio-scoped keys and a 60-second freshness
window on touch/hover/focus. It only performs reads. It never starts a workout.
`createSaveQueue` preserves write order and per-row intent revisions. Failed saves are
recoverable; failed completion resets that completion state while retaining numbers.
No offline success is fabricated, and whole nutrition entries are not optimistically
invented. Existing cached query data is retained during normal background refresh.

The rest timer's mute button previously changed only local icon state: no sound was
implemented. That misleading control was removed. Native haptics and timer sound were
not added to the current browser app. No PR badge or invented metric was introduced.

## Important files

- `apps/client/src/app/client-polish.css`: isolated client visual/interaction contract.
- `apps/client/src/components/common/query-state.tsx`: contextual recovery UI.
- `apps/client/src/app/(app)/food/_components/food-skeleton.tsx`: structural loading UI.
- `apps/client/src/app/(app)/workouts/[templateId]/[sessionId]/active/page.tsx`: saving/recovery.
- `apps/client/src/app/(app)/workouts/_components/rest-timer-card.tsx`: timer interaction.
- `apps/client/src/lib/query/use-workouts.ts`: start/finish cache continuity.
- `apps/client/src/lib/workouts/save-queue.ts` and `apps/client/tests/save-queue.test.mjs`.

Shared package edits are small compatibility fixes exposed by client validation:
calendar accepts a scalar weekday matcher, avatar indexing is undefined-safe and its
visual root has an image role/name, select group detection guards empty arrays.
No trainer/admin layout or business logic was changed.

## Verification and acceptance

- Targeted Biome format/lint: passed.
- Client TypeScript: passed.
- Save queue tests: 4 passed (ordered writes, stale result protection, retry after
  network rejection, independence of unrelated rows).
- Next production build with Webpack: passed. Default Turbopack hit an environment
  permission error while binding its CSS worker port; no project bundler setting changed.
- No existing client UI/integration test suite was found.
- Browser/device visual acceptance and real authenticated interaction tests remain
  pending. Build success is not evidence of physical-device correctness.

Manual acceptance should cover 320/393/430px widths, keyboard-open nutrition sheets,
set blur followed quickly by completion, slow/offline saves and retry, deletion while
saving, timer editing/pause/skip/completion, workout summary/finish/back navigation,
food logging from each entry point, tab keyboard navigation, reduced motion, and
an unusually long coach-generated exercise/recipe name.

Separate deeper work: persistent offline workout drafts; wall-clock/background timer
resilience; native sound/haptic integration if a native runtime is adopted; actual Chat
functionality. These are not silently added as part of visual polish.
