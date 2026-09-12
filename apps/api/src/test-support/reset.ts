import { sql } from "drizzle-orm";
import { db } from "../db.js";

/**
 * Delete every trace of the given test phone numbers in a single round trip.
 *
 * Written as one data-modifying CTE on purpose. The test database is remote — roughly
 * 300ms per query from here — so a teardown written as a dozen sequential statements
 * costs about four seconds per test before anything is exercised. This is one.
 *
 * Order matters: children before parents, since the foreign keys restrict deletes.
 */
export async function resetPhones(phones: string[]) {
  if (!phones.length) return;
  await db.execute(sql`
    with u as (
      select id from "user" where phone = any(${sql.raw(`ARRAY[${phones.map((p) => `'${p}'`).join(",")}]::text[]`)})
    ),
    m as (
      select studio_id from membership where user_id in (select id from u)
    ),
    del_client as (
      delete from client
      where user_id in (select id from u) or studio_id in (select studio_id from m)
    ),
    del_membership as (
      delete from membership where user_id in (select id from u) or studio_id in (select studio_id from m)
    ),
    del_studio as (
      delete from studio where id in (select studio_id from m)
    ),
    del_session as (
      delete from session where user_id in (select id from u)
    ),
    del_identity as (
      delete from auth_identity where user_id in (select id from u)
    ),
    del_challenge as (
      delete from auth_challenge
      where phone = any(${sql.raw(`ARRAY[${phones.map((p) => `'${p}'`).join(",")}]::text[]`)})
    )
    delete from "user" where id in (select id from u)
  `);
}
