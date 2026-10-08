# Decisions

Architecture Decision Records. Anything consequential, with the reasoning attached, so a
future agent understands *why* and doesn't undo it by accident.

## When to write one

- A schema change
- A new dependency, or removing one
- A change to auth, payments, or permissions
- Choosing between two viable technical approaches
- Reversing or amending an earlier decision
- Any product rule confirmed by the human

## Format

```
# NNNN — Title
Date · Status: proposed | accepted | superseded by NNNN

## Context      what was true, what forced a choice
## Decision     what we're doing
## Consequences what this costs, what it rules out, what to watch
## Alternatives what else was considered and why not
```

## Conflicts

If new work contradicts an existing ADR: **stop.** Identify the conflict, explain it, ask
for confirmation, then write a new ADR marking the old one superseded. Never silently
overwrite.

## Index

| # | Title | Status |
|---|---|---|
| 0001 | Product positioning and pricing | accepted |
| 0002 | AI is a feature, not the product's identity | accepted |
| 0003 | Monorepo, single API, five frontends | accepted |
| 0004 | Database schema | accepted |
| 0005 | Authentication architecture | accepted |
| 0006 | Design direction and token architecture | accepted |
| 0007 | Scenario testing over unit testing | accepted |
| 0008 | Exercise media sourcing | accepted |
| 0009 | WhatsApp provider: Meta Cloud API direct | accepted |
| 0010 | Auth implementation decisions | accepted |
| 0011 | Studios and membership | accepted |
| 0012 | OTP delivery transports | accepted |
| 0013 | A full roster puts the client on a waitlist | accepted · deferred |
| 0014 | Client authorization | accepted · not implemented |
| 0015 | cal.com as the visual direction | accepted · supersedes 0006's palette |
| 0016 | Auth hardening after external review | accepted |
| 0017 | Endorsers and referral attribution | accepted · attribution only |
| 0018 | One definition of a phone number | accepted · `@traiv/phone`, all countries |
| 0019 | Client onboarding and the calorie calculator | accepted · `@traiv/nutrition` owns the number |
| 0020 | One app shell, and the client's tabs | accepted · `lg` is the only nav breakpoint |
| 0021 | Our own analytics, launch list and CMS | accepted · cookieless, no third party |
