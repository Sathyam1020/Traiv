/**
 * Carrying a coach's join code across signup.
 *
 * Someone opens `/join/VBY6VZEC`, then disappears into a phone-OTP round trip — and may
 * switch apps to read the SMS, which on iOS can discard the tab's JavaScript entirely.
 * By the time there is a session to attach, the app still has to know which coach they
 * came for.
 *
 * The URL stays the source of truth; this is the fallback for when it is lost.
 *
 * `sessionStorage`, never `localStorage`. A code in local storage is still sitting there
 * next week, and the next time that person opens the client app it would silently attach
 * them to a coach they scanned once in a gym. Session storage dies with the tab, which is
 * the correct lifetime for "the link I am in the middle of following".
 */

const KEY = "traiv.join";

/** A code older than this is a leftover, not an intent. */
const MAX_AGE_MS = 60 * 60 * 1000;

type Stored = { code: string; savedAt: number };

/**
 * Codes are 8 characters from an alphabet with no 0/O/1/I/L/U — see `newJoinCode` in the
 * API. Validating the shape here keeps a hand-edited URL or a corrupted storage value
 * from reaching the network as a request.
 */
const CODE = /^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{8}$/;

export function isJoinCode(value: string | null | undefined): value is string {
  return typeof value === "string" && CODE.test(value.toUpperCase());
}

export function normalise(code: string): string {
  return code.trim().toUpperCase();
}

/** Called the moment `/join/:code` loads, before anything can navigate away. */
export function remember(code: string): void {
  if (!isJoinCode(code)) return;
  try {
    const value: Stored = { code: normalise(code), savedAt: Date.now() };
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Private mode, or storage disabled. The URL still has the code, and the OTP flow
    // never leaves the page — so this is a fallback losing a fallback, not a failure.
  }
}

/** The remembered code, or null if there is none, it is stale, or it is malformed. */
export function recall(): string | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (!isJoinCode(parsed.code) || typeof parsed.savedAt !== "number") {
      forget();
      return null;
    }
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      forget();
      return null;
    }
    return parsed.code;
  } catch {
    return null;
  }
}

/** Called after a successful attach, and whenever the API says a code is no longer valid. */
export function forget(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clean up if storage was never available.
  }
}

/**
 * The code to act on: whatever the route named, else whatever survived the round trip.
 * The URL wins, so following a second coach's link never attaches you to the first.
 */
export function resolve(fromUrl?: string | null): string | null {
  if (isJoinCode(fromUrl)) return normalise(fromUrl);
  return recall();
}
