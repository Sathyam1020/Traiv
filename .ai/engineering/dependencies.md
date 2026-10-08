# Adding a dependency

**Mandatory. No exceptions. This applies to every package, including small ones, and
including anything an agent thinks is "standard".**

## The process

**1. Justify it in writing.** What problem, why the platform/stdlib can't do it, what it
costs in bundle size and maintenance. If the answer is "it's convenient", stop.

**2. Install the latest stable version.** Not a version from memory — check the registry:

```bash
npm view <package> version
npm view <package> time.modified
```

A package whose last publish is over a year old needs a specific reason.

**3. Read the current documentation before writing any code against it.**
Not training-data recall. Fetch the actual docs. APIs change, and the version you just
installed is probably newer than anything an agent remembers. This step is not optional
and not something to do "if stuck".

**4. Record it** in the table below, with the reason.

Steps 2 and 3 happen **before** the package is added to `package.json`. Not after.

## Rejection criteria

- Wraps something the platform already does (date formatting, fetch, uuid on modern Node)
- Pulled in for one function — copy the function instead, with attribution
- Unmaintained, or a single maintainer with no releases in 12+ months
- Drags in a large transitive tree for a small benefit
- A second library doing a job an existing dependency already does

## Versions live in the pnpm catalog

All versions are declared once in `pnpm-workspace.yaml` under `catalog:`. A package's
`package.json` references `"catalog:"` — **never a literal version string**. One place to
look, one place to upgrade.

Adding a catalog entry means the process above was completed first.

## Current dependencies

**Installed** — docs read, verified working:

| Package | Version | Where | Purpose |
|---|---|---|---|
| turbo | 2.10.12 | root | task runner |
| typescript | 7.0.2 | root | types |
| @biomejs/biome | 2.5.13 | root | lint + format |
| drizzle-orm | 0.45.2 | db | ORM |
| drizzle-kit | 0.31.10 | db | migrations |
| pg | 8.23.0 | db | Postgres driver |
| uuid | 14.0.2 | db | UUIDv7 |
| express | 5.2.1 | api | HTTP |
| zod | 4.6.2 | api | boundary validation |
| tsx | 4.23.13 | api | TS execution |
| dotenv | 17.4.2 | api, db | env loading |
| next | 16.3.4 | trainer | framework |
| react / react-dom | 19.3.0 | trainer | — |
| tailwindcss + @tailwindcss/postcss | 4.3.3 | trainer | styling |
| motion | 13.2.0 | trainer | animation |
| sonner | 2.0.8 | ui | toasts |
| @tanstack/react-query | 5.102.8 | trainer | server state |
| cn | 0.2.6 | trainer | shadcn class merge |
| radix-ui | 1.6.7 | trainer | shadcn primitives |
| class-variance-authority | 0.7.1 | trainer | shadcn variants |
| lucide-react | 1.44.0 | trainer | icons |
| vitest | 5.0.0 | api | scenario tests |
| libphonenumber-js | 1.13.14 | phone | phone validation, every country |
| tw-animate-css | 1.4.0 | ui | the `animate-in` utilities every shadcn component already uses |
| react-markdown | 10.1.0 | web | rendering blog posts written in the admin app |
| remark-gfm | 4.0.1 | web | tables, strikethrough and task lists in those posts |

**Not installed yet:** Serwist (client PWA), AWS SDK (SES), Razorpay SDK, Playwright.

## Things the docs corrected that memory would have got wrong

Kept as evidence that step 3 is not optional:

- **Biome** — ignore patterns dropped the trailing `/**` in 2.2.0; `linter.rules.recommended`
  is deprecated in favour of `preset`.
- **Turborepo 2** — `tasks`, not `pipeline`.
- **Neon** — a long-running server should use `pg` with a pooled connection, **not**
  `@neondatabase/serverless`. Drizzle's quickstart recommends the serverless driver because
  it assumes a serverless target; its HTTP transport is non-interactive and would break the
  outbox pattern.
- **Motion** — `framer-motion` is superseded by `motion`, imported from `motion/react`.
- **Sonner** — added via `shadcn add sonner`, which is what shadcn's CLI directs you to:
  its own `toast` component is Base UI only and this project is Radix. The generated
  component reads the theme from `next-themes`, which we do not use — the theme is a
  class on the root element driven by a per-app zustand store — so our copy takes `theme`
  as a prop and `next-themes` was removed. Two theme systems disagreeing is worse than
  passing one value down.
- **shadcn** — now ships its own `cn` package and the unified `radix-ui` package. Writing a
  `cn` util by hand creates a duplicate.
- **react-markdown** — picked over `marked` specifically because it does **not** render
  raw HTML and never touches `dangerouslySetInnerHTML`: it parses to React elements, so
  a post body cannot carry a script tag no matter what is typed into the editor. The
  `marked` route would have needed a sanitiser alongside it, and `isomorphic-dompurify`
  pulls in jsdom. v10's default export is `Markdown`, it is a server component by
  default, and `urlTransform` already restricts link protocols.
- **tw-animate-css** — shadcn components are written against `animate-in` / `fade-in-0` /
  `zoom-in-95`, which are **not** Tailwind utilities and were silently doing nothing here
  for months, because an unrecognised class is simply not emitted rather than reported.
  It is the Tailwind 4 replacement for `tailwindcss-animate`, a pure CSS file with no
  plugin and no JS: one `@import "tw-animate-css"` in `globals.css` is the whole install.
- **Node** — native type-stripping does not resolve `.js` specifiers back to `.ts`.
- **libphonenumber-js** — three metadata sets, not one, and the default import is the
  largest. `/max` adds number *type* detection we do not need; `/min` cannot tell a mobile
  from a landline. We import `/mobile`, which can — a landline passes a naive check and
  then can never receive the code, so the account is unreachable the moment it is created.
  Also: `parsePhoneNumberWithError` throws for a malformed number and *returns* for a
  well-formed invalid one, so both paths have to be handled; and `getExampleNumber` needs
  its examples file passed in (`libphonenumber-js/mobile/examples`) rather than reading it
  from the metadata.

**Version traps — current docs are mandatory for all four:**
- **TypeScript 7** is the native-Go compiler rewrite
- **Tailwind 4** has a different config model to v3
- **Express 5** changed async error propagation and path matching
- **Vitest 5** — verify the config shape before writing the first test

Prior knowledge of the previous major of any of these does not apply.
