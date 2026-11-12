# Testing strategy

Follows this repo's own stated doctrine (`.ai/engineering/testing.md`: "our approach is
deliberately unusual") — real database, real HTTP, scenario-shaped tests, no mocks,
matching the 207-scenario precedent already in place.

## Unit tests — event contracts
- Each `event_definition` Zod shape: valid payload accepted, extra/missing required
  fields rejected, a payload containing an excluded field (raw health value, free text)
  rejected at the schema level, not just "stripped silently."

## Integration tests — ingestion
- Post a batch of events (scenario-style, real HTTP against the real API): assert all
  persist, assert a repeated post (same client-minted ids) doesn't duplicate rows.
- Post an event with an unknown `name`: assert it's rejected with a clear error, not
  silently stored (schema drift should be loud, not swallowed).

## Identity resolution tests
- An event with no `userId` (should never happen for product events, only
  `analytics_event`) is rejected at ingestion — product events require an authenticated
  session, enforced the same way every other authenticated route is.

## Attribution tests
- A signup with UTM params present: `acquisition_attribution` row has the exact
  first/last-touch values from that request.
- A signup with no UTM params (direct traffic): row exists with null source/medium,
  never silently dropped as "no attribution data at all."

## Funnel correctness tests
- Seed a known sequence of events for several users across different completion depths;
  assert the funnel endpoint reports the exact expected step counts and drop-off
  percentages — this is a pure-function-over-known-input test, the easiest kind to get
  exactly right and the easiest to silently get wrong.
- A user who completes steps out of order (e.g. `workout_session_completed` logged
  before `client_joined` due to a client clock issue) is still counted correctly, because
  ordering uses `receivedAt` (server time), never `occurredAt`.

## Cohort calculation tests
- A known signup-week cohort with known retention events produces the exact expected
  retention percentage at each week offset.

## Revenue reconciliation tests
- Deferred — no revenue system exists yet (`metric-definitions.md`). This section is a
  placeholder for when Phase "Future" ships: the eventual test is "sum of
  `revenue_snapshot.mrr` changes reconciles against the billing provider's own reported
  MRR for the same period, within a documented tolerance."

## Authorization tests
- Every analytics read route rejects a non-admin session (same shape as the existing
  `cors.test.ts`-style verb/permission assertions already in this repo).
- A studio-scoped drilldown query cannot be parameterized to return another studio's raw
  events (the tenant-isolation guarantee from `privacy-security.md`, tested directly).

## Load tests
- Ingestion route under a batch size at the upper bound (20 events/batch, matching the
  existing `/m/collect` precedent) — assert latency stays acceptable (see
  `implementation-roadmap.md`'s SLOs) at the Phase-1 realistic volume
  (`architecture-decision.md`'s 100-trainer estimate: ~30k events/day, well under any
  load-test concern for a single Postgres instance).

## Retry and deduplication tests
- Simulate a client retrying the same batch after a dropped response: assert exactly one
  copy of each event persists.

## Offline PWA synchronization tests
- Mirror the existing (or to-be-confirmed) workout-outbox test shape: queue an event
  while offline, kill and reopen the app, confirm the queued event survives and flushes
  exactly once on reconnect, with the "only the latest intent matters" overwrite
  semantics the workout outbox already documents for its own queue.

## Data deletion tests
- A user-deletion request removes that user's `product_event` rows immediately
  (`privacy-security.md`); a non-deletion-requested user's rows survive the normal 90-day
  retention window unaffected by an unrelated deletion.

## End-to-end admin analytics tests
- Seed a realistic small dataset, load each of the 12 nav pages, assert each renders its
  stated KPIs without error — a smoke test across the whole surface, not deep assertions
  per page (those live in the more specific tests above).

## Representative edge cases
| Case | Expected outcome |
|---|---|
| Event posted with a future `occurredAt` (clock skew) | Accepted; `receivedAt` (not `occurredAt`) governs every calculation |
| Two devices for the same user post overlapping sessions | Both `analytics_session` rows exist; DAU counts the user once, not twice |
| A studio is deleted mid-rollup-job | Rollup job does not crash; that studio's partial-day numbers are excluded from the completed rollup, picked up correctly (as "studio no longer active") in the next run |
| Rollup job crashes mid-run | `analytics_checkpoint` reflects the last *successful* run, not a partial one — a retry reprocesses the same window rather than silently skipping it |
