/**
 * Strength arithmetic: one-rep max estimates, relative-strength scores, effort scales,
 * warm-ups, plate loading, tempo and training volume. All weights here are in kilograms
 * unless a function says otherwise; the widgets convert at the edges.
 */

/* ------------------------------------------------------------- one-rep max */

export type Formula = "epley" | "brzycki";

/** Epley (1985): w × (1 + r/30). Brzycki (1993): w × 36 / (37 − r). One rep is the weight itself. */
export function oneRepMax(weight: number, reps: number, formula: Formula): number {
  if (reps <= 1) return weight;
  return formula === "epley" ? weight * (1 + reps / 30) : (weight * 36) / (37 - reps);
}

/** Reps a lifter could expect at a given share of 1RM, by inverting the same formula. */
export function repsAtPercent(pct: number, formula: Formula): number {
  if (pct >= 1) return 1;
  return formula === "epley" ? Math.max(1, 30 * (1 / pct - 1)) : Math.max(1, 37 - 36 * pct);
}

export const PERCENT_ROWS = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6] as const;

export function percentTable(oneRm: number, formula: Formula, roundTo: number) {
  return PERCENT_ROWS.map((p) => ({
    pct: p,
    weight: roundToNearest(oneRm * p, roundTo),
    reps: Math.round(repsAtPercent(p, formula)),
  }));
}

export const roundToNearest = (x: number, step: number) => Math.round(x / step) * step;

/* -------------------------------------------------- relative-strength scores */

export type Sex = "male" | "female";

const poly = (c: readonly number[], x: number) => c.reduce((sum, k, i) => sum + k * x ** i, 0);

/** Wilks 2020 (Wilks-2), IPF March 2020 formula evaluation, Appendix 1.
 * https://www.powerlifting.sport/fileadmin/ipf/data/ipf-formula/Models_Evaluation-I-2020.pdf
 * Coefficients are constant-first; score = total × 600 / poly(bodyweight). */
const WILKS = {
  male: [
    47.4617885411949, 8.47206137941125, 0.073694103462609, -0.00139583381094385,
    0.00000707665973070743, -0.0000000120804336482315,
  ],
  female: [
    -125.425539779509, 13.7121941940668, -0.0330725063103405, -0.0010504000506583,
    0.00000938773881462799, -0.000000023334613884954,
  ],
} as const;

/** DOTS coefficients (adopted by several federations from 2019): score = total × 500 / poly(bw). */
const DOTS = {
  male: [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093],
  female: [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706],
} as const;

/** Bodyweight limits the formulas were fitted on; outside them the curves misbehave. */
const clampBw = (bw: number, sex: Sex, kind: "wilks" | "dots") =>
  kind === "wilks"
    ? Math.min(sex === "male" ? 210 : 150, Math.max(40, bw))
    : Math.min(sex === "male" ? 210 : 150, Math.max(40, bw));

export function wilks(totalKg: number, bwKg: number, sex: Sex) {
  return (totalKg * 600) / poly(WILKS[sex], clampBw(bwKg, sex, "wilks"));
}

export function dots(totalKg: number, bwKg: number, sex: Sex) {
  return (totalKg * 500) / poly(DOTS[sex], clampBw(bwKg, sex, "dots"));
}

/** IPF GL points (2020): total × 100 / (A − B·e^(−C·bw)). */
const IPF_GL = {
  male: { classic: [1199.72839, 1025.18162, 0.00921], equipped: [1236.25115, 1449.21864, 0.01644] },
  female: { classic: [610.32796, 1045.59282, 0.03048], equipped: [758.63878, 949.31382, 0.02435] },
} as const;

export function ipfGl(totalKg: number, bwKg: number, sex: Sex, division: "classic" | "equipped") {
  const [a, b, c] = IPF_GL[sex][division];
  return (totalKg * 100) / (a - b * Math.exp(-c * Math.max(40, bwKg)));
}

/** Sinclair coefficients in use since 2021: A and b (kg). Above b the coefficient is 1. */
const SINCLAIR = {
  male: { a: 0.722762521, b: 193.609 },
  female: { a: 0.787004341, b: 153.757 },
} as const;

export function sinclair(totalKg: number, bwKg: number, sex: Sex) {
  const { a, b } = SINCLAIR[sex];
  const coef = bwKg >= b ? 1 : 10 ** (a * Math.log10(bwKg / b) ** 2);
  return { coef, total: totalKg * coef };
}

/* --------------------------------------------------------------- RPE / RIR */

/**
 * %1RM at RPE 10 for 1–12 reps (the widely used chart popularised by Mike Tuchscherer).
 * Lower RPE means reps in reserve, so the effective reps are reps + (10 − RPE).
 */
const RPE10 = [1, 0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68];

export function percentAtRpe(reps: number, rpe: number): number {
  const eff = reps + (10 - rpe);
  if (eff <= 1) return 1;
  if (eff <= 12) {
    const lo = Math.floor(eff);
    const hi = Math.ceil(eff);
    const a = RPE10[lo - 1] ?? 1;
    const b = RPE10[hi - 1] ?? a;
    return a + (b - a) * (eff - lo);
  }
  // Beyond the chart, continue the Epley curve from its last row.
  return (RPE10[11] ?? 0.68) * ((1 + 12 / 30) / (1 + eff / 30));
}

/* ---------------------------------------------------------------- warm-ups */

export function warmupRamp(workKg: number, mode: "full" | "quick", barKg: number, step: number) {
  const scheme =
    mode === "full"
      ? [
          { pct: 0, reps: 10 },
          { pct: 0.4, reps: 5 },
          { pct: 0.6, reps: 3 },
          { pct: 0.75, reps: 2 },
          { pct: 0.85, reps: 1 },
        ]
      : [
          { pct: 0.4, reps: 5 },
          { pct: 0.65, reps: 3 },
          { pct: 0.85, reps: 1 },
        ];
  return scheme.map((s) => ({
    weight: s.pct === 0 ? barKg : Math.max(barKg, roundToNearest(workKg * s.pct, step)),
    reps: s.reps,
    pct: s.pct,
  }));
}

/* ------------------------------------------------------------ plate loading */

export function loadBar(target: number, bar: number, plates: readonly number[]) {
  if (
    ![target, bar].every(Number.isFinite) ||
    target < 0 ||
    bar < 0 ||
    plates.some((p) => !Number.isFinite(p) || p <= 0)
  ) {
    throw new RangeError("Use finite non-negative loads and strictly positive plate sizes.");
  }
  let perSide = (target - bar) / 2;
  if (perSide < 0) return { perSide: [] as number[], loaded: bar, short: target - bar };
  const used: number[] = [];
  for (const p of [...plates].sort((a, b) => b - a)) {
    while (perSide + 1e-9 >= p) {
      used.push(p);
      perSide -= p;
    }
  }
  const loaded = bar + 2 * used.reduce((a, b) => a + b, 0);
  return { perSide: used, loaded, short: Math.round((target - loaded) * 1000) / 1000 };
}

/* -------------------------------------------------------------------- tempo */

/** Tempo digits in seconds; an explosive "X" concentric is counted as one second. */
export function tempoTime(
  ecc: number,
  bottom: number,
  con: number,
  top: number,
  reps: number,
  sets: number,
) {
  const perRep = ecc + bottom + con + top;
  return { perRep, perSet: perRep * reps, total: perRep * reps * sets };
}

/* --------------------------------------------------------------- volume */

export type VolumeBand = "below-mev" | "productive" | "high" | "above-mrv";

export function volumeBand(sets: number, mev: number, mav: number, mrv: number): VolumeBand {
  if (sets < mev) return "below-mev";
  if (sets <= mav) return "productive";
  if (sets <= mrv) return "high";
  return "above-mrv";
}

/* ------------------------------------------------------- strength standards */

export type Lift = "squat" | "bench" | "deadlift" | "ohp";
export const LEVELS = ["Beginner", "Novice", "Intermediate", "Advanced", "Elite"] as const;

/**
 * Bodyweight multiples marking the start of Novice, Intermediate, Advanced and Elite.
 * Strength Level published bodyweight-ratio tables, checked 2026-11-15.
 * https://strengthlevel.com/strength-standards/{squat,bench-press,deadlift,shoulder-press}/lb
 * Coarse community benchmarks, not population percentiles or competition qualification.
 * Beginner includes everyone below the Novice threshold; no age adjustment.
 */
export const STANDARDS: Record<Sex, Record<Lift, readonly [number, number, number, number]>> = {
  male: {
    squat: [1.25, 1.75, 2.25, 2.75],
    bench: [1, 1.25, 1.5, 2],
    deadlift: [1.5, 2, 2.5, 3.25],
    ohp: [0.55, 0.8, 1.05, 1.35],
  },
  female: {
    squat: [0.75, 1.25, 1.75, 2.25],
    bench: [0.5, 0.75, 1.1, 1.45],
    deadlift: [1, 1.5, 2, 2.5],
    ohp: [0.35, 0.5, 0.7, 0.95],
  },
};

export function strengthLevel(oneRm: number, bw: number, sex: Sex, lift: Lift) {
  const ratio = oneRm / bw;
  const t = STANDARDS[sex][lift];
  let idx = 0;
  for (let i = 0; i < t.length; i++) if (ratio >= (t[i] ?? Infinity)) idx = i + 1;
  const nextMultiple = idx < t.length ? (t[idx] ?? null) : null;
  return {
    ratio,
    level: LEVELS[idx] ?? "Elite",
    nextLevel: idx < t.length ? (LEVELS[idx + 1] ?? null) : null,
    nextWeight: nextMultiple === null ? null : nextMultiple * bw,
    thresholds: t,
  };
}
