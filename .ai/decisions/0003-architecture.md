# 0003 — Monorepo, single API, five frontends
2026-09-11 · Status: accepted

## Context
Four audiences — coaches, clients, affiliates, platform admin — plus a marketing site.
One solo developer. The client app has unusual requirements: offline-first, installable,
tiny payload on budget Android, no SEO.

## Decision
pnpm + Turborepo monorepo. One Hono API. Five Next.js frontends on subdomains of
`traiv.app`, which is canonical (`.dev` and `.in` redirect).

The client app is **static-exported** Next.js with Serwist. The others are SSR or SSG.

## Consequences
- One framework across all frontends — one mental model for a solo developer.
- Static export gives the client app an SPA's offline characteristics without a second
  build system, at the cost of no middleware or route handlers in that app (not needed —
  the API is separate).
- Session cookie scoped to `.traiv.app` covers all five apps.
- `*.traiv.app` reserved for per-coach white-label subdomains later.
- Five deploy targets to maintain.

## Amendment — 2026-09-11
Backend framework changed from Hono to **Express 5**, and Postgres host fixed to **Neon**,
both by founder decision. Express is the larger ecosystem and the more familiar model;
Hono's edge-runtime advantages are irrelevant since the API runs on a long-lived Node
process. No CI on day one — added later on request.

## Alternatives
**Vite for the client PWA** — technically the better fit, rejected because a second build
system costs a solo developer more than static-export Next costs.
**Next route handlers instead of a standalone API** — rejected: five frontends plus
WhatsApp and Razorpay webhooks share the backend; coupling a payment webhook to the coach
app's deployment is a mistake.
