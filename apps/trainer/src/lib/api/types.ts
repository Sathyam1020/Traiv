export type User = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  needsPhone: boolean;
  needsProfile: boolean;
};

export type Studio = {
  id: string;
  slug: string;
  name: string;
  tier: "free" | "starter" | "pro" | "studio";
  role: "owner" | "coach";
};

export type Session = {
  user: User;
  studios: Studio[];
  activeStudioId: string;
};

export type TransportName = "whatsapp" | "sms" | "console";

export type AuthConfig = {
  google: boolean;
  otp: { primary: TransportName; fallback: TransportName | null; live: boolean };
  /** False in development with OTP=NO: a name and a number are enough. */
  otpRequired: boolean;
};

export type DevUser = { id: string; name: string; phone: string | null; email: string | null };

/* -------------------------------------------------------------------------- */
/* The roster                                                                  */
/* -------------------------------------------------------------------------- */

/** The three a coach's tabs show. `waiting` and `frozen` are not states a coach set. */
export type RosterStatus = "active" | "paused" | "archived";

export type RosterFilter = "all" | "unread" | "new-checkin" | "missing-checkin" | "ending-soon";

export type Tag = {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  uses?: number;
};

export type RosterClient = {
  id: string;
  name: string;
  status: RosterStatus;
  startedAt: string;
  endsAt: string | null;
  lastSessionAt: string | null;
  tags: Tag[];
};

export type Roster = {
  clients: RosterClient[];
  total: number;
  page: number;
  perPage: number;
  statuses: Record<RosterStatus, number>;
  filters: Record<RosterFilter, number>;
};

/**
 * One client, for their own screen.
 *
 * `hasAccount` is the field the header actually branches on. Everything below it that
 * describes a body rather than a relationship — age, sex, height, weight — is keyed on
 * the user, and a client the coach typed in has no user. Four nulls cannot tell the
 * screen apart from four unanswered questions; this can.
 */
export type ClientProfile = {
  id: string;
  name: string;
  status: RosterStatus;
  goal: string | null;
  constraints: string | null;
  startedAt: string;
  endsAt: string | null;
  activatedAt: string | null;
  hasAccount: boolean;
  coachName: string | null;
  tags: Tag[];
  intake: {
    sex: "male" | "female" | "undisclosed" | null;
    birthYear: number | null;
    heightCm: number | null;
    goal: string | null;
    targetWeightKg: number | null;
    completedAt: string | null;
  } | null;
  weightKg: number | null;
  weightTakenAt: string | null;
  lastSessionAt: string | null;
  lastSeenAt: string | null;
};

/** The client's overview screen, served as one aggregate. */
export type ClientOverview = {
  id: string;
  hasAccount: boolean;
  startedAt: string;
  endsAt: string | null;
  activatedAt: string | null;
  coachingGoal: string | null;
  constraints: string | null;
  weight: {
    currentKg: number;
    takenAt: string;
    /** Against the previous weigh-in. 0 when there is only one. */
    changeKg: number;
    comparedTo: string | null;
    weighIns: number;
    targetKg: number | null;
  } | null;
  energy: EnergyCard;
  nutrition: {
    diet: string | null;
    allergies: string | null;
    dislikes: string | null;
    healthFlags: string[];
    intakeCompletedAt: string | null;
  } | null;
  activity: { kind: "activated" | "created"; at: string; title: string }[];
  training: {
    windowDays: number;
    sessions: number;
    lastSessionAt: string | null;
    days: string[];
  };
};

export type EnergyBasis = {
  formula: string;
  bmr: number;
  tdee: number;
  activityFactor: number;
  goalAdjustmentPct: number;
  unboundedKcal: number;
  boundBy: string;
  proteinGPerKg: number;
  bmi: number;
};

export type EnergyCard =
  | {
      /** `prescribed` is what the client was actually given; `computed` is today's suggestion. */
      source: "prescribed" | "computed";
      kcal: number;
      proteinG: number;
      carbsG: number;
      fatG: number;
      basis: EnergyBasis | null;
      review: string[];
      effectiveFrom: string | null;
      missing: string[];
    }
  | { source: "none"; missing: string[] };

export type CheckInState = "completed" | "missed" | "overdue" | "upcoming";

export type CheckInCell = {
  id: string;
  /** `YYYY-MM-DD`. A check-in is due on a day, not at an instant. */
  date: string;
  closesOn: string;
  state: CheckInState;
  completedAt: string | null;
};

export type CheckInTrend = {
  cells: number;
  checkIns: CheckInCell[];
  /** Null before anything has settled — different from nought, and shown differently. */
  completionRate: number | null;
  currentStreak: number;
  completed: number;
  missed: number;
};

export type RosterParams = {
  status: RosterStatus;
  filter: RosterFilter;
  search?: string;
  sort: "duration" | "name" | "recent";
  page: number;
  perPage: number;
};

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Workouts — ADR 0024: Template → Session → Exercise → Set                    */
/* -------------------------------------------------------------------------- */

/**
 * "The fields a set starts with when you add this exercise to a workout, in this
 * order" — a set is weight **and** reps **and** rest at once, shown as the columns
 * a coach picks, not a single type chosen from an enum.
 */
export const FIELD_NAMES = [
  "weight",
  "reps",
  "rep_range",
  "rest",
  "duration",
  "distance",
  "calories",
] as const;

export type FieldName = (typeof FIELD_NAMES)[number];

export const FIELD_LABELS: Record<FieldName, string> = {
  weight: "Weight",
  reps: "Reps",
  rep_range: "Rep range",
  rest: "Rest",
  duration: "Duration",
  distance: "Distance",
  calories: "Calories",
};

export type Exercise = {
  id: string;
  name: string;
  pattern: string;
  muscle: string;
  secondaryMuscles: string[] | null;
  equipment: string;
  imageUrl: string | null;
  videoUrl: string | null;
  description?: string | null;
  stimulus: string | null;
  level: string | null;
  category: string | null;
  location?: string | null;
  injuryRisk?: string | null;
  defaultFields: FieldName[];
  shared: boolean;
};

export type ExerciseWrite = {
  name: string;
  description?: string | null;
  muscle: string;
  secondaryMuscles?: string[];
  equipment: string;
  pattern: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  stimulus?: string | null;
  level?: string | null;
  category?: string | null;
  location?: string | null;
  injuryRisk?: string | null;
  defaultFields?: FieldName[];
};

export type PrescribedSet = {
  id?: string;
  reps?: number | null;
  repsMax?: number | null;
  weightKg?: number | null;
  seconds?: number | null;
  distanceM?: number | null;
  calories?: number | null;
  restSeconds?: number | null;
};

export type SessionExercise = {
  id?: string;
  exerciseId: string;
  fields?: FieldName[];
  supersetGroup?: number | null;
  note?: string | null;
  sets: PrescribedSet[];
  /** Present on reads — joined from the library. */
  name?: string;
  muscle?: string;
  equipment?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
};

export type WorkoutSession = {
  id?: string;
  name: string;
  exercises: SessionExercise[];
};

export type WorkoutDefaultValues = {
  sets?: number;
  reps?: number;
  rest?: number;
  weightKg?: number;
  durationSeconds?: number;
  distanceM?: number;
};

export type WorkoutTemplate = {
  id: string;
  studioId: string;
  clientId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  status: "draft" | "active";
  source: "coach" | "client";
  defaultValues: WorkoutDefaultValues | null;
  createdAt: string;
  updatedAt: string;
  sessions: WorkoutSession[];
};

/** The Templates list row — Name · Sessions · Created · Status. */
export type TemplateSummary = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  status: "draft" | "active";
  createdAt: string;
  sessions: number;
};

/** A client's own Workouts tab row — Name · Sessions · Muscle groups · Assigned · Status · Source. */
export type ClientProgramSummary = {
  id: string;
  name: string;
  status: "draft" | "active";
  source: "coach" | "client";
  createdAt: string;
  sessions: number;
  muscleGroups: string[];
};

export type TemplateInput = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  defaultValues?: WorkoutDefaultValues | null;
  sessions: WorkoutSession[];
};

export type SavedSection = { id: string; name: string; payload: WorkoutSession };

/* -------------------------------------------------------------------------- */
/* Uploads                                                                     */
/* -------------------------------------------------------------------------- */

export type UploadTicket = {
  url: string;
  publicId: string;
  fields: Record<string, string>;
};

export type StudioUploadKind =
  | "recipe-image"
  | "recipe-video"
  | "ingredient-image"
  | "mealplan-cover";
