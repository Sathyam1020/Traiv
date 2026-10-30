import { sql } from "drizzle-orm";
import { db } from "../db.js";

/**
 * Delete every trace of the given test phone numbers, removing recipes first.
 *
 * The remaining tree is removed with one data-modifying CTE to keep teardown cheap
 * on remote databases too. Recipes need their own preceding statement because a
 * membership cascade would otherwise update the same child the studio cascade deletes.
 *
 * Order matters: children before parents, since the foreign keys restrict deletes.
 */
export async function resetPhones(phones: string[]) {
  if (!phones.length) return;
  // Remove recipes before membership deletion SET NULLs their created_by. Updating a
  // child through one data-modifying CTE then deleting it through another cascade in
  // the same statement is undefined in Postgres; nutrition introduces that overlap.
  await db.execute(sql`delete from recipe where studio_id in (
    select studio_id from membership where user_id in (
      select id from "user" where phone = any(${sql.param(phones)}::text[])
    )
  )`);
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
