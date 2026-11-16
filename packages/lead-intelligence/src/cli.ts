import { mkdir, readFile, writeFile } from "node:fs/promises";
import { BraveAdapter, collect, queries, verify } from "./adapters.ts";
import { env } from "./config.ts";
import { exports, model } from "./export.ts";
import { discoverOsm } from "./osm.ts";
import { formatting, sync, writes } from "./sheets.ts";
import { Store } from "./store.ts";

const [command, arg, ...args] = process.argv.slice(2);
const store = new Store(env.LEADS_DB);
try {
  switch (command) {
    case "osm":
      await discoverOsm(store, arg === "refresh");
      break;
    case "queries": {
      const q = await queries();
      await mkdir("data", { recursive: true });
      await writeFile("data/queries.json", JSON.stringify(q, null, 2));
      break;
    }
    case "import": {
      if (!arg) throw Error("import requires a JSONL path");
      const lines = (await readFile(arg, "utf8")).split("\n").filter(Boolean);
      let accepted = 0,
        duplicates = 0,
        errors = 0;
      for (const [i, line] of lines.entries()) {
        try {
          const result = store.import(JSON.parse(line));
          if (result.duplicate) duplicates++;
          else accepted++;
        } catch (e) {
          errors++;
          store.audit(
            "reviewed-import",
            `${arg}:${i + 1}`,
            1,
            0,
            0,
            e instanceof Error ? e.message : "Import error",
          );
        }
      }
      store.audit(
        "reviewed-import",
        arg,
        lines.length,
        accepted,
        duplicates,
        errors ? `${errors} rejected observations` : "",
        "Manually reviewed public business facts; no review text stored",
      );
      if (errors) process.exitCode = 1;
      break;
    }
    case "collect": {
      const adapter = new BraveAdapter();
      if (!process.env.BRAVE_API_KEY || process.env.BRAVE_STORAGE_ALLOWED !== "true")
        throw Error(
          "Configure storage-permitted Brave Search account, or use import for reviewed public sources",
        );
      const q = await queries();
      store.enqueue(
        adapter.name,
        q.filter((x) => !arg || arg === "all" || x.kind === arg).map((x) => x.query),
      );
      await collect(store, adapter, Number(args[0] ?? 20), 2);
      break;
    }
    case "resume": {
      store.db.prepare("UPDATE job SET status='pending' WHERE status='failed'").run();
      await collect(store, new BraveAdapter(), Number(arg ?? 20));
      break;
    }
    case "verify":
      await verify(store);
      break;
    case "export":
      await exports(store, arg ?? "outputs/latest");
      break;
    case "sync":
      process.stdout.write(`${JSON.stringify({ spreadsheetId: await sync(store) })}\n`);
      break;
    case "sheet-plan": {
      const sheets = model(store);
      await mkdir("data", { recursive: true });
      await writeFile(
        "data/sheet-plan.json",
        JSON.stringify(
          sheets.map((s, i) => ({
            name: s.name,
            sheetId: i,
            requests: [...formatting(i, s), ...writes(s, i)],
          })),
        ),
      );
      break;
    }
    case "status": {
      if (!arg || !args[0]) throw Error("status LEAD_ID JSON_PATCH [EXPECTED_REVISION]");
      store.updateSales(arg, Number(args[1] ?? store.sales(arg).revision), JSON.parse(args[0]));
      break;
    }
    case "outreach": {
      if (!arg || !args[0] || !args[1])
        throw Error("outreach LEAD_ID ATTEMPT_ID JSON_RECORD (logs only; sends nothing)");
      store.appendOutreach(arg, args[0], JSON.parse(args[1]));
      break;
    }
    default:
      throw Error(
        "Use queries, import, collect, resume, verify, export, sync, sheet-plan, status, outreach or osm",
      );
  }
} catch (e) {
  console.error(
    JSON.stringify({
      event: "command-failed",
      error: e instanceof Error ? e.message : "Unknown error",
    }),
  );
  process.exitCode = 1;
} finally {
  store.close();
}
