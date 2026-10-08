# 0021 — Our own analytics, our own launch list, our own CMS
2026-10-08 · Status: accepted · Supersedes the "toast and hope" CTA on the marketing site

## Context

The marketing site shipped with three gaps, and each one had an obvious third-party
answer that we are not taking.

1. **Every call to action raised a toast saying "not open yet".** That wastes the only
   moment a visitor has decided they want this — the moment they press the button. We
   had nothing to catch them with, so a hundred interested coaches a week would have
   left no trace at all.
2. **No analytics.** The default answer is PostHog or GA. Both mean handing every
   visitor to a third party, a consent banner under the DPDP Act, and a dashboard we
   cannot join against our own tables — "did the coaches who read the Trainerize
   comparison sign up?" is a question that needs one database, not two products.
3. **No blog, and no way to write one without a deploy.** MDX in the repo means every
   typo is a commit, a review and a release, and nobody outside this repo can ever
   publish. Content that needs an engineer stops being written around week three.

## Decisions

### The launch list replaces the toast

Every button on `apps/web` opens one dialog asking for an email, a phone number, or
both, plus an explicit "tell me when it opens" checkbox. One component — `NotifyMe` —
so the day signup opens it becomes a link in one place rather than a search for every
control that should have changed.

`waitlist` is its own table, deliberately **not** a `user` row. Nobody on it has an
account, has verified anything, or has agreed to our terms. Putting them in `user` would
make every count, every auth query and every export learn the difference between a coach
and a stranger who typed an email once.

The consent flag is real. Under the DPDP Act that checkbox *is* the lawful basis for
writing to anybody, so it is stored as given, with the page it was given on — and the
admin app's CSV export can only ever contain the people who ticked it. An export button
that hands over everybody is how a consent checkbox becomes decorative.

### Analytics with no identifier on anybody's device

No cookie, no `localStorage`, no device id. A visitor is
`sha256(salt-of-the-day + ip + user-agent)`, truncated — the IP is never written down
and the salt is deleted the following day, which is what makes yesterday's hashes
permanently unreadable rather than merely inconvenient.

What that costs: **returning visitors is not a question this data can answer.** The same
person is a different id tomorrow, so daily uniques are exact and nothing is comparable
across days as the same people. That is a real loss.

What it buys: nothing is stored on a visitor's device, so the site needs no consent
banner at all, and there is no row anywhere that identifies a person who merely read a
pricing page. For a site whose whole argument is that we do not take things that are not
ours, a tracking cookie would have been the first contradiction on it.

This is the Plausible/Fathom design. It is not novel and that is the point.

**Raw rows, aggregated on read.** No rollup tables. At the volume a marketing site
produces, `count(*) group by day` over an indexed column answers in milliseconds, and a
rollup is a second copy of the truth that disagrees with the first the day a backfill
goes wrong. When the table gets big enough to hurt, the fix is to delete old rows, not
to summarise them.

The bot filter runs **at the door**, in the collect handler, rather than as a `where`
clause in nine dashboard queries. Bots are most of the traffic to a public site and none
of the signal; filtering them per-query is nine chances to forget.

### Posts are rows, written in the admin app

`post` holds Markdown, and the public site renders it with `react-markdown` —
specifically chosen because it never produces an HTML string and never touches
`dangerouslySetInnerHTML`. A post body cannot carry a script tag whatever is typed into
the editor. The `marked` route would have needed a sanitiser beside it, and the usual
sanitiser drags jsdom into the bundle.

The editor is a plain Markdown textarea rather than a rich-text surface, because a
WYSIWYG produces HTML and the renderer deliberately refuses HTML. An editor that can
produce something the renderer discards is a trap for whoever uses it.

Publishing is a database write. `/blog` and `/blog/[slug]` stay statically rendered with
`revalidate = 60`, so a post reaches the public site within a minute with no build and
no deploy — which is the entire reason posts are rows.

`dynamicParams` stays on. Without it a post published after the last deploy would 404
until somebody redeployed, defeating the point.

**One writing section, not two.** The site briefly had `/guides` (three long pieces, in
the repo) alongside `/blog` (the database). That is one thing with two names: a reader
cannot tell which holds what, the author has to decide every time, and the search
authority splits across two sections for no gain. The guides are now ordinary posts,
seeded once by `seed:posts`; `/guides/*` redirects permanently. The templates pack moved
to `/tools/templates`, because a list of messages to copy is a resource, not an article —
that distinction is real where guides-versus-blog was not.

## Consequences

- Three new tables (`waitlist`, `analytics_event`, `post`) plus `analytics_salt`, in
  migration 0015.
- Three unauthenticated write routes — the only ones in the system. Each is validated at
  the boundary and each is tested, including the cases that would actually hurt: one
  person becoming two launch-list rows, a second submission wiping the phone number from
  the first, a draft readable by slug, and a query string carrying an email address into
  the analytics table.
- `/m/collect` answers 204 to a body it cannot parse. It is called from a page the
  visitor is often leaving, so there is nobody to show an error to, and a 400 only
  teaches a scraper what shape to send next.
- The admin app grew from one screen to four, so it moved from `TopBar` to `AppShell` —
  which ADR 0020 already said is the line.
- The salt table must be reachable from every API process. It is a table rather than an
  env var precisely so that two processes cannot disagree about who a visitor is.

## What would change this

If the launch list ever needs to send the announcement it promises, that is a mailer and
a job, not a loop in a route handler. The `notifiedAt` column is there so nobody is told
twice when it happens.

If analytics volume outgrows one table, delete old rows. Reach for a rollup only when a
dashboard query is measurably slow with the deletion policy already in place.
