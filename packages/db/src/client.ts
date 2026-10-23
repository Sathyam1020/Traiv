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
    // Fixed size: `min` and `max` are the same number, so the pool opens its
    // connections once and never closes one.
    //
    // Opening a connection to Neon costs two to four seconds from India — a TLS
    // handshake across the Atlantic, and the compute waking if it had suspended.
    // Running a query on a connection that is already open costs about fifty
    // milliseconds, and the roster's five parallel queries together measure 260ms.
    //
    // That gap is the whole of "the app feels laggy". With connections being reaped
    // after thirty seconds idle, a coach who paused to read the screen paid for a new
    // handshake on their next click; and one request needs more connections at once
    // than the queries in it, because the session lookup and the membership check are
    // still holding theirs when the five fan out. A pool that was one short of that
    // paid the handshake in the middle of every request instead.
    //
    // Ten is per process. One API instance against Neon's free tier is nowhere near
    // its connection limit; if this ever runs more than a handful of instances, that
    // is the number to revisit.
    min: POOL_SIZE,
    max: POOL_SIZE,
    connectionTimeoutMillis: 10_000,
    // A held-but-silent connection is exactly what a NAT table or a load balancer
    // drops, and the first we would hear of it is a failed query. Keepalives make it
    // the pool's problem instead of a coach's.
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  return drizzle(pool, { schema, casing: "snake_case" });
}

/**
 * How many connections one request can want at once, with room to spare: the roster's
 * five parallel queries, plus the session lookup and the membership check that
 * authorized it.
 */
const POOL_SIZE = 10;

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
  await Promise.allSettled(Array.from({ length: POOL_SIZE }, () => db.execute(sql`select 1`)));
}

export type Db = ReturnType<typeof createDb>;
