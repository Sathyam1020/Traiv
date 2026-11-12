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
  /** False in development with OTP=NO: a name and an email are enough. */
  otpRequired: boolean;
};

export type DevUser = { id: string; name: string; phone: string | null; email: string | null };
