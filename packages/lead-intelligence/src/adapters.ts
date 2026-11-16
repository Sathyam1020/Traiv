import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";
import { config } from "./config.ts";
import { hash, url } from "./domain.ts";
import type { Store } from "./store.ts";
export type Query = { kind: "gym" | "coach"; locality: string; query: string };
export async function queries(): Promise<Query[]> {
  const c = config;
  const result: Query[] = [];
  for (const kind of ["gym", "coach"] as const)
    for (const locality of c.localities)
      for (const city of c.cities)
        for (const term of kind === "gym" ? c.gymTerms : c.coachTerms)
          result.push({ kind, locality, query: `${term} ${locality} ${city} official contact` });
  return result;
}
export async function publicUrl(input: string) {
  const u = new URL(url(input));
  if (u.port && u.port !== "443" && u.port !== "80") throw Error("Nonstandard port blocked");
  const entries = await lookup(u.hostname, { all: true, family: 4 });
  if (!entries.length) throw Error("No address");
  for (const { address } of entries) {
    if (isIP(address) === 6) {
      if (!/^[23]/.test(address) || /^200[12]:/i.test(address))
        throw Error("Nonpublic address blocked");
    } else {
      const n = address.split(".").map(Number);
      if (
        n[0] === 0 ||
        n[0] === 10 ||
        n[0] === 127 ||
        (n[0] ?? 0) >= 224 ||
        (n[0] === 169 && n[1] === 254) ||
        (n[0] === 172 && (n[1] ?? 0) >= 16 && (n[1] ?? 0) <= 31) ||
        (n[0] === 192 && n[1] === 168) ||
        (n[0] === 100 && (n[1] ?? 0) >= 64 && (n[1] ?? 0) <= 127)
      )
        throw Error("Nonpublic address blocked");
    }
  }
  const address = entries[0]?.address;
  if (!address) throw Error("No public IPv4 address");
  return { url: u, address };
}
// Redirects are checked independently; verification fetches no page bodies into storage.
export async function verifyUrl(input: string): Promise<string> {
  try {
    let current = input;
    for (let i = 0; i < 5; i++) {
      const checked = await publicUrl(current);
      const u = checked.url;
      const r = await new Promise<{ status: number; location?: string }>((resolve, reject) => {
        const request = u.protocol === "https:" ? httpsRequest : httpRequest;
        const req = request(
          u,
          {
            method: "HEAD",
            family: 4,
            lookup: (_hostname, _options, cb) => cb(null, checked.address, 4),
            headers: { "User-Agent": "TraivLeadResearch/1.0" },
          },
          (response) => {
            response.resume();
            resolve({ status: response.statusCode ?? 0, location: response.headers.location });
          },
        );
        req.setTimeout(15000, () => req.destroy(new Error("URL check timeout")));
        req.on("error", reject);
        req.end();
      });
      if (r.status >= 300 && r.status < 400) {
        const next = r.location;
        if (!next) return "redirect-missing-location";
        current = new URL(next, u).href;
        continue;
      }
      return r.status >= 200 && r.status < 300 ? "resolves" : `http-${r.status}`;
    }
    return "redirect-limit";
  } catch (e) {
    return `unverified:${e instanceof Error ? e.message : "network-error"}`;
  }
}
export async function requestJson(
  input: string,
  init: RequestInit = {},
  attempts = 3,
): Promise<unknown> {
  for (let i = 0; i < attempts; i++) {
    let r: Response;
    try {
      r = await fetch(input, { ...init, signal: AbortSignal.timeout(30000) });
    } catch (e) {
      if (i === attempts - 1) throw e;
      await sleep(1000 * 2 ** i);
      continue;
    }
    if (r.ok) return r.json();
    if ((r.status === 429 || r.status >= 500) && i < attempts - 1) {
      const retry = Number(r.headers.get("retry-after"));
      await sleep(
        Math.min(30000, Number.isFinite(retry) && retry > 0 ? retry * 1000 : 1000 * 2 ** i),
      );
      continue;
    }
    throw Error(`Provider HTTP ${r.status}`);
  }
  throw Error("Retry budget exhausted");
}
export interface SearchAdapter {
  name: string;
  search(query: string): Promise<Array<{ url: string; title: string; description: string }>>;
}
export class BraveAdapter implements SearchAdapter {
  name = "brave";
  async search(query: string) {
    const key = process.env.BRAVE_API_KEY;
    if (!key || process.env.BRAVE_STORAGE_ALLOWED !== "true")
      throw Error("Brave requires BRAVE_API_KEY and storage-permitted plan opt-in");
    const endpoint = new URL("https://api.search.brave.com/res/v1/web/search");
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("count", "20");
    const raw = await requestJson(endpoint.href, {
      headers: { "X-Subscription-Token": key, Accept: "application/json" },
    });
    if (!raw || typeof raw !== "object") throw Error("Invalid search response");
    const web = (raw as { web?: { results?: unknown[] } }).web;
    return (web?.results ?? []).map((v) => {
      if (!v || typeof v !== "object") throw Error("Invalid result");
      const r = v as Record<string, unknown>;
      if (
        typeof r.url !== "string" ||
        typeof r.title !== "string" ||
        typeof r.description !== "string"
      )
        throw Error("Invalid result fields");
      return { url: url(r.url), title: r.title, description: r.description };
    });
  }
}
export async function collect(store: Store, adapter: SearchAdapter, limit = 20, concurrency = 2) {
  let claimed = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, Math.max(1, concurrency)) }, async () => {
      while (claimed < limit) {
        claimed++;
        const job = store.claim(adapter.name);
        if (!job) return;
        try {
          await sleep(1200);
          const records = await adapter.search(String(job.query));
          for (const r of records)
            store.db.prepare("INSERT OR IGNORE INTO candidate VALUES(?,?)").run(
              hash(r.url),
              JSON.stringify({
                ...r,
                query: job.query,
                source: adapter.name,
                collectedAt: new Date().toISOString(),
                status: "Needs factual review; not an accepted lead",
              }),
            );
          store.audit(
            adapter.name,
            String(job.query),
            records.length,
            0,
            0,
            "",
            "Search discovery only; review before acceptance",
          );
          store.db
            .prepare("UPDATE job SET status='done',lease_until=0 WHERE id=?")
            .run(String(job.id));
        } catch (e) {
          const error = e instanceof Error ? e.message : "Unknown error";
          store.db
            .prepare("UPDATE job SET status='failed',error=?,lease_until=0 WHERE id=?")
            .run(error, String(job.id));
          store.audit(adapter.name, String(job.query), 0, 0, 0, error);
          console.error(JSON.stringify({ event: "search-failed", job: job.id, error }));
        }
      }
    }),
  );
}
export async function verify(store: Store, concurrency = 3) {
  const urls = [
    ...new Set(
      store.leads().flatMap((l) => [
        l.source,
        ...Object.values(l.facts)
          .filter((e) => typeof e.value === "string" && /^https?:/.test(e.value))
          .map((e) => String(e.value)),
      ]),
    ),
  ];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (cursor < urls.length) {
        const u = urls[cursor++];
        if (!u) break;
        const status = await verifyUrl(u);
        store.db
          .prepare(
            "INSERT INTO url_check VALUES(?,?,?) ON CONFLICT(url) DO UPDATE SET status=excluded.status,checked_at=excluded.checked_at",
          )
          .run(u, status, new Date().toISOString());
        await sleep(300);
      }
    }),
  );
}
