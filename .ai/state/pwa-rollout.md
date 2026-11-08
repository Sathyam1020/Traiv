# PWA rollout — in progress

**Status:** All phases done or deferred — 0–6, 8, and the final verification pass
complete; 7 deferred by founder. Two real gaps found during the final pass and fixed
(trainer mobile header + two client screens missing `safe-area-inset-top`); two more
found and flagged for a decision, not fixed (trainer's session-tab reorder has no touch
support at all; iOS status-bar-style is worth revisiting now that the safe-area gap
under it is fixed). Not deployed, committed, or pushed —
none of this work has been committed to version control yet; every change so far exists
only in the working tree. Do not commit/push without separate explicit approval.

## Why this file exists

The implementation plan that drives this work was agreed in conversation and never
written down, which is exactly the kind of thing that gets mis-remembered across a long
session or a fresh one. This file is the durable record. Read it before resuming or
reporting on this initiative; update it after each phase closes.

## The approved scope (verbatim, from the founder's approval message)

Both `apps/client` and `apps/trainer` get a PWA pass, governed by these six requirements:

1. Treat both Client and Trainer as mobile-first applications. Trainer must also deliver
   an excellent native-quality mobile experience, not just basic installability. Keep
   offline capabilities proportional to actual workflows.
2. Safe service worker update handling is in the P0 scope. Updates must never interrupt
   active workouts or discard pending mutations.
3. localStorage vs IndexedDB for the workout outbox: chosen on reliability, storage
   limits, multi-tab behaviour, and recovery — not simply on fewer dependencies.
4. Explicit native-quality UX verification for navigation, gestures, transitions,
   keyboard handling, safe areas, and installed PWA behaviour.
5. Offline workout writes need server-side idempotency, correct conflict handling, and
   durable recovery.
6. Preserve the existing design system, architecture, functionality, and working
   implementations. Avoid unnecessary rewrites.

Standing rules for every phase, not just the first:
- No deploy, commit, or push without separate explicit approval.
- Never claim real-device verification unless it was actually performed — identify
  explicitly what the founder needs to test manually.
- Prioritize reliability, performance, and genuine native feel over cosmetic polish or
  unnecessary abstraction.
- For each phase: implement the approved scope, run relevant tests, verify acceptance
  criteria, report what changed / what was tested / what remains a risk — before moving
  to the next phase.

## Phase order (revised after Phase 0 findings)

Phase 0 (research/verification) found the backend already has solid idempotency on
set-logging and session completion, which narrowed Phase 3 to client-only work, and
reordered later phases accordingly.

| Phase | Scope | Status |
|---|---|---|
| 0 | Verification pass: read the real backend idempotency, real rest-timer code, real SW registration, before planning further | **Done** |
| 1 | Rest-timer correctness: deadline-timestamp based countdown that survives backgrounding (`active/page.tsx`) | **Done** |
| 2 | Shared `error.tsx`/`loading.tsx` route conventions across both apps (`RouteError`/`RouteLoading` in `packages/ui`) | **Done** |
| 3 | Offline workout outbox (IndexedDB via `idb`, client app only) + safe service-worker update handshake (both apps) | **Done** |
| 4 | Trainer mobile-native-quality pass: manifest, icons, minimal offline worker, reduced-motion fixes | **Done** |
| 5 | Image optimization: `next/image` migration on the highest-traffic screens in both apps (not a full sweep) | **Done** |
| 6 | TanStack Query persistence for read-heavy data, both apps | **Done** |
| 7 | Notification content expansion | **Deferred by founder, 2026-11-08 — revisit in a proper build later, not part of this rollout** |
| 8 | Install-prompt UX | **Done** |
| final | Native-quality UX verification pass (requirement #4): navigation, gestures, transitions, keyboard handling, safe areas, installed-PWA behaviour — explicit simulated-vs-real-device distinction | **Done** (code-level; real-device checklist below is still the founder's to run) |

Full narrative detail on phases 0–5 (exact files touched, bugs found and fixed, what
was tested) lives in the conversation history, not duplicated here — this table is the
anchor; ask if the detail is needed and it isn't in context.

## Phase 6 — TanStack Query persistence (done)

**Goal:** read-heavy, fairly static data (exercise/recipe library, templates, roster,
workout programs) paints instantly from a local cache on reopen instead of a blank
loading state, and is available to browse while offline.

**Decisions made:**
- Persister: a small custom IndexedDB-backed `Persister` (3 methods: `persistClient` /
  `restoreClient` / `removeClient`) built on the `idb` package already added in Phase 3
  for the client outbox — reused rather than adding a second key-value library
  (`idb-keyval`, which the official docs example uses) for the same job. `idb` is now
  also a dependency of `apps/trainer` (previously client-only).
- New dependency: `@tanstack/react-query-persist-client`, pinned to the exact same
  version as the already-installed `@tanstack/react-query` (`5.102.8`) for lockstep
  compatibility — not latest (`5.107.1`).
- Persistence is **allowlisted**, not everything: `shouldDehydrateQuery` only persists
  specific query-key prefixes, never `auth.*` (session/config must always be freshly
  verified, never served from a stale cache) and never per-client sensitive data
  (a studio's own `client.*` detail, a client app user's `me`/`intake`/live
  `workout-session`). The client app's existing bespoke `today`-reveal localStorage
  cache is left untouched rather than duplicated through this new mechanism.
- Privacy: logout must deterministically clear the persisted store (not just rely on
  the throttled auto-persist eventually overwriting it with an empty cache) — a shared
  device with two different accounts signing in/out must not flash one account's cached
  data to the next.
- `gcTime` on the query client must be raised to match `maxAge` (24h), or in-memory
  garbage collection discards queries before they're useful to persist — a documented
  TanStack gotcha, not optional.

**Implemented:** `apps/{trainer,client}/src/lib/query/persist.ts` (the IDB persister +
`shouldPersistQuery` allowlist), `provider.tsx` in both apps wraps
`PersistQueryClientProvider`, both `useLogout` hooks call `idbPersister.removeClient()`
explicitly. `.ai/engineering/dependencies.md` has the full justification.

**Tested:** `tsc --noEmit` clean on both apps; `biome check` clean on every touched
file; real production builds (`next build --webpack`) pass on both apps, `/link-phone`
and every other route generates correctly. Dev servers restarted and live.
**Not tested:** no browser verification of actual persistence behaviour (open app,
go offline, reload, confirm cached data shows) — the Chrome extension isn't connected
in this environment. This needs manual verification: sign in, browse a persisted
screen (e.g. Clients, Exercises, Templates on trainer; Workouts on client), reload with
network off, confirm the data is still there; then sign out and confirm a fresh
sign-in doesn't show the previous account's data.

## Phase 7 — Notification content expansion (deferred)

Deferred by the founder on 2026-11-08: "skip the notification thing, we'll think of
this later like in a proper build." Not started, not scoped. Revisit as its own task
when asked — do not infer scope from this file alone when that happens.

## Phase 8 — Install-prompt UX (done)

**Goal:** a custom, native-feeling "add to home screen" prompt for both apps, instead
of relying solely on each browser's own default install UI (which is inconsistent —
Chrome/Edge show a mini-infobar automatically; iOS Safari has no programmatic prompt at
all, only a manual Share-sheet action).

**Decisions made:**
**v1 (toast on page load) was built, then abandoned same day.** A toast timed off
`beforeinstallprompt` turned out to be untestable in practice. Chrome's real
install-banner heuristic requires genuine engagement across multiple separate visits
(not just clicking around once in one sitting), so during manual testing the toast
never appeared and there was no way to tell "Chrome hasn't decided this is installable
yet" apart from "the code is broken." The founder's call: stop fighting the heuristic,
put a button in Settings instead.

**v2 (shipped) — a button in Settings, not a popup:**
- `lib/pwa/install-prompt.ts` per app rewritten as a small global singleton: a
  `beforeinstallprompt`/`appinstalled` listener started once from `PlatformServices`
  (`startInstallPromptCapture()`), a `useSyncExternalStore`-based `useInstallState()`
  hook (`"unavailable" | "available" | "ios-manual" | "installed"`), and a
  `promptInstall()` function. `event.preventDefault()` still runs unconditionally on
  `beforeinstallprompt`, so the browser's own mini-infobar never fights with the button.
- A real UI piece in Settings: trainer gets an `InstallAppCard` on `/settings`; client
  gets an `InstallAppRow` at the bottom of the Settings list on `/you`. Both hidden
  entirely once installed; otherwise always present, specifically so "is the button
  there" is never itself a signal of whether something's broken — a missing button was
  exactly what made v1 undebuggable.
- Three visible states: a working **Install** button (state `available`); Share-sheet
  instructions with no button at all (state `ios-manual`, since iOS never fires
  `beforeinstallprompt`); or, if clicked before the browser has handed over a prompt
  (state `unavailable`), an inline message naming the fallback — the browser's own
  install menu item or address-bar icon — instead of doing nothing silently.
- Never shown if already standalone, and never inside the client app's native
  Capacitor wrapper (`Capacitor.isNativePlatform()`) — already installed, nothing to
  add.
- Client app's `platform-services.tsx` effect stayed split in two from the v1 change
  (SW-registration + install-capture in one, the existing health-sync polling in
  another) — unrelated to the v1→v2 swap itself, health-sync logic untouched.

**Tested:** `tsc --noEmit` and `biome check` clean on every touched file; real
production builds (`next build --webpack`) pass on both apps. Dev servers restarted —
hit a stale Turbopack dev-cache issue immediately after the rewrite (`.next/cache`
still referencing the deleted v1 export), fixed by deleting both apps' `.next`
directories and restarting; both now serve `/settings` and `/you` with no module
errors. **Not tested:** no real-device verification that a genuine `beforeinstallprompt`
from Chrome actually lands in the `available` state and the real install completes —
needs a manual check on actual Android/desktop Chrome (requires real engagement across
separate visits, which this environment can't simulate), and separately a check of the
iOS instructional row on a real iPhone.

## Final — native-quality UX verification pass (requirement #4)

No browser/device access in this environment, so this could only ever be a code-level
audit, not real verification — done via a fork across six dimensions (navigation,
gestures, transitions, keyboard handling, safe areas, installed-PWA behaviour), each
with file:line citations. Full audit transcript isn't kept here; this is the outcome.

**Fixed (real, scoped, low-risk):**
- `packages/ui/src/components/shell/mobile-header.tsx` had **zero**
  `safe-area-inset-top` handling at all (only hit for that inset in the whole trainer
  app was the toast, `apps/trainer/src/app/providers.tsx:27`) — on a notched phone in
  standalone mode, trainer's entire mobile header (logo, studio switcher, account) would
  render flush under the status bar/notch. Fixed: `h-14` → `min-h-14` +
  `pt-[env(safe-area-inset-top)]`, so the bar grows below the inset instead of being
  squeezed into it. Shared component, trainer-only impact (client passes `header={null}`
  and never renders it).
- `apps/client/src/app/(app)/dashboard/page.tsx` (Today, the default landing tab) and
  `apps/client/src/app/(app)/workouts/page.tsx` had plain `<Page>` headers with no
  top-inset handling at all, inconsistent with sibling screens (`/you`, `/vault`) that
  already do this correctly. Fixed on every return path on both screens (loading,
  error, and success states — 5 `<Page>` instances total) with
  `pt-[max(1.25rem,env(safe-area-inset-top))]` (1.25rem matches `Page`'s own default
  `py-5` top padding, so non-notched devices render unchanged).

**Found, not fixed — flagged for a decision:**
- `apps/trainer/.../templates/_components/session-tabs.tsx` reorders session tabs via
  native HTML5 `draggable`/`onDragStart`/`onDragOver`/`onDragEnd` only. This API has
  **no touch support** in Mobile Safari or Chrome Android — on a touchscreen the reorder
  silently does nothing, no fallback. Given requirement #1 ("Trainer must also deliver
  an excellent native-quality mobile experience"), this is a real mobile gap in the
  template builder specifically. Not fixed: building real touch-drag support (pointer
  events, long-press-to-grab, auto-scroll near edges, or a library like `dnd-kit`, which
  isn't currently a dependency) is a genuine feature, not a CSS tweak — too large to
  improvise inside a verification pass without the founder's go-ahead on approach.
- `appleWebApp.statusBarStyle: "default"` (both apps' `layout.tsx`) renders a light iOS
  status bar with dark text regardless of the app's own theme — worth a look in dark
  mode on a real iPhone, but changing it to `black-translucent` without also fixing the
  trainer safe-area gap above would have made things worse, not better; now that gap is
  fixed, this is worth revisiting, but it's a visual design call, not something to
  change unasked.

**Everything else audited was solid** — the shell's `fixed inset-0` architecture, the
client's hand-rolled swipe-to-delete (direction-locked, `touch-action: pan-y`), the
`useReducedMotion` adoption on every `motion/react` usage (1:1, all 6 files), the
keyboard-safety reasoning from an earlier phase (re-verified, still holds — though
still never actually exercised against a real fixed-position text composer, since
neither app has built one yet), both manifests' `viewport-fit: cover` + icon setup. See
the full per-dimension breakdown in conversation if needed — not duplicated here.

**Cannot verify without a real device — this is the actual manual checklist:**
1. Android Chrome, installed via the new Settings button: confirm no visual regression
   from the two safe-area fixes, and confirm standalone mode looks right generally.
2. A real notched/Dynamic-Island iPhone, Safari, **standalone (installed) specifically**
   — the gap this phase fixed is easy to miss in a regular Safari tab, where the
   browser's own chrome already occupies the unsafe area and masks it.
3. Same iPhone, both light and dark system theme — check the status-bar-style question
   above.
4. iOS Safari's edge back-swipe gesture on the client app's active-workout screen,
   specifically whether it conflicts with the hand-rolled swipe-to-delete on set rows.
5. The template builder's session-tab reorder on an actual touchscreen — confirm it's
   as broken as the code read suggests (should be: nothing happens on drag attempt).
