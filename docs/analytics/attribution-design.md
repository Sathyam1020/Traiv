# Attribution design

## Build on the existing system — don't duplicate it

`apps/web` already writes `analytics_event` rows with `utmSource`/`utmMedium`/
`utmCampaign` for every anonymous marketing-site visit (ADR 0021). This plan adds exactly
one new thing: a bridge from that anonymous visitor record to a real `user_id` the
moment signup happens, via `acquisition_attribution` (`data-model.md`).

## How the bridge works

1. A visitor lands on `apps/web` with `?utm_source=...`. The existing `analytics.tsx`
   component (`apps/web/src/components/analytics.tsx`) already captures this into the
   anonymous `analytics_event` row and — per the file's own comment — "carries the
   visit's campaign onto the signup link."
2. The campaign params travel as query params (not a cookie — ADR 0021's whole premise is
   no identifier on the device) through to wherever signup actually starts — the trainer
   app's `/signup` route.
3. On `signup_completed` (server-side, the moment the `user`+`studio` transaction
   commits), the API reads those same query params (passed through the signup
   request body, not re-derived from a cookie) and writes one `acquisition_attribution`
   row: `firstTouchSource`/`firstTouchMedium`/`firstTouchCampaign` = the params from this
   exact signup request.
4. If the same browser visited multiple times with different campaigns before signing up
   (e.g. an organic visit last week, a paid ad click today), the *signup-time* params are
   what's captured as both first- and last-touch on day one — true first-touch
   multi-session attribution across visits is **not reliable** without a device
   identifier, which ADR 0021 deliberately does not have. This is stated as a known
   limitation, not solved with a workaround that would reintroduce a cookie.

## What this does and doesn't let you claim

**Can claim:** "Of the people who signed up this month, X% arrived with `utm_source=
google` on their signup visit." This is real, session-grounded data captured at the
moment of the action that matters.

**Cannot claim:** "This visitor came back three times across two weeks before
converting" — no cross-session identity exists for anonymous visitors, by design (ADR
0021's stated tradeoff: "returning visitors is not a question this data can answer").
Multi-touch attribution models (linear, time-decay, etc.) require this and are
**explicitly out of scope** until/unless the founder decides the DPDP/consent tradeoff is
worth revisiting for a device identifier — which is a product/legal decision, not an
engineering one, and belongs in `risks-and-open-questions.md`, not decided here.

## Referral attribution — separate channel, not blended

`referral_attributed` (from `endorse.ts`'s `referral` table) is a **different**
attribution path from UTM/campaign tracking — a referral is server-verified (the
`endorser_id` and the one-per-studio unique constraint), not inferred from a query
param. Acquisition reporting shows "marketing channel" and "referral" as two separate,
non-overlapping buckets: a studio is either in `acquisition_attribution` (marketing) or
has a `referral` row (endorser), and the dashboard must not add their percentages
together as if they're the same kind of number, since a studio could in principle have
both and the join semantics need to pick one as "the" attribution rather than silently
double-counting.

## Advertising cost / CAC / ROAS

**Not computable without a documented cost source.** Per the brief's own instruction:
"Advertising cost data must have a documented source, such as verified integrations or
manual imports." Traiv has no ad-platform integration today. The proposed path, when
ad spend exists: a manual monthly CSV import (campaign name → spend) into a small
`ad_spend` table, joined against `acquisition_attribution.firstTouchCampaign` by name —
no automated ad-platform API integration is recommended at this scale (one more
third-party credential and sync job for a number that can be entered once a month in 30
seconds). CAC = that month's spend ÷ signups attributed to that campaign; this is
reported with an explicit "manually entered, as of [date]" label on the dashboard, never
presented as if it auto-refreshed from a live ad account.

## Consent / cookie policy

No change to ADR 0021's posture: no cookie, no device id, for anonymous marketing
visitors. The attribution bridge above uses **query parameters carried through a single
signup flow**, which requires no consent banner because nothing is written to the
visitor's device — consistent with the entire reason ADR 0021 exists. Cross-subdomain
tracking (marketing site → trainer app, different origins) is achieved by passing the
UTM params in the signup URL itself, not via a shared cookie domain — this avoids needing
`SameSite`/cross-site cookie configuration entirely, at the cost of losing attribution if
a visitor closes the tab and returns later via a bookmark rather than clicking through
in one session. That's judged an acceptable tradeoff given the stated priority (no
consent banner) — flagged in `risks-and-open-questions.md` as a founder-visible
tradeoff, not silently assumed.
