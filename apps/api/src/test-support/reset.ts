import { sql } from "drizzle-orm";
import { db } from "../db.js";

/**
 * Delete every trace of the given test email addresses, removing recipes first.
 *
 * The remaining tree is removed with one data-modifying CTE to keep teardown cheap
 * on remote databases too. Recipes need their own preceding statement because a
 * membership cascade would otherwise update the same child the studio cascade deletes.
 *
 * `product_event.user_id` is `ON DELETE SET NULL`, not cascade — an event is a
 * historical fact that outlives the account on purpose (retention, ADR 0016). That
 * means deleting the user without also deleting their events leaves orphaned,
 * never-cleaned rows that accumulate across every test run and silently inflate
 * any test asserting an exact count over a date window (funnels, DAU/WAU/MAU). Those
 * have to go first, while `user_id` still points at them.
 *
 * Order matters: children before parents, since the foreign keys restrict deletes.
 */
export async function resetEmails(emails: string[]) {
  if (!emails.length) return;
  await db.execute(sql`delete from recipe where studio_id in (
    select studio_id from membership where user_id in (
      select id from "user" where email = any(${sql.param(emails)}::text[])
    )
  )`);
  await db.execute(sql`
    with u as (
      select id from "user" where email = any(${sql.raw(`ARRAY[${emails.map((e) => `'${e}'`).join(",")}]::text[]`)})
    ),
    m as (
      select studio_id from membership where user_id in (select id from u)
    ),
    del_events as (
      delete from product_event where user_id in (select id from u)
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
      where email = any(${sql.raw(`ARRAY[${emails.map((e) => `'${e}'`).join(",")}]::text[]`)})
    )
    delete from "user" where id in (select id from u)
  `);
}
