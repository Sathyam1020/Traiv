# Database

Postgres + Drizzle. The full designed schema is recorded in
`.ai/decisions/0004-database-schema.md`.

## Rules

1. **UUIDv7 ids**, minted in the app. Time-sortable, and safe to mint on a client device —
   which offline sync requires.
2. **Money is integer paise.** Never numeric, never float.
3. **`org_id` on every tenant table**, and every query scopes by it.
4. **Soft-delete where money remembers** — `deleted_at` on client, program, package.
   A removed client still has payment history you must keep.
5. **JSONB only when heterogeneous *and* never queried** — set prescriptions, package
   inclusions. Anything filtered, sorted or indexed gets a real column.
6. **Unique constraints on external ids** — `razorpay_payment_id`, `(provider, external_id)`.
   That constraint *is* the idempotency guarantee.
7. **`timestamptz`, UTC.** Client-written rows also carry `client_created_at`.
8. **Copy-on-assign** — assigning a template deep-copies it, so editing a template never
   rewrites a live client's current block.

## Migrations

Drizzle Kit. Every migration is reviewed for what it does to **existing rows**, not just
whether it applies to an empty database:

- `NOT NULL` on a populated column needs a backfill first
- Dropping a column still read by deployed code needs a two-phase deploy
- A unique constraint needs the duplicates checked first
- An index on a large table needs `CONCURRENTLY`

Destructive or mutating migrations require an ADR explaining the reason.

## Changing the schema

Schema changes are consequential and get an ADR. Never change a table because it's
convenient for the code you're writing — the code is usually the thing that's wrong.
