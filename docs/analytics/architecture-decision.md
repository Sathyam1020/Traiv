# Architecture decision

## The three options, evaluated against Traiv's actual current scale

Traiv today: a handful of real trainer accounts (verified directly against the Neon
database during this session — low single digits of real coaches, one EC2 instance, one
Express process). Any architecture recommendation has to be honest about this, not about
an imagined future scale.

### Option A — Postgres-only

Analytics events land in the **same Postgres database** Traiv already runs (or a sibling
Neon/RDS database if isolation is preferred later), in a dedicated `analytics` schema or
simply prefixed tables, written with the query builder for app code and raw `sql\`...\``
for every aggregate (matching the existing marketing-analytics precedent exactly).
Rollups run as `job` rows (reusing the existing `job` table, new `kind`), on a schedule,
writing into small daily-aggregate tables that the admin dashboard reads instead of
scanning raw events for every page load.

- **Complexity:** Lowest. No new infrastructure, no new service to deploy, no new
  credentials to manage. Every engineer already touching this repo already knows Postgres
  and Drizzle.
- **Cost:** $0 incremental — same Neon/RDS instance. At worst, one tier up on compute if
  the analytics table gets large (see below).
- **Ops burden:** None beyond what already exists. One database to back up, one to
  monitor.
- **Query performance:** Fine for the real volumes below. A well-indexed `count(*) filter
  (where ...)` over a table with low tens of millions of rows is the same shape of query
  the marketing analytics system already runs in production today, over a growing table,
  with no rollup at all.
- **Write throughput:** Postgres on Neon/RDS handles several thousand inserts/sec
  comfortably on modest hardware; Traiv's actual write volume (see estimates below) is
  nowhere close to that ceiling even at 10,000 trainers.
- **Retention:** Delete old raw rows past a retention window (same philosophy ADR 0021
  already states for marketing analytics: "when the table gets big enough to hurt, the
  fix is to delete old rows, not to summarise them"). Daily aggregates, once computed,
  don't need the raw rows that produced them.
- **Failure recovery:** A write that fails is retried by the same at-least-once/idempotent
  pattern used everywhere else in this schema (`onConflictDoNothing`, a client-minted
  UUIDv7 id). No separate recovery story to build.
- **Deployment complexity:** None — ships inside the existing API deploy.

### Option B — Postgres + ClickHouse

Keep Postgres for everything transactional; add a ClickHouse instance (self-hosted or a
managed tier) purely for event analytics, with a sync/ETL step moving rows across.

- **Complexity:** A second database technology, a second connection pool, a second thing
  to version/upgrade, and — critically — a sync pipeline that can itself fail, lag, or
  drift (exactly the "two products that silently disagree" problem ADR 0021 named as the
  reason PostHog/GA were rejected in the first place, just with ClickHouse instead of a
  SaaS vendor).
  honestly — your *own* second datastore, with no consent-banner win, carries the same
  joinability cost ADR 0021 was written to avoid.
- **Cost:** A ClickHouse instance (self-hosted = another server to run and patch on top
  of the single EC2 box already in play; managed ClickHouse Cloud = real monthly cost)
  that does nothing useful until event volume is large enough that Postgres aggregation
  is actually slow.
- **When it's worth it:** Only once a single `count(*) group by day` query over raw
  events is measurably too slow *with the retention policy and daily-aggregate tables
  from Option A already in place* — i.e., Option B is the answer to a problem Option A's
  own rollups haven't solved yet, not a day-one choice.
- **Verdict:** Not justified at current or 12–18-month-projected scale. Documented here
  as the upgrade path, not the starting architecture.

### Option C — Ingestion service + queue + dedicated analytical store

A standalone ingestion API, a durable queue (Kafka, SQS, or similar), background
consumers, and a dedicated analytical database.

- **Complexity:** Highest by a wide margin. New service to deploy and keep alive on a
  single-EC2-instance operation, a queue to run or pay for, consumers to monitor for lag,
  and a failure mode (queue backs up, consumer crashes) that doesn't exist in either
  other option.
- **Cost:** Real infra cost (a managed queue, or self-hosting one, plus the extra
  compute/ops for consumers) with no corresponding benefit at Traiv's volumes.
- **When it's worth it:** At genuinely large write volume where a single Postgres
  instance can't absorb ingestion directly — hundreds of thousands of events/second
  sustained. Traiv's 100,000-trainer projection (below) is nowhere near this.
- **Verdict:** Not recommended at any horizon considered in this document. This is the
  "introduce Kafka/Kubernetes for a startup with a handful of users" mistake named
  explicitly in the founder's own brief — including it here only to document why it was
  rejected, not as a future step.

## Decision matrix

| Criterion | A: Postgres-only | B: Postgres+ClickHouse | C: Full pipeline |
|---|---|---|---|
| Engineering complexity | Low | Medium–High | High |
| Infra cost today | $0 | $$ (new service) | $$$ (new service + queue) |
| Ops burden | None new | New DB to run/patch | New service + queue to run |
| Query performance (current scale) | Fine | Fine (overkill) | Fine (overkill) |
| Write throughput (current scale) | Comfortably sufficient | Comfortably sufficient | Comfortably sufficient |
| Retention control | Simple (delete old rows) | Needs its own policy | Needs its own policy |
| Scalability ceiling | High with aggregation tables | Very high | Very high |
| Correctness risk | Low (one database, one source of truth) | Medium (sync can drift) | Medium–High (more moving parts) |
| Failure recovery | Existing idempotent-write patterns apply directly | New sync-failure modes | New queue-failure modes |
| Deployment complexity | None — ships with existing API | New service to stand up | New service + queue to stand up |

## Recommendation

**Option A, Postgres-only, for the MVP, launch, and scale phases** (see
`implementation-roadmap.md`). Revisit Option B only if a specific dashboard query is
measurably slow *after* daily-aggregate tables and a retention policy are both already in
place — that's a concrete, falsifiable trigger, not a vague "if it gets big" guess.

## Growth-scale estimates

Assumptions, stated explicitly (there is no real data to calibrate against yet — these
are planning assumptions, to be revisited once real usage exists):

- Average active clients per trainer: 15 (mid-point of the free/starter/pro/studio tier
  range implied by `studio.tier`'s seat limits mentioned in `.ai/state/current.md`: free
  2, starter 8, pro/studio unlimited — 15 is a deliberately conservative blended guess for
  a mix of tiers, not a measured number).
- Meaningful product events per active user per day: 20 (a session open, a few workout
  set logs, a check-in field, a few page views — order-of-magnitude, not measured).
- Average event row size: ~300 bytes (event name, ids, small JSON properties, timestamp).

| Trainers | Active clients (≈15×) | Events/day | Events/year | Storage/year (raw, uncompressed) |
|---|---|---|---|---|
| 100 | 1,500 | 30,000 | ~11M | ~3.3 GB |
| 1,000 | 15,000 | 300,000 | ~110M | ~33 GB |
| 10,000 | 150,000 | 3,000,000 | ~1.1B | ~330 GB |
| 100,000 | 1,500,000 | 30,000,000 | ~11B | ~3.3 TB |

At 10,000 trainers (~1.1B events/year raw), a retention policy (e.g. 90 days of raw
events, forever on daily aggregates) keeps the live raw table around ~270M rows
(~80 GB) — well within what a single well-indexed Postgres instance handles, especially
since every dashboard read goes against the small aggregate tables, not the raw table, in
Option A's design (`data-model.md`). The 100,000-trainer tier (~3.3 TB/year raw) is
exactly the point at which Option B becomes worth evaluating — and by construction, that
evaluation only has to happen once Traiv is already a much larger business than it is
today, with a much larger engineering team to do it.

## Operational monitoring (domain I from the brief) — a separate, smaller decision

Technical/operational telemetry (API latency, error rates, job failures) is a genuinely
different system from product analytics and should **not** share tables with it (mixing
high-cardinality request-level telemetry into product-event tables is exactly the
"expensive query pattern" trap named in the brief's self-review requirement). Given the
single-EC2-instance reality and no existing logging library at all:

- **Recommended for MVP:** structured JSON logging to stdout (replace bare
  `console.log`/`console.warn` with a thin leveled wrapper — see
  `implementation-roadmap.md` Phase 0) plus a small `job`-table-backed health-check
  rollup (error counts by route, per hour, written by the same background-job mechanism).
  No new service.
- **Not recommended now:** a full OpenTelemetry collector + Prometheus + Grafana stack.
  That's real value *once there's a team on-call to look at it*; for a single founder
  running one EC2 instance, a structured log plus a once-a-day "error count over 24h"
  admin-dashboard tile (domain I's actual ask: "visibility," not "a full observability
  platform") delivers the actual decision-making value at a fraction of the operational
  cost. If/when uptime SLAs or a team pager exist, this is the first thing to revisit.
