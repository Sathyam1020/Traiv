# 0001 — Product positioning and pricing
2026-09-11 · Status: accepted

## Context
Every credible competitor bills Indian coaches in USD — FitBudd $79, Spur.fit $59,
TrueCoach $58 at 20 clients, Everfit ~$128 all-in. All price per client, so growth is
punished, and most stack paid add-ons for nutrition, automation and payments.

Indian coaches charge clients ₹3,000–8,000/month. An employed gym trainer earns ~₹22,400/month;
an independent coach ₹80,000–1,50,000.

## Decision
₹999/month for unlimited clients as the hero plan, GST-inclusive. Free (2 clients),
Starter ₹499 (8 clients), Studio ₹2,499 (5 seats). Annual = two months free.

Never price per client. No add-ons. No platform fee on coach revenue. No branding setup
fee. One-click cancel. One-click full export.

Planned increase to ₹1,499 then ₹1,999, with early adopters grandfathered permanently
and told so.

## Consequences
- Net revenue is ₹846 per Pro coach after GST; contribution ~₹580–680 after gateway and
  infrastructure. **All unit-economics reasoning uses ₹846, never ₹999.**
- Schema must carry `org_subscription.grandfathered_price_paise`.
- Free and Starter tiers need enforced client limits.
- Support cost per coach must stay very low — a single high-touch customer erases the
  contribution from dozens.

## Alternatives
Flat ₹999 only — rejected: no expansion revenue, and it excludes employed trainers with a
few side clients. Per-client pricing — rejected: it's the loudest complaint against every
competitor and unlimited is our headline.
