# Workflow design

See `architecture.md` for why this is a timer-driven cycle, not a job-queue consumer,
at the top level, and `database-design.md` for `seo_workflow_runs`/`seo_workflow_steps`.

## Daily cycle (master prompt §17)

```
1.  Check budget + system health            (deterministic; read seo_provider_usage)
2.  Sync GSC since last checkpoint          (gsc-integration.md)
3.  Discover keyword opportunities          (keyword-intelligence.md)
4.  Refresh competitor observations if due  (competitor-intelligence.md)
5.  Deduplicate candidate opportunities     (deterministic — slug/semantic overlap)
6.  Score and rank candidates               (opportunity-scoring.md; deterministic)
7.  Select the best eligible candidate, or NO_ACTION if none clears the threshold
8.  Decide CREATE_NEW / UPDATE_EXISTING / CONSOLIDATE / EXPAND_CLUSTER / MONITOR / SKIP
9.  Generate a research brief                (content-generation.md)
10. Retrieve credible sources                 (research-and-verification.md)
11. Build the claim ledger                    (research-and-verification.md)
12. Draft content                             (content-generation.md — multi-stage)
13. Factual verification pass                 (research-and-verification.md)
14. SEO validation pass                       (quality-assurance.md; deterministic)
15. Originality review                       (quality-assurance.md)
16. Create an approval task (seo_approvals)   — cycle's autonomous portion ends here
17. [separate, human-triggered] approve
18. [separate, human-triggered] schedule/publish
19. Post-publication verification              (publishing-design.md)
20. Monitoring folded into the next day's GSC sync
21. Observations feed the next day's scoring   (performance-feedback.md)
```

Step 7 is load-bearing: **a valid outcome is `NO_ACTION`**, every day, forever, if
nothing clears the opportunity-score threshold. The orchestrator must never force a
selection to avoid an empty day — that's the literal thing the master prompt's
"operating philosophy" (one excellent article beats ten generic ones) exists to
prevent, and it has to be enforced in code (a real `if (best.score < threshold) return
NO_ACTION`), not left as an aspiration.

## State machine (master prompt §12)

```
DISCOVERED → SCORED → BRIEF_READY → RESEARCHING → DRAFTING → VERIFYING → SEO_QA
  → READY_FOR_REVIEW → APPROVED → SCHEDULED → PUBLISHING → PUBLISHED → MONITORING

           also reachable at any point before PUBLISHED:
REJECTED · REVISION_REQUIRED · FAILED · PAUSED · ARCHIVED
```

Each transition is one function, in one place
(`apps/api/src/features/seo/orchestrator.ts`'s state-machine module), that:
1. validates the current state allows the transition,
2. performs the transition's actual work,
3. writes the new state + a `seo_workflow_steps` row (what happened, when, evidence),
4. never allows two transitions to race on the same article (a single `UPDATE ...
   WHERE status = $expected` — the same optimistic-concurrency pattern already used
   elsewhere in this codebase, e.g. `training_session`'s `for update` lock pattern).

`REVISION_REQUIRED` returns to `DRAFTING` with the reviewer's notes attached; it does
not restart research unless the reviewer explicitly flags the brief itself as wrong.
`FAILED` is reachable from any in-flight state and always carries the error that caused
it (mirrors the `job` table's own `error` column — findable, not silently dropped).

## Reliability requirements (master prompt §17)

| Requirement | Mechanism |
|---|---|
| Durable job state | Every in-flight article's state lives in Postgres (`seo_articles.status`), not memory. A process restart loses nothing — the next tick resumes from the stored state. |
| Idempotent handlers | Every write is `ON CONFLICT DO NOTHING`/`DO UPDATE` on a stable key (client-minted ids, same convention as `product_event`'s dedup key), so a retried step is a no-op, not a duplicate. |
| Retry + backoff | Reused directly from `job.ts`'s existing `fail()` — exponential backoff already implemented (`BACKOFF_BASE_SECONDS * attempts²`), reused unmodified for any step wrapped as a job. |
| Dead-letter handling | `job.status = 'failed'` after `maxAttempts` *is* the dead letter — a findable row with its error, not a log line. The admin Workflow Operations view (`admin-dashboard.md`) surfaces these. |
| Job timeouts | Every provider call (`providers/*`) carries an `AbortSignal.timeout(...)`, same convention as `food-label.ts`'s 45s / blog API's 8s. |
| Concurrency limits | The orchestrator's busy-flag (one cycle at a time) plus the job worker's existing drain-cap (10/tick) — no new concurrency primitive needed. |
| Cancellation / pause / resume | `PAUSED` state + an admin action; resuming re-enters the state machine at the paused step. |
| Manual reruns | An admin action that re-triggers one named step (e.g. "re-run SEO_QA") without replaying the whole pipeline — requires the step's inputs to be stored, not just its output (see `database-design.md`'s `seo_workflow_steps.input_snapshot`). |
| Checkpoint recovery | `seo_workflow_runs` records the last fully-completed daily cycle, same role as `analytics_checkpoint`. |
| Distributed locking | Not needed at current scale (one API process). If Option B/C is ever adopted (`architecture-decisions.md`), revisit with Postgres advisory locks, the same primitive `claim()`'s `FOR UPDATE SKIP LOCKED` already relies on. |
| Scheduled-job dedup | The busy-flag plus the `seo_workflow_runs` checkpoint — a tick that finds today's run already complete is a no-op. |
| Dependency-failure handling | A step whose upstream data is missing (e.g. no GSC data yet) degrades its confidence score rather than failing — see `opportunity-scoring.md`'s evidence-completeness tracking. |
| Provider outage handling | Caught at the `providers/` boundary, surfaced as a failed step with the provider's error attached, never silently swallowed. |
| Duplicate publication prevention | `publishing.ts`'s publish function is itself idempotent on `seo_articles.id` + a monotonic revision check — publishing the same approved revision twice is a no-op, not two posts. |

## What is explicitly not built

No in-memory-only long-running process. No separate orchestration engine (Temporal,
Airflow, etc.) — unwarranted at one-pipeline-per-day volume, and absent from the
dependency list per `architecture-decisions.md`'s own non-goals.
