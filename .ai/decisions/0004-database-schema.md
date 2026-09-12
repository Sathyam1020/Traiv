# 0004 — Database schema
2026-09-11 · Status: accepted

## Context
Needed an identity model covering coaches, clients, affiliates and admins, plus tenancy
for the Studio tier where up to five coaches share an org.

## Decision

**A client is a record, not a user with a role.** `client` is a first-class table with a
**nullable `user_id`** filled in on activation.

Identity splits into four purpose-built tables rather than one polymorphic role table:

| Table | Holds |
|---|---|
| `membership` | studio staff — owner, coach. The standard user↔studio join. |
| `client` | roster records; login optional |
| `affiliate` | often not customers — academies, influencers |
| `platform_admin` | `user_id` + level |

Plus `studio` as the tenant. Branding lives on the studio, not on the coach.

Domains: exercise/media/relation · program/program_day/program_item · workout_session/set_log ·
food/food_portion/meal/nutrition_plan/food_log_entry · checkin·measurement·habit·client_risk ·
conversation/message/message_delivery · package/client_subscription/payment ·
org_subscription/invoice · referral/commission/payout · webhook_event/outbox.

No separate `assignment` table — assigning deep-copies, so `program.client_id` plus
`program.personalisation` does the job.

## Consequences
- A coach can program for a client who never installs anything (gym-floor mode).
- One human can be a client of two orgs — two rows, one `user_id`.
- Deleting a user leaves the coach's roster and payment history intact.
- Foreign keys are type-safe: `client.coach_id → membership.id` can only point at staff.
- Four tables to maintain instead of one, and no single "all people" query.

## Alternatives
**Generic `user` + `entity(role)` + per-role profile tables** — the founder's initial
sketch, rejected: it can't express a client without a login without inventing a fake user
row, and `entity_id` foreign keys lose type safety.

## Amendment — 2026-09-12
The tenant is named **`studio`**, not `org` — it is the word the founder and the users
use, and `voice.md` says name things as the user recognises them. Superseded columns:
`org_id` → `studio_id`, `session.active_org_id` → `session.active_studio_id`.

Settled at the same time (see ADR 0011): studios share clients studio-wide,
`client.coach_id` records who owns the relationship.

## Open
- Can a coach's custom exercise or food be promoted to the global library? If yes,
  `promoted_from_id` is needed before v3.
