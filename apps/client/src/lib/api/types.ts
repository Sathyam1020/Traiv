export type User = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  needsPhone: boolean;
  needsProfile: boolean;
};

export type TransportName = "whatsapp" | "sms" | "console";

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

export type Intake = {
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
