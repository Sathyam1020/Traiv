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
