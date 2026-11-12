# Traiv Analytics Platform — Plan

Status: **planning only**. Nothing in this folder has been implemented. No schema,
migration, route, or dependency has been added. This is the full set of documents
requested for a first-party, admin-accessible analytics/monitoring platform.

## How to read this

1. `architecture-audit.md` — what actually exists in the repo today (file-path grounded),
   vs. what's aspirational. Read this first; everything else depends on it.
2. `architecture-decision.md` — the storage/pipeline decision (Postgres-only vs.
   Postgres+ClickHouse vs. full event pipeline), with a decision matrix and growth-scale
   estimates.
3. `event-taxonomy.md` — the event contract catalog for product analytics.
4. `data-model.md` — illustrative Drizzle schema sketches.
5. `metric-definitions.md` — precise definitions, especially where "revenue" doesn't
   exist yet.
6. `attribution-design.md` — acquisition tracking, building on the existing marketing
   analytics system rather than replacing it.
7. `admin-dashboard-spec.md` — the admin UI, 12 proposed nav sections, grounded in the
   admin app's actual current 4 pages.
8. `privacy-security.md`
9. `implementation-roadmap.md` — phased, file-path grounded, MVP → launch → scale →
   future.
10. `testing-strategy.md`
11. `risks-and-open-questions.md` — the critical self-review, top-20 events, top-15
    metrics, and the decisions that need founder input before anyone writes code.

## The one-paragraph summary

Traiv already made this call once, in writing: ADR 0021 explicitly rejected PostHog and
GA for the marketing site, for data-ownership and DPDP-Act reasons, and built a small,
cookieless, first-party analytics system instead — one Postgres table, raw SQL
aggregates, no identifier on a visitor's device. This plan extends that same philosophy
to authenticated product usage (trainer/client apps), where it's actually *simpler*,
because real `userId`/`studioId` identity already exists and the cookieless/salted-hash
trick ADR 0021 needed for anonymous visitors isn't needed at all. The recommended
architecture is **Postgres-only** (reusing the existing database and the existing `job`
table's background-processing pattern) through the first 1,000 trainers; ClickHouse is a
documented upgrade path, not a day-one dependency. Billing/revenue analytics does not
exist yet because billing itself doesn't exist yet (`studio.tier` is an enum with no
payment, invoice, or transaction table anywhere in the schema) — that domain is scoped as
a prerequisite, not designed against data that isn't there.

## What this plan does not do

- It does not touch `packages/db/src/schema/*`, any migration, any route, any
  `package.json`, or any application code.
- It does not assume subscriptions or payments exist. They don't (verified in
  `architecture-audit.md`).
- It does not recommend a third-party analytics SaaS for the core system, per the
  founder's stated requirement and the existing ADR 0021 precedent.
- It does not recommend Kafka, Kubernetes, or a full Prometheus+Grafana stack. The repo
  runs on one EC2 instance today; the plan matches that reality.
