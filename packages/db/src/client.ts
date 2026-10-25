import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

/**
 * Neon over the standard `pg` driver, not `@neondatabase/serverless`.
 *
 * Neon's own guidance: a long-running Node server should use a standard TCP driver with a
 * pooled connection — it keeps the pool warm across requests and supports interactive
 * transactions natively. The serverless driver targets edge runtimes; its HTTP transport
 * is non-interactive, which would break the outbox pattern where a state change and the
 * work it triggers must commit together.
 */
export function createDb(connectionString: string) {
  const pool = new Pool({
    connectionString,
    max: POOL_SIZE,
    // Kept open between requests, because opening a connection to Neon costs two to
    // four seconds from India — a TLS handshake across the Atlantic, and the compute
    // waking if it had suspended — while a query on an open connection costs about
    // fifty milliseconds. One request wants several at once: the session lookup and
    // the membership check are still holding theirs when the roster's five fan out.
    min: WARM,
    connectionTimeoutMillis: 10_000,

    // Everything below exists because the host is Neon's POOLER (pgbouncer), which
    // closes server connections that sit idle. Holding connections open forever and
    // assuming they stay usable is what made the API fall over after two minutes of
    // inactivity. Three defences, in order of who notices first:
    //
    // 1. the heartbeat below keeps the warm ones in use so they are never idle long
    //    enough to be reaped;
    // 2. `maxLifetimeSeconds` retires a connection on our schedule rather than
    //    waiting for the server to do it on its own;
    // 3. `idleTimeoutMillis` releases anything above `min` once the burst is over.
    maxLifetimeSeconds: 10 * 60,
    idleTimeoutMillis: 60_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  /**
   * MANDATORY, not defensive.
   *
   * `pg` emits `error` on an IDLE client when the far end goes away — a pooler timing
   * it out, a deploy, a network blip. `pg-pool` re-emits that on the pool, and an
   * `'error'` event with no listener is an uncaught exception in Node: the process
   * exits. The whole API was dying roughly two minutes after the last request for
   * exactly this reason.
   *
   * There is nothing to do about it beyond noticing. The client is already removed
   * from the pool by the time this runs, and the next query opens a fresh one.
   */
  pool.on("error", (err) => {
    console.error(`[db] idle connection dropped, recovered: ${err.message}`);
  });

  /**
   * Keep the warm connections warm by using them.
   *
   * A TCP keepalive is not enough: pgbouncer's idle timeout is about *queries*, not
   * packets, so a silent-but-open connection is still idle as far as it is concerned.
   * Running a trivial query on each warm connection resets that clock.
   *
   * `unref()` so this never holds the process open — a seed script or a test run that
   * is otherwise finished still exits.
   */
  const beat = setInterval(() => {
    for (let i = 0; i < WARM; i++) {
      // `pool.query` rather than drizzle: no schema, no parsing, and a rejection here
      // is already handled by the pool's error listener above.
      pool.query("select 1").catch(() => {});
    }
  }, HEARTBEAT_MS);
  beat.unref();

  return drizzle(pool, { schema, casing: "snake_case" });
}

/** The ceiling. One API instance is nowhere near Neon's connection limit. */
const POOL_SIZE = 10;

/**
 * How many connections are held open between requests: enough for one request's
 * fan-out — the roster's five parallel queries plus the two that authorised it.
 */
const WARM = 7;

/**
 * Comfortably under the idle timeout of Neon's pooler, which is the thing closing
 * these connections. Also keeps the compute from suspending, which is the larger half
 * of the two-to-four seconds — worth knowing, because it means this trades Neon
 * compute hours for latency.
 */
const HEARTBEAT_MS = 45_000;

/**
 * Open the pool's connections before anybody is waiting on one.
 *
 * `pg` connects lazily, so without this the first requests after boot pay for the
 * handshakes. Awaited at startup it is three seconds of a process that is not serving
 * traffic yet; skipped, it is three seconds of the first coach to open the app.
 *
 * Failure is deliberately not fatal. If the database is unreachable at boot the server
 * should still come up and answer `/health` — a process that refuses to start is harder
 * to diagnose than one that starts and says what is wrong.
 */
export async function warmDb(db: Db): Promise<void> {
  await Promise.allSettled(Array.from({ length: WARM }, () => db.execute(sql`select 1`)));
}

export type Db = ReturnType<typeof createDb>;
