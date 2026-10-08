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

export type ClientStatus = "active" | "paused" | "waiting" | "frozen";

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
