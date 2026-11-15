// Usage: node keyboard.mjs <url> [maxTabs=80]
// Tabs through a page in real Chrome. For each stop: what has focus, and whether focus is
// visibly indicated (outline or box-shadow differs from the unfocused state).
// Then drives the first segmented control with arrow keys and the main form with Enter.
import { spawn } from "node:child_process";

const [url, maxTabs = "80"] = process.argv.slice(2);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9444;
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TMPDIR}/kb-prof`,
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

await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.enable");
await send("Page.navigate", { url });
await sleep(4000);

const PROBE = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
  const name = (el.getAttribute('aria-label') || (el.labels && el.labels[0] && el.labels[0].innerText) || el.innerText || el.value || el.placeholder || '').trim().replace(/\\s+/g,' ').slice(0,60);
  const r = el.getBoundingClientRect();
  return { tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || '', name, visible, inView: r.width > 0 && r.height > 0 };
})()`;

const stops = [];
for (let i = 0; i < +maxTabs; i++) {
  await key("Tab", "Tab", 9);
  await sleep(60);
  const s = await evaluate(PROBE);
  if (!s) continue;
  stops.push(s);
}
const noRing = stops.filter((s) => !s.visible);
const unnamed = stops.filter((s) => !s.name);
console.log(`${stops.length} tab stops`);
for (const [i, s] of stops.entries()) console.log(`${String(i + 1).padStart(3)} ${s.visible ? "ring" : "NO-RING"} ${s.tag}${s.role ? `[${s.role}]` : ""}  ${s.name}`);
console.log(`\nwithout visible focus: ${noRing.length}; without accessible name: ${unnamed.length}`);

// Arrow keys inside the first toggle group, then Enter/Space on it.
const arrow = await evaluate(`(() => {
  const g = document.querySelector('[role="group"] button, [role="radiogroup"] button');
  if (!g) return 'no segmented control';
  g.focus();
  return 'focused: ' + g.innerText;
})()`);
await key("ArrowRight", "ArrowRight", 39);
await sleep(80);
const afterArrow = await evaluate(`document.activeElement && document.activeElement.innerText`);
await key(" ", "Space", 32);
await sleep(200);
const pressed = await evaluate(`document.activeElement && (document.activeElement.getAttribute('data-state') || document.activeElement.getAttribute('aria-pressed') || document.activeElement.getAttribute('aria-checked'))`);
console.log(`segmented: ${arrow} → ArrowRight → ${afterArrow} → Space → state ${pressed}`);

ws.close();
chrome.kill();
