# Build-in-public: the role column

Written 2026-10-06. Covers the auth and multi-tenancy work.

**Angle:** engineering story, context first. No pricing, no product pitch.

**Why this shape:** stat and contrarian hooks outperform; imperative hooks
("Stop doing X") measure near zero. LinkedIn truncates after roughly two lines,
so the first four short lines have to say what the app is before asking anyone
to care about a schema decision. Target length 900–1,300 characters.

---

## LinkedIn

I'm building an app for fitness trainers.

Trainers use it to manage their clients. Clients use it to see their workouts.

Simple. Two kinds of people, two roles. One column in the database to say which one you are.

That's what I built first. Then I deleted it.

Here's why.

Rahul is a trainer. He has 30 clients.

Rahul also pays a dietitian for his own diet.

So Rahul is a trainer. And someone else's client. At the same time.

With a role column he needs two separate accounts. Two logins. Same phone number.

So I removed the column.

Now the users table only stores who you are. Name and phone. Nothing about what you do.

What you ARE comes from where your ID shows up:

→ In a gym's staff list → you're a trainer there
→ In a gym's client list → you're a client there

Same login. Different role in each place.

That one change forced a better design everywhere else. Instead of one permission check asking "are you a trainer or a client", I now have two separate checks, and neither can stand in for the other.

Sounds like more work. It's less. Every "is this person allowed to do this" question has one answer now, in one place.

Three more things from the last two weeks:

→ No passwords at all. Phone number and a code.
→ My tests took 8 minutes. The test database was in Ohio. Moved it to my laptop. Now 2 seconds.
→ 20 people could guess a login code at the same moment and my code counted it as 1 attempt. Fixed by letting the database count instead of my code.

Next: the workout builder.

---

## Twitter / X

**Post**

building an app for fitness trainers.

trainers manage clients. clients see workouts.

two kinds of people, two roles. one column in the db to say which.

built that first. then deleted it.

**Reply 1**

rahul is a trainer with 30 clients.

rahul also pays a dietitian.

he's a trainer AND a client. at the same time.

with a role column he needs two accounts. two logins. same phone number.

**Reply 2**

so the users table now stores only who you are. name, phone.

what you ARE comes from where your id shows up:

staff list of a gym → trainer there
client list of a gym → client there

same login, different role in each place.

**Reply 3**

other things this week:

→ no passwords. phone + code.
→ tests: 8 min → 2 sec (test db was in ohio, moved it local)
→ 20 people could guess an OTP at once and my code counted it as 1 attempt. let the database do the counting.

114 tests.

---

## Before posting

- **No link in the post.** Put it in the first comment instead.
- **Clear the first hour.** Reply to every comment; that window decides reach.
- **"Gym" not "studio."** Nobody outside the codebase knows what a studio means.
- A screen recording of the QR scan would outperform all of this as native video.

## Every claim here is true and defensible

| claim | where it comes from |
|---|---|
| No role column | `packages/db/src/schema/user.ts` — identity only, by design (ADR 0004) |
| A trainer can be another coach's client | `client.userId` is nullable and uniqueness is per studio, exactly for this |
| Two separate permission checks | `requireStudio` and `requireClient`, ADR 0014 |
| No passwords | Phone OTP only; `passwordHash` is never read or written |
| 8 minutes to 2 seconds | 515s against Neon in us-east-2 → 1.8s against local Postgres |
| 20 guesses counted as 1 | Measured: the old read-check-increment left `attempts` at 1 after 20 concurrent requests; it now reaches the cap of 5 |
| 114 tests | `pnpm --filter @traiv/api test` |

If someone asks a follow-up, the answer is in the repo.
