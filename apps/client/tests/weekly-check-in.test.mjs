import test from "node:test";
import assert from "node:assert/strict";
import { WEEKLY_STEPS, stepValid, validAnswer } from "../src/components/check-in/weekly-steps.ts";

const metrics = WEEKLY_STEPS.flatMap(step => step.codes.map(code => ({
 id: code, code, shared: true,
 type: step.kind === "measurements" ? "number" : step.kind === "photos" ? "image" : ["mood","stars"].includes(step.kind) ? "rating" : "text"
})));
const answers = Object.fromEntries(metrics.map(m => [m.id, {
 metricId:m.id, ...(m.type === "number" ? {numberValue:70} : m.type === "image" ? {imageUrl:"https://example.com/photo.jpg"} : m.type === "rating" ? {ratingValue:4} : {textValue:m.code === "training_feel" ? "Good" : "Stayed consistent"})
}]));
test("ten groups require all seventeen answers", () => {
 assert.equal(WEEKLY_STEPS.length,10);
 assert.equal(metrics.length,17);
 assert.ok(WEEKLY_STEPS.every(s => stepValid(s,metrics,answers)));
 for (const metric of metrics) {
  const partial = {...answers}; delete partial[metric.id];
  assert.ok(!WEEKLY_STEPS.every(s => stepValid(s,metrics,partial)));
 }
});
test("measurements, ratings, text and choices reject invalid values", () => {
 const byCode = code => metrics.find(m => m.code === code);
 for (const n of [0,-1,NaN,Infinity,501]) assert.equal(validAnswer(byCode("weight"),{numberValue:n}),false);
 for (const n of [0,6,2.5]) assert.equal(validAnswer(byCode("energy"),{ratingValue:n}),false);
 assert.equal(validAnswer(byCode("biggest_win"),{textValue:"   "}),false);
 assert.equal(validAnswer(byCode("biggest_win"),{textValue:"a".repeat(2049)}),false);
 assert.equal(validAnswer(byCode("training_feel"),{textValue:"invalid"}),false);
 assert.equal(validAnswer(byCode("photo_back"),{imageUrl:"http://example.com/a"}),false);
});
