# Features

One directory per meaningful feature. The spec is written and confirmed **before**
implementation begins.

```
features/<feature-name>/
  spec.md         problem · user · goal · flow · requirements · permissions · mobile behaviour
  acceptance.md   the criteria, as a checklist
  edge-cases.md   what happens when it goes wrong
  tests.md        the scenarios
```

`tests.md` must cover all five mandatory cases from `.ai/engineering/testing.md`:
**second attempt · two actors · out of order · after expiry · abandoned halfway.**
A spec without them isn't finished.

**Do not begin implementation while a critical product requirement is ambiguous.** Ask.

No features specced yet.
