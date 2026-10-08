import type { schema } from "@traiv/db";

type Pattern = (typeof schema.movementPattern.enumValues)[number];

export type SeedExercise = {
  name: string;
  pattern: Pattern;
  muscle: string;
  /** Must match an intake equipment value, or filtering silently drops the exercise. */
  equipment: "full_gym" | "home_basics" | "dumbbells" | "bands" | "bodyweight";
  cues: string;
};

/**
 * The movements a generated plan may use.
 *
 * Deliberately small and deliberately boring. Every one is a movement a coach would
 * actually prescribe to a beginner or intermediate client, and every one can be
 * demonstrated — a plan item with no video is a client standing in a gym not knowing what
 * to do, which is worse than a simpler exercise they understand.
 *
 * Coverage matters more than count. A bodyweight-only client can reach every pattern
 * except `carry` — which genuinely needs load, and is the one gap that is correct rather
 * than an omission. Checked, not assumed: squat 3, hinge 3, both pushes, both pulls,
 * lunge, core 4, cardio 3, mobility 5 at bodyweight or bands.
 *
 * Without that the bodyweight client gets whatever happened to be left over from the gym
 * list, which is how a home-training plan ends up as four variations of a push-up.
 *
 * Videos are null for now. ADR 0008 is the plan for those — licensed EDB Pro clips, self
 * hosted, converted to silent WebM.
 */
export const SEED_EXERCISES: readonly SeedExercise[] = [
  // ---- squat ----
  {
    name: "Barbell back squat",
    pattern: "squat",
    muscle: "Quads",
    equipment: "full_gym",
    cues: "Brace, sit between the hips, knees track over toes.",
  },
  {
    name: "Goblet squat",
    pattern: "squat",
    muscle: "Quads",
    equipment: "dumbbells",
    cues: "Hold the bell at the chest, elbows inside the knees at the bottom.",
  },
  {
    name: "Leg press",
    pattern: "squat",
    muscle: "Quads",
    equipment: "full_gym",
    cues: "Feet shoulder width, do not let the lower back round off the pad.",
  },
  {
    name: "Bodyweight squat",
    pattern: "squat",
    muscle: "Quads",
    equipment: "bodyweight",
    cues: "Sit back and down, heels flat, chest up.",
  },
  {
    name: "Banded squat",
    pattern: "squat",
    muscle: "Quads",
    equipment: "bands",
    cues: "Band above the knees, push them out the whole way.",
  },
  {
    name: "Wall sit",
    pattern: "squat",
    muscle: "Quads",
    equipment: "bodyweight",
    cues: "Thighs parallel, back flat on the wall, breathe.",
  },

  // ---- hinge ----
  {
    name: "Conventional deadlift",
    pattern: "hinge",
    muscle: "Hamstrings",
    equipment: "full_gym",
    cues: "Bar over mid-foot, lats tight, push the floor away.",
  },
  {
    name: "Romanian deadlift",
    pattern: "hinge",
    muscle: "Hamstrings",
    equipment: "dumbbells",
    cues: "Soft knees, push the hips back, stop when the hamstrings stretch.",
  },
  {
    name: "Dumbbell hip thrust",
    pattern: "hinge",
    muscle: "Glutes",
    equipment: "dumbbells",
    cues: "Chin tucked, ribs down, squeeze at the top.",
  },
  {
    name: "Glute bridge",
    pattern: "hinge",
    muscle: "Glutes",
    equipment: "bodyweight",
    cues: "Heels close, push through them, do not arch the lower back.",
  },
  {
    name: "Banded good morning",
    pattern: "hinge",
    muscle: "Hamstrings",
    equipment: "bands",
    cues: "Band across the upper back, hinge at the hips, flat spine.",
  },
  {
    name: "Single-leg Romanian deadlift",
    pattern: "hinge",
    muscle: "Hamstrings",
    equipment: "bodyweight",
    cues: "Hips square, reach the free leg straight back.",
  },

  // ---- push, horizontal ----
  {
    name: "Barbell bench press",
    pattern: "push_horizontal",
    muscle: "Chest",
    equipment: "full_gym",
    cues: "Shoulder blades pinned, bar to the lower chest, elbows at 45°.",
  },
  {
    name: "Dumbbell bench press",
    pattern: "push_horizontal",
    muscle: "Chest",
    equipment: "dumbbells",
    cues: "Wrists stacked over elbows, control the lowering.",
  },
  {
    name: "Push-up",
    pattern: "push_horizontal",
    muscle: "Chest",
    equipment: "bodyweight",
    cues: "Body in one line, elbows back not flared, full range.",
  },
  {
    name: "Incline push-up",
    pattern: "push_horizontal",
    muscle: "Chest",
    equipment: "bodyweight",
    cues: "Hands on a bench or table — the easier version, not the lazy one.",
  },
  {
    name: "Banded chest press",
    pattern: "push_horizontal",
    muscle: "Chest",
    equipment: "bands",
    cues: "Band anchored behind, press and squeeze across the chest.",
  },
  {
    name: "Machine chest press",
    pattern: "push_horizontal",
    muscle: "Chest",
    equipment: "full_gym",
    cues: "Seat height so the handles sit at mid-chest.",
  },

  // ---- push, vertical ----
  {
    name: "Standing overhead press",
    pattern: "push_vertical",
    muscle: "Shoulders",
    equipment: "full_gym",
    cues: "Glutes and abs tight, bar path close to the face.",
  },
  {
    name: "Dumbbell shoulder press",
    pattern: "push_vertical",
    muscle: "Shoulders",
    equipment: "dumbbells",
    cues: "Do not lean back; press up, not forward.",
  },
  {
    name: "Pike push-up",
    pattern: "push_vertical",
    muscle: "Shoulders",
    equipment: "bodyweight",
    cues: "Hips high, crown of the head toward the floor.",
  },
  {
    name: "Banded overhead press",
    pattern: "push_vertical",
    muscle: "Shoulders",
    equipment: "bands",
    cues: "Stand on the band, press without flaring the ribs.",
  },

  // ---- pull, horizontal ----
  {
    name: "Barbell row",
    pattern: "pull_horizontal",
    muscle: "Back",
    equipment: "full_gym",
    cues: "Hinge to 45°, pull to the belly button, no jerking.",
  },
  {
    name: "One-arm dumbbell row",
    pattern: "pull_horizontal",
    muscle: "Back",
    equipment: "dumbbells",
    cues: "Flat back, drive the elbow past the ribs.",
  },
  {
    name: "Seated cable row",
    pattern: "pull_horizontal",
    muscle: "Back",
    equipment: "full_gym",
    cues: "Chest tall, shoulder blades together at the end.",
  },
  {
    name: "Banded row",
    pattern: "pull_horizontal",
    muscle: "Back",
    equipment: "bands",
    cues: "Anchor at chest height, pull the elbows back and down.",
  },
  {
    name: "Inverted row",
    pattern: "pull_horizontal",
    muscle: "Back",
    equipment: "bodyweight",
    cues: "Under a sturdy table or bar, body straight, chest to the edge.",
  },

  // ---- pull, vertical ----
  {
    name: "Lat pulldown",
    pattern: "pull_vertical",
    muscle: "Back",
    equipment: "full_gym",
    cues: "Pull to the collarbone, lean back slightly, no swinging.",
  },
  {
    name: "Pull-up",
    pattern: "pull_vertical",
    muscle: "Back",
    equipment: "full_gym",
    cues: "Full hang at the bottom, chin over the bar.",
  },
  {
    name: "Banded lat pulldown",
    pattern: "pull_vertical",
    muscle: "Back",
    equipment: "bands",
    cues: "Band over a door anchor, pull to the chest with straight arms bending late.",
  },
  {
    name: "Towel door row",
    pattern: "pull_vertical",
    muscle: "Back",
    equipment: "bodyweight",
    cues: "Towel round a closed door handle, lean back, pull up.",
  },

  // ---- lunge ----
  {
    name: "Walking lunge",
    pattern: "lunge",
    muscle: "Quads",
    equipment: "dumbbells",
    cues: "Long step, back knee to just above the floor, torso upright.",
  },
  {
    name: "Reverse lunge",
    pattern: "lunge",
    muscle: "Quads",
    equipment: "bodyweight",
    cues: "Step back not forward — easier on the knees.",
  },
  {
    name: "Bulgarian split squat",
    pattern: "lunge",
    muscle: "Quads",
    equipment: "dumbbells",
    cues: "Rear foot on a bench, weight through the front heel.",
  },
  {
    name: "Step-up",
    pattern: "lunge",
    muscle: "Glutes",
    equipment: "bodyweight",
    cues: "Knee-height step, drive through the top foot, do not push off the bottom one.",
  },

  // ---- carry ----
  {
    name: "Farmer's carry",
    pattern: "carry",
    muscle: "Full body",
    equipment: "dumbbells",
    cues: "Tall, shoulders back, walk without leaning.",
  },
  {
    name: "Suitcase carry",
    pattern: "carry",
    muscle: "Core",
    equipment: "dumbbells",
    cues: "Weight in one hand, resist the lean to that side.",
  },

  // ---- core ----
  {
    name: "Plank",
    pattern: "core",
    muscle: "Core",
    equipment: "bodyweight",
    cues: "Ribs down, glutes on, straight line — quality over minutes.",
  },
  {
    name: "Side plank",
    pattern: "core",
    muscle: "Core",
    equipment: "bodyweight",
    cues: "Hips stacked and lifted, do not sag.",
  },
  {
    name: "Dead bug",
    pattern: "core",
    muscle: "Core",
    equipment: "bodyweight",
    cues: "Lower back pressed flat the whole time.",
  },
  {
    name: "Bird dog",
    pattern: "core",
    muscle: "Core",
    equipment: "bodyweight",
    cues: "Opposite arm and leg, no rotation through the hips.",
  },
  {
    name: "Cable woodchop",
    pattern: "core",
    muscle: "Core",
    equipment: "full_gym",
    cues: "Rotate from the ribs, not the arms.",
  },
  {
    name: "Hanging knee raise",
    pattern: "core",
    muscle: "Core",
    equipment: "full_gym",
    cues: "No swinging; curl the pelvis up.",
  },

  // ---- cardio ----
  {
    name: "Brisk walk",
    pattern: "cardio",
    muscle: "Heart",
    equipment: "bodyweight",
    cues: "Fast enough that talking takes effort.",
  },
  {
    name: "Treadmill incline walk",
    pattern: "cardio",
    muscle: "Heart",
    equipment: "full_gym",
    cues: "Incline up, speed moderate, no holding the rails.",
  },
  {
    name: "Stationary bike",
    pattern: "cardio",
    muscle: "Heart",
    equipment: "full_gym",
    cues: "Seat at hip height, steady cadence.",
  },
  {
    name: "Skipping",
    pattern: "cardio",
    muscle: "Heart",
    equipment: "bodyweight",
    cues: "Small bounces, wrists do the work.",
  },
  {
    name: "Stair climb",
    pattern: "cardio",
    muscle: "Heart",
    equipment: "bodyweight",
    cues: "Whole foot on the step, steady pace.",
  },

  // ---- mobility ----
  {
    name: "Cat-cow",
    pattern: "mobility",
    muscle: "Spine",
    equipment: "bodyweight",
    cues: "Move one vertebra at a time, breathe with it.",
  },
  {
    name: "90/90 hip switch",
    pattern: "mobility",
    muscle: "Hips",
    equipment: "bodyweight",
    cues: "Sit tall, rotate both knees together, no hands if you can.",
  },
  {
    name: "Thoracic rotation",
    pattern: "mobility",
    muscle: "Upper back",
    equipment: "bodyweight",
    cues: "Side lying, follow the hand with the eyes.",
  },
  {
    name: "Couch stretch",
    pattern: "mobility",
    muscle: "Hip flexors",
    equipment: "bodyweight",
    cues: "Back foot up the wall, squeeze the glute, ribs down.",
  },
  {
    name: "Hamstring stretch",
    pattern: "mobility",
    muscle: "Hamstrings",
    equipment: "bodyweight",
    cues: "Hinge at the hips with a flat back, not a rounded one.",
  },
];
