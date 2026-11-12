import { COUNTRIES, DEFAULT_COUNTRY, parsePhone, phoneProblemMessage } from "@traiv/phone";
import { describe, expect, it } from "vitest";
import { toE164 } from "./service.js";

/**
 * The phone rule, which the API and all four apps share.
 *
 * It was `/^[6-9]\d{9}$/` copied into nine places. These assert the two things that
 * matters about replacing it: every written form of one number collapses to the same
 * stored value, and nothing India-specific leaks into what another country is told.
 */
describe("phone numbers", () => {
  it("collapses every written form to one stored value", () => {
    const canonical = "+919876543210";
    for (const form of [
      "9876543210",
      "+919876543210",
      "919876543210",
      "09876543210",
      "98765 43210",
      "+91 98765-43210",
      "(98765) 43210",
    ]) {
      expect(toE164(form), form).toBe(canonical);
    }
  });

  it("is idempotent, so a stored number survives another pass", () => {
    expect(toE164(toE164("9876543210"))).toBe(toE164("9876543210"));
  });

  it("refuses what it cannot store", () => {
    for (const bad of ["1234567890", "", "12345", "abcdefghij", "0000000000"]) {
      expect(() => toE164(bad), bad).toThrow();
    }
  });

  it("knows other countries", () => {
    expect(parsePhone("2133734253", "US")).toMatchObject({ ok: true, e164: "+12133734253" });
    expect(parsePhone("7400123456", "GB")).toMatchObject({ ok: true, e164: "+447400123456" });
    expect(parsePhone("501234567", "AE")).toMatchObject({ ok: true, e164: "+971501234567" });
  });

  it("keeps the country a number carries, whatever the field is set to", () => {
    // Somebody pastes a full international number into a field defaulted elsewhere.
    expect(parsePhone("+919876543210", "US")).toMatchObject({ ok: true, country: "IN" });
  });

  it("refuses a landline, which could never receive the code", () => {
    // A real Indian fixed line. Accepting it creates an account nobody can sign into.
    const r = parsePhone("+911123456789", "IN");
    expect(r.ok).toBe(false);
  });

  it("never names one country's rules to another country's user", () => {
    // The old message said "Indian mobile numbers start with 6, 7, 8 or 9" — useless to
    // anyone who is not Indian, and there are ~200 other rule sets.
    for (const code of ["US", "GB", "DE", "BR"] as const) {
      const msg = phoneProblemMessage("invalid", code);
      expect(msg).not.toMatch(/Indian/i);
      expect(msg).toContain(COUNTRIES.find((c) => c.code === code)?.name as string);
    }
  });

  it("offers a real example for every country it lists", () => {
    expect(COUNTRIES.length).toBeGreaterThan(200);
    const withoutExample = COUNTRIES.filter((c) => !c.examplePlain);
    expect(withoutExample).toHaveLength(0);
  });

  it("puts the market we serve first", () => {
    expect(COUNTRIES[0]?.code).toBe(DEFAULT_COUNTRY);
    expect(COUNTRIES[0]?.dial).toBe("91");
  });
});
