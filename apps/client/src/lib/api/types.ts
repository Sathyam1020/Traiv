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
