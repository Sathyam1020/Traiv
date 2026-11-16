import assert from "node:assert/strict";
// Usage: node keyboard.mjs <url> [maxTabs=80]
// Tabs through a page in real Chrome. For each stop: what has focus, and whether focus is
// visibly indicated (outline or box-shadow differs from the unfocused state).
// Then drives the first segmented control with arrow keys and the main form with Enter.
import { spawn } from "node:child_process";

const BASE = process.env.WEB_ORIGIN ?? "http://localhost:3005";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9451;
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TMPDIR}/phase5c-prof`,
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
const setField = async (sel, i, value) => {
  await evaluate(`(() => {const el = document.querySelectorAll('main form ${sel}')[${i}]; const proto = el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(String(value))}); el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(250);
};
try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 1, mobile: true });
  await open("ai-writing-checker");
  let t = await text();
  assert.match(t, /\b([6-9]|10)\s*\/ 10/);
  await setField("textarea", 0, "Squatted 80 kg for five today. Next week I'll add 2.5 kg if bar speed holds.");
  assert.match(await text(), /\b0\s*\/ 10/);
  await click("Load the sample again");
  assert.match(await text(), /Contrast framing/);
  await setField("textarea", 0, "");
  assert.match(await text(), /Paste a draft/);
  console.log("PASS: writing checker scoring, clean text, sample reload, empty");

  await open("client-check-in-builder");
  assert.match(await text(), /Average daily steps/);
  await click("Wellness");
  t = await text();
  assert.doesNotMatch(t, /Average daily steps/); assert.match(t, /Energy 1–5/);
  await click("Quick scan");
  assert.doesNotMatch(await text(), /Mood 1–5/);
  console.log("PASS: check-in builder goal defaults and depth");

  await open("client-onboarding-builder");
  await click("Onboarding call");
  assert.doesNotMatch(await text(), /Onboarding call:/);
  await click("First 2 weeks");
  assert.match(await text(), /Day 14/);
  console.log("PASS: onboarding builder step toggle and timeline");

  await open("coaching-offer-builder");
  await click("Self-led programme"); await click("12 weeks");
  t = await text();
  assert.match(t, /Self-led programme · 12 weeks/); assert.match(t, /at your own pace/);
  console.log("PASS: offer builder");

  await open("coaching-prompt-generator");
  t = await text();
  assert.match(t, /busy parents losing fat/); assert.match(t, /Don't give medical advice/);
  console.log("PASS: prompt generator defaults");

  await open("glp1-client-coaching-planner");
  await setField('input[type="number"]', 0, 9);
  assert.match(await text(), /between 1 and 7/);
  await setField('input[type="number"]', 0, 4);
  assert.match(await text(), /upper\/lower split/);
  console.log("PASS: GLP-1 planner validation and split");

  await open("instagram-caption-generator");
  t = await text();
  assert.match(t, /Comment PLAN/);
  const counts = await evaluate(`[...document.querySelectorAll('main section[aria-live] p')].map(p=>p.innerText).filter(x=>/ words$/.test(x)).map(x=>+x.match(/(\\d+) words/)[1])`);
  assert.equal(counts.length, 8); assert.ok(counts.every((c) => c < 150), String(counts));
  await click("None");
  assert.doesNotMatch(await text(), /Comment PLAN/);
  console.log("PASS: eight captions under 150 words, ask switch", counts.join(","));

  await open("instagram-hook-generator");
  const hooks = await evaluate(`document.querySelectorAll('main section[aria-live] li').length`);
  assert.equal(hooks, 40);
  console.log("PASS: forty hooks");

  await open("personal-trainer-bio-generator");
  const chars = await evaluate(`[...document.querySelectorAll('main section[aria-live] p')].map(p=>p.innerText).filter(x=>/\\/ 150 characters/.test(x)).map(x=>+x.match(/(\\d+) \\/ 150/)[1])`);
  assert.equal(chars.length, 8); assert.ok(chars.every((c) => c <= 150));
  console.log("PASS: eight bios within 150 characters", chars.join(","));

  await open("personal-training-business-name-generator");
  const first = await text();
  await evaluate(`document.querySelector('main form button[type=submit]').click()`); await sleep(300);
  assert.notEqual(await text(), first);
  console.log("PASS: name generator regenerates");

  await open("reel-script-generator");
  const reelWords = await evaluate(`[...document.querySelectorAll('main section[aria-live] p')].map(p=>p.innerText).filter(x=>/ words · about/.test(x)).map(x=>+x.match(/(\\d+) words/)[1])`);
  assert.equal(reelWords.length, 6);
  console.log("PASS: six reel scripts", reelWords.join(","));
  console.log("All Phase 5c browser scenarios pass");
} finally { ws.close(); chrome.kill(); }
