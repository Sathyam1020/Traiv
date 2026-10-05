import { createServer, type Server } from "node:http";
import { createApp } from "../app.js";
import { requestChallenge } from "../features/auth/service.js";

/**
 * A real server on an ephemeral port, driven with real HTTP.
 *
 * Authorization lives in middleware, so asserting it by calling the middleware directly
 * would prove only that the function works — not that the route actually mounts it, nor
 * that the error reaches the client as the right status. Both of those are where the
 * mistakes are, so the tests have to come in over the wire.
 */
export type TestServer = {
  url: string;
  close(): Promise<void>;
};

export async function startApi(): Promise<TestServer> {
  const server = createServer(createApp());
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("could not bind a test port");
  return {
    url: `http://127.0.0.1:${addr.port}`,
    close: () => closeServer(server),
  };
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
}

export type Reply = {
  status: number;
  body: Record<string, unknown>;
};

/**
 * One browser. Holds its own cookie, so a revoked or stale session behaves here exactly
 * as it would in the app rather than being re-derived per request.
 */
export class Agent {
  private cookie: string | null = null;

  constructor(private readonly base: string) {}

  get sessionCookie(): string | null {
    return this.cookie;
  }

  /** Drop the cookie without touching the server — an anonymous caller. */
  forget() {
    this.cookie = null;
  }

  async request(method: string, path: string, body?: unknown): Promise<Reply> {
    const res = await fetch(`${this.base}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { "content-type": "application/json" }),
        ...(this.cookie ? { cookie: this.cookie } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      redirect: "manual",
    });

    for (const raw of res.headers.getSetCookie()) {
      const [pair] = raw.split(";");
      if (pair?.startsWith("traiv_session=")) {
        const value = pair.slice("traiv_session=".length);
        this.cookie = value ? pair : null;
      }
    }

    const text = await res.text();
    let parsed: Record<string, unknown> = {};
    if (text) {
      try {
        parsed = JSON.parse(text) as Record<string, unknown>;
      } catch {
        parsed = { raw: text };
      }
    }
    return { status: res.status, body: parsed };
  }

  get(path: string) {
    return this.request("GET", path);
  }
  post(path: string, body?: unknown) {
    return this.request("POST", path, body);
  }
  patch(path: string, body?: unknown) {
    return this.request("PATCH", path, body);
  }
}

/**
 * Sign up the way a real client does, with one deliberate exception: the OTP is read
 * from the service rather than the response.
 *
 * `POST /auth/challenge` returns only `{ sent, transport }` — it never puts the code on
 * the wire, not even under the console transport. That is correct, and these tests are
 * about authorization rather than delivery, so the code is taken out of band and
 * everything that matters — verify, the cookie, every authorized call — still goes over
 * real HTTP.
 *
 * One challenge only: a second would supersede the first and drop the pending name.
 */
export async function signUpOverHttp(base: string, phone: string, name: string) {
  const agent = new Agent(base);

  const challenge = await requestChallenge({ phone, name });
  if (!challenge.code) {
    throw new Error(
      `console transport expected in tests, got "${challenge.transport}" — set OTP_TRANSPORT=console`,
    );
  }

  const verified = await agent.post("/auth/verify", { phone, code: challenge.code });
  if (verified.status !== 200) {
    throw new Error(`signup failed: ${verified.status} ${JSON.stringify(verified.body)}`);
  }
  const user = verified.body.user as { id: string } | undefined;
  if (!user?.id) throw new Error("signup returned no user");
  if (!agent.sessionCookie) throw new Error("signup set no session cookie");

  return { agent, userId: user.id };
}
