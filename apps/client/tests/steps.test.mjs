import test from "node:test";
import assert from "node:assert/strict";
import {weekDates,goalFor} from "../../../packages/ui/src/lib/steps.ts";
test("weeks begin Monday and cross year boundaries correctly",()=>{
 assert.deepEqual(weekDates("2027-01-03"),["2026-12-28","2026-12-29","2026-12-30","2026-12-31","2027-01-01","2027-01-02","2027-01-03"]);
 assert.equal(weekDates("2027-01-03",-1)[0],"2026-12-21");
});
test("goals use the effective date without rewriting previous days",()=>{
 const data={defaultGoal:10000,goals:[{effectiveOn:"2026-11-05",count:8000},{effectiveOn:"2026-11-02",count:6000}],days:[]};
 assert.equal(goalFor(data,"2026-11-01"),10000);
 assert.equal(goalFor(data,"2026-11-04"),6000);
 assert.equal(goalFor(data,"2026-11-05"),8000);
});
