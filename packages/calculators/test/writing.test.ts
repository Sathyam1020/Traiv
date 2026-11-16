import assert from "node:assert/strict";
import { test } from "node:test";
import { checkWriting, segments, wordCount } from "../src/writing.ts";

const SAMPLE = "It's not about the diet. It's about the habits.\n\nIn today's fast-paced world, staying consistent is harder than ever.\n\nTired of starting over every Monday? Sick of stalling? Ready to finally change?\n\nDiscipline, patience, and commitment will unlock your potential. Let's go! You've got this!\n\nIf you'd like, I can send you a plan.";

test("the sample scores high", () => {
  const r = checkWriting(SAMPLE);
  const ids = r.hits.map((h) => h.tell.id);
  for (const id of ["contrast", "worldopener", "questions", "triple", "buzz", "cheer", "offer", "exclaim"]) assert.ok(ids.includes(id), id);
  assert.ok(r.score >= 6, String(r.score));
  assert.equal(r.band, "rewrite");
});

test("plain writing scores low", () => {
  const r = checkWriting("Squatted 80 kg for five today. Sleep was rough, so I kept the last set at RPE 7. Next week I'll add 2.5 kg if the bar speed holds.");
  assert.equal(r.score, 0);
  assert.equal(r.band, "post");
});

test("segments and counts", () => {
  assert.deepEqual(segments("abcdef", [[1, 3], [2, 4]]), [{ text: "a", hit: false }, { text: "bcd", hit: true }, { text: "ef", hit: false }]);
  assert.equal(wordCount("  one two  three "), 3);
  assert.equal(checkWriting("").score, 0);
});
