// "whatsapp" | "sms" | "android-sms" are kept, never built again — ADR 0034 retires
// phone auth entirely in favor of Google OAuth and email OTP (Resend).
export type TransportName = "whatsapp" | "sms" | "console" | "android-sms" | "email";

export type OtpTransport = {
  readonly name: TransportName;
  /** `target` is a phone number or an email address, depending on the transport.
   *  Resolves on delivery to the provider. Throws on anything else. */
  send(target: string, code: string): Promise<void>;
};
