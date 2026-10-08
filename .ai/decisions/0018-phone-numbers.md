# 0018 — One definition of a phone number
2026-10-07 · Status: accepted · Supersedes the inline phone regex in ADR 0010

## Context

The phone number is the only identity in Traiv. There is no email, no username and no
password — if the number is wrong, the account is unreachable forever, and the person has
no second way to prove who they are.

It was validated by `/^[6-9]\d{9}$/`, written out in **nine places**: four sign-in forms,
the route schema, the auth service, the shared field component, a seed script and a
migration. Nine copies of a rule is nine chances for a form to accept what the server
refuses, and the next person to add a form makes a tenth copy.

Every one of those copies also assumed India permanently. The error message said "Indian
mobile numbers start with 6, 7, 8 or 9", which tells a user in Dubai or London nothing
except that we never considered them. Indian coaches with clients abroad are the obvious
first case, and there are about two hundred other sets of numbering rules — none of which
anyone should be hand-writing.

## Decisions

**One module owns the rule: `@traiv/phone`.** The API and all four apps import it, so the
form and the server can never disagree about what is valid. A tenth copy is now a thing
you have to deliberately write instead of the path of least resistance.

**The rules come from libphonenumber, not from us.** Numbering plans change — India added
ranges, the UK moved mobiles, and countries get new prefixes every year. Tracking that is
not a thing this team should be doing; it is a metadata update.

**Mobile metadata, not the smaller set.** `libphonenumber-js/mobile` can tell a mobile
from a landline; `/min` cannot. This costs ~46 KB gzipped and buys the one check that
matters here: a landline cannot receive an SMS or a WhatsApp message, so accepting one
creates an account nobody can ever sign into. The cost lands on `/signin` and `/signup`
only — verified in the build manifest, not assumed — and never on the dashboard.

**The country is a field the user picks, defaulting to India.** India is pinned to the top
of the list because it is the market we sell to; the other 244 are there because the
second user from anywhere else should not have to file a bug. A number that carries its
own country code keeps it, so pasting `+971…` into a field set to India still works —
people paste numbers far more often than they change the dropdown first.

**Everything is stored as E.164.** `+919876543210`, one row per human, whatever they
typed. The seven ways somebody writes their own number — spaces, dashes, brackets, a
leading zero, a `+91`, a bare ten digits — all collapse to the same string before it
reaches the database, which is what makes "is this person already a user?" answerable.

**The error names the user's country, never ours.** `phoneProblemMessage` builds the
message from the selected country and a real example number from that country's metadata.
No message in the system names a specific country's digit rules.

## Consequences

Test numbers had to be renumbered. 80 tests used prefixes `792`–`796`, which are not
allocated Indian mobile ranges — the hand-rolled regex accepted them and real validation
correctly does not. Fake data that only passes a fake check is not test coverage, and this
is the second time this class of thing has surfaced here.

Landlines are now rejected at signup. This is intended, but it will read as a bug to
anybody who tries one, so the message says explicitly that a code is sent by text.

Formatting as people type is deliberately *not* done. It fights the cursor on mobile
keyboards, and the parser accepts whatever punctuation they used anyway.
