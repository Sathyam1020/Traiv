import { describe, expect, it, vi } from "vitest";
import { createSender } from "./index.js";
import type { OtpTransport, TransportName } from "./types.js";

function fake(name: TransportName, behaviour: "ok" | "throw"): OtpTransport & { calls: number } {
  const t = {
    name,
    calls: 0,
    async send() {
      t.calls++;
      if (behaviour === "throw") throw new Error(`${name} is down`);
    },
  };
  return t;
}

describe("otp delivery", () => {
  it("uses the primary and never touches the fallback when it works", async () => {
    const sms = fake("sms", "ok");
    const whatsapp = fake("whatsapp", "ok");

    const result = await createSender(sms, whatsapp)("+919876543210", "123456");

    expect(result).toEqual({ transport: "sms", fellBack: false });
    expect(sms.calls).toBe(1);
    expect(whatsapp.calls).toBe(0);
  });

  it("falls back and reports the channel that actually delivered", async () => {
    const sms = fake("sms", "throw");
    const whatsapp = fake("whatsapp", "ok");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await createSender(sms, whatsapp)("+919876543210", "123456");

    expect(result).toEqual({ transport: "whatsapp", fellBack: true });
    expect(sms.calls).toBe(1);
    expect(whatsapp.calls).toBe(1);
    spy.mockRestore();
  });

  it("throws when every channel fails", async () => {
    const sms = fake("sms", "throw");
    const whatsapp = fake("whatsapp", "throw");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(createSender(sms, whatsapp)("+919876543210", "123456")).rejects.toThrow(
      "whatsapp is down",
    );
    spy.mockRestore();
  });

  it("surfaces the primary error immediately when no fallback is configured", async () => {
    const sms = fake("sms", "throw");
    await expect(createSender(sms, null)("+919876543210", "123456")).rejects.toThrow("sms is down");
  });

  it("does not treat the same transport as its own fallback", async () => {
    const a = fake("sms", "throw");
    const b = fake("sms", "ok");

    // Misconfiguration: OTP_TRANSPORT and OTP_FALLBACK both set to sms. Retrying the
    // channel that just failed is not a fallback.
    await expect(createSender(a, b)("+919876543210", "123456")).rejects.toThrow("sms is down");
    expect(b.calls).toBe(0);
  });
});
