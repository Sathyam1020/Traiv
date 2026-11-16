# Testing strategy

Follows the repo's existing testing doctrine (`.ai/engineering/testing.md`) exactly —
scenario tests against a real Postgres, real HTTP where applicable, mocks only at
provider/credential boundaries (`vi.mock` on `env.js`, the same pattern
`features/analytics/*.test.ts` already established this session). No new testing
philosophy is introduced for this system.

## Deterministic logic — fully unit-testable, fixed input/output

`opportunity-scoring.md`'s scoring function (fixed component inputs → an exact
expected score and evidence-completeness value, including the re-normalization-when-
data-missing edge case), `quality-assurance.md`'s hard-blocking boolean checks (each
individually testable with a passing and failing fixture), the workflow state
machine's transition guards (`workflow-design.md`'s optimistic-concurrency
`UPDATE ... WHERE status = $expected`, tested for the exact case where a concurrent
transition is attempted and correctly rejected), and cannibalization's deterministic
signals (keyword overlap, GSC query overlap).

## Scenario tests — real Postgres, real service calls, provider boundary mocked

- A full opportunity lifecycle: seed candidate → score → brief → (mocked LLM) draft →
  quality check → approval → publish, asserting the real `post` row exists via the
  real marketing read API at the end — the same "test through the real seam" instinct
  as the analytics platform's funnel tests.
- Job-table interaction: a `seo_draft_article` job claimed, failed, and retried with
  backoff, asserting `FOR UPDATE SKIP LOCKED` behavior under two concurrent workers
  (mirrors the existing `jobs/queue.test.ts` pattern, extended to this job kind).
- GSC sync idempotency: running the sync job twice for the same day produces one row
  per `(query, page, date)`, not two.
- Workflow run resumability: a run killed mid-step (simulated process exit) resumes
  correctly on the next tick rather than restarting or double-executing a completed
  step.

## LLM-boundary mocking

Every call through `providers/llm.ts` is mocked at that one function boundary in
scenario tests (exactly like `food-label.ts`'s existing test suite mocks the OpenAI
fetch call) — tests assert on how the system *uses* the LLM's output (schema
validation, retry-on-malformed-output, claim-ledger population), never on real model
output, which is nondeterministic and not something CI should depend on.

## What CI does not do

CI never makes a real call to an LLM provider, SERP provider, GSC API, or any
competitor's live site — every external boundary is mocked in the test suite, so CI
runs are free, fast, and have zero chance of rate-limiting a third party or
incurring real cost. A small number of manual, locally-run "does the real
integration actually work" checks (one real LLM call, one real GSC pull) are
documented as a one-time setup verification, not part of the automated suite.

## Regression coverage for the two "must never do" boundaries

A dedicated scenario test asserts that no autopilot code path writes to
`content/{features,competitors,tools}.ts` (a static-analysis-style check: grep the
autopilot's own source for any `fs.writeFile`/import targeting those paths — this is
a repo-hygiene test, not a runtime test, since those files aren't even database-backed)
and that the pSEO files are untouched by diffing their contents before/after a full
scenario-test run.
