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
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  return drizzle(pool, { schema, casing: "snake_case" });
}

export type Db = ReturnType<typeof createDb>;
