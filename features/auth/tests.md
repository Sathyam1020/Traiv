# Auth — scenarios

32 passing. Real database, real service layer; only third-party network calls are faked.
The five mandatory cases from `.ai/engineering/testing.md` are marked.

## Phone sign-in — `features/auth/auth.test.ts`

| Scenario | Expected | Case |
|---|---|---|
| First use of a number | Account created, `isNew: true`, phone verified | |
| Name survives between challenge and verify | Read from the challenge row, not memory | **abandoned halfway** |
| Same number signs up twice | Signs in, one user row only | **second attempt** |
| Code reused | `code_used` | **second attempt** |
| Older code after a newer is issued | `code_invalid`; newest still works | **out of order** |
| Expired code | `code_expired` | **after expiry** |
| Five wrong attempts | Locked; even the correct code refused | |
| Six sends in an hour | 429 | |
| Five *failed* sends then a real one | Succeeds — failures don't spend the quota | |
| Transport recorded | `transport` set, `sentAt` set, `sendError` null | |
| Verify with no challenge | `no_challenge` | |
| Profile completed later | Email normalised to lowercase | **abandoned halfway** |
| One session revoked, another live | Only the revoked one dies | **two actors** |
| Identity rows | Exactly one `phone` identity per user | |

## Studios — `features/studio/studio.test.ts`

| Scenario | Expected | Case |
|---|---|---|
| Slug format, 5,000 samples | Always `firstname-` + 6 url-safe chars | |
| Slug hostname safety, 5,000 samples | No `_`, no `--` | |
| Slug collisions, 200 samples | All distinct | |
| No usable name | Falls back to `studio-xxxxxx` / "My studio" | |
| Signup | Exactly one studio, role `owner`, tier `free` | |
| Same transaction | Session's `activeStudioId` set immediately | |
| Signing in again | No second studio | **second attempt** |
| Invited coach | Two memberships; opens in the inviting studio | **two actors** |
| Session's studio still valid | Kept | |
| Stale studio id | Ignored, falls back to their own | **out of order** |
| Switch into a non-member studio | 403 | |
| Switch persisted | Written to the session | |

## OTP delivery — `integrations/otp/otp.test.ts`

| Scenario | Expected |
|---|---|
| Primary works | Fallback never called |
| Primary throws | Fallback used, reports the delivering channel |
| Every channel fails | Throws |
| No fallback configured | Primary error surfaces immediately |
| Primary and fallback are the same channel | Not retried — that is not a fallback |

## Not covered

- **Google OAuth paths** — need credentials, or a fake at the `fetchProfile` boundary
- **The HTTP layer** — routes, cookies and CORS are exercised manually, not in tests
- **Real MSG91 / Meta sends** — blocked on DLT and Meta verification
- Concurrent verification of the same code from two simultaneous requests

## Note on runtime

~4 minutes. The tests recover each OTP by brute-forcing six digits against the stored
HMAC, because the code is never returned by the API and adding a test-only escape hatch
to production code would be worse.
