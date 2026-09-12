# Skill: architecture review

## Layering
- [ ] Route handlers thin — parse, authorize, call a use case, serialize
- [ ] Logic in use cases, not in routes or components
- [ ] Server-only modules not imported into client bundles
- [ ] Domain logic not duplicated between apps

## Abstractions
- [ ] No abstraction with a single caller
- [ ] No premature generic helper or config option
- [ ] Fewer than three repetitions → not abstracted yet
- [ ] No indirection that doesn't earn its cost

## Dependencies
- [ ] Any new package went through `dependencies.md`: justified, latest, **docs read first**
- [ ] Doesn't duplicate an existing dependency
- [ ] Doesn't wrap something the platform already provides

## Data model
- [ ] Schema change has an ADR
- [ ] `org_id` present and scoped
- [ ] Money in paise
- [ ] JSONB only where heterogeneous and unqueried
- [ ] Unique constraints on external ids

## Boundaries
- [ ] Third parties behind an interface with a dev implementation
- [ ] Local dev works with zero third-party credentials
- [ ] Zod validation at every external boundary
- [ ] Env parsed once at boot; process refuses to start if incomplete

## Scope
- [ ] No unrelated refactoring
- [ ] No API changed without reason
- [ ] No recorded decision silently contradicted
