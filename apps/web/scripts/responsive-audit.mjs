/**
 * Check every page at a real viewport width, in a real browser.
 *
 * `CLAUDE.md` asks for 360px "tested at that width — not assumed", and reading class
 * names is assuming. This drives headless Chrome over the DevTools protocol and reports
 * the three things that are invisible until somebody holds a phone:
 *
 *   - anything that makes the page scroll sideways
 *   - tap targets under 44px, which is `ui-principles.md` §4
 *   - text under 11.5px
 *
 * No dependency: Chrome is already on the machine and Node has had a global `WebSocket`
 * since 22. Touch emulation is switched on below 1024 — without it the page matches
 * `pointer: fine`, every touch-only rule is absent, and the audit measures a layout no
 * phone ever sees.
 *
 *   pnpm --filter @traiv/web audit:responsive                 # 360px, every route
 *   pnpm --filter @traiv/web audit:responsive 320 768 1280    # specific widths
 */
import { spawn } from "node:child_process";

const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9412;
const BASE = process.env.WEB_ORIGIN ?? "http://localhost:3004";

/** Every route the site has. A page missing from here is a page nobody is checking. */
const ROUTES = [
  "/",
  "/pricing",
  "/features",
  "/features/plan-builder",
  "/compare",
  "/compare/trainerize",
  "/tools",
  "/tools/calorie-calculator",
  "/tools/income-calculator",
  "/tools/pricing-calculator",
  "/tools/templates",
  "/blog",
  "/coaches",
  "/about",
  "/partnership",
  "/affiliate",
  "/demo",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refund",
  "/this-route-does-not-exist",
];

const widths = process.argv.slice(2).map(Number).filter(Boolean);
const WIDTHS = widths.length ? widths : [360];

const probe = (touch) => `(() => {
  const TOUCH = ${touch};
  const vw = document.documentElement.clientWidth;
  const out = { vw, scrollW: document.documentElement.scrollWidth, overflow: [], small: [], tiny: [] };
  const describe = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '';
    const txt = (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 36);
    return el.tagName.toLowerCase() + cls + (txt ? ' « ' + txt + ' »' : '');
  };
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') continue;
    // A decorative mock is a picture of a UI. Nothing in it is read or tapped.
    if (el.closest('[aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;

    if (r.right > vw + 1) {
      let scroller = false;
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'auto' || o === 'scroll') { scroller = true; break; }
      }
      // Wide content inside its own horizontal scroller is the sanctioned way to carry
      // a table on a phone; only the page scrolling sideways is a defect.
      if (!scroller) out.overflow.push({ el: describe(el), right: Math.round(r.right) });
    }

    const tappable = el.matches('a[href],button,[role="button"],input:not([type=hidden]),select,textarea,[role="tab"],[role="menuitem"]');
    // A link inside a sentence is exempt — it cannot be 44px tall without wrecking the
    // paragraph, and WCAG 2.5.8 says the same.
    const inlineInProse = el.tagName === 'A' && s.display.startsWith('inline') &&
      el.parentElement && /^(P|LI|DD|SPAN|DT)$/.test(el.parentElement.tagName) &&
      el.parentElement.textContent.trim().length > (el.textContent || '').trim().length + 10;
    if (TOUCH && tappable && !inlineInProse && r.height > 0 && (r.height < 44 || r.width < 44)) {
      out.small.push({ el: describe(el), size: Math.round(r.width) + 'x' + Math.round(r.height) });
    }

    const size = parseFloat(s.fontSize);
    if (size && size < 11.5 && !el.children.length && (el.textContent || '').trim()) {
      out.tiny.push({ el: describe(el), size });
    }
  }
  const dedupe = (a) => [...new Map(a.map((x) => [x.el, x])).values()].slice(0, 10);
  return { ...out, overflow: dedupe(out.overflow), small: dedupe(out.small), tiny: dedupe(out.tiny) };
})()`;

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/traiv-responsive-audit",
  "about:blank",
]);

async function target() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {
      // Chrome is still starting.
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(
    `Chrome never opened a debugging port. Set CHROME_PATH if it is not at ${CHROME}.`,
  );
}

const page = await target();
const ws = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let id = 0;
const send = (method, params = {}) => {
  const msgId = ++id;
  ws.send(JSON.stringify({ id: msgId, method, params }));
  return new Promise((res, rej) => pending.set(msgId, { res, rej }));
};
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  const p = m.id && pending.get(m.id);
  if (!p) return;
  pending.delete(m.id);
  m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result);
});
await new Promise((r) => ws.addEventListener("open", r));
await send("Page.enable");
await send("Runtime.enable");

let failed = 0;
for (const width of WIDTHS) {
  const touch = width < 1024;
  console.warn(`\n── ${width}px ${touch ? "(touch)" : "(mouse)"} ──`);
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 820,
    deviceScaleFactor: 2,
    mobile: touch,
  });
  await send("Emulation.setTouchEmulationEnabled", {
    enabled: touch,
    maxTouchPoints: touch ? 5 : 1,
  });

  for (const route of ROUTES) {
    await send("Page.navigate", { url: BASE + route });
    await new Promise((r) => setTimeout(r, 1200));
    const { result } = await send("Runtime.evaluate", {
      expression: probe(touch),
      returnByValue: true,
    });
    const r = result.value;
    const problems = [
      ...(r.scrollW > r.vw + 1 ? [`page scrolls sideways (${r.scrollW} > ${r.vw})`] : []),
      ...r.overflow.map((o) => `overflows to ${o.right}px  ${o.el}`),
      ...r.small.map((s) => `tap target ${s.size}  ${s.el}`),
      ...r.tiny.map((t) => `text ${t.size}px  ${t.el}`),
    ];
    if (problems.length) {
      failed++;
      console.warn(`✗ ${route}`);
      for (const p of problems) console.warn(`    ${p}`);
    } else {
      console.warn(`✓ ${route}`);
    }
  }
}

console.warn(`\n${failed === 0 ? "clean" : `${failed} page/width combinations need work`}`);
chrome.kill();
process.exit(failed === 0 ? 0 : 1);
