export type TransportName = "whatsapp" | "sms" | "console" | "android-sms";

export type OtpTransport = {
  readonly name: TransportName;
  /** Resolves on delivery to the provider. Throws on anything else. */
  send(phone: string, code: string): Promise<void>;
};
