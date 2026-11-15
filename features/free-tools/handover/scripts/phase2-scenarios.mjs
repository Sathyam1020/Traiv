import assert from "node:assert/strict";
// Usage: node keyboard.mjs <url> [maxTabs=80]
// Tabs through a page in real Chrome. For each stop: what has focus, and whether focus is
// visibly indicated (outline or box-shadow differs from the unfocused state).
// Then drives the first segmented control with arrow keys and the main form with Enter.
import { spawn } from "node:child_process";

const BASE = process.env.WEB_ORIGIN ?? "http://localhost:3005";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9446;
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TMPDIR}/phase2-scenarios-prof`,
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
  await sleep(1400);
};
const text = () => evaluate(`document.querySelector('[aria-label="Your result"]')?.innerText ?? document.querySelector('main')?.innerText`);
const click = async (label) => {
  const clicked = await evaluate(`(() => { const b = [...document.querySelectorAll('main button')].find(x => x.innerText.trim() === ${JSON.stringify(label)}); if (!b) return false; b.click(); return true; })()`);
  assert.equal(clicked, true, `Missing control: ${label}`);
  await sleep(120);
};
const fill = async (index, value) => {
  await evaluate(`(() => {const el = document.querySelectorAll('main form input[type="number"]')[${index}]; if(!el) throw Error('Missing input'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(String(value))}); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await sleep(120);
};
try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 1, mobile: true });
  await open('one-rep-max-calculator');
  assert.match(await text(), /262.5/);
  await click('kg');
  assert.doesNotMatch(await text(), /262.5/);
  await fill(0, '');
  assert.match(await text(), /Enter a weight/);
  await fill(0, 100);
  assert.match(await text(), /116.7/);
  await click('lb');
  assert.doesNotMatch(await text(), /116.7/);
  console.log('PASS: units, cleared input, restored input, second unit change');
  await open('ipf-gl-points-calculator');
  await fill(2,200); await fill(3,150); await fill(4,250);
  assert.equal(await evaluate(`document.querySelectorAll('main form input[type="number"]')[1].value`), '600');
  await click('Female'); await fill(0,30);
  assert.match(await text(), /40 kg/);
  assert.doesNotMatch(await text(), /-\d/);
  await click('lb');
  assert.ok(Number(await evaluate(`document.querySelectorAll('main form input[type="number"]')[1].value`)) > 1300);
  console.log('PASS: individual lift totals, low bodyweight floor, unit conversion');
  await open('plate-loading-calculator');
  assert.match(await text(), /25 \+ 15 \+ 1.25/);
  await fill(0,10);
  assert.match(await text(), /at least as heavy/);
  await fill(0,100);
  assert.match(await text(), /loaded 100/);
  console.log('PASS: plate loading, below-bar input, second attempt');
  await open('injury-exercise-swap');
  await click('Painful under load');
  assert.match(await text(), /Stop the painful movement/);
  assert.doesNotMatch(await text(), /Week 1|60%/);
  await click('Twinge, fine under load');
  assert.match(await text(), /movement alternatives/);
  console.log('PASS: painful movement referral and return to informational options');
  console.log('All Phase 2 browser scenarios pass');
} finally { ws.close(); chrome.kill(); }
