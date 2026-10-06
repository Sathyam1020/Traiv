/**
 * Postgres error codes, read through Drizzle's wrapper.
 *
 * Drizzle raises its own Error and puts the driver's error on `cause`, so a check against
 * `err.code` is always false — and silently so. Anything retrying or recovering from a
 * constraint violation has to look one level down, which is easy to forget and impossible
 * to notice, because the path only runs on a collision nobody can reproduce on demand.
 */
const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";

function codeOf(err: unknown): string | undefined {
  for (let cur: unknown = err, depth = 0; cur && depth < 4; depth++) {
    if (typeof cur === "object" && "code" in cur && typeof cur.code === "string") {
      return cur.code;
    }
    cur = typeof cur === "object" && "cause" in cur ? cur.cause : undefined;
  }
  return undefined;
}

export function isUniqueViolation(err: unknown): boolean {
  return codeOf(err) === UNIQUE_VIOLATION;
}

export function isForeignKeyViolation(err: unknown): boolean {
  return codeOf(err) === FOREIGN_KEY_VIOLATION;
}
