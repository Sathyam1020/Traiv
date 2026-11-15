/**
 * Heart rate, field tests, running and walking arithmetic. Metric inside (metres, seconds,
 * kg, bpm); widgets convert at the edges. Every formula names its source.
 */

export type Sex = "male" | "female";

/* ---------------------------------------------------------- max heart rate */

/** Fox (220 − age), Tanaka 2001 (208 − 0.7·age), Gellish 2007 (207 − 0.7·age). */
export function maxHeartRate(age: number) {
  return { fox: 220 - age, tanaka: 208 - 0.7 * age, gellish: 207 - 0.7 * age };
}

/* ------------------------------------------------------------ zones */

export const ZONES = [
  {
    key: "z1",
    name: "Z1 Recovery",
    lo: 0.5,
    hi: 0.6,
    use: "Warm-ups, cool-downs and easy recovery",
  },
  { key: "z2", name: "Z2 Aerobic", lo: 0.6, hi: 0.7, use: "Aerobic base and long easy sessions" },
  { key: "z3", name: "Z3 Tempo", lo: 0.7, hi: 0.8, use: "Steady, comfortably hard aerobic work" },
  {
    key: "z4",
    name: "Z4 Threshold",
    lo: 0.8,
    hi: 0.9,
    use: "Around lactate threshold and race pace",
  },
  { key: "z5", name: "Z5 VO2 max", lo: 0.9, hi: 1, use: "Short, very hard intervals" },
] as const;

/**
 * Five zones as a share of max heart rate, or of heart rate reserve (Karvonen, 1957)
 * when a resting heart rate is given: target = rest + pct × (max − rest).
 */
export function heartRateZones(max: number, rest: number | null) {
  const at = (p: number) => (rest === null ? max * p : rest + p * (max - rest));
  return ZONES.map((z) => ({ ...z, loBpm: Math.round(at(z.lo)), hiBpm: Math.round(at(z.hi)) }));
}

export type Zone2Method = "hrmax" | "karvonen" | "maf";

/**
 * Zone 2 by three common schemes: 60–70% of max (220 − age unless a tested max is given),
 * 60–70% of heart rate reserve (Karvonen), or Maffetone's 180 − age ceiling with a
 * 10-beat floor below it.
 */
export function zone2(age: number, rest: number, testedMax: number | null, method: Zone2Method) {
  const max = testedMax ?? 220 - age;
  if (method === "maf") {
    const ceiling = 180 - age;
    return { lo: ceiling - 10, hi: ceiling, max: ceiling, maxFromTest: false };
  }
  if (method === "karvonen") {
    const hrr = max - rest;
    return { lo: rest + 0.6 * hrr, hi: rest + 0.7 * hrr, max, maxFromTest: testedMax !== null };
  }
  return { lo: 0.6 * max, hi: 0.7 * max, max, maxFromTest: testedMax !== null };
}

/* ------------------------------------------------------- VO2 max estimates */

/** Cooper (1968): VO2max = (metres in 12 minutes − 504.9) / 44.73. */
export const cooperVo2 = (metres: number) => (metres - 504.9) / 44.73;

/** 1.5-mile run (George et al. form widely used in field testing): 3.5 + 483 / minutes. */
export const mile15Vo2 = (minutes: number) => 3.5 + 483 / minutes;

/** Uth et al. (2004): VO2max ≈ 15.3 × HRmax / HRrest. */
export const restingHrVo2 = (maxHr: number, restHr: number) => (15.3 * maxHr) / restHr;

/* ---------------------------------------------------------------- beep test */

/** Shuttles per level of the 20 m multistage fitness test (Léger 1988 / Ramsbottom 1988 protocol). */
export const BEEP_SHUTTLES = [
  7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
] as const;

export const beepShuttlesAt = (level: number) => BEEP_SHUTTLES[level - 1] ?? 0;

/** Level 1 runs at 8.5 km/h and each level adds 0.5 km/h. */
export const beepSpeed = (level: number) => 8.5 + 0.5 * (level - 1);

/** Ramsbottom et al. (1988): VO2max = 3.46 × (L + S / Smax) + 12.2. */
export function beepTest(level: number, shuttle: number) {
  const smax = beepShuttlesAt(level);
  if (smax === 0 || shuttle < 1 || shuttle > smax) return null;
  let shuttles = shuttle;
  for (let l = 1; l < level; l++) shuttles += beepShuttlesAt(l);
  return {
    vo2: 3.46 * (level + shuttle / smax) + 12.2,
    speedKmh: beepSpeed(level),
    shuttles,
    metres: shuttles * 20,
    shuttlesInLevel: smax,
  };
}

/* ----------------------------------------------------------- VO2 categories */

export const VO2_CATEGORIES = [
  "Very poor",
  "Poor",
  "Fair",
  "Good",
  "Excellent",
  "Superior",
] as const;
export type Vo2Category = (typeof VO2_CATEGORIES)[number];

/**
 * Lower bounds (ml/kg/min) of Poor, Fair, Good, Excellent and Superior by age band. From the
 * widely reproduced Cooper Institute–based norm table (Heyward, Advanced Fitness Assessment).
 */
const VO2_NORMS: Record<
  Sex,
  readonly (readonly [number, readonly [number, number, number, number, number]])[]
> = {
  male: [
    [19, [35.0, 38.4, 45.2, 51.0, 56.0]],
    [29, [33.0, 36.5, 42.5, 46.5, 52.5]],
    [39, [31.5, 35.5, 41.0, 45.0, 49.5]],
    [49, [30.2, 33.6, 39.0, 43.8, 48.1]],
    [59, [26.1, 31.0, 35.8, 41.0, 45.4]],
    [200, [20.5, 26.1, 32.3, 36.5, 44.3]],
  ],
  female: [
    [19, [25.0, 31.0, 35.0, 39.0, 42.0]],
    [29, [23.6, 29.0, 33.0, 37.0, 41.1]],
    [39, [22.8, 27.0, 31.5, 35.7, 40.1]],
    [49, [21.0, 24.5, 29.0, 32.9, 37.0]],
    [59, [20.2, 22.8, 27.0, 31.5, 35.8]],
    [200, [17.5, 20.2, 24.5, 30.3, 31.5]],
  ],
};

export const AGE_BANDS = ["13–19", "20–29", "30–39", "40–49", "50–59", "60+"] as const;

const bandIndex = (age: number) =>
  age < 20 ? 0 : age < 30 ? 1 : age < 40 ? 2 : age < 50 ? 3 : age < 60 ? 4 : 5;

export function vo2Norms(age: number, sex: Sex) {
  const row = VO2_NORMS[sex][bandIndex(age)];
  if (!row) throw new RangeError("age");
  return row[1];
}

export function vo2Category(vo2: number, age: number, sex: Sex): Vo2Category {
  const b = vo2Norms(age, sex);
  let i = 0;
  while (i < b.length && vo2 >= (b[i] ?? Infinity)) i++;
  return VO2_CATEGORIES[i] ?? "Superior";
}

/** Display ranges for each category, lowest first. */
export function vo2Ranges(age: number, sex: Sex) {
  const b = vo2Norms(age, sex);
  return VO2_CATEGORIES.map((name, i) => {
    const lo = i === 0 ? null : b[i - 1];
    const hi = i < b.length ? b[i] : null;
    const label =
      lo === undefined || lo === null
        ? `Below ${hi?.toFixed(1)}`
        : hi === null || hi === undefined
          ? `${lo.toFixed(1)} and above`
          : `${lo.toFixed(1)} to ${(hi - 0.1).toFixed(1)}`;
    return { name, label };
  });
}

/* ------------------------------------------------------- Cooper distance norms */

export const COOPER_CATEGORIES = ["Very poor", "Poor", "Fair", "Good", "Excellent"] as const;
export type CooperCategory = (typeof COOPER_CATEGORIES)[number];

/** Lower bounds (m) of Poor, Fair, Good and Excellent, from Cooper's published 12-minute run norms. */
const COOPER_NORMS: Record<
  Sex,
  readonly (readonly [number, readonly [number, number, number, number]])[]
> = {
  male: [
    [14, [2100, 2200, 2400, 2701]],
    [16, [2200, 2300, 2500, 2801]],
    [19, [2300, 2500, 2700, 3001]],
    [29, [1600, 2200, 2400, 2801]],
    [39, [1500, 1900, 2300, 2701]],
    [49, [1400, 1700, 2100, 2501]],
    [200, [1300, 1600, 2000, 2401]],
  ],
  female: [
    [14, [1500, 1600, 1900, 2001]],
    [16, [1600, 1700, 2000, 2101]],
    [19, [1700, 1800, 2100, 2301]],
    [29, [1500, 1800, 2200, 2701]],
    [39, [1400, 1700, 2000, 2501]],
    [49, [1200, 1500, 1900, 2301]],
    [200, [1100, 1400, 1700, 2201]],
  ],
};

export const COOPER_AGE_BANDS = [
  "13–14",
  "15–16",
  "17–19",
  "20–29",
  "30–39",
  "40–49",
  "50+",
] as const;

export function cooperNorms(age: number, sex: Sex) {
  const row = COOPER_NORMS[sex].find(([max]) => age <= max);
  if (!row) throw new RangeError("age");
  return row[1];
}

export function cooperCategory(metres: number, age: number, sex: Sex): CooperCategory {
  const b = cooperNorms(age, sex);
  let i = 0;
  while (i < b.length && metres >= (b[i] ?? Infinity)) i++;
  return COOPER_CATEGORIES[i] ?? "Excellent";
}

export function cooperRanges(age: number, sex: Sex) {
  const b = cooperNorms(age, sex);
  return COOPER_CATEGORIES.map((name, i) => {
    const lo = i === 0 ? null : (b[i - 1] ?? null);
    const hi = i < b.length ? (b[i] ?? null) : null;
    const label =
      lo === null
        ? `Under ${hi?.toLocaleString("en-US")} m`
        : hi === null
          ? `Over ${(lo - 1).toLocaleString("en-US")} m`
          : `${lo.toLocaleString("en-US")} to ${(hi - 1).toLocaleString("en-US")} m`;
    return { name, label };
  });
}

/* ------------------------------------------------------------- running */

export const METRES_PER_MILE = 1609.344;

export const RACES = [
  { key: "1500", label: "1500 m", metres: 1500 },
  { key: "mile", label: "1 mile", metres: METRES_PER_MILE },
  { key: "3k", label: "3K", metres: 3000 },
  { key: "5k", label: "5K", metres: 5000 },
  { key: "10k", label: "10K", metres: 10000 },
  { key: "half", label: "Half marathon", metres: 21097.5 },
  { key: "marathon", label: "Marathon", metres: 42195 },
] as const;

/** Riegel (1977, 1981): T2 = T1 × (D2 / D1)^1.06. */
export const RIEGEL_EXPONENT = 1.06;
export const riegel = (seconds: number, fromMetres: number, toMetres: number) =>
  seconds * (toMetres / fromMetres) ** RIEGEL_EXPONENT;

export function pace(metres: number, seconds: number) {
  return {
    secPerKm: seconds / (metres / 1000),
    secPerMile: seconds / (metres / METRES_PER_MILE),
    kmh: metres / 1000 / (seconds / 3600),
    mph: metres / METRES_PER_MILE / (seconds / 3600),
  };
}

/** h:mm:ss, or m:ss under an hour. */
export function clock(seconds: number) {
  const t = Math.round(seconds);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/* ------------------------------------------------------------- walking */

/**
 * Walking METs from the 2011 Compendium of Physical Activities (Ainsworth et al.).
 * kcal/min = MET × 3.5 × kg / 200.
 */
export const WALK_MET = { "2.0": 2.8, "2.5": 3.0, "3.0": 3.5, "3.5": 4.3, "4.0": 5.0 } as const;
export type WalkPace = keyof typeof WALK_MET;

export const kcalPerMin = (met: number, kg: number) => (met * 3.5 * kg) / 200;

export function intervalWalk(
  kg: number,
  briskMin: number,
  easyMin: number,
  rounds: number,
  brisk: WalkPace,
  easy: WalkPace,
  sessions: number,
) {
  const briskKcal = kcalPerMin(WALK_MET[brisk], kg) * briskMin * rounds;
  const easyKcal = kcalPerMin(WALK_MET[easy], kg) * easyMin * rounds;
  const minutes = (briskMin + easyMin) * rounds;
  const total = briskKcal + easyKcal;
  return {
    minutes,
    briskKcal,
    easyKcal,
    total,
    steadyKcal: kcalPerMin(WALK_MET["3.0"], kg) * minutes,
    weekly: total * sessions,
  };
}

/* ------------------------------------------------------------- rucking */

/** Pandolf terrain factors (Pandolf, Givoni & Goldman, 1977). */
export const TERRAIN = {
  pavement: 1.0,
  dirt: 1.1,
  "light-brush": 1.2,
  "heavy-brush": 1.5,
  sand: 2.1,
} as const;
export type Terrain = keyof typeof TERRAIN;

/**
 * Pandolf (1977) load-carriage equation, watts:
 * M = 1.5W + 2.0(W + L)(L/W)² + η(W + L)(1.5V² + 0.35VG)
 * W body mass kg, L load kg, V speed m/s, G grade %, η terrain factor.
 */
export function pandolfWatts(
  bodyKg: number,
  loadKg: number,
  speedMs: number,
  grade: number,
  terrain: Terrain,
) {
  const eta = TERRAIN[terrain];
  return (
    1.5 * bodyKg +
    2.0 * (bodyKg + loadKg) * (loadKg / bodyKg) ** 2 +
    eta * (bodyKg + loadKg) * (1.5 * speedMs ** 2 + 0.35 * speedMs * grade)
  );
}

const WATT_KCAL_MIN = 60 / 4184;

export function rucking(
  bodyKg: number,
  loadKg: number,
  speedMs: number,
  grade: number,
  terrain: Terrain,
  minutes: number,
) {
  const perMin = pandolfWatts(bodyKg, loadKg, speedMs, grade, terrain) * WATT_KCAL_MIN;
  const unloadedPerMin = pandolfWatts(bodyKg, 0, speedMs, grade, terrain) * WATT_KCAL_MIN;
  return {
    perMin,
    total: perMin * minutes,
    unloaded: unloadedPerMin * minutes,
    addedPct: (perMin / unloadedPerMin - 1) * 100,
  };
}

/* ------------------------------------------------------------- timer */

export type TimerMode = "emom" | "amrap" | "tabata" | "custom";
export type Segment = { kind: "work" | "rest"; seconds: number; round: number; rounds: number };

/** The ordered work and rest segments a timer runs through. */
export function timerSegments(
  mode: TimerMode,
  o: { minutes?: number; work?: number; rest?: number; rounds?: number },
): Segment[] {
  if (mode === "amrap")
    return [{ kind: "work", seconds: (o.minutes ?? 12) * 60, round: 1, rounds: 1 }];
  if (mode === "emom") {
    const n = o.minutes ?? 10;
    return Array.from({ length: n }, (_, i) => ({
      kind: "work" as const,
      seconds: 60,
      round: i + 1,
      rounds: n,
    }));
  }
  const work = o.work ?? 20;
  const rest = o.rest ?? 10;
  const n = o.rounds ?? 8;
  const out: Segment[] = [];
  for (let r = 1; r <= n; r++) {
    out.push({ kind: "work", seconds: work, round: r, rounds: n });
    if (rest > 0) out.push({ kind: "rest", seconds: rest, round: r, rounds: n });
  }
  return out;
}

export const timerTotal = (segs: readonly Segment[]) => segs.reduce((a, s) => a + s.seconds, 0);

/** Which segment is running after `elapsed` seconds, and how long is left in it. */
export function timerAt(segs: readonly Segment[], elapsed: number) {
  let t = elapsed;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (!s) break;
    if (t < s.seconds) return { index: i, segment: s, remaining: s.seconds - t, done: false };
    t -= s.seconds;
  }
  const last = segs[segs.length - 1] ?? null;
  return { index: segs.length - 1, segment: last, remaining: 0, done: true };
}
