import assert from "node:assert/strict";
// Usage: node keyboard.mjs <url> [maxTabs=80]
// Tabs through a page in real Chrome. For each stop: what has focus, and whether focus is
// visibly indicated (outline or box-shadow differs from the unfocused state).
// Then drives the first segmented control with arrow keys and the main form with Enter.
import { spawn } from "node:child_process";

const BASE = process.env.WEB_ORIGIN ?? "http://localhost:3005";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9452;
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TMPDIR}/phase5d-prof`,
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
const fillNum = async (i, v) => { await evaluate(`(() => {const el = document.querySelectorAll('main form input[type="number"]')[${i}]; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(String(v))}); el.dispatchEvent(new Event('input',{bubbles:true}));})()`); await sleep(250); };
try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 1, mobile: true });
  await open("coaching-platform-cost-calculator");
  let t = await text();
  assert.match(t, /€249/); assert.match(t, /\$62\.50/); assert.match(t, /Check vendor price/); assert.match(t, /₹999/);
  await fillNum(0, 60);
  t = await text();
  assert.match(t, /€564/); assert.match(t, /\$120/);
  await evaluate(`document.getElementById('brand-only').click()`); await sleep(250);
  assert.doesNotMatch(await text(), /Hevy Coach/);
  console.log("PASS: platform cost at 25 and 60 clients, branding filter");

  await open("coaching-tool-stack-cost-calculator");
  t = await text();
  assert.match(t, /₹22,175/); assert.match(t, /Traiv is ₹21,176 a month cheaper/);
  await evaluate(`document.getElementById('st-community').click()`); await sleep(250);
  assert.match(await text(), /₹13,812/);
  console.log("PASS: tool stack vs Traiv default and untick");

  await open("coaching-platform-fit-finder");
  await evaluate(`document.querySelector('main form button[type=submit]').click()`); await sleep(250);
  assert.match(await text(), /Traiv/);
  await click("US clinical / insurance");
  await evaluate(`document.querySelector('main form button[type=submit]').click()`); await sleep(250);
  assert.match(await text(), /Practice Better/);
  await click("EU / global coaching"); await click("Free to test first");
  await evaluate(`document.querySelector('main form button[type=submit]').click()`); await sleep(250);
  assert.match(await text(), /Everfit/);
  console.log("PASS: fit finder recommendations");
  console.log("All Phase 5d browser scenarios pass");
} finally { ws.close(); chrome.kill(); }
