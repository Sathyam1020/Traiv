# Privacy, security, and compliance

## Data minimization

Enforced at the event-contract level (`event-taxonomy.md`'s "required/optional
properties" per event, validated by Zod at ingestion — same boundary-validation
convention as every other route in this API). An event cannot carry an arbitrary JSON
blob; it carries exactly the shape `event_definition` declares for its name, and an
unrecognized property is dropped, not stored. This is the direct answer to the brief's
own warning: "Prevent raw analytics events from becoming an unrestricted database of
client behavior."

## Sensitive health data — hard exclusion

Per `event-taxonomy.md`: no workout notes, chat messages, meal photos, or medical/health
free text ever appear in `properties`. Exact measurement values never appear either —
only that a measurement of a given *type* was logged. This is enforced the same way
every other boundary in this API is enforced: a Zod schema per event name that simply
has no field for these values, so there's nothing to forget to redact later — the
category of data can't be entered because the required-shape contract doesn't accept
it. This is stricter than "strip PII before storing," which relies on remembering to
strip it every time; this relies on the shape never admitting it in the first place.

## Tenant isolation

Every `product_event` row carries `studioId`. Every admin dashboard query that's
studio-scoped filters on it explicitly in the `WHERE` clause — never inferred from a
join, matching this repo's own `requireStudio`/`requireClient` posture (ADR 0014,
0016: "the studio always comes from the URL... and authorizes nothing" on its own,
every route re-derives and re-checks). An admin viewing one studio's drilldown cannot
see another studio's raw events by manipulating a request, because the query itself is
scoped server-side, not filtered client-side.

## Admin RBAC — a real gap this plan surfaces, doesn't paper over

Today, `requireAdmin()` (`apps/api/src/middleware/admin.ts`) is **one hardcoded phone
number**. For a one-person admin app, this is correct and simple — but it means the
analytics platform this document designs has, by construction, exactly one possible
viewer right now. This is fine for the MVP/launch phases (`implementation-roadmap.md`)
but is flagged explicitly: **the day a second person (a support hire, a co-founder)
needs dashboard access, a real admin-roles table is a prerequisite**, not an afterthought
— see `risks-and-open-questions.md`.

## Server-side authorization

All analytics read endpoints sit behind the existing `requireAdmin()` middleware,
identical to how `/admin/analytics` (marketing) already works today — no new auth
mechanism invented.

## PII handling

`product_event.properties` contains no PII by contract (above). Where a human-readable
name is needed in the admin UI (e.g. "which studio is this drilldown about"), it's
resolved via a join to `studio`/`user` at *read* time, scoped by the admin's own access,
never copied into the analytics table itself. This keeps the blast radius of an
analytics-table export small: exporting `product_event` wholesale leaks event
*patterns*, never names, emails, or phone numbers.

## Retention and deletion

Per `data-model.md`'s retention table: raw product events purged after 90 days,
operational events after 14, aggregates kept indefinitely (they contain no raw personal
data, only counts).

## User-deletion propagation

If a user/studio is deleted (soft-delete, matching this repo's `deletedAt` convention
throughout), their `product_event` rows are not retroactively deleted immediately — they
age out via the 90-day retention window like any other row, which is a deliberate choice:
a 90-day-max retention policy applied uniformly is simpler and more auditable than a
special-cased "delete analytics the instant the account is deleted" path, and 90 days is
already short enough that this is not a meaningful privacy gap. If a user explicitly
requests deletion under DPDP's right-to-erasure, their `product_event` rows are deleted
immediately as part of that request's existing account-deletion flow (wherever that is
implemented) — this plan adds one `DELETE FROM product_event WHERE user_id = $1` to
whatever that flow already does, not a separate mechanism.

## Audit logging

Every admin read of a specific studio's drilldown (the one place raw-ish data is visible
to a human) is itself logged as an `operational_event` (`admin_drilldown_viewed`, with
the admin's own `userId` and the target `studioId`) — so "who looked at this studio's
data, and when" is answerable, the same self-referential discipline the system applies
to everything else.

## Encryption

No new requirement beyond what the database connection already provides (TLS to
Neon/RDS, same as every other table). No analytics data is more sensitive than the
product data already sitting in the same database.

## Secure exports / aggregation thresholds

CSV exports from the admin dashboard are **aggregate-only** by default (counts, rates,
rollup rows) — exporting raw per-event rows is a separate, explicitly-logged action
(captured by the same `admin_drilldown_viewed`-style event), not the default button
behavior. Any aggregate broken down to a group small enough to re-identify an individual
(e.g. "studios with exactly 1 client, in city X") is suppressed below a minimum group
size (suggested: 5), the same small-cell-suppression convention standard in any
aggregate-reporting system handling personal data.

## DPDP Act (India) and GDPR-adjacent considerations

Traiv's stated product market is Indian coaches (`.ai/product/` — verify exact wording
before citing further; not fully read in this audit pass, flagged as a follow-up). The
DPDP Act is the binding framework (as ADR 0021 already treats it). No cookie/device
identifier is introduced anywhere in this plan for anonymous visitors (building on, not
reversing, that decision). For **authenticated** product usage, the lawful basis is the
same one that already covers using the product at all — a signed-in user whose coach or
own account already processes their training/nutrition data has already consented to
that processing; recording *that a feature was used* is a narrower, lower-sensitivity
fact than the underlying data itself, and carries no new consent requirement beyond what
the product's existing terms already cover. If Traiv's customer base ever meaningfully
includes EU-based users, GDPR's stricter "legitimate interest" documentation requirement
for product analytics would need separate legal review — flagged as a founder/legal
question, not resolved here, since this document found no evidence in `.ai/product/`
that EU users are a current target market.

## Backup and recovery

Analytics tables live in the same Postgres instance as the rest of the product —
inherits whatever backup/PITR policy already covers that database. No new backup
infrastructure is proposed for a smaller, lower-stakes dataset (aggregates are
recomputable from raw events if ever lost, within the retention window).
