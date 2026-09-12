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
