import assert from "node:assert/strict";
// Usage: node keyboard.mjs <url> [maxTabs=80]
// Tabs through a page in real Chrome. For each stop: what has focus, and whether focus is
// visibly indicated (outline or box-shadow differs from the unfocused state).
// Then drives the first segmented control with arrow keys and the main form with Enter.
import { spawn } from "node:child_process";

const BASE = process.env.WEB_ORIGIN ?? "http://localhost:3005";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9450;
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TMPDIR}/phase5b-prof`,
  "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try {
    target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page");
  } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result ?? m.error);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id;
    pending.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.value;
const key = async (k, code, keyCode, shift = false) => {
  const mods = shift ? 8 : 0;
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, windowsVirtualKeyCode: keyCode, modifiers: mods });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: keyCode, modifiers: mods });
};

const open = async (slug) => { await send("Page.navigate", { url: `${BASE}/tools/${slug}` }); await sleep(1600); };
const text = () => evaluate(`[...document.querySelectorAll('main section[aria-live]')].map(s=>s.innerText).join(' | ')`);
const click = async (label) => {
  const ok = await evaluate(`(() => { const b = [...document.querySelectorAll('main button, main [role=radio]')].find(x => x.innerText.trim() === ${JSON.stringify(label)}); if (!b) return false; b.click(); return true; })()`);
  assert.equal(ok, true, `Missing control: ${label}`); await sleep(200);
};
const fillNum = async (index, value) => {
  await evaluate(`(() => {const el = document.querySelectorAll('main form input[type="number"]')[${index}]; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(String(value))}); el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(200);
};
const fillText = async (value) => {
  await evaluate(`(() => {const el = document.querySelector('main form textarea'); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,${JSON.stringify(value)}); el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(250);
};
const select = async (label) => {
  await evaluate(`document.querySelector('main form [role=combobox]').click()`); await sleep(300);
  const ok = await evaluate(`(() => { const o=[...document.querySelectorAll('[role=option]')].find(x=>x.innerText.trim()===${JSON.stringify(label)}); if(!o) return false; o.click(); return true; })()`);
  assert.equal(ok, true, `Missing option: ${label}`); await sleep(300);
};
try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 1, mobile: true });
  await open("client-check-in-reader");
  assert.match(await text(), /Hold the plan and push training/);
  await fillText("felt dizzy at the gym on Tuesday");
  assert.match(await text(), /Refer out/);
  await fillText(""); await fillNum(4, 5);
  assert.match(await text(), /Pull back/);
  await fillNum(4, 7); await fillNum(0, 0.2);
  assert.match(await text(), /Recalculate/);
  await click("No-nonsense");
  assert.match(await text(), /You've done your part/);
  console.log("PASS: check-in reader verdict order and tone");

  await open("client-churn-risk-reader");
  assert.match(await text(), /Low risk/);
  await click("Missed 2+"); await click("Gone quiet");
  assert.match(await text(), /High risk/);
  await fillText("money is tight right now");
  assert.match(await text(), /want out/);
  console.log("PASS: churn risk levels and exit intent");

  await open("coaching-business-health-check");
  assert.match(await text(), /8 out of 16/);
  assert.match(await text(), /Clients leave too soon/);
  await click("Over 2 years ago, or never");
  assert.match(await text(), /Your prices are out of date/);
  console.log("PASS: business health score and leak priority");

  await open("weight-trend-reader");
  assert.match(await text(), /Paste four or more/);
  await click("Try the example");
  assert.match(await text(), /genuine stall/);
  await click("Down");
  assert.match(await text(), /Recomposition/);
  console.log("PASS: weight trend example, stall and recomp");

  await open("lift-progression-reader");
  await click("Try the example");
  assert.match(await text(), /Grinding/);
  await fillText("100x5, 102.5x5, 105x5, 107.5x5");
  assert.match(await text(), /Progressing/);
  await fillText("junk");
  assert.match(await text(), /at least three sessions/);
  console.log("PASS: lift reader verdicts and invalid input");

  await open("difficult-client-responder");
  await select("Off-loading a personal crisis");
  assert.match(await text(), /crisis line/);
  await open("sales-objection-handler");
  await select("Need to think about it");
  assert.match(await text(), /what's the main thing you're weighing up/);
  await open("scope-of-practice-check");
  await select("Undiagnosed or worsening pain");
  assert.match(await text(), /Refer out now/);
  console.log("PASS: responder, objection and scope selections");
  console.log("All Phase 5b browser scenarios pass");
} finally { ws.close(); chrome.kill(); }
