import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { db } from "./db.js";

/**
 * The pool has to survive the far end hanging up.
 *
 * `pg` emits `error` on an IDLE client when its connection goes away — a pooler timing
 * it out, a deploy, a network blip. `pg-pool` re-emits that on the pool, and in Node an
 * `'error'` event with no listener is an uncaught exception: the process exits.
 *
 * That is not hypothetical. The API was dying about two minutes after the last request,
 * because the pool held connections open against Neon's pgbouncer and nothing listened
 * for the error when pgbouncer closed them. This reproduces it by killing the
 * connections from the server side, which is the same event.
 */
describe("the connection pool", () => {
  it("survives the server closing its connections, and reconnects", async () => {
    // Make sure there are open connections to kill.
    await Promise.all([db.execute(sql`select 1`), db.execute(sql`select 1`)]);

    // Hang up on every connection this database has except the one doing the killing.
    await db.execute(sql`
      select pg_terminate_backend(pid) from pg_stat_activity
      where datname = current_database() and pid <> pg_backend_pid()
    `);

    // The idle clients now emit 'error'. Without a listener on the pool this line is
    // never reached, because the test runner's process is gone.
    await new Promise((r) => setTimeout(r, 300));

    const [row] = (await db.execute(sql`select 1 as ok`)).rows as { ok: number }[];
    expect(row?.ok).toBe(1);
  });

  it("still works on the call after that, from a fresh connection", async () => {
    const [row] = (await db.execute(sql`select 2 as ok`)).rows as { ok: number }[];
    expect(row?.ok).toBe(2);
  });
});
