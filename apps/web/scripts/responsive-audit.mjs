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
  "/tools/one-rep-max-calculator",
  "/tools/bench-press-calculator",
  "/tools/squat-calculator",
  "/tools/deadlift-calculator",
  "/tools/overhead-press-calculator",
  "/tools/wilks-calculator",
  "/tools/dots-calculator",
  "/tools/wilks-dots-calculator",
  "/tools/ipf-gl-points-calculator",
  "/tools/sinclair-calculator",
  "/tools/rpe-calculator",
  "/tools/rir-calculator",
  "/tools/tempo-calculator",
  "/tools/warm-up-set-calculator",
  "/tools/plate-loading-calculator",
  "/tools/strength-standards-calculator",
  "/tools/weekly-training-volume-calculator",
  "/tools/workout-plan-builder",
  "/tools/injury-exercise-swap",
  "/tools/bmi-calculator",
  "/tools/body-fat-calculator",
  "/tools/navy-body-fat-calculator",
  "/tools/ffmi-calculator",
  "/tools/ideal-weight-calculator",
  "/tools/lean-body-mass-calculator",
  "/tools/muscle-mass-calculator",
  "/tools/waist-to-height-ratio-calculator",
  "/tools/waist-to-hip-ratio-calculator",
  "/tools/weight-loss-percentage-calculator",
  "/tools/body-recomposition-calculator",
  "/tools/heart-rate-zone-calculator",
  "/tools/max-heart-rate-calculator",
  "/tools/zone-2-heart-rate-calculator",
  "/tools/interval-walking-calculator",
  "/tools/beep-test-calculator",
  "/tools/cooper-test-calculator",
  "/tools/vo2-max-calculator",
  "/tools/race-time-predictor",
  "/tools/running-pace-calculator",
  "/tools/rucking-calorie-calculator",
  "/tools/workout-timer",
  "/tools/ad-spend-breakeven-calculator",
  "/tools/assistant-coach-roi-calculator",
  "/tools/client-capacity-calculator",
  "/tools/client-churn-rate-calculator",
  "/tools/client-ltv-calculator",
  "/tools/coaching-package-pricing-calculator",
  "/tools/coaching-profit-calculator",
  "/tools/coaching-revenue-projector",
  "/tools/customer-acquisition-cost-calculator",
  "/tools/discovery-call-calculator",
  "/tools/email-list-value-calculator",
  "/tools/free-trial-conversion-calculator",
  "/tools/group-vs-1on1-coaching-calculator",
  "/tools/no-show-cost-calculator",
  "/tools/price-increase-calculator",
  "/tools/referral-value-calculator",
  "/tools/client-check-in-reader",
  "/tools/client-churn-risk-reader",
  "/tools/coaching-business-health-check",
  "/tools/difficult-client-responder",
  "/tools/lift-progression-reader",
  "/tools/sales-objection-handler",
  "/tools/scope-of-practice-check",
  "/tools/weight-trend-reader",
  "/tools/ai-writing-checker",
  "/tools/client-check-in-builder",
  "/tools/client-onboarding-builder",
  "/tools/coaching-offer-builder",
  "/tools/coaching-prompt-generator",
  "/tools/glp1-client-coaching-planner",
  "/tools/instagram-caption-generator",
  "/tools/instagram-hook-generator",
  "/tools/personal-trainer-bio-generator",
  "/tools/personal-training-business-name-generator",
  "/tools/reel-script-generator",
  "/tools/coaching-platform-cost-calculator",
  "/tools/coaching-tool-stack-cost-calculator",
  "/tools/coaching-platform-fit-finder",

  "/",
  "/pricing",
  "/features",
  "/features/plan-builder",
  "/compare",
  "/compare/trainerize",
  "/tools",
  "/tools/tdee-calculator",
  "/tools/recipe-macro-calculator",
  "/tools/macro-calculator",
  "/tools/calorie-deficit-calculator",
  "/tools/keto-macro-calculator",
  "/tools/bulking-calorie-calculator",
  "/tools/personal-trainer-income-calculator",
  "/tools/coaching-rate-calculator",
  "/tools/templates",
  "/tools/goal-weight-date-calculator",
  "/tools/weight-loss-phase-calculator",
  "/tools/cut-length-calculator",
  "/tools/steps-to-calories-calculator",
  "/tools/calories-burned-calculator",
  "/tools/sweat-rate-calculator",
  "/tools/intermittent-fasting-calculator",
  "/tools/cycle-phase-calculator",
  "/tools/protein-calculator",
  "/tools/fiber-intake-calculator",
  "/tools/creatine-dosage-calculator",
  "/tools/carb-cycling-calculator",
  "/tools/refeed-day-calculator",
  "/tools/reverse-diet-calculator",
  "/tools/calories-per-meal-calculator",
  "/blog",
  "/coaches",
  "/about",
  "/partnership",
  "/affiliate",
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
        if (['auto', 'scroll', 'hidden', 'clip'].includes(o)) { scroller = true; break; }
      }
      // Wide content inside its own horizontal scroller is the sanctioned way to carry
      // a table on a phone; only the page scrolling sideways is a defect.
      if (!scroller) out.overflow.push({ el: describe(el), right: Math.round(r.right) });
    }

    const tappable = el.matches('a[href],button,[role="button"],input:not([type=hidden]),select,textarea,[role="tab"],[role="menuitem"]');
    // A link inside a sentence is exempt — it cannot be 44px tall without wrecking the
    // paragraph, and WCAG 2.5.8 says the same.
    const visuallyHidden = s.clip === 'rect(0px, 0px, 0px, 0px)' || (r.width <= 1 && r.height <= 1);
    const inlineInProse = el.tagName === 'A' && s.display.startsWith('inline') &&
      el.parentElement && /^(P|LI|DD|SPAN|DT)$/.test(el.parentElement.tagName) &&
      el.parentElement.textContent.trim().length > (el.textContent || '').trim().length + 10;
    if (TOUCH && tappable && !inlineInProse && !visuallyHidden && r.height > 0 && (r.height < 44 || r.width < 44)) {
      out.small.push({ el: describe(el), size: Math.round(r.width) + 'x' + Math.round(r.height) });
    }

    const size = parseFloat(s.fontSize);
    if (!el.closest('[role="img"]') && size && size < 11.5 && !el.children.length && (el.textContent || '').trim()) {
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
