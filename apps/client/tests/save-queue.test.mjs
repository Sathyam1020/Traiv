import assert from "node:assert/strict";
import test from "node:test";
import { createSaveQueue } from "../src/lib/workouts/save-queue.ts";

function gate() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

test("blur save finishes before a following completion write starts", async () => {
  const queue = createSaveQueue();
  const pending = gate();
  const events = [];
  const first = queue.run("squat:1", async () => {
    events.push("blur");
    await pending.promise;
    events.push("blur saved");
  });
  const second = queue.run("squat:1", async () => {
    events.push("complete");
  });
  await Promise.resolve();
  assert.deepEqual(events, ["blur"]);
  pending.resolve();
  await Promise.all([first, second]);
  assert.deepEqual(events, ["blur", "blur saved", "complete"]);
});

test("an older completion failure cannot roll back a newer tap on the same row", async () => {
  const queue = createSaveQueue();
  const pending = gate();
  const rollbacks = [];
  const first = queue.run("press:1", async (isLatest) => {
    await pending.promise;
    if (isLatest()) rollbacks.push("old completion");
  });
  const latest = queue.run("press:1", async (isLatest) => {
    assert.equal(isLatest(), true);
  });
  pending.resolve();
  await Promise.all([first, latest]);
  assert.deepEqual(rollbacks, []);
});

test("failed network writes reject to their caller without preventing a retry", async () => {
  const queue = createSaveQueue();
  const first = queue.run("row:1", async () => {
    throw new Error("offline");
  });
  await assert.rejects(first, /offline/);
  let retried = false;
  await queue.run("row:1", async (isLatest) => {
    retried = isLatest();
  });
  assert.equal(retried, true);
});

test("a different row's update does not suppress rollback for the failed row", async () => {
  const queue = createSaveQueue();
  const latest = [];
  await Promise.all([
    queue.run("squat:1", async (isLatest) => {
      latest.push(isLatest());
    }),
    queue.run("squat:2", async (isLatest) => {
      latest.push(isLatest());
    }),
  ]);
  assert.deepEqual(latest, [true, true]);
});
