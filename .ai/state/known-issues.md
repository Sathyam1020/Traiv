# Known issues

Anything broken, partially implemented, or working-but-wrong. Adding an entry is
mandatory when something is found and not fixed — never leave it undocumented.

## Format

```
### Title
Found: date · Severity: low | medium | high · Area: where
What happens · Why it isn't fixed yet · Workaround
```

## Open

None. No code exists yet.

## Open

### The test suite takes 8.5 minutes, and it is the database's distance
Found 2026-09-13 · Severity: medium · Area: testing

Tests run against Neon in **us-east-2** from India. A single query round trip measures
**~328ms**, so a scenario doing thirty sequential statements legitimately costs ten
seconds. 48 tests take 509s.

Nothing is wrong with the tests — the latency is structural. Teardown has already been
collapsed into one data-modifying CTE, which helped, and the OTP is now returned directly
under the console transport instead of being recovered by brute force.

**The real fix is a local Postgres for tests** (Docker), which would put the suite in the
seconds. Deferred because it adds infrastructure; revisit when the wait starts costing
more than the setup would.

## Risks being carried deliberately

These aren't bugs — they're accepted trade-offs to revisit at the stated trigger.

### No SMS fallback for OTP
Accepted 2026-09-11 · ADR 0005
WhatsApp is the only OTP transport, so a user without WhatsApp cannot sign up. Accepted:
SMS costs ₹0.12–0.25 per message plus DLT registration. **Revisit if signup-failure
telemetry shows real volume.**

### Client app depends on PWA push, which is unreliable on iOS
Accepted 2026-09-11 · ADR 0003
Mitigated by design — WhatsApp is the notification channel, not push.

### Five deploy targets for one developer
Accepted 2026-09-11 · ADR 0003
`endorse` and `admin` are static exports and near-free to run, but it's still five things
to maintain.

### Exercise media licensed, not owned, until month 4
Accepted 2026-09-11 · ADR 0008
EDB Pro is a one-time commercial licence. Own footage replaces it progressively.

### Meta Business verification blocks all of auth, and isn't code
Accepted 2026-09-11 · ADR 0009
Verification takes days to weeks, and the OTP authentication template needs separate
approval. Until both clear, auth only works through the dev bypass and `ConsoleWhatsApp`.
**Start it before the scaffold, not after.**
