# Traiv Bengaluru lead intelligence

An executed research pipeline and seven-tab sales CRM. Run commands from this package directory with Node 24+; the database and business-contact exports are gitignored.

## Delivered research (11 November 2026 IST)

201 distinct records: 147 gyms/studios, 50 distinct coaching prospects with published online offers, and 4 trainers needing online-offer verification. On 12 November 2026 the user requested 25 additional online prospects: 24 new records plus Fitmentors qualified from the unverified section. This batch is complete. The online-trainers CSV/XLSX contains exactly 50 entries, including public contact routes, evidence and review flags. Published offers do not establish current availability, contact deliverability or buying intent. No outreach sent. The original discovery pass recorded 181 search hits and 76 candidate URLs; subsequent official-site additions are tracked separately in Source Audit.

Live CRM: https://docs.google.com/spreadsheets/d/164ooFzYBxCCeGLlIXHHJnkQmhJU4hAQzWt9s6ZbP7CU/edit

Tabs: Dashboard, Gym Leads, Online Trainer Leads, Outreach Tracker, Follow Ups, Data Quality, Source Audit. Amber columns are sales inputs. Stable Lead IDs preserve these inputs when research refreshes. Do not edit IDs or headers. Use one outreach attempt ID per real contact event. No messages have been sent.

## Run

```sh
pnpm install --filter @traiv/lead-intelligence
cd packages/lead-intelligence
pnpm test
pnpm typecheck
pnpm leads queries
pnpm leads import data/research.jsonl
pnpm leads verify
pnpm leads export
pnpm leads sync
```

`import` consumes JSONL observations following `src/domain.ts`: identity, branch, locality, source, query, collectedAt, verification, and facts with value/status/source/observedAt/basis. The shipped data also includes expansion and quality-review observations. Reimporting exact observations is safe; newer facts merge, conflicts enter review, and manual sales fields survive. Back up `data/leads.sqlite` before operational use.

Copy `.env.example` to `.env` and supply only credentials you own. `sync` uses an OAuth access token or a service account shared on the target spreadsheet. Set GOOGLE_SPREADSHEET_ID to reuse the live CRM. Without it, the persisted spreadsheet ID is reused. The connector was used for this live execution; standalone OAuth/service-account transport has not been exercised with user credentials.

`collect gym 20`, `collect coach 20`, and `resume 20` use a storage-permitted Brave Search account with BRAVE_API_KEY and BRAVE_STORAGE_ALLOWED=true. Search results enter candidate review, never automatically become verified leads. The adapter takes the first 20 results per query; exhaustive pagination is not implemented. Network retries and expiring job leases support bounded reruns. `osm` writes separate ODbL candidates; the actual Overpass run timed out and is logged, not represented as successful collection. Google Maps/Bing/restricted directory bulk adapters are not implemented.

Excel generation uses Codex's external artifact runtime (not an npm dependency):

```sh
ARTIFACT_MODULE_DIR=/Users/sathyamsahu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node src/workbook.mjs
```

Outside this environment, use the Google Sheet or CSV files, or provision the same artifact runtime. Export produces the master XLSX, separate gym/online/unverified XLSX and CSV files, shortlist CSV, field-evidence JSON, quality and coverage reports, seven previews, and formula inspection. Workbook files are snapshots; Google Sheets is the live sales workspace.

## Quality and qualification

Score weights are in config.json and sum to 100. Only current confirmed evidence earns points. Missing app evidence is **unknown**, not proof of no app. No guessed emails, fabricated followers, invented decision makers, or assumed paying clients. Confidence measures evidence coverage, not probability of a sale. No records currently meet the high-priority threshold; public-source fit alone does not establish the missing commercial signals.

Before promoting a record to Ready to Contact, establish current operation, correct decision maker, coaching client count, present software, and an actual workflow need. Published contacts have not been delivery-tested. Some website checks failed and two sites contain placeholder content; those records are explicitly flagged and excluded from the reviewed shortlist. A successful URL response alone does not establish a real business. Review the linked field source in leads.json where it differs from the main discovery URL.

The 1,000 gym/500 coach stretch targets were not reached. Coverage remains incomplete (see source-coverage.json). This is an executed initial pipeline, not a claim of exhaustive or fully autonomous enrichment. Manual review remains necessary. No paid search API charges were incurred by this package; that excludes Codex usage credits.

## Validation and operational limits

Tests cover repeated import, branch separation, stale evidence, scoring, shared-database concurrency, restart leases, append-only outreach, DNC, malformed contacts, injection, reordered sheet rows and append-only Sheets history. Live Sheets QA changed one temporary follow-up, confirmed the formula and manual-field survival after a refresh, then restored the original values. No QA outreach remains. Ten tests, typecheck and Biome pass; XLSX formula inspection is saved alongside exports.

SQLite is the research source of truth; existing Google sales cells are preserved but not imported back into SQLite. Consequently local exports do not automatically include sales changes made only in Sheets. The REST sync is intended for a single sync operator; there is no distributed Google Sheets transaction lock. Refreshes must not run concurrently with structural row/header changes. Derived tabs can retain old trailing rows if a later dataset shrinks; clear derived tabs before a deliberately destructive dataset reduction. Broader volume/load and credential-based transport tests remain outstanding.
