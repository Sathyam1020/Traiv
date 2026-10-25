# Check-ins

Modelled on Coachway, from the reconnaissance in `research/coachway/`. Every claim about
their behaviour below is marked **[V]** (observed) or **[I]** (inferred); everything else
is our design decision.

## What a check-in is

**[V]** Coachway's Development tab describes it in their own words:

> Check-in — *"Answers, ratings, weight and photos."*

So a check-in is **not** a workout. It is a **scheduled form submission** carrying metric
values, and it exists whether or not the client fills it in. That last part is the whole
point: a check-in that was never submitted is *missed*, and you cannot have a missed
anything unless something was expected.

**[V]** The overview returns:

```jsonc
checkInTrend: {
  checkIns: [{ status, date }],   // one entry per scheduled occurrence
  completionRate: number,
  currentStreak: number
}
```

**[V]** Account-level defaults that define the schedule:
`defaultCheckInFrequency`, `defaultCheckInPeriod` (observed value **"Week"**),
`defaultCheckInWeekday` (observed **"Monday"**).

**[V]** The client's notification settings carry `pushCheckIns`, separate from
`pushChatMessages` and `pushNewContent`.

**[V]** The UI (from the reference screenshot): a **15-day grid**, legend
**Completed · Missed · Upcoming**, with **Completion rate** and **Current streak**
underneath.

## Why this needs new tables

Traiv's roster currently treats "a completed `training_session`" as a check-in. That can
answer *did they train*, and nothing else. It cannot produce a completion rate, because
nothing records what was due; it cannot produce a streak, because a streak is consecutive
*expected* occurrences met; and "missing check-ins" stays a staleness heuristic
(`now() - last_session > 10 days`) rather than a fact.

---

## Schema

Three new tables and one enum. Migration 0018.

### `metric` — the registry a form is built from

**[V]** Coachway's metric entity: `{ id, name, unit, type, code, source, unitCategory,
archivedAt }`, with type one of **Number · Text · Image · Rating**, and a
Library/Personal split.

```ts
export const metricType = pgEnum("metric_type", ["number", "text", "image", "rating"]);

export const metrics = pgTable("metric", {
  id: text().primaryKey(),
  /** Null is the shared library; set when a coach adds their own. Same shape as
   *  `exercise.studioId`, so the library/personal split is one concept in this codebase. */
  studioId: text().references(() => studios.id, { onDelete: "cascade" }),

  /** Stable machine key — "weight", "sleep_hours", "mood". Code, not name, is what a
   *  chart or an automation refers to, so renaming the label never breaks a reference. */
  code: text().notNull(),
  name: text().notNull(),
  type: metricType().notNull(),
  /** "kg", "hours", "1-5". Null for text and image. */
  unit: text(),
  /** Groups convertible units so kg/lb are one series, not two. */
  unitCategory: text(),

  /** Retires a metric without deleting the history that references it. */
  archivedAt: timestamp({ withTimezone: true }),
  createdAt, updatedAt,
}, (t) => [
  uniqueIndex("metric_code_key").on(t.code, t.studioId),
  index("metric_studio_idx").on(t.studioId),
]);
```

**Seeded shared metrics** (studioId null): `weight` (number, kg) ·
`photo_front` / `photo_side` / `photo_back` (image) · `energy` (rating 1–5) ·
`sleep_hours` (number, hours) · `soreness` (rating 1–5) · `adherence` (rating 1–5) ·
`notes` (text).

### `check_in` — the scheduled occurrence

```ts
export const checkInStatus = pgEnum("check_in_status", ["upcoming", "completed", "missed"]);

export const checkIns = pgTable("check_in", {
  id: text().primaryKey(),
  clientId: text().notNull().references(() => clients.id, { onDelete: "cascade" }),

  /** The date it is DUE. This column is what makes a completion rate possible. */
  dueOn: date().notNull(),
  status: checkInStatus().notNull().default("upcoming"),
  completedAt: timestamp({ withTimezone: true }),

  createdAt, updatedAt,
}, (t) => [
  /** One check-in per client per due date. Re-running the scheduler is then a no-op
   *  rather than a second row, which is what makes it safe to run on a cron. */
  uniqueIndex("check_in_due_key").on(t.clientId, t.dueOn),
  index("check_in_client_due_idx").on(t.clientId, t.dueOn),
]);
```

**`missed` is computed, never stored by a job.** A row is `upcoming` until submitted;
reads derive `missed` as `status = 'upcoming' and due_on < current_date`. A nightly job
that flips statuses is a job that can fail silently and leave the UI lying. The status
column still exists so `completed` is a fact rather than an inference.

### `check_in_answer` — one metric value per check-in

```ts
export const checkInAnswers = pgTable("check_in_answer", {
  id: text().primaryKey(),
  checkInId: text().notNull().references(() => checkIns.id, { onDelete: "cascade" }),
  metricId: text().notNull().references(() => metrics.id, { onDelete: "restrict" }),

  /** Exactly one is set, enforced by the CHECK below. */
  numberValue: real(),
  textValue: text(),
  ratingValue: integer(),
  imageUrl: text(),

  createdAt,
}, (t) => [
  uniqueIndex("check_in_answer_key").on(t.checkInId, t.metricId),
  check("check_in_answer_one_value", sql`
    (${t.numberValue} is not null)::int + (${t.textValue} is not null)::int +
    (${t.ratingValue} is not null)::int + (${t.imageUrl} is not null)::int = 1`),
  check("check_in_answer_rating_range",
    sql`${t.ratingValue} is null or ${t.ratingValue} between 1 and 5`),
]);
```

**[I]** Coachway stores photos as an `image` **metric type** rather than as attachments.
Copied: a progress photo is then a tracked value with a date, which is what makes the
front/side/back comparison view possible.

### Schedule columns

On `studio` (the cascade default, **[V]** mirroring Coachway's account settings):

```ts
checkInFrequency: integer().notNull().default(1),     // every N periods
checkInPeriod:    text().notNull().default("week"),   // week | month
checkInWeekday:   integer().notNull().default(1),     // 0=Sun … 1=Monday, their default
```

On `client`, all nullable — null means *inherit the studio's value*:

```ts
checkInFrequency, checkInPeriod, checkInWeekday
```

**Weight is written twice, deliberately.** A `weight` answer also appends a row to
`body_metric` with `source = 'check_in'` — that column already exists and is already
documented as the check-in path. `body_metric` stays the single series every chart reads;
`check_in_answer` keeps the submission intact.

---

## Scheduling

Materialise forward, never backfill. On client activation and nightly, ensure a row
exists for every due date from `max(due_on)` up to **4 weeks ahead**.

- A horizon means the grid can show *Upcoming* without inventing anything.
- Idempotent via `check_in_due_key`, so a double-run is a no-op.
- Changing a client's frequency deletes future `upcoming` rows and re-materialises.
  **Never** touches a row that is `completed` or past its due date — history is history.
- A `paused` or `archived` client gets none generated, and existing `upcoming` rows in
  the future are removed on pause.

---

## API

```
GET   /studios/:id/clients/:clientId/check-ins?days=15
POST  /studios/:id/clients/:clientId/check-ins/:checkInId   submit answers
GET   /studios/:id/metrics          POST  /studios/:id/metrics
PATCH /studios/:id/clients/:clientId   += the three schedule fields
```

`GET …/check-ins` returns the shape the overview card needs, matching **[V]** Coachway's:

```jsonc
{
  "checkIns": [{ "date": "2026-10-20", "status": "completed" }],
  "completionRate": 0.8,
  "currentStreak": 3
}
```

- `completionRate` = completed ÷ (completed + missed). **Upcoming is excluded** — a rate
  that counts the future is a rate that starts the week at 0% and climbs, which is
  punitive and wrong.
- `currentStreak` = consecutive completed, walking back from the most recent **due**
  check-in, ignoring upcoming.
- Both behind `requireStudio({ param: "id" })`, scoped by studio in the `where` clause,
  like every other roster query.

---

## UI

### Client overview — the Check-in card

**[V]** Matching the reference: a grid of the last 15 due check-ins, 5 × 3, each cell a
rounded square; **Completed** a success tint with a tick, **Missed** a danger tint,
**Upcoming** a muted clock. Legend underneath, then **Completion rate** and **Current
streak** as two figures.

Empty state: *"No check-ins scheduled yet"* for a client who has never had one — not a
grid of empty boxes, which reads as broken.

### Roster

The `new-checkin` and `missing-checkin` chips stop being staleness heuristics:

```sql
-- new-checkin
exists (select 1 from check_in c where c.client_id = client.id
        and c.status = 'completed' and c.completed_at >= now() - interval '7 days')

-- missing-checkin
exists (select 1 from check_in c where c.client_id = client.id
        and c.status = 'upcoming' and c.due_on < current_date)
```

**This changes what the chips mean** — "missing check-ins" becomes *a check-in was due
and not submitted*, rather than *nobody has logged a session for ten days*. Correct, and
a behaviour change worth noting when it ships.

### Client app

A due check-in surfaces on the home screen with its metrics as a short form. Honours the
per-client `hideWeightInfo`-style flags when those exist; for now, weight is always asked.

---

## Acceptance criteria

1. A client activated on a Wednesday with weekly/Monday scheduling gets their first
   check-in due the following Monday, not immediately.
2. Running the scheduler twice produces no duplicate rows.
3. A check-in past its due date with no submission reads as `missed` without any job
   having run.
4. Completion rate excludes upcoming check-ins.
5. A streak survives an upcoming check-in sitting between completed ones.
6. Submitting a `weight` answer appends to `body_metric` with `source = 'check_in'`, and
   the weight chart shows it.
7. Changing a client's frequency never alters a completed or past check-in.
8. Pausing a client removes future upcoming rows and generates none.
9. Archiving a metric keeps every historical answer readable.
10. A client with no scheduled check-ins sees an empty state, not an empty grid.

## Deliberately not in v1

Form **sections** and per-studio custom check-in forms. **[V]** Coachway composes
check-ins from a versioned `form` with `sections[]`. We ship a fixed metric set first and
add form composition once the metric registry has proven itself — the registry is the
hard part and the part everything else hangs off.

**[U]** Still unknown from the research: whether Coachway's scheduler materialises rows
or computes occurrences on read, and what statuses exist beyond the three in the legend.
Establishing that needs a completed check-in on a live account.
