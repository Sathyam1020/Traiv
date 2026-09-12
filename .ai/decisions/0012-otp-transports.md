# 0012 — OTP delivery transports
2026-09-12 · Status: accepted · Extends ADR 0009

## Context

ADR 0009 chose WhatsApp Cloud API direct. Two things changed it: Meta Business
verification is a multi-week compliance process, and the founder wanted SMS as a
switchable primary so signup is not hostage to one channel.

Researched against the Indian market. Facts that shaped the design:

- **DLT registration is mandatory** (TRAI, since 2021) for any transactional SMS to an
  Indian number. Entity → header → template, in that order. Entity registration requires
  GST/PAN and **only Indian-registered entities are eligible.**
- The DLT template text is **frozen once registered**; code cannot compose arbitrary SMS.
- MSG91: ₹0.18–0.25 + GST per OTP. Twilio is several times that in India and adds
  $0.05/verification on Verify. WhatsApp auth is ~₹0.13.

## Decisions

**One `OtpTransport` interface** — `{ name, send(phone, code) }` — with console, MSG91 and
Meta implementations. Channel selection is entirely env-driven:

```
OTP_TRANSPORT=sms       # sms | whatsapp | console
OTP_FALLBACK=none       # sms | whatsapp | none
```

**MSG91 is primary**, WhatsApp demoted to an option. Switching is one line.

**Use MSG91's plain Flow send, not their OTP product.** Their OTP service generates and
verifies codes itself, which would leave two sources of truth for the same code. Ours is
HMAC-hashed in `auth_challenge` with attempt limits and single-use enforcement.

**Inspect the response body, never the status code.** MSG91 answers **HTTP 200 on failure**
and signals the outcome in `type: "success" | "error"`. Verified against their live
endpoint. Status-only checking would report every failed send as delivered.

**HTTPS, though their docs specify `http://`.** The auth key travels in a header.

**Fallback fires only when the primary send throws**, and a transport is never its own
fallback — retrying the channel that just failed is not a fallback. Both covered by tests.

**`auth_challenge` records `transport`, `sent_at` and `send_error`**, and the five-per-hour
rate limit counts only rows where `sent_at` is set. Previously a provider outage spent
attempts the user never received.

**The server tells the client which channel delivered**, and the UI reads it. The code step
said "Sent on WhatsApp" unconditionally, which is wrong the moment anything falls back.

**Production refuses to boot** when the selected transport lacks credentials, or when
`OTP_TRANSPORT=console`. Both verified by running them. Without these it degrades to
printing OTPs into the server log — nobody receives one and signup fails silently, which
is the worst failure mode available.

## Consequences

- Development needs no third-party credentials; console transport carries the full flow.
- `createSender(primary, fallback)` takes its transports as arguments, so fallback
  behaviour is tested with fakes rather than module mocks.
- **SMS cannot go live until DLT clears**, which needs a registered company. Not a code
  dependency. `MSG91_FLOW_ID` has nothing to put in it until the template is approved.
- Suggested template, pending registration:
  `{#var#} is your Traiv verification code. It expires in 5 minutes. Do not share it.`

## Alternatives

**Twilio / AWS SNS** — rejected on India pricing; DLT is required either way.
**MSG91 OTP product** — rejected; two sources of truth for the code.
**Automatic failover with no env switch** — rejected; the founder needs to choose the
primary explicitly, and silent channel-hopping makes delivery problems hard to diagnose.
