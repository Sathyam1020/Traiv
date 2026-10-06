import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { env } from "./env.js";
import { startApi, type TestServer } from "./test-support/http.js";

/**
 * CORS, over real HTTP.
 *
 * Two apps share one API, so the allowlist is now a list rather than a single origin —
 * and a list is the shape that quietly grows a hole. Credentials are involved, which
 * means the response has to echo one exact origin: a `*` would be rejected by the
 * browser, and echoing *any* origin that asks would hand every site on the internet an
 * authenticated channel to this API.
 */
let api: TestServer;

beforeAll(async () => {
  api = await startApi();
});

afterAll(async () => {
  await api.close();
});

async function preflight(origin: string) {
  const res = await fetch(`${api.url}/studio/join-code`, {
    method: "OPTIONS",
    headers: { Origin: origin, "Access-Control-Request-Method": "GET" },
  });
  return {
    status: res.status,
    allowOrigin: res.headers.get("access-control-allow-origin"),
    allowCredentials: res.headers.get("access-control-allow-credentials"),
    vary: res.headers.get("vary"),
  };
}

describe("cors", () => {
  it("allows the coach app, with credentials", async () => {
    const res = await preflight(env.WEB_ORIGIN);
    expect(res.allowOrigin).toBe(env.WEB_ORIGIN);
    expect(res.allowCredentials).toBe("true");
  });

  it("allows the client app, with credentials", async () => {
    const res = await preflight(env.CLIENT_ORIGIN);
    expect(res.allowOrigin).toBe(env.CLIENT_ORIGIN);
    expect(res.allowCredentials).toBe("true");
  });

  it("allows the endorser app", async () => {
    const res = await preflight(env.ENDORSE_ORIGIN);
    expect(res.allowOrigin).toBe(env.ENDORSE_ORIGIN);
  });

  it("allows the admin app", async () => {
    const res = await preflight(env.ADMIN_ORIGIN);
    expect(res.allowOrigin).toBe(env.ADMIN_ORIGIN);
  });

  it("the apps are different origins", () => {
    // If these ever collapse to one value the tests above both pass while proving nothing.
    const all = [env.WEB_ORIGIN, env.CLIENT_ORIGIN, env.ENDORSE_ORIGIN, env.ADMIN_ORIGIN];
    expect(new Set(all).size).toBe(all.length);
  });

  it("refuses an origin that is not on the list", async () => {
    const res = await preflight("https://evil.example.com");
    expect(res.allowOrigin).toBeNull();
    expect(res.allowCredentials).toBeNull();
  });

  it("does not echo an origin merely because it contains an allowed one", async () => {
    // The classic allowlist hole: a substring or prefix check instead of equality.
    for (const origin of [
      `${env.CLIENT_ORIGIN}.evil.com`,
      `https://evil.com?${env.CLIENT_ORIGIN}`,
      `${env.CLIENT_ORIGIN}@evil.com`,
    ]) {
      const res = await preflight(origin);
      expect(res.allowOrigin, `${origin} must not be allowed`).toBeNull();
    }
  });

  it("varies on origin, so a proxy cannot serve one app's headers to the other", async () => {
    const res = await preflight(env.CLIENT_ORIGIN);
    expect(res.vary).toBe("Origin");
  });
});
