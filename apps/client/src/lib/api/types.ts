export type User = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  needsProfile: boolean;
};

export type TransportName = "email" | "console";

export type AuthConfig = {
  google: boolean;
  otp: { primary: TransportName; fallback: TransportName | null; live: boolean };
  /** False in development with OTP=NO: a name and a number are enough. */
  otpRequired: boolean;
};

/** What a scanner sees before being asked to sign in — `GET /join/:code`, public. */
export type JoinPreview = { studioId: string; name: string };

/** `POST /join/:code`. Scanning twice is `already_joined`, not an error. */
export type JoinOutcome = {
  status: "joined" | "already_joined";
  clientId: string;
  studioName: string;
};

/**
 * Mirrors `client_status` in the database.
 *
 * `archived` is here even though the API does not currently let an archived client read
 * anything — see READABLE_STATUSES in the API's client-authorize middleware, and the
 * note on `StatusGate`. The screen for it exists and is correct; the endpoint has to
 * decide to send it.
 */
export type ClientStatus = "active" | "paused" | "archived" | "waiting" | "frozen";

/** `GET /c/:studioId/me` — who the client is to this studio, and whose studio it is. */
export type ClientMe = {
  clientId: string;
  status: ClientStatus;
  studio: { id: string; name: string; logoUrl: string | null; color: string | null };
};

/** `GET /c` — every studio this user is a client of. Empty is normal, not an error. */
export type Coach = {
  clientId: string;
  status: ClientStatus;
  joinedAt: string;
  studio: { id: string; name: string; logoUrl: string | null; color: string | null };
};

export type DevUser = { id: string; name: string; phone: string | null; email: string | null };

export type Goal =
  | "lose_fat"
  | "build_muscle"
  | "get_stronger"
  | "maintain"
  | "improve_fitness"
  | "general_health";

export type Sex = "male" | "female" | "undisclosed";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extra";
export type Experience = "new" | "some" | "experienced";
export type DietType = "vegetarian" | "non_vegetarian" | "eggetarian" | "vegan" | "jain";

export type WorkActivityLevel = "sedentary" | "light" | "moderate" | "heavy" | "very_heavy";

export type Intake = {
  // Not columns on this row — `firstName`/`lastName`/`avatarUrl` live on `User`, carried
  // through `IntakePatch` only so the flow has one save path. Never read back from here;
  // read the session's `user` instead.
  goal: Goal | null;
  targetWeightKg: number | null;
  sex: Sex | null;
  birthYear: number | null;
  heightCm: number | null;
  dailyActivity: ActivityLevel | null;
  experience: Experience | null;
  daysPerWeek: number | null;
  sessionMinutes: number | null;
  equipment: string[] | null;
  diet: DietType | null;
  allergies: string | null;
  dislikes: string | null;
  mealsPerDay: number | null;
  healthFlags: string[] | null;
  healthNote: string | null;
  trainingDays: string[] | null;
  preferredTime: string | null;

  workedWithCoach: boolean | null;
  typicalDay: string | null;
  workActivity: WorkActivityLevel | null;
  trainingLocations: string[] | null;
  excludedIngredients: string[] | null;
  edInduceVomiting: boolean | null;
  edFoodDominates: boolean | null;
  edRecentWeightLoss: boolean | null;
  edBodyImageMismatch: boolean | null;
  edLossOfControl: boolean | null;
  dietaryTags: string[] | null;
  additionalNutritionNotes: string | null;
  otherNotes: string | null;

  lastStep: number | null;
  completedAt: string | null;
};

export type NutritionTarget = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type IntakeState = {
  intake: Intake | null;
  weightKg: number | null;
  target: NutritionTarget | null;
  /** The coach has to look at this client's numbers before they reach them. */
  awaitingReview: boolean;
};

/** Every field optional — skipping a step is a supported answer, not a failure. */
export type IntakePatch = Partial<Omit<Intake, "lastStep" | "completedAt">> & {
  weightKg?: number;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

/* -------------------------------------------------------------------------- */
/* Check-ins and the home screen                                               */
/* -------------------------------------------------------------------------- */

/**
 * Derived on the server from today against `dueOn` and `closesOn` — never stored, except
 * `completed`. The client renders it and does not recompute it, so the card a client sees
 * and the grid their coach sees cannot disagree.
 */
export type CheckInState = "completed" | "missed" | "overdue" | "upcoming";

/** What a check-in asks for. `type` decides which step component renders it. */
export type Metric = {
  id: string;
  code: string;
  name: string;
  type: "number" | "text" | "image" | "rating";
  unit: string | null;
  unitCategory: string | null;
  position: number;
  shared: boolean;
};

export type CheckInAnswer = {
  metricId: string;
  code: string;
  name: string;
  type: Metric["type"];
  unit: string | null;
  numberValue: number | null;
  textValue: string | null;
  ratingValue: number | null;
  imageUrl: string | null;
};

export type CheckInSummary = {
  id: string;
  dueOn: string;
  closesOn: string;
  completedAt: string | null;
  state: CheckInState;
};

/** `GET /c/:studioId/check-ins` — history, newest first, with the tally off the same rows. */
export type CheckInList = {
  checkIns: CheckInSummary[];
  completed: number;
  missed: number;
  /** Null until something has settled. A new client has not failed at anything. */
  completionRate: number | null;
};

/** `GET /c/:studioId/check-ins/:id` — the questions and whatever has been answered. */
export type CheckInDetail = {
  checkIn: CheckInSummary & { clientId: string; answers: CheckInAnswer[] };
  metrics: Metric[];
};

/** One answer on the way up. Exactly one value field, as the database also enforces. */
export type AnswerInput = {
  metricId: string;
  numberValue?: number | null;
  textValue?: string | null;
  ratingValue?: number | null;
  imageUrl?: string | null;
};

/**
 * `GET /c/:studioId/today` — the whole home screen in one request.
 *
 * One request because `personas.md` is a budget Android on basement-gym signal: the cost
 * is per round trip, so six of them to paint one screen is six chances to fail slowly.
 */
export type Today = {
  name: string;
  firstName: string;
  goal: string | null;
  checkIn: (CheckInSummary & { state: CheckInState }) | null;
  weight: {
    series: { date: string; kg: number }[];
    latest: number | null;
    /** Against the previous weigh-in, not the start — "since last time". */
    delta: number | null;
    /** The first ever weigh-in and the goal from onboarding — the ends of the bar. */
    start: number | null;
    goal: number | null;
  };
  measurements: {
    code: string;
    name: string;
    unit: string | null;
    value: number;
    takenOn: string | null;
    /** The check-in that recorded it — where the row links to. */
    checkInId: string;
  }[];
  recentSessions: { id: string; date: string; completedAt: string | null }[];
  /**
   * Which tabs this client should see at all.
   *
   * Trainerize hides a tab until the coach has put something in it, and
   * `competitor-client-apps.md` calls that "the one idea worth stealing outright". The
   * server decides, because the server is what knows.
   */
  reveal: { workouts: boolean; food: boolean; chat: boolean };
};

/** A signed, single-use ticket for one photo. The browser PUTs straight to Cloudinary. */
export type UploadTicket = {
  url: string;
  publicId: string;
  fields: Record<string, string>;
};

/* -------------------------------------------------------------------------- */
/* Workouts — ADR 0024                                                         */
/* -------------------------------------------------------------------------- */

/** One row on `/workouts` — a published programme that's this client's own copy. */
export type WorkoutListItem = {
  sessionItems: { id: string; name: string; exercises: number; muscleGroups: string[] }[];
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  source: "coach" | "client";
  updatedAt: string;
  sessions: number;
  sessionNames: string[];
  exercises: number;
  muscleGroups: string[];
};

export type ProgramDetail = {
  template: { id: string; name: string; description: string | null };
  sessions: {
    id: string;
    name: string;
    exercises: number;
    lastCompletedAt: string | null;
  }[];
};

export type FieldName = "weight" | "rep_range" | "reps" | "rest" | "duration" | "distance";

/** A prescribed set — the plan, not what was actually done. */
export type PrescribedSet = {
  id: string;
  sessionExerciseId: string;
  position: number;
  reps: number | null;
  repsMax: number | null;
  weightKg: number | null;
  seconds: number | null;
  distanceM: number | null;
  calories: number | null;
  restSeconds: number | null;
};

/** One set as actually performed, keyed on (session, exercise, set number). */
export type SetLog = {
  sessionExerciseId: string | null;
  setNumber: number;
  reps: number | null;
  loadKg: number | null;
  completed: boolean;
};

export type SessionExerciseDetail = {
  id: string;
  position: number;
  fields: FieldName[];
  supersetGroup: number | null;
  note: string | null;
  exerciseId: string;
  name: string;
  muscle: string;
  equipment: string;
  imageUrl: string | null;
  videoUrl: string | null;
  sets: PrescribedSet[];
  /** What this client logged last time they did this exercise, any session. */
  lastTime: { setNumber: number; reps: number | null; loadKg: number | null }[];
};

export type SessionDetail = {
  session: { id: string; name: string };
  /** The training session already in progress for this workout session, if any. */
  live: { id: string; startedAt: string; sets: SetLog[] } | null;
  exercises: SessionExerciseDetail[];
};

export type TrainingSession = {
  id: string;
  clientId: string;
  workoutSessionId: string | null;
  date: string;
  startedAt: string;
  completedAt: string | null;
  quality: number | null;
  intensity: number | null;
  note: string | null;
  totalWeightLiftedKg: number | null;
  totalReps: number | null;
  totalSets: number | null;
  totalCompletedSets: number | null;
  totalDistanceM: number | null;
  totalSeconds: number | null;
  totalCalories: number | null;
};

export type ExerciseDetail = {
  exercise: {
    id: string;
    name: string;
    muscle: string;
    equipment: string;
    imageUrl: string | null;
    videoUrl: string | null;
    customized?: boolean;
    mediaRevision?: string;
    demonstrationUnavailable?: boolean;
    videoAspectRatio?: string | null;
    description?: string | null;
  };
  history: {
    date: string;
    note: string | null;
    sets: { setNumber: number; reps: number | null; loadKg: number | null }[];
  }[];
  stats: {
    maxWeightKg: number | null;
    maxReps: number | null;
    totalVolumeKg: number | null;
    series: { date: string; volumeKg: number }[];
  };
};
