import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { env } from "../../env.js";
import { Agent, startApi, type TestServer } from "../../test-support/http.js";

/**
 * The parts of Google sign-in that do not need Google.
 *
 * Everything after the state check — token exchange, profile fetch, account creation —
 * needs real credentials and a real round trip to Google, and is verified by hand (see
 * `.ai/state/current.md`). Everything *before* it is pure request handling, and includes
 * the CSRF guard, which is the part an attacker actually reaches: the callback is a
 * public GET that anyone can invoke with any query string.
 *
 * These assert the guard rejects before `completeGoogleLogin` is ever called, which is
 * why they pass without credentials configured.
 */
const CALLBACK = "/auth/google/callback";
const STATE_COOKIE = "traiv_oauth_state";
const OAUTH_APP_COOKIE = "traiv_oauth_app";

let api: TestServer;

beforeAll(async () => {
  api = await startApi();
});

afterAll(async () => {
  await api.close();
});

/** The callback reports failure by where it redirects, never by status code. */
function reasonOf(location: string | null): string | null {
  if (!location) return null;
  return new URL(location, env.WEB_ORIGIN).searchParams.get("error");
}

describe("google sign-in, without google", () => {
  it("advertises itself as off when it is not configured", async () => {
    const res = await new Agent(api.url).get("/auth/config");
    expect(res.status).toBe(200);
    expect(res.body.google).toBe(Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET));
  });

  it("refuses to start a flow it cannot finish", async () => {
    const agent = new Agent(api.url);
    const res = await agent.get("/auth/google/start");

    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
      // Configured: hand the browser to Google, and plant the state it will be checked
      // against on return. The cookie and the query parameter have to agree.
      expect(res.status).toBe(302);
      expect(res.location).toContain("accounts.google.com");
      const sent = new URL(res.location ?? "").searchParams.get("state");
      expect(sent).toEqual(expect.any(String));
      expect(agent.cookie(STATE_COOKIE)).toBe(sent);
    } else {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("google_off");
    }
  });

  it("treats a cancelled consent screen as a cancellation, not an error page", async () => {
    const agent = new Agent(api.url);
    agent.setCookie(STATE_COOKIE, "whatever");
    const res = await agent.get(`${CALLBACK}?error=access_denied&state=whatever`);

    expect(res.status).toBe(302);
    expect(reasonOf(res.location)).toBe("google_cancelled");
  });

  it("rejects a callback carrying no code", async () => {
    const agent = new Agent(api.url);
    agent.setCookie(STATE_COOKIE, "whatever");
    const res = await agent.get(`${CALLBACK}?state=whatever`);

    expect(reasonOf(res.location)).toBe("google_cancelled");
  });

  it("rejects a forged callback that brings no state cookie", async () => {
    // The attack: send a victim a callback URL with the attacker's code. There is no
    // state cookie because the victim never started a flow.
    const res = await new Agent(api.url).get(`${CALLBACK}?code=stolen&state=guessed`);

    expect(reasonOf(res.location)).toBe("google_state");
  });

  it("rejects a callback whose state does not match the cookie", async () => {
    const agent = new Agent(api.url);
    agent.setCookie(STATE_COOKIE, "the-real-one");
    const res = await agent.get(`${CALLBACK}?code=stolen&state=the-attackers`);

    expect(reasonOf(res.location)).toBe("google_state");
  });

  it("burns the state cookie on use, so a callback cannot be replayed", async () => {
    const agent = new Agent(api.url);
    agent.setCookie(STATE_COOKIE, "one-shot");

    await agent.get(`${CALLBACK}?error=access_denied&state=one-shot`);
    expect(agent.cookie(STATE_COOKIE)).toBeUndefined();

    // Replaying the same URL now fails the state check rather than proceeding.
    const replay = await agent.get(`${CALLBACK}?code=stolen&state=one-shot`);
    expect(reasonOf(replay.location)).toBe("google_state");
  });

  it("never signs anyone in on a rejected callback", async () => {
    const agent = new Agent(api.url);
    const res = await agent.get(`${CALLBACK}?code=stolen&state=guessed`);

    expect(reasonOf(res.location)).toBe("google_state");
    expect(agent.sessionCookie).toBeNull();
    expect((await agent.get("/auth/me")).status).toBe(401);
  });

  /**
   * The callback is one shared route for both apps, so it has to send the browser back
   * to whichever one actually started the flow, and to *that* app's own sign-in page —
   * the client app signs in at "/", the trainer app at "/signin". They are not
   * interchangeable: redirecting the client app to "/signin" would be a 404.
   */
  describe("sends the browser back to the app that started the flow", () => {
    it("fails back to the client app's own sign-in page when the start step recorded client", async () => {
      // /start itself is gated behind credentials this test environment does not have
      // (see the file header) — what matters here is the callback honouring the cookie
      // /start would have planted, so it is planted directly.
      const agent = new Agent(api.url);
      agent.setCookie(STATE_COOKIE, "whatever");
      agent.setCookie(OAUTH_APP_COOKIE, "client");

      const res = await agent.get(`${CALLBACK}?error=access_denied&state=whatever`);
      expect(res.location).toBe(`${env.CLIENT_ORIGIN}/?error=google_cancelled`);
    });

    it("falls back to the coach app and its own /signin when no app was recorded", async () => {
      const agent = new Agent(api.url);
      agent.setCookie(STATE_COOKIE, "whatever");
      const res = await agent.get(`${CALLBACK}?error=access_denied&state=whatever`);
      expect(res.location).toBe(`${env.WEB_ORIGIN}/signin?error=google_cancelled`);
    });

    it("ignores an app value it does not recognise rather than redirecting to it", async () => {
      const agent = new Agent(api.url);
      agent.setCookie(STATE_COOKIE, "whatever");
      agent.setCookie(OAUTH_APP_COOKIE, "https://evil.example.com");
      const res = await agent.get(`${CALLBACK}?error=access_denied&state=whatever`);
      expect(res.location).toBe(`${env.WEB_ORIGIN}/signin?error=google_cancelled`);
    });
  });
});
