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
| @zxing/browser | 0.2.1 | client, lazy camera chunk | cross-browser 1D barcode decoding |
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
| @hugeicons/react | 1.1.10 | ui | icon renderer — replaced lucide-react (ADR 0022) |
| @hugeicons/core-free-icons | 4.3.5 | ui | Stroke Rounded icon data, MIT |
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
- **`cn` has to be told about our type scale, or it eats text colours.** `cn` resolves
  conflicts by sorting classes into groups, and it only knows Tailwind's own scales.
  `text-sm` is obviously a font size; `text-body-sm` is not obviously anything, so it is
  filed under *text colour* — and the merge then discards the real colour beside it:

  ```
  cn("bg-primary text-primary-foreground", "text-body-sm")  →  "bg-primary text-body-sm"
  ```

  Which is how every primary button that took a `text-body-sm` className rendered as a
  black rectangle with black text on it. Nothing errored; one class was silently dropped.
  The same thing happens to **every custom scale**, not just type: `rounded-control` was
  not recognised as a radius either, so it could not replace the `rounded-sm` a shadcn
  component had already set — both survived and stylesheet order decided, which is why
  some menu items were pill-shaped on hover and others were not.

  `packages/ui/src/lib/cn.ts` now names all four custom scales (`--text-*`, `--radius-*`,
  `--font-display`, `--ease-*`) via `createCn` from `cn/config`, and **every component
  imports from `@traiv/ui/lib/cn`, never from `"cn"`** — `components.json` points
  shadcn's generator at the same path so new components land correct. **Add a token to
  `@theme` in `globals.css` and you must add it there too**, or the first component to
  use it alongside a built-in utility of the same kind silently keeps both.
- **Radix `asChild` merges `className` by joining strings, not through `cn`.** So a class
  written on the child sits next to the component's own and the winner is whatever the
  stylesheet happens to order last. That is why some nav items rounded fully on hover and
  others did not. Put the className on the Radix component, which runs it through `cn`,
  and leave the child bare.
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

  Two traps, both of which cost an hour:

  **It must be declared by every app, not only by `packages/ui`.** The `@import` lives in
  `packages/ui/src/styles/globals.css`, but it is resolved by `@tailwindcss/postcss`
  running under each *app's* `postcss.config.mjs`, and which directory that resolver
  treats as its root is not something to rely on. Declaring it once in `packages/ui` made
  it resolve in one app and fail in the next with
  `Can't resolve 'tw-animate-css'`. It is now a devDependency of `packages/ui` **and** of
  all five apps. Any new app that imports `globals.css` needs the same line.

  **A failed CSS resolution is cached by the Turbopack dev server.** After adding a
  package that `globals.css` imports, `next dev` keeps failing until `apps/<app>/.next`
  is deleted — a restart alone is not enough, and the error names the real file so it
  reads like a genuine missing dependency rather than a stale cache. `next build` is
  unaffected, which is the tell: if the production build is clean and dev is not, delete
  `.next`.
- **Drizzle** — a column interpolated into a `sql` template renders **unqualified**.
  `sql`... where ts.client_id = ${schema.clients.id}`` emits a bare `"id"`, which inside
  a correlated subquery resolves to the *inner* table's `id`. The query typechecks, runs,
  and returns null for every row — while the same fragment used inside `count(*) filter
  (...)` in the outer query is correct, so the counts agree with reality and the rows do
  not. Write the outer column out: `sql.raw('"client"."id"')`.
- **Node** — native type-stripping does not resolve `.js` specifiers back to `.ts`.
- **libphonenumber-js** — three metadata sets, not one, and the default import is the
  largest. `/max` adds number *type* detection we do not need; `/min` cannot tell a mobile
  from a landline. We import `/mobile`, which can — a landline passes a naive check and
  then can never receive the code, so the account is unreachable the moment it is created.
  Also: `parsePhoneNumberWithError` throws for a malformed number and *returns* for a
  well-formed invalid one, so both paths have to be handled; and `getExampleNumber` needs
  its examples file passed in (`libphonenumber-js/mobile/examples`) rather than reading it
  from the metadata.

- **pnpm 11 fails an install over an unapproved build script, and a warm `node_modules`
  hides it.** `strictDepBuilds` defaults to true, so a dependency with a postinstall
  script that nobody has said yes to exits non-zero rather than warning. pnpm writes the
  entry for you with a literal `set this to true or false` placeholder — which is a
  string, not a boolean, so the package stays unapproved. Locally every install was
  "Already up to date", no script ran, and nothing failed; the first cold install (a
  Vercel deploy) died with `ERR_PNPM_IGNORED_BUILDS: esbuild`.

  The current key is `allowBuilds: { esbuild: true }`. `onlyBuiltDependencies`,
  `neverBuiltDependencies` and `ignoredBuiltDependencies` are the deprecated spellings;
  we had both, which is two places to disagree. To reproduce CI behaviour before
  pushing: clone to a temp directory and `CI=1 pnpm install --frozen-lockfile`. A warm
  tree will not tell you.

- **Hugeicons** — justified because the founder asked for Featurebase's icon style and
  Featurebase draws from Hugeicons; it replaces lucide-react rather than sitting beside it.
  The free package is **Stroke Rounded only**. Featurebase's look (a 40% fill under the
  stroke) is the Duotone Rounded style, which is Pro and needs a licence and a private
  registry. `@hugeicons/react` is only a renderer: `<HugeiconsIcon icon={...} />` takes icon
  *data* arrays from a separate package, so there is no `<Tick02Icon />` component to
  import. Its default `strokeWidth` is 1.5 against lucide's 2, which is what makes the set
  read lighter. The data package's root re-exports ~12,000 icons; every icon has its own
  subpath export (`@hugeicons/core-free-icons/Tick02Icon`), and `packages/ui/src/icons.tsx`
  imports only those, so a cold dev server never reads the whole set. Only `packages/ui`
  depends on it — apps import from `@traiv/ui/icons`.

**Version traps — current docs are mandatory for all four:**
- **TypeScript 7** is the native-Go compiler rewrite
- **Tailwind 4** has a different config model to v3
- **Express 5** changed async error propagation and path matching
- **Vitest 5** — verify the config shape before writing the first test

Prior knowledge of the previous major of any of these does not apply.

## Client nutrition scanner — 2026-10-31

`@zxing/browser` **0.2.1** (latest stable checked against npm; registry metadata modified
2026-07-06) is added to the central catalog and used only in the client barcode scanner.
The browser platform alone does not supply reliable 1D barcode decoding across Safari
and Chrome. The package's official README and installed browser-reader declarations
were read before use. It is imported dynamically when the camera opens, keeping decoder
code out of the initial diary bundle. Cost: a barcode decoder chunk and its existing
ZXing library dependency; no new server dependency or camera framework. Camera streams
are explicitly stopped on selection and unmount. Manual barcode entry needs no decoder.

Official reference: https://github.com/zxing-js/browser#readme
