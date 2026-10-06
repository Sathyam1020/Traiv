import { schema } from "@traiv/db";
import { and, isNotNull, lt, or } from "drizzle-orm";
import { db } from "../../db.js";

/**
 * Nothing was ever deleted.
 *
 * `auth_challenge` grows by a row per sign-in attempt forever, and `session` keeps every
 * expired and revoked row. Both also hold `request_ip` and `user_agent`, which are
 * personal data under the DPDP Act — keeping them indefinitely is a position we would
 * have to defend, and there is no reason to.
 *
 * Run nightly. Both sweeps are indexed on the column they filter.
 */

/** Long enough to investigate an incident, short enough not to be a dossier. */
const CHALLENGE_RETENTION_DAYS = 30;
const DEAD_SESSION_RETENTION_DAYS = 30;

export async function purgeExpiredAuthRows(now = new Date()) {
  const challengeCutoff = new Date(now.getTime() - CHALLENGE_RETENTION_DAYS * 86_400_000);
  const sessionCutoff = new Date(now.getTime() - DEAD_SESSION_RETENTION_DAYS * 86_400_000);

  // Challenges are safe to drop wholesale once expired: they are single-use and the
  // rate limits only ever look back an hour.
  const challenges = await db
    .delete(schema.authChallenges)
    .where(lt(schema.authChallenges.expiresAt, challengeCutoff))
    .returning({ id: schema.authChallenges.id });

  // Sessions only once they can no longer authenticate anything — expired, or revoked
  // long enough ago that nobody is still asking why.
  const sessions = await db
    .delete(schema.sessions)
    .where(
      or(
        lt(schema.sessions.expiresAt, sessionCutoff),
        and(isNotNull(schema.sessions.revokedAt), lt(schema.sessions.revokedAt, sessionCutoff)),
      ),
    )
    .returning({ id: schema.sessions.id });

  return { challenges: challenges.length, sessions: sessions.length };
}

/**
 * Strips the personal data from rows we keep for their counts.
 *
 * An IP and a user agent are only needed while an investigation might want them. The row
 * itself stays, so rate-limit history and audit counts survive the scrub.
 */
export async function scrubOldRequestMetadata(now = new Date()) {
  const cutoff = new Date(now.getTime() - 30 * 86_400_000);

  const scrubbed = await db
    .update(schema.sessions)
    .set({ ip: null, userAgent: null })
    .where(and(lt(schema.sessions.createdAt, cutoff), isNotNull(schema.sessions.ip)))
    .returning({ id: schema.sessions.id });

  await db
    .update(schema.authChallenges)
    .set({ requestIp: null })
    .where(
      and(lt(schema.authChallenges.createdAt, cutoff), isNotNull(schema.authChallenges.requestIp)),
    );

  return { sessions: scrubbed.length };
}

/** Entry point for the nightly job. */
export async function runRetention() {
  const purged = await purgeExpiredAuthRows();
  const scrubbed = await scrubOldRequestMetadata();
  console.warn(
    `retention: purged ${purged.challenges} challenges, ${purged.sessions} sessions; ` +
      `scrubbed ${scrubbed.sessions} session metadata rows`,
  );
  return { ...purged, ...scrubbed };
}

if (process.argv[1]?.endsWith("retention.ts")) {
  runRetention().then(
    () => process.exit(0),
    (e) => {
      console.error(e);
      process.exit(1);
    },
  );
}
