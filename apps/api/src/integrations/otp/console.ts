import type { OtpTransport } from "./types.js";

/**
 * Development transport. Prints the code to stdout so the whole flow is usable before
 * DLT and Meta verification clear — both of which are compliance processes, not config.
 */
export const consoleTransport: OtpTransport = {
  name: "console",
  async send(phone, code) {
    console.warn(
      `\n  ┌─ OTP (console) ─────────────────\n  │  to:   ${phone}\n  │  code: ${code}\n  └─────────────────────────────────\n`,
    );
  },
};
