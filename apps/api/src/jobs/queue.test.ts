import { schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { db } from "../db.js";
import { claim, enqueue, fail, succeed } from "./queue.js";
import { register, runOnce } from "./worker.js";

/**
 * The job queue, against the real database.
 *
 * Every failure this file guards is one a hand-rolled queue hits on its first bad deploy:
 * two workers doing the same paid work, a killed process leaving a client waiting forever
 * for a plan, and a job that fails quietly and is never heard from again.
 *
 * `generate_plan` costs money per run, which is what makes double-claiming a bug worth a
 * test rather than a comment.
 */

const KIND = "generate_plan" as const;

async function clear() {
  await db.delete(schema.jobs);
}

beforeEach(clear);
afterEach(clear);

async function rowFor(id: string) {
  const [row] = await db.select().from(schema.jobs).where(eq(schema.jobs.id, id)).limit(1);
  return row;
}

describe("claiming", () => {
  it("hands the same job to exactly one worker", async () => {
    await enqueue(KIND, { clientId: "c1" });

    // Both workers race for the single queued row, as two API instances would.
    const [a, b] = await Promise.all([claim("worker-a"), claim("worker-b")]);

    const got = [a, b].filter(Boolean);
    expect(got).toHaveLength(1);
  });

  it("gives two workers two different jobs rather than one twice", async () => {
    await enqueue(KIND, { clientId: "c1" });
    await enqueue(KIND, { clientId: "c2" });

    const [a, b] = await Promise.all([claim("worker-a"), claim("worker-b")]);

    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a?.id).not.toBe(b?.id);
  });

  it("does not hand out a job that is not due yet", async () => {
    await enqueue(KIND, { clientId: "c1" }, { runAfter: new Date(Date.now() + 60_000) });
    expect(await claim("worker-a")).toBeNull();
  });

  it("takes the oldest due job first", async () => {
    const old = await enqueue(KIND, { n: 1 }, { runAfter: new Date(Date.now() - 10_000) });
    await enqueue(KIND, { n: 2 });

    expect((await claim("worker-a"))?.id).toBe(old?.id);
  });

  it("counts the attempt as it claims, so a crash loop cannot run forever", async () => {
    const job = await enqueue(KIND, { clientId: "c1" });
    await claim("worker-a");
    expect((await rowFor(job?.id ?? ""))?.attempts).toBe(1);
  });
});

describe("a worker that died mid-job", () => {
  it("lets another worker take the job back once the lease expires", async () => {
    const job = await enqueue(KIND, { clientId: "c1" });
    await claim("worker-a");

    // The process was killed: the row stays `running` and nobody is working on it.
    await db
      .update(schema.jobs)
      .set({ lockedAt: new Date(Date.now() - 20 * 60 * 1000) })
      .where(eq(schema.jobs.id, job?.id ?? ""));

    const retaken = await claim("worker-b");
    expect(retaken?.id).toBe(job?.id);
    expect(retaken?.lockedBy).toBe("worker-b");
  });

  it("leaves a live lease alone", async () => {
    await enqueue(KIND, { clientId: "c1" });
    await claim("worker-a");
    expect(await claim("worker-b")).toBeNull();
  });
});

describe("failing", () => {
  it("retries with a delay rather than hammering", async () => {
    const job = await enqueue(KIND, { clientId: "c1" });
    await claim("worker-a");
    const { exhausted } = await fail(job?.id ?? "", new Error("model timed out"));

    const row = await rowFor(job?.id ?? "");
    expect(exhausted).toBe(false);
    expect(row?.status).toBe("queued");
    expect(row?.error).toBe("model timed out");
    expect(row?.runAfter.getTime()).toBeGreaterThan(Date.now());
  });

  it("gives up after the last attempt, and says why", async () => {
    const job = await enqueue(KIND, { clientId: "c1" }, { maxAttempts: 2 });

    await claim("worker-a");
    await fail(job?.id ?? "", new Error("first"));
    await db
      .update(schema.jobs)
      .set({ runAfter: new Date(Date.now() - 1000) })
      .where(eq(schema.jobs.id, job?.id ?? ""));
    await claim("worker-a");
    const { exhausted } = await fail(job?.id ?? "", new Error("second"));

    const row = await rowFor(job?.id ?? "");
    expect(exhausted).toBe(true);
    expect(row?.status).toBe("failed");
    // The row survives. "Why does this client have no plan" has to be answerable.
    expect(row?.error).toBe("second");
    expect(row?.finishedAt).not.toBeNull();
  });

  it("marks a finished job finished", async () => {
    const job = await enqueue(KIND, { clientId: "c1" });
    await claim("worker-a");
    await succeed(job?.id ?? "");

    const row = await rowFor(job?.id ?? "");
    expect(row?.status).toBe("done");
    expect(row?.finishedAt).not.toBeNull();
    expect(row?.lockedBy).toBeNull();
  });
});

describe("the worker loop", () => {
  it("runs the handler and finishes the job", async () => {
    const seen: string[] = [];
    register("test_ok", async (job) => {
      seen.push((job.payload as { tag: string }).tag);
    });

    const job = await enqueue("test_ok" as never, { tag: "hello" });
    expect(await runOnce("w1")).toBe("done");
    expect(seen).toEqual(["hello"]);
    expect((await rowFor(job?.id ?? ""))?.status).toBe("done");
  });

  it("says idle when there is nothing to do", async () => {
    expect(await runOnce("w1")).toBe("idle");
  });

  it("fails a job whose handler was removed by a deploy", async () => {
    const job = await enqueue("kind_that_no_longer_exists" as never, {}, { maxAttempts: 1 });
    expect(await runOnce("w1")).toBe("failed");

    const row = await rowFor(job?.id ?? "");
    expect(row?.status).toBe("failed");
    expect(row?.error).toContain("No handler");
  });

  it("does not lose the job when the handler throws", async () => {
    register("test_throws", async () => {
      throw new Error("boom");
    });

    const job = await enqueue("test_throws" as never, {});
    expect(await runOnce("w1")).toBe("failed");

    const row = await rowFor(job?.id ?? "");
    expect(row?.status).toBe("queued"); // back in the queue, not gone
    expect(row?.error).toBe("boom");
  });
});
