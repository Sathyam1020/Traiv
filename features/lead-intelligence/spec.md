# Bengaluru lead intelligence

Standalone Node 24 CLI in packages/lead-intelligence; no changes to customer apps or production database. SQLite stores research observations, provenance, entities, sales state, append-only outreach, jobs and audit. Two search queues cover gyms and online coaches. Public factual business data only; unknowns never become negative evidence or invented contacts. Explicit Bengaluru location and online-service evidence are required for confirmed local online coaches. Branches remain distinct. All network adapters are opt-in and obey source restrictions. No automated outreach.

Exports: gyms, confirmed coaches, unverified coaches, full JSON, quality/coverage reports and a seven-tab XLSX CRM. Google Sheets sync requires authorized credentials and preserves human-maintained columns by stable lead ID. Default collection is free reviewed-source import; optional search API requires a storage-permitted account. No paid calls without explicit configuration.

Plan: domain/schema/scoring; SQLite service; query generator and source adapters; exports and Sheets; scenario tests; execute public web research; audit actual dataset. No production runtime dependencies. XLSX uses externally provided Artifact Tool. Native SQLite and Node test runner avoid redundant dependencies.
