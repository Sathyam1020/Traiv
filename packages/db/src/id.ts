import { v7 } from "uuid";

/**
 * UUIDv7 — time-sortable, and safe to mint on a client device.
 *
 * Client-side minting is what makes offline sync idempotent: the phone creates the id
 * before the server ever sees the row, so sync is `ON CONFLICT (id) DO NOTHING` and a
 * retry can never duplicate or lose a logged set. See ADR 0004.
 */
export function newId(): string {
  return v7();
}
