# 0020 — One shell for four apps, and the client's tabs
2026-10-07 · Status: accepted · Fills the gap in ui-principles.md §4

## Context

`localhost:3001/dashboard` on a 2000px screen was a 512px column stranded in a black
field. Not a client-app bug — three of four apps:

| App | Widest content | Navigation |
|---|---|---|
| trainer | `max-w-[1280px]` | sidebar ≥ lg, floating bar below |
| client | `max-w-[32rem]` | none |
| endorse | `max-w-[36rem]` | none |
| admin | `max-w-[44rem]` | none |

The trainer had already solved it and the solution was locked inside that app, wired to
its own session hooks. Three teams-of-one later re-solved it badly by not solving it.

The design docs are half the cause. `ui-principles.md` §4 said *"Design at 360px first. A
desktop layout squeezed down is a listed slop pattern"* and stopped. It never said what
happens above 360, so three apps never did anything above 360.

## Decisions

**One shell in `packages/ui/src/components/shell/`.** `AppShell` for apps with real
navigation (trainer, client): fixed sidebar from `lg`, floating capsule bar below, content
padded clear of both. `TopBar` for apps with one screen (endorse, admin) — a sidebar
holding a single link is furniture, and would spend 240px of every screen telling somebody
they are where they already are.

**`lg` is the only breakpoint where navigation changes shape**, and it is written once in
`AppShell` rather than guessed per app, so the sidebar and the bar can never both appear
or both vanish.

**`Page` is the one content measure** — `max-w-[1280px]`, centred. Pages that need
narrower pass it in, and the exceptions are a short list: single-task forms (sign-in, one
intake question) and long-form text, which holds a 65–75 character measure per
`typography.md` §5. Narrow is a decision in those places; everywhere else it was an
oversight.

**Slots, not configuration.** `brand`, `account` and `header` are `ReactNode`. Every app
has its own session and logout hooks, and the coach's sidebar needs a studio switcher the
client's has no concept of. What is genuinely shared lives in the shell; what differs is
passed in. No `variant="trainer"` prop.

**The layout rendering `AppShell` must be a client component.** `NavItem.icon` is a
component reference and functions cannot cross the server→client boundary. A server layout
passing `nav` fails at prerender with *"Functions cannot be passed directly to Client
Components"*, which reads like a bug in the shell and is not — it cost a build to find, so
it is written down in the shell's own doc comment.

### The client's navigation

**Today** and **You**. Two, because two screens exist.

It grows to Today · Plan · Progress · Chat · You as features land. The research in
`.ai/product/competitor-client-apps.md` found every competitor ships the full set and
leaves most of it empty, and that the one doing it well — Trainerize — hides a tab until
the coach has put something in it. Adding one here is a line in `nav-items.ts`.

`You` gives the client their own intake answers back. Until now those went one way: into a
database, for a coach. Somebody who typed their weight and what hurts should be able to
find it, check it and change it — and being able to find it is what makes the health note
trustworthy rather than something that vanished into an app.

**Two naming fixes this forced.** The trainer's nav read "Dashboard", which `voice.md`
bans outright — the entry says *the coach's home is Today*. And `You` is a new product
term, now in the vocabulary table.

## Consequences

The client's Today screen is still light at 1280px, because it holds a greeting and one
coach card and there is genuinely nothing else yet. The shell fixes the *stranded* look —
content sits beside a sidebar in a real layout. Filling the rest with tiles that say
nothing would be the slop `ui-principles.md` already bans. It fills when Plan and Progress
land.

`packages/ui` now takes `next` as a peer dependency. All four consumers are Next apps; the
alternative was passing `Link` and `usePathname` in as props, which is worse.

`Avatar`, `initials` and `ThemeToggle` moved out of the trainer app into `packages/ui`,
where the other three needed them. `ThemeToggle` takes the value as a prop rather than
reading a store, because each app owns its own.

`ui-principles.md` §4 now carries the breakpoint ladder. That omission is what let three
apps ship as phone columns, and it would have let the fourth do the same.
