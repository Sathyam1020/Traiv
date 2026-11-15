import assert from "node:assert/strict";
// Usage: node keyboard.mjs <url> [maxTabs=80]
// Tabs through a page in real Chrome. For each stop: what has focus, and whether focus is
// visibly indicated (outline or box-shadow differs from the unfocused state).
// Then drives the first segmented control with arrow keys and the main form with Enter.
import { spawn } from "node:child_process";

const BASE = process.env.WEB_ORIGIN ?? "http://localhost:3005";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9447;
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TMPDIR}/phase4-scenarios-prof`,
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

const open = async (slug) => {
  await send("Page.navigate", { url: `${BASE}/tools/${slug}` });
  await sleep(1500);
};
const text = () => evaluate(`(document.querySelector('[aria-label="Your result"]') ?? document.querySelector('[aria-label="Workout timer"]')).innerText`);
const click = async (label) => {
  const clicked = await evaluate(`(() => { const b = [...document.querySelectorAll('main button')].find(x => x.innerText.trim() === ${JSON.stringify(label)}); if (!b) return false; b.click(); return true; })()`);
  assert.equal(clicked, true, `Missing control: ${label}`);
  await sleep(150);
};
const fill = async (index, value) => {
  await evaluate(`(() => {const el = document.querySelectorAll('main form input[type="number"]')[${index}]; if(!el) throw Error('Missing input'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(String(value))}); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await sleep(120);
};
const inputValue = (i) => evaluate(`document.querySelectorAll('main form input[type="number"]')[${i}].value`);
try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 1, mobile: true });

  await open("heart-rate-zone-calculator");
  assert.match(await text(), /112–131 bpm/);
  await fill(1, 60);
  await click("Calculate zones");
  assert.match(await text(), /136–149 bpm/);
  await fill(0, "");
  await click("Calculate zones");
  assert.match(await text(), /Enter an age/);
  console.log("PASS: zones by % of max, Karvonen after adding resting HR, empty age error");

  await open("zone-2-heart-rate-calculator");
  await click("MAF");
  await click("Calculate my zone 2");
  assert.match(await text(), /130–140/);
  await click("Karvonen");
  await click("Calculate my zone 2");
  assert.match(await text(), /132–144/);
  console.log("PASS: zone 2 MAF and Karvonen");

  await open("beep-test-calculator");
  assert.match(await text(), /44\.9/);
  await fill(1, 12);
  await click("Calculate result");
  assert.match(await text(), /shuttle that exists/);
  await fill(1, 5);
  await fill(2, "");
  await click("Calculate result");
  assert.match(await text(), /Add an age for a rating/);
  console.log("PASS: beep test, impossible shuttle, unrated without age");

  await open("cooper-test-calculator");
  await click("miles");
  assert.equal(await inputValue(1), "1.49");
  await click("Calculate result");
  assert.match(await text(), /42\.[34]/);
  console.log("PASS: Cooper unit conversion keeps the result");

  await open("vo2-max-calculator");
  await click("1.5-mile run");
  await click("Calculate VO2 max");
  assert.match(await text(), /42\.1/);
  await click("Resting heart rate");
  await click("Calculate VO2 max");
  assert.match(await text(), /48\.5/);
  console.log("PASS: VO2 max methods");

  await open("race-time-predictor");
  await fill(1, 20);
  await click("Predict race times");
  assert.match(await text(), /41:42/);
  await fill(1, 0);
  await click("Predict race times");
  assert.match(await text(), /realistic finishing time/);
  console.log("PASS: race predictor and zero time error");

  await open("running-pace-calculator");
  await click("Marathon");
  assert.equal(await inputValue(0), "42.195");
  await fill(1, 3); await fill(2, 30); await fill(3, 0);
  await click("Calculate pace");
  assert.match(await text(), /4:59/);
  console.log("PASS: pace presets and marathon pace");

  await open("rucking-calorie-calculator");
  assert.match(await text(), /323/);
  await fill(2, 5);
  await click("Calculate my burn");
  assert.match(await text(), /511/);
  console.log("PASS: rucking grade");

  await open("interval-walking-calculator");
  await click("Metric");
  assert.equal(await inputValue(0), "79.4");
  await fill(0, 90.5);
  await click("Calculate my session");
  assert.match(await text(), /190/);
  console.log("PASS: interval walking unit change");

  await open("workout-timer");
  assert.match(await text(), /0:20/);
  await click("Start");
  await sleep(2600);
  let t = await text();
  assert.match(t, /Work/);
  assert.match(t, /0:1[78]/);
  await click("Pause");
  const paused = await text();
  await sleep(1200);
  assert.equal(await text(), paused);
  await click("Reset");
  assert.match(await text(), /Ready[\s\S]*0:20/);
  await evaluate("document.activeElement?.blur()");
  await key(" ", "Space", 32);
  await sleep(1300);
  assert.match(await text(), /Pause/);
  await key(" ", "Space", 32);
  await click("EMOM");
  t = await text();
  assert.match(t, /1:00/);
  assert.match(t, /10:00/);
  await fill(0, "");
  assert.match(await text(), /allowed ranges/);
  console.log("PASS: timer start, countdown, pause holds, reset, space bar, mode change, invalid settings");
  console.log("All Phase 4 browser scenarios pass");
} finally { ws.close(); chrome.kill(); }
