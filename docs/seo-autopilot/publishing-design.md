# Publication workflow

## Approval gates (master prompt §12 — all human-in-the-loop in the MVP)

Every `seo_articles` row reaching `READY_FOR_REVIEW` requires an explicit admin
action to advance — there is no "auto-publish above score N" path in the MVP, matching
the master prompt's own phased-autonomy instruction (§23: start fully human-gated,
earn autonomy with a track record, never start autonomous). A `seo_approvals` row
records who approved, when, and against which `seo_quality_checks` snapshot — an
approval is tied to the exact version of the draft reviewed, so a later silent edit
can't ride on a stale approval.

## Publishing mechanics

Approved content becomes a normal `post` row via the **existing** admin blog-write
path (`apps/api/src/features/marketing/admin.ts`) — the autopilot never writes to the
`post` table directly; it calls the same service function a human editor's admin UI
action calls, so every existing invariant (slug uniqueness, `publishedAt` handling,
markdown rendering) is enforced exactly once, in exactly one place. `seo_publication_jobs`
tracks the publish step itself as a job-table row (per `workflow-design.md`), so a
publish failure (e.g. slug collision discovered at the last second) is retried or
surfaced, not silently dropped.

## Scheduling and cadence

Publication timing is a deterministic scheduler decision (configurable
posts-per-week target, default conservative — 2–3/week — matching the master
prompt's "quality over volume" framing), not a model decision. No content is ever
published same-day as generation — a minimum review window (admin-configurable,
default 24h) exists between `READY_FOR_REVIEW` and the earliest allowed approval,
giving a human realistic time to read before approving, not just to click.

## Rollback

An `UPDATE_EXISTING` action always creates a new `seo_article_revisions` row before
touching the live `post` row, storing the full prior content — an admin can revert a
published update to the exact prior text with one action. A `CREATE_NEW` action's
rollback is simply unpublishing (setting the existing `post.status` back to draft),
reusing the admin UI's existing unpublish control; no separate rollback mechanism is
built for net-new posts.

## What publishing never does

Never modifies a pSEO typed file (`content/{features,competitors,tools}.ts`) — those
remain exclusively hand-edited, per the repository audit's pSEO boundary finding.
Never touches `sitemap.ts`/`robots.ts` — sitemap inclusion is already automatic and
unconditional for published posts, so the autopilot needs zero sitemap-side code.
Never schedules or triggers a Vercel deploy — a new blog post is server-rendered from
the database at request time (`revalidate: 60`), so publishing a `post` row is itself
the "go live" action; no redeploy is a publishing step.
