/**
 * Rule-based programme tools: a weekly training split, and safer exercise swaps when
 * something hurts. Both are deterministic: the same inputs always give the same output,
 * and every rule is written here so it can be read and changed.
 */

/* ------------------------------------------------------------ plan builder */

export type PlanGoal = "muscle" | "strength" | "fitness" | "fatloss";
export type Experience = "beginner" | "intermediate" | "advanced";

type Slot = { name: string; main: boolean };
type DayTemplate = { title: string; slots: Slot[] };

const S = (name: string, main = false): Slot => ({ name, main });

const DAYS: Record<string, DayTemplate> = {
  fullA: {
    title: "Full body A",
    slots: [
      S("Back squat", true),
      S("Bench press", true),
      S("Barbell row"),
      S("Romanian deadlift"),
      S("Plank"),
    ],
  },
  fullB: {
    title: "Full body B",
    slots: [
      S("Deadlift", true),
      S("Overhead press", true),
      S("Lat pulldown"),
      S("Walking lunge"),
      S("Cable crunch"),
    ],
  },
  fullC: {
    title: "Full body C",
    slots: [
      S("Front squat", true),
      S("Incline dumbbell press", true),
      S("Seated cable row"),
      S("Hip thrust"),
      S("Farmer's carry"),
    ],
  },
  upperA: {
    title: "Upper A",
    slots: [
      S("Bench press", true),
      S("Barbell row", true),
      S("Overhead press"),
      S("Lat pulldown"),
      S("Biceps curl"),
      S("Triceps pushdown"),
    ],
  },
  upperB: {
    title: "Upper B",
    slots: [
      S("Incline dumbbell press", true),
      S("Pull-up", true),
      S("Seated dumbbell press"),
      S("Seated cable row"),
      S("Lateral raise"),
      S("Hammer curl"),
    ],
  },
  lowerA: {
    title: "Lower A",
    slots: [
      S("Back squat", true),
      S("Romanian deadlift", true),
      S("Leg press"),
      S("Leg curl"),
      S("Standing calf raise"),
    ],
  },
  lowerB: {
    title: "Lower B",
    slots: [
      S("Deadlift", true),
      S("Front squat", true),
      S("Walking lunge"),
      S("Hip thrust"),
      S("Seated calf raise"),
    ],
  },
  push: {
    title: "Push",
    slots: [
      S("Bench press", true),
      S("Overhead press", true),
      S("Incline dumbbell press"),
      S("Lateral raise"),
      S("Triceps pushdown"),
    ],
  },
  pull: {
    title: "Pull",
    slots: [
      S("Deadlift", true),
      S("Pull-up", true),
      S("Barbell row"),
      S("Face pull"),
      S("Biceps curl"),
    ],
  },
  legs: {
    title: "Legs",
    slots: [
      S("Back squat", true),
      S("Romanian deadlift", true),
      S("Leg press"),
      S("Leg curl"),
      S("Standing calf raise"),
    ],
  },
};

const SPLITS: Record<number, { name: string; days: string[] }> = {
  2: { name: "Full body, twice a week", days: ["fullA", "fullB"] },
  3: { name: "Full body, three times a week", days: ["fullA", "fullB", "fullC"] },
  4: { name: "Upper / lower, twice each", days: ["upperA", "lowerA", "upperB", "lowerB"] },
  5: {
    name: "Upper / lower plus push, pull, legs",
    days: ["upperA", "lowerA", "push", "pull", "legs"],
  },
  6: {
    name: "Push, pull, legs, twice each",
    days: ["push", "pull", "legs", "push", "pull", "legs"],
  },
};

/** Sets × reps for main lifts and accessories, by goal. */
const DOSE: Record<PlanGoal, { main: [number, string]; acc: [number, string]; finisher?: string }> =
  {
    muscle: { main: [4, "6–10"], acc: [3, "10–15"] },
    strength: { main: [5, "3–5"], acc: [3, "6–10"] },
    fitness: {
      main: [3, "8–12"],
      acc: [3, "12–15"],
      finisher: "10 minutes of intervals on a bike or rower",
    },
    fatloss: {
      main: [3, "8–12"],
      acc: [3, "12–15"],
      finisher: "15 minutes of brisk incline walking",
    },
  };

/** Beginners do one fewer set and drop the last accessory; advanced add a set to main lifts. */
const EXP_ADJ: Record<Experience, { mainSets: number; dropLast: boolean }> = {
  beginner: { mainSets: -1, dropLast: true },
  intermediate: { mainSets: 0, dropLast: false },
  advanced: { mainSets: 1, dropLast: false },
};

export type PlanExercise = { name: string; sets: number; reps: string; main: boolean };
export type PlanDay = { day: number; title: string; exercises: PlanExercise[]; finisher?: string };

export function buildPlan(days: number, goal: PlanGoal, experience: Experience) {
  const split = SPLITS[Math.min(6, Math.max(2, days))] ?? SPLITS[3];
  const dose = DOSE[goal];
  const adj = EXP_ADJ[experience];
  const plan: PlanDay[] = (split?.days ?? []).map((key, i) => {
    const t = DAYS[key];
    const slots = t ? (adj.dropLast ? t.slots.slice(0, -1) : t.slots) : [];
    return {
      day: i + 1,
      title: t?.title ?? "",
      exercises: slots.map((s) => ({
        name: s.name,
        main: s.main,
        sets: s.main ? Math.max(2, dose.main[0] + adj.mainSets) : dose.acc[0],
        reps: s.main ? dose.main[1] : dose.acc[1],
      })),
      ...(dose.finisher ? { finisher: dose.finisher } : {}),
    };
  });
  const weeklySets = plan.reduce((n, d) => n + d.exercises.reduce((m, e) => m + e.sets, 0), 0);
  return {
    splitName: split?.name ?? "",
    plan,
    weeklySets,
    rest: goal === "strength" ? "2–4 min on main lifts" : "60–120 s",
  };
}

/* ------------------------------------------------------------ injury swap */

export type Area = "shoulder" | "lowerback" | "knee" | "elbow" | "wrist" | "hip";
export type Severity = "twinge" | "painful" | "cannot";
export type Equipment = "gym" | "dumbbells" | "cables" | "bands" | "bodyweight";
export type SwapGoal = "strength" | "hypertrophy" | "general";

export const SWAP_EXERCISES = [
  "Barbell bench",
  "Incline press",
  "Overhead press",
  "Dips",
  "Push-ups",
  "Back squat",
  "Front squat",
  "Leg press",
  "Lunges",
  "Deadlift",
  "RDL",
  "Hip thrust",
  "Pull-ups",
  "Lat pulldown",
  "Barbell row",
  "Bicep curl",
  "Tricep pushdown",
] as const;
export type SwapExercise = (typeof SWAP_EXERCISES)[number];

type Pattern =
  | "horizontal-push"
  | "vertical-push"
  | "squat"
  | "hinge"
  | "vertical-pull"
  | "horizontal-pull"
  | "elbow-flex"
  | "elbow-ext";

const PATTERN: Record<SwapExercise, Pattern> = {
  "Barbell bench": "horizontal-push",
  "Incline press": "horizontal-push",
  Dips: "horizontal-push",
  "Push-ups": "horizontal-push",
  "Overhead press": "vertical-push",
  "Back squat": "squat",
  "Front squat": "squat",
  "Leg press": "squat",
  Lunges: "squat",
  Deadlift: "hinge",
  RDL: "hinge",
  "Hip thrust": "hinge",
  "Pull-ups": "vertical-pull",
  "Lat pulldown": "vertical-pull",
  "Barbell row": "horizontal-pull",
  "Bicep curl": "elbow-flex",
  "Tricep pushdown": "elbow-ext",
};

/** Candidate swaps per pattern, each tagged with the equipment it needs and the areas it is gentler on. */
type Option = { name: string; kit: Equipment[]; easesOn: Area[]; why: string };

const O = (name: string, kit: Equipment[], easesOn: Area[], why: string): Option => ({
  name,
  kit,
  easesOn,
  why,
});

const OPTIONS: Record<Pattern, Option[]> = {
  "horizontal-push": [
    O(
      "Neutral-grip dumbbell floor press",
      ["gym", "dumbbells"],
      ["shoulder", "elbow", "wrist"],
      "The floor limits how deep the shoulder travels, and a neutral grip is kinder to the front of the shoulder.",
    ),
    O(
      "Landmine press",
      ["gym"],
      ["shoulder", "wrist"],
      "A pressing angle between flat and overhead that many sore shoulders tolerate well.",
    ),
    O(
      "Cable chest press",
      ["gym", "cables"],
      ["shoulder", "elbow", "lowerback"],
      "Constant tension at lighter loads, and you choose the hand path.",
    ),
    O(
      "Band push-up or incline push-up",
      ["bands", "bodyweight"],
      ["shoulder", "wrist", "elbow"],
      "Easy to scale; the hands can rotate freely. Use fists or handles for sore wrists.",
    ),
    O(
      "Machine chest press",
      ["gym", "cables"],
      ["shoulder", "lowerback"],
      "A fixed path removes the need to stabilise a bar.",
    ),
  ],
  "vertical-push": [
    O(
      "Landmine press",
      ["gym"],
      ["shoulder", "lowerback"],
      "Presses up and forward rather than straight overhead.",
    ),
    O(
      "Half-kneeling single-arm dumbbell press",
      ["gym", "dumbbells"],
      ["lowerback", "shoulder"],
      "Takes load off the spine and lets the arm find a comfortable path.",
    ),
    O(
      "Seated neutral-grip dumbbell press",
      ["gym", "dumbbells"],
      ["lowerback", "wrist"],
      "Back support and a neutral grip reduce strain.",
    ),
    O(
      "Band overhead press",
      ["bands"],
      ["shoulder", "elbow"],
      "Lowest load at the bottom, where shoulders tend to complain.",
    ),
    O(
      "Pike push-up to a box",
      ["bodyweight"],
      ["lowerback"],
      "Uses bodyweight rather than an external bar; loading still depends on your position.",
    ),
  ],
  squat: [
    O(
      "Box squat to a comfortable depth",
      ["gym", "dumbbells", "bodyweight"],
      ["knee", "hip", "lowerback"],
      "The box sets a depth you can own and controls the descent.",
    ),
    O(
      "Goblet squat",
      ["gym", "dumbbells"],
      ["lowerback", "knee"],
      "Holds the weight in front of you; torso position and loading depend on your technique.",
    ),
    O(
      "Leg press, limited range",
      ["gym", "cables"],
      ["lowerback"],
      "Supported seated position; it still loads the body and may not suit your symptoms.",
    ),
    O(
      "Spanish squat with a band",
      ["bands"],
      ["knee"],
      "A well-known option for irritable knees, with the band reducing load on the front of the knee.",
    ),
    O(
      "Split squat with support",
      ["gym", "dumbbells", "bodyweight"],
      ["lowerback"],
      "One leg at a time means far less load for the same leg work.",
    ),
    O("Wall sit", ["bodyweight"], ["knee", "lowerback"], "An isometric hold at a pain-free angle."),
  ],
  hinge: [
    O(
      "Trap-bar deadlift from blocks",
      ["gym"],
      ["lowerback", "hip"],
      "A higher start and a more upright torso reduce the demand on the lower back.",
    ),
    O(
      "Cable pull-through",
      ["gym", "cables"],
      ["lowerback"],
      "Trains the hip hinge with the load pulling back, not down on the spine.",
    ),
    O(
      "Glute bridge or hip thrust",
      ["gym", "dumbbells", "bodyweight"],
      ["lowerback", "knee"],
      "Trains hip extension with the torso supported; it is not free of spinal loading.",
    ),
    O(
      "Band good morning",
      ["bands"],
      ["lowerback", "hip"],
      "Light, controlled hinging to rebuild tolerance.",
    ),
    O(
      "Back extension, partial range",
      ["gym"],
      ["hip"],
      "Lets you control range and load precisely.",
    ),
  ],
  "vertical-pull": [
    O(
      "Neutral-grip lat pulldown",
      ["gym", "cables"],
      ["shoulder", "elbow"],
      "A neutral grip is easier on the elbows and shoulders than a wide pronated one.",
    ),
    O(
      "Half-kneeling single-arm cable pulldown",
      ["gym", "cables"],
      ["shoulder", "lowerback"],
      "Each arm finds its own path; load is easy to reduce.",
    ),
    O(
      "Band pulldown",
      ["bands"],
      ["shoulder", "elbow"],
      "Light and adjustable, good for rebuilding.",
    ),
    O(
      "Inverted row",
      ["bodyweight", "gym"],
      ["shoulder"],
      "Changes the angle away from overhead while still training the back.",
    ),
  ],
  "horizontal-pull": [
    O(
      "Chest-supported dumbbell row",
      ["gym", "dumbbells"],
      ["lowerback"],
      "The bench removes the need to hold a hinged position.",
    ),
    O(
      "Seated cable row",
      ["gym", "cables"],
      ["lowerback", "wrist"],
      "Supported torso and swappable handles.",
    ),
    O("Band row", ["bands"], ["lowerback", "elbow"], "Low load, upright posture."),
    O(
      "Inverted row",
      ["bodyweight", "gym"],
      ["lowerback"],
      "Body stays straight; scale by foot position.",
    ),
  ],
  "elbow-flex": [
    O(
      "Hammer curl",
      ["gym", "dumbbells"],
      ["elbow", "wrist"],
      "A neutral grip often reduces irritation at the elbow and wrist.",
    ),
    O(
      "Cable curl with rope",
      ["gym", "cables"],
      ["elbow", "wrist"],
      "Smooth resistance and a comfortable grip.",
    ),
    O("Band curl", ["bands"], ["elbow"], "Light at the bottom, where elbows are most sensitive."),
  ],
  "elbow-ext": [
    O(
      "Rope pushdown, light",
      ["gym", "cables"],
      ["elbow", "wrist"],
      "Hands can rotate, easing elbow and wrist.",
    ),
    O("Dumbbell kickback", ["gym", "dumbbells"], ["elbow", "shoulder"], "Light load, short lever."),
    O("Band pushdown", ["bands"], ["elbow"], "Lowest load, easy to scale."),
    O(
      "Close-grip push-up on an incline",
      ["bodyweight"],
      ["shoulder"],
      "Bodyweight triceps work with adjustable difficulty.",
    ),
  ],
};

const DOSES: Record<SwapGoal, string> = {
  strength: "discuss load and repetition targets with your coach after assessment",
  hypertrophy: "discuss a tolerable load with your coach; do not train through pain or to failure",
  general: "use an easy effort only if the movement is comfortable",
};

export function exerciseSwap(args: {
  area: Area;
  severity: Severity;
  exercise: SwapExercise;
  goal: SwapGoal;
  equipment: Equipment;
}) {
  if (args.severity !== "twinge") {
    return {
      refer: true,
      message:
        "Stop the painful movement and ask a physiotherapist or doctor to assess it before choosing a loaded substitute. Seek urgent care for sudden severe pain, new weakness or numbness, or an inability to bear weight.",
      swaps: [],
      ramp: [],
      dose: null,
    };
  }
  const swaps = OPTIONS[PATTERN[args.exercise]]
    .filter((option) => option.kit.includes(args.equipment) || args.equipment === "gym")
    .sort((a, b) => Number(b.easesOn.includes(args.area)) - Number(a.easesOn.includes(args.area)))
    .slice(0, 3);
  return {
    refer: false,
    message: swaps.length
      ? "These are movement alternatives to discuss with your coach, not treatment or clearance to exercise. Stop if symptoms appear or worsen, and seek an assessment if they persist."
      : "No alternative in this list matches your equipment. Ask your coach for another movement rather than using equipment you do not have.",
    swaps,
    ramp: [
      "Check the movement with your coach before adding load.",
      "Use a comfortable range and stop if symptoms appear.",
      "Return to the original exercise only with an individual plan; there is no automatic weekly loading schedule.",
    ],
    dose: swaps.length ? DOSES[args.goal] : null,
  };
}
