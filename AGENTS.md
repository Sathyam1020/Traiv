# Traiv — agent entry point

Read this before touching anything. Then read the `.ai/` docs relevant to your task.

Traiv is a white-label coaching platform for independent Indian coaches — personal
trainers, dietitians, nutritionists, yoga instructors, physiotherapists. Coaches pay
us; their clients use the product for free under the coach's branding.

## The one thing that governs every decision

**Our customer is the coach. Our user is their client.**

Coaches buy because of coach-facing features. Coaches *cancel* because their clients
stopped using the app. Weekly-active-clients ÷ total-clients is the metric this whole
product is judged on. When choosing between two implementations, pick the one more
likely to get a client to open the app this week.

## Before you write code

1. **Read the relevant `.ai/` docs.** Start at `.ai/README.md`. Do not skip this
   because the task looks small.
2. **Read `.ai/state/current.md`** to find out what actually exists right now.
3. **Search the repo for an existing implementation** before writing a new one.
   Most things you are about to build already exist in some form.
4. **Check if shadcn/ui already provides the component.** Then check if Traiv already
   wraps it. Only then consider writing one.

## Hard rules

- **Never invent product requirements.** Pricing, features, copy, business rules,
  user flows — if it is not written in `.ai/`, it is not decided. Ask. Do not guess
  and do not "fill in something reasonable".
- **Never add a dependency without following `.ai/engineering/dependencies.md`.**
  Latest version, read the current docs first, justify it in writing. No exceptions.
- **Never invent a colour, font size, spacing value, radius, or duration.** Use tokens.
  If no token fits, that is a design system conversation, not a CSS decision.
- **Never suppress a type error.** No `any`, no `@ts-ignore`, no `!` to silence the
  compiler. If types are fighting you, the model is wrong.
- **Never mark work complete because it compiles.** See "Definition of done" below.
- **Never refactor unrelated code** while implementing something else.
- **Never silently overwrite a recorded decision.** If your work contradicts something
  in `.ai/decisions/` or `.ai/product/`, stop, explain the conflict, and ask.

## Definition of done

A feature is done when all of these are true. Not most.

- [ ] Behaviour matches the spec in `features/<name>/spec.md`
- [ ] Loading, empty, and error states exist and were deliberately designed
- [ ] Works on a 360px viewport, tested at that width — not assumed
- [ ] Keyboard reachable, visible focus states
- [ ] Scenario tests pass (see `.ai/engineering/testing.md` — scenarios, not unit slop)
- [ ] No new dependency added without the dependency process
- [ ] No token invented
- [ ] `.ai/state/current.md` updated
- [ ] Any decision made along the way recorded in `.ai/decisions/`

## Writing style for UI copy

Read `.ai/design/voice.md` before writing any user-facing string. Generic SaaS
vocabulary is a defect here, not a neutral default.

## When you are unsure

Ask. An unanswered question costs a message. A wrong assumption baked into the schema
costs a migration and three weeks.
