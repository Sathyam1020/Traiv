import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { cellSafe, type Observation, parseObservation, qualify } from "../src/domain.ts";
import { model } from "../src/export.ts";
import { writes } from "../src/sheets.ts";
import { Store } from "../src/store.ts";

function sample(branch = "HSR", at = new Date().toISOString()): Observation {
  return {
    name: "Scenario Fitness",
    kind: "gym",
    locality: branch,
    branch,
    source: "https://example.org/gym",
    query: "test",
    collectedAt: at,
    verification: "page-reviewed",
    facts: Object.fromEntries(
      Object.entries({
        bengaluruBased: true,
        website: "https://example.org/gym",
        phone: "+919876543210",
        personalTraining: true,
      }).map(([k, value]) => [
        k,
        {
          value,
          status: "confirmed",
          source: "https://example.org/gym",
          observedAt: at,
          basis: "Synthetic test fixture; never production data",
        },
      ]),
    ),
  };
}
test("second import preserves status and notes; same domain/phone branches remain distinct", () => {
  const s = new Store(":memory:");
  try {
    s.import(sample());
    const id = s.leads()[0]?.id;
    assert.ok(id);
    s.updateSales(id, 0, { status: "Interested", notes: "Keep this" });
    s.import(sample());
    assert.equal(s.leads().length, 1);
    assert.equal(s.sales(id).notes, "Keep this");
    s.import(sample("Whitefield"));
    assert.equal(s.leads().length, 2);
  } finally {
    s.close();
  }
});
test("two sales actors: stale write rejected on shared real database", () => {
  const dir = mkdtempSync(join(tmpdir(), "traiv-leads-"));
  const a = new Store(join(dir, "test.sqlite"));
  const b = new Store(join(dir, "test.sqlite"));
  try {
    a.import(sample());
    const id = a.leads()[0]?.id;
    assert.ok(id);
    a.updateSales(id, 0, { notes: "Actor A" });
    assert.throws(() => b.updateSales(id, 0, { notes: "Actor B" }), /conflict/);
    b.updateSales(id, 1, { assigned_to: "B" });
    assert.equal(a.sales(id).notes, "Actor A");
  } finally {
    a.close();
    b.close();
    rmSync(dir, { recursive: true });
  }
});
test("older evidence cannot replace newer; conflicts recorded; stale evidence earns no points", () => {
  const s = new Store(":memory:");
  try {
    const now = sample();
    s.import(now);
    const old = sample("HSR", "2020-01-01T00:00:00Z");
    const p = old.facts.phone;
    assert.ok(p);
    p.value = "+919876543211";
    s.import(old);
    assert.equal(s.leads()[0]?.facts.phone?.value, "+919876543210");
    assert.equal(s.db.prepare("SELECT COUNT(*) n FROM review").get()?.n, 1);
    assert.equal(qualify(old, "id").score, 0);
  } finally {
    s.close();
  }
});
test("unknown app and social signals do not score; inferred online never confirmed", () => {
  const o = sample();
  const l = qualify(o, "id");
  assert.equal(l.score, 30);
  assert.equal(l.onlineStatus, "Unknown");
  o.facts.onlineCoaching = {
    value: true,
    status: "inferred",
    source: o.source,
    observedAt: o.collectedAt,
    basis: "Snippet",
  };
  assert.equal(qualify(o, "id").onlineStatus, "Likely online coach, needs verification");
  assert.throws(() => qualify(o, "id", { coaching: 200 }), /sum/);
});
test("abandoned job lease expires, resumes, completed job not repeated", () => {
  const s = new Store(":memory:");
  try {
    s.enqueue("fake", ["a", "b"]);
    const a = s.claim("fake", 1000);
    assert.ok(a);
    const b = s.claim("fake", 2000);
    assert.ok(b);
    assert.equal(s.claim("fake", 3000), undefined);
    assert.equal(s.claim("fake", 400000)?.id, a.id);
    s.db.prepare("UPDATE job SET status='done'").run();
    assert.equal(s.claim("fake", 900000), undefined);
  } finally {
    s.close();
  }
});
test("outreach append-only retry; Do Not Contact blocks later attempts", () => {
  const s = new Store(":memory:");
  try {
    s.import(sample());
    const id = s.leads()[0]?.id;
    assert.ok(id);
    s.appendOutreach(id, "one", { date: "2026-11-11", channel: "email" });
    s.appendOutreach(id, "one", { date: "2026-11-12", channel: "phone" });
    assert.equal(s.db.prepare("SELECT COUNT(*) n FROM outreach").get()?.n, 1);
    s.updateSales(id, 0, { status: "Do Not Contact" });
    assert.throws(
      () => s.appendOutreach(id, "two", { date: "2026-11-12", channel: "email" }),
      /blocked/,
    );
  } finally {
    s.close();
  }
});
test("malformed source or phone rejected, formula injection escaped", () => {
  const o = sample();
  o.source = "file:///etc/passwd";
  assert.throws(() => parseObservation(o));
  const b = sample();
  const p = b.facts.phone;
  assert.ok(p);
  p.value = "123";
  assert.throws(() => parseObservation(b));
  assert.equal(cellSafe('=HYPERLINK("evil")'), '\'=HYPERLINK("evil")');
});
test("Sheets reordered IDs keep manual cells untouched and outreach history preserved", () => {
  const s = new Store(":memory:");
  try {
    s.import(sample());
    s.import(sample("Whitefield"));
    const sheet = model(s).find((x) => x.name === "Gym Leads");
    assert.ok(sheet);
    const remote = [sheet.rows[0] ?? [], sheet.rows[2] ?? [], sheet.rows[1] ?? []];
    const plan = writes(sheet, 1, remote);
    for (const req of plan) {
      const u = req.updateCells as { start: { rowIndex: number; columnIndex: number } };
      if (u.start.rowIndex > 0) assert.ok(!sheet.manual.includes(u.start.columnIndex));
    }
    const tracker = model(s).find((x) => x.name === "Outreach Tracker");
    assert.ok(tracker);
    assert.deepEqual(writes(tracker, 3, [["existing"]]), []);
    assert.throws(
      () => writes(sheet, 1, [remote[0] ?? [], remote[1] ?? [], remote[1] ?? []]),
      /Duplicate/,
    );
  } finally {
    s.close();
  }
});
test("Sheets appends each new outreach attempt once without changing existing history", () => {
  const header = [
    "Lead ID",
    "Channel",
    "Date",
    "Version",
    "Response",
    "Interest",
    "Demo",
    "Action",
    "Due",
    "Outcome",
    "Attempt ID",
  ];
  const old = ["lead", "email", "", "", "", "", "", "", "", "", "attempt-1"];
  const fresh = ["lead", "phone", "", "", "", "", "", "", "", "", "attempt-2"];
  const sheet = { name: "Outreach Tracker", rows: [header, old, fresh], formulas: [], manual: [] };
  const planned = writes(sheet, 3, [header, old]);
  assert.equal(planned.length, 1);
  assert.equal(writes(sheet, 3, [header, old, fresh]).length, 0);
});
test("CLI export produces current files instead of silently doing nothing", async () => {
  const { execFileSync } = await import("node:child_process");
  const { existsSync } = await import("node:fs");
  const dir = mkdtempSync(join(tmpdir(), "traiv-cli-"));
  try {
    execFileSync(process.execPath, ["src/cli.ts", "export", join(dir, "output")], {
      env: { ...process.env, LEADS_DB: join(dir, "test.sqlite") },
    });
    assert.ok(existsSync(join(dir, "output", "quality-report.json")));
    assert.ok(existsSync(join(dir, "output", "reviewed-shortlist.csv")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
