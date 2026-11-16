import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { config } from "./config.ts";
import { hash, type Lead, match, parseObservation, qualify, statuses } from "./domain.ts";
export class Store {
  db: DatabaseSync;
  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS lead(id TEXT PRIMARY KEY, payload TEXT NOT NULL, created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS observation(id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES lead(id), payload TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sales(lead_id TEXT PRIMARY KEY REFERENCES lead(id), status TEXT NOT NULL DEFAULT 'New', assigned_to TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '', last_contacted TEXT NOT NULL DEFAULT '', next_follow_up TEXT NOT NULL DEFAULT '', revision INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS outreach(id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES lead(id), payload TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS review(id TEXT PRIMARY KEY, lead_id TEXT, other_id TEXT, reason TEXT, status TEXT DEFAULT 'open');
 CREATE TABLE IF NOT EXISTS job(id TEXT PRIMARY KEY, adapter TEXT NOT NULL, query TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, lease_until INTEGER NOT NULL DEFAULT 0, error TEXT, UNIQUE(adapter,query));
 CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY, source TEXT, query TEXT, collected_at TEXT, found INTEGER, accepted INTEGER, duplicates INTEGER, error TEXT, restrictions TEXT);
 CREATE TABLE IF NOT EXISTS candidate(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS url_check(url TEXT PRIMARY KEY, status TEXT NOT NULL, checked_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT NOT NULL);`);
  }
  close() {
    this.db.close();
  }
  leads(): Lead[] {
    return this.db
      .prepare("SELECT payload FROM lead ORDER BY id")
      .all()
      .map((r) => JSON.parse(String(r.payload)) as Lead);
  }
  import(raw: unknown) {
    const o = parseObservation(raw);
    const oid = hash(JSON.stringify(o));
    if (this.db.prepare("SELECT id FROM observation WHERE id=?").get(oid))
      return { duplicate: true, id: null };
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const all = this.leads();
      const existing = all.find((x) => match(x, o) === "same");
      const id = existing?.id ?? `trv_${hash(`${o.kind}|${o.name}|${o.branch}|${o.source}`)}`;
      if (!existing) {
        this.db
          .prepare("INSERT INTO lead VALUES(?,?,?)")
          .run(id, JSON.stringify(qualify(o, id, config.weights)), o.collectedAt);
        this.db.prepare("INSERT INTO sales(lead_id) VALUES(?)").run(id);
      } else {
        const merged = { ...existing, facts: { ...existing.facts } };
        for (const [k, e] of Object.entries(o.facts)) {
          const prior = merged.facts[k];
          if (prior && prior.value !== e.value)
            this.review(id, null, `Conflicting ${k}: ${prior.source} vs ${e.source}`);
          if (!prior || Date.parse(e.observedAt) > Date.parse(prior.observedAt))
            merged.facts[k] = e;
        }
        if (Date.parse(o.collectedAt) > Date.parse(merged.collectedAt)) {
          merged.collectedAt = o.collectedAt;
          merged.verification = o.verification;
        }
        this.db
          .prepare("UPDATE lead SET payload=? WHERE id=?")
          .run(JSON.stringify(qualify(merged, id, config.weights)), id);
      }
      this.db.prepare("INSERT INTO observation VALUES(?,?,?)").run(oid, id, JSON.stringify(o));
      for (const other of all)
        if (other.id !== id && match(other, o) === "review")
          this.review(id, other.id, "Ambiguous entity match; no automatic merge");
      this.db.exec("COMMIT");
      return { duplicate: !!existing, id };
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  review(id: string, other: string | null, reason: string) {
    this.db
      .prepare("INSERT OR IGNORE INTO review(id,lead_id,other_id,reason) VALUES(?,?,?,?)")
      .run(hash(`${id}|${other}|${reason}`), id, other, reason);
  }
  sales(id: string) {
    const row = this.db.prepare("SELECT * FROM sales WHERE lead_id=?").get(id);
    if (!row) throw Error("Unknown lead");
    return row;
  }
  updateSales(id: string, revision: number, patch: Record<string, string>) {
    const keys = Object.keys(patch);
    const allowed = ["status", "assigned_to", "notes", "last_contacted", "next_follow_up"];
    if (!keys.length || keys.some((k) => !allowed.includes(k))) throw Error("Invalid sales field");
    if (patch.status && !statuses.includes(patch.status)) throw Error("Invalid status");
    for (const k of ["last_contacted", "next_follow_up"])
      if (patch[k] && !/^\d{4}-\d{2}-\d{2}$/.test(patch[k])) throw Error("Expected ISO date");
    const r = this.db
      .prepare(
        `UPDATE sales SET ${keys.map((k) => `${k}=?`).join(",")},revision=revision+1 WHERE lead_id=? AND revision=?`,
      )
      .run(...keys.map((k) => patch[k] ?? ""), id, revision);
    if (!r.changes) throw Error("Sales edit conflict: reload current revision");
  }
  appendOutreach(id: string, attemptId: string, payload: Record<string, string>) {
    if (this.sales(id).status === "Do Not Contact") throw Error("Do Not Contact: outreach blocked");
    if (!payload.date || !Number.isFinite(Date.parse(payload.date)) || !payload.channel)
      throw Error("Contact date and channel required");
    this.db
      .prepare("INSERT OR IGNORE INTO outreach VALUES(?,?,?)")
      .run(attemptId, id, JSON.stringify(payload));
  }
  enqueue(adapter: string, queries: string[]) {
    for (const q of queries)
      this.db
        .prepare("INSERT OR IGNORE INTO job(id,adapter,query) VALUES(?,?,?)")
        .run(hash(`${adapter}|${q}`), adapter, q);
  }
  claim(adapter: string, now = Date.now()) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const row = this.db
        .prepare(
          "SELECT * FROM job WHERE adapter=? AND (status='pending' OR (status='running' AND lease_until<?)) ORDER BY rowid LIMIT 1",
        )
        .get(adapter, now);
      if (row)
        this.db
          .prepare("UPDATE job SET status='running',attempts=attempts+1,lease_until=? WHERE id=?")
          .run(now + 300000, String(row.id));
      this.db.exec("COMMIT");
      return row;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  audit(
    source: string,
    query: string,
    found: number,
    accepted: number,
    duplicates: number,
    error = "",
    restrictions = "Public factual data; no copied reviews",
  ) {
    this.db
      .prepare(
        "INSERT INTO audit(source,query,collected_at,found,accepted,duplicates,error,restrictions) VALUES(?,?,?,?,?,?,?,?)",
      )
      .run(
        source,
        query,
        new Date().toISOString(),
        found,
        accepted,
        duplicates,
        error,
        restrictions,
      );
  }
  rescore() {
    for (const l of this.leads())
      this.db
        .prepare("UPDATE lead SET payload=? WHERE id=?")
        .run(JSON.stringify(qualify(l, l.id, config.weights)), l.id);
  }
}
