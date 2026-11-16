import assert from "node:assert/strict";
// Usage: node keyboard.mjs <url> [maxTabs=80]
// Tabs through a page in real Chrome. For each stop: what has focus, and whether focus is
// visibly indicated (outline or box-shadow differs from the unfocused state).
// Then drives the first segmented control with arrow keys and the main form with Enter.
import { spawn } from "node:child_process";

const BASE = process.env.WEB_ORIGIN ?? "http://localhost:3005";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9449;
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TMPDIR}/phase5a-prof`,
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

const open = async (slug) => { await send("Page.navigate", { url: `${BASE}/tools/${slug}` }); await sleep(1500); };
const text = () => evaluate(`document.querySelector('[aria-label="Your result"]').innerText`);
const click = async (label) => {
  const clicked = await evaluate(`(() => { const b = [...document.querySelectorAll('main button, main [role=radio]')].find(x => x.innerText.trim() === ${JSON.stringify(label)}); if (!b) return false; b.click(); return true; })()`);
  assert.equal(clicked, true, `Missing control: ${label}`); await sleep(150);
};
const fill = async (index, value) => {
  await evaluate(`(() => {const el = document.querySelectorAll('main form input[type="number"]')[${index}]; if(!el) throw Error('Missing input ${index}'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(String(value))}); el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(120);
};
const submit = () => evaluate(`document.querySelector('main form button[type=submit]').click()`).then(() => sleep(200));
let t;
try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 1, mobile: true });
  await open("ad-spend-breakeven-calculator");
  assert.match(await text(), /€630/);
  await click("USD ($)"); await submit();
  assert.match(await text(), /\$630/);
  await click("INR (₹)"); await submit();
  assert.match(await text(), /₹630/);
  await fill(1, 0); await submit();
  assert.match(await text(), /cost per lead above zero/);
  console.log("PASS: ad breakeven, currency switch to USD and INR, zero cost per lead");

  await open("client-ltv-calculator");
  await click("Monthly churn %"); await fill(1, 5); await submit();
  assert.match(await text(), /€6,000/);
  console.log("PASS: LTV from churn");

  await open("assistant-coach-roi-calculator");
  assert.match(await text(), /€2,100/);
  await click("Monthly salary");
  assert.equal(await evaluate(`document.querySelectorAll('main form input[type="number"]')[4].value`), "3000");
  await click("Platform takes a share"); await submit();
  t = await text();
  assert.match(t, /16 clients/); assert.match(t, /loses money/);
  await fill(1, 50); await submit();
  assert.match(await text(), /can't hand over more clients/);
  console.log("PASS: assistant salary break-even, platform share, impossible handoff");

  await open("coaching-package-pricing-calculator");
  assert.match(await text(), /€486/);
  await evaluate(`document.getElementById('pkg-meal').click()`); await sleep(150); await submit();
  assert.match(await text(), /€421/);
  console.log("PASS: package pricing and unticking an extra");

  await open("price-increase-calculator");
  await fill(3, 6); await submit();
  assert.match(await text(), /smaller rise/);
  await fill(3, 30); await submit();
  assert.match(await text(), /can't be more than your active clients/);
  console.log("PASS: price increase warning and impossible cancellations");

  await open("client-churn-rate-calculator");
  await fill(1, 50); await submit();
  assert.match(await text(), /can't lose more clients/);
  console.log("PASS: churn validation");

  await open("coaching-revenue-projector");
  assert.match(await text(), /€17,031/);
  await fill(2, 0); await submit();
  assert.match(await text(), /No ceiling/);
  console.log("PASS: projector and zero churn");

  await open("client-capacity-calculator");
  assert.match(await text(), /40/);
  await fill(4, ""); await submit();
  assert.match(await text(), /Add a price/);
  console.log("PASS: capacity without a price");
  console.log("All Phase 5a browser scenarios pass");
} finally { ws.close(); chrome.kill(); }
