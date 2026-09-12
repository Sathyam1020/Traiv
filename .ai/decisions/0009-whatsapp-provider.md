# 0009 — WhatsApp provider: Meta Cloud API direct
2026-09-11 · Status: accepted

## Context
WhatsApp is both the OTP transport (ADR 0005) and the product's delivery layer — workouts,
nudges, check-in prompts, payment reminders. Nothing in auth works without it.

Meta's rate for **authentication** messages in India is ~$0.0025 (₹0.13). BSPs resell the
same Cloud API with a markup of **$0.003–$0.010 per message** — on auth messages that is
2–7× the cost of the message itself, because what BSPs actually sell is a campaign
dashboard, not API access.

## Decision
**Meta Cloud API direct.** No BSP.

Behind a `WhatsAppClient` interface with a `ConsoleWhatsApp` dev implementation, so local
development needs no credentials and auth is buildable before the integration is live.

## Consequences
- Zero platform fee. We pay Meta's per-message rate only.
- Meta hosts the Cloud API — no infrastructure to run.
- We own the WABA outright. No lock-in, and switching to a BSP later is a config change.
- We do our own Meta Business verification, number setup and template approval.
- Support is documentation, not a human. Acceptable for a developer-built integration.
- No broadcast dashboard. We don't need one; if a non-technical need appears later, a BSP
  can be layered on top of the same WABA.

## Lead time — start this now
Meta Business verification requires business documents and takes **days to weeks**. The
OTP **authentication-category template** must be approved before a single OTP can send.
Both block all of auth and neither is code. Begin before the scaffold, not after.

## Fallbacks
If verification stalls or a human is needed to unblock: **360dialog** (direct access layer,
minimal markup, built for teams with developers) or **AiSensy** (Indian SMB-friendly, Pro
plan is pass-through). Either can sit on the same WABA later — this is not a one-way door.

## Alternatives
**Gupshup** — enterprise-grade, bank-oriented; wrong size and priced for it.
**Interakt / Wati / AiSensy on standard plans** — sell a dashboard we won't use, at a
markup that dwarfs the auth message cost.
**Twilio** — the most expensive way to send a WhatsApp message.
