# Frontend

## Stack (proposed — see dependencies.md)

Next.js 16, React 19, Tailwind 4, shadcn/ui, TanStack Query.
**Tailwind 4's config model differs from v3 — read its current docs before setup.**

## Per-app rendering

| App | Mode | Why |
|---|---|---|
| `web` | static / SSG | marketing, needs SEO |
| `trainer` | SSR | authenticated, data-heavy, SEO irrelevant but SSR is useful |
| `client` | static export + Serwist | offline-first, no SEO, no cold starts |
| `endorse`, `admin` | static export | authenticated, low traffic, near-zero hosting cost |

## Client PWA — non-negotiables

1. **Local write first.** Every logged set goes to IndexedDB synchronously, then syncs.
   The UI never awaits the network before showing a set as recorded.
2. **Precache the current plan's exercise videos** on wifi — about 40 clips, WebM loops.
3. **Budget the bundle.** Target first load under 200KB gzipped. Test on a real budget
   Android, not DevTools throttling.
4. **Service worker: Serwist** (`@serwist/next`). `next-pwa` is unmaintained and predates
   the App Router — do not use it.
5. **iOS push is unreliable.** By design, WhatsApp is the notification channel.

## File layout

```
src/
  app/
    <route>/
      page.tsx
      layout.tsx
      _components/     used ONLY by this route
      _lib/            data and helpers used only by this route
  components/
    common/            used by three or more places — avatar, otp input, week strip
    auth/              shared by /signin and /signup
    layout/            app shell — header, nav, switcher, theme toggle
  lib/
    api/               axios client + one module per resource
    query/             TanStack Query hooks + the key factory
    stores/            Zustand store factories and providers
```

**A component used by one route lives in that route's `_components`.** The leading
underscore keeps Next from treating the folder as a route. The rule is simply: opening a
route folder should show everything that route owns, so "where is this used?" never needs
a repo-wide search.

Promote to `components/` only when a second route needs it. Two routes sharing something
is the bar — not one route and a hypothetical future one.

**Keep view components thin.** Multi-step flows put their state machine in a hook next to
the components (`use-auth-flow.ts`), so the views render and the logic is testable and
readable on its own.

## Data fetching

**Axios, wrapped once** in `lib/api/client.ts` — `withCredentials` for the session cookie,
plus a response interceptor that turns every failure into a single `ApiError { status,
code, message }`. Callers never touch axios internals or check whether `.response` exists.

**One module per resource** under `lib/api/` (`auth.ts`, `studios.ts`), each exporting
typed functions. Components never call `http` directly.

## State

- **Server state → TanStack Query.** Never in a global store. Hooks live in `lib/query/`,
  one file per resource. **Every cache key comes from `lib/query/keys.ts`** — inline keys
  drift, two components end up asking for the same data under different keys, and one
  invalidation silently misses the other.
- **The QueryClient is created per mount, not at module level.** A module-level client on
  the server is shared across concurrent requests and leaks one user's cache into
  another's response.
- **Global UI state → Zustand**, as a *store factory* plus a context provider — never a
  module-level store, for the same request-sharing reason. `lib/stores/`.
- **URL state → the URL.** Filters, tabs, selected client. Deep-linkable and back-button safe.
- **Local UI state → `useState`.**
- **Offline queue → IndexedDB**, with its own sync layer.

## Styling

Tailwind, with the theme built **from the design tokens**. Arbitrary values
(`w-[437px]`, `text-[#333]`) are a review failure — they're how the token system gets
bypassed. If no utility fits, the token scale is missing something: raise it.

## Accessibility

Keyboard reachable, visible `:focus-visible`, labels bound to inputs, icon-only buttons
have accessible names, errors tied with `aria-describedby`, dialogs trap focus and restore
it on close. Not a later pass — part of done.
