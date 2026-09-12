import { newId, schema } from "@traiv/db";
import { eq, isNull } from "drizzle-orm";
import { db } from "./db.js";
import { createDefaultStudio } from "./features/studio/service.js";

/**
 * Mock coaches for development. Idempotent — re-running updates rather than duplicating,
 * so it is safe to run against a database that already has data.
 */
const coaches = [
  { name: "Rahul Deshmukh", phone: "+919876543210", email: "rahul@example.com" },
  { name: "Priya Kulkarni", phone: "+919876543211", email: "priya@example.com" },
  { name: "Aarav Sharma", phone: "+919876543212", email: "aarav@example.com" },
  { name: "Meera Iyer", phone: "+919876543213", email: null },
  { name: "Rohan Das", phone: "+919876543214", email: null },
];

async function main() {
  for (const c of coaches) {
    const [existing] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.phone, c.phone))
      .limit(1);

    if (existing) {
      await db
        .update(schema.users)
        .set({ name: c.name, email: c.email, updatedAt: new Date() })
        .where(eq(schema.users.id, existing.id));
      console.warn(`  updated  ${c.name}  ${c.phone}`);
      continue;
    }

    const id = newId();
    await db.insert(schema.users).values({
      id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      phoneVerifiedAt: new Date(),
    });
    await db.insert(schema.authIdentities).values({
      id: newId(),
      userId: id,
      provider: "phone",
      providerUid: c.phone,
    });
    console.warn(`  created  ${c.name}  ${c.phone}`);
  }
  // Every trainer must own a studio. Backfills anyone created before studios existed,
  // and is a no-op once they all have one.
  const all = await db
    .select({ id: schema.users.id, name: schema.users.name })
    .from(schema.users)
    .where(isNull(schema.users.deletedAt));

  let made = 0;
  for (const u of all) {
    const [m] = await db
      .select({ id: schema.memberships.id })
      .from(schema.memberships)
      .where(eq(schema.memberships.userId, u.id))
      .limit(1);
    if (m) continue;
    await db.transaction(async (tx) => {
      await createDefaultStudio(tx, u);
    });
    made++;
  }
  if (made) console.warn(`  backfilled ${made} default studio(s)`);

  console.warn(`\n  ${coaches.length} coaches ready. Sign in with any of these numbers.\n`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
