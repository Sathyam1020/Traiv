# Content strategy and generation

## Content brief (master prompt §7)

One `seo_content_briefs` row per opportunity selected for `CREATE_NEW` or
`UPDATE_EXISTING`, containing every field the master prompt lists verbatim: primary
search intent, target audience, primary + supporting keywords, the reader's actual
problem, SERP-analysis summary (if available), proposed angle, unique value
proposition, proposed title/URL, recommended headings, questions to answer, required
original evidence, internal-link opportunities (checked against the real link graph
in `database-design.md`), external-reference requirements, the specific Traiv
feature(s) the article should reference (cross-checked against
`apps/web/src/content/features.ts`'s verified list — a brief cannot propose
referencing a feature that isn't actually indexable/real), an appropriate CTA,
editorial risks, and source requirements.

## Content types and page-type selection (master prompt's ten types)

The brief stage recommends a **page type**, not just a blog post, matching each type
to how it's actually produced:

| Master-prompt content type | Where it is produced |
|---|---|
| Educational guide, use case article, workflow tutorial, industry guide, feature explanation, original research, resource page | A `post` row — this system's native output |
| Software comparison / competitor alternative article | A `post` row that *discusses* a comparison in prose — never a new `content/competitors.ts` entry; see `repository-audit.md`'s pSEO boundary finding |
| Existing content refresh | An `UPDATE_EXISTING` action against an existing `post` row, via a new `seo_article_revisions` row, not a silent overwrite |
| Commercial landing page | **Out of scope for this system.** A landing page is product/marketing-owned, hand-built, and not something a content pipeline should autonomously create — flagged as a founder decision if ever wanted, in `risks-and-open-questions.md` |

## Generation pipeline (master prompt's ten stages)

1. **Research synthesis** — turns `seo_research_sources` + the claim ledger into a
   structured outline input (deterministic assembly, one LLM call to synthesize prose
   framing).
2. **Content outline** — LLM call, schema-validated output (headings, per-section
   intent, which claims/sources attach where).
3. **Draft generation** — LLM call(s), one per major section is acceptable for length
   control; each section's claims must already exist in the ledger before drafting —
   the draft cites the ledger, it does not introduce new unverified claims mid-draft.
4. **Editorial refinement** — a second LLM pass against the writing-standards list
   below (not the same prompt re-run — a distinct editorial system prompt, since the
   master prompt explicitly warns against "repeatedly asking the same model to grade
   its own writing"; see `quality-assurance.md`).
5. **Fact verification** — every claim in the draft is checked against the ledger;
   any claim *not* in the ledger is flagged `NEEDS_HUMAN_REVIEW`, not silently passed.
6. **Originality assessment** — checks the stored `originality_statement` is actually
   reflected in the draft (deterministic keyword/section presence check + one LLM
   judgment call), not just asserted at the brief stage.
7. **SEO optimization** — deterministic, see `quality-assurance.md`.
8. **Internal link insertion** — proposed links validated against the real site graph
   (every destination must be a real, indexable URL — a broken proposed link is
   rejected before insertion, not after).
9. **CTA selection** — chosen from a small, admin-configured set of real Traiv CTAs
   (signup, a specific feature page, pricing) — never freely generated copy for a
   destination that doesn't exist.
10. **Final quality review** — the complete `quality-assurance.md` gate.

## Writing standards (master prompt's list, as acceptance criteria, not aspiration)

Directly answers search intent; no generic intros; no repetitive AI phrasing
(checked by the editorial-refinement pass, which is explicitly instructed to remove
stock openings and transition phrases); practical, workflow-specific; credible
references; fair competitor comparisons; no unsupported superlatives; readable
formatting; relevant examples; consistent Traiv branding (voice guide:
`.ai/design/voice.md`, already governs every other user-facing string in this
codebase and is reused here rather than inventing a second voice doc). **No arbitrary
word count** — length is a brief-stage decision based on the question's actual depth,
not a generation-time target the drafting prompt is told to hit.

## LLM layer (the house pattern, not a new framework)

`providers/llm.ts` wraps one provider behind a typed `complete<T>(role, systemPrompt,
input, schema): Promise<T>` function, following
`apps/api/src/integrations/food-label.ts`'s exact shape: plain `fetch`, a Zod schema
for the response, an `AbortSignal.timeout`, and a graceful "not configured" error if
no API key is set — no AI SDK, no agent framework (`architecture-decisions.md`).
**Malformed output is never silently coerced** — a response that fails Zod validation
is a failed step (retried per `workflow-design.md`'s job-retry mechanism), not patched
into a best-effort guess.

Model tiering (master prompt §18): a cheaper/faster model for classification,
deduplication assistance, and simple extraction; a stronger model for drafting,
strategy, and editorial review. Both are config (`seo_provider_usage`'s per-call
model field), not a hardcoded choice, so the actual models in use can change without a
code change.

## Prompt injection protection (master prompt §18)

Every piece of retrieved external content (competitor pages, SERP snippets, fetched
sources) is passed into prompts as clearly-delimited **untrusted evidence**, with the
system prompt explicit that instructions appearing inside evidence text are never
followed. Tool execution (publishing, budget spending, state transitions) is
structurally separate from evidence extraction — no LLM call that reads external
content is ever also the call that's allowed to trigger a write. This mirrors the
"treat retrieved content as data, never instructions" posture already documented for
this very session's tool use.
