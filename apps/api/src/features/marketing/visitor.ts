import { createHash, randomBytes } from "node:crypto";
import { schema } from "@traiv/db";
import { eq, lt } from "drizzle-orm";
import type { Request } from "express";
import { db } from "../../db.js";

/**
 * Who a visitor is, for exactly one day, without storing anything about them.
 *
 * The hash is `sha256(salt-of-the-day + ip + user-agent)`. The IP is never written down
 * and the salt is deleted the next day, which is what makes the hash irreversible rather
 * than merely inconvenient — a kept salt plus a kept hash is a kept IP with extra steps.
 *
 * It costs us "returning visitors": the same person is a different id tomorrow. That is a
 * real loss and it buys something worth more — no identifier on anybody's device, so
 * nothing here needs a consent banner, and a visitor is not followed across weeks by a
 * marketing site they have not even signed up to.
 *
 * This is the Plausible/Fathom design. It is not novel and that is the point.
 */

/** In-process cache. The row is the source of truth; this just avoids a query per event. */
let cached: { day: string; salt: string } | undefined;

function today(): string {
  // UTC, so every process agrees on when the day turns over regardless of server zone.
  return new Date().toISOString().slice(0, 10);
}

async function saltForToday(): Promise<string> {
  const day = today();
  if (cached?.day === day) return cached.salt;

  // Whoever gets here first mints it; everyone else reads what they wrote. `do nothing`
  // rather than `do update`, because two processes racing must not produce two salts —
  // that would split one person into two visitors for the rest of the day.
  const fresh = randomBytes(32).toString("hex");
  await db.insert(schema.analyticsSalts).values({ day, salt: fresh }).onConflictDoNothing();

  const [row] = await db
    .select({ salt: schema.analyticsSalts.salt })
    .from(schema.analyticsSalts)
    .where(eq(schema.analyticsSalts.day, day))
    .limit(1);

  const salt = row?.salt ?? fresh;
  cached = { day, salt };

  // Yesterday's salt has done its job. Deleting it is what makes yesterday's hashes
  // permanently unreadable, so this is a privacy control, not housekeeping.
  await db.delete(schema.analyticsSalts).where(lt(schema.analyticsSalts.day, day));

  return salt;
}

export async function visitorId(req: Request): Promise<string> {
  const salt = await saltForToday();
  // `trust proxy` is set on the app, so this is the client address behind the proxy.
  const ip = req.ip ?? "unknown";
  const ua = req.headers["user-agent"] ?? "unknown";
  return createHash("sha256").update(`${salt}:${ip}:${ua}`).digest("hex").slice(0, 32);
}

/**
 * Enough user-agent parsing to answer "phone or laptop, and which browser".
 *
 * Deliberately not a library. The UA-parsing packages carry thousands of regexes to tell
 * a Nokia from a Kindle, and every one of them is a dependency that updates monthly. What
 * a marketing dashboard actually acts on is mobile-versus-desktop and whether Safari is
 * breaking something — both of which are four lines.
 */
export function parseAgent(ua: string | undefined): {
  device: string;
  browser: string;
  os: string;
  bot: boolean;
} {
  const s = ua ?? "";
  const bot = /bot|crawler|spider|crawling|preview|headless|lighthouse|pingdom|curl|wget/i.test(s);

  const tablet = /ipad|tablet|playbook|silk/i.test(s) || (/android/i.test(s) && !/mobile/i.test(s));
  const mobile = /mobi|iphone|ipod|android.*mobile|windows phone/i.test(s);
  const device = tablet ? "tablet" : mobile ? "mobile" : "desktop";

  // Order matters: Edge and Chrome both claim Safari, Chrome claims Safari too.
  const browser = /edg\//i.test(s)
    ? "Edge"
    : /opr\/|opera/i.test(s)
      ? "Opera"
      : /chrome|crios/i.test(s)
        ? "Chrome"
        : /firefox|fxios/i.test(s)
          ? "Firefox"
          : /safari/i.test(s)
            ? "Safari"
            : "Other";

  const os = /windows/i.test(s)
    ? "Windows"
    : /iphone|ipad|ipod|ios/i.test(s)
      ? "iOS"
      : /mac os x/i.test(s)
        ? "macOS"
        : /android/i.test(s)
          ? "Android"
          : /linux/i.test(s)
            ? "Linux"
            : "Other";

  return { device, browser, os, bot };
}

/** Hostname only. A full referrer URL is where somebody else's query string ends up. */
export function referrerHost(raw: string | undefined, ownHost: string | undefined): string | null {
  if (!raw) return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    // Our own pages are not a traffic source; counting them buries the real ones.
    return ownHost && host === ownHost.replace(/^www\./, "") ? null : host;
  } catch {
    return null;
  }
}
