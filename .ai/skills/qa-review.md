# Skill: QA review

Manual verification. Tests passing is not this.

## Setup
Run it. Real browser, real database, real flows. Use a seeded account with realistic data —
a coach with 30 clients, not one with two.

## The happy path
- [ ] Complete it start to finish as a real user would
- [ ] Correct result, and the UI reflects it without a refresh

## The impatient user
- [ ] Double-tap every submit
- [ ] Hit back mid-flow, then forward
- [ ] Refresh mid-flow
- [ ] Open the same thing in two tabs and act in both
- [ ] Submit an empty form; submit a form with only whitespace

## The disconnected user
- [ ] Go offline mid-action — especially logging a set
- [ ] Come back online; confirm nothing was lost and nothing duplicated
- [ ] Throttle to slow 3G and repeat

## The returning user
- [ ] Abandon a flow, return days later (move the clock)
- [ ] Use an expired link or code
- [ ] Use a consumed link or code twice

## The wrong user
- [ ] Access another coach's client by id
- [ ] Act after a permission was revoked
- [ ] Access a client resource as a different client

## Mobile
- [ ] 360px, real device or accurate emulation
- [ ] One-handed
- [ ] With the keyboard open — does it cover the submit button?

## Data realism
- [ ] Long names, long notes, emoji, Devanagari script
- [ ] Zero items, one item, five hundred items
- [ ] ₹0 and ₹99,999

Anything found that isn't fixed goes in `state/known-issues.md`. Never silently.
