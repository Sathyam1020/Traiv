"use client";

import type { AnswerInput } from "@/lib/api";

/**
 * A check-in in progress, kept on the device.
 *
 * Coachway's draft is device-local too — a persisted store, not a server row — which is
 * the finding that saved this feature a schema change. It is also the right place: a
 * half-answered form is not information the coach wants, and round-tripping every
 * keystroke to Neon from a basement gym is how a form becomes unusable.
 *
 * Four rules, all copied from their client because all four are load-bearing:
 *
 *  1. **`submissionId` is minted once, here, and persisted with the draft.** It travels
 *     with the submission. A retry after a dropped response carries the same id, so one
 *     check-in cannot become two.
 *  2. **A draft belongs to one check-in.** Opening a different one does not inherit the
 *     last one's answers.
 *  3. **A draft expires with its period.** Theirs is `isDraftFromPreviousPeriod`:
 *     compared against the check-in's own window rather than a fixed age, so a draft
 *     started for last week's check-in is never resumed into this week's.
 *  4. **Every write stamps `lastUpdatedAt`**, which is what makes 3 answerable.
 */

const KEY = "traiv.check-in.draft";
const VERSION = 1;

export type Draft = {
  version: number;
  checkInId: string;
  /** The window the draft was started for — rule 3 compares against this. */
  dueOn: string;
  closesOn: string;
  submissionId: string;
  startedAt: string;
  lastUpdatedAt: string;
  stepIndex: number;
  /** Keyed by metric id, so re-answering a question replaces rather than appends. */
  answers: Record<string, AnswerInput>;
};

/**
 * `localStorage` throws outright in some contexts — a private window with site data
 * blocked, an embedded webview — and returns null in plenty more. Every read and write
 * is wrapped, and a failure degrades to "no draft", which is a working form rather than
 * a blank screen.
 */
function read(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    return draft.version === VERSION ? draft : null;
  } catch {
    return null;
  }
}

function write(draft: Draft): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Nothing to do and nothing worth telling them: the form still works, it just will
    // not survive a reload. Saying so on every keystroke would be worse than the loss.
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* as above */
  }
}

/**
 * The draft for this check-in, or null.
 *
 * Rules 2 and 3 are both enforced here rather than at the call sites, so there is no way
 * to read a stale draft by forgetting to check. A draft that fails either rule is
 * discarded rather than returned — leaving it would mean the next check-in silently
 * inherits it.
 */
export function loadDraft(checkIn: { id: string; dueOn: string; closesOn: string }): Draft | null {
  const draft = read();
  if (!draft) return null;

  // Rule 2: a different check-in.
  if (draft.checkInId !== checkIn.id) return null;

  // Rule 3: the window moved under it. Comparing the stored window against the live one
  // catches both a stale draft and a coach who changed the schedule mid-week.
  if (draft.dueOn !== checkIn.dueOn || draft.closesOn !== checkIn.closesOn) {
    clearDraft();
    return null;
  }

  return draft;
}

/** True when there is something worth saying "Continue" about. */
export function hasDraft(checkIn: { id: string; dueOn: string; closesOn: string } | null): boolean {
  if (!checkIn) return false;
  const draft = loadDraft(checkIn);
  return draft !== null && Object.keys(draft.answers).length > 0;
}

export function startDraft(checkIn: { id: string; dueOn: string; closesOn: string }): Draft {
  const existing = loadDraft(checkIn);
  if (existing) return existing;

  const now = new Date().toISOString();
  const draft: Draft = {
    version: VERSION,
    checkInId: checkIn.id,
    dueOn: checkIn.dueOn,
    closesOn: checkIn.closesOn,
    // Rule 1. Minted once, at the start, and never again for this draft.
    submissionId: crypto.randomUUID(),
    startedAt: now,
    lastUpdatedAt: now,
    stepIndex: 0,
    answers: {},
  };
  write(draft);
  return draft;
}

export function saveAnswer(draft: Draft, answer: AnswerInput): Draft {
  const next: Draft = {
    ...draft,
    answers: { ...draft.answers, [answer.metricId]: answer },
    lastUpdatedAt: new Date().toISOString(),
  };
  write(next);
  return next;
}

/** Clearing one answer is distinct from answering it with nothing — a skip, not a zero. */
export function clearAnswer(draft: Draft, metricId: string): Draft {
  const answers = { ...draft.answers };
  delete answers[metricId];
  const next: Draft = { ...draft, answers, lastUpdatedAt: new Date().toISOString() };
  write(next);
  return next;
}

export function saveStepIndex(draft: Draft, stepIndex: number): Draft {
  const next: Draft = { ...draft, stepIndex, lastUpdatedAt: new Date().toISOString() };
  write(next);
  return next;
}
