/**
 * Rule-based readers for coaching decisions. Each takes a coach's inputs and returns a
 * verdict with its reasons. No message text lives here; the web layer writes the words.
 * These are decision aids for coaches, not assessments or diagnoses.
 */

const KG_PER_LB = 0.45359237;

/* --------------------------------------------------------- series parsing */

/** Numbers separated by commas, spaces, semicolons or new lines. */
export function parseNumbers(text: string): number[] {
  return text
    .split(/[\s,;]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map(Number)
    .filter((x) => Number.isFinite(x) && x > 0);
}

/** "100x5, 102.5 x 4" or "100*5" → [{weight, reps}]. Entries that don't parse are skipped. */
export function parseSets(text: string) {
  const out: { weight: number; reps: number }[] = [];
  for (const part of text.split(/[,;\n]+/)) {
    const m = part.trim().match(/^(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+)$/i);
    if (!m) continue;
    const weight = Number(m[1]);
    const reps = Number(m[2]);
    if (weight > 0 && reps >= 1 && reps <= 30) out.push({ weight, reps });
  }
  return out;
}

/** Least-squares slope and residual standard deviation of y against 0..n−1. */
export function trend(ys: readonly number[]) {
  const n = ys.length;
  const xm = (n - 1) / 2;
  const ym = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    const y = ys[i] ?? ym;
    sxy += (i - xm) * (y - ym);
    sxx += (i - xm) ** 2;
  }
  const slope = sxx > 0 ? sxy / sxx : 0;
  let ss = 0;
  for (let i = 0; i < n; i++) ss += ((ys[i] ?? ym) - (ym + slope * (i - xm))) ** 2;
  const resid = n > 2 ? Math.sqrt(ss / (n - 2)) : 0;
  const se = sxx > 0 && n > 2 ? resid / Math.sqrt(sxx) : 0;
  return { slope, resid, se, mean: ym };
}

/* --------------------------------------------------------- red flags */

const RED_FLAGS: { re: RegExp; topic: string }[] = [
  { re: /chest pain|tight chest|heart (?:racing|pounding)|palpitation/i, topic: "chest or heart symptoms" },
  { re: /faint|passed out|black(?:ed)? out|dizz/i, topic: "fainting or dizziness" },
  { re: /binge|purg|throw(?:ing)? up after|starv|not eating|skipp(?:ing|ed) meals? (?:all|every)/i, topic: "possible disordered eating" },
  { re: /suicid|self[- ]?harm|hopeless|can'?t go on|want to die/i, topic: "a mental health crisis" },
  { re: /depress|anxiety attack|panic attack|really low lately/i, topic: "low mood or anxiety" },
  { re: /pregnan/i, topic: "pregnancy" },
  { re: /period (?:has )?stopped|missed (?:my )?periods?|no period/i, topic: "missed periods" },
  { re: /sharp pain|pain (?:is )?(?:getting )?worse|numb|tingling|swollen|injur/i, topic: "pain or a possible injury" },
  { re: /blood in|coughing blood|vomit/i, topic: "a medical symptom" },
];

export function scanRedFlags(note: string) {
  return RED_FLAGS.filter((f) => f.re.test(note)).map((f) => f.topic);
}

const EXIT_WORDS = /cancel|quit|stop (?:coaching|for now)|take a break|taking a break|pause|can'?t afford|money(?:'s| is) tight|tight on money|budget|leave|leaving|finish(?:ing)? up|end (?:my|the) (?:plan|coaching)|not worth/i;

export const mentionsExit = (note: string) => EXIT_WORDS.test(note);

/* --------------------------------------------------------- check-in reader */

export type Goal = "deficit" | "maintenance" | "surplus";
export type CheckinVerdict = "refer" | "pullback" | "behaviour" | "recalculate" | "hold" | "push" | "too-early";

export type CheckinInput = {
  weightChangeKg: number | null;
  weeks: number;
  adherencePct: number;
  trainingDone: number;
  trainingPlanned: number;
  sleepHours: number;
  energy: number;
  stress: number;
  goal: Goal;
  note: string;
};

export function readCheckin(c: CheckinInput) {
  const flags = scanRedFlags(c.note);
  const reasons: string[] = [];
  const trainingRatio = c.trainingPlanned > 0 ? c.trainingDone / c.trainingPlanned : 1;
  const lowRecovery = c.sleepHours < 6 || c.energy <= 2 || c.stress >= 4;
  if (flags.length) return { verdict: "refer" as CheckinVerdict, flags, reasons: [`The note mentions ${flags.join(" and ")}.`], trainingRatio, direction: null };
  if (lowRecovery) {
    if (c.sleepHours < 6) reasons.push(`Sleep is averaging ${c.sleepHours} hours.`);
    if (c.energy <= 2) reasons.push(`Energy is ${c.energy} out of 5.`);
    if (c.stress >= 4) reasons.push(`Stress is ${c.stress} out of 5.`);
    return { verdict: "pullback" as CheckinVerdict, flags, reasons, trainingRatio, direction: null };
  }
  if (c.adherencePct < 75 || trainingRatio < 0.75) {
    if (c.adherencePct < 75) reasons.push(`Nutrition adherence is ${c.adherencePct}%.`);
    if (trainingRatio < 0.75) reasons.push(`${c.trainingDone} of ${c.trainingPlanned} planned sessions were done.`);
    return { verdict: "behaviour" as CheckinVerdict, flags, reasons, trainingRatio, direction: null };
  }
  if (c.weightChangeKg === null) {
    reasons.push("No weight change was entered, so the read rests on adherence and recovery.");
    return { verdict: "push" as CheckinVerdict, flags, reasons, trainingRatio, direction: null };
  }
  const w = c.weightChangeKg;
  let direction: "too-slow" | "too-fast" | "on-track" = "on-track";
  if (c.goal === "deficit") direction = w > -0.1 ? "too-slow" : w < -1.0 ? "too-fast" : "on-track";
  else if (c.goal === "surplus") direction = w < 0.05 ? "too-slow" : w > 0.5 ? "too-fast" : "on-track";
  else direction = Math.abs(w) > 0.4 ? (w > 0 ? "too-fast" : "too-slow") : "on-track";
  if (direction === "on-track") {
    reasons.push("Weight is moving at a sensible pace for the goal, and adherence and recovery are solid.");
    return { verdict: "push" as CheckinVerdict, flags, reasons, trainingRatio, direction };
  }
  if (c.weeks < 3) {
    reasons.push(`Only ${c.weeks} week${c.weeks === 1 ? "" : "s"} on this plan; one week's weight is mostly water.`);
    return { verdict: "too-early" as CheckinVerdict, flags, reasons, trainingRatio, direction };
  }
  reasons.push(direction === "too-fast" ? "Weight is moving faster than the goal needs." : "Weight hasn't moved the way the goal needs, with good adherence over several weeks.");
  return { verdict: "recalculate" as CheckinVerdict, flags, reasons, trainingRatio, direction };
}

/* --------------------------------------------------------- churn risk */

export type ChurnSignals = {
  tenureWeeks: number;
  lastCheckin: 0 | 2 | 3;
  replies: "yes" | "slow" | "quiet";
  adherence: "steady" | "slipping" | "dropped";
  results: "ontrack" | "stalled" | "backwards";
  mood: "positive" | "neutral" | "frustrated";
  payment: "current" | "renewal" | "failed";
  note: string;
};

export function readChurnRisk(s: ChurnSignals) {
  const pts: { why: string; n: number }[] = [];
  if (s.lastCheckin === 2) pts.push({ why: "A check-in came in a week late", n: 2 });
  if (s.lastCheckin === 3) pts.push({ why: "Two or more check-ins missed", n: 3 });
  if (s.replies === "slow") pts.push({ why: "Replies have slowed", n: 1 });
  if (s.replies === "quiet") pts.push({ why: "They've gone quiet", n: 3 });
  if (s.adherence === "slipping") pts.push({ why: "Adherence is slipping", n: 1 });
  if (s.adherence === "dropped") pts.push({ why: "Adherence has dropped off", n: 2 });
  if (s.results === "stalled") pts.push({ why: "Results have stalled", n: 1 });
  if (s.results === "backwards") pts.push({ why: "Results are going backwards", n: 2 });
  if (s.mood === "neutral") pts.push({ why: "Last contact felt flat", n: 1 });
  if (s.mood === "frustrated") pts.push({ why: "Last contact was frustrated", n: 2 });
  if (s.payment === "renewal") pts.push({ why: "A renewal is coming up", n: 1 });
  if (s.payment === "failed") pts.push({ why: "A payment was missed or failed", n: 3 });
  if (s.tenureWeeks < 8) pts.push({ why: "They're in the first two months, when most clients leave", n: 1 });
  const score = pts.reduce((a, b) => a + b.n, 0);
  const exit = mentionsExit(s.note);
  const level: "low" | "watch" | "high" = exit || score >= 6 ? "high" : score >= 3 ? "watch" : "low";
  const main = [...pts].sort((a, b) => b.n - a.n)[0]?.why ?? null;
  return { score, level, exit, reasons: pts.map((p) => p.why), main, flags: scanRedFlags(s.note) };
}

/* --------------------------------------------------------- business health */

export const HEALTH_AREAS = ["admin", "tools", "onboarding", "checkins", "retention", "pricing", "experience", "capacity"] as const;
export type HealthArea = (typeof HEALTH_AREAS)[number];

/** Each area scores 0 to 2. Leaks are the lowest-scoring areas, worst first, in a fixed priority order. */
export function readBusinessHealth(scores: Record<HealthArea, 0 | 1 | 2>) {
  const total = HEALTH_AREAS.reduce((a, k) => a + scores[k], 0);
  const priority: HealthArea[] = ["retention", "capacity", "admin", "checkins", "onboarding", "experience", "pricing", "tools"];
  const zeros = priority.filter((k) => scores[k] === 0);
  const ones = priority.filter((k) => scores[k] === 1);
  const leaks = (zeros.length ? [...zeros, ...ones] : ones).slice(0, 3);
  const band: "strong" | "solid" | "leaky" | "fragile" = total >= 14 ? "strong" : total >= 10 ? "solid" : total >= 6 ? "leaky" : "fragile";
  return { total, max: 16, band, leaks };
}

/* --------------------------------------------------------- lift progression */

export const epley = (w: number, r: number) => (r <= 1 ? w : w * (1 + r / 30));

export type Experience = "novice" | "intermediate" | "advanced";
export type LiftVerdict = "progressing" | "wobble" | "stall" | "grinding" | "regressing";

/** Normal session-to-session bounce in estimated 1RM, as a share. */
const LIFT_NOISE: Record<Experience, number> = { novice: 0.02, intermediate: 0.025, advanced: 0.03 };

export function readLift(text: string, exp: Experience) {
  const sets = parseSets(text);
  if (sets.length < 3) return null;
  const e = sets.map((s) => epley(s.weight, s.reps));
  const t = trend(e);
  const first = e[0] ?? 0;
  const last = e[e.length - 1] ?? 0;
  const best = Math.max(...e);
  const noise = LIFT_NOISE[exp] * t.mean;
  const perSessionPct = (t.slope / t.mean) * 100;
  const changePct = ((last - first) / first) * 100;
  const loadUp = (sets[sets.length - 1]?.weight ?? 0) > (sets[0]?.weight ?? 0);
  const repsDown = (sets[sets.length - 1]?.reps ?? 0) < (sets[0]?.reps ?? 0);
  const lastDip = last < best - noise;
  let verdict: LiftVerdict;
  if (t.slope * (e.length - 1) > noise) verdict = lastDip ? "wobble" : "progressing";
  else if (t.slope * (e.length - 1) < -noise) verdict = "regressing";
  else verdict = loadUp && repsDown ? "grinding" : "stall";
  return { sets, e1rm: e, verdict, perSessionPct, changePct, best, last, first };
}

/* --------------------------------------------------------- weight trend */

export type Phase = "cut" | "maintain" | "gain";
export type WeightVerdict = "on-track" | "noise" | "stall" | "too-fast" | "recomp" | "water" | "too-slow-gain" | "drifting";

export function readWeightTrend(
  text: string,
  o: { daily: boolean; phase: Phase; adherencePct: number; waist: "down" | "flat" | "up"; strength: "up" | "flat"; cycle: boolean; event: boolean },
) {
  const ws = parseNumbers(text);
  if (ws.length < 4) return null;
  const t = trend(ws);
  const perWeek = o.daily ? t.slope * 7 : t.slope;
  const seWeek = o.daily ? t.se * 7 : t.se;
  const lo = perWeek - seWeek;
  const hi = perWeek + seWeek;
  const pct = (perWeek / t.mean) * 100;
  const weeks = o.daily ? (ws.length - 1) / 7 : ws.length - 1;
  const bounce = Math.max(...ws) - Math.min(...ws);
  let verdict: WeightVerdict;
  if (o.phase === "cut") {
    if (pct < -1.1) verdict = "too-fast";
    else if (pct <= -0.25) verdict = hi < 0 ? "on-track" : "noise";
    else if (o.waist === "down" || o.strength === "up") verdict = "recomp";
    else if (o.cycle || o.event) verdict = "water";
    else verdict = weeks < 2.5 ? "noise" : "stall";
  } else if (o.phase === "gain") {
    if (pct > 0.6) verdict = "too-fast";
    else if (pct >= 0.1) verdict = "on-track";
    else if (o.waist === "down" && o.strength === "up") verdict = "recomp";
    else verdict = weeks < 2.5 ? "noise" : "too-slow-gain";
  } else {
    if (Math.abs(pct) <= 0.25) verdict = "on-track";
    else if ((o.cycle || o.event) && pct > 0) verdict = "water";
    else verdict = weeks < 2.5 ? "noise" : "drifting";
  }
  return { weights: ws, perWeek, lo, hi, pct, weeks, bounce, mean: t.mean, verdict, adherenceLow: o.adherencePct < 80 };
}

export const lbToKgRate = (x: number) => x * KG_PER_LB;
