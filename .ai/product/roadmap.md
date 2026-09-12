# Roadmap

Phases are gated on evidence, not on time. v3 does not start because v2 shipped;
it starts because v2 retains.

## v1 — weeks 1–10 · "one coach runs one client end to end"

Testing one question: **do clients log workouts?** Not whether coaches like the UI.

Foundations: exercise taxonomy + dedupe · media pipeline · auth · analytics.
Coach: client roster · programme builder · templates + bulk assign · forced
personalisation at assign · client detail · check-in builder · unified inbox
(WhatsApp transport) · packages + payment links · branding.
Client PWA: offline-first set logging · today's workout · rest timer · last session's
numbers on the set row · check-ins, measurements, photos · progress view · install.
Shared: WhatsApp delivery · reliable message delivery · one-click cancel · data export.

**Cut list, in order, if behind:** supersets, progress photos, RPE, measurements,
bulk assign. **Never cut:** offline logging, WhatsApp layer, last-session numbers.

## v2 — months 3–5 · the moat and retention · start charging

Indian food database (home measures, veg/Jain/egg, regional, fasting days) · meal plan
builder · smart substitutions · food log · vegetarian protein solver · client risk board ·
first-72-hours sequence · monthly progress card · re-entry path · habits · inactivity
alerts · UPI AutoPay · GST invoices · vertical modes (dietitian, yoga, physio).

## v3 — months 6–10 · leverage · only if v2 retains

AI (client Q&A in the coach's voice → check-in reply drafts → plan first-drafts) ·
trainer storefront · Studio tier · trainer-uploaded exercise videos · scheduling ·
group classes · form-check video review · affiliate dashboard · Hindi + regional
client app · wearable sync.

## Not building — and the trigger to reconsider

| Excluded | Why | Revisit at |
|---|---|---|
| B2C AI coach (₹499) | Channel conflict — undercuts our own coaches. HealthifyMe's AI-only is already ~₹208 | Above ₹1L MRR, separate brand |
| Marketplace / directory | We'd own the client relationship — same conflict, plus disintermediation | Only with real consumer demand |
| Native App Store apps | PWA removes the download friction that kills client activation | If push failure proves fatal |
| Supplement marketplace | A partnership, not a feature | ~300 paying coaches |
| Business academy | A content business bolted to a software one | ~300 paying coaches |

## AI position (confirmed)

AI is **a part of the product, not its identity**. It lands in v3, pointed at coach
leverage. We do not lead with it. Anyone can wrap an LLM in a weekend; our moats take
months to copy. TBD: whether plan first-draft generation gets pulled into v1 (~1–2 weeks).
